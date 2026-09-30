import React from 'react';
import { TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { 
  Users, 
  FileText, 
  PieChart, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface CockpitKpiGridProps {
  data: TeamData;
  isConsolidated: boolean;
}

export const CockpitKpiGrid: React.FC<CockpitKpiGridProps> = ({ data, isConsolidated }) => {
  // Folders currently in bank pipeline
  const pendingApproval = Math.max(0, data.analyzedDocs - data.contractsGross);
  const vgvRetentionRate = data.vgvGross > 0 ? (data.vgvNet / data.vgvGross) : 0;
  const cancellationRate = data.vgvGross > 0 ? (data.vgvCanceled / data.vgvGross) : 0;
  const docConversionRate = data.leads > 0 ? (data.analyzedDocs / data.leads) : 0;
  const efficiencyRate = data.analyzedDocs > 0 ? (data.contractsGross / data.analyzedDocs) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3.5">
      
      {/* Card 1 (Ícone Azul): Total Leads */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-[#2A3F68] rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Total Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-display text-white mt-2 tabular-nums">
            {formatNumber(data.leads)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono flex items-center gap-1">
            <span className="text-emerald-400 font-bold">+12%</span> vs. mês anterior
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Topo de Funil</span>
          <span className="text-blue-400 font-bold">100% Volume</span>
        </div>
      </div>

      {/* Card 2 (Ícone Ciano): Documentos Analisados */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-[#00D2FF]/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Docs Analisados
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-display text-white mt-2 tabular-nums">
            {formatNumber(data.analyzedDocs)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            Pastas pré-bancárias
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Qualificação</span>
          <span className="text-[#00D2FF] font-bold">{formatPercent(docConversionRate / 100)}</span>
        </div>
      </div>

      {/* Card 3 (Ícone Roxo): Tx. Doc / Leads */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-purple-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Tx. Doc / Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-display text-purple-300 mt-2 tabular-nums">
            {formatPercent(data.conversionDocRate / 100)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            Conversão em pasta
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Meta Operacional</span>
          <span className="text-purple-400 font-bold">&gt; 30.0%</span>
        </div>
      </div>

      {/* Card 4 (Ícone Âmbar): Em Aprovação */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Em Aprovação
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-display text-amber-300 mt-2 tabular-nums">
            {formatNumber(pendingApproval)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            Esteira bancária ativa
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Previsão 7-15 dias</span>
          <span className="text-amber-400 font-bold">Em trânsito</span>
        </div>
      </div>

      {/* Card 5 (Ícone Verde): Vendas Brutas */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Vendas Brutas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl xl:text-2xl font-black font-display text-white mt-2 tabular-nums">
            {formatBRL(data.vgvGross, true)}
          </div>
          <div className="text-[11px] text-slate-300 mt-1 font-mono flex items-center justify-between">
            <span>{formatNumber(data.contractsGross)} contratos</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Ticket Médio</span>
          <span className="text-emerald-400 font-bold">{formatBRL(data.ticketAverage, true)}</span>
        </div>
      </div>

      {/* Card 6 (Ícone Vermelho #E60000): Destratos */}
      <div className="bg-[#111C32]/90 border-2 border-[#E60000]/60 hover:border-[#E60000] rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden bg-gradient-to-b from-[#111C32] to-[#E60000]/10">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#E60000] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-ping" />
              Destratos
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E60000]/20 border border-[#E60000]/40 flex items-center justify-center text-[#E60000] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl xl:text-2xl font-black font-display text-[#E60000] mt-2 tabular-nums drop-shadow-[0_0_10px_rgba(230,0,0,0.3)]">
            {formatBRL(data.vgvCanceled, true)}
          </div>
          <div className="text-[11px] text-red-300 mt-1 font-mono">
            {formatNumber(data.contractsCanceled)} contratos cancelados
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#E60000]/30 flex items-center justify-between text-[10px] font-mono">
          <span className="text-red-300">Taxa de Quebra:</span>
          <span className="font-black text-white bg-[#E60000] px-1.5 py-0.5 rounded text-[10px]">
            {formatPercent(cancellationRate)}
          </span>
        </div>
      </div>

      {/* Card 7 (Ícone Azul Elétrico): Tx. Eficiência */}
      <div className="bg-[#111C32]/90 border border-[#1E2E4E] hover:border-[#1D68FF]/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Tx. Eficiência
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#1D68FF]/15 border border-[#1D68FF]/30 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-display text-white mt-2 tabular-nums">
            {formatPercent(data.conversionSalesRate / 100)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            Pastas &rarr; Vendas Brutas
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#1E2E4E] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>Aprovação Final</span>
          <span className="text-[#00D2FF] font-bold">{formatNumber(data.contractsGross)} un.</span>
        </div>
      </div>

      {/* Card 8 (Card Destaque Verde Esmeralda à direita): VGV Líquido */}
      <div className="bg-[#111C32]/95 border-2 border-emerald-500/70 hover:border-emerald-400 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden bg-gradient-to-b from-[#111C32] to-emerald-950/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              VGV Líquido
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl xl:text-2xl font-black font-display text-emerald-400 mt-2 tabular-nums drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
            {formatBRL(data.vgvNet, true)}
          </div>
          <div className="text-[11px] text-emerald-200 mt-1 font-mono">
            {formatNumber(data.contractsNet)} contratos retidos
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-[10px] font-mono">
          <span className="text-emerald-300 font-semibold">Retenção de Caixa:</span>
          <span className="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px]">
            {formatPercent(vgvRetentionRate)}
          </span>
        </div>
      </div>

    </div>
  );
};
