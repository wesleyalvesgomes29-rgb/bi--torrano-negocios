import React from 'react';
import { TeamData } from '../types';
import { 
  formatBRL, 
  formatNumber, 
  formatPercent 
} from '../utils/formatters';
import { 
  Users, 
  FileCheck2, 
  Receipt, 
  BadgeCheck, 
  ArrowRight, 
  ArrowDown, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface ConversionFunnelProps {
  data: TeamData;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  // Funnel calculations
  const totalLeads = data.leads;
  const docs = data.analyzedDocs;
  const grossSales = data.contractsGross;
  const netSales = data.contractsNet;
  const canceledContracts = data.contractsCanceled;

  // Conversion rates
  const rate1 = data.conversionDocRate; // Leads -> Docs
  const rate2 = data.conversionSalesRate; // Docs -> Gross Sales
  const retentionRate = data.netRetentionRate; // Gross -> Net
  const overallEfficiency = ((netSales / totalLeads) * 100);

  // Drop-offs
  const drop1 = totalLeads - docs;
  const drop2 = docs - grossSales;
  const drop3 = grossSales - netSales;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Funil de Conversão Comercial & Eficiência de Vendas</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rastreamento de ponta a ponta: do tráfego/captação à concretização financeira do VGV líquido
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Eficiência Geral (Lead → Venda Líquida):</span>
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {formatPercent(overallEfficiency, 2)}
          </span>
        </div>
      </div>

      {/* Visual Step Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5 relative">
        {/* Etapa 1: Leads Recebidos */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-cyan-500" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                1. Topo do Funil
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-200 mt-1">Leads Recebidos</h3>
            <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
              {formatNumber(totalLeads)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Captação tráfego pago & portais
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Perda no filtro:</span>
              <span className="font-mono text-slate-300">-{formatNumber(drop1)} leads</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Transition Connector 1 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                2. Qualificação
              </span>
              <FileCheck2 className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-200 mt-1">Pastas Analisadas</h3>
            <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
              {formatNumber(docs)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Documentos pré-bancários
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Taxa Conversão 1:</span>
              <span className="font-mono text-amber-400 font-bold">
                {formatPercent(rate1, 1)}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, Math.max(10, rate1 * 2))}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Etapa 3: Vendas Brutas */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                3. Negociação
              </span>
              <Receipt className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-200 mt-1">Vendas Brutas (VGV)</h3>
            <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
              {formatBRL(data.vgvGross, true)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="font-mono text-slate-200 font-semibold">{grossSales}</span> contratos assinados
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Taxa Conversão 2:</span>
              <span className="font-mono text-indigo-400 font-bold">
                {formatPercent(rate2, 1)}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, Math.max(10, rate2 * 4))}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Etapa 4: Vendas Líquidas */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                4. Concretização
              </span>
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-200 mt-1">Vendas Líquidas (Real)</h3>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
              {formatBRL(data.vgvNet, true)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="font-mono text-emerald-300 font-semibold">{netSales}</span> contratos concretizados
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Taxa de Retenção:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {formatPercent(retentionRate, 1)}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${retentionRate}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Funnel Stepper Flow Bar */}
      <div className="mt-4 p-3.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-medium text-white">Auditoria do Fluxo:</span>
          <span>
            {drop1} leads não avançaram para análise ({formatPercent(100 - rate1, 1)} de perda no topo) ·
            {' '}{canceledContracts} contratos distratados geraram perda de {formatBRL(data.vgvCanceled, true)} ({formatPercent(data.cancellationRate, 1)} de destrato).
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Ticket Médio Efetivo:</span>
          <span className="font-mono text-white font-medium">{formatBRL(data.ticketAverage, false)}</span>
        </div>
      </div>
    </div>
  );
};
