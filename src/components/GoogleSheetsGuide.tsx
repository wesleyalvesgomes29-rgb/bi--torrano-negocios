import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Code, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Database,
  ArrowRight,
  ShieldCheck,
  TableProperties
} from 'lucide-react';

export const GoogleSheetsGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleJsonPayload = {
    period: "month",
    periodLabel: "Setembro 2026",
    updatedAt: "2026-09-29T16:50:00Z",
    teams: {
      all: {
        id: "all",
        name: "Torrano Negócios (Consolidado)",
        leader: "Flávio Torrano",
        leads: 1410,
        analyzedDocs: 478,
        contractsGross: 82,
        contractsNet: 72,
        contractsCanceled: 10,
        vgvGross: 63100000,
        vgvCanceled: 6804000,
        vgvNet: 56296000,
        targetNet: 53500000,
        conversionDocRate: 33.9,
        conversionSalesRate: 17.15,
        cancellationRate: 10.78,
        netRetentionRate: 89.22,
        ticketAverage: 769512
      },
      bruno: {
        id: "bruno",
        name: "Equipe Bruno",
        leader: "Bruno Torrano",
        leads: 480,
        analyzedDocs: 168,
        contractsGross: 28,
        contractsNet: 25,
        contractsCanceled: 3,
        vgvGross: 19600000,
        vgvCanceled: 1960000,
        vgvNet: 17640000,
        targetNet: 16500000,
        conversionDocRate: 35.0,
        conversionSalesRate: 16.67,
        cancellationRate: 10.0,
        netRetentionRate: 90.0,
        ticketAverage: 700000
      },
      lorena: {
        id: "lorena",
        name: "Equipe Lorena",
        leader: "Lorena Vasconcelos",
        leads: 620,
        analyzedDocs: 174,
        contractsGross: 31,
        contractsNet: 26,
        contractsCanceled: 5,
        vgvGross: 17050000,
        vgvCanceled: 2728000,
        vgvNet: 14322000,
        targetNet: 15000000,
        conversionDocRate: 28.06,
        conversionSalesRate: 17.82,
        cancellationRate: 16.0,
        netRetentionRate: 84.0,
        ticketAverage: 550000
      },
      lucas: {
        id: "lucas",
        name: "Equipe Lucas",
        leader: "Lucas Siqueira",
        leads: 310,
        analyzedDocs: 136,
        contractsGross: 23,
        contractsNet: 21,
        contractsCanceled: 2,
        vgvGross: 26450000,
        vgvCanceled: 2116000,
        vgvNet: 24334000,
        targetNet: 22000000,
        conversionDocRate: 43.87,
        conversionSalesRate: 16.91,
        cancellationRate: 8.0,
        netRetentionRate: 92.0,
        ticketAverage: 1150000
      }
    },
    history: [
      { month: "Jan", vgvNetTotal: 38200000, vgvTarget: 38000000 },
      { month: "Fev", vgvNetTotal: 41500000, vgvTarget: 40000000 },
      { month: "Mar", vgvNetTotal: 46800000, vgvTarget: 44000000 },
      { month: "Abr", vgvNetTotal: 44100000, vgvTarget: 45000000 },
      { month: "Mai", vgvNetTotal: 48900000, vgvTarget: 46000000 },
      { month: "Jun", vgvNetTotal: 51200000, vgvTarget: 48000000 },
      { month: "Jul", vgvNetTotal: 47600000, vgvTarget: 49000000 },
      { month: "Ago", vgvNetTotal: 49200000, vgvTarget: 51000000 },
      { month: "Set", vgvNetTotal: 56296000, vgvTarget: 53500000 }
    ]
  };

  const jsonString = JSON.stringify(sampleJsonPayload, null, 2);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Engenharia de Dados: Google Sheets & API de Consumo</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Especificação técnica completa: estrutura de colunas à prova de falhas, fórmulas de consolidação e payload JSON para o front-end
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Padrão Anti-Erro Homologado
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: ESTRUTURA DE COLUNAS GOOGLE SHEETS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">1</span>
              <span>Estrutura de Colunas: Google Sheets para Líderes de Equipe</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Para eliminar 100% dos erros humanos de digitação, a planilha opera em duas abas operacionais com validação de dados obrigatória
            </p>
          </div>
        </div>

        {/* Sub-Aba 1: Lancamentos_Vendas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <TableProperties className="w-4 h-4" />
            <span>Aba 1: "Lancamentos_Vendas" (Registro individual de cada proposta/contrato)</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Coluna</th>
                  <th className="py-2.5 px-3">Nome do Cabeçalho</th>
                  <th className="py-2.5 px-3">Tipo de Dado</th>
                  <th className="py-2.5 px-3">Validação / Regra Anti-Erro</th>
                  <th className="py-2.5 px-3">Exemplo de Entrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">A</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">ID_Contrato</td>
                  <td className="py-2 px-3 text-slate-400">Texto (Único)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Obrigatório, gerado sequencialmente</td>
                  <td className="py-2 px-3 text-slate-400">CTR-2026-0842</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">B</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Data_Lancamento</td>
                  <td className="py-2 px-3 text-slate-400">Data (DD/MM/AAAA)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Validação de Data válida</td>
                  <td className="py-2 px-3 text-slate-400">14/09/2026</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">C</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Equipe</td>
                  <td className="py-2 px-3 text-slate-400">Lista Suspensa</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Dropdown: "Equipe Bruno", "Equipe Lorena", "Equipe Lucas"</td>
                  <td className="py-2 px-3 text-slate-200">Equipe Bruno</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">D</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Corretor_Responsavel</td>
                  <td className="py-2 px-3 text-slate-400">Texto</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Lista de corretores cadastrados</td>
                  <td className="py-2 px-3 text-slate-400">Lucas Silveira</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">E</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Empreendimento_Imovel</td>
                  <td className="py-2 px-3 text-slate-400">Texto</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Nome do produto ou condomínio</td>
                  <td className="py-2 px-3 text-slate-400">Reserva Jardins - Torre B</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">F</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Status_Operacao</td>
                  <td className="py-2 px-3 text-slate-400">Lista Suspensa</td>
                  <td className="py-2 px-3 text-rose-300 font-sans font-semibold">Dropdown: "Venda Ativa Líquida", "Destrato / Cancelado"</td>
                  <td className="py-2 px-3 text-emerald-400">Venda Ativa Líquida</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">G</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Valor_VGV_Bruto_RS</td>
                  <td className="py-2 px-3 text-slate-400">Moeda (R$)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Número maior que 0</td>
                  <td className="py-2 px-3 text-indigo-300 font-bold">R$ 850.000,00</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">H</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Data_Cancelamento</td>
                  <td className="py-2 px-3 text-slate-400">Data (Opcional)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Preenchimento condicional se Status = "Destrato / Cancelado"</td>
                  <td className="py-2 px-3 text-slate-400">22/09/2026</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-amber-400 font-bold">I</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Motivo_Destrato</td>
                  <td className="py-2 px-3 text-slate-400">Lista Suspensa</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Dropdown: "Reprovação Crédito Bancário", "Desistência Comprador", "Inadimplência Entrada"</td>
                  <td className="py-2 px-3 text-slate-400">Reprovação Crédito Bancário</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-Aba 2: Fechamento_Funil */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <TableProperties className="w-4 h-4" />
            <span>Aba 2: "Fechamento_Funil" (Apuração diária/semanal de Leads e Pastas por Equipe)</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Coluna</th>
                  <th className="py-2.5 px-3">Nome do Cabeçalho</th>
                  <th className="py-2.5 px-3">Tipo de Dado</th>
                  <th className="py-2.5 px-3">Validação / Regra Anti-Erro</th>
                  <th className="py-2.5 px-3">Exemplo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-cyan-400 font-bold">A</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Data_Referencia</td>
                  <td className="py-2 px-3 text-slate-400">Data (DD/MM/AAAA)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Data válida no período</td>
                  <td className="py-2 px-3 text-slate-400">Setembro 2026</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-cyan-400 font-bold">B</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Equipe</td>
                  <td className="py-2 px-3 text-slate-400">Lista Suspensa</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">Dropdown: "Equipe Bruno", "Equipe Lorena", "Equipe Lucas"</td>
                  <td className="py-2 px-3 text-slate-200">Equipe Lorena</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-cyan-400 font-bold">C</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Leads_Recebidos</td>
                  <td className="py-2 px-3 text-slate-400">Inteiro (&ge; 0)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Número inteiro via CRM (Meta/RD Station/HubSpot)</td>
                  <td className="py-2 px-3 text-white font-bold">620</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-cyan-400 font-bold">D</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Pastas_Analisadas</td>
                  <td className="py-2 px-3 text-slate-400">Inteiro (&ge; 0)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Regra de validação: Pastas &le; Leads</td>
                  <td className="py-2 px-3 text-amber-400 font-bold">174</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-cyan-400 font-bold">E</td>
                  <td className="py-2 px-3 font-sans text-slate-200 font-semibold">Meta_VGV_Liquido_RS</td>
                  <td className="py-2 px-3 text-slate-400">Moeda (R$)</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">Meta orçamentária do mês estipulada pela diretoria</td>
                  <td className="py-2 px-3 text-emerald-400">R$ 15.000.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: FÓRMULAS PRONTAS DE CONSOLIDAÇÃO */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
              <span>Fórmulas Prontas de Consolidação (Google Sheets / Excel)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Fórmulas automáticas com tratamento nativo contra divisão por zero (<code className="text-amber-300">SEERRO</code> / <code className="text-amber-300">IFERROR</code>).
            </p>
          </div>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formula 1: VGV Bruto */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400">1. VGV Bruto Total (por Equipe)</span>
                <button
                  onClick={() => handleCopy('=SOMASE(Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$G:$G)', 'f1')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Soma todos os contratos assinados independentemente do status final.</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-indigo-300 mt-2 overflow-x-auto">
                <code>=SOMASE(Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$G:$G)</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Em inglês: =SUMIF(Lancamentos_Vendas!$C:$C, "Equipe Bruno", Lancamentos_Vendas!$G:$G)</div>
          </div>

          {/* Formula 2: Destratos */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400">2. Destratos / Cancelamentos (em R$)</span>
                <button
                  onClick={() => handleCopy('=SOMASES(Lancamentos_Vendas!$G:$G; Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$F:$F; "Destrato / Cancelado")', 'f2')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Soma apenas os contratos da equipe com status "Destrato / Cancelado".</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-rose-300 mt-2 overflow-x-auto">
                <code>=SOMASES(Lancamentos_Vendas!$G:$G; Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$F:$F; "Destrato / Cancelado")</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Em inglês: =SUMIFS(Lancamentos_Vendas!$G:$G, Lancamentos_Vendas!$C:$C, "Equipe Bruno", Lancamentos_Vendas!$F:$F, "Destrato / Cancelado")</div>
          </div>

          {/* Formula 3: VGV Líquido Real */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">3. VGV Líquido Real (em R$)</span>
                <button
                  onClick={() => handleCopy('=SOMASES(Lancamentos_Vendas!$G:$G; Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$F:$F; "Venda Ativa Líquida")', 'f3')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">VGV Bruto menos Destratos (ou soma direta das vendas ativas).</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-emerald-300 mt-2 overflow-x-auto">
                <code>=SOMASES(Lancamentos_Vendas!$G:$G; Lancamentos_Vendas!$C:$C; "Equipe Bruno"; Lancamentos_Vendas!$F:$F; "Venda Ativa Líquida")</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Ou subtraindo: =VGV_Bruto_Bruno - Destratos_Bruno</div>
          </div>

          {/* Formula 4: Taxa de Destrato % */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">4. Taxa de Destrato (%)</span>
                <button
                  onClick={() => handleCopy('=SEERRO(Destratos_Bruno / VGV_Bruto_Bruno; 0)', 'f4')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Percentual de cancelamento com blindagem contra erro #DIV/0!.</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-amber-300 mt-2 overflow-x-auto">
                <code>=SEERRO(Destratos_Bruno / VGV_Bruto_Bruno; 0)</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Formatar célula como Porcentagem (0,0%)</div>
          </div>

          {/* Formula 5: Conversão 1 (Leads -> Pastas) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400">5. Conversão 1: Leads → Pastas (%)</span>
                <button
                  onClick={() => handleCopy('=SEERRO(Fechamento_Funil!D2 / Fechamento_Funil!C2; 0)', 'f5')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pastas Analisadas divididas por Leads Recebidos no período.</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-cyan-300 mt-2 overflow-x-auto">
                <code>=SEERRO(Fechamento_Funil!D2 / Fechamento_Funil!C2; 0)</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Em inglês: =IFERROR(Fechamento_Funil!D2 / Fechamento_Funil!C2, 0)</div>
          </div>

          {/* Formula 6: Conversão 2 (Pastas -> Contratos) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-400">6. Conversão 2: Pastas → Vendas Brutas (%)</span>
                <button
                  onClick={() => handleCopy('=SEERRO(CONT.SE(Lancamentos_Vendas!$C:$C; "Equipe Bruno") / Fechamento_Funil!D2; 0)', 'f6')}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'f6' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total de contratos emitidos dividido pelas pastas analisadas.</p>
              <pre className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-purple-300 mt-2 overflow-x-auto">
                <code>=SEERRO(CONT.SE(Lancamentos_Vendas!$C:$C; "Equipe Bruno") / Fechamento_Funil!D2; 0)</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Em inglês: =IFERROR(COUNTIF(Lancamentos_Vendas!$C:$C, "Equipe Bruno") / Fechamento_Funil!D2, 0)</div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: PAYLOAD JSON ESTRUTURADO PARA O FRONT-END */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">3</span>
              <span>Payload JSON Estruturado (Consumido pelo Front-End React)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Estrutura padrão retornada pelo endpoint da API (Google Apps Script Web App, Supabase, Cloud Functions ou Sheet2API)
            </p>
          </div>
          <button
            onClick={() => handleCopy(jsonString, 'json')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copiedKey === 'json' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">JSON Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Payload JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="relative">
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400/90 overflow-x-auto max-h-[380px] scrollbar-thin select-all">
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Endpoint Architecture Note */}
        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Como conectar a Planilha ao Front-End em 2 passos (Sem Servidor Extra):</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-slate-400">
            <li>
              <strong className="text-slate-200">Google Apps Script (Web App Gratuito):</strong> Na planilha Google, acesse <span className="text-amber-300 font-mono">Extensões &gt; Apps Script</span> e crie uma função <span className="text-cyan-300 font-mono">doGet()</span> que lê as células e retorna <span className="text-emerald-300 font-mono">ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)</span>.
            </li>
            <li>
              <strong className="text-slate-200">Consumo no React:</strong> Basta utilizar um simples <span className="text-cyan-300 font-mono">fetch(APPS_SCRIPT_WEBAPP_URL)</span> no hook <span className="text-amber-300 font-mono">useEffect</span> para alimentar o estado <span className="text-amber-300 font-mono">useState</span> do dashboard em tempo real a cada salvamento na planilha!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
