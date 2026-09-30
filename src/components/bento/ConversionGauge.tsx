import React from 'react';
import { TeamData } from '../../types';
import { formatPercent } from '../../utils/formatters';
import { Gauge, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ConversionGaugeProps {
  data: TeamData;
}

export const ConversionGauge: React.FC<ConversionGaugeProps> = ({ data }) => {
  // Estimated bank approval efficiency based on team performance
  // Lucas ~ 91%, Bruno ~ 84%, Lorena ~ 72%, All ~ 82%
  const approvalRate = data.id === 'lucas' ? 91.5 : data.id === 'bruno' ? 84.0 : data.id === 'lorena' ? 72.4 : 82.8;

  // Semaphoric status
  const isGreen = approvalRate >= 80;
  const isYellow = approvalRate >= 70 && approvalRate < 80;

  const statusLabel = isGreen
    ? 'Alta Eficiência Bancária'
    : isYellow
    ? 'Atenção na Esteira'
    : 'Gargalo Crítico de Crédito';

  const statusColor = isGreen
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : isYellow
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-[#E60000] bg-rose-50 border-rose-200';

  // Semicircle gauge geometry
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const arcLength = Math.PI * radius; // 180 degrees
  const strokeDashoffset = arcLength - (approvalRate / 100) * arcLength;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600">
            Aprovação Bancária
          </span>
          <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
            Índice de Conversão de Pastas
          </h3>
          <p className="text-xs text-slate-500">
            Laudos deferidos sem reprovação cadastral
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Gauge className="w-4 h-4" />
        </div>
      </div>

      {/* Semicircular Gauge SVG */}
      <div className="my-auto py-2 flex flex-col items-center justify-center relative">
        <div className="relative w-[180px] h-[100px] overflow-hidden">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[180deg]">
            {/* Background Arch */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${arcLength}`}
              strokeLinecap="round"
            />

            {/* Filled Progress Arch */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isGreen ? '#10B981' : isYellow ? '#F59E0B' : '#E60000'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${arcLength}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
        </div>

        {/* Center Numbers */}
        <div className="text-center -mt-6">
          <span className="text-3xl font-black text-slate-900 font-mono tracking-tight block">
            {formatPercent(approvalRate, 1)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Meta de Crédito: 80% mín.
          </span>
        </div>
      </div>

      {/* Status Semafórico */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-mono text-[11px]">Diagnóstico:</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${statusColor}`}>
          {isGreen ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          ) : isYellow ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-[#E60000]" />
          )}
          {statusLabel}
        </span>
      </div>

    </div>
  );
};
