import { PeriodOverview, TeamData, TeamFilterId } from '../types';
import { formatBRL, formatPercent, formatNumber } from './formatters';

export interface TacticalReview {
  teamName: string;
  leaderName: string;
  roleTitle: string;
  periodLabel: string;
  topic1Performance: string;
  topic2Bottleneck: string;
  topic3NextStep: string;
  statusBadge: {
    label: string;
    variant: 'success' | 'warning' | 'danger';
  };
}

export function getTacticalReview(
  overview: PeriodOverview,
  teamFilter: TeamFilterId
): TacticalReview {
  const { teams, label, period } = overview;
  const { bruno, lorena, lucas, all } = teams;

  const isDaily = period === 'day';
  const isWeekly = period === 'week';
  const isQuarterly = period === 'quarter';
  const isYearly = period === 'year';

  if (teamFilter === 'bruno') {
    const goalPercent = (bruno.vgvNet / bruno.targetNet) * 100;
    
    if (isDaily) {
      return {
        teamName: 'Equipe Bruno',
        leaderName: 'Bruno Torrano',
        roleTitle: 'Coordenador · Médio e Alto Padrão Urbano',
        periodLabel: label,
        statusBadge: {
          label: bruno.contractsNet > 0 ? 'Tração do Dia Garantida' : 'Plantão em Andamento',
          variant: bruno.contractsNet > 0 ? 'success' : 'warning',
        },
        topic1Performance: `Tração imediata de hoje: ${bruno.leads} novos leads recebidos, ${bruno.analyzedDocs} pastas recolhidas no plantão e 1 fechamento consolidado em ${formatBRL(bruno.vgvNet)} (${goalPercent.toFixed(0)}% da meta diária de ${formatBRL(bruno.targetNet)}).`,
        topic2Bottleneck: `Gargalo do dia: ${bruno.leads - bruno.analyzedDocs} leads aguardam primeiro contato telefônico da equipe. Risco de esfriamento nas primeiras 2 horas da captação.`,
        topic3NextStep: `Cobrar de Bruno o contato obrigatório com 100% dos ${bruno.leads} leads do dia até as 19h e protocolar as ${bruno.analyzedDocs} pastas no correspondente ainda hoje.`,
      };
    }

    if (isWeekly) {
      return {
        teamName: 'Equipe Bruno',
        leaderName: 'Bruno Torrano',
        roleTitle: 'Coordenador · Médio e Alto Padrão Urbano',
        periodLabel: label,
        statusBadge: {
          label: goalPercent >= 100 ? 'Meta Semanal Batida' : 'Ritmo em Atenção',
          variant: goalPercent >= 100 ? 'success' : 'warning',
        },
        topic1Performance: `Ritmo semanal: VGV Líquido retido de ${formatBRL(bruno.vgvNet)} em ${bruno.contractsNet} contratos (${goalPercent.toFixed(1)}% da meta semanal de ${formatBRL(bruno.targetNet)}). ${bruno.leads} leads movimentados na semana.`,
        topic2Bottleneck: `1 cancelamento de contrato registrado na semana (${formatBRL(bruno.vgvCanceled)} drenados). A quebra ocorreu na fase de emissão do contrato por divergência na entrada.`,
        topic3NextStep: `Sprint de fechamento até sexta-feira com foco em acelerar a aprovação das ${bruno.analyzedDocs} pastas em análise para converter ao menos 2 novos contratos.`,
      };
    }

    if (isQuarterly || isYearly) {
      return {
        teamName: 'Equipe Bruno',
        leaderName: 'Bruno Torrano',
        roleTitle: 'Coordenador · Médio e Alto Padrão Urbano',
        periodLabel: label,
        statusBadge: {
          label: goalPercent >= 100 ? 'Consistência de Longo Prazo' : 'Recuperação Necessária',
          variant: goalPercent >= 100 ? 'success' : 'warning',
        },
        topic1Performance: `Visão macro (${label}): VGV Líquido acumulado de ${formatBRL(bruno.vgvNet)} em ${bruno.contractsNet} contratos retidos (${goalPercent.toFixed(1)}% da meta de ${formatBRL(bruno.targetNet)}). Ticket médio sólido de ${formatBRL(bruno.ticketAverage)}.`,
        topic2Bottleneck: `Perda acumulada de ${formatBRL(bruno.vgvCanceled)} em destratos (${formatPercent(bruno.cancellationRate, 1)} de quebra histórica). Sangria de margem considerável que exige protocolo mais rígido de sinal.`,
        topic3NextStep: `Instituir comitê de crédito interno com Bruno para exigir pré-aprovação bancária antes da assinatura da minuta, blindando o caixa da Torrano contra quebras futuras.`,
      };
    }

    // Default Monthly
    return {
      teamName: 'Equipe Bruno',
      leaderName: 'Bruno Torrano',
      roleTitle: 'Coordenador · Médio e Alto Padrão Urbano',
      periodLabel: label,
      statusBadge: {
        label: goalPercent >= 100 ? 'Meta Atingida' : 'Atenção a Metas',
        variant: goalPercent >= 100 ? 'success' : 'warning',
      },
      topic1Performance: `Fechamento com VGV Líquido de ${formatBRL(bruno.vgvNet)} em ${bruno.contractsNet} contratos mantidos (${goalPercent.toFixed(1)}% da meta de ${formatBRL(bruno.targetNet)}). Ticket médio sólido de ${formatBRL(bruno.ticketAverage)}.`,
      topic2Bottleneck: `Destratos de ${formatBRL(bruno.vgvCanceled)} (${formatPercent(bruno.cancellationRate, 1)} sobre o faturamento emitido, totalizando ${bruno.contractsCanceled} quebras). O vazamento ocorre antes da integralização do sinal.`,
      topic3NextStep: `Cobrar do coordenador a auditoria rigorosa de disponibilidade de sinal antes da minuta contratual e SLA de 72h junto ao correspondente para liberar as ${formatNumber(bruno.analyzedDocs)} pastas em análise.`,
    };
  }

  if (teamFilter === 'lorena') {
    const goalPercent = (lorena.vgvNet / lorena.targetNet) * 100;

    if (isDaily) {
      return {
        teamName: 'Equipe Lorena',
        leaderName: 'Lorena Vasconcelos',
        roleTitle: 'Coordenadora · Lançamentos Verticais & Planta',
        periodLabel: label,
        statusBadge: {
          label: 'Foco em Triagem nos Stands',
          variant: 'warning',
        },
        topic1Performance: `Volume de hoje: ${lorena.leads} leads gerados em campanhas digitais e 1 contrato em espelho de vendas (${formatBRL(lorena.vgvNet)} líquidos).`,
        topic2Bottleneck: `Gargalo diário: das 6 pastas documentais montadas hoje, 3 não possuem validação preliminar de crédito na planta.`,
        topic3NextStep: `Impor que Lorena coloque o analista bancário nos stands de atendimento para pré-aprovar as pastas antes do fechamento do espelho de vendas hoje.`,
      };
    }

    if (isWeekly) {
      return {
        teamName: 'Equipe Lorena',
        leaderName: 'Lorena Vasconcelos',
        roleTitle: 'Coordenadora · Lançamentos Verticais & Planta',
        periodLabel: label,
        statusBadge: {
          label: lorena.cancellationRate > 12 ? 'Risco Alto em Destratos' : 'Estável',
          variant: lorena.cancellationRate > 12 ? 'danger' : 'warning',
        },
        topic1Performance: `VGV Líquido da semana de ${formatBRL(lorena.vgvNet)} em ${lorena.contractsNet} contratos mantidos (${goalPercent.toFixed(1)}% da meta semanal de ${formatBRL(lorena.targetNet)}).`,
        topic2Bottleneck: `Destrato recente de ${formatBRL(lorena.vgvCanceled)} na semana (${formatPercent(lorena.cancellationRate, 1)} de quebra). Reprovações no crédito associativo continuam drenando contratos emitidos.`,
        topic3NextStep: `Reunir a equipe para filtrar os investidores e revisar os 42 dossiês em esteira para garantir a emissão de mais 2 contratos antes de sábado.`,
      };
    }

    if (isQuarterly || isYearly) {
      return {
        teamName: 'Equipe Lorena',
        leaderName: 'Lorena Vasconcelos',
        roleTitle: 'Coordenadora · Lançamentos Verticais & Planta',
        periodLabel: label,
        statusBadge: {
          label: 'Auditoria Estrutural de Quebras',
          variant: 'danger',
        },
        topic1Performance: `Acumulado ${label}: ${formatNumber(lorena.leads)} leads prospectados e VGV Líquido de ${formatBRL(lorena.vgvNet)} (${goalPercent.toFixed(1)}% da meta de ${formatBRL(lorena.targetNet)}).`,
        topic2Bottleneck: `Gargalo crítico crônico: mais de ${formatBRL(lorena.vgvCanceled)} perdidos em destratos (${formatPercent(lorena.cancellationRate, 1)} de quebra). É a equipe com maior drenagem financeira da Torrano.`,
        topic3NextStep: `Revisar a política comercial de lançamentos: proibir reservas sem entrada integralizada e vincular o comissionamento à liberação da primeira medição do agente financeiro.`,
      };
    }

    // Default Monthly
    return {
      teamName: 'Equipe Lorena',
      leaderName: 'Lorena Vasconcelos',
      roleTitle: 'Coordenadora · Lançamentos Verticais & Planta',
      periodLabel: label,
      statusBadge: {
        label: lorena.cancellationRate > 12 ? 'Risco em Destratos' : 'Estável',
        variant: lorena.cancellationRate > 12 ? 'danger' : 'warning',
      },
      topic1Performance: `VGV Líquido retido de ${formatBRL(lorena.vgvNet)} em ${lorena.contractsNet} contratos (${goalPercent.toFixed(1)}% da meta de ${formatBRL(lorena.targetNet)}). Grande volume de prospecção com ${formatNumber(lorena.leads)} leads.`,
      topic2Bottleneck: `Gargalo crítico de destratos: perda de ${formatBRL(lorena.vgvCanceled)} em ${lorena.contractsCanceled} contratos rescindidos (${formatPercent(lorena.cancellationRate, 1)} de cancelamento). A sangria decorre de reprovações bancárias na planta.`,
      topic3NextStep: `Exigir a alocação imediata de analista presencial nos stands de lançamento para pré-aprovar clientes antes da assinatura da proposta, contendo as quebras para o teto de 10%.`,
    };
  }

  if (teamFilter === 'lucas') {
    const goalPercent = (lucas.vgvNet / lucas.targetNet) * 100;

    if (isDaily) {
      return {
        teamName: 'Equipe Lucas',
        leaderName: 'Lucas Siqueira',
        roleTitle: 'Coordenador · Imóveis Prime, Mansões & Comerciais',
        periodLabel: label,
        statusBadge: {
          label: 'Excelente Ticket Médio',
          variant: 'success',
        },
        topic1Performance: `Dia de alta tração: ${lucas.leads} leads de alto padrão atendidos, 4 pastas VIP e fechamento de 1 contrato Prime de ${formatBRL(lucas.vgvNet)} (${goalPercent.toFixed(1)}% da meta diária).`,
        topic2Bottleneck: `Destratos zerados hoje. Gargalo pontual é a velocidade de agendamento de visitas com proprietários de mansões exclusivas.`,
        topic3NextStep: `Acelerar o envio das minutas contratuais para as 4 pastas montadas hoje e garantir a assinatura digital antes das 20h.`,
      };
    }

    if (isWeekly) {
      return {
        teamName: 'Equipe Lucas',
        leaderName: 'Lucas Siqueira',
        roleTitle: 'Coordenador · Imóveis Prime, Mansões & Comerciais',
        periodLabel: label,
        statusBadge: {
          label: 'Ritmo Acima da Meta',
          variant: 'success',
        },
        topic1Performance: `Ritmo semanal impecável: VGV Líquido de ${formatBRL(lucas.vgvNet)} em 5 contratos retidos (${goalPercent.toFixed(1)}% da meta semanal de ${formatBRL(lucas.targetNet)}).`,
        topic2Bottleneck: `Apenas ${formatBRL(lucas.vgvCanceled)} em cancelamentos. O principal desafio é renovar o estoque Prime de imóveis acima de R$ 3M.`,
        topic3NextStep: `Cobrar captação de 2 novas opções off-market em condomínios fechados para os compradores qualificados em espera.`,
      };
    }

    if (isQuarterly || isYearly) {
      return {
        teamName: 'Equipe Lucas',
        leaderName: 'Lucas Siqueira',
        roleTitle: 'Coordenador · Imóveis Prime, Mansões & Comerciais',
        periodLabel: label,
        statusBadge: {
          label: 'Liderança Absoluta no Ano',
          variant: 'success',
        },
        topic1Performance: `Desempenho histórico extraordinário (${label}): VGV Líquido de ${formatBRL(lucas.vgvNet)} retidos em caixa (${goalPercent.toFixed(1)}% da meta de ${formatBRL(lucas.targetNet)}). 90%+ de retenção líquida de receita.`,
        topic2Bottleneck: `Quebras mantidas em patamar saudável (~9%). O limite para expansão é a capacidade de atendimento individualizado dos clientes ultra-high-net-worth.`,
        topic3NextStep: `Estruturar programa de expansão da equipe com mais 2 consultores Prime treinados no método Lucas de blindagem contratual.`,
      };
    }

    // Default Monthly
    return {
      teamName: 'Equipe Lucas',
      leaderName: 'Lucas Siqueira',
      roleTitle: 'Coordenador · Imóveis Prime, Mansões & Comerciais',
      periodLabel: label,
      statusBadge: {
        label: 'Destaque de Performance',
        variant: 'success',
      },
      topic1Performance: `Excelente desempenho com VGV Líquido de ${formatBRL(lucas.vgvNet)}, superando a meta de ${formatBRL(lucas.targetNet)} em ${goalPercent.toFixed(1)}%. Alta eficiência com ticket Prime de ${formatBRL(lucas.ticketAverage)} e 92% de retenção líquida.`,
      topic2Bottleneck: `Destratos sob controle restrito (apenas ${formatBRL(lucas.vgvCanceled)} e ${formatPercent(lucas.cancellationRate, 1)} de quebra). O desafio é expandir o estoque exclusivo de imóveis acima de R$ 3 milhões.`,
      topic3NextStep: `Intensificar captações exclusivas off-market de mansões e documentar a metodologia documental da equipe para disseminar o checklist de excelência a Bruno e Lorena.`,
    };
  }

  // Consolidado Geral / War Room
  const totalGoalPercent = (all.vgvNet / all.targetNet) * 100;

  if (isDaily) {
    return {
      teamName: 'Diretoria Torrano (Consolidado)',
      leaderName: 'Flávio Torrano',
      roleTitle: 'Diretor Executivo & Presidente',
      periodLabel: label,
      statusBadge: {
        label: 'Operação do Dia no Azul',
        variant: 'success',
      },
      topic1Performance: `Fechamento diário corporativo: VGV Líquido de ${formatBRL(all.vgvNet)} gerado em 3 contratos retidos no dia (${totalGoalPercent.toFixed(0)}% da meta diária de ${formatBRL(all.targetNet)}). 47 leads e 16 pastas movimentadas hoje.`,
      topic2Bottleneck: `Gargalo diário: 31 leads de hoje ainda não receberam primeiro atendimento nas equipes. SLA de primeiro contato precisa ser cobrado dos coordenadores.`,
      topic3NextStep: `Cobrar dos 3 coordenadores no final do dia a prestação de contas dos contatos realizados e o status das 16 pastas abertas hoje.`,
    };
  }

  if (isWeekly) {
    return {
      teamName: 'Diretoria Torrano (Consolidado)',
      leaderName: 'Flávio Torrano',
      roleTitle: 'Diretor Executivo & Presidente',
      periodLabel: label,
      statusBadge: {
        label: totalGoalPercent >= 100 ? 'Meta Semanal Conquistada' : 'Atenção na Sexta-feira',
        variant: totalGoalPercent >= 100 ? 'success' : 'warning',
      },
      topic1Performance: `Semana corporativa sólida: VGV Líquido retido de ${formatBRL(all.vgvNet)} em ${all.contractsNet} contratos (${totalGoalPercent.toFixed(1)}% da meta semanal de ${formatBRL(all.targetNet)}).`,
      topic2Bottleneck: `Destratos semanais somam ${formatBRL(all.vgvCanceled)} (2 contratos rescindidos em Lorena e Bruno). Sangria pontual contida em 10% do faturamento semanal.`,
      topic3NextStep: `Alinhamento semanal com Bruno, Lorena e Lucas cobrando o sprint de sexta-feira para converter ao menos 5 contratos adicionais antes do fim da semana.`,
    };
  }

  if (isQuarterly || isYearly) {
    return {
      teamName: 'Diretoria Torrano (Consolidado)',
      leaderName: 'Flávio Torrano',
      roleTitle: 'Diretor Executivo & Presidente',
      periodLabel: label,
      statusBadge: {
        label: totalGoalPercent >= 100 ? 'Sustentabilidade de Caixa Sólida' : 'Ajuste de Governança',
        variant: totalGoalPercent >= 100 ? 'success' : 'warning',
      },
      topic1Performance: `Resultado macro (${label}): Torrano totaliza impressionantes ${formatBRL(all.vgvNet)} em VGV Líquido retido (${totalGoalPercent.toFixed(1)}% da meta corporativa de ${formatBRL(all.targetNet)}).`,
      topic2Bottleneck: `Sangria histórica acumulada de ${formatBRL(all.vgvCanceled)} em destratos gerais (${formatPercent(all.cancellationRate, 1)} de perda). A maior perda de margem de lucro anual está concentrada em lançamentos verticais.`,
      topic3NextStep: `Decisão de Diretoria para Flávio: unificar a política de crédito e contratação para todas as 3 frentes de vendas, exigindo comprovação prévia de capacidade de entrada e teto de 10% de destrato para o próximo ciclo.`,
    };
  }

  // Default Monthly
  return {
    teamName: 'Diretoria Torrano (Consolidado)',
    leaderName: 'Flávio Torrano',
    roleTitle: 'Diretor Executivo & Presidente',
    periodLabel: label,
    statusBadge: {
      label: totalGoalPercent >= 100 ? 'Operação no Azul' : 'Atenção Executiva',
      variant: totalGoalPercent >= 100 ? 'success' : 'warning',
    },
    topic1Performance: `VGV Líquido corporativo de ${formatBRL(all.vgvNet)} em ${all.contractsNet} contratos mantidos (${totalGoalPercent.toFixed(1)}% da meta global de ${formatBRL(all.targetNet)}). O período de ${label} demonstra captação robusta com ${formatNumber(all.leads)} leads e ${formatNumber(all.analyzedDocs)} pastas em análise.`,
    topic2Bottleneck: `Destratos consolidados de ${formatBRL(all.vgvCanceled)} (${formatPercent(all.cancellationRate, 1)} de quebra geral). A drenagem de receita bruta concentra-se majoritariamente na esteira de lançamentos da Equipe Lorena.`,
    topic3NextStep: `Pautar a Reunião Geral de Coordenadores cobrando metas individuais de retenção de caixa: blindagem de crédito para Lorena e aceleração das ${formatNumber(bruno.analyzedDocs)} pastas documentais de Bruno com correspondentes credenciados.`,
  };
}
