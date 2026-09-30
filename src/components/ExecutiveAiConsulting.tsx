import React, { useState, useEffect, useRef } from 'react';
import { PeriodOverview } from '../types';
import { 
  requestExecutiveDiagnosis, 
  getStoredApiKey, 
  generateOfflineDiagnosis,
  AiDiagnosisResult 
} from '../services/geminiService';
import { 
  Sparkles, 
  Bot, 
  Key, 
  RotateCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Printer, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { TeamFilterId } from '../types';

interface ExecutiveAiConsultingProps {
  overview: PeriodOverview;
  currentTeam: TeamFilterId;
  onOpenApiKeyModal: () => void;
}

export const ExecutiveAiConsulting: React.FC<ExecutiveAiConsultingProps> = ({
  overview,
  currentTeam,
  onOpenApiKeyModal,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [diagnosisText, setDiagnosisText] = useState<string | null>(null);
  const [modelBadge, setModelBadge] = useState<string>('');
  const [generatedTime, setGeneratedTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check stored API key on mount and when modal closes
  useEffect(() => {
    const key = getStoredApiKey();
    setApiKey(key);
  }, []);

  // Sync state if sessionStorage changes
  const refreshKey = () => {
    setApiKey(getStoredApiKey());
  };

  // Loading steps animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Typing effect animation when new diagnosisText arrives
  useEffect(() => {
    if (!diagnosisText) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    setIsTyping(true);
    let currentIndex = 0;
    const fullText = diagnosisText;
    const stepSize = Math.max(2, Math.floor(fullText.length / 100)); // smooth typing speed

    typingTimerRef.current = setInterval(() => {
      currentIndex += stepSize;
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      } else {
        setDisplayedText(fullText.substring(0, currentIndex));
      }
    }, 15);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [diagnosisText]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (diagnosisText) {
      setDisplayedText(diagnosisText);
      setIsTyping(false);
    }
  };

  // Reset and load isolated diagnosis when active tab changes
  useEffect(() => {
    const text = generateOfflineDiagnosis(overview, currentTeam);
    setDiagnosisText(text);
    setModelBadge('Parecer Tático Blindado (IA Torrano)');
    setGeneratedTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  }, [currentTeam, overview]);

  // Main generator trigger
  const handleGenerateDiagnosis = async (forceDemo: boolean = false) => {
    const currentKey = getStoredApiKey();
    setApiKey(currentKey);

    setErrorMessage(null);
    setLoading(true);

    if (forceDemo || !currentKey) {
      // If user specifically requested demo or doesn't have an API key yet
      setTimeout(() => {
        const text = generateOfflineDiagnosis(overview, currentTeam);
        setDiagnosisText(text);
        setModelBadge(forceDemo ? 'Demonstração Executiva (Motor Heurístico Torrano)' : 'Diagnóstico Isolado (Sem Chave)');
        setGeneratedTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setLoading(false);
        setIsExpanded(true);
      }, 800);
      return;
    }

    try {
      const res: AiDiagnosisResult = await requestExecutiveDiagnosis(overview, currentKey, currentTeam);

      if (res.success && res.content) {
        setDiagnosisText(res.content);
        setModelBadge(res.modelUsed ? `Google ${res.modelUsed}` : 'Google Gemini 2.0 Flash');
        setGeneratedTime(res.generatedAt || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setIsExpanded(true);
      } else {
        setErrorMessage(res.error || 'Não foi possível gerar o parecer. Verifique sua chave.');
        // Still provide structured diagnosis option so user is never blocked
        const fallbackText = generateOfflineDiagnosis(overview);
        setDiagnosisText(fallbackText);
        setModelBadge('Diagnóstico Estruturado de Contingência');
        setGeneratedTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro inesperado na chamada ao Gemini.');
      const fallbackText = generateOfflineDiagnosis(overview);
      setDiagnosisText(fallbackText);
      setModelBadge('Diagnóstico Estruturado de Contingência');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = diagnosisText || '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Torrano Negócios - Parecer Executivo IA</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 40px; color: #1e293b; }
            h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
            h3 { color: #0369a1; margin-top: 24px; }
            hr { border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0; }
            .header-info { color: #64748b; font-size: 14px; margin-bottom: 30px; }
            .meta { background: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; font-size: 13px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>TORRANO NEGÓCIOS — PARECER EXECUTIVO DA DIRETORIA</h1>
          <div class="header-info">Destinatário: <strong>Flávio Torrano</strong> | Emissão: ${generatedTime || new Date().toLocaleString('pt-BR')}</div>
          <div class="meta">Período de Análise: <strong>${overview.label} (${overview.period})</strong> | VGV Líquido Corporativo: <strong>${formatBRL(overview.teams.all.vgvNet)}</strong></div>
          <div>${(diagnosisText || '').replace(/\n/g, '<br/>')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const stepLabels = [
    `Compilando métricas das equipes Bruno (${formatBRL(overview.teams.bruno.vgvNet)}), Lorena (${formatBRL(overview.teams.lorena.vgvNet)}) e Lucas (${formatBRL(overview.teams.lucas.vgvNet)})...`,
    `Calculando gargalos no funil de pastas (${overview.teams.all.analyzedDocs} analisadas) e taxa de destrato (${formatPercent(overview.teams.all.cancellationRate, 1)})...`,
    `Executando chamada na Google Generative AI (Gemini Flash) com System Prompt de Diretor Comercial...`,
    `Compilando métricas isoladas para ${currentTeam === 'all' ? 'a Diretoria Geral' : (currentTeam === 'comparison' ? 'o War Room' : overview.teams[currentTeam]?.name || 'a Equipe')}...`,
    `Avaliando funil de pastas e estanqueidade de destratos...`,
    `Executando análise estratégica com Google Gemini...`,
    `Estruturando 3 ações táticas para alinhamento executivo...`,
  ];

  const getTeamAiHeader = () => {
    switch (currentTeam) {
      case 'bruno':
        return {
          badge: 'Auditoria Individual • Equipe Bruno',
          title: 'Parecer Tático Individual • Equipe Bruno',
          subtitle: 'Diretrizes exclusivas para a liderança de Bruno Torrano (Médio/Alto Padrão), analisando gargalos nas pastas e plano para redução de destratos.',
        };
      case 'lorena':
        return {
          badge: 'Auditoria Individual • Equipe Lorena',
          title: 'Parecer Tático Individual • Equipe Lorena',
          subtitle: 'Diretrizes exclusivas para a liderança de Lorena Vasconcelos (Lançamentos), analisando velocidade de aprovação em stand e controle de quebras.',
        };
      case 'lucas':
        return {
          badge: 'Auditoria Individual • Equipe Lucas',
          title: 'Parecer Tático Individual • Equipe Lucas',
          subtitle: 'Diretrizes exclusivas para a liderança de Lucas Siqueira (Prime & Mansões), analisando taxa de retenção de 98% e expansão de carteira off-market.',
        };
      case 'comparison':
        return {
          badge: 'War Room • Comparativo Geral de Equipes',
          title: 'Parecer de War Room • Pauta de Alinhamento Conjunto',
          subtitle: 'Benchmarking direto entre Bruno, Lorena e Lucas. Ranking de conversão e metas conjuntas para estancar destratos corporativos.',
        };
      case 'all':
      default:
        return {
          badge: 'Diretoria Geral • Visão Consolidada',
          title: 'Parecer Estratégico Corporativo • Flávio Torrano',
          subtitle: 'Auditoria macro de receita retida em caixa, esteira de crédito corporativa e governança para a Diretoria Geral.',
        };
    }
  };

  const aiHeader = getTeamAiHeader();

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-[#E60000]/60 hover:border-[#E60000] shadow-2xl relative overflow-hidden transition-all">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-[#E60000]/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00D2FF]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner & Control Area */}
      <div className="p-5 sm:p-6 border-b border-[#1E2E4E] flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E60000] to-[#B80000] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(230,0,0,0.4)] border border-[#E60000]/60 shrink-0">
            ✨
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E60000]/20 text-white border border-[#E60000]/40 flex items-center gap-1.5 shadow-sm font-mono">
                <Bot className="w-3.5 h-3.5 text-[#00D2FF]" />
                {aiHeader.badge}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-[#1E2E4E]">
                Gemini 2.0 / 1.5 Flash
              </span>
              {apiKey ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  API Key Conectada
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Modo Autônomo
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2 font-display">
              <span>{aiHeader.title}</span>
            </h2>
            <p className="text-xs text-[#94A3B8] max-w-2xl mt-0.5 leading-relaxed">
              {aiHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Key configuration modal trigger */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-[#1E2E4E] transition-all shadow-sm cursor-pointer"
            title="Inserir ou gerenciar Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>{apiKey ? 'Gerenciar Chave' : 'Configurar Chave'}</span>
          </button>

          {/* Primary Highlighted Button: Gerar Diagnóstico com IA */}
          <button
            type="button"
            onClick={() => handleGenerateDiagnosis(false)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#E60000] hover:bg-[#CC0000] border border-[#E60000]/60 shadow-[0_0_20px_rgba(230,0,0,0.35)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-white" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white stroke-[2.5] group-hover:rotate-12 transition-transform" />
                <span>✨ Processar Diagnóstico IA</span>
              </>
            )}
          </button>

          {/* Toggle expand/collapse if diagnosis exists */}
          {diagnosisText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
              title={isExpanded ? 'Recolher parecer' : 'Expandir parecer'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-amber-500/40 flex items-center justify-center border border-amber-500/30 animate-pulse">
              <Bot className="w-8 h-8 text-amber-400" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-amber-400/20 border-t-amber-400 animate-spin" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <span>Inteligência Artificial Analisando Operação Comercial</span>
            </h4>
            <p className="text-xs font-mono text-amber-300 transition-all duration-300 min-h-[36px]">
              {stepLabels[loadingStep]}
            </p>
          </div>

          {/* Progress bar steps */}
          <div className="flex items-center gap-1.5 w-64 mt-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  loadingStep >= step
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rendered Diagnosis Content */}
      {!loading && diagnosisText && isExpanded && (
        <div className="p-5 sm:p-7 space-y-5 animate-fade-in bg-slate-950/40">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>{modelBadge || 'Gemini 2.0 Flash'}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span>Emissão: <strong className="text-slate-200">{generatedTime}</strong></span>
              <span className="text-slate-600">·</span>
              <span>Base: <strong className="text-amber-400">{overview.label}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {isTyping && (
                <button
                  onClick={handleSkipTyping}
                  className="px-2.5 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
                >
                  Pular animação
                </button>
              )}

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Copiar texto do parecer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Imprimir ou exportar parecer em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {/* Formatted Text Presentation */}
          <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 font-sans">
            {displayedText.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check if paragraph is a section header (e.g. ### (1) Resumo Geral do Caixa)
              if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
                const headerText = trimmed.replace(/^#+\s*/, '');
                const isBlock1 = headerText.includes('(1)') || headerText.includes('Caixa') || headerText.includes('🎯');
                const isBlock2 = headerText.includes('(2)') || headerText.includes('Líderes') || headerText.includes('⚠️') || headerText.includes('🏆');
                const isBlock3 = headerText.includes('(3)') || headerText.includes('Ações') || headerText.includes('🚀');

                return (
                  <div
                    key={idx}
                    className={`pt-3 pb-1 border-b flex items-center gap-2 font-bold text-sm sm:text-base tracking-tight ${
                      isBlock2
                        ? 'text-rose-400 border-rose-500/20'
                        : isBlock3
                        ? 'text-emerald-400 border-emerald-500/20'
                        : isBlock1
                        ? 'text-blue-400 border-blue-500/20'
                        : 'text-amber-400 border-amber-500/20'
                    }`}
                  >
                    <span>{headerText}</span>
                  </div>
                );
              }

              if (trimmed === '---') {
                return <hr key={idx} className="border-slate-800 my-2" />;
              }

              // Check if bullet point list
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
                return (
                  <div key={idx} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                    {trimmed.split('\n').map((line, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/^[-*]\s*/, '')
                              .replace(/^\d+\.\s*/, '')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>'),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              }

              // Regular paragraph with bold support
              return (
                <p
                  key={idx}
                  className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: trimmed.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-white font-semibold">$1</strong>'
                    ),
                  }}
                />
              );
            })}
          </div>

          {/* Typing cursor indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono pt-1">
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
              <span>Gerando parecer executivo em tempo real...</span>
            </div>
          )}

          {/* Executive Footer Signoff */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auditoria Comercial & Validação Heurística Torrano Negócios</span>
            </div>
            <span>Destinado exclusivamente a <strong>Flávio Torrano (Diretoria Geral)</strong></span>
          </div>
        </div>
      )}

      {/* Initial Empty / Prompt State */}
      {!loading && !diagnosisText && (
        <div className="p-6 sm:p-8 bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-200">
              Parecer Pronto para Geração
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Clique em <strong>"✨ Gerar Diagnóstico com IA"</strong> para compilar os dados atuais das equipes de Bruno, Lorena e Lucas e processar o parecer executivo oficial com a inteligência do Google Gemini.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleGenerateDiagnosis(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              title="Gerar análise imediata mesmo sem configurar chave da API"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Demonstração Rápida</span>
            </button>

            <button
              onClick={() => handleGenerateDiagnosis(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Agora</span>
            </button>
          </div>
        </div>
      )}

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="px-6 py-3 bg-amber-500/10 border-t border-amber-500/20 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-400 hover:text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
