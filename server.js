const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { getInitialSeedJobs } = require('./src/seedJobs');
const { fetchLiveGupyUberlandiaJobs, pickNextDiscoverableJob } = require('./src/scanner');
const { dispatchEmailAlert } = require('./src/mailer');

const PORT = Number(process.env.PORT) || 3450;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

async function ensureDb() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fsp.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.jobs) || parsed.jobs.length === 0) {
      throw new Error('Empty DB');
    }
    parsed.subscribers = Array.isArray(parsed.subscribers) ? parsed.subscribers : [];
    parsed.emailHistory = Array.isArray(parsed.emailHistory) ? parsed.emailHistory : [];
    parsed.scanCount = Number(parsed.scanCount) || 0;
    parsed.smtpConfig = parsed.smtpConfig || {};
    return parsed;
  } catch (_) {
    const initial = {
      jobs: getInitialSeedJobs(),
      subscribers: [],
      emailHistory: [],
      lastScan: null,
      scanCount: 0,
      smtpConfig: {}
    };
    await saveDb(initial);
    return initial;
  }
}

async function saveDb(db) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function notifySubscribersForNewJobs(db, newJobs) {
  if (!newJobs.length || !db.subscribers.length) return [];
  const sentRecords = [];

  for (const sub of db.subscribers) {
    if (sub.active === false) continue;

    // Filtra de acordo com preferências opcionais do assinante
    const matchingJobs = newJobs.filter((job) => {
      if (sub.minSalary && Number(job.salary) < Number(sub.minSalary)) return false;
      if (Array.isArray(sub.sectors) && sub.sectors.length > 0 && !sub.sectors.includes(job.sector)) return false;
      return true;
    });

    if (matchingJobs.length === 0) continue;

    const record = await dispatchEmailAlert({
      subscriber: sub,
      jobs: matchingJobs,
      smtpConfig: db.smtpConfig
    });
    sentRecords.push(record);
    db.emailHistory.unshift(record);
  }

  // Mantém os últimos 50 disparos no histórico
  db.emailHistory = db.emailHistory.slice(0, 50);
  return sentRecords;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // 1. GET /api/state -> Estado completo atual
    if (req.method === 'GET' && pathname === '/api/state') {
      const db = await ensureDb();
      return sendJson(res, 200, {
        jobs: db.jobs,
        subscribers: db.subscribers,
        emailHistory: db.emailHistory,
        lastScan: db.lastScan,
        scanCount: db.scanCount,
        smtpConfigured: Boolean(
          db.smtpConfig?.resendApiKey ||
            process.env.RESEND_API_KEY ||
            (db.smtpConfig?.smtpHost && db.smtpConfig?.smtpUser)
        )
      });
    }

    // 2. POST /api/scan -> Executa verificação automática ao abrir o site ou sob demanda
    if (req.method === 'POST' && pathname === '/api/scan') {
      const body = await readJsonBody(req);
      const db = await ensureDb();
      const existingIds = new Set(db.jobs.map((j) => j.id));
      const newlyDiscovered = [];

      // Varredura em tempo real na API pública Gupy para Uberlândia-MG
      const liveScan = await fetchLiveGupyUberlandiaJobs();
      for (const liveJob of liveScan.jobs) {
        if (!existingIds.has(liveJob.id)) {
          existingIds.add(liveJob.id);
          newlyDiscovered.push(liveJob);
          db.jobs.unshift(liveJob);
        }
      }

      // Simulação sob demanda de nova vaga surgindo em Uberlândia (para validação de tag "Novidade!" + e-mail)
      if (body && body.simulateNew) {
        const simulatedJob = pickNextDiscoverableJob(existingIds);
        existingIds.add(simulatedJob.id);
        newlyDiscovered.push(simulatedJob);
        db.jobs.unshift(simulatedJob);
      }

      const notificationsSent = await notifySubscribersForNewJobs(db, newlyDiscovered);

      db.scanCount = (db.scanCount || 0) + 1;
      db.lastScan = {
        timestamp: new Date().toISOString(),
        onlineReachable: liveScan.onlineReachable,
        newlyFoundCount: newlyDiscovered.length,
        totalActive: db.jobs.length,
        unseenCount: db.jobs.filter((j) => j.isNew).length,
        sourcesChecked: [
          'Distrito Industrial Uberlândia (Base Direta)',
          'Gupy Portal API — Uberlândia/MG',
          'Portais Corporativos (Cargill, Syngenta, Start Química, Ambev, BRF)'
        ]
      };

      await saveDb(db);

      return sendJson(res, 200, {
        scan: db.lastScan,
        newlyDiscovered,
        notificationsSent,
        jobs: db.jobs,
        emailHistory: db.emailHistory
      });
    }

    // 3. POST /api/jobs/:id/seen -> Remove a tag "Novidade!" assim que os detalhes são visualizados
    if (req.method === 'POST' && /^\/api\/jobs\/[^/]+\/seen$/.test(pathname)) {
      const id = decodeURIComponent(pathname.split('/')[3]);
      const db = await ensureDb();
      const target = db.jobs.find((j) => j.id === id);
      if (!target) {
        return sendJson(res, 404, { error: 'Vaga não encontrada' });
      }
      const wasNew = Boolean(target.isNew);
      target.isNew = false;
      target.seenAt = new Date().toISOString();
      await saveDb(db);
      return sendJson(res, 200, { ok: true, id, wasNew, unseenCount: db.jobs.filter((j) => j.isNew).length });
    }

    // 4. POST /api/subscribers -> Cadastra ou atualiza e-mail para alertas automáticos de novas vagas
    if (req.method === 'POST' && pathname === '/api/subscribers') {
      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendJson(res, 400, { error: 'Informe um endereço de e-mail válido.' });
      }

      const db = await ensureDb();

      // Atualiza config opcional de envio externo se preenchida
      if (body.smtpConfig && typeof body.smtpConfig === 'object') {
        db.smtpConfig = {
          ...db.smtpConfig,
          ...body.smtpConfig
        };
      }

      const subscriberData = {
        email,
        name: String(body.name || '').trim() || 'Estudante Eng. Química',
        minSalary: Number(body.minSalary) || 0,
        sectors: Array.isArray(body.sectors) ? body.sectors : [],
        active: true,
        registeredAt: new Date().toISOString()
      };

      const existingIdx = db.subscribers.findIndex((s) => s.email === email);
      const isUpdate = existingIdx >= 0;
      if (isUpdate) {
        db.subscribers[existingIdx] = { ...db.subscribers[existingIdx], ...subscriberData };
      } else {
        db.subscribers.unshift(subscriberData);
      }

      // Envia um resumo de boas-vindas com as vagas marcadas como Novidade (ou a vaga mais recente)
      let welcomeNotification = null;
      if (body.sendWelcomeDigest !== false) {
        const highlightJobs = db.jobs.filter((j) => j.isNew).slice(0, 2);
        const sampleJobs = highlightJobs.length > 0 ? highlightJobs : db.jobs.slice(0, 1);
        if (sampleJobs.length > 0) {
          welcomeNotification = await dispatchEmailAlert({
            subscriber: subscriberData,
            jobs: sampleJobs,
            smtpConfig: db.smtpConfig
          });
          welcomeNotification.subject = `[Confirmação de Alerta Ativo] Radar Eng. Química Uberlândia (${sampleJobs.length} vaga(s) em destaque)`;
          db.emailHistory.unshift(welcomeNotification);
          db.emailHistory = db.emailHistory.slice(0, 50);
        }
      }

      await saveDb(db);
      return sendJson(res, 200, {
        ok: true,
        isUpdate,
        subscriber: subscriberData,
        subscribers: db.subscribers,
        welcomeNotification,
        emailHistory: db.emailHistory
      });
    }

    // 5. DELETE /api/subscribers -> Remove e-mail cadastrado
    if (req.method === 'DELETE' && pathname === '/api/subscribers') {
      const email = String(parsedUrl.searchParams.get('email') || '').trim().toLowerCase();
      const db = await ensureDb();
      db.subscribers = db.subscribers.filter((s) => s.email !== email);
      await saveDb(db);
      return sendJson(res, 200, { ok: true, subscribers: db.subscribers });
    }

    // 6. Arquivos estáticos de /public
    let safeRelPath = pathname === '/' ? '/index.html' : pathname;
    safeRelPath = path.normalize(safeRelPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safeRelPath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    const stat = await fsp.stat(filePath).catch(() => null);
    if (!stat || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Recurso não encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('[Server Error]', err);
    sendJson(res, 500, { error: err.message || 'Erro interno no servidor' });
  }
});

server.listen(PORT, () => {
  console.log(`\n==================================================================`);
  console.log(`  ESTAGIO.ON // RADAR ENGENHARIA QUIMICA - UBERLANDIA, MG`);
  console.log(`  Servidor Blueprint ativo em: http://localhost:${PORT}`);
  console.log(`==================================================================\n`);
});
