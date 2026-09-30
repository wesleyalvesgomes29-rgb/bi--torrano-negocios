import React, { useRef } from 'react';
import { TeamId, TeamFilterId } from '../types';
import { 
  Building2, 
  User, 
  BarChart2, 
  FileUp, 
  Download, 
  Sparkles,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CockpitHeroBannerProps {
  currentTeam: TeamFilterId;
  onTeamChange: (team: TeamFilterId) => void;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  onOpenAiConsulting: () => void;
  isCustomData: boolean;
  onResetData: () => void;
}

export const CockpitHeroBanner: React.FC<CockpitHeroBannerProps> = ({
  currentTeam,
  onTeamChange,
  onFileUpload,
  onDownloadTemplate,
  onOpenAiConsulting,
  isCustomData,
  onResetData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  const teamButtons = [
    { id: 'all' as TeamFilterId, label: 'DIRETORIA (CONSOLIDADO)', icon: Building2 },
    { id: 'bruno' as TeamFilterId, label: 'EQUIPE BRUNO', icon: User },
    { id: 'lorena' as TeamFilterId, label: 'EQUIPE LORENA', icon: User },
    { id: 'lucas' as TeamFilterId, label: 'EQUIPE LUCAS', icon: User },
    { id: 'comparison' as TeamFilterId, label: 'WAR ROOM (COMPARATIVO GERAL)', icon: BarChart2 },
  ];

  const getBannerInfo = () => {
    switch (currentTeam) {
      case 'bruno':
        return {
          badge: '👤 LIDERANÇA COMERCIAL • MÉDIO / ALTO PADRÃO',
          title: 'Painel de Performance • Equipe Bruno',
          subtitle: 'Liderança: Bruno Torrano • Métricas exclusivas de prospecção, pastas em análise e retenção de caixa.',
        };
      case 'lorena':
        return {
          badge: '👤 LIDERANÇA COMERCIAL • LANÇAMENTOS E INVESTIDORES',
          title: 'Painel de Performance • Equipe Lorena',
          subtitle: 'Liderança: Lorena Vasconcelos • Métricas exclusivas de fluxo de lançamentos, pastas montadas e velocidade de vendas.',
        };
      case 'lucas':
        return {
          badge: '👤 LIDERANÇA COMERCIAL • PRIME & MANSÕES',
          title: 'Painel de Performance • Equipe Lucas',
          subtitle: 'Liderança: Lucas Siqueira • Métricas exclusivas de alto ticket, esteira bancária e fechamentos de alta retenção.',
        };
      case 'comparison':
        return {
          badge: '⚡ WAR ROOM EXECUTIVO • REUNIÃO DE ALINHAMENTO GERAL',
          title: 'War Room Estratégico • Comparativo Geral de Equipes',
          subtitle: 'Benchmarking direto, ranking de conversão e disputa de metas entre Bruno Torrano, Lorena Vasconcelos e Lucas Siqueira.',
        };
      case 'all':
      default:
        return {
          badge: '🏢 DIRETORIA GERAL • VISÃO CONSOLIDADA',
          title: 'Painel Executivo Flávio Torrano',
          subtitle: 'Acompanhamento consolidado de VGV, fluxo de documentos, destratos e desempenho corporativo global.',
        };
    }
  };

  const bannerInfo = getBannerInfo();

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {/* Hero Scenic Banner with Dark Mountain Background */}
      <div className="relative rounded-3xl overflow-hidden border border-[#1E2E4E] shadow-2xl bg-[#090E17]">
        {/* Background Image Overlay with dark scenic gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        {/* Radial Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A12] via-[#0B1323]/90 to-[#060A12]/80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D68FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-40 bg-[#E60000]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content Inside Hero */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            {/* Dynamic Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60000]/20 border border-[#E60000]/40 text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(230,0,0,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#E60000] animate-pulse" />
              <span>{bannerInfo.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
              {bannerInfo.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
              {bannerInfo.subtitle}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Importar Planilha (.xlsx) Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#1D68FF] to-[#00D2FF] hover:from-[#1D68FF]/90 hover:to-[#00D2FF]/90 text-white shadow-[0_0_25px_rgba(0,210,255,0.35)] border border-[#00D2FF]/60 active:scale-95 transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-white stroke-[2.5]" />
              <span>📁 Importar Planilha (.xlsx)</span>
            </button>

            {/* Baixar Modelo (.xlsx) */}
            <button
              onClick={onDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E2E4E] transition-colors cursor-pointer"
              title="Baixar planilha modelo pré-formatada"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Modelo Excel</span>
            </button>

            {/* Reset to Default */}
            {isCustomData && (
              <button
                onClick={onResetData}
                className="px-2.5 py-2 text-xs font-semibold text-[#E60000] hover:underline cursor-pointer"
              >
                Restaurar Padrão
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. LINHA DE BOTÕES PÍLULA (SELETOR DE EQUIPES) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-[#090E17]/80 rounded-2xl border border-[#1E2E4E]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scroll">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono hidden md:inline ml-2 mr-1">
            Visualização:
          </span>

          {teamButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = currentTeam === btn.id;

            return (
              <button
                key={btn.id}
                onClick={() => onTeamChange(btn.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer font-display tracking-wide
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-[0_0_15px_rgba(230,0,0,0.4)] border-2 border-[#E60000] ring-1 ring-[#E60000]/60' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E60000]' : 'text-slate-400'}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Quick Button */}
        <button
          onClick={onOpenAiConsulting}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E60000] to-red-700 hover:from-[#E60000]/90 hover:to-red-600 shadow-[0_0_15px_rgba(230,0,0,0.3)] border border-[#E60000]/60 transition-all cursor-pointer self-start sm:self-center mr-1"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>✨ Parecer TORRANO AI</span>
        </button>
      </div>
    </div>
  );
};
