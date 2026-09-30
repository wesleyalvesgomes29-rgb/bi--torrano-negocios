import React from 'react';
import { TeamData } from '../../types';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { FileCheck, FileClock, FileX, FolderSearch } from 'lucide-react';

interface DocumentationStatusBarProps {
  data: TeamData;
}

export const DocumentationStatusBar: React.FC<DocumentationStatusBarProps> = ({ data }) => {
  const totalDocs = data.analyzedDocs || 1;

  // Realistic operational breakdown
  const approvedDocs = Math.round(totalDocs * 0.72);
  const pendingDocs = Math.round(totalDocs * 0.18);
  const rejectedDocs = Math.max(0, totalDocs - approvedDocs - pendingDocs);

  const items = [
    {
      label: 'Pastas Aprovadas pelo Banco',
      desc: 'Laudo de crédito deferido e liberado',
      count: approvedDocs,
      percent: (approvedDocs / totalDocs) * 100,
      color: 'bg-emerald-500',
      badge: 'Pronto p/ Contrato',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileCheck,
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Em Análise de Conformidade',
      desc: 'Dossiês na esteira do correspondente',
      count: pendingDocs,
      percent: (pendingDocs / totalDocs) * 100,
      color: 'bg-blue-600',
      badge: 'SLA 48h',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: FileClock,
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pendência Cadastral / Restrição',
      desc: 'Exige certidões ou avalista adicional',
      count: rejectedDocs,
      percent: (rejectedDocs / totalDocs) * 100,
      color: 'bg-[#E60000]',
      badge: 'Ação Urgente',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: FileX,
      iconColor: 'text-[#E60000]',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
            Esteira Documental
          </span>
          <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
            Status das Pastas & Documentação
          </h3>
          <p className="text-xs text-slate-500">
            Total de {formatNumber(data.analyzedDocs)} pastas em processamento
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <FolderSearch className="w-4 h-4" />
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 my-auto py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor} shrink-0`} />
                  <span className="font-bold text-slate-800 font-sans">{item.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="font-mono text-slate-700 font-bold">
                  {item.count} unid. <span className="text-slate-400 font-normal">({item.percent.toFixed(1)}%)</span>
                </div>
              </div>

              {/* Horizontal Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500 shadow-sm`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Conversão sobre Leads:</span>
        <strong className="text-slate-800 font-bold font-mono">
          {formatPercent(data.conversionDocRate, 1)} de aproveitamento
        </strong>
      </div>

    </div>
  );
};
