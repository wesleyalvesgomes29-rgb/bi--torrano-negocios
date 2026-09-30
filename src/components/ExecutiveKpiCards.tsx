import React from 'react';
import { TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent, calculateDelta } from '../utils/formatters';
import { Sparkline } from './Sparkline';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert
} from 'lucide-react';

interface ExecutiveKpiCardsProps {
  data: TeamData;
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({ data }) => {
  // Delta computations
  const leadsDelta = calculateDelta(data.leads, data.previousLeads);
  const vgvDelta = calculateDelta(data.vgvNet, data.previousVgvNet);
  const destratoDelta = calculateDelta(data.vgvCanceled, data.previousCanceled);

  // Sparkline data sequences
  const leadsTrend = [
    Math.round(data.previousLeads * 0.88),
    Math.round(data.previousLeads * 0.94),
    Math.round(data.previousLeads * 0.98),
    Math.round(data.leads * 0.96),
    data.leads,
  ];

  const docsTrend = [
    Math.round(data.analyzedDocs * 0.86),
    Math.round(data.analyzedDocs * 0.91),
    Math.round(data.analyzedDocs * 0.94),
    Math.round(data.analyzedDocs * 0.97),
    data.analyzedDocs,
  ];

  const destratoTrend = [
    Math.round(data.previousCanceled * 0.92),
    Math.round(data.previousCanceled * 1.02),
    Math.round(data.vgvCanceled * 1.06),
    Math.round(data.vgvCanceled * 0.98),
    data.vgvCanceled,
  ];

  const vgvTrend = [
    Math.round(data.previousVgvNet * 0.85),
    Math.round(data.previousVgvNet * 0.92),
    Math.round(data.previousVgvNet * 0.97),
    Math.round(data.vgvNet * 0.96),
    data.vgvNet,
  ];

  const isDestratoCritical = data.cancellationRate > 12.0;

  return (
    <section aria-label="KPIs Executivos de Performance" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        
        {/* CARD 1: TOTAL DE LEADS RECEBIDOS */}
        <div className="bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 lg:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Total Leads Recebidos
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00D2FF]">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3 mt-1">
              <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-tight font-display">
                {formatNumber(data.leads)}
              </div>
              <div className="shrink-0 pb-1">
                <Sparkline
                  data={leadsTrend}
                  color="#00D2FF"
                  gradientId={`leads-spark-${data.id}`}
                  height={32}
                  width={90}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              {leadsDelta.formatted} vs ant.
            </span>
            <span className="text-slate-400">
              {data.previousLeads} ant.
            </span>
          </div>
        </div>

        {/* CARD 2: PASTAS DOCUMENTAIS ANALISADAS */}
        <div className="bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 lg:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Pastas Documentais
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3 mt-1">
              <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-tight font-display">
                {formatNumber(data.analyzedDocs)}
              </div>
              <div className="shrink-0 pb-1">
                <Sparkline
                  data={docsTrend}
                  color="#38BDF8"
                  gradientId={`docs-spark-${data.id}`}
                  height={32}
                  width={90}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-300 font-bold bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md">
              {formatPercent(data.conversionDocRate, 1)} de conversão
            </span>
            <span className="text-slate-400">
              de {data.leads} leads
            </span>
          </div>
        </div>

        {/* CARD 3: DESTRATOS DO PERÍODO (COM ALERTA SE > 12%) */}
        <div className={`
          bg-[#111827]/70 backdrop-blur-xl border rounded-2xl p-5 lg:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden group
          ${isDestratoCritical 
            ? 'border-[#E60000]/70 ring-1 ring-[#E60000]/40 shadow-[0_0_25px_rgba(230,0,0,0.2)]' 
            : 'border-slate-800/80 hover:border-slate-700/80'
          }
        `}>
          {isDestratoCritical && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E60000] via-rose-500 to-[#E60000] animate-pulse" />
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDestratoCritical ? 'text-[#E60000]' : 'text-slate-400'}`}>
                {isDestratoCritical && <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />}
                Destratos do Período
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-[#E60000]">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3 mt-1">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#E60000] font-mono tracking-tight font-display drop-shadow-[0_0_12px_rgba(230,0,0,0.4)]">
                {formatBRL(data.vgvCanceled, true)}
              </div>
              <div className="shrink-0 pb-1">
                <Sparkline
                  data={destratoTrend}
                  color="#E60000"
                  gradientId={`destrato-spark-${data.id}`}
                  height={32}
                  width={90}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
            <span className={`font-bold px-2 py-0.5 rounded-md border ${
              isDestratoCritical 
                ? 'bg-[#E60000]/20 text-[#E60000] border-[#E60000]/40' 
                : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
            }`}>
              {formatPercent(data.cancellationRate, 1)} quebra {isDestratoCritical ? '(Alerta >12%)' : ''}
            </span>
            <span className="text-slate-400">
              {data.contractsCanceled} rescisões
            </span>
          </div>
        </div>

        {/* CARD 4: VGV LÍQUIDO RETIDO EM CAIXA (EM DESTAQUE VERDE ESMERALDA) */}
        <div className="bg-gradient-to-b from-[#064e3b]/30 via-[#111827]/80 to-[#111827]/70 backdrop-blur-xl border-2 border-[#10B981]/70 hover:border-[#10B981] rounded-2xl p-5 lg:p-6 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#10B981]" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                VGV Líquido em Caixa
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3 mt-1">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#10B981] font-mono tracking-tight font-display drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                {formatBRL(data.vgvNet, true)}
              </div>
              <div className="shrink-0 pb-1">
                <Sparkline
                  data={vgvTrend}
                  color="#10B981"
                  gradientId={`vgv-spark-${data.id}`}
                  height={32}
                  width={90}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-emerald-900/40 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md">
              {data.contractsNet} contratos retidos
            </span>
            <span className="text-emerald-400/90 font-bold">
              {formatPercent((data.vgvNet / data.targetNet) * 100, 1)} da meta
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
