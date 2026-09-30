import React from 'react';
import { TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { Users, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

interface CleanEssentialCardsProps {
  data: TeamData;
}

export const CleanEssentialCards: React.FC<CleanEssentialCardsProps> = ({ data }) => {
  return (
    <section aria-label="Indicadores Essenciais" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CARD 1: TOTAL DE LEADS */}
        <div className="bg-[#0D1526] border border-[#1E2E4E] hover:border-slate-600/60 rounded-2xl p-6 transition-all duration-200 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 font-mono">
              Total de Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              {formatNumber(data.leads)}
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              Contatos captados no período
            </div>
          </div>
        </div>

        {/* CARD 2: DOCUMENTOS ANALISADOS */}
        <div className="bg-[#0D1526] border border-[#1E2E4E] hover:border-slate-600/60 rounded-2xl p-6 transition-all duration-200 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 font-mono">
              Documentos Analisados
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {formatNumber(data.analyzedDocs)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {formatPercent(data.conversionDocRate, 1)} de conversão
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              Pastas documentais em esteira bancária
            </div>
          </div>
        </div>

        {/* CARD 3: VENDAS LÍQUIDAS (DESTAQUE EM VERDE) */}
        <div className="bg-gradient-to-b from-[#0e211b] to-[#0D1526] border-2 border-emerald-500/60 hover:border-emerald-400 rounded-2xl p-6 transition-all duration-200 shadow-lg shadow-emerald-950/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Vendas Líquidas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_16px_rgba(16,185,129,0.3)]">
              {formatBRL(data.vgvNet)}
            </div>
            <div className="text-xs text-emerald-300/80 mt-2 font-medium flex items-center gap-2 flex-wrap">
              <span>{data.contractsNet} contratos retidos</span>
              <span>•</span>
              <span>Meta: {formatPercent((data.vgvNet / data.targetNet) * 100, 1)}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: DESTRATOS (DESTAQUE EM VERMELHO) */}
        <div className="bg-gradient-to-b from-[#240e14] to-[#0D1526] border-2 border-rose-500/60 hover:border-rose-400 rounded-2xl p-6 transition-all duration-200 shadow-lg shadow-rose-950/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-rose-500 to-red-400" />
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-rose-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Destratos
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-400 font-mono tracking-tight drop-shadow-[0_0_16px_rgba(244,63,94,0.3)]">
              {formatBRL(data.vgvCanceled)}
            </div>
            <div className="text-xs text-rose-300/80 mt-2 font-medium flex items-center gap-2 flex-wrap">
              <span className="font-bold font-mono bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                {formatPercent(data.cancellationRate, 1)} cancelamento
              </span>
              <span>•</span>
              <span>{data.contractsCanceled} quebras contratuais</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
