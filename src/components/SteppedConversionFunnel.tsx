import React from 'react';
import { TeamData } from '../types';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';
import { 
  Users, 
  FileCheck2, 
  ShoppingCart, 
  CheckCircle2, 
  ArrowDown, 
  AlertOctagon, 
  ShieldAlert,
  Percent,
  Flame,
  ArrowRight
} from 'lucide-react';

interface SteppedConversionFunnelProps {
  data: TeamData;
}

export const SteppedConversionFunnel: React.FC<SteppedConversionFunnelProps> = ({ data }) => {
  const leads = data.leads;
  const docs = data.analyzedDocs;
  const grossContracts = data.contractsGross;
  const netContracts = data.contractsNet;
  const canceledContracts = data.contractsCanceled;
  const vgvGross = data.vgvGross;
  const vgvNet = data.vgvNet;
  const vgvCanceled = data.vgvCanceled;

  // Conversion calculations
  const docRate = data.conversionDocRate; // Leads -> Docs
  const salesRate = data.conversionSalesRate; // Docs -> Gross Sales
  const retentionRate = data.netRetentionRate; // Gross -> Net
  const overallEfficiency = ((netContracts / leads) * 100);

  // Stepped stages
  const steps = [
    {
      stepNumber: '01',
      title: 'LEADS CAPTADOS',
      subtitle: 'Volume de prospecção e tráfego qualificado',
      badge: '100% Topo de Funil',
      badgeColor: 'bg-cyan-950/80 text-[#00D2FF] border-cyan-500/40',
      value: `${formatNumber(leads)} leads`,
      secondary: '100% base inicial',
      barWidth: 100,
      gradient: 'from-[#00D2FF] to-[#0284C7]',
      icon: Users,
      iconColor: 'text-[#00D2FF]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30',
      nextArrow: {
        label: `${formatPercent(docRate, 1)} qualificados em pasta`,
        rate: docRate,
      }
    },
    {
      stepNumber: '02',
      title: 'PASTAS & DOCUMENTOS ANALISADOS',
      subtitle: 'Dossiês enviados para validação cadastral e de crédito',
      badge: `${formatPercent(docRate, 1)} de conversão`,
      badgeColor: 'bg-blue-950/80 text-sky-300 border-sky-500/40',
      value: `${formatNumber(docs)} pastas`,
      secondary: `${formatNumber(leads - docs)} leads não qualificados`,
      barWidth: Math.max(18, Math.min(100, (docs / leads) * 100)),
      gradient: 'from-[#0284C7] to-indigo-600',
      icon: FileCheck2,
      iconColor: 'text-sky-300',
      iconBg: 'bg-sky-500/10 border-sky-500/30',
      nextArrow: {
        label: `${formatPercent(salesRate, 1)} aprovados e assinados`,
        rate: salesRate,
      }
    },
    {
      stepNumber: '03',
      title: 'VENDAS BRUTAS EMITIDAS',
      subtitle: 'Propostas comerciais e espelhos de vendas emitidos',
      badge: formatBRL(vgvGross, true),
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
      value: `${grossContracts} contratos`,
      secondary: formatBRL(vgvGross, false),
      barWidth: Math.max(14, Math.min(100, (grossContracts / docs) * 80)),
      gradient: 'from-indigo-600 to-emerald-600',
      icon: ShoppingCart,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/30',
      nextArrow: {
        label: `${formatPercent(retentionRate, 1)} retenção líquida de caixa`,
        rate: retentionRate,
      }
    },
    {
      stepNumber: '04',
      title: 'VENDAS LÍQUIDAS EFETIVAS',
      subtitle: 'Contratos integralizados, retidos e consolidados em caixa',
      badge: 'Meta: ' + formatPercent((vgvNet / data.targetNet) * 100, 1),
      badgeColor: 'bg-emerald-950/90 text-[#10B981] border-emerald-500/50',
      value: `${netContracts} contratos retidos`,
      secondary: formatBRL(vgvNet, false),
      barWidth: Math.max(10, Math.min(100, (netContracts / grossContracts) * 70)),
      gradient: 'from-emerald-600 to-[#10B981]',
      icon: CheckCircle2,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/40',
      nextArrow: null,
    },
  ];

  const isHighRisk = data.cancellationRate > 12.0;

  return (
    <section aria-label="Funil Comercial Executivo em Degraus" className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUNA ESQUERDA: FUNIL EM 4 DEGRAUS CONECTADOS (8 ou 9 colunas) */}
        <div className="xl:col-span-8 bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col justify-between">
          
          {/* Header do Funil */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
                  Pipeline Comercial Tático
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">
                  Esteira de Conversão
                </span>
              </div>
              <h3 className="text-lg lg:text-xl font-black text-white font-display tracking-tight mt-0.5">
                Funil de Leads e Vendas em Degraus (Stepped Funnel)
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl self-start sm:self-auto">
              <span className="text-xs text-slate-400 font-mono">Eficiência Ponta a Ponta:</span>
              <strong className="text-sm font-black text-[#10B981] font-mono">
                {formatPercent(overallEfficiency, 2)}
              </strong>
            </div>
          </div>

          {/* Stepped Funnel Stages */}
          <div className="mt-6 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.stepNumber}>
                  
                  {/* Step Card Box */}
                  <div className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 sm:p-5 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      
                      {/* Left: Step Info */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${step.iconBg} border flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${step.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-black text-slate-400">
                              {step.stepNumber}.
                            </span>
                            <span className="text-sm font-bold text-white tracking-wide">
                              {step.title}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${step.badgeColor}`}>
                              {step.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                            {step.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Right: Numbers */}
                      <div className="text-right sm:text-right font-mono shrink-0 pl-11 sm:pl-0">
                        <div className="text-base sm:text-lg font-black text-white">
                          {step.value}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {step.secondary}
                        </div>
                      </div>
                    </div>

                    {/* Stepped Horizontal Visual Bar */}
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5 mt-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${step.gradient} transition-all duration-700 shadow-sm`}
                        style={{ width: `${step.barWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Connected Step Arrow Bridge */}
                  {step.nextArrow && (
                    <div className="flex items-center justify-center -my-1 py-1">
                      <div className="flex items-center gap-2 bg-[#080C14] border border-slate-800 text-slate-300 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-md">
                        <ArrowDown className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>{step.nextArrow.label}</span>
                      </div>
                    </div>
                  )}

                </React.Fragment>
              );
            })}
          </div>

          {/* Bottom Conversion Rates Summary */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Leads → Docs</span>
              <strong className="text-white text-sm">{formatPercent(docRate, 1)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Docs → Vendas Brutas</span>
              <strong className="text-white text-sm">{formatPercent(salesRate, 1)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Retenção de Caixa</span>
              <strong className="text-[#10B981] text-sm">{formatPercent(retentionRate, 1)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Índice de Destrato</span>
              <strong className="text-[#E60000] text-sm">{formatPercent(data.cancellationRate, 1)}</strong>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: CARD EXCLUSIVO DE DESTRATOS COM BARRA DE RISCO VERMELHO TORRANO (4 colunas) */}
        <div className="xl:col-span-4 bg-[#111827]/70 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden">
          
          {/* Top glowing bar in Torrano Red */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E60000] via-red-500 to-[#E60000]" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#E60000]">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E60000] block">
                    Monitoramento de Sangria
                  </span>
                  <h4 className="text-base font-black text-white font-display">
                    Destratos & Rescisões
                  </h4>
                </div>
              </div>

              {isHighRisk && (
                <span className="text-[10px] font-mono font-bold bg-[#E60000]/20 text-[#E60000] border border-[#E60000]/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" />
                  Risco Crítico
                </span>
              )}
            </div>

            {/* Main Destrato Metric */}
            <div className="bg-slate-900/80 border border-red-950/60 rounded-xl p-5 my-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Volume Financeiro Cancelado
              </div>
              <div className="text-3xl lg:text-4xl font-black text-[#E60000] font-mono tracking-tight font-display drop-shadow-[0_0_15px_rgba(230,0,0,0.35)]">
                {formatBRL(vgvCanceled)}
              </div>
              <div className="text-xs text-rose-300 font-mono mt-2 flex items-center gap-2">
                <span className="font-bold">{canceledContracts} contratos cancelados</span>
                <span>•</span>
                <span>{formatPercent(data.cancellationRate, 1)} taxa de quebra</span>
              </div>
            </div>

            {/* Visual Risk Gauge / Progress Bar */}
            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Taxa de Quebra vs. Teto de Segurança:</span>
                <span className={`font-bold ${isHighRisk ? 'text-[#E60000]' : 'text-amber-400'}`}>
                  {formatPercent(data.cancellationRate, 1)} / 10.0% máx
                </span>
              </div>

              {/* Multi-tier Risk Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#E60000] transition-all duration-700"
                  style={{ width: `${Math.min(100, (data.cancellationRate / 20) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>0% Saudável</span>
                <span className="text-amber-400 font-bold">10% Limite</span>
                <span className="text-[#E60000] font-bold">15%+ Crítico</span>
              </div>
            </div>

            {/* Tactical Observation */}
            <div className="mt-5 p-3.5 rounded-xl bg-red-950/20 border border-red-900/30 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E60000] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">
                    Impacto Direto no Caixa da Torrano:
                  </strong>
                  Cada rescisão drena em média <span className="font-mono text-white font-bold">{formatBRL(vgvCanceled / (canceledContracts || 1))}</span> da margem operacional.
                </div>
              </div>
            </div>

          </div>

          {/* Action Reminder */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Teto Tolerado Diretoria:</span>
            <span className="font-bold text-white">≤ 10.0% VGV Bruto</span>
          </div>

        </div>

      </div>
    </section>
  );
};
