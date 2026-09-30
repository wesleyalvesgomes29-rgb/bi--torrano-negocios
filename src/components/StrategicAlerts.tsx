import React, { useState } from 'react';
import { StrategicAlert } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Filter
} from 'lucide-react';

interface StrategicAlertsProps {
  alerts: StrategicAlert[];
}

export const StrategicAlerts: React.FC<StrategicAlertsProps> = ({ alerts }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const getAlertBadge = (type: StrategicAlert['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
          label: 'Atenção Crítica',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          accent: 'border-l-rose-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'Alerta Operacional',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          accent: 'border-l-amber-500',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Benchmark & Sucesso',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          accent: 'border-l-emerald-500',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-cyan-400" />,
          label: 'Estratégico Corporativo',
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          accent: 'border-l-cyan-500',
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Painel de Alertas Estratégicos & Decisões de Diretoria</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Diagnósticos automatizados de anomalias, riscos de quebra e recomendações prescritivas
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'all'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('critical')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'critical'
                ? 'bg-rose-500/20 text-rose-300 font-medium'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Críticos
          </button>
          <button
            onClick={() => setFilterType('warning')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'warning'
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Gargalos
          </button>
          <button
            onClick={() => setFilterType('success')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterType === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Destaques
          </button>
        </div>
      </div>

      {/* Alerts Cards Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => {
          const badge = getAlertBadge(alert.type);

          return (
            <div
              key={alert.id}
              className={`bg-slate-950/70 border border-slate-800 rounded-xl p-4.5 border-l-4 ${badge.accent} flex flex-col justify-between hover:border-slate-700 transition-colors`}
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border ${badge.bg}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {alert.team}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {alert.date}
                  </span>
                </div>

                {/* Title & Key Metric */}
                <h3 className="text-sm font-bold text-white mt-2.5">
                  {alert.title}
                </h3>
                <div className="mt-1 text-xs font-mono font-semibold text-amber-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800/80 inline-block">
                  Indicador: {alert.metric}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {alert.description}
                </p>

                {/* Financial Impact */}
                <div className="mt-3 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10 text-xs">
                  <span className="font-semibold text-rose-300 block mb-0.5">
                    Impacto Financeiro / Operacional:
                  </span>
                  <span className="text-slate-300">
                    {alert.impact}
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-start gap-1.5 text-slate-200">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-amber-400 font-semibold">Ação Recomendada (Diretoria): </strong>
                    <span className="text-slate-300">{alert.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
