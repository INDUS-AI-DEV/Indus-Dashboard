import { api } from '@/lib/api';

export interface Call {
  id: string;
  call_id: string;
  user_name: string;
  phone_number: string;
  sip_trunk_id: string;
  room_name: string;
  participant_identity: string;
  status: 'calling' | 'in-progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  duration?: number;
  recording_url?: string;
  transcript?: string;
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  metadata?: Record<string, any>;
}

export interface CallFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const callService = {
  async getCalls(filters: CallFilters = {}): Promise<{ data: Call[]; total: number }> {
    const response = await api.get<{ data: Call[]; total: number }>('/calls', { params: filters });
    return response.data;
  },

  async getCallById(id: string): Promise<Call> {
    const response = await api.get<Call>(`/calls/${id}`);
    return response.data;
  },

  async getCallTranscript(callId: string): Promise<string> {
    const response = await api.get<string>(`/calls/${callId}/transcript`);
    return response.data;
  },

  async getCallRecording(callId: string): Promise<string> {
    const response = await api.get<string>(`/calls/${callId}/recording`);
    return response.data;
  },

  async analyzeCall(callId: string): Promise<Call> {
    const response = await api.post<Call>(`/calls/${callId}/analyze`);
    return response.data;
  },

  async getCallAnalytics(filters: CallFilters = {}): Promise<any> {
    const response = await api.get('/analytics/calls', { params: filters });
    return response.data;
  },
};

export default callService;
