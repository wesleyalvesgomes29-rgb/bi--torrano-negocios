import React from 'react';
import { PeriodOverview, TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { Trophy, Users, FileText, CheckCircle2, AlertOctagon, ArrowUpRight } from 'lucide-react';

interface CleanRankingViewProps {
  overview: PeriodOverview;
  onSelectTeam: (teamId: 'bruno' | 'lorena' | 'lucas') => void;
}

export const CleanRankingView: React.FC<CleanRankingViewProps> = ({
  overview,
  onSelectTeam,
}) => {
  const { teams, label } = overview;
  const individualTeams: TeamData[] = [teams.bruno, teams.lorena, teams.lucas];

  // Sort teams by VGV Líquido descending
  const sortedTeams = [...individualTeams].sort((a, b) => b.vgvNet - a.vgvNet);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-amber-400/15 text-amber-300 border border-amber-400/40">
          🥇 1º Lugar
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-300/15 text-slate-200 border border-slate-400/40">
          🥈 2º Lugar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-amber-700/15 text-amber-600 border border-amber-700/40">
        🥉 3º Lugar
      </span>
    );
  };

  return (
    <section aria-label="Ranking Geral das Equipes" className="w-full space-y-6">
      
      {/* Header Info */}
      <div className="bg-[#0D1526] border border-[#1E2E4E] rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#E60000] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Reunião Geral de Alinhamento
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            Ranking Comparativo das Equipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comparativo oficial das 3 frentes de vendas com os 4 indicadores essenciais ({label})
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right font-mono">
            <span className="text-[11px] text-slate-400 block uppercase">Total VGV Líquido Retido</span>
            <span className="text-lg font-black text-emerald-400">{formatBRL(teams.all.vgvNet)}</span>
          </div>
        </div>
      </div>

      {/* Podium Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {sortedTeams.map((team, index) => {
          const isWinner = index === 0;
          return (
            <div
              key={team.id}
              onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
              className={`
                bg-[#0D1526] border rounded-2xl p-6 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden
                ${isWinner 
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400' 
                  : 'border-[#1E2E4E] hover:border-slate-600'
                }
              `}
            >
              {isWinner && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
              )}
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  {getRankBadge(index)}
                  <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-mono transition-colors">
                    Ver página exclusiva <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h3 className="text-lg font-black text-white font-display">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Líder: <strong className="text-slate-200">{team.leader}</strong>
                </p>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Vendas Líquidas:</span>
                    <strong className="text-emerald-400 font-mono font-black text-sm">
                      {formatBRL(team.vgvNet)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Destratos:</span>
                    <strong className="text-rose-400 font-mono font-bold">
                      {formatBRL(team.vgvCanceled)} ({formatPercent(team.cancellationRate, 1)})
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Conversão Docs:</span>
                    <strong className="text-indigo-400 font-mono">
                      {formatPercent(team.conversionDocRate, 1)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{team.contractsNet} contratos fechados</span>
                <span>Ticket {formatBRL(team.ticketAverage, true)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Comparativa Simples e Espaçada */}
      <div className="bg-[#0D1526] border border-[#1E2E4E] rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-6 border-b border-[#1E2E4E]">
          <h3 className="text-base font-black text-white font-display">
            Tabela Comparativa Direta das 3 Equipes
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visão lado a lado dos 4 indicadores básicos para a Reunião Geral de Coordenadores
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-[#1E2E4E]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Posição & Equipe</th>
                <th scope="col" className="px-6 py-4 font-bold">Total de Leads</th>
                <th scope="col" className="px-6 py-4 font-bold">Documentos Analisados</th>
                <th scope="col" className="px-6 py-4 font-bold text-emerald-400">Vendas Líquidas (R$)</th>
                <th scope="col" className="px-6 py-4 font-bold text-rose-400">Destratos (R$ & %)</th>
                <th scope="col" className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2E4E]/60">
              {sortedTeams.map((team, index) => (
                <tr 
                  key={team.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Equipe & Líder */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-slate-400">
                        {index + 1}º
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base">
                          {team.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {team.leader}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 1. Total Leads */}
                  <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{formatNumber(team.leads)}</span>
                    </div>
                  </td>

                  {/* 2. Documentos Analisados */}
                  <td className="px-6 py-4 font-mono">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-white font-bold">{formatNumber(team.analyzedDocs)}</span>
                      <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">
                        {formatPercent(team.conversionDocRate, 1)}
                      </span>
                    </div>
                  </td>

                  {/* 3. Vendas Líquidas */}
                  <td className="px-6 py-4 font-mono">
                    <div className="text-emerald-400 font-black text-base">
                      {formatBRL(team.vgvNet)}
                    </div>
                    <div className="text-xs text-emerald-400/80 font-normal">
                      {team.contractsNet} contratos
                    </div>
                  </td>

                  {/* 4. Destratos */}
                  <td className="px-6 py-4 font-mono">
                    <div className="text-rose-400 font-black text-base">
                      {formatBRL(team.vgvCanceled)}
                    </div>
                    <div className="text-xs text-rose-300 font-semibold">
                      {formatPercent(team.cancellationRate, 1)} cancelamento ({team.contractsCanceled} quebras)
                    </div>
                  </td>

                  {/* Botão Ação */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-[#E60000] text-slate-200 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Acessar Página
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Linha Consolidada Total Torrano */}
            <tfoot className="bg-slate-900/90 font-mono text-xs border-t-2 border-[#1E2E4E]">
              <tr>
                <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E60000]" />
                  <span>TOTAL CONSOLIDADO</span>
                </td>
                <td className="px-6 py-4 font-black text-white">
                  {formatNumber(teams.all.leads)}
                </td>
                <td className="px-6 py-4 font-black text-white">
                  {formatNumber(teams.all.analyzedDocs)} ({formatPercent(teams.all.conversionDocRate, 1)})
                </td>
                <td className="px-6 py-4 font-black text-emerald-400 text-base">
                  {formatBRL(teams.all.vgvNet)}
                </td>
                <td className="px-6 py-4 font-black text-rose-400 text-base">
                  {formatBRL(teams.all.vgvCanceled)} ({formatPercent(teams.all.cancellationRate, 1)})
                </td>
                <td className="px-6 py-4 text-right text-slate-400 font-bold">
                  {teams.all.contractsNet} contratos
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </section>
  );
};
