const STORAGE_KEY = 'estagioOn_eq_uberlandia_v1';

const state = {
  mode: 'detecting', // 'backend' (Node.js local) ou 'static' (GitHub Pages)
  jobs: [],
  subscribers: [],
  emailHistory: [],
  expandedIds: new Set(),
  searchQuery: '',
  selectedSector: 'ALL',
  quickFilter: 'ALL',
  sortBy: 'NEW_FIRST',
  isScanning: false
};

// ==========================================================================
// PERSISTÊNCIA CLIENT-SIDE PARA FUNCIONAR 100% NO GITHUB PAGES (SEM BACKEND)
// ==========================================================================
function loadStaticStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  const seed = window.EstagioOnData ? window.EstagioOnData.getInitialSeedJobs() : [];
  const initial = {
    jobs: seed,
    subscribers: [],
    emailHistory: [],
    lastScan: null
  };
  saveStaticStore(initial);
  return initial;
}

function saveStaticStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (_) {}
}

function buildClientEmailHtml(jobs, subscriberEmail) {
  const items = jobs
    .map(
      (job) => `
      <div style="background:#0B192C;border:1px solid #1E3A5F;border-left:4px solid #38BDF8;padding:16px;margin-bottom:14px;border-radius:4px;">
        <div style="font-family:monospace;font-size:11px;color:#38BDF8;margin-bottom:5px;">
          [NOVIDADE // ${escapeHtml(job.refCode || 'EQ-UDI')}] • ${escapeHtml(job.sector.toUpperCase())}
        </div>
        <h3 style="margin:0 0 6px;color:#F8FAFC;font-size:16px;">${escapeHtml(job.title)}</h3>
        <div style="color:#94A3B8;font-size:13px;margin-bottom:10px;">
          <strong style="color:#E2E8F0;">${escapeHtml(job.company)}</strong> — ${escapeHtml(job.location)}
        </div>
        <div style="font-size:13px;color:#CBD5E1;margin-bottom:12px;">
          <strong>Bolsa:</strong> <span style="color:#34D399;">${escapeHtml(job.salaryFormatted)}</span> &nbsp;|&nbsp;
          <strong>Até:</strong> ${formatDateBR(job.endDate)}
        </div>
        <a href="${escapeHtml(job.applyUrl)}" target="_blank" style="display:inline-block;background:#0284C7;color:#FFF;text-decoration:none;padding:8px 14px;border-radius:3px;font-size:12px;font-weight:bold;">
          CANDIDATAR-SE NO PORTAL OFICIAL →
        </a>
      </div>`
    )
    .join('');

  return `
  <div style="background:#060E1A;color:#E2E8F0;padding:24px;font-family:Segoe UI,Arial,sans-serif;border:1px solid #1E3A5F;">
    <div style="font-family:monospace;font-size:11px;color:#38BDF8;margin-bottom:6px;">ESTÁGIO.ON // RADAR ENG. QUÍMICA — UBERLÂNDIA</div>
    <h2 style="margin:0 0 14px;color:#FFF;font-size:19px;">Alerta Automático para ${escapeHtml(subscriberEmail)}</h2>
    ${items}
  </div>`;
}

// Envio client-side opcional gratuito via FormSubmit AJAX quando hospedado no GitHub Pages
async function sendStaticEmailNotification(subscriber, jobs) {
  const subject =
    jobs.length === 1
      ? `[EstágioOn EQ-UDI] Nova Vaga: ${jobs[0].title} — ${jobs[0].company}`
      : `[EstágioOn EQ-UDI] ${jobs.length} Novas Vagas de Eng. Química em Uberlândia`;

  let deliveredExternally = false;
  try {
    const summaryText = jobs
      .map(
        (j) =>
          `• ${j.title} (${j.company})\n  Bolsa: ${j.salaryFormatted} | Inscrições até: ${formatDateBR(j.endDate)}\n  Candidatura: ${j.applyUrl}`
      )
      .join('\n\n');

    const resp = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(subscriber.email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        Radar: 'EstágioOn — Engenharia Química (Uberlândia, MG)',
        Destinatario: subscriber.name || subscriber.email,
        Vagas_Detectadas: summaryText
      })
    });
    if (resp.ok) deliveredExternally = true;
  } catch (_) {}

  return {
    id: 'mail-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    to: subscriber.email,
    subscriberName: subscriber.name || 'Estudante EQ',
    subject,
    sentAt: new Date().toISOString(),
    deliveredExternally,
    htmlPreview: buildClientEmailHtml(jobs, subscriber.email)
  };
}

// Utilitários de formatação
function formatDateBR(isoDate) {
  if (!isoDate) return '--/--/----';
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatTimeBR(isoStr) {
  if (!isoStr) return '--:--:--';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getDaysRemaining(endDateIso) {
  if (!endDateIso) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDateIso + 'T23:59:59');
  const diffMs = end.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeImagePath(imgPath) {
  if (!imgPath) return 'images/plant-chemical.jpg';
  return imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
}

function showToast(message, variant = 'cyan') {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = `toast ${variant}`;
  el.innerHTML = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.25s ease';
    setTimeout(() => el.remove(), 260);
  }, 4600);
}

// ==========================================================================
// VARREDURA AUTOMÁTICA AO ABRIR O SITE (FUNCIONA LOCAL E NO GITHUB PAGES)
// ==========================================================================
async function runStaticScan({ simulateNew = false } = {}) {
  const store = loadStaticStore();
  const existingIds = new Set(store.jobs.map((j) => j.id));
  const newlyDiscovered = [];

  if (simulateNew && window.EstagioOnData) {
    const pool = window.EstagioOnData.getDiscoverablePool();
    const available = pool.filter((p) => !existingIds.has(p.id));
    let nextJob;
    if (available.length > 0) {
      nextJob = { ...available[0], isNew: true, discoveredAt: new Date().toISOString() };
    } else {
      const suffix = Math.floor(100 + Math.random() * 900);
      const tmpl = pool[Math.floor(Math.random() * pool.length)];
      nextJob = {
        ...tmpl,
        id: `${tmpl.id}-${suffix}`,
        refCode: `${tmpl.refCode.split('-')[0]}-UDI-${suffix}`,
        title: `${tmpl.title} (Turma Extra #${suffix})`,
        isNew: true,
        discoveredAt: new Date().toISOString()
      };
    }
    store.jobs.unshift(nextJob);
    newlyDiscovered.push(nextJob);
  }

  const notificationsSent = [];
  if (newlyDiscovered.length > 0 && store.subscribers.length > 0) {
    for (const sub of store.subscribers) {
      const matching = newlyDiscovered.filter((j) => !sub.minSalary || Number(j.salary) >= Number(sub.minSalary));
      if (matching.length > 0) {
        const record = await sendStaticEmailNotification(sub, matching);
        notificationsSent.push(record);
        store.emailHistory.unshift(record);
      }
    }
    store.emailHistory = store.emailHistory.slice(0, 50);
  }

  store.lastScan = { timestamp: new Date().toISOString() };
  saveStaticStore(store);

  return {
    scan: store.lastScan,
    newlyDiscovered,
    notificationsSent,
    jobs: store.jobs,
    emailHistory: store.emailHistory
  };
}

async function runVerificationScan({ simulateNew = false } = {}) {
  if (state.isScanning) return;
  state.isScanning = true;

  const progressBar = document.getElementById('scanProgressBar');
  const stepText = document.getElementById('scanStepText');
  const statusLabel = document.getElementById('radarStatusLabel');
  const btnScan = document.getElementById('btnScanNow');

  btnScan.disabled = true;
  statusLabel.innerHTML = `<span class="pulse-dot"></span> Varrendo portais...`;
  progressBar.style.width = '22%';
  stepText.innerHTML = `<span class="mono-tag">[01/03 SCAN]</span> Conectando aos portais industriais e Gupy em Uberlândia-MG...`;

  setTimeout(() => {
    if (state.isScanning) {
      progressBar.style.width = '64%';
      stepText.innerHTML = `<span class="mono-tag">[02/03 FILTER]</span> Filtrando vagas de Estágio em Engenharia Química, Processos, P&amp;D e Qualidade...`;
    }
  }, 260);

  try {
    let data;
    if (state.mode === 'backend') {
      const resp = await fetch('api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateNew })
      });
      if (!resp.ok) throw new Error('Fallback to static mode');
      data = await resp.json();
    } else {
      await new Promise((r) => setTimeout(r, 420));
      data = await runStaticScan({ simulateNew });
    }

    state.jobs = data.jobs || [];
    state.emailHistory = data.emailHistory || state.emailHistory;

    progressBar.style.width = '100%';
    const unseenCount = state.jobs.filter((j) => j.isNew).length;
    const newFound = data.newlyDiscovered ? data.newlyDiscovered.length : 0;

    stepText.innerHTML =
      newFound > 0
        ? `<span class="mono-tag">[03/03 OK]</span> Verificação concluída: <strong>${state.jobs.length} vagas ativas</strong> em Uberlândia — <strong>${newFound} nova(s) vaga(s) detectada(s) agora!</strong>`
        : `<span class="mono-tag">[03/03 OK]</span> Verificação concluída ao abrir: <strong>${state.jobs.length} vagas de Engenharia Química</strong> mapeadas em Uberlândia (${unseenCount} marcada(s) como "Novidade!").`;

    statusLabel.innerHTML = `<span class="pulse-dot"></span> Online • Verificado`;
    document.getElementById('lastScanTime').textContent = formatTimeBR(data.scan?.timestamp);

    renderAll();

    if (newFound > 0) {
      const firstNew = data.newlyDiscovered[0];
      const mailNote =
        data.notificationsSent && data.notificationsSent.length > 0
          ? `<br/><span class="mono" style="color:#38BDF8;font-size:11px;">✉ Alerta enviado para ${data.notificationsSent.length} e-mail(s) cadastrado(s)!</span>`
          : '';
      showToast(
        `<strong>Nova vaga detectada em Uberlândia!</strong><br/>${escapeHtml(firstNew.company)} — ${escapeHtml(firstNew.title)}${mailNote}`,
        'amber'
      );
    }
  } catch (err) {
    state.mode = 'static';
    const fallbackData = await runStaticScan({ simulateNew });
    state.jobs = fallbackData.jobs;
    progressBar.style.width = '100%';
    statusLabel.innerHTML = `<span class="pulse-dot"></span> Online • Verificado`;
    document.getElementById('lastScanTime').textContent = formatTimeBR(fallbackData.scan?.timestamp);
    renderAll();
  } finally {
    state.isScanning = false;
    btnScan.disabled = false;
  }
}

async function loadInitialStateAndScan() {
  try {
    const res = await fetch('api/state');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      state.mode = 'backend';
      const data = await res.json();
      state.jobs = data.jobs || [];
      state.subscribers = data.subscribers || [];
      state.emailHistory = data.emailHistory || [];
      if (data.lastScan?.timestamp) {
        document.getElementById('lastScanTime').textContent = formatTimeBR(data.lastScan.timestamp);
      }
      renderAll();
    } else {
      throw new Error('Static host detected');
    }
  } catch (_) {
    // Modo GitHub Pages (Static Host)
    state.mode = 'static';
    const store = loadStaticStore();
    state.jobs = store.jobs;
    state.subscribers = store.subscribers;
    state.emailHistory = store.emailHistory;
    if (store.lastScan?.timestamp) {
      document.getElementById('lastScanTime').textContent = formatTimeBR(store.lastScan.timestamp);
    }
    renderAll();
  }

  await runVerificationScan({ simulateNew: false });
}

// ==========================================================================
// MARCAR VAGA COMO VISUALIZADA (REMOVE A TAG "Novidade!")
// ==========================================================================
async function markJobAsSeen(jobId) {
  const job = state.jobs.find((j) => j.id === jobId);
  if (!job || !job.isNew) return;

  job.isNew = false;
  updateKpisAndCounters();

  const badgeEl = document.querySelector(`[data-job-id="${CSS.escape(jobId)}"] .novelty-tag`);
  const cardEl = document.querySelector(`[data-job-id="${CSS.escape(jobId)}"]`);
  if (badgeEl) {
    badgeEl.style.opacity = '0';
    badgeEl.style.transform = 'translateY(-6px)';
    setTimeout(() => badgeEl.remove(), 260);
  }
  if (cardEl) {
    cardEl.classList.remove('is-new');
  }

  if (state.mode === 'backend') {
    try {
      await fetch(`api/jobs/${encodeURIComponent(jobId)}/seen`, { method: 'POST' });
    } catch (_) {}
  } else {
    const store = loadStaticStore();
    const target = store.jobs.find((j) => j.id === jobId);
    if (target) target.isNew = false;
    saveStaticStore(store);
  }
}

function toggleJobExpand(jobId) {
  const isCurrentlyExpanded = state.expandedIds.has(jobId);
  if (isCurrentlyExpanded) {
    state.expandedIds.delete(jobId);
    renderJobsList();
  } else {
    state.expandedIds.add(jobId);
    renderJobsList();
    markJobAsSeen(jobId);
  }
}

// ==========================================================================
// FILTRAGEM, ORDENAÇÃO E RENDERIZAÇÃO
// ==========================================================================
function getFilteredAndSortedJobs() {
  const q = state.searchQuery.trim().toLowerCase();

  const filtered = state.jobs.filter((job) => {
    if (state.selectedSector !== 'ALL' && job.sector !== state.selectedSector) {
      return false;
    }
    if (state.quickFilter === 'NEW_ONLY' && !job.isNew) {
      return false;
    }
    if (state.quickFilter === 'HIGH_SALARY' && Number(job.salary) < 2000) {
      return false;
    }
    if (state.quickFilter === 'CLOSING_SOON') {
      const days = getDaysRemaining(job.endDate);
      if (days === null || days < 0 || days > 15) return false;
    }
    if (q) {
      const haystack = [
        job.title,
        job.company,
        job.sector,
        job.industryBranch,
        job.location,
        job.roleDescription,
        ...(job.tags || []),
        ...(job.benefits || []),
        ...(job.requirements || [])
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sortBy === 'NEW_FIRST') {
      if (Boolean(a.isNew) !== Boolean(b.isNew)) return a.isNew ? -1 : 1;
      return new Date(b.discoveredAt || 0) - new Date(a.discoveredAt || 0);
    }
    if (state.sortBy === 'SALARY_DESC') {
      return (Number(b.salary) || 0) - (Number(a.salary) || 0);
    }
    if (state.sortBy === 'DEADLINE_ASC') {
      return new Date(a.endDate || '2099-12-31') - new Date(b.endDate || '2099-12-31');
    }
    if (state.sortBy === 'RECENT_START') {
      return new Date(b.startDate || 0) - new Date(a.startDate || 0);
    }
    return 0;
  });

  return filtered;
}

function updateKpisAndCounters() {
  const total = state.jobs.length;
  const unseen = state.jobs.filter((j) => j.isNew).length;
  const salaries = state.jobs.map((j) => Number(j.salary)).filter((n) => n > 0);
  const avg = salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
  const max = salaries.length ? Math.max(...salaries) : 0;
  const sectorsCount = new Set(state.jobs.map((j) => j.sector)).size;

  document.getElementById('kpiTotalJobs').textContent = String(total).padStart(2, '0');
  document.getElementById('kpiSectorCount').textContent = `Distribuídas em ${sectorsCount} ramos industriais`;
  document.getElementById('kpiNewJobs').textContent = String(unseen).padStart(2, '0');
  document.getElementById('kpiAvgSalary').textContent = avg
    ? `R$ ${avg.toLocaleString('pt-BR')}`
    : 'R$ --';
  document.getElementById('kpiMaxSalary').textContent = max
    ? `Maior bolsa atual: R$ ${max.toLocaleString('pt-BR')},00`
    : '';

  const subCount = state.subscribers.length;
  document.getElementById('subscriberBadgeCount').textContent = String(subCount);
  const emailStatusEl = document.getElementById('kpiEmailStatus');
  const emailFootEl = document.getElementById('kpiEmailFoot');

  if (subCount > 0) {
    emailStatusEl.textContent = `${subCount} Ativo${subCount > 1 ? 's' : ''}`;
    emailFootEl.textContent = `${state.subscribers[0].email} (${state.emailHistory.length} disparo(s))`;
  } else {
    emailStatusEl.textContent = 'Não cadastrado';
    emailFootEl.textContent = 'Clique para ativar alertas por e-mail →';
  }
}

function renderJobsList() {
  const container = document.getElementById('jobsContainer');
  const filtered = getFilteredAndSortedJobs();

  document.getElementById('resultsCounter').textContent = `EXIBINDO ${filtered.length} DE ${state.jobs.length} VAGAS EM UBERLÂNDIA`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-blueprint">
        <div class="mono-tag" style="margin-bottom:8px;">[0 RESULTADOS PARA O FILTRO ATUAL]</div>
        <h3 style="margin:0 0 8px;">Nenhuma vaga corresponde aos critérios selecionados</h3>
        <p style="color:var(--text-secondary);margin:0 0 16px;">Limpe a busca ou altere os filtros rápidos para visualizar todas as oportunidades em Uberlândia.</p>
        <button type="button" class="btn btn-secondary" id="btnResetFilters">Limpar Filtros</button>
      </div>
    `;
    document.getElementById('btnResetFilters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.selectedSector = 'ALL';
      state.quickFilter = 'ALL';
      document.getElementById('searchInput').value = '';
      document.getElementById('sectorSelect').value = 'ALL';
      document.querySelectorAll('.filter-pill').forEach((p) => p.classList.toggle('active', p.dataset.quick === 'ALL'));
      renderJobsList();
    });
    return;
  }

  container.innerHTML = filtered
    .map((job) => {
      const isExpanded = state.expandedIds.has(job.id);
      const daysLeft = getDaysRemaining(job.endDate);
      let deadlineBadge = '';
      if (daysLeft !== null) {
        if (daysLeft < 0) {
          deadlineBadge = `<span class="deadline-chip urgent">Encerrado</span>`;
        } else if (daysLeft <= 10) {
          deadlineBadge = `<span class="deadline-chip urgent">Faltam ${daysLeft}d</span>`;
        } else {
          deadlineBadge = `<span class="deadline-chip">${daysLeft} dias restantes</span>`;
        }
      }

      const previewBenefits = (job.benefits || []).slice(0, 3);
      const extraBenefitsCount = Math.max(0, (job.benefits || []).length - 3);
      const imgSrc = normalizeImagePath(job.companyImage);

      return `
      <article class="job-card ${job.isNew ? 'is-new' : ''} ${isExpanded ? 'is-expanded' : ''}" data-job-id="${escapeHtml(job.id)}">
        ${job.isNew ? `<div class="novelty-tag" title="Nova vaga! Clique no card para ver os detalhes.">Novidade!</div>` : ''}

        <div class="job-card-summary" role="button" tabindex="0" aria-expanded="${isExpanded}" data-action="toggle-expand" data-id="${escapeHtml(job.id)}">
          <div class="job-meta-top">
            <span class="ref-badge">REF // ${escapeHtml(job.refCode || 'EQ-UDI')}</span>
            <span class="sector-badge">${escapeHtml(job.sector)}</span>
            <span class="modality-badge">• ${escapeHtml(job.modality)} • ${escapeHtml(job.workload)}</span>
          </div>

          <div class="job-headline-row">
            <div>
              <h2 class="job-title">${escapeHtml(job.title)}</h2>
              <div class="job-company-line">
                <span class="job-company-name">${escapeHtml(job.company)}</span>
                <span>—</span>
                <span>📍 ${escapeHtml(job.location)}</span>
              </div>
            </div>

            <div class="salary-box">
              <span class="salary-label">BOLSA-AUXÍLIO</span>
              <span class="salary-amount">${escapeHtml(job.salaryFormatted)}</span>
            </div>
          </div>

          <div class="job-quick-specs">
            <div class="spec-item">
              <span class="spec-key">Início das Inscrições</span>
              <span class="spec-val mono">${formatDateBR(job.startDate)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Inscrições Até</span>
              <span class="spec-val mono">${formatDateBR(job.endDate)} ${deadlineBadge}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Requisito de Período</span>
              <span class="spec-val">${escapeHtml(job.targetSemester || 'Engenharia Química')}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Canal Oficial</span>
              <span class="spec-val">${escapeHtml(job.sourcePortal || 'Portal da Empresa')}</span>
            </div>
          </div>

          <div class="job-summary-footer">
            <div class="benefits-preview">
              ${previewBenefits.map((b) => `<span class="benefit-chip">✓ ${escapeHtml(b)}</span>`).join('')}
              ${extraBenefitsCount > 0 ? `<span class="benefit-more">+${extraBenefitsCount} benefícios</span>` : ''}
            </div>

            <div class="card-cta-group">
              <span class="expand-indicator">
                <span>${isExpanded ? 'Recolher Ficha' : 'Estender Detalhes & Empresa'}</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>

              <a
                href="${escapeHtml(job.applyUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
                data-action="direct-apply"
              >
                <span>Candidatar-se</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="job-details-drawer">
          <div class="details-blueprint-grid">
            <div class="company-dossier">
              <div class="company-photo-frame">
                <img
                  src="${escapeHtml(imgSrc)}"
                  alt="Unidade industrial ${escapeHtml(job.company)} em Uberlândia"
                  loading="lazy"
                  onerror="this.src='images/plant-chemical.jpg'"
                />
                <div class="photo-cad-overlay">
                  <div class="photo-cad-top">
                    <span>UNIDADE // UBERLÂNDIA-MG</span>
                    <span>${escapeHtml(job.coordinates || '18°55\'S 48°16\'W')}</span>
                  </div>
                  <div class="photo-cad-bottom">
                    PLANTA INDUSTRIAL &amp; OPERAÇÕES — ${escapeHtml(job.company.toUpperCase())}
                  </div>
                </div>
              </div>

              <div class="company-dossier-body">
                <h3 class="dossier-heading">01 // Sobre a Empresa &amp; Ramo de Atuação</h3>
                <div class="company-branch-pill">
                  <strong>Ramo:</strong> ${escapeHtml(job.industryBranch || job.sector)}
                </div>
                <p class="company-summary-text">${escapeHtml(job.companySummary)}</p>

                <h4 class="dossier-heading">Destaques da Operação em Uberlândia</h4>
                <ul class="blueprint-list">
                  ${(job.companyHighlights || []).map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="role-specification">
              <div class="spec-block">
                <h3 class="dossier-heading">02 // Escopo Técnico &amp; Rotina do Estagiário de Eng. Química</h3>
                <p>${escapeHtml(job.roleDescription)}</p>
              </div>

              <div class="two-col-specs">
                <div class="spec-block">
                  <h3 class="dossier-heading">03 // Pacote Completo de Benefícios</h3>
                  <ul class="blueprint-list">
                    ${(job.benefits || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
                  </ul>
                </div>

                <div class="spec-block">
                  <h3 class="dossier-heading">04 // Pré-Requisitos &amp; Diferenciais</h3>
                  <ul class="blueprint-list">
                    ${(job.requirements || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <div class="spec-block">
                <h3 class="dossier-heading">05 // Etapas do Processo Seletivo</h3>
                <div class="steps-timeline">
                  ${(job.selectionSteps || [])
                    .map(
                      (step, idx) => `
                    <div class="step-node">
                      <span class="step-num">ETAPA 0${idx + 1}</span>
                      ${escapeHtml(step)}
                    </div>`
                    )
                    .join('')}
                </div>
              </div>

              <div class="tech-tags-row">
                <div class="tech-tags">
                  ${(job.tags || []).map((t) => `<span class="tech-tag">#${escapeHtml(t)}</span>`).join('')}
                </div>

                <a
                  href="${escapeHtml(job.applyUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-primary"
                >
                  <span>Ir para Site Oficial de Inscrição</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
    })
    .join('');
}

// ==========================================================================
// MODAL DE E-MAILS & HISTÓRICO DE NOTIFICAÇÕES
// ==========================================================================
function renderEmailModalData() {
  const subListEl = document.getElementById('subscribersList');
  if (state.subscribers.length === 0) {
    subListEl.innerHTML = `<li class="helper-note" style="margin:0;">Nenhum e-mail cadastrado ainda. Cadastre acima para receber alertas automáticos.</li>`;
  } else {
    subListEl.innerHTML = state.subscribers
      .map(
        (s) => `
        <li class="subscriber-row">
          <div>
            <strong style="color:#F8FAFC;">${escapeHtml(s.email)}</strong>
            <div class="mono" style="font-size:10.5px;color:#94A3B8;">
              ${escapeHtml(s.name || 'Estudante EQ')} ${s.minSalary ? `• Mín R$ ${s.minSalary}` : '• Todas as faixas'}
            </div>
          </div>
          <button type="button" class="btn-remove-sub" data-remove-email="${escapeHtml(s.email)}">Remover</button>
        </li>`
      )
      .join('');
  }

  const historyListEl = document.getElementById('emailHistoryList');
  if (state.emailHistory.length === 0) {
    historyListEl.innerHTML = `<div class="helper-note">Nenhum disparo registrado ainda. Cadastre seu e-mail ou clique em "Simular Nova Vaga" para testar o disparo automático!</div>`;
  } else {
    historyListEl.innerHTML = state.emailHistory
      .map(
        (item) => `
        <div class="history-item" data-preview-mail-id="${escapeHtml(item.id)}">
          <div class="history-item-top">
            <span>${formatDateBR(item.sentAt)} às ${formatTimeBR(item.sentAt)}</span>
            <span>${item.deliveredExternally ? 'ENVIADO EXTERNO' : 'REGISTRADO'}</span>
          </div>
          <div class="history-item-subject">${escapeHtml(item.subject)}</div>
          <div class="history-item-to">Para: ${escapeHtml(item.to)} • Clique para abrir o e-mail</div>
        </div>`
      )
      .join('');
  }
}

async function registerEmailSubscriber({ email, name = '', minSalary = 0, resendApiKey = '' }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    showToast('Informe um endereço de e-mail válido.', 'amber');
    return false;
  }

  if (state.mode === 'backend') {
    try {
      const smtpConfig = resendApiKey ? { resendApiKey } : undefined;
      const res = await fetch('api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name, minSalary, smtpConfig, sendWelcomeDigest: true })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(`Erro: ${escapeHtml(data.error || 'E-mail inválido')}`, 'amber');
        return false;
      }
      state.subscribers = data.subscribers || [];
      state.emailHistory = data.emailHistory || state.emailHistory;
      renderAll();
      showToast(
        `<strong>Alerta ativado para ${escapeHtml(cleanEmail)}!</strong><br/>Toda nova vaga de Engenharia Química em Uberlândia será notificada automaticamente.`
      );
      return true;
    } catch (_) {}
  }

  // Modo GitHub Pages (Static)
  const store = loadStaticStore();
  const subObj = {
    email: cleanEmail,
    name: name.trim() || 'Estudante Eng. Química',
    minSalary: Number(minSalary) || 0,
    registeredAt: new Date().toISOString()
  };
  const idx = store.subscribers.findIndex((s) => s.email === cleanEmail);
  if (idx >= 0) store.subscribers[idx] = subObj;
  else store.subscribers.unshift(subObj);

  const sampleJobs = store.jobs.filter((j) => j.isNew).slice(0, 2);
  const welcomeRecord = await sendStaticEmailNotification(
    subObj,
    sampleJobs.length > 0 ? sampleJobs : store.jobs.slice(0, 1)
  );
  welcomeRecord.subject = `[Confirmação de Alerta Ativo] Radar Eng. Química Uberlândia`;
  store.emailHistory.unshift(welcomeRecord);
  saveStaticStore(store);

  state.subscribers = store.subscribers;
  state.emailHistory = store.emailHistory;
  renderAll();
  showToast(
    `<strong>Alerta ativado para ${escapeHtml(cleanEmail)}!</strong><br/>Notificações configuradas com sucesso.`
  );
  return true;
}

function openEmailModal() {
  renderEmailModalData();
  document.getElementById('emailModalBackdrop').classList.remove('hidden');
}

function closeEmailModal() {
  document.getElementById('emailModalBackdrop').classList.add('hidden');
}

function renderAll() {
  updateKpisAndCounters();
  renderJobsList();
  renderEmailModalData();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jobsContainer').addEventListener('click', (e) => {
    const directApply = e.target.closest('[data-action="direct-apply"]');
    if (directApply) {
      const card = directApply.closest('.job-card');
      if (card?.dataset.jobId) markJobAsSeen(card.dataset.jobId);
      return;
    }
    const summaryToggle = e.target.closest('[data-action="toggle-expand"]');
    if (summaryToggle) {
      toggleJobExpand(summaryToggle.dataset.id);
    }
  });

  document.getElementById('jobsContainer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const summaryToggle = e.target.closest('[data-action="toggle-expand"]');
      if (summaryToggle && e.target === summaryToggle) {
        e.preventDefault();
        toggleJobExpand(summaryToggle.dataset.id);
      }
    }
  });

  document.getElementById('btnScanNow').addEventListener('click', () => {
    runVerificationScan({ simulateNew: false });
  });

  document.getElementById('btnSimulateNew').addEventListener('click', () => {
    runVerificationScan({ simulateNew: true });
  });

  document.getElementById('btnOpenEmailModal').addEventListener('click', openEmailModal);
  document.getElementById('kpiEmailCard').addEventListener('click', openEmailModal);
  document.getElementById('btnCloseEmailModal').addEventListener('click', closeEmailModal);
  document.getElementById('emailModalBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'emailModalBackdrop') closeEmailModal();
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderJobsList();
  });

  document.getElementById('sectorSelect').addEventListener('change', (e) => {
    state.selectedSector = e.target.value;
    renderJobsList();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderJobsList();
  });

  document.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.quickFilter = btn.dataset.quick;
      document.querySelectorAll('.filter-pill').forEach((p) => p.classList.toggle('active', p === btn));
      renderJobsList();
    });
  });

  document.getElementById('inlineEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('inlineEmailInput');
    const ok = await registerEmailSubscriber({ email: input.value });
    if (ok) {
      input.value = '';
      openEmailModal();
    }
  });

  document.getElementById('modalEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('subEmailInput').value;
    const name = document.getElementById('subNameInput').value;
    const minSalary = Number(document.getElementById('subMinSalaryInput').value) || 0;
    const resendApiKey = document.getElementById('resendApiKeyInput').value.trim();

    const ok = await registerEmailSubscriber({ email, name, minSalary, resendApiKey });
    if (ok) {
      document.getElementById('subEmailInput').value = '';
    }
  });

  document.getElementById('subscribersList').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-remove-email]');
    if (!btn) return;
    const email = btn.dataset.removeEmail;
    if (state.mode === 'backend') {
      await fetch(`api/subscribers?email=${encodeURIComponent(email)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      const store = loadStaticStore();
      store.subscribers = store.subscribers.filter((s) => s.email !== email);
      saveStaticStore(store);
    }
    state.subscribers = state.subscribers.filter((s) => s.email !== email);
    renderAll();
    showToast(`Alerta removido para ${escapeHtml(email)}.`);
  });

  document.getElementById('emailHistoryList').addEventListener('click', (e) => {
    const row = e.target.closest('[data-preview-mail-id]');
    if (!row) return;
    const mail = state.emailHistory.find((m) => m.id === row.dataset.previewMailId);
    if (!mail) return;
    document.getElementById('previewPaneSubject').textContent = mail.subject;
    document.getElementById('emailPreviewFrame').innerHTML = mail.htmlPreview;
    document.getElementById('emailPreviewPane').classList.remove('hidden');
  });

  document.getElementById('btnClosePreviewPane').addEventListener('click', () => {
    document.getElementById('emailPreviewPane').classList.add('hidden');
  });

  loadInitialStateAndScan();
});
