import { api } from '@/lib/api';

export interface DashboardMetrics {
  totalCalls: number;
  activeCalls: number;
  avgCallDuration: number;
  satisfactionScore: number;
}

export interface CallAnalytics {
  date: string;
  calls: number;
  duration: number;
  sentiment: number;
}

export interface CallTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export const dashboardService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  },

  async getCallAnalytics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<CallAnalytics[]> {
    const response = await api.get<CallAnalytics[]>('/dashboard/analytics', {
      params: { range: timeRange }
    });
    return response.data;
  },

  async getCallTypeDistribution(): Promise<CallTypeDistribution[]> {
    const response = await api.get<CallTypeDistribution[]>('/dashboard/call-types');
    return response.data;
  },

  async getRecentCalls(limit: number = 10) {
    const response = await api.get('/calls/recent', { params: { limit } });
    return response.data;
  },

  async getAgentPerformance() {
    const response = await api.get('/dashboard/agent-performance');
    return response.data;
  },

  async getCallInsights(callId: string) {
    const response = await api.get(`/calls/${callId}/insights`);
    return response.data;
  },

  async getCallRecording(callId: string) {
    const response = await api.get(`/calls/${callId}/recording`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default dashboardService;
