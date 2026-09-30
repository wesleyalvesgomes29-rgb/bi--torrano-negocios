import React from 'react';
import { TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { Users, FileCheck2, ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react';

interface CleanFunnelVisualProps {
  data: TeamData;
}

export const CleanFunnelVisual: React.FC<CleanFunnelVisualProps> = ({ data }) => {
  // Funnel numbers
  const leads = data.leads;
  const docs = data.analyzedDocs;
  const contractsGross = data.contractsGross;
  const contractsNet = data.contractsNet;

  // Stages definition
  const stages = [
    {
      step: '1',
      title: 'Leads Captados',
      count: `${formatNumber(leads)} leads`,
      secondary: 'Topo de funil (100%)',
      barPercent: 100,
      barColor: 'from-cyan-500 to-blue-500',
      textColor: 'text-cyan-400',
      icon: Users,
    },
    {
      step: '2',
      title: 'Pastas Analisadas',
      count: `${formatNumber(docs)} pastas`,
      secondary: `${formatPercent(data.conversionDocRate, 1)} sobre leads`,
      barPercent: Math.max(12, Math.min(100, (docs / leads) * 100)),
      barColor: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-400',
      icon: FileCheck2,
      conversionNote: `${formatPercent(data.conversionDocRate, 1)} qualificados`,
    },
    {
      step: '3',
      title: 'Vendas Brutas',
      count: `${contractsGross} contratos`,
      secondary: formatBRL(data.vgvGross, false),
      barPercent: Math.max(8, Math.min(100, (contractsGross / docs) * 75)),
      barColor: 'from-indigo-500 to-violet-500',
      textColor: 'text-indigo-400',
      icon: ShoppingCart,
      conversionNote: `${formatPercent(data.conversionSalesRate, 1)} fechados`,
    },
    {
      step: '4',
      title: 'Vendas Líquidas',
      count: `${contractsNet} contratos retidos`,
      secondary: formatBRL(data.vgvNet, false),
      barPercent: Math.max(6, Math.min(100, (contractsNet / contractsGross) * 65)),
      barColor: 'from-emerald-500 to-teal-400',
      textColor: 'text-emerald-400',
      icon: CheckCircle2,
      conversionNote: `${formatPercent(data.netRetentionRate, 1)} retenção de caixa`,
    },
  ];

  return (
    <section aria-label="Funil Comercial" className="w-full">
      <div className="bg-[#0D1526] border border-[#1E2E4E] rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20">
        
        {/* Title and High-level Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1E2E4E] gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white font-display tracking-tight flex items-center gap-2.5">
              <span>Funil de Conversão Comercial</span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Cascata Direta
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trajetória linear: Leads → Pastas Analisadas → Vendas Brutas → Vendas Líquidas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Eficiência Líquida Total
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {formatPercent((contractsNet / leads) * 100, 2)}
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Stage Bars (Clean, horizontal waterfall) */}
        <div className="mt-6 space-y-5">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={stage.step} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  
                  {/* Left: Step + Label */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                      {stage.step}
                    </span>
                    <span className="font-bold text-white tracking-wide truncate">
                      {stage.title}
                    </span>
                    {stage.conversionNote && (
                      <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        {stage.conversionNote}
                      </span>
                    )}
                  </div>

                  {/* Right: Values */}
                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span className="text-slate-400 text-xs hidden sm:inline">
                      {stage.secondary}
                    </span>
                    <span className={`font-black text-sm sm:text-base ${stage.textColor}`}>
                      {stage.count}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with smooth proportional gradient */}
                <div className="h-4 sm:h-5 bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800/80 p-0.5">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${stage.barColor} transition-all duration-500 shadow-sm`}
                    style={{ width: `${stage.barPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Flow Summary Ribbon */}
        <div className="mt-8 pt-5 border-t border-[#1E2E4E] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Conversão de Documentos:</span>
            <strong className="text-white">{formatPercent(data.conversionDocRate, 1)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Conversão em Vendas Brutas:</span>
            <strong className="text-white">{formatPercent(data.conversionSalesRate, 1)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Retenção Financeira Líquida:</span>
            <strong className="text-emerald-400">{formatPercent(data.netRetentionRate, 1)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Destrato:</span>
            <strong className="text-rose-400">{formatPercent(data.cancellationRate, 1)}</strong>
          </div>
        </div>

      </div>
    </section>
  );
};
