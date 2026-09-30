import React from 'react';
import { MonthlyHistory, TeamData } from '../../types';
import { formatBRL } from '../../utils/formatters';
import { BarChart3 } from 'lucide-react';

interface GrossNetBarChartProps {
  history: MonthlyHistory[];
  activeTeamData: TeamData;
}

export const GrossNetBarChart: React.FC<GrossNetBarChartProps> = ({
  history,
  activeTeamData,
}) => {
  // Use last 4-5 points of history
  const recentHistory = history.slice(-4);

  // If consolidated, use totals; if team, scale to team proportion
  const teamRatio = activeTeamData.vgvNet / (history[history.length - 1]?.vgvNetTotal || 1);

  const bars = recentHistory.map((item) => {
    const gross = Math.round(item.vgvGrossTotal * teamRatio);
    const net = Math.round(item.vgvNetTotal * teamRatio);
    const canceled = Math.round(item.destratoTotal * teamRatio);
    return {
      label: item.shortMonth || item.month,
      gross,
      net,
      canceled,
    };
  });

  const maxVal = Math.max(...bars.map((b) => b.gross)) * 1.15 || 1000000;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
            Retenção de Faturamento
          </span>
          <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
            Comparativo Histórico de VGV
          </h3>
          <p className="text-xs text-slate-500">
            VGV Bruto Emitido vs. VGV Líquido em Caixa
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <BarChart3 className="w-4 h-4" />
        </div>
      </div>

      {/* Vertical Columns Graphic */}
      <div className="my-auto py-3">
        <div className="flex items-end justify-between gap-3 h-36 pt-4 border-b border-slate-200 px-2">
          {bars.map((bar) => {
            const grossHeight = (bar.gross / maxVal) * 100;
            const netHeight = (bar.net / maxVal) * 100;

            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Gross bar (Slate / Soft Red) */}
                  <div className="w-1/2 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-0.5">
                      {formatBRL(bar.gross, true)}
                    </span>
                    <div
                      className="w-full bg-slate-300 group-hover:bg-slate-400 rounded-t transition-all duration-300 shadow-sm"
                      style={{ height: `${grossHeight}%` }}
                      title={`Bruto: ${formatBRL(bar.gross)}`}
                    />
                  </div>

                  {/* Net bar (Green / Torrano) */}
                  <div className="w-1/2 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-mono text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-0.5">
                      {formatBRL(bar.net, true)}
                    </span>
                    <div
                      className="w-full bg-[#10B981] rounded-t transition-all duration-300 shadow-sm"
                      style={{ height: `${netHeight}%` }}
                      title={`Líquido: ${formatBRL(bar.net)}`}
                    />
                  </div>
                </div>

                {/* X Axis Month Label */}
                <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            <span className="text-slate-600">VGV Bruto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
            <span className="text-emerald-700 font-bold">VGV Líquido</span>
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Retenção: <strong className="text-emerald-600 font-bold">{formatBRL(activeTeamData.vgvNet, true)}</strong>
        </span>
      </div>

    </div>
  );
};
