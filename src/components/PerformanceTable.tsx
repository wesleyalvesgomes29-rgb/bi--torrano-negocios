import React, { useState } from 'react';
import { PeriodOverview, TeamData } from '../types';
import { 
  formatBRL, 
  formatNumber, 
  formatPercent 
} from '../utils/formatters';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Table, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface PerformanceTableProps {
  overview: PeriodOverview;
}

type SortKey = 
  | 'name' 
  | 'leads' 
  | 'analyzedDocs' 
  | 'conversionDocRate' 
  | 'vgvGross' 
  | 'vgvCanceled' 
  | 'cancellationRate' 
  | 'vgvNet'
  | 'ticketAverage'
  | 'targetAchieved';

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ overview }) => {
  const { teams } = overview;
  const [sortKey, setSortKey] = useState<SortKey>('vgvNet');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const teamRows = [teams.bruno, teams.lorena, teams.lucas];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedRows = [...teamRows].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    if (sortKey === 'name') {
      aVal = a.name;
      bVal = b.name;
      return sortOrder === 'asc' 
        ? (aVal as string).localeCompare(bVal as string) 
        : (bVal as string).localeCompare(aVal as string);
    } else if (sortKey === 'targetAchieved') {
      aVal = (a.vgvNet / a.targetNet) * 100;
      bVal = (b.vgvNet / b.targetNet) * 100;
    } else {
      aVal = a[sortKey];
      bVal = b[sortKey];
    }

    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-60 inline ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-amber-400 inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400 inline ml-1" />
    );
  };

  const totalRow = teams.all;
  const totalTargetAchieved = (totalRow.vgvNet / totalRow.targetNet) * 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-amber-400" />
            <span>Tabela Analítica de Performance por Equipe Comercial</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Métricas completas de conversão, esteira documental, quebra de contratos e faturamento
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>* Clique no cabeçalho de qualquer coluna para ordenar</span>
        </div>
      </div>

      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-950/80 text-slate-300 font-semibold border-b border-slate-800 select-none">
            <tr>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-white"
                onClick={() => handleSort('name')}
              >
                Equipe Comercial {renderSortIndicator('name')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('leads')}
              >
                Leads {renderSortIndicator('leads')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('analyzedDocs')}
              >
                Docs Analisados {renderSortIndicator('analyzedDocs')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('conversionDocRate')}
              >
                Conversão Doc (%) {renderSortIndicator('conversionDocRate')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('vgvGross')}
              >
                Vendas Brutas (R$) {renderSortIndicator('vgvGross')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white text-rose-300"
                onClick={() => handleSort('vgvCanceled')}
              >
                Destratos (R$) {renderSortIndicator('vgvCanceled')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('cancellationRate')}
              >
                Taxa Destrato (%) {renderSortIndicator('cancellationRate')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white text-emerald-300"
                onClick={() => handleSort('vgvNet')}
              >
                Vendas Líquidas (R$) {renderSortIndicator('vgvNet')}
              </th>
              <th 
                className="py-3.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('ticketAverage')}
              >
                Ticket Médio {renderSortIndicator('ticketAverage')}
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('targetAchieved')}
              >
                Meta Atingida {renderSortIndicator('targetAchieved')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {sortedRows.map((team) => {
              const targetAchieved = (team.vgvNet / team.targetNet) * 100;
              const isHighDestrato = team.cancellationRate > 12;

              return (
                <tr 
                  key={team.id}
                  className="hover:bg-slate-800/40 transition-colors font-mono tabular-nums"
                >
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-100 flex flex-col">
                    <span className="font-semibold text-sm">{team.name}</span>
                    <span className="text-[11px] text-slate-400 font-sans font-normal">{team.leader}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-200">
                    {formatNumber(team.leads)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-200">
                    {formatNumber(team.analyzedDocs)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={team.conversionDocRate < 30 ? 'text-amber-400 font-semibold' : 'text-slate-200'}>
                      {formatPercent(team.conversionDocRate, 1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-indigo-300 font-semibold">
                    {formatBRL(team.vgvGross, false)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({team.contractsGross} contratos)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-rose-400 font-semibold">
                    {formatBRL(team.vgvCanceled, false)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({team.contractsCanceled} quebras)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span 
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        isHighDestrato ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-slate-300'
                      }`}
                    >
                      {formatPercent(team.cancellationRate, 1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-emerald-400 font-bold text-sm">
                    {formatBRL(team.vgvNet, false)}
                    <span className="block text-[10px] text-emerald-500/80 font-normal">
                      ({team.contractsNet} realizados)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300">
                    {formatBRL(team.ticketAverage, true)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`font-semibold ${targetAchieved >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {targetAchieved.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Meta: {formatBRL(team.targetNet, true)}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Total Row (Consolidated) */}
            <tr className="bg-slate-950 font-semibold border-t-2 border-slate-700 text-slate-100 tabular-nums">
              <td className="py-4 px-4 font-sans text-amber-400 font-bold text-sm">
                Consolidado Geral (Torrano Negócios)
                <span className="block text-[11px] text-slate-400 font-normal font-sans">
                  Total das 3 frentes comerciais
                </span>
              </td>
              <td className="py-4 px-3 text-right text-white">
                {formatNumber(totalRow.leads)}
              </td>
              <td className="py-4 px-3 text-right text-white">
                {formatNumber(totalRow.analyzedDocs)}
              </td>
              <td className="py-4 px-3 text-right text-amber-400">
                {formatPercent(totalRow.conversionDocRate, 1)}
              </td>
              <td className="py-4 px-3 text-right text-indigo-300 text-sm">
                {formatBRL(totalRow.vgvGross, false)}
                <span className="block text-[10px] text-slate-400 font-normal">
                  ({totalRow.contractsGross} contratos)
                </span>
              </td>
              <td className="py-4 px-3 text-right text-rose-400 text-sm">
                {formatBRL(totalRow.vgvCanceled, false)}
                <span className="block text-[10px] text-slate-400 font-normal">
                  ({totalRow.contractsCanceled} quebras)
                </span>
              </td>
              <td className="py-4 px-3 text-right text-slate-200">
                {formatPercent(totalRow.cancellationRate, 1)}
              </td>
              <td className="py-4 px-3 text-right text-emerald-400 text-base font-black">
                {formatBRL(totalRow.vgvNet, false)}
                <span className="block text-[10px] text-emerald-400/90 font-normal">
                  ({totalRow.contractsNet} realizados)
                </span>
              </td>
              <td className="py-4 px-3 text-right text-slate-300">
                {formatBRL(totalRow.ticketAverage, true)}
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-emerald-400 font-bold">
                  {totalTargetAchieved.toFixed(1)}%
                </span>
                <span className="block text-[10px] text-slate-400">
                  Meta: {formatBRL(totalRow.targetNet, true)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
