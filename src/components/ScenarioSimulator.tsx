import React, { useState } from 'react';
import { PeriodOverview, TeamData } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';
import { Calculator, TrendingUp, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface ScenarioSimulatorProps {
  overview: PeriodOverview;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ overview }) => {
  const { teams } = overview;
  const currentTotalGross = teams.all.vgvGross;
  const currentTotalCanceled = teams.all.vgvCanceled;
  const currentCancellationRate = teams.all.cancellationRate;
  const currentNetVgv = teams.all.vgvNet;

  // State: target destrato reduction in percentage points
  const [targetReductionPp, setTargetReductionPp] = useState<number>(3.5);
  // Brokerage commission rate estimated (e.g. 5%)
  const [commissionRate, setCommissionRate] = useState<number>(5.0);

  // Simulated calculations
  const newCancellationRate = Math.max(0, currentCancellationRate - targetReductionPp);
  const newCanceledVgv = currentTotalGross * (newCancellationRate / 100);
  const recoveredVgv = currentTotalCanceled - newCanceledVgv;
  const simulatedNetVgv = currentTotalGross - newCanceledVgv;
  const recoveredCommission = recoveredVgv * (commissionRate / 100);
  const percentageNetGrowth = ((simulatedNetVgv - currentNetVgv) / currentNetVgv) * 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>Simulador Executivo de Sensibilidade & Recuperação de Destrato</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Projeção em tempo real do impacto no caixa ao aplicar conformidade pré-bancária e reduzir a quebra de vendas
          </p>
        </div>
        <button
          onClick={() => {
            setTargetReductionPp(3.5);
            setCommissionRate(5.0);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Restaurar Padrão</span>
        </button>
      </div>

      {/* Simulator Inputs & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5 bg-slate-950/70 p-4.5 rounded-xl border border-slate-800/80">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label htmlFor="reduction-slider" className="font-semibold text-slate-200">
                Meta de Redução na Taxa de Destrato:
              </label>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                -{targetReductionPp.toFixed(1)} p.p.
              </span>
            </div>
            <input
              id="reduction-slider"
              type="range"
              min="0.5"
              max="7.0"
              step="0.5"
              value={targetReductionPp}
              onChange={(e) => setTargetReductionPp(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>Atual: {formatPercent(currentCancellationRate, 1)}</span>
              <span>Projeção Simulada: <strong className="text-emerald-400">{formatPercent(newCancellationRate, 1)}</strong></span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Cenários Pré-Configurados de Gestão:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTargetReductionPp(1.5)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  targetReductionPp === 1.5
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-semibold">Conservador</div>
                <div className="text-[10px] text-slate-400 mt-0.5">-1,5 p.p. no destrato</div>
              </button>

              <button
                onClick={() => setTargetReductionPp(3.5)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  targetReductionPp === 3.5
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-semibold">Moderado (Plano)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">-3,5 p.p. no destrato</div>
              </button>

              <button
                onClick={() => setTargetReductionPp(5.0)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  targetReductionPp === 5.0
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-semibold">Otimista (Benchmark)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">-5,0 p.p. no destrato</div>
              </button>
            </div>
          </div>

          {/* Commission slider */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="commission-slider" className="font-semibold text-slate-200">
                Comissão Média de Intermediação:
              </label>
              <span className="font-mono text-amber-400 font-bold">
                {commissionRate.toFixed(1)}%
              </span>
            </div>
            <input
              id="commission-slider"
              type="range"
              min="3.0"
              max="6.0"
              step="0.5"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Honorários médios brutos da Torrano Negócios sobre o VGV Líquido
            </div>
          </div>
        </div>

        {/* Financial Impact Results Column */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: VGV Líquido Adicional */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                VGV Líquido Recuperado
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                +{formatBRL(recoveredVgv, true)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                {formatBRL(recoveredVgv, false)}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-300 font-mono">
              +{percentageNetGrowth.toFixed(1)}% sobre o VGV atual
            </div>
          </div>

          {/* Card 2: Honorários / Comissões Salvas */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Comissões Preservadas no Caixa
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1.5 tabular-nums">
                +{formatBRL(recoveredCommission, true)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                {formatBRL(recoveredCommission, false)}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 font-mono">
              Margem direta para expansão
            </div>
          </div>

          {/* Card 3: Novo VGV Líquido Projetado */}
          <div className="sm:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Novo VGV Líquido Projetado (Período)
              </span>
              <div className="text-3xl font-black font-mono text-white mt-1 tabular-nums">
                {formatBRL(simulatedNetVgv, true)}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                VGV Bruto mantido ({formatBRL(currentTotalGross, true)}) com destrato reduzido para {formatPercent(newCancellationRate, 1)}
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Viabilidade Comprovada</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-tight">
                Alcançável com implantação da esteira pré-bancária na Equipe Lorena.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
