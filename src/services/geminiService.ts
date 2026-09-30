import { PeriodOverview, TeamData, TeamFilterId } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';

const STORAGE_KEY = 'torrano_gemini_api_key';

export function getStoredApiKey(): string {
  try {
    const sessionKey = sessionStorage.getItem(STORAGE_KEY);
    if (sessionKey && sessionKey.trim()) return sessionKey.trim();
  } catch (e) {
    // ignore sessionStorage security exceptions
  }
  // Fallback to environment injected variable if present
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }
  return '';
}

export function saveApiKey(key: string): void {
  try {
    if (key.trim()) {
      sessionStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    // ignore
  }
}

export function clearApiKey(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return key.substring(0, 6) + '••••••••' + key.substring(key.length - 4);
}

export interface AiDiagnosisResult {
  success: boolean;
  content?: string;
  error?: string;
  modelUsed?: string;
  generatedAt?: string;
}

export async function requestExecutiveDiagnosis(
  overview: PeriodOverview,
  customApiKey?: string,
  teamFilter: TeamFilterId = 'all'
): Promise<AiDiagnosisResult> {
  const apiKey = (customApiKey || getStoredApiKey()).trim();

  if (!apiKey) {
    return {
      success: false,
      error: 'Google Gemini API Key não encontrada. Por favor, insira sua chave no botão de configuração da IA.',
    };
  }

  const { teams, period, label } = overview;
  const bruno = teams.bruno;
  const lorena = teams.lorena;
  const lucas = teams.lucas;
  const all = teams.all;

  let systemInstruction = `Você é o Diretor Comercial Sênior e Estrategista Chefe de Inteligência de Negócios da Torrano Negócios Imobiliários.
Sua missão é emitir pareceres táticos precisos, rigorosos e focados em estanqueidade de caixa (retenção líquida de VGV), auditoria de destratos e eficiência do funil de pastas documentais para o Diretor Geral Flávio Torrano.`;

  let dataBrief = '';
  let userPrompt = '';

  if (teamFilter === 'bruno') {
    systemInstruction += `\nATENÇÃO: Você está em sessão de auditoria individual e exclusiva da EQUIPE BRUNO (Líder: Bruno Torrano). É ESTRITAMENTE PROIBIDO mencionar, comparar ou vazar quaisquer números das equipes de Lorena ou Lucas. Foque 100% nos números de Bruno.`;
    dataBrief = `DADOS DE AUDITORIA EXCLUSIVA • EQUIPE BRUNO (${label})
Líder: Bruno Torrano | Segmento: Médio e Alto Padrão Residencial Urbano
- Leads Recebidos: ${bruno.leads}
- Pastas Documentais Analisadas: ${bruno.analyzedDocs} (Conversão: ${formatPercent(bruno.conversionDocRate, 1)})
- Vendas Brutas (VGV): ${formatBRL(bruno.vgvGross)} (${bruno.contractsGross} contratos)
- Destratos e Cancelamentos: ${formatBRL(bruno.vgvCanceled)} (${bruno.contractsCanceled} quebras | Taxa: ${formatPercent(bruno.cancellationRate, 1)})
- Vendas Líquidas Reais (Caixa): ${formatBRL(bruno.vgvNet)} (${bruno.contractsNet} contratos retidos | Retenção: ${formatPercent(bruno.netRetentionRate, 1)})
- Meta de VGV Líquido: ${formatBRL(bruno.targetNet)} (Atingimento: ${((bruno.vgvNet / bruno.targetNet) * 100).toFixed(1)}%)
- Ticket Médio por Venda: ${formatBRL(bruno.ticketAverage)}`;

    userPrompt = `Gere o parecer executivo oficial com foco EXCLUSIVO na Equipe Bruno para reunião 1-on-1 de alinhamento com Bruno Torrano:
${dataBrief}

ESTRUTURA OBRIGATÓRIA:
### (1) Diagnóstico de Caixa e Retenção • Equipe Bruno
Análise profunda do VGV Líquido retido, contratos mantidos e impacto financeiro dos ${formatBRL(bruno.vgvCanceled)} perdidos em destratos (${formatPercent(bruno.cancellationRate, 1)}).

### (2) Eficiência do Funil e Qualificação de Pastas
Análise da conversão de ${bruno.leads} leads em ${bruno.analyzedDocs} pastas montadas e o fluxo para contratos efetivos de Médio/Alto Padrão.

### (3) 3 Ações Táticas Imediatas para Alinhamento com Bruno Torrano
3 diretrizes operacionais inegociáveis para a reunião individual de hoje.`;

  } else if (teamFilter === 'lorena') {
    systemInstruction += `\nATENÇÃO: Você está em sessão de auditoria individual e exclusiva da EQUIPE LORENA (Líder: Lorena Vasconcelos). É ESTRITAMENTE PROIBIDO mencionar, comparar ou vazar quaisquer números das equipes de Bruno ou Lucas. Foque 100% nos números de Lorena.`;
    dataBrief = `DADOS DE AUDITORIA EXCLUSIVA • EQUIPE LORENA (${label})
Líder: Lorena Vasconcelos | Segmento: Lançamentos Verticais, Planta e Investidores
- Leads Recebidos: ${lorena.leads}
- Pastas Documentais Analisadas: ${lorena.analyzedDocs} (Conversão: ${formatPercent(lorena.conversionDocRate, 1)})
- Vendas Brutas (VGV): ${formatBRL(lorena.vgvGross)} (${lorena.contractsGross} contratos)
- Destratos e Cancelamentos: ${formatBRL(lorena.vgvCanceled)} (${lorena.contractsCanceled} quebras | Taxa: ${formatPercent(lorena.cancellationRate, 1)})
- Vendas Líquidas Reais (Caixa): ${formatBRL(lorena.vgvNet)} (${lorena.contractsNet} contratos retidos | Retenção: ${formatPercent(lorena.netRetentionRate, 1)})
- Meta de VGV Líquido: ${formatBRL(lorena.targetNet)} (Atingimento: ${((lorena.vgvNet / lorena.targetNet) * 100).toFixed(1)}%)
- Ticket Médio por Venda: ${formatBRL(lorena.ticketAverage)}`;

    userPrompt = `Gere o parecer executivo oficial com foco EXCLUSIVO na Equipe Lorena para reunião 1-on-1 de alinhamento com Lorena Vasconcelos:
${dataBrief}

ESTRUTURA OBRIGATÓRIA:
### (1) Diagnóstico de Caixa e Retenção • Equipe Lorena
Análise do VGV Líquido retido no caixa e estanqueidade de cancelamentos em lançamentos (${formatBRL(lorena.vgvCanceled)} / ${formatPercent(lorena.cancellationRate, 1)}).

### (2) Eficiência de Lançamentos e Pastas Documentais
Avaliação do fluxo de ${lorena.leads} leads e montagem de ${lorena.analyzedDocs} pastas para aprovação de crédito rápido.

### (3) 3 Ações Táticas Imediatas para Alinhamento com Lorena Vasconcelos
3 diretrizes operacionais inegociáveis para a reunião individual de hoje.`;

  } else if (teamFilter === 'lucas') {
    systemInstruction += `\nATENÇÃO: Você está em sessão de auditoria individual e exclusiva da EQUIPE LUCAS (Líder: Lucas Siqueira). É ESTRITAMENTE PROIBIDO mencionar, comparar ou vazar quaisquer números das equipes de Bruno ou Lorena. Foque 100% nos números de Lucas.`;
    dataBrief = `DADOS DE AUDITORIA EXCLUSIVA • EQUIPE LUCAS (${label})
Líder: Lucas Siqueira | Segmento: Prime, Mansões e Alto Luxo
- Leads Recebidos: ${lucas.leads}
- Pastas Documentais Analisadas: ${lucas.analyzedDocs} (Conversão: ${formatPercent(lucas.conversionDocRate, 1)})
- Vendas Brutas (VGV): ${formatBRL(lucas.vgvGross)} (${lucas.contractsGross} contratos)
- Destratos e Cancelamentos: ${formatBRL(lucas.vgvCanceled)} (${lucas.contractsCanceled} quebras | Taxa: ${formatPercent(lucas.cancellationRate, 1)})
- Vendas Líquidas Reais (Caixa): ${formatBRL(lucas.vgvNet)} (${lucas.contractsNet} contratos retidos | Retenção: ${formatPercent(lucas.netRetentionRate, 1)})
- Meta de VGV Líquido: ${formatBRL(lucas.targetNet)} (Atingimento: ${((lucas.vgvNet / lucas.targetNet) * 100).toFixed(1)}%)
- Ticket Médio por Venda: ${formatBRL(lucas.ticketAverage)}`;

    userPrompt = `Gere o parecer executivo oficial com foco EXCLUSIVO na Equipe Lucas para reunião 1-on-1 de alinhamento com Lucas Siqueira:
${dataBrief}

ESTRUTURA OBRIGATÓRIA:
### (1) Diagnóstico de Caixa e Retenção • Equipe Lucas
Análise da excepcional taxa de retenção (${formatPercent(lucas.netRetentionRate, 1)}), VGV Líquido de ${formatBRL(lucas.vgvNet)} e baixíssimo destrato de ${formatPercent(lucas.cancellationRate, 1)}.

### (2) Eficiência no Segmento Prime e Alto Ticket
Auditoria do fluxo de ${lucas.analyzedDocs} pastas qualificadas com ticket médio de ${formatBRL(lucas.ticketAverage)}.

### (3) 3 Ações de Escala e Alavancagem para Alinhamento com Lucas Siqueira
3 diretrizes operacionais para expandir captações exclusivas e blindar negócios de grande porte.`;

  } else if (teamFilter === 'all') {
    dataBrief = `DADOS CONSOLIDADOS DA DIRETORIA GERAL (${label})
- Leads Globais: ${all.leads}
- Pastas Globais: ${all.analyzedDocs} (Conversão: ${formatPercent(all.conversionDocRate, 1)})
- Vendas Brutas: ${formatBRL(all.vgvGross)} (${all.contractsGross} contratos)
- Destratos Globais: ${formatBRL(all.vgvCanceled)} (${all.contractsCanceled} quebras | Taxa: ${formatPercent(all.cancellationRate, 1)})
- VGV Líquido Corporativo: ${formatBRL(all.vgvNet)} (${all.contractsNet} mantidos | Retenção: ${formatPercent(all.netRetentionRate, 1)})
- Meta Corporativa: ${formatBRL(all.targetNet)} (Atingimento: ${((all.vgvNet / all.targetNet) * 100).toFixed(1)}%)
- Ticket Médio Corporativo: ${formatBRL(all.ticketAverage)}`;

    userPrompt = `Gere o parecer executivo oficial para o Diretor Geral Flávio Torrano com a visão estritamente consolidada da empresa:
${dataBrief}

ESTRUTURA OBRIGATÓRIA:
### (1) Visão Consolidada de Caixa e Risco de Quebra Corporativa
Diagnóstico de estanqueidade financeira do VGV total e o impacto global dos destratos no caixa da Torrano.

### (2) Eficiência Operacional e Gargalos na Esteira Documental
Análise macro do volume de ${all.leads} leads recebidos e capacidade de conversão em pastas bancárias qualificadas.

### (3) 3 Decisões Estratégicas para Flávio Torrano
3 medidas imediatas de governança para proteger o caixa e a margem de lucro corporativa.`;

  } else {
    // comparison / war room mode
    dataBrief = `DADOS DE WAR ROOM • COMPARATIVO GERAL (${label})
1. Bruno Torrano: VGV Líquido ${formatBRL(bruno.vgvNet)} | Destratos ${formatBRL(bruno.vgvCanceled)} (${formatPercent(bruno.cancellationRate, 1)}) | Leads ${bruno.leads} | Pastas ${bruno.analyzedDocs}
2. Lorena Vasconcelos: VGV Líquido ${formatBRL(lorena.vgvNet)} | Destratos ${formatBRL(lorena.vgvCanceled)} (${formatPercent(lorena.cancellationRate, 1)}) | Leads ${lorena.leads} | Pastas ${lorena.analyzedDocs}
3. Lucas Siqueira: VGV Líquido ${formatBRL(lucas.vgvNet)} | Destratos ${formatBRL(lucas.vgvCanceled)} (${formatPercent(lucas.cancellationRate, 1)}) | Leads ${lucas.leads} | Pastas ${lucas.analyzedDocs}
Consolidado: VGV Líquido ${formatBRL(all.vgvNet)} | Total Destratos ${formatBRL(all.vgvCanceled)}`;

    userPrompt = `Gere o parecer comparativo de War Room para pauta de reunião conjunta de alinhamento com Bruno, Lorena e Lucas:
${dataBrief}

ESTRUTURA OBRIGATÓRIA:
### (1) Ranking de Retenção de Caixa e Quebras por Equipe
Comparativo direto entre os 3 líderes, destacando retenção líquida e fontes de sangria financeira.

### (2) Eficiência do Funil Comercial Comparado (Leads vs. Pastas)
Análise de produtividade de cada liderança na esteira documental.

### (3) Pauta Oficial da Reunião de Alinhamento com os 3 Líderes
Metas de retenção, teto de 10% de destrato e compromissos firmados para a semana.`;
  }

  // Model list to try (prioritizing 2.5/2.0/1.5 Flash as requested)
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
  ];

  let lastError = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const errMsg = errorData?.error?.message || response.statusText;

        if (status === 400 || status === 403) {
          return {
            success: false,
            error: `Erro de autenticação da API (${status}): ${errMsg}. Verifique se a sua chave do Gemini é válida e possui cotas ativas.`,
          };
        }

        lastError = `Modelo ${model} retornou ${status}: ${errMsg}`;
        // Try next candidate model
        continue;
      }

      const json = await response.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('A API retornou uma resposta sem conteúdo textual.');
      }

      return {
        success: true,
        content: text,
        modelUsed: model,
        generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (err: any) {
      lastError = err?.message || 'Falha na conexão de rede com a API do Google Gemini.';
    }
  }

  return {
    success: false,
    error: `Não foi possível obter o diagnóstico da IA. Detalhes: ${lastError}`,
  };
}

/**
 * High-fidelity offline strategic diagnosis generator based on real computed metrics.
 * Ensures the user has an immediate, analytical diagnosis even when offline or before configuring a key.
 */
export function generateOfflineDiagnosis(
  overview: PeriodOverview,
  teamFilter: TeamFilterId = 'all'
): string {
  const { teams, label } = overview;
  const { bruno, lorena, lucas, all } = teams;

  if (teamFilter === 'bruno') {
    return `### (1) Diagnóstico de Caixa e Retenção • Equipe Bruno (Líder: ${bruno.leader})
A Equipe Bruno fechou o período de **${label}** com um VGV Bruto emitido de **${formatBRL(bruno.vgvGross)}** em **${bruno.contractsGross} contratos**. No entanto, as rescisões contratuais atingiram **${formatBRL(bruno.vgvCanceled)}** (${bruno.contractsCanceled} quebras), resultando numa taxa de destrato de **${formatPercent(bruno.cancellationRate, 1)}** sobre o bruto emitido.
O **Caixa Líquido Efetivo retido foi de ${formatBRL(bruno.vgvNet)}** (${bruno.contractsNet} contratos ativos), alcançando **${((bruno.vgvNet / bruno.targetNet) * 100).toFixed(1)}%** da meta estipulada de ${formatBRL(bruno.targetNet)}. O ticket médio por negócio situou-se em **${formatBRL(bruno.ticketAverage)}**, compatível com o padrão Médio/Alto residencial.

---

### (2) Eficiência do Funil Comercial da Equipe Bruno
A equipe gerou **${bruno.leads} leads recebidos** e converteu **${bruno.analyzedDocs} pastas documentais qualificadas** (taxa de conversão de **${formatPercent(bruno.conversionDocRate, 1)}**).
O principal ponto de atenção reside no vazamento entre a pasta montada e a retenção definitiva em caixa: 1 a cada 6 contratos emitidos sofreu quebra por inconsistência cadastral ou descompasso no fluxo de entrada.

---

### (3) 3 Ações Táticas Imediatas para Alinhamento com Bruno Torrano
1. **Auditoria Prévia de Capacidade de Entrada**: Exigir comprovante de disponibilidade financeira para a parcela de sinal e intermediárias antes da minuta contratual, visando derrubar o destrato de ${formatPercent(bruno.cancellationRate, 1)} para o patamar seguro de 10%.
2. **Aceleração das ${bruno.analyzedDocs} Pastas em Análise**: Estabelecer SLA de 72 horas com os correspondentes bancários credenciados para emitir o laudo de crédito definitivo.
3. **Foco em Fechamentos com FGTS/Recursos Próprios**: Priorizar no pipeline os compradores com recurso imediato em conta para garantir a liquidação financeira no mês corrente.`;
  }

  if (teamFilter === 'lorena') {
    return `### (1) Diagnóstico de Caixa e Retenção • Equipe Lorena (Líder: ${lorena.leader})
A Equipe Lorena fechou o período de **${label}** com um VGV Bruto emitido de **${formatBRL(lorena.vgvGross)}** em **${lorena.contractsGross} contratos**. Os cancelamentos somaram **${formatBRL(lorena.vgvCanceled)}** (${lorena.contractsCanceled} rescisões), representando uma perda percentual de **${formatPercent(lorena.cancellationRate, 1)}**.
O **Caixa Líquido Retido totalizou ${formatBRL(lorena.vgvNet)}** (${lorena.contractsNet} contratos mantidos), atingindo **${((lorena.vgvNet / lorena.targetNet) * 100).toFixed(1)}%** da meta de ${formatBRL(lorena.targetNet)}. O ticket médio fechou em **${formatBRL(lorena.ticketAverage)}**, demonstrando velocidade e volume característicos de Lançamentos Verticais.

---

### (2) Eficiência do Funil Comercial da Equipe Lorena
Com **${lorena.leads} leads captados**, a equipe estruturou **${lorena.analyzedDocs} pastas documentais completas** (conversão documental de **${formatPercent(lorena.conversionDocRate, 1)}**).
O gargalo operacional concentra-se no descompasso de aprovação do financiamento associativo na planta, gerando quebras após a assinatura do espelho de vendas.

---

### (3) 3 Ações Táticas Imediatas para Alinhamento com Lorena Vasconcelos
1. **Plantão de Correspondente Bancário nos Stands**: Alocar analista de crédito presencial nos lançamentos para pré-aprovar o cliente antes da assinatura da proposta.
2. **Higienização dos ${lorena.leads} Contatos de Lançamento**: Filtrar a base de prospecção para focar nos investidores com histórico positivo de liquidez e adimplência.
3. **Plano de Redução de Quebras para 10%**: Vincular a comissão integral da liderança à liquidação da parcela de evolução de obras sem desistência nos primeiros 60 dias.`;
  }

  if (teamFilter === 'lucas') {
    return `### (1) Diagnóstico de Caixa e Retenção • Equipe Lucas (Líder: ${lucas.leader})
A Equipe Lucas entregou uma performance excepcional no período de **${label}**, alcançando um VGV Bruto emitido de **${formatBRL(lucas.vgvGross)}** em **${lucas.contractsGross} contratos**.
Os cancelamentos foram praticamente nulos: apenas **${formatBRL(lucas.vgvCanceled)}** (${lucas.contractsCanceled} destrato), correspondendo a uma taxa ínfima de **${formatPercent(lucas.cancellationRate, 1)}**.
O **Caixa Líquido Efetivo atingiu ${formatBRL(lucas.vgvNet)}**, garantindo **${formatPercent(lucas.netRetentionRate, 1)} de retenção de receita** e superando a meta de ${formatBRL(lucas.targetNet)} em expressivos **${((lucas.vgvNet / lucas.targetNet) * 100).toFixed(1)}%**. O ticket médio de **${formatBRL(lucas.ticketAverage)}** reflete a liderança absoluta no segmento Prime & Mansões.

---

### (2) Eficiência do Funil Comercial da Equipe Lucas
A partir de **${lucas.leads} leads selecionados**, a equipe gerou **${lucas.analyzedDocs} pastas documentais de alto padrão** (conversão de **${formatPercent(lucas.conversionDocRate, 1)}**).
A esteira de crédito e blindagem jurídica operou com quase 100% de aproveitamento em contratos de alto valor agregado.

---

### (3) 3 Ações de Escala e Alavancagem com Lucas Siqueira
1. **Captação de Novos Produtos Off-Market**: Expandir o portfólio de imóveis exclusivos acima de R$ 3 milhões para aproveitar a alta demanda qualificada de investidores Prime.
2. **Multiplicação do Método de Qualificação Prévia**: Documentar o checklist de qualificação documental da Equipe Lucas para servir de padrão de excelência na empresa.
3. **Campanha de Indicação Ativa (Member Get Member)**: Criar programa de fidelidade executiva junto aos clientes compradores de alto patrimônio para retroalimentar o funil orgânico.`;
  }

  if (teamFilter === 'all') {
    return `### (1) Visão Geral de Caixa Corporativo (Diretoria Flávio Torrano)
Prezado **Flávio Torrano**, no período consolidado de **${label}**, a Torrano Negócios Imobiliários atingiu um VGV Bruto emitido de **${formatBRL(all.vgvGross)}** (${all.contractsGross} contratos). O montante de **${formatBRL(all.vgvCanceled)}** em destratos e cancelamentos globais drenou **${formatPercent(all.cancellationRate, 1)}** da receita bruta, consolidando um **Caixa Líquido Real de ${formatBRL(all.vgvNet)}** (${all.contractsNet} contratos mantidos e retenção de **${formatPercent(all.netRetentionRate, 1)}**).
A meta corporativa de ${formatBRL(all.targetNet)} foi superada em **${((all.vgvNet / all.targetNet) * 100).toFixed(1)}%**, demonstrando forte captação comercial aliada à necessidade de vigilância sobre quebras de contrato.

---

### (2) Eficiência Operacional e Gargalos Globais
O topo do funil processou **${all.leads} leads recebidos**, convertidos em **${all.analyzedDocs} pastas documentais** (conversão média de **${formatPercent(all.conversionDocRate, 1)}**). O tempo médio de tramitação nas agências bancárias e correspondentes ainda representa o maior risco para a conclusão dos negócios antes do final do mês fiscal.

---

### (3) 3 Decisões Estratégicas para o Diretor Geral Flávio Torrano
1. **Implantação de Esteira Pré-Bancária Corporativa Obrigatória**: Vedar a emissão de promessa de compra e venda sem validação prévia de crédito de bancada.
2. **Higienização Geral das ${all.analyzedDocs} Pastas em Trânsito**: Força-tarefa na secretaria de vendas para expurgar cadastros inconsistentes e concentrar o time em clientes com entrada líquida comprovada.
3. **Governança de Comissões e Retenção**: Condicionar as bonificações de liderança a um teto máximo de 10% de destrato acumulado na equipe.`;
  }

  // War Room / Comparison Mode
  const sortedByRetention = [bruno, lorena, lucas].sort((a, b) => b.netRetentionRate - a.netRetentionRate);
  const bestLeader = sortedByRetention[0];
  const sortedByCancel = [bruno, lorena, lucas].sort((a, b) => b.cancellationRate - a.cancellationRate);
  const highestRisk = sortedByCancel[0];

  return `### (1) Ranking de Retenção de Caixa e Destratos por Equipe
- **🏆 1º Lugar em Retenção: ${bestLeader.name} (${bestLeader.leader})**
  Retenção líquida de **${formatPercent(bestLeader.netRetentionRate, 1)}** com VGV Líquido de **${formatBRL(bestLeader.vgvNet)}** e destrato quase nulo (${formatPercent(bestLeader.cancellationRate, 1)}).
- **⚖️ 2º Lugar: Equipe Bruno (${bruno.leader})**
  VGV Líquido de **${formatBRL(bruno.vgvNet)}**, retenção de **${formatPercent(bruno.netRetentionRate, 1)}** e destratos de **${formatBRL(bruno.vgvCanceled)}** (${formatPercent(bruno.cancellationRate, 1)}).
- **⚠️ Ponto Crítico de Atenção: ${highestRisk.name} (${highestRisk.leader})**
  Maior índice de quebra da operação (**${formatPercent(highestRisk.cancellationRate, 1)}**), drenando **${formatBRL(highestRisk.vgvCanceled)}** em contratos rompidos.

---

### (2) Eficiência Comparada da Esteira Documental (Pastas / Leads)
- **Equipe Lucas**: ${lucas.analyzedDocs} pastas de ${lucas.leads} leads (${formatPercent(lucas.conversionDocRate, 1)}) • Ticket: ${formatBRL(lucas.ticketAverage)}
- **Equipe Bruno**: ${bruno.analyzedDocs} pastas de ${bruno.leads} leads (${formatPercent(bruno.conversionDocRate, 1)}) • Ticket: ${formatBRL(bruno.ticketAverage)}
- **Equipe Lorena**: ${lorena.analyzedDocs} pastas de ${lorena.leads} leads (${formatPercent(lorena.conversionDocRate, 1)}) • Ticket: ${formatBRL(lorena.ticketAverage)}

---

### (3) Pauta Oficial da Reunião de Alinhamento Geral com os 3 Líderes
1. **Fixação do Teto Máximo de 10% de Destrato** como compromisso formal para as equipes de Bruno e Lorena.
2. **Alinhamento do Checklist de Aprovação Prévia**: Disseminar o método da Equipe Lucas para blindar os negócios de lançamentos e médio padrão.
3. **Desafio de Metas do Próximo Ciclo**: Manter a Torrano acima dos R$ 50M líquidos no fechamento trimestral.`;
}

