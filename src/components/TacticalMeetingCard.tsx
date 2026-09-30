import React, { useState } from 'react';
import { PeriodOverview, TeamFilterId } from '../types';
import { getTacticalReview } from '../utils/tacticalInsights';
import { requestExecutiveDiagnosis } from '../services/geminiService';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckSquare2, 
  Sparkles, 
  RotateCw, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface TacticalMeetingCardProps {
  overview: PeriodOverview;
  teamFilter: TeamFilterId;
  onOpenApiKeyModal: () => void;
}

export const TacticalMeetingCard: React.FC<TacticalMeetingCardProps> = ({
  overview,
  teamFilter,
  onOpenApiKeyModal,
}) => {
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const review = getTacticalReview(overview, teamFilter);

  const handleGenerateAi = async () => {
    setIsLoadingAi(true);
    try {
      const result = await requestExecutiveDiagnosis(overview, undefined, teamFilter);
      if (result.success && result.content) {
        setAiNote(result.content);
      } else if (result.error) {
        // If API key is missing or errored, offer key modal
        onOpenApiKeyModal();
      }
    } catch (e) {
      onOpenApiKeyModal();
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <section aria-label="Parecer Tático da Reunião" className="w-full">
      <div className="bg-[#0D1526] border border-[#1E2E4E] rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20">
        
        {/* Header of Block 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1E2E4E] gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60000]/15 border border-[#E60000]/40 flex items-center justify-center text-[#E60000] shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white font-display tracking-tight">
                  Parecer Tático da Reunião · Diretoria Flávio Torrano
                </h3>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  review.statusBadge.variant === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : review.statusBadge.variant === 'danger'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {review.statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Pauta mandatória com:</span>
                <strong className="text-white flex items-center gap-1 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  {review.leaderName}
                </strong>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{review.roleTitle}</span>
              </p>
            </div>
          </div>

          {/* Quick AI Trigger */}
          <button
            onClick={handleGenerateAi}
            disabled={isLoadingAi}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center shrink-0"
            title="Atualizar via Gemini IA"
          >
            {isLoadingAi ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Processando IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Atualizar Parecer IA</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Direct Topics for the meeting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-6">
          
          {/* TÓPICO 1: DESEMPENHO GERAL */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  1. Desempenho Geral
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                Resultado do Período
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {review.topic1Performance}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Foco: Volume e cumprimento de meta
            </div>
          </div>

          {/* TÓPICO 2: PRINCIPAL GARGALO */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  2. Principal Gargalo
                </span>
              </div>
              <h4 className="text-sm font-bold text-rose-200 mb-2">
                Detecção de Travamento ou Destrato
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {review.topic2Bottleneck}
              </p>
            </div>
            <div className="pt-3 border-t border-rose-900/30 text-[11px] text-rose-400/70 font-mono">
              Ponto crítico de vazamento financeiro
            </div>
          </div>

          {/* TÓPICO 3: PRÓXIMO PASSO PRÁTICO */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckSquare2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  3. Próximo Passo Obrigatório
                </span>
              </div>
              <h4 className="text-sm font-bold text-emerald-200 mb-2">
                Ação Mandatória do Coordenador
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {review.topic3NextStep}
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-900/30 text-[11px] text-emerald-400/80 font-mono">
              Execução imediata para esta semana
            </div>
          </div>

        </div>

        {/* AI Extra Notes (if generated via Gemini) */}
        {aiNote && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Parecer Aprofundado Gemini AI
              </span>
              <button
                onClick={() => setAiNote(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="whitespace-pre-line text-xs font-sans leading-relaxed text-slate-200">
              {aiNote}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
