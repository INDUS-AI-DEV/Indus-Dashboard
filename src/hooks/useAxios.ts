import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface AxiosConfig {
  method?: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    // Get token from localStorage or your auth context
    return localStorage.getItem('token');
  }, []);

  const authRequest = useCallback(async <T>({
    method = 'get',
    url,
    data,
    headers = {},
    params = {},
  }: AxiosConfig): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const config = {
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        params,
      };

      const response = await axios(config);
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  return { authRequest, isLoading, error };
};
