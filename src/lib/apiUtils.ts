import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    const status = error.response?.status;
    let message = error.message;
    
    if (error.response?.data) {
      // Try to get a more specific error message from the response
      const data = error.response.data;
      message = data.message || data.detail || JSON.stringify(data);
    }

    // Show error toast
    toast({
      title: `Error ${status || ''}`.trim(),
      description: message,
      variant: 'destructive',
    });

    return {
      message,
      status,
      details: error.response?.data,
    };
  }

  // Handle non-Axios errors
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });

  return { message };
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
