import React from 'react';
import { TeamData } from '../types';
import { 
  formatBRL, 
  formatNumber, 
  formatPercent, 
  calculateDelta 
} from '../utils/formatters';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  FileX, 
  UserCheck, 
  ShieldCheck, 
  Award,
  Target
} from 'lucide-react';

interface KpiCardsProps {
  data: TeamData;
  periodLabel: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data, periodLabel }) => {
  const vgvDelta = calculateDelta(data.vgvNet, data.previousVgvNet);
  const leadsDelta = calculateDelta(data.leads, data.previousLeads);
  const destratoDelta = calculateDelta(data.vgvCanceled, data.previousCanceled);
  const targetAchieved = (data.vgvNet / data.targetNet) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. VGV Líquido (Primary Executive Metric) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              VGV Líquido Real
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatBRL(data.vgvNet, true)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
              {formatBRL(data.vgvNet, false)}
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {vgvDelta.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className={`font-mono font-medium ${vgvDelta.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {vgvDelta.formatted}
            </span>
            <span className="text-slate-400">vs. anterior</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Meta: </span>
            <span className={`font-mono font-medium ${targetAchieved >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {targetAchieved.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. VGV Bruto & Contratos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              VGV Bruto Emitido
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatBRL(data.vgvGross, true)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              <span className="font-mono text-slate-200 font-semibold">{data.contractsGross}</span> contratos assinados
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Ticket Médio:</span>
          <span className="font-mono text-slate-200 font-medium tabular-nums">
            {formatBRL(data.ticketAverage, true)}
          </span>
        </div>
      </div>

      {/* 3. Destratos / Cancelamentos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Destratos & Quebras
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <FileX className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-400 tabular-nums">
              {formatBRL(data.vgvCanceled, true)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              <span className="font-mono text-rose-300 font-semibold">{data.contractsCanceled}</span> contratos desfeitos
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Taxa de Destrato:</span>
          <span className={`font-mono font-bold ${data.cancellationRate > 12 ? 'text-rose-400' : 'text-slate-200'}`}>
            {formatPercent(data.cancellationRate, 1)}
          </span>
        </div>
      </div>

      {/* 4. Pastas Analisadas (Pré-Bancária) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pastas Analisadas
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatNumber(data.analyzedDocs)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Qualificação pré-bancária
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Conv. Lead → Doc:</span>
          <span className="font-mono text-amber-400 font-semibold tabular-nums">
            {formatPercent(data.conversionDocRate, 1)}
          </span>
        </div>
      </div>

      {/* 5. Leads Recebidos (Topo de Funil) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Leads Recebidos
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatNumber(data.leads)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Volume total de captação
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-400 font-medium">
              {leadsDelta.formatted}
            </span>
          </div>
          <span className="text-slate-400">vs. anterior</span>
        </div>
      </div>

      {/* 6. Taxa de Retenção Líquida */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Retenção Líquida
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
              {formatPercent(data.netRetentionRate, 1)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Vendas que viram caixa real
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Conv. Doc → Venda:</span>
          <span className="font-mono text-slate-200 font-semibold tabular-nums">
            {formatPercent(data.conversionSalesRate, 1)}
          </span>
        </div>
      </div>
    </div>
  );
};
