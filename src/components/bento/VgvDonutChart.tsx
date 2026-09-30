import React, { useState } from 'react';
import { PeriodOverview, TeamData, TeamFilterId } from '../../types';
import { formatBRL, formatPercent } from '../../utils/formatters';

interface VgvDonutChartProps {
  overview: PeriodOverview;
  currentTeam: TeamFilterId;
  activeTeamData: TeamData;
}

export const VgvDonutChart: React.FC<VgvDonutChartProps> = ({
  overview,
  currentTeam,
  activeTeamData,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { teams } = overview;
  const isConsolidated = currentTeam === 'all' || currentTeam === 'comparison';

  // Slices definitions
  let segments: {
    label: string;
    sublabel: string;
    value: number;
    color: string;
    dotClass: string;
  }[] = [];

  if (isConsolidated) {
    segments = [
      {
        label: 'Equipe Lucas',
        sublabel: 'Imóveis Prime & Mansões',
        value: teams.lucas.vgvNet,
        color: '#2563EB', // Blue
        dotClass: 'bg-blue-600',
      },
      {
        label: 'Equipe Bruno',
        sublabel: 'Médio e Alto Padrão',
        value: teams.bruno.vgvNet,
        color: '#E60000', // Torrano Red
        dotClass: 'bg-[#E60000]',
      },
      {
        label: 'Equipe Lorena',
        sublabel: 'Lançamentos & Planta',
        value: teams.lorena.vgvNet,
        color: '#F97316', // Orange
        dotClass: 'bg-orange-500',
      },
    ];
  } else if (currentTeam === 'bruno') {
    segments = [
      {
        label: 'Alto Padrão Urbano',
        sublabel: 'Residenciais 3 a 4 suítes',
        value: Math.round(activeTeamData.vgvNet * 0.55),
        color: '#E60000',
        dotClass: 'bg-[#E60000]',
      },
      {
        label: 'Médio Padrão',
        sublabel: 'Famílias & Upgrade',
        value: Math.round(activeTeamData.vgvNet * 0.30),
        color: '#2563EB',
        dotClass: 'bg-blue-600',
      },
      {
        label: 'Investidores / Outros',
        sublabel: 'Locação & Patrimônio',
        value: Math.round(activeTeamData.vgvNet * 0.15),
        color: '#10B981',
        dotClass: 'bg-emerald-500',
      },
    ];
  } else if (currentTeam === 'lorena') {
    segments = [
      {
        label: 'Lançamentos Verticais',
        sublabel: 'Torres na Zona Sul',
        value: Math.round(activeTeamData.vgvNet * 0.50),
        color: '#F97316',
        dotClass: 'bg-orange-500',
      },
      {
        label: 'Crédito Associativo',
        sublabel: 'Repasse na Obra',
        value: Math.round(activeTeamData.vgvNet * 0.35),
        color: '#E60000',
        dotClass: 'bg-[#E60000]',
      },
      {
        label: 'Studios & Compactos',
        sublabel: 'Rentabilidade / Airbnb',
        value: Math.round(activeTeamData.vgvNet * 0.15),
        color: '#06B6D4',
        dotClass: 'bg-cyan-500',
      },
    ];
  } else {
    // Lucas
    segments = [
      {
        label: 'Mansões & Casas de Luxo',
        sublabel: 'Condomínios Fechados',
        value: Math.round(activeTeamData.vgvNet * 0.60),
        color: '#2563EB',
        dotClass: 'bg-blue-600',
      },
      {
        label: 'Imóveis Off-Market',
        sublabel: 'Exclusividades Acima de R$ 3M',
        value: Math.round(activeTeamData.vgvNet * 0.28),
        color: '#E60000',
        dotClass: 'bg-[#E60000]',
      },
      {
        label: 'Comerciais Prime',
        sublabel: 'Salas & Galpões Corporativos',
        value: Math.round(activeTeamData.vgvNet * 0.12),
        color: '#10B981',
        dotClass: 'bg-emerald-500',
      },
    ];
  }

  const totalValue = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Donut geometry
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E60000]">
          Origem & Mix de Receita
        </span>
        <h3 className="text-base font-black text-slate-900 font-display tracking-tight mt-0.5">
          Participação no VGV
        </h3>
        <p className="text-xs text-slate-500">
          {isConsolidated ? 'Distribuição por liderança de equipe' : 'Distribuição por tipologia e produto'}
        </p>
      </div>

      {/* Donut Graphic + Center Metric */}
      <div className="my-auto py-3 flex items-center justify-center relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {segments.map((seg, i) => {
            const share = seg.value / totalValue;
            const strokeDasharray = `${share * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += share;

            const isHovered = hoveredIdx === i;

            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text in Donut Hole */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            {hoveredIdx !== null ? segments[hoveredIdx].label : 'Total Líquido'}
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight mt-0.5">
            {hoveredIdx !== null
              ? formatBRL(segments[hoveredIdx].value, true)
              : formatBRL(activeTeamData.vgvNet, true)}
          </span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
            {hoveredIdx !== null
              ? formatPercent((segments[hoveredIdx].value / totalValue) * 100, 1)
              : '100% Retido'}
          </span>
        </div>
      </div>

      {/* Segment Badges and Legend List */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {segments.map((seg, i) => {
          const share = (seg.value / totalValue) * 100;
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`
                flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-xs
                ${isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50/70'}
              `}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${seg.dotClass} shrink-0`} />
                <div className="truncate">
                  <div className="font-bold text-slate-800 truncate font-sans">
                    {seg.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {seg.sublabel}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono shrink-0 pl-2">
                <span className="font-bold text-slate-900 block">
                  {formatBRL(seg.value, true)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {share.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
