export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y';

export interface AgentMetric {
  total: number;
  changePercent: number;
}

export interface AgentLead {
  id: string;
  name: string;
  property: string;
  time: string;
  status: string;
  createdAt: string;
}

export interface AgentListingStat {
  id: string;
  title: string;
  status: string;
  views: number;
  favorites: number;
  inquiries: number;
}

export interface AgentStats {
  period: {
    from: string;
    to: string;
    label: AnalyticsPeriod;
  };
  views: AgentMetric;
  favorites: AgentMetric;
  leads: AgentMetric & { active: number };
  conversion: AgentMetric & { rate: number };
  activeListings: number;
  profile: {
    rating: number;
    reviewCount: number;
    responseRate: number;
    totalListings: number;
  };
  listingBreakdown: AgentListingStat[];
  recentLeads: AgentLead[];
}
