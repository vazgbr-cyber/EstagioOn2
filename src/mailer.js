const tls = require('tls');
const net = require('net');

/**
 * Gera o HTML do e-mail técnico estilo Blueprint para envio e pré-visualização na Caixa de Saída.
 */
function buildJobNotificationEmailHtml(jobs, subscriberEmail) {
  const jobItemsHtml = jobs
    .map(
      (job) => `
      <div style="background:#0B192C;border:1px solid #1E3A5F;border-left:4px solid #38BDF8;padding:18px;margin-bottom:16px;border-radius:4px;">
        <div style="font-family:monospace;font-size:11px;color:#38BDF8;letter-spacing:1px;margin-bottom:6px;">
          [NOVIDADE DETECTADA // REF: ${job.refCode || 'EQ-UDI'}] • ${job.sector.toUpperCase()}
        </div>
        <h3 style="margin:0 0 6px 0;color:#F8FAFC;font-size:17px;font-family:Segoe UI,Arial,sans-serif;">
          ${job.title}
        </h3>
        <div style="color:#94A3B8;font-size:13px;margin-bottom:12px;">
          <strong style="color:#E2E8F0;">${job.company}</strong> — ${job.location} (${job.modality})
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#CBD5E1;margin-bottom:14px;">
          <tr>
            <td style="padding:4px 0;"><strong>Bolsa-Auxílio:</strong> <span style="color:#34D399;">${job.salaryFormatted}</span></td>
            <td style="padding:4px 0;"><strong>Inscrições até:</strong> ${job.endDate.split('-').reverse().join('/')}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:4px 0;"><strong>Benefícios:</strong> ${(job.benefits || []).slice(0, 4).join(' • ')}</td>
          </tr>
        </table>
        <a href="${job.applyUrl}" target="_blank" style="display:inline-block;background:#0284C7;color:#FFFFFF;text-decoration:none;padding:9px 16px;border-radius:3px;font-size:12px;font-weight:bold;letter-spacing:0.5px;">
          ACESSAR EDITAL E CANDIDATAR-SE →
        </a>
      </div>`
    )
    .join('');

  return `
  <div style="background:#060E1A;color:#E2E8F0;padding:28px;font-family:Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;border:1px solid #1E3A5F;">
    <div style="border-bottom:1px solid #1E3A5F;padding-bottom:14px;margin-bottom:20px;">
      <div style="font-family:monospace;font-size:11px;color:#38BDF8;letter-spacing:1.5px;">
        ESTÁGIO.ON // RADAR ENGENHARIA QUÍMICA — UBERLÂNDIA, MG
      </div>
      <h2 style="margin:6px 0 0 0;color:#F8FAFC;font-size:20px;">
        ${jobs.length === 1 ? '1 Nova Vaga Identificada' : `${jobs.length} Novas Vagas Identificadas`}
      </h2>
    </div>
    <p style="color:#94A3B8;font-size:14px;line-height:1.5;margin-bottom:20px;">
      Olá! O sistema de monitoramento identificou ${jobs.length === 1 ? 'uma nova oportunidade' : 'novas oportunidades'} de estágio compatível com <strong>Engenharia Química em Uberlândia-MG</strong> para o alerta cadastrado em <span style="color:#38BDF8;">${subscriberEmail}</span>:
    </p>
    ${jobItemsHtml}
    <div style="border-top:1px solid #1E3A5F;padding-top:12px;margin-top:20px;font-family:monospace;font-size:11px;color:#64748B;">
      DOC: EQ-UDI-RADAR // Notificação automática de novas vagas • Uberlândia, Triângulo Mineiro - MG
    </div>
  </div>`;
}

/**
 * Envia e-mail via API Resend (se RESEND_API_KEY estiver configurada) ou SMTP direto via TLS (se SMTP_HOST estiver configurado),
 * e registra sempre o disparo completo no histórico auditável da aplicação.
 */
async function dispatchEmailAlert({ subscriber, jobs, smtpConfig }) {
  const subject =
    jobs.length === 1
      ? `[EstágioOn EQ-UDI] Nova Vaga: ${jobs[0].title} — ${jobs[0].company}`
      : `[EstágioOn EQ-UDI] ${jobs.length} Novas Vagas de Engenharia Química em Uberlândia`;

  const html = buildJobNotificationEmailHtml(jobs, subscriber.email);
  let deliveryChannel = 'outbox-local';
  let deliveredExternally = false;
  let transportNote = 'Registrado na Caixa de Disparo integrada (configure SMTP/Resend nas opções caso queira envio externo em produção)';

  // 1. Suporte opcional a API Resend (HTTPS simples)
  const resendKey = (smtpConfig && smtpConfig.resendApiKey) || process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: (smtpConfig && smtpConfig.fromEmail) || 'EstagioOn Radar <onboarding@resend.dev>',
          to: [subscriber.email],
          subject,
          html
        })
      });
      if (resp.ok) {
        deliveryChannel = 'resend-api';
        deliveredExternally = true;
        transportNote = 'Entregue externamente via Resend API';
      } else {
        const errTxt = await resp.text();
        transportNote = `Registrado localmente (Resend retornou ${resp.status}: ${errTxt.slice(0, 80)})`;
      }
    } catch (err) {
      transportNote = `Registrado localmente (sem acesso externo à API Resend: ${err.message})`;
    }
  } else if (smtpConfig && smtpConfig.smtpHost && smtpConfig.smtpUser && smtpConfig.smtpPass) {
    // 2. Suporte opcional a SMTP TLS (porta 465)
    try {
      await sendViaSmtpTls({
        host: smtpConfig.smtpHost,
        port: Number(smtpConfig.smtpPort) || 465,
        user: smtpConfig.smtpUser,
        pass: smtpConfig.smtpPass,
        from: smtpConfig.fromEmail || smtpConfig.smtpUser,
        to: subscriber.email,
        subject,
        html
      });
      deliveryChannel = 'smtp-tls';
      deliveredExternally = true;
      transportNote = `Entregue externamente via SMTP (${smtpConfig.smtpHost})`;
    } catch (err) {
      transportNote = `Registrado localmente (falha SMTP: ${err.message})`;
    }
  }

  return {
    id: 'mail-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    to: subscriber.email,
    subscriberName: subscriber.name || 'Estudante EQ',
    subject,
    jobIds: jobs.map((j) => j.id),
    jobTitles: jobs.map((j) => `${j.company} — ${j.title}`),
    sentAt: new Date().toISOString(),
    deliveryChannel,
    deliveredExternally,
    transportNote,
    htmlPreview: html
  };
}

function sendViaSmtpTls({ host, port, user, pass, from, to, subject, html }) {
  return new Promise((resolve, reject) => {
    const socket = port === 465 ? tls.connect(port, host, { rejectUnauthorized: false }) : net.connect(port, host);
    socket.setTimeout(8000);

    const commands = [
      `EHLO estagio-on.local`,
      `AUTH LOGIN`,
      Buffer.from(user).toString('base64'),
      Buffer.from(pass).toString('base64'),
      `MAIL FROM:<${from}>`,
      `RCPT TO:<${to}>`,
      `DATA`,
      [
        `From: EstagioOn EQ Uberlandia <${from}>`,
        `To: <${to}>`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        html,
        `.`
      ].join('\r\n'),
      `QUIT`
    ];

    let step = -1;
    let buffer = '';

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (/^\d{3} /.test(line)) {
          const code = parseInt(line.slice(0, 3), 10);
          if (code >= 400) {
            socket.destroy();
            return reject(new Error(line));
          }
          step++;
          if (step < commands.length) {
            socket.write(commands[step] + '\r\n');
          } else {
            socket.end();
            resolve(true);
          }
        }
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Timeout SMTP'));
    });
    socket.on('error', reject);
  });
}

module.exports = {
  buildJobNotificationEmailHtml,
  dispatchEmailAlert
};
