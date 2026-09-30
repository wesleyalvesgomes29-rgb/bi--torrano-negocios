import React, { useState } from 'react';
import { PeriodOverview, TeamFilterId } from '../types';
import { requestExecutiveDiagnosis } from '../services/geminiService';
import { getTacticalReview } from '../utils/tacticalInsights';
import { formatBRL, formatPercent } from '../utils/formatters';
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
  BrainCircuit,
  Calendar
} from 'lucide-react';

interface TorranoAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  overview: PeriodOverview;
  currentTeam: TeamFilterId;
  onSelectTeam: (teamId: TeamFilterId) => void;
  onOpenApiKeyModal: () => void;
}

export const TorranoAiDrawer: React.FC<TorranoAiDrawerProps> = ({
  isOpen,
  onClose,
  overview,
  currentTeam,
  onSelectTeam,
  onOpenApiKeyModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customAiText, setCustomAiText] = useState<string | null>(null);
  const [modelBadge, setModelBadge] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { teams, label, period } = overview;
  const activeTeam = currentTeam === 'comparison' ? teams.all : teams[currentTeam as keyof typeof teams] || teams.all;
  const review = getTacticalReview(overview, currentTeam);

  const isDaily = period === 'day';
  const isWeekly = period === 'week';
  const isQuarterly = period === 'quarter';
  const isYearly = period === 'year';

  // 1. Diagnóstico de estanqueidade financeira (sensível ao período)
  const estanqueidade = isDaily
    ? activeTeam.vgvCanceled > 0
      ? `No dia de hoje (${label}), foi registrado ${formatBRL(activeTeam.vgvCanceled)} em destratos na equipe. Urgência em contatar o proponente para reverter a desistência antes do cancelamento formal no sistema.`
      : `No dia de hoje (${label}), não há registro de destratos ou quebras contratuais. O caixa do dia está 100% preservado com faturamento retido de ${formatBRL(activeTeam.vgvNet)}.`
    : isWeekly
    ? `Na semana corrente (${label}), os destratos somam ${formatBRL(activeTeam.vgvCanceled)} (${formatPercent(activeTeam.cancellationRate, 1)} de quebra semanal em ${activeTeam.contractsCanceled} rescisão). É mandatório estancar qualquer nova desistência antes do fechamento de sexta-feira.`
    : isQuarterly || isYearly
    ? `Análise macro (${label}): O montante acumulado de cancelamentos atingiu ${formatBRL(activeTeam.vgvCanceled)} (${formatPercent(activeTeam.cancellationRate, 1)} de perda histórica). Essa sangria financeira representa perda de liquidez direta para o caixa de investimentos da Torrano.`
    : review.topic2Bottleneck;

  // 2. Gargalo de funil comercial (sensível ao período)
  const gargaloFunil = isDaily
    ? `Tração de hoje: Foram captados ${activeTeam.leads} leads e montadas ${activeTeam.analyzedDocs} pastas. O gargalo imediato é o SLA de primeiro atendimento: leads não contatados em até 30 minutos perdem 60% de probabilidade de conversão no plantão.`
    : isWeekly
    ? `Ritmo da semana: ${activeTeam.leads} leads movimentados e ${activeTeam.analyzedDocs} pastas em esteira. O gargalo da semana reside no tempo de resposta dos correspondentes bancários para emitir o laudo de crédito antes do sábado.`
    : isQuarterly || isYearly
    ? `Estrutura de funil de longo prazo (${label}): A esteira processou ${activeTeam.leads} leads e gerou ${activeTeam.contractsNet} contratos líquidos. O desafio de escala corporativa é elevar a taxa de conversão documental de ${formatPercent(activeTeam.conversionDocRate, 1)} com produtos exclusivos de alta liquidez.`
    : review.topic2Bottleneck;

  // 3. Diretrizes práticas e imediatas para reunião semanal
  const diretrizes = isDaily
    ? [
        `1. Cobrança de SLA Imediato: Garantir que 100% dos ${activeTeam.leads} leads captados hoje recebam contato ativo e qualificação por WhatsApp ou ligação até as 19h.`,
        `2. Destravamento de Pastas do Dia: Acompanhar o envio dos documentos das ${activeTeam.analyzedDocs} pastas montadas hoje para os correspondentes credenciados.`,
        `3. Assinatura de Contratos: Assegurar a assinatura digital dos contratos pendentes para liquidar o VGV do dia de ${formatBRL(activeTeam.vgvNet)}.`
      ]
    : isWeekly
    ? [
        `1. Sprint de Fechamento até Sexta: Focar os corretores nas propostas mais quentes para garantir o cumprimento da meta semanal de ${formatBRL(activeTeam.targetNet)}.`,
        `2. Auditoria de Contratos em Risco: Contatar proativamente os clientes com pendência de sinal para evitar cancelamento antes do fim de semana.`,
        `3. Preparação do Plantão de Sábado: Agendar visitas prévias com os leads da semana para maximizar a presença física nos empreendimentos.`
      ]
    : isQuarterly || isYearly
    ? [
        `1. Governança e Blindagem de Caixa: Instituir teto corporativo máximo de 10% de destrato para todas as negociações do próximo ciclo orçamentário.`,
        `2. Expansão de Carteira Exclusiva: Focar a captação em imóveis e lançamentos com alta aderência bancária e menor taxa de desistência.`,
        `3. Metodologia de Qualificação Unificada: Disseminar o padrão de análise prévia de crédito de Lucas para as demais lideranças como política institucional da Torrano.`
      ]
    : [
        review.topic3NextStep,
        `Auditoria prévia de capacidade de entrada e sinal antes da emissão da minuta formal.`,
        `SLA semanal de 72 horas com os correspondentes bancários para acelerar a conversão de pastas em contratos.`
      ];

  const handleGenerateGemini = async () => {
    setIsLoading(true);
    try {
      const res = await requestExecutiveDiagnosis(overview, undefined, currentTeam);
      if (res.success && res.content) {
        setCustomAiText(res.content);
        setModelBadge(res.modelUsed || 'Gemini 2.5 Flash');
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
    const fullText = `PARECER TÁTICO DA REUNIÃO EXECUTIVA • FLÁVIO TORRANO
Equipe: ${activeTeam.name} | Período: ${label} (${period.toUpperCase()})
Líder: ${activeTeam.leader}

(1) DIAGNÓSTICO DE ESTANQUEIDADE:
${estanqueidade}

(2) GARGALO DE FUNIL:
${gargaloFunil}

(3) 3 DIRETRIZES IMEDIATAS:
${diretrizes.join('\n')}
`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-[#090E17]/95 backdrop-blur-2xl border-l border-slate-800 text-white shadow-2xl h-full flex flex-col z-10 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="sticky top-0 bg-[#090E17]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E60000] to-rose-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(230,0,0,0.5)] border border-rose-500/40">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-display">
                  PARECER IA ESTRATÉGICO
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#E60000]/20 text-[#E60000] border border-[#E60000]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {label}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pauta tática adaptada ao período para {activeTeam.leader}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copiar Pauta Executiva"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Selector Navigation Pills Inside Drawer */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all' as TeamFilterId, label: 'Consolidado' },
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
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  currentTeam === tab.id
                    ? 'bg-[#E60000] text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded shrink-0">
            {isDaily ? 'Ações Imediatas de Hoje' : isWeekly ? 'Sprint Semanal' : isQuarterly ? 'Visão Trimestral' : isYearly ? 'Visão Anual YTD' : 'Fechamento Mensal'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Executive Overview Badge */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Liderança / Período</span>
              <strong className="text-white text-sm">{activeTeam.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">VGV Líquido</span>
              <strong className="text-[#10B981] text-sm">{formatBRL(activeTeam.vgvNet)}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Destratos</span>
              <strong className="text-[#E60000] text-sm">{formatBRL(activeTeam.vgvCanceled)}</strong>
            </div>
          </div>

          {/* Custom AI generated text if available */}
          {customAiText ? (
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold pb-2 border-b border-cyan-500/20">
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  Diagnóstico Estratégico {modelBadge || 'Gemini Flash'} ({label})
                </span>
                <button
                  onClick={() => setCustomAiText(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Ver modo padrão
                </button>
              </div>
              <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {customAiText}
              </div>
            </div>
          ) : (
            /* 3 Pillars requested by the user */
            <div className="space-y-5">
              
              {/* 1. Diagnóstico de Estanqueidade */}
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#E60000] mb-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4" />
                  1. Diagnóstico de Estanqueidade Financeira
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Retenção e monitoramento de quebras ({label}):
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {estanqueidade}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Quebras no período: {activeTeam.contractsCanceled} contratos</span>
                  <span className="text-rose-400 font-bold">{formatPercent(activeTeam.cancellationRate, 1)} de cancelamento</span>
                </div>
              </div>

              {/* 2. Gargalo de Funil */}
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-[#00D2FF] mb-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  2. Gargalo de Funil Comercial
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Velocidade e conversão documental ({label}):
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {gargaloFunil}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Taxa documental: {formatPercent(activeTeam.conversionDocRate, 1)}</span>
                  <span className="text-emerald-400 font-bold">Conversão vendas: {formatPercent(activeTeam.conversionSalesRate, 1)}</span>
                </div>
              </div>

              {/* 3. Três Diretrizes Imediatas */}
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-[#10B981] mb-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  3. Diretrizes Táticas para Alinhamento com Flávio Torrano
                </div>
                <h3 className="text-sm font-bold text-white mb-3">
                  {isDaily ? 'Ações imediatas para o dia de hoje:' : isWeekly ? 'Ações para a semana corrente:' : isQuarterly || isYearly ? 'Diretrizes de médio e longo prazo:' : 'Diretrizes prioritárias do mês:'}
                </h3>
                <div className="space-y-2.5">
                  {diretrizes.map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* AI Trigger with Gemini */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">
              Gerar diagnóstico profundo para {label} via Gemini AI?
            </div>
            <button
              onClick={handleGenerateGemini}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E60000] via-rose-600 to-[#E60000] text-white text-xs font-mono font-bold shadow-[0_0_20px_rgba(230,0,0,0.4)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Consultando Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Atualizar via Gemini IA</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="sticky bottom-0 bg-[#090E17] border-t border-slate-800 px-6 py-4 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Torrano BI · {label}</span>
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Configurar Chave IA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
