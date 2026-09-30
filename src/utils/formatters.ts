export function formatBRL(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `R$ ${(value / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
    }
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function calculateDelta(current: number, previous: number): {
  value: number;
  formatted: string;
  isPositive: boolean;
} {
  if (!previous || previous === 0) {
    return { value: 0, formatted: '0,0%', isPositive: true };
  }
  const delta = ((current - previous) / previous) * 100;
  const isPositive = delta >= 0;
  const formatted = `${isPositive ? '+' : ''}${delta.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

  return { value: delta, formatted, isPositive };
}
