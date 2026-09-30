import React, { useState } from 'react';
import { PeriodOverview, TeamData, TeamFilterId } from '../types';
import { formatBRL, formatPercent, formatNumber } from '../utils/formatters';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Trophy,
  ArrowRight,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';

interface GoalsTrackingModuleProps {
  overview: PeriodOverview;
  currentTeam?: TeamFilterId;
}

export const GoalsTrackingModule: React.FC<GoalsTrackingModuleProps> = ({ overview, currentTeam = 'comparison' }) => {
  const { teams } = overview;

  // Total business days in the month (standard 22 business days)
  const totalBusinessDays = 22;

  // Interactive state: remaining business days in the month (default 2 days remaining in September closure)
  const [remainingBusinessDays, setRemainingBusinessDays] = useState<number>(2);

  // Elapsed business days
  const elapsedBusinessDays = Math.max(1, totalBusinessDays - remainingBusinessDays);

  const teamList: TeamData[] = (() => {
    switch (currentTeam) {
      case 'bruno':
        return [teams.bruno];
      case 'lorena':
        return [teams.lorena];
      case 'lucas':
        return [teams.lucas];
      case 'all':
        return [teams.all];
      case 'comparison':
      default:
        return [teams.all, teams.bruno, teams.lorena, teams.lucas];
    }
  })();

  // Farol helper rule:
  // Verde: acima de 90% (>= 90%)
  // Amarelo: entre 70% e 89.9%
  // Vermelho: abaixo de 70% (< 70%)
  const getTrafficStatus = (percentage: number) => {
    if (percentage >= 90) {
      return {
        level: 'green' as const,
        label: 'Ritmo Ideal (Acima de 90%)',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        progressBarClass: 'from-emerald-500 to-emerald-400',
        textColor: 'text-emerald-400',
        lightActive: 'emerald',
      };
    }
    if (percentage >= 70) {
      return {
        level: 'yellow' as const,
        label: 'Atenção Necessária (70% - 89%)',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        progressBarClass: 'from-amber-500 to-amber-400',
        textColor: 'text-amber-400',
        lightActive: 'amber',
      };
    }
    return {
      level: 'red' as const,
      label: 'Crítico / Fora do Ritmo (< 70%)',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      progressBarClass: 'from-rose-500 to-rose-400',
      textColor: 'text-rose-400',
      lightActive: 'rose',
    };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header & Business Days Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Metas vs. Realizado & Ritmo de Fechamento (Run-Rate)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  VGV LÍQUIDO
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Progresso em tempo real da meta mensal, farol de status e cálculo de vendas necessárias por dia útil
              </p>
            </div>
          </div>
        </div>

        {/* Business Days Interactive Selector */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dias Úteis Restantes:</span>
              <span className="font-mono font-bold text-white text-sm">
                {remainingBusinessDays} {remainingBusinessDays === 1 ? 'dia útil' : 'dias úteis'}
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1">
            {[
              { days: 1, label: '1d (Reta Final)' },
              { days: 2, label: '2d (Setembro)' },
              { days: 5, label: '5d (Semana)' },
              { days: 10, label: '10d (Meio do Mês)' },
            ].map((p) => (
              <button
                key={p.days}
                onClick={() => setRemainingBusinessDays(p.days)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  remainingBusinessDays === p.days
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend / Farol Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <span className="text-white font-semibold">Critérios do Farol de Gestão:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Verde: &ge; 90% da meta</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>Amarelo: 70% a 89% da meta</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span>Vermelho: &lt; 70% da meta</span>
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Base: {elapsedBusinessDays} de {totalBusinessDays} dias úteis decorridos ({Math.round((elapsedBusinessDays / totalBusinessDays) * 100)}% do mês)
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">
        {teamList.map((team) => {
          const isConsolidated = team.id === 'all';
          const realized = team.vgvNet;
          const target = team.targetNet;
          const percentAchieved = (realized / target) * 100;
          const traffic = getTrafficStatus(percentAchieved);

          // Calculations for Pace & Gap
          const gap = target - realized;
          const isGoalReached = gap <= 0;

          // Daily pace achieved so far
          const currentDailyPace = realized / elapsedBusinessDays;

          // Required pace per remaining business day to hit 100%
          const requiredDailyPace = isGoalReached
            ? 0
            : remainingBusinessDays > 0
            ? gap / remainingBusinessDays
            : gap;

          // Contracts needed to close the gap
          const contractsNeeded = isGoalReached
            ? 0
            : Math.ceil(gap / (team.ticketAverage || 650000));

          // Projected month-end VGV at current pace
          const projectedTotalVgv = currentDailyPace * totalBusinessDays;
          const projectedPercentage = (projectedTotalVgv / target) * 100;

          return (
            <div
              key={team.id}
              className={`bg-slate-950/80 border rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all ${
                isConsolidated
                  ? 'border-amber-500/40 bg-slate-950/90 shadow-lg shadow-amber-500/5 lg:col-span-2'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Team & Farol Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800/80 gap-3">
                  <div className="flex items-center gap-3">
                    {/* Farol Fisico (Traffic Light Display) */}
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                      <span
                        title="Vermelho (< 70%)"
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          traffic.level === 'red'
                            ? 'bg-rose-500 shadow-md shadow-rose-500 ring-2 ring-rose-400/40'
                            : 'bg-rose-950/40 opacity-30'
                        }`}
                      />
                      <span
                        title="Amarelo (70% - 89%)"
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          traffic.level === 'yellow'
                            ? 'bg-amber-400 shadow-md shadow-amber-400 ring-2 ring-amber-400/40'
                            : 'bg-amber-950/40 opacity-30'
                        }`}
                      />
                      <span
                        title="Verde (>= 90%)"
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          traffic.level === 'green'
                            ? 'bg-emerald-400 shadow-md shadow-emerald-400 ring-2 ring-emerald-400/40 animate-pulse'
                            : 'bg-emerald-950/40 opacity-30'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-sans">
                          {team.name}
                        </h3>
                        {isConsolidated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            VISÃO DIRETORIA
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-sans">
                        Líder: <strong className="text-slate-200">{team.leader}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border font-mono ${traffic.badgeClass}`}>
                      {percentAchieved.toFixed(1)}% da Meta
                    </span>
                  </div>
                </div>

                {/* 1. Progress Bar & Metric Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">
                      Realizado: <strong className="text-white font-mono text-sm">{formatBRL(realized, true)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Meta: <strong className="text-slate-300 font-mono text-sm">{formatBRL(target, true)}</strong>
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                    {/* 100% Mark line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                      style={{ left: '90%' }} 
                      title="Linha de 90% (Ritmo Ideal)"
                    />
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${traffic.progressBarClass} transition-all duration-700`}
                      style={{ width: `${Math.min(100, Math.max(4, percentAchieved))}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>R$ 0</span>
                    <span>Meta 100%: {formatBRL(target, false)}</span>
                    <span className={percentAchieved >= 100 ? 'text-emerald-400 font-bold' : ''}>
                      {percentAchieved >= 100 ? `Superado (+${formatPercent(percentAchieved - 100, 1)})` : `${formatPercent(100 - percentAchieved, 1)} restante`}
                    </span>
                  </div>
                </div>

                {/* 2. Ritmo Necessário & Run Rate Analysis */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Card Ritmo Atual */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Ritmo Atual Realizado:</span>
                    <span className="text-sm font-bold font-mono text-slate-200 mt-0.5 block">
                      {formatBRL(currentDailyPace, true)} <span className="text-[10px] text-slate-400 font-normal">/dia útil</span>
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Base: {elapsedBusinessDays} dias decorridos
                    </span>
                  </div>

                  {/* Card Ritmo Necessário */}
                  <div className={`p-3 rounded-lg border ${
                    isGoalReached 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : traffic.level === 'red'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-amber-500/5 border-amber-500/20'
                  }`}>
                    <span className="text-slate-400 block text-[11px] font-semibold">
                      Ritmo Necessário para 100%:
                    </span>
                    {isGoalReached ? (
                      <div>
                        <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 inline text-amber-400" /> Meta Atingida!
                        </span>
                        <span className="text-[10px] text-emerald-300/80 mt-1 block">
                          Superávit de +{formatBRL(Math.abs(gap), true)}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className={`text-sm font-bold font-mono mt-0.5 block ${traffic.textColor}`}>
                          {formatBRL(requiredDailyPace, true)} <span className="text-[10px] text-slate-400 font-normal">/dia útil</span>
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Faltam <strong>{formatBRL(gap, true)}</strong> em {remainingBusinessDays}d
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Projeção / Contratos */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">
                      {isGoalReached ? 'Fechamento Projetado:' : 'Contratos Necessários:'}
                    </span>
                    {isGoalReached ? (
                      <div>
                        <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
                          {formatBRL(projectedTotalVgv, true)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {projectedPercentage.toFixed(0)}% da meta orçada
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                          ~{contractsNeeded} {contractsNeeded === 1 ? 'contrato' : 'contratos'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Ticket médio: {formatBRL(team.ticketAverage, true)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Note */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${isGoalReached ? 'text-amber-400' : traffic.textColor}`} />
                  <span className="text-slate-300">
                    {isGoalReached 
                      ? 'Equipe em velocidade de cruzeiro, focada em alavancar bônus e premiações.'
                      : `Aceleração comercial necessária de ${formatBRL(requiredDailyPace, true)} por dia útil.`}
                  </span>
                </div>
                <span className="font-mono text-slate-400 hidden sm:inline">
                  {team.contractsNet} contratos líquidos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
