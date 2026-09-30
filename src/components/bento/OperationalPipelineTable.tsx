import React from 'react';
import { TeamData } from '../../types';
import { formatBRL, formatNumber } from '../../utils/formatters';
import { Layers, ArrowRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OperationalPipelineTableProps {
  data: TeamData;
}

export const OperationalPipelineTable: React.FC<OperationalPipelineTableProps> = ({ data }) => {
  // Construct dynamic pipeline rows based on team metrics
  const stages = [
    {
      stage: '1. Topo do Funil · Prospecção',
      meta: `${formatNumber(Math.round(data.leads * 1.05))} leads`,
      realizado: `${formatNumber(data.leads)} leads`,
      sla: 'SLA < 30min',
      status: 'No Prazo',
      statusType: 'success',
    },
    {
      stage: '2. Qualificação & Dossiê Bancário',
      meta: `${formatNumber(Math.round(data.leads * 0.35))} pastas`,
      realizado: `${formatNumber(data.analyzedDocs)} pastas`,
      sla: '48 a 72h',
      status: data.conversionDocRate >= 32 ? 'Atingido' : 'Gargalo',
      statusType: data.conversionDocRate >= 32 ? 'success' : 'warning',
    },
    {
      stage: '3. Emissão de Espelho & Proposta',
      meta: `${Math.round(data.contractsGross * 1.1)} contratos`,
      realizado: `${data.contractsGross} contratos (${formatBRL(data.vgvGross, true)})`,
      sla: '24h',
      status: 'Atingido',
      statusType: 'success',
    },
    {
      stage: '4. Integralização de Sinal & Minuta',
      meta: `${data.contractsGross} contratos`,
      realizado: `${data.contractsNet} ativos (${data.contractsCanceled} quebras)`,
      sla: '5 dias',
      status: data.cancellationRate <= 10 ? 'Seguro' : 'Atenção Destratos',
      statusType: data.cancellationRate <= 10 ? 'success' : 'danger',
    },
    {
      stage: '5. Liquidação Definitiva em Caixa',
      meta: formatBRL(data.targetNet, true),
      realizado: formatBRL(data.vgvNet, true),
      sla: 'Fechamento',
      status: data.vgvNet >= data.targetNet ? 'Meta Superada' : 'Abaixo da Meta',
      statusType: data.vgvNet >= data.targetNet ? 'success' : 'warning',
    },
  ];

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return 'bg-rose-50 text-[#E60000] border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
            Controle de Processos
          </span>
          <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
            Fluxo Operacional de Vendas e Contratos
          </h3>
          <p className="text-xs text-slate-500">
            Rastreamento de ponta a ponta: SLA, metas intermediárias e conformidade
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto my-auto py-2">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 font-bold">Etapa do Pipeline</th>
              <th className="py-2.5 px-3 font-bold">Meta</th>
              <th className="py-2.5 px-3 font-bold">Realizado</th>
              <th className="py-2.5 px-3 font-bold">Prazo Médio</th>
              <th className="py-2.5 px-3 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stages.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-800 font-sans">
                  {row.stage}
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {row.meta}
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  {row.realizado}
                </td>
                <td className="py-3 px-3 text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {row.sla}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(row.statusType)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Eficiência Geral:</span>
        <strong className="text-emerald-600 font-bold font-mono">
          {((data.contractsNet / data.leads) * 100).toFixed(2)}% do lead ao caixa líquido
        </strong>
      </div>

    </div>
  );
};
