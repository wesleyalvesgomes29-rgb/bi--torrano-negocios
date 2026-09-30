import React, { useState } from 'react';
import { PeriodOverview, TeamFilterId } from '../../types';
import { requestExecutiveDiagnosis } from '../../services/geminiService';
import { getTacticalReview } from '../../utils/tacticalInsights';
import { formatBRL, formatPercent } from '../../utils/formatters';
import { 
  Sparkles, 
  X, 
  RotateCw, 
  Copy, 
  Check, 
  Key, 
  TrendingDown, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BrainCircuit
} from 'lucide-react';

interface CleanExecutiveAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: PeriodOverview;
  currentTeam: TeamFilterId;
  onSelectTeam: (teamId: TeamFilterId) => void;
  onOpenApiKeyModal: () => void;
}

export const CleanExecutiveAiModal: React.FC<CleanExecutiveAiModalProps> = ({
  isOpen,
  onClose,
  overview,
  currentTeam,
  onSelectTeam,
  onOpenApiKeyModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customAiText, setCustomAiText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { teams, label, period } = overview;
  const activeTeam = currentTeam === 'comparison' ? teams.all : teams[currentTeam as keyof typeof teams] || teams.all;
  const review = getTacticalReview(overview, currentTeam);

  const isDaily = period === 'day';
  const isWeekly = period === 'week';

  const handleGenerateGemini = async () => {
    setIsLoading(true);
    try {
      const res = await requestExecutiveDiagnosis(overview, undefined, currentTeam);
      if (res.success && res.content) {
        setCustomAiText(res.content);
      } else {
        onOpenApiKeyModal();
      }
    } catch {
      onOpenApiKeyModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `PARECER ESTRATÉGICO IA · DIRETORIA FLÁVIO TORRANO
Equipe: ${activeTeam.name} | Período: ${label}
Líder: ${activeTeam.leader}

(1) DESEMPENHO DO PERÍODO:
${review.topic1Performance}

(2) GARGALO & ESTANQUEIDADE:
${review.topic2Bottleneck}

(3) 3 DIRETRIZES IMEDIATAS:
${review.topic3NextStep}
`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Clean White Modal with Red Torrano Top Accent */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-t-4 border-[#E60000] border-x border-b border-slate-200 text-slate-800 z-10 overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60000] text-white flex items-center justify-center shadow-md shadow-red-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 font-display">
                  PARECER IA ESTRATÉGICO
                </h3>
                <span className="text-[10px] font-mono font-bold bg-rose-50 text-[#E60000] border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {label}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pauta tática executiva para reunião com {activeTeam.leader}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Copiar Parecer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Selector Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {[
              { id: 'all' as TeamFilterId, label: 'Diretoria' },
              { id: 'bruno' as TeamFilterId, label: 'Bruno' },
              { id: 'lorena' as TeamFilterId, label: 'Lorena' },
              { id: 'lucas' as TeamFilterId, label: 'Lucas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTeam(tab.id);
                  setCustomAiText(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentTeam === tab.id
                    ? 'bg-[#E60000] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500 font-bold">
            VGV Líquido: <strong className="text-emerald-700">{formatBRL(activeTeam.vgvNet, true)}</strong>
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {customAiText ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs leading-relaxed font-sans text-slate-700 whitespace-pre-line space-y-2">
              <div className="flex items-center justify-between text-blue-700 font-mono font-bold border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  Diagnóstico Aprofundado Gemini
                </span>
                <button
                  onClick={() => setCustomAiText(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Voltar ao padrão
                </button>
              </div>
              <div>{customAiText}</div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* 1. Desempenho Geral */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-600 font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Target className="w-4 h-4" />
                  1. Desempenho do Período ({label})
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {review.topic1Performance}
                </p>
              </div>

              {/* 2. Gargalo & Estanqueidade de Destratos */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#E60000] font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                  <TrendingDown className="w-4 h-4" />
                  2. Gargalo Operacional & Estanqueidade de Destratos
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {review.topic2Bottleneck}
                </p>
                <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] font-mono text-rose-800">
                  <span>Cancelamentos: {formatBRL(activeTeam.vgvCanceled)}</span>
                  <span className="font-bold">{formatPercent(activeTeam.cancellationRate, 1)} de quebra</span>
                </div>
              </div>

              {/* 3. Diretrizes Imediatas */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  3. Próximo Passo Prático para Flávio Torrano
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {review.topic3NextStep}
                </p>
              </div>

            </div>
          )}

          {/* Gemini AI Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-sans">
              Deseja uma auditoria personalizada em tempo real?
            </span>
            <button
              onClick={handleGenerateGemini}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#E60000] hover:bg-[#cc0000] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Consultando Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar via Gemini IA</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Torrano Negócios Imobiliários</span>
          <button
            onClick={onOpenApiKeyModal}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-bold"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Configurar Chave IA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
