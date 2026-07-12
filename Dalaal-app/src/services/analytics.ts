import { api, unwrapResponse } from './api';
import type { AgentLead, AgentStats, AnalyticsPeriod } from '../types/analytics';

export const analyticsService = {
  async getAgentStats(period: AnalyticsPeriod = '30d'): Promise<AgentStats> {
    const response = await api.get(`agents/me/stats?period=${period}`);
    return unwrapResponse<AgentStats>(response.data);
  },
};

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

export function formatChangePercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value}%`;
}

export const ANALYTICS_ROLES = [
  'REGULAR_DALAAL',
  'VERIFIED_DALAAL',
  'PROPERTY_OWNER',
  'VEHICLE_OWNER',
] as const;
