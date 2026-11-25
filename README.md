# EstágioOn // Engenharia Química — Uberlândia, MG

Aplicação web full-stack em **Dark Mode (Estilo Blueprint / Engenharia)** dedicada ao monitoramento e filtragem de vagas de estágio em **Engenharia Química na cidade de Uberlândia — MG**.

## Principais Funcionalidades

- **Verificação Automática ao Abrir**: Toda vez que o site é aberto, o sistema dispara uma varredura (`POST /api/scan`) consultando a API pública de vagas em Uberlândia (Gupy) e a base industrial local verificada.
- **Informações Completas nos Cards**:
  - Bolsa-auxílio / Salário
  - Benefícios detalhados
  - Data de início das inscrições e prazo final (com contador regressivo de dias restantes)
  - Carga horária, modalidade, período exigido e **link direto para candidatura oficial**
- **Aba Expansível (Ficha Técnica & Dossiê da Empresa)**:
  - Ao clicar em qualquer vaga, o card se estende suavemente exibindo a **foto da planta industrial**, o **ramo de atuação**, **resumo institucional da empresa em Uberlândia**, escopo técnico de Engenharia Química, requisitos e etapas do processo seletivo.
- **Tag `"Novidade!"` Inteligente**:
  - Novas vagas surgem com o selo **`Novidade!`** no canto superior direito. Assim que você clica para visualizar os detalhes da vaga, a tag desaparece automaticamente e o status de leitura fica salvo.
- **Alertas Automáticos por E-mail**:
  - Cadastre seu e-mail para receber notificações automáticas sempre que uma nova vaga surgir. Inclui Caixa de Disparos auditável com pré-visualização do e-mail HTML e suporte opcional a envio externo via **Resend API** ou **SMTP TLS**.

## Como Executar

Basta dar dois cliques em **`iniciar.bat`** ou rodar no terminal:

```bash
node server.js
```

Acesse em seguida: **http://localhost:3450**
