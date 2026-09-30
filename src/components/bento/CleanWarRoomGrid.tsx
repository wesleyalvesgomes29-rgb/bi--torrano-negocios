import React from 'react';
import { PeriodOverview, TeamData } from '../../types';
import { formatBRL, formatNumber, formatPercent } from '../../utils/formatters';
import { Trophy, Users, FileText, CheckCircle2, AlertOctagon, ArrowUpRight, TrendingUp } from 'lucide-react';

interface CleanWarRoomGridProps {
  overview: PeriodOverview;
  onSelectTeam: (teamId: 'bruno' | 'lorena' | 'lucas') => void;
  onOpenAiModal: () => void;
}

export const CleanWarRoomGrid: React.FC<CleanWarRoomGridProps> = ({
  overview,
  onSelectTeam,
  onOpenAiModal,
}) => {
  const { teams, label } = overview;
  const individualTeams: TeamData[] = [teams.bruno, teams.lorena, teams.lucas];

  // Sort teams by VGV Líquido descending
  const sortedTeams = [...individualTeams].sort((a, b) => b.vgvNet - a.vgvNet);
  const totalNet = teams.all.vgvNet || 1;

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black font-mono bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
          🥇 1º Lugar · Destaque
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black font-mono bg-slate-100 text-slate-700 border border-slate-300">
          🥈 2º Lugar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black font-mono bg-orange-50 text-orange-800 border border-orange-200">
        🥉 3º Lugar
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E60000] uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Reunião Geral de Coordenadores · {label}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
            War Room Comparativo de Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Matriz executiva consolidando a retenção de caixa e produtividade de Bruno, Lorena e Lucas
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-center">
          <div className="text-right font-mono bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block">VGV Líquido Torrano</span>
            <span className="text-xl font-black text-emerald-700">{formatBRL(teams.all.vgvNet)}</span>
          </div>
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sortedTeams.map((team, index) => {
          const isWinner = index === 0;
          const share = (team.vgvNet / totalNet) * 100;
          const isCritical = team.cancellationRate > 12;

          return (
            <div
              key={team.id}
              onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
              className={`
                bg-white border rounded-xl p-5 lg:p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group flex flex-col justify-between
                ${isWinner ? 'border-amber-400 ring-1 ring-amber-200' : 'border-slate-200 hover:border-slate-300'}
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getRankBadge(index)}
                  <span className="text-xs text-blue-600 font-mono font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Abrir página <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-display">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Líder: <strong className="text-slate-700">{team.leader}</strong>
                </p>

                {/* Share Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500">Share no VGV Total:</span>
                    <strong className="text-blue-700">{share.toFixed(1)}%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWinner ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>

                {/* Numbers */}
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vendas Líquidas:</span>
                    <strong className="text-emerald-700 font-bold text-sm">
                      {formatBRL(team.vgvNet)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Destratos:</span>
                    <strong className={`font-bold ${isCritical ? 'text-[#E60000]' : 'text-rose-600'}`}>
                      {formatBRL(team.vgvCanceled)} ({formatPercent(team.cancellationRate, 1)})
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pastas Analisadas:</span>
                    <strong className="text-slate-800">
                      {formatNumber(team.analyzedDocs)} ({formatPercent(team.conversionDocRate, 1)})
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{team.contractsNet} contratos retidos</span>
                <span className="font-bold text-slate-700">Ticket {formatBRL(team.ticketAverage, true)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Matriz Tabela Executiva */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display">
              Tabela Comparativa Oficial
            </h3>
            <p className="text-xs text-slate-500">
              Desempenho lado a lado para reunião do Flávio Torrano
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Meta Corporativa: <strong className="text-emerald-700">{formatBRL(teams.all.targetNet)}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Posição & Equipe</th>
                <th className="py-3 px-4 font-bold">Leads</th>
                <th className="py-3 px-4 font-bold">Pastas Analisadas</th>
                <th className="py-3 px-4 font-bold text-emerald-700">Vendas Líquidas</th>
                <th className="py-3 px-4 font-bold text-[#E60000]">Destratos</th>
                <th className="py-3 px-4 font-bold">Atingimento</th>
                <th className="py-3 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 w-4">{index + 1}º</span>
                      <div>
                        <strong className="text-slate-900 font-sans block text-sm">{team.name}</strong>
                        <span className="text-[11px] text-slate-500 font-sans">{team.leader}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-bold">
                    {formatNumber(team.leads)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {formatNumber(team.analyzedDocs)} <span className="text-slate-400">({formatPercent(team.conversionDocRate, 1)})</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-black text-sm">
                    {formatBRL(team.vgvNet)}
                  </td>
                  <td className="py-3.5 px-4 text-[#E60000] font-bold">
                    {formatBRL(team.vgvCanceled)} <span className="text-slate-500 font-normal">({formatPercent(team.cancellationRate, 1)})</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {((team.vgvNet / team.targetNet) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#E60000] hover:text-white text-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Ver Painel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Linha Consolidada Total */}
            <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-mono text-xs">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E60000]" />
                  <span>TOTAL CONSOLIDADO</span>
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">
                  {formatNumber(teams.all.leads)}
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">
                  {formatNumber(teams.all.analyzedDocs)}
                </td>
                <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                  {formatBRL(teams.all.vgvNet)}
                </td>
                <td className="py-3.5 px-4 font-black text-[#E60000]">
                  {formatBRL(teams.all.vgvCanceled)} ({formatPercent(teams.all.cancellationRate, 1)})
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">
                  {((teams.all.vgvNet / teams.all.targetNet) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                  {teams.all.contractsNet} contratos
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
