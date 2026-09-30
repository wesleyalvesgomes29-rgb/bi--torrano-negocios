export type PeriodId = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type TeamId = 'all' | 'bruno' | 'lorena' | 'lucas';

export type TeamFilterId = 'all' | 'bruno' | 'lorena' | 'lucas' | 'comparison';

export interface TeamData {
  id: TeamId;
  name: string;
  leader: string;
  leadDescription: string;
  ticketAverage: number;
  leads: number;
  analyzedDocs: number;
  contractsGross: number;
  contractsNet: number;
  contractsCanceled: number;
  vgvGross: number;
  vgvCanceled: number;
  vgvNet: number;
  targetNet: number;
  // Rates in percentage (0 to 100)
  conversionDocRate: number; // Leads -> Analyzed Docs
  conversionSalesRate: number; // Analyzed Docs -> Gross Sales
  cancellationRate: number; // Destrato (Canceled / Gross)
  netRetentionRate: number; // Net / Gross
  previousVgvNet: number;
  previousLeads: number;
  previousCanceled: number;
}

export interface MonthlyHistory {
  month: string;
  shortMonth: string;
  vgvNetTotal: number;
  vgvGrossTotal: number;
  vgvTarget: number;
  brunoNet: number;
  lorenaNet: number;
  lucasNet: number;
  destratoTotal: number;
}

export interface StrategicAlert {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  team: string;
  metric: string;
  description: string;
  impact: string;
  recommendation: string;
  date: string;
}

export interface PeriodOverview {
  period: PeriodId;
  label: string;
  subtitle: string;
  teams: Record<TeamId, TeamData>;
  history: MonthlyHistory[];
}
