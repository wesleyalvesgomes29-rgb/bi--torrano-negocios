import React from 'react';
import { PeriodOverview, TeamData } from '../types';
import { 
  formatBRL, 
  formatNumber, 
  formatPercent 
} from '../utils/formatters';
import { 
  GitCompare, 
  Trophy, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  User, 
  ArrowUpRight 
} from 'lucide-react';

interface TeamComparisonProps {
  overview: PeriodOverview;
}

export const TeamComparison: React.FC<TeamComparisonProps> = ({ overview }) => {
  const { teams } = overview;
  const bruno = teams.bruno;
  const lorena = teams.lorena;
  const lucas = teams.lucas;

  const cards = [
    {
      team: bruno,
      badge: 'Equilíbrio & Consistência',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      accentColor: 'border-t-blue-500',
      highlights: [
        'Excelente conversão documental (35.0%)',
        'Taxa de destrato equilibrada (10.0%)',
        'Carteira sólida em bairros nobres residenciais',
      ],
      bottlenecks: [
        'Necessidade de aceleração no volume de captação',
        'Dependência de lançamentos de 3 a 4 dormitórios',
      ],
      action: 'Intensificar parcerias com imobiliárias parceiras para ampliar captação de leads orgânicos.',
    },
    {
      team: lorena,
      badge: 'Alto Volume & Alerta de Quebra',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      accentColor: 'border-t-amber-500',
      highlights: [
        'Maior captação da empresa (620 leads)',
        'Maior quantidade de contratos brutos assinados (31)',
        'Forte presença no mercado de investidores e planta',
      ],
      bottlenecks: [
        'Maior taxa de destrato da empresa (16.0%)',
        'Conversão de leads para pastas abaixo da média (28.1%)',
        'Reprovações em conformidade de crédito bancário',
      ],
      action: 'Instalar comitê de crédito prévio e reduzir tempo de resposta do primeiro contato para 15 minutos.',
    },
    {
      team: lucas,
      badge: 'Líder em VGV Líquido & Eficiência',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      accentColor: 'border-t-emerald-500',
      highlights: [
        'Menor taxa de destrato da empresa (8.0%)',
        'Maior ticket médio (R$ 1.150.000)',
        'Maior taxa de conversão em pastas (43.9%)',
        'Responsável por 43.2% de todo o VGV líquido corporativo',
      ],
      bottlenecks: [
        'Menor volume bruto de leads no topo de funil (310)',
        'Ciclo de fechamento mais longo (média 42 dias)',
      ],
      action: 'Manter rigor documental e expandir o portfólio para imóveis comerciais de renda corporativa.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              <span>Comparativo Lado a Lado: Bruno vs. Lorena vs. Lucas</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise comparativa direta de produtividade, índice de quebra e rentabilidade líquida por equipe
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Equipe Destaque do Período:</span>
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Equipe Lucas (+10,6% sobre a meta)
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {cards.map(({ team, badge, badgeColor, accentColor, highlights, bottlenecks, action }) => {
          const targetAchieved = (team.vgvNet / team.targetNet) * 100;

          return (
            <div
              key={team.id}
              className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 border-t-4 ${accentColor} flex flex-col justify-between hover:border-slate-700 transition-colors`}
            >
              <div>
                {/* Team Info Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>Líder: <strong className="text-slate-200">{team.leader}</strong></span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
                    {badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 italic">
                  "{team.leadDescription}"
                </p>

                {/* Primary Financial Metric Box */}
                <div className="mt-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">VGV Líquido Realizado</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                    {formatBRL(team.vgvNet, true)}
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Meta: {formatBRL(team.targetNet, true)}</span>
                    <span className={`font-mono font-semibold ${targetAchieved >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {targetAchieved.toFixed(1)}% atingido
                    </span>
                  </div>
                </div>

                {/* Direct Metrics Matrix */}
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Leads Recebidos:</span>
                    <span className="text-white font-bold">{formatNumber(team.leads)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Pastas Analisadas:</span>
                    <span className="text-white font-bold">{formatNumber(team.analyzedDocs)} ({formatPercent(team.conversionDocRate, 1)})</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">VGV Bruto ({team.contractsGross} cont.):</span>
                    <span className="text-indigo-300 font-bold">{formatBRL(team.vgvGross, true)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Destratos ({team.contractsCanceled} quebras):</span>
                    <span className="text-rose-400 font-bold">{formatBRL(team.vgvCanceled, true)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Taxa de Destrato:</span>
                    <span className={`font-bold ${team.cancellationRate > 12 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {formatPercent(team.cancellationRate, 1)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Ticket Médio:</span>
                    <span className="text-slate-200 font-bold">{formatBRL(team.ticketAverage, true)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 font-sans">Taxa de Retenção Líquida:</span>
                    <span className="text-emerald-400 font-bold">{formatPercent(team.netRetentionRate, 1)}</span>
                  </div>
                </div>

                {/* Strengths & Bottlenecks */}
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Pontos Fortes
                    </span>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px]">
                      {highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Pontos de Atenção / Gargalos
                    </span>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px]">
                      {bottlenecks.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-800 text-xs">
                <span className="font-semibold text-amber-400 block mb-1">
                  Diretriz Imediata (Flávio Torrano):
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
