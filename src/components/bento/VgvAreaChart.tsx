import React, { useState } from 'react';
import { MonthlyHistory, PeriodOverview } from '../../types';
import { formatBRL } from '../../utils/formatters';

interface VgvAreaChartProps {
  history: MonthlyHistory[];
  periodLabel: string;
  isConsolidated: boolean;
  teamNetKey?: 'brunoNet' | 'lorenaNet' | 'lucasNet';
}

export const VgvAreaChart: React.FC<VgvAreaChartProps> = ({
  history,
  periodLabel,
  isConsolidated,
  teamNetKey,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) return null;

  // Chart dimensions
  const width = 720;
  const height = 240;
  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const usableWidth = width - paddingLeft - paddingRight;
  const usableHeight = height - paddingTop - paddingBottom;

  // Values calculation
  const pointsData = history.map((item) => {
    const netVal = teamNetKey ? item[teamNetKey] : item.vgvNetTotal;
    const targetVal = teamNetKey ? Math.round(item.vgvTarget / 3) : item.vgvTarget;
    return {
      label: item.shortMonth || item.month,
      fullLabel: item.month,
      net: netVal,
      target: targetVal,
      gross: item.vgvGrossTotal,
    };
  });

  const allValues = pointsData.flatMap((d) => [d.net, d.target]);
  const minVal = 0;
  const maxVal = Math.max(...allValues) * 1.15 || 1000000;

  // Generate SVG coordinates
  const coords = pointsData.map((d, i) => {
    const x = paddingLeft + (i / (pointsData.length - 1 || 1)) * usableWidth;
    const yNet = height - paddingBottom - ((d.net - minVal) / (maxVal - minVal)) * usableHeight;
    const yTarget = height - paddingBottom - ((d.target - minVal) / (maxVal - minVal)) * usableHeight;
    return { x, yNet, yTarget, data: d };
  });

  // Build curved path for net VGV (Cubic Bézier)
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = pts[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  };

  const netPoints = coords.map((c) => ({ x: c.x, y: c.yNet }));
  const targetPoints = coords.map((c) => ({ x: c.x, y: c.yTarget }));

  const netLinePath = buildSmoothPath(netPoints);
  const targetLinePath = buildSmoothPath(targetPoints);

  // Area path closing
  const areaPath = `${netLinePath} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  // Y-axis grid ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = minVal + pct * (maxVal - minVal);
    const y = height - paddingBottom - pct * usableHeight;
    return { val, y };
  });

  const activePoint = hoveredIndex !== null ? coords[hoveredIndex] : coords[coords.length - 1];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full relative">
      
      {/* Header do Bloco */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E60000]">
            Performance Financeira
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight">
            Evolução do VGV e Conversão Líquida
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Realizado acumulado vs. Linha de Meta planejada ({periodLabel})
          </p>
        </div>

        {/* Legenda Gráfica Limpa */}
        <div className="flex items-center gap-4 text-xs font-mono self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E60000] inline-block shadow-sm" />
            <span className="text-slate-700 font-bold">VGV Líquido Real</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2563EB] inline-block border-t border-dashed border-[#2563EB]" />
            <span className="text-slate-600 font-medium">Meta Estipulada</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Container */}
      <div className="w-full mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          <defs>
            {/* Soft Red Torrano Gradient */}
            <linearGradient id="torranoAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E60000" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#E60000" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#E60000" stopOpacity="0.0" />
            </linearGradient>

            <filter id="shadowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#E60000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Y Axis Grid lines and labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray={i === 0 ? 'none' : '3 3'}
              />
              <text
                x={paddingLeft - 10}
                y={tick.y + 4}
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                {formatBRL(tick.val, true)}
              </text>
            </g>
          ))}

          {/* Filled Area in Soft Red */}
          <path d={areaPath} fill="url(#torranoAreaGradient)" />

          {/* Target Line (Blue) */}
          <path
            d={targetLinePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeOpacity="0.75"
          />

          {/* Main Net VGV Line (Red Torrano) */}
          <path
            d={netLinePath}
            fill="none"
            stroke="#E60000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadowRed)"
          />

          {/* X Axis Labels & Interactive Points */}
          {coords.map((pt, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* X Axis Month Label */}
              <text
                x={pt.x}
                y={height - 12}
                fill={hoveredIndex === i ? '#0F172A' : '#64748B'}
                fontSize="11"
                fontWeight={hoveredIndex === i ? '700' : '500'}
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {pt.data.label}
              </text>

              {/* Point on Net line */}
              <circle
                cx={pt.x}
                cy={pt.yNet}
                r={hoveredIndex === i ? 6 : 4}
                fill="#FFFFFF"
                stroke="#E60000"
                strokeWidth={hoveredIndex === i ? 3 : 2}
                className="transition-all duration-150"
              />

              {/* Vertical guideline on hover */}
              {hoveredIndex === i && (
                <line
                  x1={pt.x}
                  y1={paddingTop}
                  x2={pt.x}
                  y2={height - paddingBottom}
                  stroke="#E60000"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.5"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Floating Insight / Tooltip Indicator */}
      {activePoint && (
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono bg-slate-50/70 rounded-lg px-3.5 py-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Período:</span>
            <strong className="text-slate-900 font-bold">{activePoint.data.fullLabel}</strong>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 mr-1.5">VGV Realizado:</span>
              <strong className="text-[#E60000] font-black text-sm">{formatBRL(activePoint.data.net)}</strong>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">Meta:</span>
              <strong className="text-[#2563EB] font-bold">{formatBRL(activePoint.data.target)}</strong>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-500 mr-1.5">Atingimento:</span>
              <strong className="text-[#10B981] font-bold">
                {((activePoint.data.net / (activePoint.data.target || 1)) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
