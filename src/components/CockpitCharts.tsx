import React, { useState } from 'react';
import { PeriodOverview, TeamFilterId } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { TrendingUp, Layers, PieChart as PieIcon, ArrowRight, BarChart2 } from 'lucide-react';

interface CockpitChartsProps {
  overview: PeriodOverview;
  currentTeam: TeamFilterId;
}

export const CockpitCharts: React.FC<CockpitChartsProps> = ({ overview, currentTeam }) => {
  const activeData = currentTeam === 'comparison' ? overview.teams.all : overview.teams[currentTeam];
  const { bruno, lorena, lucas } = overview.teams;

  const [hoveredFunnelIndex, setHoveredFunnelIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // 1. Data for Funil Comercial
  const funnelStages = [
    { 
      label: '1. Leads Recebidos', 
      count: activeData.leads, 
      rate: '100%', 
      color: '#1D68FF', 
      desc: 'Topo do Funil',
      subtext: 'Captação Comercial'
    },
    { 
      label: '2. Pastas Analisadas', 
      count: activeData.analyzedDocs, 
      rate: formatPercent(activeData.leads > 0 ? (activeData.analyzedDocs / activeData.leads) : 0), 
      color: '#00D2FF', 
      desc: 'Qualificação Documental',
      subtext: `${activeData.analyzedDocs} pastas montadas`
    },
    { 
      label: '3. Vendas Brutas', 
      count: activeData.contractsGross, 
      rate: formatPercent(activeData.analyzedDocs > 0 ? (activeData.contractsGross / activeData.analyzedDocs) : 0), 
      color: '#10B981', 
      desc: formatBRL(activeData.vgvGross, true),
      subtext: `${activeData.contractsGross} contratos emitidos`
    },
    { 
      label: '4. Vendas Líquidas', 
      count: activeData.contractsNet, 
      rate: formatPercent(activeData.contractsGross > 0 ? (activeData.contractsNet / activeData.contractsGross) : 0), 
      color: '#059669', 
      desc: formatBRL(activeData.vgvNet, true),
      subtext: `${activeData.contractsNet} retidos em caixa`
    },
  ];

  // 2. Teams data for comparative grouped bars
  const teamsList = [
    { key: 'bruno', name: 'Equipe Bruno', leader: 'Bruno Torrano', segment: 'Médio / Alto', data: bruno },
    { key: 'lorena', name: 'Equipe Lorena', leader: 'Lorena Vasconcelos', segment: 'Lançamentos', data: lorena },
    { key: 'lucas', name: 'Equipe Lucas', leader: 'Lucas Siqueira', segment: 'Prime / Mansões', data: lucas },
  ];

  const maxVal = Math.max(
    ...teamsList.flatMap((t) => [t.data.vgvGross, t.data.vgvNet, t.data.vgvCanceled])
  ) || 1;

  // 3. Donut calculations for Net VGV Market Share
  const totalNet = bruno.vgvNet + lorena.vgvNet + lucas.vgvNet || 1;
  const shareLucas = (lucas.vgvNet / totalNet) * 100;
  const shareBruno = (bruno.vgvNet / totalNet) * 100;
  const shareLorena = (lorena.vgvNet / totalNet) * 100;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeLucas = (shareLucas / 100) * circumference;
  const strokeBruno = (shareBruno / 100) * circumference;
  const strokeLorena = (shareLorena / 100) * circumference;

  const offsetLucas = 0;
  const offsetBruno = -strokeLucas;
  const offsetLorena = -(strokeLucas + strokeBruno);

  const isComparisonMode = currentTeam === 'comparison';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Bloco 1: Funil Comercial (Col 5 se War Room, Col 6 se Equipe Individual / Diretoria) */}
      <div className={`${isComparisonMode ? 'lg:col-span-5' : 'lg:col-span-6'} bg-[#111C32]/90 border border-[#1E2E4E] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2E4E]">
          <div>
            <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00D2FF]" />
              <span>Funil Comercial • {activeData.name}</span>
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              Leads &rarr; Pastas &rarr; Vendas Brutas &rarr; Vendas Líquidas
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1D68FF]/20 text-[#00D2FF] border border-[#00D2FF]/30">
            {activeData.name}
          </span>
        </div>

        {/* Visual Step Funnel */}
        <div className="space-y-3.5 my-auto">
          {funnelStages.map((stage, idx) => {
            const maxFunnelVal = funnelStages[0].count || 1;
            const barWidth = Math.max(18, Math.min(100, (stage.count / maxFunnelVal) * 100));
            const isHovered = hoveredFunnelIndex === idx;

            return (
              <div 
                key={stage.label} 
                onMouseEnter={() => setHoveredFunnelIndex(idx)}
                onMouseLeave={() => setHoveredFunnelIndex(null)}
                className="space-y-1.5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{formatNumber(stage.count)} un.</span>
                    <span className="text-[#00D2FF] font-bold text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-[#1E2E4E]">
                      {stage.rate}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#060A12] h-4 rounded-full overflow-hidden border border-[#1E2E4E]/80 p-0.5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-500 relative flex items-center justify-end pr-2 text-[9px] font-bold text-white shadow-md"
                    style={{ 
                      width: `${barWidth}%`,
                      backgroundColor: stage.color,
                      boxShadow: isHovered ? `0 0 15px ${stage.color}` : 'none'
                    }}
                  >
                    <span className="opacity-90">{stage.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#1E2E4E] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>Retenção Efetiva em Caixa:</span>
          <span className="font-bold text-emerald-400">
            {formatNumber(activeData.contractsNet)} de {formatNumber(activeData.contractsGross)} contratos ({formatPercent(activeData.vgvGross > 0 ? activeData.vgvNet / activeData.vgvGross : 0)})
          </span>
        </div>
      </div>

      {/* Bloco 2: Se War Room, exibe Comparativo Bruno x Lorena x Lucas. Se Individual, exibe Raio-X Blindado da Equipe */}
      {isComparisonMode ? (
        <div className="lg:col-span-7 bg-[#111C32]/90 border border-[#1E2E4E] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2E4E] gap-2">
            <div>
              <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Evolução e Comparativo • War Room</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Vendas Brutas vs. Vendas Líquidas vs. Destratos (Bruno x Lorena x Lucas)
              </p>
            </div>

            {/* Grouped Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-[#1D68FF]" />
                Brutas
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
                Líquidas
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-[#E60000]" />
                Destratos
              </span>
            </div>
          </div>

          {/* Grouped Bar Visualizer */}
          <div className="grid grid-cols-3 gap-4 h-56 items-end pt-4 px-2">
            {teamsList.map((team, idx) => {
              const hGross = Math.max(10, (team.data.vgvGross / maxVal) * 100);
              const hNet = Math.max(8, (team.data.vgvNet / maxVal) * 100);
              const hCanceled = Math.max(5, (team.data.vgvCanceled / maxVal) * 100);
              const isHovered = hoveredBarIndex === idx;

              return (
                <div 
                  key={team.key}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip / Floating Card on Hover */}
                  <div className={`mb-2 p-2 rounded-xl bg-[#090E17] border border-[#1E2E4E] text-[10px] font-mono shadow-xl transition-all ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="text-white font-bold">{team.name}</div>
                    <div className="text-[#1D68FF]">Bruto: {formatBRL(team.data.vgvGross, true)}</div>
                    <div className="text-emerald-400">Líq: {formatBRL(team.data.vgvNet, true)}</div>
                    <div className="text-[#E60000]">Quebra: {formatBRL(team.data.vgvCanceled, true)} ({formatPercent(team.data.cancellationRate / 100)})</div>
                  </div>

                  {/* 3 Bars in Group */}
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-36">
                    {/* Gross Bar */}
                    <div className="w-1/3 flex flex-col items-center h-full justify-end">
                      <div 
                        className="w-full rounded-t-md bg-[#1D68FF] hover:brightness-110 transition-all shadow-[0_0_10px_rgba(29,104,255,0.3)]"
                        style={{ height: `${hGross}%` }}
                      />
                    </div>

                    {/* Net Bar */}
                    <div className="w-1/3 flex flex-col items-center h-full justify-end">
                      <div 
                        className="w-full rounded-t-md bg-[#10B981] hover:brightness-110 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        style={{ height: `${hNet}%` }}
                      />
                    </div>

                    {/* Canceled Bar */}
                    <div className="w-1/3 flex flex-col items-center h-full justify-end">
                      <div 
                        className="w-full rounded-t-md bg-[#E60000] hover:brightness-110 transition-all shadow-[0_0_10px_rgba(230,0,0,0.3)]"
                        style={{ height: `${hCanceled}%` }}
                      />
                    </div>
                  </div>

                  {/* Clean X-Axis Label Bottom: Only Leadership Name */}
                  <div className="mt-3 text-center border-t border-[#1E2E4E] pt-2 w-full">
                    <span className="text-xs font-bold text-white tracking-wide font-display block">
                      {team.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Organized Explanatory Metrics Cards below the graph without overlapping */}
          <div className="pt-3 border-t border-[#1E2E4E] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Equipe Bruno</span>
                <span className="text-[10px] text-blue-400 font-semibold">Médio/Alto</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">VGV Líquido:</span>
                <span className="font-bold text-white">{formatBRL(bruno.vgvNet, true)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Destratos:</span>
                <span className="font-bold text-[#E60000]">{formatBRL(bruno.vgvCanceled, true)} ({formatPercent(bruno.cancellationRate / 100)})</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Equipe Lorena</span>
                <span className="text-[10px] text-amber-400 font-semibold">Lançamentos</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">VGV Líquido:</span>
                <span className="font-bold text-amber-400">{formatBRL(lorena.vgvNet, true)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Destratos:</span>
                <span className="font-bold text-[#E60000]">{formatBRL(lorena.vgvCanceled, true)} ({formatPercent(lorena.cancellationRate / 100)})</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Equipe Lucas</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Prime</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">VGV Líquido:</span>
                <span className="font-bold text-emerald-400">{formatBRL(lucas.vgvNet, true)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Destratos:</span>
                <span className="font-bold text-emerald-400">{formatBRL(lucas.vgvCanceled, true)} ({formatPercent(lucas.cancellationRate / 100)})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Raio-X Blindado da Equipe Individual ou Diretoria Consolidada (Sem Vazar Dados das Outras) */
        <div className="lg:col-span-6 bg-[#111C32]/90 border border-[#1E2E4E] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2E4E]">
            <div>
              <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Raio-X de Estanqueidade de Caixa • {activeData.name}</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Auditoria restrita de retenção financeira e eficiência documental
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Sessão Blindada
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                VGV Líquido em Caixa
              </span>
              <div className="text-xl font-black text-emerald-400 font-display">
                {formatBRL(activeData.vgvNet, true)}
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                {activeData.contractsNet} contratos mantidos ({formatPercent(activeData.vgvGross > 0 ? activeData.vgvNet / activeData.vgvGross : 0)} de retenção)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border-2 border-[#E60000]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E60000] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-ping" />
                Destratos / Quebras
              </span>
              <div className="text-xl font-black text-[#E60000] font-display">
                {formatBRL(activeData.vgvCanceled, true)}
              </div>
              <div className="text-[10px] text-red-300/80 font-mono">
                {activeData.contractsCanceled} quebras ({formatPercent(activeData.vgvGross > 0 ? activeData.vgvCanceled / activeData.vgvGross : 0)})
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Vendas Brutas Emitidas
              </span>
              <div className="text-lg font-bold text-white font-display">
                {formatBRL(activeData.vgvGross, true)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {activeData.contractsGross} contratos formalizados
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[#1E2E4E] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Ticket Médio da Operação
              </span>
              <div className="text-lg font-bold text-[#00D2FF] font-display">
                {formatBRL(activeData.ticketAverage, true)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {activeData.analyzedDocs} pastas qualificadas
              </div>
            </div>
          </div>

          {/* Goal Achievement Bar */}
          <div className="p-3.5 rounded-xl bg-[#090E17] border border-[#1E2E4E] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Meta de VGV Líquido ({formatBRL(activeData.targetNet, true)}):</span>
              <span className="font-bold text-emerald-400">
                {((activeData.vgvNet / activeData.targetNet) * 100).toFixed(1)}% atingido
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-[#1E2E4E]/80">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#00D2FF] transition-all duration-500 shadow-md"
                style={{ width: `${Math.min(100, (activeData.vgvNet / activeData.targetNet) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
