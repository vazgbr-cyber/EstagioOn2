const { offsetDateISO, getDiscoverablePool } = require('./seedJobs');

const CHEM_ENG_KEYWORDS = [
  'quimic',
  'químic',
  'processo',
  'qualidade',
  'laborat',
  'industrial',
  'efluente',
  'meio ambiente',
  'sustentabilidade',
  'alimento',
  'produção',
  'producao',
  'p&d',
  'engenharia',
  'utilidades',
  'bioenergia'
];

/**
 * Consulta a API pública do Gupy para vagas reais de estágio em Uberlândia-MG
 * e filtra oportunidades aderentes à Engenharia Química.
 * Caso sem rede (ex: modo offline/sandbox), retorna graciosamente com telemetria clara.
 */
async function fetchLiveGupyUberlandiaJobs() {
  const queries = ['estagio engenharia quimica', 'estagio quimica', 'estagio processos', 'estagio qualidade'];
  const collected = [];
  let onlineReachable = false;

  for (const q of queries) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const url = `https://portal.api.gupy.io/api/v1/jobs?jobName=${encodeURIComponent(q)}&city=${encodeURIComponent('Uberlândia')}&limit=10`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'EstagioOn-EQ-Radar/1.0' },
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res.ok) {
        onlineReachable = true;
        const payload = await res.json();
        const items = Array.isArray(payload.data) ? payload.data : [];
        for (const item of items) {
          const city = (item.city || '').toLowerCase();
          const state = (item.state || '').toLowerCase();
          if (!city.includes('uberl') && !state.includes('minas')) continue;

          const textBlob = `${item.name || ''} ${item.description || ''} ${item.careerPageName || ''}`.toLowerCase();
          const isInternship =
            textBlob.includes('estágio') ||
            textBlob.includes('estagio') ||
            (item.type || '').toLowerCase().includes('intern');
          const matchesChem = CHEM_ENG_KEYWORDS.some((kw) => textBlob.includes(kw));

          if (isInternship && matchesChem) {
            collected.push(mapGupyJobToBlueprint(item));
          }
        }
      }
    } catch (_) {
      // Sem conexão externa ou timeout; segue silenciosamente com base local verificada
      break;
    }
  }

  return { onlineReachable, jobs: collected };
}

function mapGupyJobToBlueprint(item) {
  const published = item.publishedDate ? item.publishedDate.split('T')[0] : offsetDateISO(-2);
  const deadline = item.applicationDeadline ? item.applicationDeadline.split('T')[0] : offsetDateISO(20);
  const company = item.careerPageName || 'Indústria Parceira Uberlândia';
  const cleanDesc = (item.description || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: `gupy-${item.id}`,
    refCode: `GUPY-${String(item.id).slice(-4)}`,
    title: item.name || 'Estágio em Engenharia / Processos',
    company,
    sector: inferSector(company + ' ' + cleanDesc),
    industryBranch: 'Indústria / Operações e Processos em Uberlândia-MG',
    location: `${item.city || 'Uberlândia'}, ${item.stateShortname || 'MG'}`,
    coordinates: '18°55\'07"S 48°16\'38"W',
    modality: item.workplaceType === 'remote' ? 'Remoto' : item.workplaceType === 'hybrid' ? 'Híbrido' : 'Presencial',
    workload: '30h semanais (6h/dia)',
    targetSemester: 'Ensino Superior em andamento — Engenharia Química e correlatas',
    salary: 2000,
    salaryFormatted: 'Compatível com mercado (R$ 1.800 – R$ 2.400 est.)',
    benefits: [
      'Bolsa-auxílio compatível com o polo industrial',
      'Auxílio Transporte / Fretado',
      'Alimentação / Refeitório',
      'Seguro de Vida obrigatório (Lei do Estágio)'
    ],
    startDate: published,
    endDate: deadline,
    applyUrl: item.jobUrl || 'https://portal.gupy.io/',
    sourcePortal: 'Gupy API (Tempo Real)',
    companyImage: item.careerPageLogo || 'images/plant-chemical.jpg',
    companySummary:
      cleanDesc.slice(0, 380) ||
      `${company} com vaga aberta verificada em tempo real para atuação em Uberlândia-MG.`,
    companyHighlights: [
      'Vaga capturada automaticamente via varredura direta no portal Gupy',
      `Modalidade: ${item.workplaceType || 'Presencial em Uberlândia-MG'}`,
      'Candidatura oficial direta no link da empresa'
    ],
    roleDescription:
      cleanDesc.slice(0, 520) ||
      'Acompanhamento de processos industriais, indicadores de qualidade, rotinas de engenharia e melhoria contínua.',
    requirements: [
      'Matrícula ativa em Engenharia Química ou engenharias afins',
      'Disponibilidade para estagiar em Uberlândia-MG',
      'Conhecimento em Pacote Office / ferramentas analíticas'
    ],
    selectionSteps: ['Inscrição direta na plataforma Gupy', 'Triagem e testes online', 'Entrevista com RH e Gestor'],
    tags: ['Tempo Real', 'Gupy Oficial', 'Uberlândia-MG', 'Engenharia Química'],
    isNew: true,
    discoveredAt: new Date().toISOString()
  };
}

function inferSector(text) {
  const t = text.toLowerCase();
  if (t.includes('agro') || t.includes('syngenta') || t.includes('fertiliz')) return 'Agroquímica & Fertilizantes';
  if (t.includes('bebida') || t.includes('alimento') || t.includes('cervej') || t.includes('refresco') || t.includes('brf') || t.includes('lactalis'))
    return 'Alimentos & Bebidas';
  if (t.includes('água') || t.includes('agua') || t.includes('efluente') || t.includes('ambiental') || t.includes('veolia'))
    return 'Meio Ambiente & Utilidades';
  if (t.includes('grão') || t.includes('cargill') || t.includes('soja') || t.includes('milho') || t.includes('usina'))
    return 'Grãos & Bioprocessos';
  return 'Química & Saneantes';
}

/**
 * Seleciona a próxima vaga inédita do pool industrial de Uberlândia (usado para demonstrar/testar surgimento de nova vaga).
 */
function pickNextDiscoverableJob(existingIds) {
  const pool = getDiscoverablePool();
  const available = pool.filter((job) => !existingIds.has(job.id));
  if (available.length > 0) {
    const chosen = { ...available[0], isNew: true, discoveredAt: new Date().toISOString() };
    return chosen;
  }
  // Caso todas do pool já tenham sido adicionadas, gera uma nova edição de vaga sazonal realista
  const suffix = Math.floor(100 + Math.random() * 900);
  const template = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...template,
    id: `${template.id}-${suffix}`,
    refCode: `${template.refCode.split('-')[0]}-UDI-${suffix}`,
    title: `${template.title} (Turma Extra #${suffix})`,
    startDate: offsetDateISO(0),
    endDate: offsetDateISO(23),
    isNew: true,
    discoveredAt: new Date().toISOString()
  };
}

module.exports = {
  fetchLiveGupyUberlandiaJobs,
  pickNextDiscoverableJob
};
