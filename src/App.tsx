import React, { useState, useRef } from 'react';
import { PeriodId, TeamId, TeamFilterId, PeriodOverview } from './types';
import { PERIOD_DATA } from './data/mockData';
import { VgvAreaChart } from './components/bento/VgvAreaChart';
import { VgvDonutChart } from './components/bento/VgvDonutChart';
import { DocumentationStatusBar } from './components/bento/DocumentationStatusBar';
import { ConversionGauge } from './components/bento/ConversionGauge';
import { GrossNetBarChart } from './components/bento/GrossNetBarChart';
import { OperationalPipelineTable } from './components/bento/OperationalPipelineTable';
import { DestratoPipelinePanel } from './components/bento/DestratoPipelinePanel';
import { CleanExecutiveAiModal } from './components/bento/CleanExecutiveAiModal';
import { CleanWarRoomGrid } from './components/bento/CleanWarRoomGrid';
import { ApiKeyModal } from './components/ApiKeyModal';
import { parseExcelSpreadsheet, downloadExcelTemplate } from './utils/excelHandler';
import { formatBRL, formatNumber, formatPercent } from './utils/formatters';
import { 
  Sparkles, 
  FileSpreadsheet, 
  FolderDown, 
  Key, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [currentPeriod, setCurrentPeriod] = useState<PeriodId>('month');
  const [currentTeam, setCurrentTeam] = useState<TeamFilterId>('all');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Hidden file input for Excel upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom datasets state (fallback to mock)
  const [customDatasets, setCustomDatasets] = useState<Record<PeriodId, PeriodOverview> | null>(null);

  // Upload feedback message
  const [uploadNotification, setUploadNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: string[];
  } | null>(null);

  // Active dataset according to selected period
  const activePeriodOverview = (customDatasets && customDatasets[currentPeriod]) || PERIOD_DATA[currentPeriod];
  const activeTeamData = currentTeam === 'comparison' 
    ? activePeriodOverview.teams.all 
    : activePeriodOverview.teams[currentTeam as TeamId];
  const isCustomData = Boolean(customDatasets);

  // Excel File Upload Handler via SheetJS
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await parseExcelSpreadsheet(file);

    if (result.success && result.teamsData) {
      const updatedOverview: PeriodOverview = {
        ...PERIOD_DATA[currentPeriod],
        teams: result.teamsData,
        history: PERIOD_DATA[currentPeriod].history.map((h, i) => {
          if (i === PERIOD_DATA[currentPeriod].history.length - 1) {
            return {
              ...h,
              vgvNetTotal: result.teamsData!.all.vgvNet,
              vgvGrossTotal: result.teamsData!.all.vgvGross,
              destratoTotal: result.teamsData!.all.vgvCanceled,
              brunoNet: result.teamsData!.bruno.vgvNet,
              lorenaNet: result.teamsData!.lorena.vgvNet,
              lucasNet: result.teamsData!.lucas.vgvNet,
            };
          }
          return h;
        }),
      };

      setCustomDatasets((prev) => ({
        ...(prev || PERIOD_DATA),
        [currentPeriod]: updatedOverview,
      }));

      setUploadNotification({
        type: 'success',
        message: `${file.name}: Planilha corporativa processada para ${activePeriodOverview.label}!`,
        details: [
          `VGV Líquido Consolidado: ${formatBRL(result.teamsData.all.vgvNet, false)}`,
          `Vendas Brutas Emitidas: ${formatBRL(result.teamsData.all.vgvGross, false)}`,
          `Destratos Totais: ${formatBRL(result.teamsData.all.vgvCanceled, false)} (${formatPercent(result.teamsData.all.cancellationRate, 1)})`,
        ],
      });
    } else {
      setUploadNotification({
        type: 'error',
        message: result.message,
        details: result.missingColumns
          ? [`Colunas ausentes: ${result.missingColumns.join(', ')}`]
          : undefined,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetData = () => {
    setCustomDatasets(null);
    setUploadNotification({
      type: 'success',
      message: 'Base de dados oficial da Torrano restaurada com sucesso.',
    });
  };

  // Team Navigation Tabs (with bottom red underline when active)
  const TEAM_TABS: { id: TeamFilterId; label: string; icon: string }[] = [
    { id: 'all', label: 'Visão Geral Diretoria (Flávio)', icon: '🏢' },
    { id: 'bruno', label: 'Equipe Bruno', icon: '👤' },
    { id: 'lorena', label: 'Equipe Lorena', icon: '👤' },
    { id: 'lucas', label: 'Equipe Lucas', icon: '👤' },
    { id: 'comparison', label: 'War Room Comparativo', icon: '⚡' },
  ];

  // Period Granularity Options
  const PERIOD_OPTIONS: { id: PeriodId; label: string }[] = [
    { id: 'day', label: 'Diário' },
    { id: 'week', label: 'Semanal' },
    { id: 'month', label: 'Mensal' },
    { id: 'quarter', label: 'Trimestral' },
    { id: 'year', label: 'Anual' },
  ];

  // Map teamNetKey for area chart
  const teamNetKeyMap: Record<string, 'brunoNet' | 'lorenaNet' | 'lucasNet' | undefined> = {
    bruno: 'brunoNet',
    lorena: 'lorenaNet',
    lucas: 'lucasNet',
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-sans selection:bg-[#E60000]/15 selection:text-[#E60000] flex flex-col">
      
      {/* Hidden File Input for Excel */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 2. HEADER EXECUTIVO & NAVEGAÇÃO */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          {/* Topo à Esquerda: Logotipo TORRANO em Vermelho Vivo (#E60000) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-200 shrink-0">
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#E60000] font-display leading-tight">
                    TORRANO
                  </span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-800 hidden sm:inline">
                    NEGÓCIOS IMOBILIÁRIOS • BI EXECUTIVO
                  </span>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                  DIRETORIA FLÁVIO TORRANO
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#E60000] text-white text-xs font-mono font-bold flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>IA</span>
              </button>
            </div>
          </div>

          {/* Topo Central: Seletor de Período em estilo pílula limpo */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-mono shadow-inner overflow-x-auto max-w-full">
              {PERIOD_OPTIONS.map((opt) => {
                const isActive = currentPeriod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setCurrentPeriod(opt.id)}
                    className={`
                      px-3 sm:px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap
                      ${isActive 
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                        : 'text-slate-600 hover:text-slate-900'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topo à Direita: Mini-KPIs resumidos + Botões de Ação */}
          <div className="hidden xl:flex items-center gap-5 shrink-0">
            
            {/* Mini-KPIs */}
            <div className="flex items-center gap-4 text-xs font-mono border-r border-slate-200 pr-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">VGV Líquido Total</span>
                <strong className="text-sm font-black text-slate-900">{formatBRL(activeTeamData.vgvNet, true)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pastas Analisadas</span>
                <strong className="text-sm font-black text-slate-900">{formatNumber(activeTeamData.analyzedDocs)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">% Retenção</span>
                <strong className="text-sm font-black text-emerald-600">{formatPercent(activeTeamData.netRetentionRate, 1)}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#E60000] hover:bg-[#cc0000] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>✨ Parecer IA</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Importar Planilha (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>📁 Importar .xlsx</span>
              </button>

              <button
                onClick={downloadExcelTemplate}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
                title="Baixar Modelo de Planilha"
              >
                <FolderDown className="w-4 h-4" />
              </button>

              {isCustomData && (
                <button
                  onClick={handleResetData}
                  className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-600 hover:text-amber-800 transition-colors shadow-2xs cursor-pointer"
                  title="Restaurar dados originais"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
                title="Configurar Chave IA"
              >
                <Key className="w-4 h-4 text-blue-600" />
              </button>
            </div>

          </div>

        </div>

        {/* 3. NAVEGAÇÃO DE EQUIPES (ABAS COM DESTAQUE EM LINHA INFERIOR VERMELHA) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-6 overflow-x-auto scrollbar-none">
          {TEAM_TABS.map((tab) => {
            const isActive = currentTeam === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTeam(tab.id)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-sans font-bold text-xs sm:text-sm tracking-tight transition-all cursor-pointer whitespace-nowrap
                  ${isActive
                    ? 'border-[#E60000] text-slate-900 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 4. MAIN BENTO-GRID CONTAINER */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Upload Notification Banner */}
        {uploadNotification && (
          <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-xs ${
            uploadNotification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-start gap-3">
              {uploadNotification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm text-slate-900">{uploadNotification.message}</h4>
                {uploadNotification.details && (
                  <ul className="mt-1 space-y-0.5 text-xs font-mono opacity-90">
                    {uploadNotification.details.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button 
              onClick={() => setUploadNotification(null)}
              className="text-slate-400 hover:text-slate-700 p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content View: War Room or Modular Team Grid */}
        {currentTeam === 'comparison' ? (
          <CleanWarRoomGrid
            overview={activePeriodOverview}
            onSelectTeam={(teamId) => setCurrentTeam(teamId)}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Liderança Context Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                  {currentTeam === 'all' ? '🏢' : '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#E60000] uppercase tracking-wider">
                      {currentTeam === 'all' ? 'Consolidado Diretoria' : 'Frente Comercial Exclusiva'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-mono text-slate-500 font-medium">
                      {activePeriodOverview.label} ({activePeriodOverview.subtitle})
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                    {activeTeamData.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-400 uppercase text-[10px] block">Coordenador</span>
                  <strong className="text-slate-800">{activeTeamData.leader}</strong>
                </div>
                <div className="text-right pl-4 border-l border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] block">Meta do Período</span>
                  <strong className="text-emerald-700 font-bold">{formatBRL(activeTeamData.targetNet)}</strong>
                </div>
              </div>
            </div>

            {/* LINHA 1 (DESTAQUES PRINCIPAIS): Área 65% + Donut 35% */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Bloco Esquerdo: Gráfico de Área/Onda "Evolução do VGV e Conversão" */}
              <div className="lg:col-span-8">
                <VgvAreaChart
                  history={activePeriodOverview.history}
                  periodLabel={activePeriodOverview.label}
                  isConsolidated={currentTeam === 'all'}
                  teamNetKey={teamNetKeyMap[currentTeam]}
                />
              </div>

              {/* Bloco Direito: Gráfico Donut de "Origem & Participação de Vendas" */}
              <div className="lg:col-span-4">
                <VgvDonutChart
                  overview={activePeriodOverview}
                  currentTeam={currentTeam}
                  activeTeamData={activeTeamData}
                />
              </div>
            </div>

            {/* LINHA 2 (OPERAÇÃO E QUALIFICAÇÃO): 3 Blocos Modulares */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Bloco 1: Barras de Progresso Horizontais de Documentação */}
              <div>
                <DocumentationStatusBar data={activeTeamData} />
              </div>

              {/* Bloco 2: Gauge Circular de Conversão de Pastas */}
              <div>
                <ConversionGauge data={activeTeamData} />
              </div>

              {/* Bloco 3: Barras Comparativas Históricas (Bruto vs Líquido) */}
              <div>
                <GrossNetBarChart
                  history={activePeriodOverview.history}
                  activeTeamData={activeTeamData}
                />
              </div>
            </div>

            {/* LINHA 3 (FECHAMENTO E CAIXA): Tabela 60% + Painel Destratos 40% */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Tabela Executiva Limpa (lado esquerdo) */}
              <div className="lg:col-span-7">
                <OperationalPipelineTable data={activeTeamData} />
              </div>

              {/* Painel de Destratos e Pipeline (lado direito) */}
              <div className="lg:col-span-5">
                <DestratoPipelinePanel data={activeTeamData} />
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER CORPORATIVO CLEAN */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E60000]" />
            <span className="text-slate-800 font-bold">TORRANO NEGÓCIOS IMOBILIÁRIOS</span>
            <span>·</span>
            <span>Cockpit Executivo & War Room (Clean White Edition)</span>
          </div>
          <div>
            Diretoria Flávio Torrano · {activePeriodOverview.label}
          </div>
        </div>
      </footer>

      {/* 5. CENTRAL DE IA EXECUTIVA (MODAL CLEAN BRANCO COM BORDA VERMELHA) */}
      <CleanExecutiveAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        overview={activePeriodOverview}
        currentTeam={currentTeam}
        onSelectTeam={(teamId) => setCurrentTeam(teamId)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {}}
      />
    </div>
  );
}
