import React from 'react';
import { PeriodOverview, TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { 
  Trophy, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowUpRight, 
  Sparkles,
  TrendingUp,
  Percent,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface ExecutiveRankingViewProps {
  overview: PeriodOverview;
  onSelectTeam: (teamId: 'bruno' | 'lorena' | 'lucas') => void;
  onOpenAiDrawer: () => void;
}

export const ExecutiveRankingView: React.FC<ExecutiveRankingViewProps> = ({
  overview,
  onSelectTeam,
  onOpenAiDrawer,
}) => {
  const { teams, label } = overview;
  const individualTeams: TeamData[] = [teams.bruno, teams.lorena, teams.lucas];

  // Sort teams by VGV Líquido descending
  const sortedTeams = [...individualTeams].sort((a, b) => b.vgvNet - a.vgvNet);
  const totalNet = teams.all.vgvNet || 1;

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          🥇 1º LUGAR · DESTAQUE
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono bg-slate-300/15 text-slate-200 border border-slate-400/40">
          🥈 2º LUGAR
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono bg-amber-700/20 text-amber-500 border border-amber-700/50">
        🥉 3º LUGAR
      </span>
    );
  };

  return (
    <section aria-label="War Room e Ranking Geral" className="w-full space-y-7 animate-fadeIn">
      
      {/* High-Fidelity Header Banner */}
      <div className="bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E60000] via-[#00D2FF] to-[#10B981]" />

        <div>
          <div className="flex items-center gap-2 text-[#E60000] font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>WAR ROOM EXECUTIVO • REUNIÃO GERAL</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{label}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Matriz Comparativa das Equipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Visão unificada das 3 frentes de vendas da Torrano Negócios Imobiliários com os 4 indicadores essenciais e share de receita retida.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl font-mono text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              VGV Líquido Torrano
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#10B981] drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              {formatBRL(teams.all.vgvNet)}
            </span>
          </div>

          <button
            onClick={onOpenAiDrawer}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#E60000] to-rose-700 hover:brightness-110 text-white text-xs font-mono font-bold shadow-[0_0_20px_rgba(230,0,0,0.4)] flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Parecer Geral IA</span>
          </button>
        </div>
      </div>

      {/* Podium Cards Preview with Share Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sortedTeams.map((team, index) => {
          const isWinner = index === 0;
          const share = (team.vgvNet / totalNet) * 100;
          const isCriticalDestrato = team.cancellationRate > 12.0;

          return (
            <div
              key={team.id}
              onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
              className={`
                bg-[#111827]/70 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden
                ${isWinner 
                  ? 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-400' 
                  : 'border-slate-800/80 hover:border-slate-600 shadow-[0_8px_25px_rgb(0,0,0,0.25)]'
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
                    Ver página <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h3 className="text-xl font-black text-white font-display">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Líder: <strong className="text-slate-200">{team.leader}</strong>
                </p>

                {/* Share of Total VGV */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Share no VGV Torrano:</span>
                    <strong className="text-cyan-400">{share.toFixed(1)}%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${isWinner ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="mt-5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vendas Líquidas:</span>
                    <strong className="text-[#10B981] font-black text-sm">
                      {formatBRL(team.vgvNet)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Destratos:</span>
                    <strong className={`font-bold ${isCriticalDestrato ? 'text-[#E60000]' : 'text-rose-400'}`}>
                      {formatBRL(team.vgvCanceled)} ({formatPercent(team.cancellationRate, 1)})
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pastas Analisadas:</span>
                    <strong className="text-white">
                      {formatNumber(team.analyzedDocs)} ({formatPercent(team.conversionDocRate, 1)})
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{team.contractsNet} contratos retidos</span>
                <span className="text-slate-400">Ticket {formatBRL(team.ticketAverage, true)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Comparativa Simples e Espaçada */}
      <div className="bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-black text-white font-display">
              Tabela Comparativa Direta das 3 Equipes
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Indicadores essenciais lado a lado para reunião com Flávio Torrano
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Meta Corporativa: <strong className="text-[#10B981]">{formatBRL(teams.all.targetNet)}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Posição & Equipe</th>
                <th scope="col" className="px-6 py-4 font-bold">Total de Leads</th>
                <th scope="col" className="px-6 py-4 font-bold">Documentos Analisados</th>
                <th scope="col" className="px-6 py-4 font-bold text-[#10B981]">Vendas Líquidas (R$)</th>
                <th scope="col" className="px-6 py-4 font-bold text-[#E60000]">Destratos (R$ & %)</th>
                <th scope="col" className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedTeams.map((team, index) => (
                <tr 
                  key={team.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Equipe & Líder */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xs text-slate-400 w-5">
                        {index + 1}º
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base font-sans">
                          {team.name}
                        </div>
                        <div className="text-xs text-slate-400 font-sans">
                          {team.leader}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 1. Total Leads */}
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                      <span>{formatNumber(team.leads)}</span>
                    </div>
                  </td>

                  {/* 2. Documentos Analisados */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="text-white font-bold">{formatNumber(team.analyzedDocs)}</span>
                      <span className="text-xs text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                        {formatPercent(team.conversionDocRate, 1)}
                      </span>
                    </div>
                  </td>

                  {/* 3. Vendas Líquidas */}
                  <td className="px-6 py-4">
                    <div className="text-[#10B981] font-black text-base">
                      {formatBRL(team.vgvNet)}
                    </div>
                    <div className="text-xs text-emerald-400/80 font-normal">
                      {team.contractsNet} contratos retidos
                    </div>
                  </td>

                  {/* 4. Destratos */}
                  <td className="px-6 py-4">
                    <div className="text-[#E60000] font-black text-base">
                      {formatBRL(team.vgvCanceled)}
                    </div>
                    <div className="text-xs text-rose-300">
                      {formatPercent(team.cancellationRate, 1)} quebra ({team.contractsCanceled} rescisões)
                    </div>
                  </td>

                  {/* Botão Ação */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onSelectTeam(team.id as 'bruno' | 'lorena' | 'lucas')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-[#E60000] text-slate-200 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Página Exclusiva
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Linha Consolidada Total Torrano */}
            <tfoot className="bg-slate-900/90 font-mono text-xs border-t-2 border-slate-800">
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
                <td className="px-6 py-4 font-black text-[#10B981] text-base">
                  {formatBRL(teams.all.vgvNet)}
                </td>
                <td className="px-6 py-4 font-black text-[#E60000] text-base">
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
