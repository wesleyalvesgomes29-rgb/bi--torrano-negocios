import React, { useState } from 'react';
import { MonthlyHistory, PeriodOverview, TeamData } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';
import { BarChart, TrendingUp, PieChart, Info } from 'lucide-react';

interface ChartsSectionProps {
  overview: PeriodOverview;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ overview }) => {
  const { teams, history } = overview;
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Teams data for comparative bar chart
  const teamsList = [teams.bruno, teams.lorena, teams.lucas];
  const maxBarValue = Math.max(
    ...teamsList.flatMap((t) => [t.vgvGross, t.vgvNet, t.vgvCanceled])
  );

  // History data for line/area chart
  const maxHistoryValue = Math.max(
    ...history.flatMap((h) => [h.vgvGrossTotal, h.vgvNetTotal, h.vgvTarget])
  );

  // Donut chart calculations (Bruno vs Lorena vs Lucas share of Net VGV)
  const totalNetAll = teams.bruno.vgvNet + teams.lorena.vgvNet + teams.lucas.vgvNet;
  const shareLucas = (teams.lucas.vgvNet / totalNetAll) * 100;
  const shareBruno = (teams.bruno.vgvNet / totalNetAll) * 100;
  const shareLorena = (teams.lorena.vgvNet / totalNetAll) * 100;

  // Donut SVG parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeLucas = (shareLucas / 100) * circumference;
  const strokeBruno = (shareBruno / 100) * circumference;
  const strokeLorena = (shareLorena / 100) * circumference;

  const offsetLucas = 0;
  const offsetBruno = -strokeLucas;
  const offsetLorena = -(strokeLucas + strokeBruno);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Gráfico de Barras: Comparativo por Equipe (Col 1-7) */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart className="w-4 h-4 text-amber-400" />
                <span>Comparativo de VGV: Bruto vs. Líquido vs. Destratos</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Volume financeiro realizado e perdas por cancelamento por equipe
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Bruto
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Líquido
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Destratos
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="mt-6 space-y-6">
            {teamsList.map((team, idx) => {
              const grossWidth = (team.vgvGross / maxBarValue) * 100;
              const netWidth = (team.vgvNet / maxBarValue) * 100;
              const canceledWidth = (team.vgvCanceled / maxBarValue) * 100;

              return (
                <div 
                  key={team.id} 
                  className="space-y-1.5 p-2 rounded-lg hover:bg-slate-800/40 transition-colors"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{team.name}</span>
                    <span className="text-slate-400 font-mono">
                      Taxa de Destrato: <strong className={team.cancellationRate > 12 ? 'text-rose-400' : 'text-slate-300'}>{formatPercent(team.cancellationRate, 1)}</strong>
                    </span>
                  </div>

                  {/* 3 Bars */}
                  <div className="space-y-1">
                    {/* Bruto */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-12 text-slate-400">Bruto</span>
                      <div className="flex-1 bg-slate-950 h-3.5 rounded-sm overflow-hidden flex items-center">
                        <div
                          className="bg-indigo-500 h-full rounded-sm transition-all duration-500 hover:brightness-110 flex items-center justify-end pr-1 text-[9px] font-mono text-white font-bold"
                          style={{ width: `${Math.max(12, grossWidth)}%` }}
                        >
                          {formatBRL(team.vgvGross, true)}
                        </div>
                      </div>
                    </div>

                    {/* Líquido */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-12 text-slate-400">Líquido</span>
                      <div className="flex-1 bg-slate-950 h-3.5 rounded-sm overflow-hidden flex items-center">
                        <div
                          className="bg-emerald-500 h-full rounded-sm transition-all duration-500 hover:brightness-110 flex items-center justify-end pr-1 text-[9px] font-mono text-slate-950 font-bold"
                          style={{ width: `${Math.max(12, netWidth)}%` }}
                        >
                          {formatBRL(team.vgvNet, true)}
                        </div>
                      </div>
                    </div>

                    {/* Destratos */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-12 text-slate-400">Destrato</span>
                      <div className="flex-1 bg-slate-950 h-3 rounded-sm overflow-hidden flex items-center">
                        <div
                          className="bg-rose-500 h-full rounded-sm transition-all duration-500 hover:brightness-110 flex items-center justify-end pr-1 text-[9px] font-mono text-white font-bold"
                          style={{ width: `${Math.max(8, canceledWidth)}%` }}
                        >
                          {formatBRL(team.vgvCanceled, true)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>* Considera contratos com emissão e confirmação de entrada bancária</span>
          <span className="text-slate-300 font-mono">Consolidado Líquido: {formatBRL(teams.all.vgvNet, true)}</span>
        </div>
      </div>

      {/* 2. Gráfico de Rosca / Donut: Market Share por Equipe (Col 8-12) */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Participação no VGV Líquido Total</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fatia de faturamento real de cada equipe comercial
            </p>
          </div>

          {/* Donut Chart Visual */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="18"
                />
                {/* Slice Lucas (Emerald) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray={`${strokeLucas} ${circumference}`}
                  strokeDashoffset={offsetLucas}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('lucas')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Slice Bruno (Blue) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeDasharray={`${strokeBruno} ${circumference}`}
                  strokeDashoffset={offsetBruno}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('bruno')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Slice Lorena (Amber) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray={`${strokeLorena} ${circumference}`}
                  strokeDashoffset={offsetLorena}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('lorena')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Líquido</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {formatBRL(totalNetAll, true)}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% VGV</span>
              </div>
            </div>

            {/* Team Legend List */}
            <div className="space-y-3 text-xs w-full max-w-[200px]">
              <div 
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  hoveredSlice === 'lucas' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/40 border-slate-800'
                }`}
                onMouseEnter={() => setHoveredSlice('lucas')}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Equipe Lucas</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatPercent(shareLucas, 1)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between font-mono">
                  <span>{formatBRL(teams.lucas.vgvNet, true)}</span>
                  <span>{teams.lucas.contractsNet} cont.</span>
                </div>
              </div>

              <div 
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  hoveredSlice === 'bruno' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-950/40 border-slate-800'
                }`}
                onMouseEnter={() => setHoveredSlice('bruno')}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Equipe Bruno</span>
                  </div>
                  <span className="font-mono font-bold text-blue-400">
                    {formatPercent(shareBruno, 1)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between font-mono">
                  <span>{formatBRL(teams.bruno.vgvNet, true)}</span>
                  <span>{teams.bruno.contractsNet} cont.</span>
                </div>
              </div>

              <div 
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  hoveredSlice === 'lorena' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950/40 border-slate-800'
                }`}
                onMouseEnter={() => setHoveredSlice('lorena')}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Equipe Lorena</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    {formatPercent(shareLorena, 1)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between font-mono">
                  <span>{formatBRL(teams.lorena.vgvNet, true)}</span>
                  <span>{teams.lorena.contractsNet} cont.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Equipe Lucas lidera o VGV Líquido devido ao ticket médio alto (R$ 1,15M)</span>
        </div>
      </div>

      {/* 3. Gráfico de Linha/Área: Evolução Mensal do VGV Líquido no Ano (Col 1-12) */}
      <div className="lg:col-span-12 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Evolução Histórica do VGV Líquido vs. Meta Comercial (2026)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento mensal da curva de fechamento de vendas reais e atingimento de metas
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
              <span>VGV Líquido Realizado</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-400 inline-block" />
              <span>Meta Corporativa</span>
            </span>
          </div>
        </div>

        {/* Interactive SVG Area Chart */}
        <div className="mt-6 relative h-64 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 900 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = 200 - pct * 170;
              return (
                <g key={i}>
                  <line x1="40" y1={y} x2="880" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="35" y={y + 3} fill="#64748b" fontSize="10" textAnchor="end" className="font-mono">
                    {formatBRL((maxHistoryValue * 1.1) * pct, true)}
                  </text>
                </g>
              );
            })}

            {/* Calculations for SVG Points */}
            {(() => {
              const totalItems = history.length;
              const stepX = (880 - 60) / (totalItems - 1);
              const maxVal = maxHistoryValue * 1.1;

              // Build points for Realized Net VGV
              const netPoints = history.map((item, idx) => {
                const x = 60 + idx * stepX;
                const y = 200 - (item.vgvNetTotal / maxVal) * 170;
                return { x, y, item };
              });

              // Build points for Target
              const targetPoints = history.map((item, idx) => {
                const x = 60 + idx * stepX;
                const y = 200 - (item.vgvTarget / maxVal) * 170;
                return { x, y, item };
              });

              const netPathD = netPoints.reduce(
                (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
                ''
              );

              const areaPathD = `${netPathD} L ${netPoints[netPoints.length - 1].x} 200 L ${netPoints[0].x} 200 Z`;

              const targetPathD = targetPoints.reduce(
                (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
                ''
              );

              return (
                <>
                  {/* Area fill */}
                  <path d={areaPathD} fill="url(#netGradient)" />

                  {/* Target line (Dashed) */}
                  <path d={targetPathD} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Realized line */}
                  <path d={netPathD} fill="none" stroke="#10b981" strokeWidth="2.5" />

                  {/* Points on Realized line */}
                  {netPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredLineIndex === idx ? '6' : '4'}
                        fill="#10b981"
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredLineIndex(idx)}
                        onMouseLeave={() => setHoveredLineIndex(null)}
                      />
                      {/* X-axis Month Label */}
                      <text
                        x={p.x}
                        y={218}
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                        className="font-mono font-medium"
                      >
                        {p.item.shortMonth}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>

          {/* Hover tooltip details */}
          {hoveredLineIndex !== null && (
            <div 
              className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-10 flex items-center gap-4"
            >
              <div>
                <span className="text-slate-400 block font-semibold">{history[hoveredLineIndex].month} 2026</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {formatBRL(history[hoveredLineIndex].vgvNetTotal, false)}
                </span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-slate-400 block">Meta Comercial:</span>
                <span className="text-amber-400 font-mono font-semibold">
                  {formatBRL(history[hoveredLineIndex].vgvTarget, false)}
                </span>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-slate-400 block">Destratos Mês:</span>
                <span className="text-rose-400 font-mono font-semibold">
                  {formatBRL(history[hoveredLineIndex].destratoTotal, false)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
