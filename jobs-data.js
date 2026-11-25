// Base de dados de estágios em Engenharia Química (Uberlândia-MG) compatível tanto com Navegador (GitHub Pages) quanto Node.js
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EstagioOnData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function offsetDateISO(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  function getInitialSeedJobs() {
    return [
      {
        id: 'crg-udi-eq-01',
        refCode: 'CRG-UDI-01',
        title: 'Estágio em Engenharia de Processos & Bioprocessamento',
        company: 'Cargill Agrícola S.A.',
        sector: 'Grãos & Bioprocessos',
        industryBranch: 'Processamento de Milho, Amidos Modificados, Adoçantes e Biotecnologia Industrial',
        location: 'Distrito Industrial — Uberlândia, MG',
        coordinates: '18°51\'42"S 48°18\'19"W',
        modality: 'Presencial',
        workload: '30h semanais (6h/dia — flexível com grade UFU)',
        targetSemester: '6º ao 9º período de Engenharia Química',
        salary: 2350,
        salaryFormatted: 'R$ 2.350,00 / mês',
        benefits: [
          'Plano Médico e Odontológico extensivo',
          'Refeitório completo na unidade industrial',
          'Transporte Fretado (rotas Santa Mônica, Centro e Umuarama)',
          'Wellhub (Gympass) e Apoio Psicossocial',
          'Auxílio Farmácia + Seguro de Vida',
          'Recesso remunerado proporcional'
        ],
        startDate: offsetDateISO(-2),
        endDate: offsetDateISO(19),
        applyUrl: 'https://careers.cargill.com/pt-br/estagio',
        sourcePortal: 'Cargill Global Careers',
        companyImage: 'images/plant-bioprocess.jpg',
        companySummary:
          'A Cargill opera em Uberlândia um dos maiores e mais tecnológicos complexos de processamento úmido de milho da América Latina. A unidade transforma milhares de toneladas de grãos em amidos industriais, xaropes de glicose, maltodextrina e coprodutos de nutrição, empregando operações unitárias clássicas e avançadas de Engenharia Química em regime contínuo 24/7.',
        companyHighlights: [
          'Mais de 1.000 colaboradores diretos no complexo de Uberlândia',
          'Plantas de moagem úmida, hidrólise ácida/enzimática, evaporação multi-efeito e spray-drying',
          'Forte cultura de Segurança de Processos (PSM) e Melhoria Contínua (Lean Six Sigma)'
        ],
        roleDescription:
          'Atuação direta junto aos Engenheiros de Processo no acompanhamento de balanços de massa e energia, monitoramento de indicadores de rendimento industrial, análise de perdas em colunas de troca iônica e evaporadores, além de projetos de eficiência energética e redução de consumo específico de vapor e água.',
        requirements: [
          'Cursando Engenharia Química (6º ao 9º período) com vínculo ativo',
          'Domínio intermediário/avançado em Excel (Power BI será diferencial)',
          'Sólida base em Operações Unitárias, Termodinâmica e Balanço de Massa/Energia',
          'Inglês intermediário desejável para leitura de manuais técnicos e P&IDs'
        ],
        selectionSteps: [
          'Inscrição online e triagem curricular',
          'Teste de raciocínio lógico e perfil comportamental',
          'Dinâmica técnica de resolução de case industrial',
          'Painel com Gestor de Engenharia de Processos em Uberlândia'
        ],
        tags: ['Operações Unitárias', 'Balanço de Massa', 'Evaporação', 'Lean Six Sigma', 'P&ID'],
        isNew: true,
        discoveredAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: 'syn-udi-eq-02',
        refCode: 'SYN-UDI-02',
        title: 'Estágio em Qualidade Analítica & Formulação Agroquímica',
        company: 'Syngenta Proteção de Cultivos',
        sector: 'Agroquímica & Fertilizantes',
        industryBranch: 'Defensivos Agrícolas, Biológicos, Ciência de Cultivos e Formulações Químicas',
        location: 'Polo Agroindustrial — Uberlândia, MG',
        coordinates: '18°53\'14"S 48°15\'50"W',
        modality: 'Híbrido (4x Presencial / 1x Remoto)',
        workload: '30h semanais (08h00 às 14h00)',
        targetSemester: 'Formação prevista entre Dez/2027 e Dez/2028',
        salary: 2480,
        salaryFormatted: 'R$ 2.480,00 / mês',
        benefits: [
          'Plano de Saúde e Odontológico Bradesco',
          'Vale-Refeição (R$ 920,00/mês) ou restaurante local',
          'Fretado corporativo / Vale-Transporte integral',
          'Day-Off remunerado no mês de aniversário',
          'Trilha de capacitação técnica e idiomas',
          'Seguro de Vida em grupo'
        ],
        startDate: offsetDateISO(-1),
        endDate: offsetDateISO(24),
        applyUrl: 'https://www.syngenta.com.br/carreiras',
        sourcePortal: 'Syngenta Carreiras / Cia de Talentos',
        companyImage: 'images/plant-agro.jpg',
        companySummary:
          'Multinacional de origem suíça líder mundial em ciência agrícola, pesquisa agroquímica e soluções biológicas para o agronegócio. Em Uberlândia — coração estratégico do Cerrado — a Syngenta mantém forte estrutura técnica voltada à garantia da qualidade, estabilidade físico-química de formulações (suspensões concentradas, emulsões e grânulos dispersíveis) e suporte à cadeia produtiva.',
        companyHighlights: [
          'Laboratórios equipados com HPLC, Cromatografia Gasosa (CG) e analisadores de tamanho de partícula',
          'Padrões internacionais de Boas Práticas de Laboratório (BPL / ISO 17025)',
          'Alta taxa de efetivação de estagiários de Engenharia Química e Química'
        ],
        roleDescription:
          'Suporte às rotinas de controle analítico e físico-químico de formulações agroquímicas e bioinsumos; acompanhamento de testes de estabilidade acelerada (reologia, pH, tensão superficial, suspensibilidade); elaboração de relatórios técnicos de desvios e atualização de procedimentos operacionais padrão (POPs).',
        requirements: [
          'Graduação em andamento em Engenharia Química, Química Industrial ou Bacharelado em Química',
          'Vivência acadêmica em laboratórios de Química Analítica / Instrumental',
          'Conhecimento em Pacote Office e ferramentas de análise estatística',
          'Disponibilidade para estagiar 30h semanais em Uberlândia-MG'
        ],
        selectionSteps: [
          'Cadastro no portal oficial Syngenta',
          'Avaliação online de perfil e lógica',
          'Entrevista com RH / Talent Acquisition',
          'Entrevista técnica com coordenação de Qualidade & P&D'
        ],
        tags: ['HPLC / Cromatografia', 'Reologia', 'Formulações', 'ISO 17025', 'P&D Agro'],
        isNew: true,
        discoveredAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
      },
      {
        id: 'str-udi-eq-03',
        refCode: 'STR-UDI-03',
        title: 'Estágio em P&D de Saneantes e Controle Físico-Químico',
        company: 'Start Química (Lima & Pergher)',
        sector: 'Química & Saneantes',
        industryBranch: 'Indústria Química de Saneantes, Higiene Profissional, Cosméticos e Domissanitários',
        location: 'Distrito Industrial Norte — Uberlândia, MG',
        coordinates: '18°50\'55"S 48°17\'33"W',
        modality: 'Presencial',
        workload: '30h semanais (07h30 às 13h30 ou 12h00 às 18h00)',
        targetSemester: '5º ao 9º período de Engenharia Química',
        salary: 1850,
        salaryFormatted: 'R$ 1.850,00 / mês',
        benefits: [
          'Alimentação completa no restaurante da fábrica',
          'Transporte Fretado / Vale-Transporte',
          'Convênio Médico Unimed (coparticipação)',
          'Cesta mensal de produtos Start / Azulim',
          'Seguro de Vida e convênio com instituições de ensino'
        ],
        startDate: offsetDateISO(-3),
        endDate: offsetDateISO(14),
        applyUrl: 'https://www.startquimica.com.br/trabalhe-conosco',
        sourcePortal: 'Portal Start Química RH',
        companyImage: 'images/plant-chemical.jpg',
        companySummary:
          'Orgulhosamente sediada em Uberlândia-MG, a Start Química (Grupo Lima & Pergher) é uma das maiores indústrias químicas de limpeza e higienização da América Latina, presente em todo o Brasil e no exterior. Seu complexo industrial em Uberlândia reúne plantas de síntese/sulfonação, dezenas de reatores de mistura inoxidáveis, sopro de embalagens e centros próprios de Pesquisa & Desenvolvimento.',
        companyHighlights: [
          'Matriz industrial de grande porte localizada no Distrito Industrial de Uberlândia',
          'Portfólio com mais de 700 produtos químicos domissanitários, automotivos, laticínios e hospitalares',
          'Contato diário direto com formulação química real, tensoativos e regulamentação ANVISA'
        ],
        roleDescription:
          'Apoio no desenvolvimento de novas formulações em bancada e acompanhamento de lotes piloto (scale-up para reatores industriais); execução de análises físico-químicas de matérias-primas e produto acabado (viscosidade Brookfield, teor de ativo, titulometria, densidade, pH e ponto de turvação); validação de FISPQs/FDS.',
        requirements: [
          'Cursando Engenharia Química ou Química Industrial a partir do 5º período',
          'Conhecimento prático de vidrarias, titulometria e segurança de laboratório (NR-32 / EPIs)',
          'Organização, proatividade e atenção rigorosa a normas regulatórias (ANVISA / ISO 9001)'
        ],
        selectionSteps: [
          'Triagem de currículos pelo RH Start Química',
          'Prova técnica básica de estequiometria, diluições e pH',
          'Entrevista presencial no laboratório industrial em Uberlândia'
        ],
        tags: ['Tensoativos', 'Scale-Up', 'Controle Físico-Químico', 'ANVISA', 'FDS/FISPQ'],
        isNew: true,
        discoveredAt: new Date(Date.now() - 1000 * 60 * 195).toISOString()
      },
      {
        id: 'urf-udi-eq-04',
        refCode: 'URF-UDI-04',
        title: 'Estágio em Engenharia Química — ETA/ETE, Utilidades e Meio Ambiente',
        company: 'Uberlândia Refrescos (Sistema Coca-Cola)',
        sector: 'Meio Ambiente & Utilidades',
        industryBranch: 'Fabricação de Bebidas, Tratamento Avançado de Água/Efluentes e Sustentabilidade Industrial',
        location: 'Distrito Industrial — Uberlândia, MG',
        coordinates: '18°52\'08"S 48°17\'04"W',
        modality: 'Presencial',
        workload: '30h semanais (08h00 às 14h00)',
        targetSemester: '6º ao 8º período de Engenharia Química',
        salary: 1920,
        salaryFormatted: 'R$ 1.920,00 / mês',
        benefits: [
          'Assistência Médica e Odontológica',
          'Restaurante próprio na unidade fabril',
          'Transporte Fretado gratuito',
          'Seguro de Vida e kit em datas comemorativas',
          'Programa estruturado de projetos de estágio'
        ],
        startDate: offsetDateISO(-8),
        endDate: offsetDateISO(11),
        applyUrl: 'https://uberlandiarefrescos.gupy.io/',
        sourcePortal: 'Gupy — Uberlândia Refrescos',
        companyImage: 'images/plant-food-bev.jpg',
        companySummary:
          'A Uberlândia Refrescos é uma fabricante autorizada do Sistema Coca-Cola com planta matriz em Uberlândia-MG, referência nacional em eficiência hídrica, energia limpa e automação industrial. Na indústria de bebidas, a água tratada é o insumo químico mais crítico, exigindo controle estrito de processos de membranas, coagulação, desinfecção e tratamento biológico de efluentes.',
        companyHighlights: [
          'Sistemas de Osmose Reversa, Ultrafiltração e Polimento em Carvão Ativado',
          'Estação de Tratamento de Efluentes (ETE) de alta eficiência com reúso industrial',
          'Certificações ISO 9001, ISO 14001, FSSC 22000 e ISO 45001'
        ],
        roleDescription:
          'Acompanhamento operacional da Estação de Tratamento de Água (ETA) e Efluentes (ETE); controle de parâmetros físico-químicos (DQO, DBO, turbidez, cloro residual, alcalinidade, condutividade e SDI em membranas); gestão de indicadores de consumo hídrico (litros de água por litro de bebida produzida) e dosagem de coagulantes/polímeros.',
        requirements: [
          'Cursando Engenharia Química ou Engenharia Ambiental (6º ao 8º período)',
          'Interesse em Tratamento de Águas Industriais, Membranas e Sustentabilidade',
          'Domínio de Excel (tabelas dinâmicas, gráficos de controle e indicadores KPI)'
        ],
        selectionSteps: [
          'Inscrição e testes na plataforma Gupy',
          'Vídeo-apresentação / Dinâmica em grupo',
          'Entrevista final com Gestão de Meio Ambiente e Utilidades'
        ],
        tags: ['ETA / ETE', 'Osmose Reversa', 'DQO / DBO', 'ISO 14001', 'Eficiência Hídrica'],
        isNew: false,
        discoveredAt: offsetDateISO(-8) + 'T10:00:00.000Z'
      },
      {
        id: 'abv-udi-eq-05',
        refCode: 'ABV-UDI-05',
        title: 'Estágio Industrial — Processo Cervejeiro, Filtração & CIP',
        company: 'Cervejaria Ambev — Unidade Uberlândia',
        sector: 'Alimentos & Bebidas',
        industryBranch: 'Indústria Cervejeira, Fermentação Bioquímica, Processos Térmicos e Envase',
        location: 'Rodovia BR-050 / Distrito Industrial — Uberlândia, MG',
        coordinates: '18°51\'19"S 48°19\'02"W',
        modality: 'Presencial',
        workload: '30h semanais (Horário flexível)',
        targetSemester: 'Penúltimo ou último ano de Engenharia Química',
        salary: 2300,
        salaryFormatted: 'R$ 2.300,00 / mês',
        benefits: [
          'Plano Médico e Odontológico Ambev',
          'Refeitório completo + Transporte Fretado',
          'Gympass / Wellhub e Cesta de Natal',
          '13º Bolsa-Auxílio / Bonificação de programa',
          'Mentoria individual para projeto de melhoria contínua'
        ],
        startDate: offsetDateISO(-10),
        endDate: offsetDateISO(16),
        applyUrl: 'https://www.ambev.com.br/carreiras/programas-de-entrada/estagio',
        sourcePortal: 'Carreiras Ambev',
        companyImage: 'images/plant-food-bev.jpg',
        companySummary:
          'A Cervejaria Uberlândia é um polo estratégico de produção e distribuição da Ambev para Minas Gerais e Centro-Oeste. Combina engenharia bioquímica em larga escala (mosturação enzimática e fermentação controlada) com engenharia de processos térmicos, filtração tangencial, recuperação de CO₂ e sistemas automatizados de sanitização química (CIP).',
        companyHighlights: [
          'Vivência completa em chão de fábrica automatizado com metodologia VPO (Voyager Plant Optimization)',
          'Desenvolvimento de projeto autoral de Engenharia Química aplicável até o fim do estágio',
          'Forte porta de entrada para carreiras de Especialista de Processo e Trainee Industrial'
        ],
        roleDescription:
          'Suporte à área de Processo Cervejeiro e Qualidade Assegurada; monitoramento de curvas de fermentação, extrato aparente, turbidez e oxigênio dissolvido; otimização de ciclos químicos de limpeza CIP (concentração de soda cáustica, ácido peracético, tempo e temperatura) visando redução de perdas térmicas e químicas.',
        requirements: [
          'Cursando penúltimo ou último ano de Engenharia Química (formação até 2 anos)',
          'Perfil analítico, mão na massa e gosto por rotina industrial dinâmica',
          'Conhecimento em Excel / ferramentas de análise de causa raiz (PDCA, Pareto, Ishikawa)'
        ],
        selectionSteps: [
          'Inscrição e games de lógica/perfil',
          'Case online de negócios e operações industriais',
          'Entrevista final com Gerência de Processo na Cervejaria Uberlândia'
        ],
        tags: ['Bioprocessos', 'Fermentação', 'CIP Químico', 'PDCA / Lean', 'Termodinâmica'],
        isNew: false,
        discoveredAt: offsetDateISO(-10) + 'T14:20:00.000Z'
      },
      {
        id: 'sur-udi-eq-06',
        refCode: 'SUR-UDI-06',
        title: 'Estágio em Engenharia Química — Síntese, Emulsões e Reatores Piloto',
        company: 'Suresh Speciality Indústria Química',
        sector: 'Química & Saneantes',
        industryBranch: 'Especialidades Químicas, Aditivos Industriais, Antiespumantes e Polímeros',
        location: 'Distrito Industrial — Uberlândia, MG',
        coordinates: '18°51\'50"S 48°18\'01"W',
        modality: 'Presencial',
        workload: '30h semanais (12h30 às 18h30)',
        targetSemester: '5º ao 9º período de Engenharia Química',
        salary: 1780,
        salaryFormatted: 'R$ 1.780,00 / mês',
        benefits: [
          'Vale-Alimentação / Refeição (R$ 550,00/mês)',
          'Auxílio Combustível ou Vale-Transporte sem desconto',
          'Seguro de Vida',
          'Bônus semestral por metas de laboratório e assiduidade'
        ],
        startDate: offsetDateISO(-6),
        endDate: offsetDateISO(21),
        applyUrl: 'https://br.indeed.com/jobs?q=Est%C3%A1gio+Engenharia+Qu%C3%ADmica&l=Uberl%C3%A2ndia%2C+MG',
        sourcePortal: 'Portal RH / Indeed Uberlândia',
        companyImage: 'images/plant-chemical.jpg',
        companySummary:
          'A Suresh Speciality é uma indústria química instalada no Distrito Industrial de Uberlândia especializada na síntese e formulação de aditivos químicos de alta performance: antiespumantes siliconados e orgânicos, dispersantes, auxiliares para usinas sucroenergéticas, tratamento de águas e indústria de papel e celulose.',
        companyHighlights: [
          'Ambiente de indústria química pura com reatores encamisados e planta piloto',
          'Aprendizado intenso em fenômenos de interface, emulsificação e reologia',
          'Proximidade direta com diretores técnicos e engenheiros químicos seniores'
        ],
        roleDescription:
          'Acompanhamento de bateladas em reatores químicos industriais; testes de aplicação de antiespumantes e tensoativos para clientes industriais (usinas de etanol/açúcar e celulose); controle de qualidade por infravermelho (FTIR), índice de acidez/saponificação, sólidos totais e estabilidade centrífuga.',
        requirements: [
          'Estudante de Engenharia Química (UFU ou instituições reconhecidas em Uberlândia)',
          'Boa base em Química Orgânica, Físico-Química de Coloides/Superfícies e Reatores',
          'Disponibilidade no período vespertino'
        ],
        selectionSteps: [
          'Envio de currículo e histórico acadêmico',
          'Entrevista técnica presencial no laboratório em Uberlândia',
          'Aprovação e exame admissional de estágio'
        ],
        tags: ['Reatores Químicos', 'Emulsões & Coloides', 'FTIR', 'Química Fina', 'Sucroenergético'],
        isNew: false,
        discoveredAt: offsetDateISO(-6) + 'T09:15:00.000Z'
      },
      {
        id: 'brf-udi-eq-07',
        refCode: 'BRF-UDI-07',
        title: 'Estágio em Garantia da Qualidade, Utilidades & Físico-Química',
        company: 'BRF S.A. — Unidade Uberlândia',
        sector: 'Alimentos & Bebidas',
        industryBranch: 'Indústria Alimentícia de Grande Porte, Refrigeração Industrial e Qualidade',
        location: 'Distrito Industrial — Uberlândia, MG',
        coordinates: '18°52\'31"S 48°17\'48"W',
        modality: 'Presencial',
        workload: '30h semanais (07h00 às 13h00)',
        targetSemester: '6º ao 9º período de Engenharia Química',
        salary: 2050,
        salaryFormatted: 'R$ 2.050,00 / mês',
        benefits: [
          'Assistência Médica e Odontológica',
          'Refeitório completo na planta industrial',
          'Fretado corporativo em diversos bairros de Uberlândia',
          'Kit de produtos Sadia/Perdigão e Vale-Alimentação',
          'Seguro de Vida'
        ],
        startDate: offsetDateISO(-12),
        endDate: offsetDateISO(9),
        applyUrl: 'https://brf.gupy.io/',
        sourcePortal: 'Gupy — Carreiras BRF',
        companyImage: 'images/plant-bioprocess.jpg',
        companySummary:
          'Uma das maiores companhias de alimentos do planeta, a BRF mantém em Uberlândia uma planta industrial estratégica de alta capacidade produtiva. Para o estudante de Engenharia Química, a unidade proporciona forte contato com controle estatístico de processos (CEP), laboratório físico-químico, caldeiras, ciclos frigoríficos de amônia e sanitização industrial.',
        companyHighlights: [
          'Planta certificada para exportação internacional com padrões rigorosos de qualidade',
          'Sistema estruturado de gestão CIEX (Excelência Operacional BRF)',
          'Fretado passando próximo aos campi da UFU'
        ],
        roleDescription:
          'Apoio ao laboratório físico-químico (umidade, lipídios, proteínas, cloretos e qualidade de água industrial) e validação de higienização química pré-operacional (concentração de sanitizantes clorados/quaternários de amônio); análise de indicadores de rendimento e redução de variabilidade em linha.',
        requirements: [
          'Cursando Engenharia Química ou Engenharia de Alimentos a partir do 6º período',
          'Disponibilidade para estagiar no turno matutino (07h às 13h)',
          'Conhecimento em Excel, ferramentas da qualidade e Boas Práticas de Fabricação (BPF/APPCC)'
        ],
        selectionSteps: [
          'Inscrição via portal Gupy BRF',
          'Teste de perfil e raciocínio analítico',
          'Painel online e entrevista com supervisão de Qualidade em Uberlândia'
        ],
        tags: ['CEP / Qualidade', 'Análises Físico-Químicas', 'Utilidades / Amônia', 'APPCC', 'CIEX'],
        isNew: false,
        discoveredAt: offsetDateISO(-12) + 'T11:30:00.000Z'
      }
    ];
  }

  function getDiscoverablePool() {
    return [
      {
        id: 'alg-udi-eq-08',
        refCode: 'ALG-UDI-08',
        title: 'Estágio em Processos de Extração por Solvente & Refino de Óleos',
        company: 'ABC Indústria e Comércio S.A. (Algar Agro)',
        sector: 'Grãos & Bioprocessos',
        industryBranch: 'Extração Química de Óleos Vegetais, Refino Industrial e Farelos Proteicos',
        location: 'Distrito Industrial — Uberlândia, MG',
        coordinates: '18°51\'29"S 48°18\'12"W',
        modality: 'Presencial',
        workload: '30h semanais (08h00 às 14h00)',
        targetSemester: '6º ao 9º período de Engenharia Química',
        salary: 2180,
        salaryFormatted: 'R$ 2.180,00 / mês',
        benefits: [
          'Plano de Saúde Unimed e Odontológico',
          'Restaurante na unidade industrial',
          'Transporte Fretado / Vale-Transporte',
          'Seguro de Vida e Programa de Bem-Estar',
          'Trilha de desenvolvimento de talentos em Uberlândia'
        ],
        startDate: offsetDateISO(0),
        endDate: offsetDateISO(25),
        applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Est%C3%A1gio%20Engenharia%20Qu%C3%ADmica&location=Uberl%C3%A2ndia',
        sourcePortal: 'LinkedIn / Portal Corporativo Industrial',
        companyImage: 'images/plant-bioprocess.jpg',
        companySummary:
          'Com histórico emblemático no Distrito Industrial de Uberlândia, a planta de processamento de soja opera processos clássicos de Engenharia Química pura: extração sólido-líquido por hexano em extratores contínuos, destilação/dessolventização de miscela, degomagem ácida/enzimática, neutralização química, branqueamento e desodorização a alto vácuo.',
        companyHighlights: [
          'Uma das plantas mais ricas em Operações Unitárias térmicas e de transferência de massa em MG',
          'Contato prático com colunas de destilação, recuperadores de solvente e trocadores de calor',
          'Forte atuação em segurança de processos inflamáveis (NR-20) e eficiência energética'
        ],
        roleDescription:
          'Monitoramento de perda de solvente (hexano) por tonelada processada, acompanhamento de índice de acidez, peróxidos e sabões no refino químico do óleo de soja, balanço térmico nos evaporadores de miscela e suporte a projetos de melhoria de rendimento industrial.',
        requirements: [
          'Cursando Engenharia Química (6º ao 9º período)',
          'Base sólida em Transferência de Calor/Massa, Destilação e Extração Sólido-Líquido',
          'Excel intermediário/avançado e postura voltada à segurança operacional'
        ],
        selectionSteps: [
          'Análise curricular',
          'Entrevista com RH e teste técnico de balanço de massa',
          'Entrevista técnica na planta do Distrito Industrial'
        ],
        tags: ['Extração por Solvente', 'Destilação', 'Refino Químico', 'NR-20', 'Transferência de Massa']
      },
      {
        id: 'veo-udi-eq-09',
        refCode: 'VEO-UDI-09',
        title: 'Estágio em Engenharia Química — Soluções Químicas para Águas & Caldeiras',
        company: 'Veolia Water Technologies — Polo Uberlândia',
        sector: 'Meio Ambiente & Utilidades',
        industryBranch: 'Tratamento Químico de Águas Industriais, Torres de Resfriamento, Caldeiras e Efluentes',
        location: 'Uberlândia, MG (Atendimento plantas Distrito Industrial)',
        coordinates: '18°54\'41"S 48°16\'15"W',
        modality: 'Híbrido',
        workload: '30h semanais',
        targetSemester: '6º ao 9º período de Engenharia Química',
        salary: 2420,
        salaryFormatted: 'R$ 2.420,00 / mês',
        benefits: [
          'Plano Médico e Odontológico Internacional',
          'Vale-Refeição (R$ 960,00/mês)',
          'Auxílio Mobilidade / Transporte',
          'Gympass / Seguro de Vida Global',
          'Notebook corporativo e kits analíticos de campo'
        ],
        startDate: offsetDateISO(0),
        endDate: offsetDateISO(28),
        applyUrl: 'https://www.veolia.com/latamib/pt/carreiras',
        sourcePortal: 'Veolia Careers LatAm',
        companyImage: 'images/plant-chemical.jpg',
        companySummary:
          'Líder global em transformação ecológica e gestão de águas, energia e resíduos, a Veolia atende grandes complexos industriais de Uberlândia e do Triângulo Mineiro fornecendo especialidades químicas (anti-incrustantes, inibidores de corrosão, biocidas oxidantes e polímeros floculantes) e engenharia de aplicação.',
        companyHighlights: [
          'Vivência consultiva de Engenharia Química dentro de múltiplas indústrias de grande porte',
          'Treinamento avançado em química de caldeiras de alta pressão e ciclos de resfriamento',
          'Multinacional francesa referência mundial em engenharia ambiental e hídrica'
        ],
        roleDescription:
          'Apoio aos Engenheiros de Aplicação em análises físico-químicas de campo (sílica, dureza cálcica, ferro, fosfatos, condutividade e microbiologia em torres de resfriamento e caldeiras); elaboração de relatórios técnicos de performance química (Índices de Langelier/Ryznar) e otimização de dosagens automatizadas.',
        requirements: [
          'Cursando Engenharia Química (6º ao 9º período)',
          'Boa comunicação técnica, perfil analítico e domínio de Química Analítica / Corrosão',
          'Excel avançado e inglês intermediário'
        ],
        selectionSteps: [
          'Inscrição no portal Veolia',
          'Entrevista com Talent Acquisition Brasil',
          'Case técnico de tratamento de utilidades com Gerente Regional MG'
        ],
        tags: ['Caldeiras & Torres', 'Corrosão & Incrustação', 'Química Analítica', 'Polímeros', 'Multinacional']
      },
      {
        id: 'lac-udi-eq-10',
        refCode: 'LAC-UDI-10',
        title: 'Estágio em Engenharia de Processos Lácteos, Membranas & Padronização',
        company: 'Lactalis do Brasil — Unidade Uberlândia',
        sector: 'Alimentos & Bebidas',
        industryBranch: 'Processamento Industrial de Laticínios, Pasteurização, Concentração e Secagem',
        location: 'Uberlândia, MG',
        coordinates: '18°53\'58"S 48°17\'21"W',
        modality: 'Presencial',
        workload: '30h semanais (07h30 às 13h30)',
        targetSemester: '5º ao 9º período de Engenharia Química',
        salary: 1980,
        salaryFormatted: 'R$ 1.980,00 / mês',
        benefits: [
          'Assistência Médica e Odontológica',
          'Refeitório na unidade + Kit mensal de lácteos (Itambé / Président / Parmalat)',
          'Vale-Transporte / Fretado',
          'Seguro de Vida'
        ],
        startDate: offsetDateISO(0),
        endDate: offsetDateISO(22),
        applyUrl: 'https://lactalis.gupy.io/',
        sourcePortal: 'Gupy — Grupo Lactalis Brasil',
        companyImage: 'images/plant-food-bev.jpg',
        companySummary:
          'Maior grupo de laticínios do mundo (detentor de marcas como Itambé, Président e Parmalat), a Lactalis possui presença industrial de grande relevância em Uberlândia e no Triângulo Mineiro, operando plantas com trocadores de calor a placas (UHT/pasteurização), centrífugas desnatadeiras, ultrafiltração de soro e evaporadores a vácuo.',
        companyHighlights: [
          'Operações térmicas contínuas (trocadores de calor regenerativos e evaporação)',
          'Laboratórios modernos de físico-química e crioscopia/infravermelho',
          'Programa nacional de desenvolvimento de jovens engenheiros'
        ],
        roleDescription:
          'Acompanhamento de eficiência térmica em pasteurizadores e sistemas UHT, controle de perdas de sólidos totais e gordura nos processos de padronização centrífuga, otimização de ciclos de limpeza CIP ácido-alcalina e suporte à engenharia de processos.',
        requirements: [
          'Cursando Engenharia Química ou Engenharia de Alimentos (5º ao 9º período)',
          'Conhecimento em Fenômenos de Transporte (Transferência de Calor) e Balanço de Massa',
          'Domínio de Pacote Office'
        ],
        selectionSteps: [
          'Cadastro e testes na Gupy Lactalis',
          'Entrevista com RH Regional MG',
          'Entrevista presencial com Coordenação Industrial'
        ],
        tags: ['Trocadores de Calor', 'Ultrafiltração', 'Evaporação a Vácuo', 'CIP', 'Processos Térmicos']
      },
      {
        id: 'eur-udi-eq-11',
        refCode: 'EUR-UDI-11',
        title: 'Estágio em Química Analítica Instrumental & Resíduos Agroquímicos',
        company: 'Eurofins Agroscience Services — Uberlândia',
        sector: 'Agroquímica & Fertilizantes',
        industryBranch: 'Laboratórios Analíticos, Pesquisa Agroquímica, BPL e Cromatografia Avançada',
        location: 'Uberlândia, MG',
        coordinates: '18°55\'12"S 48°14\'49"W',
        modality: 'Presencial',
        workload: '30h semanais (6h/dia)',
        targetSemester: '5º ao 9º período de Engenharia Química ou Química',
        salary: 2100,
        salaryFormatted: 'R$ 2.100,00 / mês',
        benefits: [
          'Plano de Saúde e Odontológico',
          'Vale-Refeição (R$ 780,00/mês)',
          'Vale-Transporte',
          'Seguro de Vida e Parcerias Educacionais'
        ],
        startDate: offsetDateISO(0),
        endDate: offsetDateISO(20),
        applyUrl: 'https://careers.eurofins.com/br/',
        sourcePortal: 'Eurofins Global Careers',
        companyImage: 'images/plant-agro.jpg',
        companySummary:
          'Referência mundial em serviços bioanalíticos e ensaios laboratoriais, o grupo Eurofins atua fortemente na região de Uberlândia conduzindo estudos regulatórios sob Boas Práticas de Laboratório (BPL/INMETRO), determinação de resíduos químicos, validação de métodos analíticos e físico-química de defensivos.',
        companyHighlights: [
          'Padrão ouro mundial em química analítica instrumental (LC-MS/MS e GC-MS/MS)',
          'Ambiente científico internacional com rigor metrológico extremo',
          'Excelente formação para quem deseja atuar em P&D, Qualidade ou Assuntos Regulatórios'
        ],
        roleDescription:
          'Preparo de amostras por extração QuEChERS e fase sólida, preparo de soluções padrão e fases móveis cromatográficas, apoio na validação de métodos analíticos (linearidade, limite de detecção/quantificação) e rastreabilidade documental BPL.',
        requirements: [
          'Cursando Engenharia Química, Química Industrial ou Bacharelado em Química',
          'Afinidade com Química Analítica Quantitativa e Instrumental',
          'Inglês técnico para leitura de protocolos internacionais (OECD / EPA / ANVISA)'
        ],
        selectionSteps: [
          'Triagem curricular no portal Eurofins',
          'Avaliação técnica de cálculos estequiométricos e preparo de soluções',
          'Entrevista com Gestão de Laboratório'
        ],
        tags: ['LC-MS/MS', 'Química Analítica', 'BPL / INMETRO', 'Validação Analítica', 'P&D']
      }
    ];
  }

  return { getInitialSeedJobs, getDiscoverablePool, offsetDateISO };
});
