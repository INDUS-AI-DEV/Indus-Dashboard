import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface CallData {
  _id: string;
  call_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  phone_number?: string;
  sip_trunk_id?: string;
  room_name?: string;
  participant_identity?: string;
  // Add other call properties as needed
}

export interface CallMetrics {
  total_calls: number;
  recent_calls: number;
  status_distribution: {
    [status: string]: number;
  };
}

interface ApiResponse<T> {
  data: T;
}

export interface Transcript {
  _id: string;
  call_id: string;
  text: string;
  speaker: string;
  timestamp: string;
  confidence?: number;
}

export const useCallData = () => {
  const [calls, setCalls] = useState<CallData[]>([]);
  const [metrics, setMetrics] = useState<CallMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const [callsRes, metricsRes] = await Promise.all([
        api.get<CallData[]>('/api/calls/recent?limit=50'),
        api.get<CallMetrics>('/api/calls/metrics')
      ]);
      
      setCalls(callsRes.data);
      setMetrics(metricsRes.data);
      setError(null);
      return { calls: callsRes.data, metrics: metricsRes.data };
    } catch (error) {
      console.error('Error fetching call data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load call data. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const refresh = () => {
    return fetchCalls();
  };

  return {
    calls,
    metrics,
    loading,
    error,
    refresh
  };
};

export const useCallTranscripts = (callId: string) => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscripts = async (): Promise<Transcript[]> => {
    if (!callId) return [];
    
    try {
      setLoading(true);
      const response = await api.get<Transcript[]>(`/api/calls/${callId}/transcripts`);
      setTranscripts(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load call transcripts.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (callId) {
      fetchTranscripts();
    }
  }, [callId]);

  return {
    transcripts,
    loading,
    error,
    refresh: fetchTranscripts
  };
};
