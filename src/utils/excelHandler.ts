import * as XLSX from 'xlsx';
import { TeamData, PeriodOverview, TeamId } from '../types';

export interface ExcelImportResult {
  success: boolean;
  message: string;
  rowCount?: number;
  teamsData?: Record<TeamId, TeamData>;
  missingColumns?: string[];
  foundColumns?: string[];
}

// Clean and normalize column names for fuzzy header matching
function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '_') // replace spaces and symbols with _
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Parse monetary or numeric values (handles "R$ 1.500.000,00", numbers, formatted strings)
function parseNumeric(val: any): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }
  if (!val) return 0;
  
  const str = String(val).trim();
  // Remove "R$", spaces, and replace Brazilian dots/commas
  // e.g. "R$ 19.600.000,00" -> "19600000.00"
  let cleanStr = str.replace(/[R$\s]/g, '');
  if (cleanStr.includes(',') && cleanStr.includes('.')) {
    cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
  } else if (cleanStr.includes(',')) {
    cleanStr = cleanStr.replace(',', '.');
  }
  
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

export async function parseExcelSpreadsheet(file: File): Promise<ExcelImportResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Read with SheetJS
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        message: 'A planilha fornecida não possui abas de dados legíveis.',
      };
    }

    // Read the first active sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return {
        success: false,
        message: `A aba "${sheetName}" está vazia ou não contém linhas de dados.`,
      };
    }

    // Inspect available headers from first row
    const rawKeys = Object.keys(rawRows[0]);
    const normalizedKeyMap: Record<string, string> = {};
    rawKeys.forEach((key) => {
      normalizedKeyMap[normalizeKey(key)] = key;
    });

    const normalizedKeys = Object.keys(normalizedKeyMap);

    // Required core concept columns:
    // Equipe, Leads, Documentos_Analisados, Vendas_Brutas, Destratos, Vendas_Liquidas
    const findMatchingKey = (candidates: string[]): string | null => {
      for (const cand of candidates) {
        if (normalizedKeyMap[cand]) return normalizedKeyMap[cand];
        const partial = normalizedKeys.find((k) => k.includes(cand));
        if (partial) return normalizedKeyMap[partial];
      }
      return null;
    };

    const keyTeam = findMatchingKey(['equipe', 'time', 'nome_equipe', 'equipe_comercial']);
    const keyLeads = findMatchingKey(['leads', 'leads_recebidos', 'volume_leads', 'total_leads']);
    const keyDocs = findMatchingKey(['documentos_analisados', 'pastas_analisadas', 'docs_analisados', 'documentos', 'pastas']);
    const keyGross = findMatchingKey(['vendas_brutas', 'vgv_bruto', 'vgv_bruto_rs', 'valor_bruto', 'venda_bruta']);
    const keyCanceled = findMatchingKey(['destratos', 'cancelamentos', 'vgv_cancelado', 'destrato', 'cancelamento']);
    const keyNet = findMatchingKey(['vendas_liquidas', 'vgv_liquido', 'vgv_liquido_rs', 'valor_liquido', 'venda_liquida']);

    // Optional fields
    const keyTarget = findMatchingKey(['meta_vgv_liquido', 'meta_liquida', 'meta', 'target_net', 'meta_vgv']);
    const keyContractsGross = findMatchingKey(['contratos_brutos', 'contratos', 'qtd_contratos', 'contratos_assinados']);
    const keyContractsCanceled = findMatchingKey(['contratos_cancelados', 'qtd_destratos', 'quebras']);

    // Validation
    const missing: string[] = [];
    if (!keyTeam) missing.push('Equipe');
    if (!keyLeads) missing.push('Leads');
    if (!keyDocs) missing.push('Documentos_Analisados');
    if (!keyGross) missing.push('Vendas_Brutas');
    if (!keyCanceled) missing.push('Destratos');
    // Note: if Vendas_Liquidas is missing, we can calculate (Vendas_Brutas - Destratos), but check
    if (!keyNet && !keyGross) missing.push('Vendas_Liquidas');

    if (missing.length > 0) {
      return {
        success: false,
        message: `Colunas obrigatórias não encontradas: ${missing.join(', ')}.`,
        missingColumns: missing,
        foundColumns: rawKeys,
      };
    }

    // Default metadata for teams
    const defaultMeta: Record<TeamId, { leader: string; description: string; target: number; ticket: number }> = {
      bruno: {
        leader: 'Bruno Torrano',
        description: 'Especialista em Médio e Alto Padrão Residencial Urbano',
        target: 16500000,
        ticket: 700000,
      },
      lorena: {
        leader: 'Lorena Vasconcelos',
        description: 'Lançamentos Verticais, Planta e Investidores',
        target: 15000000,
        ticket: 550000,
      },
      lucas: {
        leader: 'Lucas Siqueira',
        description: 'Imóveis Prime, Mansões, Condomínios Fechados e Comerciais',
        target: 22000000,
        ticket: 1150000,
      },
      all: {
        leader: 'Flávio Torrano (Diretoria Executiva)',
        description: 'Consolidação corporativa total da Torrano Negócios',
        target: 53500000,
        ticket: 760000,
      },
    };

    const teamAccumulators: Record<'bruno' | 'lorena' | 'lucas', Partial<TeamData>> = {
      bruno: { id: 'bruno', name: 'Equipe Bruno' },
      lorena: { id: 'lorena', name: 'Equipe Lorena' },
      lucas: { id: 'lucas', name: 'Equipe Lucas' },
    };

    let processedCount = 0;

    for (const row of rawRows) {
      const teamRaw = String(row[keyTeam!]).toLowerCase();
      let matchedTeamId: 'bruno' | 'lorena' | 'lucas' | null = null;

      if (teamRaw.includes('bruno') || teamRaw.includes('alpha') || teamRaw === 'a') {
        matchedTeamId = 'bruno';
      } else if (teamRaw.includes('lorena') || teamRaw.includes('beta') || teamRaw === 'b') {
        matchedTeamId = 'lorena';
      } else if (teamRaw.includes('lucas') || teamRaw.includes('gamma') || teamRaw === 'g') {
        matchedTeamId = 'lucas';
      }

      if (!matchedTeamId) continue;

      const leads = parseNumeric(row[keyLeads!]);
      const docs = parseNumeric(row[keyDocs!]);
      const gross = parseNumeric(row[keyGross!]);
      const canceled = parseNumeric(row[keyCanceled!]);
      let net = keyNet ? parseNumeric(row[keyNet]) : 0;
      if (!net || net === 0) {
        net = gross - canceled;
      }

      const target = keyTarget ? parseNumeric(row[keyTarget]) : defaultMeta[matchedTeamId].target;
      const contractsGross = keyContractsGross ? parseNumeric(row[keyContractsGross]) : Math.max(1, Math.round(gross / defaultMeta[matchedTeamId].ticket));
      const contractsCanceled = keyContractsCanceled ? parseNumeric(row[keyContractsCanceled]) : Math.round(canceled / (gross > 0 && contractsGross > 0 ? (gross / contractsGross) : defaultMeta[matchedTeamId].ticket));
      const contractsNet = Math.max(0, contractsGross - contractsCanceled);

      const targetAcc = teamAccumulators[matchedTeamId];
      targetAcc.leads = (targetAcc.leads || 0) + leads;
      targetAcc.analyzedDocs = (targetAcc.analyzedDocs || 0) + docs;
      targetAcc.vgvGross = (targetAcc.vgvGross || 0) + gross;
      targetAcc.vgvCanceled = (targetAcc.vgvCanceled || 0) + canceled;
      targetAcc.vgvNet = (targetAcc.vgvNet || 0) + net;
      targetAcc.contractsGross = (targetAcc.contractsGross || 0) + contractsGross;
      targetAcc.contractsCanceled = (targetAcc.contractsCanceled || 0) + contractsCanceled;
      targetAcc.contractsNet = (targetAcc.contractsNet || 0) + contractsNet;
      if (target > 0) targetAcc.targetNet = target;

      processedCount++;
    }

    if (processedCount === 0) {
      return {
        success: false,
        message: 'Nenhuma linha pôde ser associada a "Equipe Bruno", "Equipe Lorena" ou "Equipe Lucas". Verifique a coluna de Equipe.',
      };
    }

    // Calculate rates and build final TeamData objects
    const finalizeTeam = (id: 'bruno' | 'lorena' | 'lucas', acc: Partial<TeamData>): TeamData => {
      const leads = acc.leads || 0;
      const docs = acc.analyzedDocs || 0;
      const gross = acc.vgvGross || 0;
      const canceled = acc.vgvCanceled || 0;
      const net = acc.vgvNet || (gross - canceled);
      const contractsGross = acc.contractsGross || Math.max(1, Math.round(gross / defaultMeta[id].ticket));
      const contractsCanceled = acc.contractsCanceled || 0;
      const contractsNet = acc.contractsNet || Math.max(0, contractsGross - contractsCanceled);
      const targetNet = acc.targetNet || defaultMeta[id].target;

      const conversionDocRate = leads > 0 ? Number(((docs / leads) * 100).toFixed(2)) : 0;
      const conversionSalesRate = docs > 0 ? Number(((contractsGross / docs) * 100).toFixed(2)) : 0;
      const cancellationRate = gross > 0 ? Number(((canceled / gross) * 100).toFixed(2)) : 0;
      const netRetentionRate = gross > 0 ? Number(((net / gross) * 100).toFixed(2)) : 0;
      const ticketAverage = contractsGross > 0 ? Math.round(gross / contractsGross) : defaultMeta[id].ticket;

      return {
        id,
        name: id === 'bruno' ? 'Equipe Bruno' : id === 'lorena' ? 'Equipe Lorena' : 'Equipe Lucas',
        leader: defaultMeta[id].leader,
        leadDescription: defaultMeta[id].description,
        ticketAverage,
        leads,
        analyzedDocs: docs,
        contractsGross,
        contractsNet,
        contractsCanceled,
        vgvGross: gross,
        vgvCanceled: canceled,
        vgvNet: net,
        targetNet,
        conversionDocRate,
        conversionSalesRate,
        cancellationRate,
        netRetentionRate,
        previousVgvNet: Math.round(net * 0.9),
        previousLeads: Math.round(leads * 0.92),
        previousCanceled: Math.round(canceled * 1.05),
      };
    };

    const teamBruno = finalizeTeam('bruno', teamAccumulators.bruno);
    const teamLorena = finalizeTeam('lorena', teamAccumulators.lorena);
    const teamLucas = finalizeTeam('lucas', teamAccumulators.lucas);

    // Consolidated "all"
    const totalLeads = teamBruno.leads + teamLorena.leads + teamLucas.leads;
    const totalDocs = teamBruno.analyzedDocs + teamLorena.analyzedDocs + teamLucas.analyzedDocs;
    const totalGross = teamBruno.vgvGross + teamLorena.vgvGross + teamLucas.vgvGross;
    const totalCanceled = teamBruno.vgvCanceled + teamLorena.vgvCanceled + teamLucas.vgvCanceled;
    const totalNet = teamBruno.vgvNet + teamLorena.vgvNet + teamLucas.vgvNet;
    const totalContractsGross = teamBruno.contractsGross + teamLorena.contractsGross + teamLucas.contractsGross;
    const totalContractsCanceled = teamBruno.contractsCanceled + teamLorena.contractsCanceled + teamLucas.contractsCanceled;
    const totalContractsNet = teamBruno.contractsNet + teamLorena.contractsNet + teamLucas.contractsNet;
    const totalTarget = teamBruno.targetNet + teamLorena.targetNet + teamLucas.targetNet;

    const teamAll: TeamData = {
      id: 'all',
      name: 'Torrano Negócios (Consolidado)',
      leader: defaultMeta.all.leader,
      leadDescription: defaultMeta.all.description,
      ticketAverage: totalContractsGross > 0 ? Math.round(totalGross / totalContractsGross) : defaultMeta.all.ticket,
      leads: totalLeads,
      analyzedDocs: totalDocs,
      contractsGross: totalContractsGross,
      contractsNet: totalContractsNet,
      contractsCanceled: totalContractsCanceled,
      vgvGross: totalGross,
      vgvCanceled: totalCanceled,
      vgvNet: totalNet,
      targetNet: totalTarget,
      conversionDocRate: totalLeads > 0 ? Number(((totalDocs / totalLeads) * 100).toFixed(2)) : 0,
      conversionSalesRate: totalDocs > 0 ? Number(((totalContractsGross / totalDocs) * 100).toFixed(2)) : 0,
      cancellationRate: totalGross > 0 ? Number(((totalCanceled / totalGross) * 100).toFixed(2)) : 0,
      netRetentionRate: totalGross > 0 ? Number(((totalNet / totalGross) * 100).toFixed(2)) : 0,
      previousVgvNet: Math.round(totalNet * 0.9),
      previousLeads: Math.round(totalLeads * 0.92),
      previousCanceled: Math.round(totalCanceled * 1.05),
    };

    return {
      success: true,
      message: `Planilha importada com sucesso! ${processedCount} registros consolidados nas 3 equipes comerciais (Bruno, Lorena e Lucas).`,
      rowCount: processedCount,
      teamsData: {
        all: teamAll,
        bruno: teamBruno,
        lorena: teamLorena,
        lucas: teamLucas,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao processar arquivo Excel: ${err?.message || 'Arquivo corrompido ou formato incompatível.'}`,
    };
  }
}

// Function to generate and download the standard template .xlsx
export function downloadExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Template Data Sheet
  const templateRows = [
    {
      Equipe: 'Equipe Bruno',
      Leads: 480,
      Documentos_Analisados: 168,
      Vendas_Brutas: 19600000,
      Destratos: 1960000,
      Vendas_Liquidas: 17640000,
      Meta_VGV_Liquido: 16500000,
      Contratos_Brutos: 28,
      Contratos_Cancelados: 3,
    },
    {
      Equipe: 'Equipe Lorena',
      Leads: 620,
      Documentos_Analisados: 174,
      Vendas_Brutas: 17050000,
      Destratos: 2728000,
      Vendas_Liquidas: 14322000,
      Meta_VGV_Liquido: 15000000,
      Contratos_Brutos: 31,
      Contratos_Cancelados: 5,
    },
    {
      Equipe: 'Equipe Lucas',
      Leads: 310,
      Documentos_Analisados: 136,
      Vendas_Brutas: 26450000,
      Destratos: 2116000,
      Vendas_Liquidas: 24334000,
      Meta_VGV_Liquido: 22000000,
      Contratos_Brutos: 23,
      Contratos_Cancelados: 2,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(templateRows);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 18 }, // Equipe
    { wch: 10 }, // Leads
    { wch: 24 }, // Documentos_Analisados
    { wch: 16 }, // Vendas_Brutas
    { wch: 14 }, // Destratos
    { wch: 16 }, // Vendas_Liquidas
    { wch: 18 }, // Meta_VGV_Liquido
    { wch: 16 }, // Contratos_Brutos
    { wch: 20 }, // Contratos_Cancelados
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Performance_Equipes');

  // Instructional sheet
  const instructionRows = [
    { Instrucoes: 'INSTRUÇÕES DE PREENCHIMENTO - TORRANO NEGÓCIOS' },
    { Instrucoes: '1. Não altere o nome dos cabeçalhos da primeira linha na aba "Performance_Equipes".' },
    { Instrucoes: '2. Coluna "Equipe": Preencher como "Equipe Bruno", "Equipe Lorena" ou "Equipe Lucas".' },
    { Instrucoes: '3. Coluna "Leads": Quantidade inteira de contatos recebidos no período.' },
    { Instrucoes: '4. Coluna "Documentos_Analisados": Pastas enviadas para qualificação pré-bancária.' },
    { Instrucoes: '5. Coluna "Vendas_Brutas": Soma monetária em R$ de todos os contratos emitidos.' },
    { Instrucoes: '6. Coluna "Destratos": Valor monetário em R$ dos contratos cancelados/desfeitos.' },
    { Instrucoes: '7. Coluna "Vendas_Liquidas": VGV Líquido Real (pode ser calculado como Vendas_Brutas - Destratos).' },
    { Instrucoes: '8. O painel BI da Torrano Negócios recalculará todas as taxas, gráficos e KPIs automaticamente ao subir este arquivo!' },
  ];
  const wsInst = XLSX.utils.json_to_sheet(instructionRows);
  wsInst['!cols'] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsInst, 'Instrucoes_Diretoria');

  // Trigger download
  XLSX.writeFile(wb, 'Modelo_Torrano_Negocios_Performance.xlsx');
}
