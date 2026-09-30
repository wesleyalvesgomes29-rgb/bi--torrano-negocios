import React, { useRef } from 'react';
import { PeriodId, TeamId } from '../types';
import { 
  Building2, 
  Calendar, 
  Users, 
  SlidersHorizontal, 
  Download, 
  FileCode,
  Sparkles,
  BarChart3,
  GitCompare,
  BellRing,
  Calculator,
  FileSpreadsheet,
  Target,
  UploadCloud,
  FileUp,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentPeriod: PeriodId;
  onPeriodChange: (period: PeriodId) => void;
  currentTeam: TeamId;
  onTeamChange: (team: TeamId) => void;
  activeTab: 'overview' | 'goals' | 'comparison' | 'alerts' | 'simulator' | 'sheets' | 'ai';
  onTabChange: (tab: 'overview' | 'goals' | 'comparison' | 'alerts' | 'simulator' | 'sheets' | 'ai') => void;
  periodLabel: string;
  periodSubtitle: string;
  onOpenExportModal?: () => void;
  onExportCsv: () => void;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  isCustomData: boolean;
  onResetData: () => void;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPeriod,
  onPeriodChange,
  currentTeam,
  onTeamChange,
  activeTab,
  onTabChange,
  periodSubtitle,
  onOpenExportModal,
  onExportCsv,
  onFileUpload,
  onDownloadTemplate,
  isCustomData,
  onResetData,
  onOpenApiKeyModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // Reset input value so same file can be reloaded if desired
      e.target.value = '';
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#E60000]/25">
            T
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-[#E60000] font-sans">
                TORRANO
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
                NEGÓCIOS IMOBILIÁRIOS
              </span>
              {isCustomData && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  XLSX Carregado
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-200">BI Executivo</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Flávio Torrano</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">{periodSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Zone 2 & 3: Actions & Period Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="inline-flex rounded-lg bg-slate-950/80 p-1 border border-slate-800">
            {(
              [
                { id: 'month', label: 'Mês Atual' },
                { id: 'quarter', label: '3º Trimestre' },
                { id: 'year', label: 'Ano 2026' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => onPeriodChange(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  currentPeriod === item.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Button: Importar Planilha Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Importar arquivo Excel nativo (.xlsx ou .xls)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/40 rounded-lg shadow-sm shadow-emerald-600/20 transition-all whitespace-nowrap"
          >
            <FileUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Importar Planilha (.xlsx)</span>
          </button>

          {/* Button: Baixar Modelo Excel */}
          <button
            onClick={onDownloadTemplate}
            title="Baixar Modelo de Planilha Excel (.xlsx) com cabeçalhos corretos"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Baixar Modelo</span>
          </button>

          {/* Reset custom data button (if custom data active) */}
          {isCustomData && (
            <button
              onClick={onResetData}
              title="Restaurar dados padrão demonstrativos"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Demo</span>
            </button>
          )}

          {/* Quick Action: Export CSV */}
          <button
            onClick={onExportCsv}
            title="Exportar Dados em CSV"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Exportar CSV</span>
          </button>

          {/* Highlighted Action: Gerar Diagnóstico com IA */}
          <button
            onClick={() => {
              onTabChange('ai');
              const el = document.getElementById('ai-consulting-module');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Gerar Diagnóstico Executivo com IA (Google Gemini)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-[#E60000] hover:bg-[#CC0000] rounded-lg shadow-sm shadow-[#E60000]/30 transition-all whitespace-nowrap cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform" />
            <span>✨ Gerar Diagnóstico com IA</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Navigation Tabs & Team Selector */}
      <div className="bg-slate-950/60 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => onTabChange('overview')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Executivo BI</span>
            </button>

            <button
              onClick={() => onTabChange('goals')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'goals'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metas vs. Realizado</span>
            </button>

            <button
              onClick={() => onTabChange('comparison')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Comparativo de Equipes</span>
            </button>

            <button
              onClick={() => onTabChange('simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulador de Destrato</span>
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap relative ${
                activeTab === 'alerts'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-rose-400" />
              <span>Alertas Estratégicos</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => onTabChange('sheets')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'sheets'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planilha Google & API</span>
            </button>

            <button
              onClick={() => onTabChange('ai')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Consultoria com IA</span>
            </button>
          </div>

          {/* Team & View Selector (Requested Exact Spec) */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">Visão:</span>
            <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => {
                  onTeamChange('all');
                  if (activeTab === 'comparison') onTabChange('overview');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                    activeTab !== 'comparison' && currentTeam === 'all'
                    ? 'bg-[#E60000] text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Visão Geral (Flávio Torrano)
              </button>

              <button
                onClick={() => {
                  onTeamChange('bruno');
                  if (activeTab === 'comparison') onTabChange('overview');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                  activeTab !== 'comparison' && currentTeam === 'bruno'
                    ? 'bg-blue-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Equipa Bruno
              </button>

              <button
                onClick={() => {
                  onTeamChange('lorena');
                  if (activeTab === 'comparison') onTabChange('overview');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                  activeTab !== 'comparison' && currentTeam === 'lorena'
                    ? 'bg-amber-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Equipa Lorena
              </button>

              <button
                onClick={() => {
                  onTeamChange('lucas');
                  if (activeTab === 'comparison') onTabChange('overview');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                  activeTab !== 'comparison' && currentTeam === 'lucas'
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Equipa Lucas
              </button>

              <button
                onClick={() => onTabChange('comparison')}
                className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'comparison'
                    ? 'bg-[#E60000] text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <GitCompare className="w-3 h-3 text-white" />
                <span>Comparativo Direto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
