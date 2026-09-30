import React from 'react';
import { TeamData } from '../../types';
import { formatBRL, formatPercent } from '../../utils/formatters';
import { AlertOctagon, ShieldAlert, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface DestratoPipelinePanelProps {
  data: TeamData;
}

export const DestratoPipelinePanel: React.FC<DestratoPipelinePanelProps> = ({ data }) => {
  const isHighRisk = data.cancellationRate > 12.0;

  // Pipeline boxes data
  const pipelineBoxes = [
    {
      title: 'Contratos Vigentes',
      subtitle: 'Liquidados em caixa',
      count: `${data.contractsNet} unid.`,
      value: formatBRL(data.vgvNet, true),
      color: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      tag: '🟢 Retido',
    },
    {
      title: 'Em Análise Jurídica',
      subtitle: 'Minutas em conferência',
      count: `${Math.round(data.contractsGross * 0.25)} unid.`,
      value: formatBRL(data.vgvGross * 0.25, true),
      color: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200 text-amber-800',
      dot: 'bg-amber-500',
      tag: '🟡 Em Andamento',
    },
    {
      title: 'Rescisões do Período',
      subtitle: 'Destratos confirmados',
      count: `${data.contractsCanceled} unid.`,
      value: formatBRL(data.vgvCanceled, true),
      color: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200 text-[#E60000]',
      dot: 'bg-[#E60000]',
      tag: '🔴 Cancelado',
    },
    {
      title: 'Repasses Programados',
      subtitle: 'Liberações bancárias',
      count: `${Math.round(data.contractsNet * 0.4)} unid.`,
      value: formatBRL(data.vgvNet * 0.4, true),
      color: 'bg-blue-50 hover:bg-blue-100/70 border-blue-200 text-blue-800',
      dot: 'bg-blue-600',
      tag: '🔵 A Receber',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E60000]">
            Governança & Risco
          </span>
          <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
            Destratos & Pipeline de Retenção
          </h3>
          <p className="text-xs text-slate-500">
            Monitoramento de estanqueidade financeira
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E60000] shrink-0">
          <AlertOctagon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Destrato Metric Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        isHighRisk 
          ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-200' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono mb-1">
          <span className="text-slate-600 font-bold uppercase tracking-wider">
            Total Cancelado / Destratado
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isHighRisk 
              ? 'bg-[#E60000] text-white border-[#E60000]' 
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            {formatPercent(data.cancellationRate, 1)} quebra {isHighRisk ? '(Alerta >12%)' : ''}
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-[#E60000] font-mono tracking-tight font-display">
          {formatBRL(data.vgvCanceled)}
        </div>

        <div className="text-xs text-slate-500 font-mono mt-1 flex items-center justify-between">
          <span>{data.contractsCanceled} quebras no período</span>
          <span>Teto seguro: ≤ 10%</span>
        </div>
      </div>

      {/* Pipeline de Retenção em Caixas Coloridas Estilo Botão */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Composição do Pipeline Ativo
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pipelineBoxes.map((box) => (
            <div
              key={box.title}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group shadow-2xs ${box.color}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                <span>{box.tag}</span>
                <span className="text-slate-500 font-normal">{box.count}</span>
              </div>
              <div className="font-bold text-slate-900 text-xs font-sans truncate">
                {box.title}
              </div>
              <div className="text-xs font-mono font-black mt-0.5">
                {box.value}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
