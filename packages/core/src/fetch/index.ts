import React from 'react';

export interface FetchConfig extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  cache?: boolean;
}

export interface FetchError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
}

export interface FetchState<T> {
  data: T | null;
  error: FetchError | null;
  loading: boolean;
}

export interface MutationState<T> {
  data: T | null;
  error: FetchError | null;
  loading: boolean;
  mutate: (data?: any) => Promise<void>;
}

const cache = new Map<string, any>();

async function fetchWithRetry(
  url: string,
  config: FetchConfig = {},
  retries = config.retries || 3,
  retryDelay = config.retryDelay || 1000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = config.timeout || 30000;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      const error: FetchError = {
        name: 'FetchError',
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
        statusText: response.statusText,
        url,
      };
      throw error;
    }

    return response;
  } catch (error: any) {
    if (retries > 0 && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fetchWithRetry(url, config, retries - 1, retryDelay);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useLiteFetch<T>(url: string, config: FetchConfig = {}) {
  const [state, setState] = React.useState<FetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (config.cache && cache.has(url)) {
        setState({
          data: cache.get(url),
          error: null,
          loading: false,
        });
        return;
      }

      try {
        const response = await fetchWithRetry(url, config);
        const data = await response.json();

        if (mounted) {
          if (config.cache) {
            cache.set(url, data);
          }

          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error: any) {
        if (mounted) {
          setState({
            data: null,
            error: {
              name: error.name || 'FetchError',
              message: error.message || 'An error occurred',
              status: error.status,
              statusText: error.statusText,
              url,
            },
            loading: false,
          });
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url, JSON.stringify(config)]);

  return state;
}

export function useLiteMutation<T>(url: string, config: FetchConfig = {}) {
  const [state, setState] = React.useState<MutationState<T>>({
    data: null,
    error: null,
    loading: false,
    mutate: async () => {},
  });

  const mutate = React.useCallback(
    async (data?: any) => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const response = await fetchWithRetry(url, {
          ...config,
          method: 'POST',
          body: data,
        });

        const responseData = await response.json();

        if (config.cache) {
          cache.clear(); // Clear cache after mutation
        }

        setState({
          data: responseData,
          error: null,
          loading: false,
          mutate,
        });
      } catch (error: any) {
        setState({
          data: null,
          error: {
            name: error.name || 'FetchError',
            message: error.message || 'An error occurred',
            status: error.status,
            statusText: error.statusText,
            url,
          },
          loading: false,
          mutate,
        });
      }
    },
    [url, JSON.stringify(config)]
  );

  React.useEffect(() => {
    setState(prev => ({ ...prev, mutate }));
  }, [mutate]);

  return state;
}

// Error boundary component
export function FetchErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
