import { useState, useEffect } from "react";

interface FetchOptions extends RequestInit {
  refreshInterval?: number;
}

interface FetchState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

interface FetchResponse<T> extends FetchState<T> {
  mutate: () => Promise<void>;
}

const cache = new Map<string, any>();

export function useLiteFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): FetchResponse<T> {
  const [state, setState] = useState<FetchState<T>>({
    loading: true,
  });

  const fetchData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      cache.set(url, data);
      setState({ data, loading: false });
    } catch (error) {
      setState({ error: error as Error, loading: false });
    }
  };

  useEffect(() => {
    if (cache.has(url)) {
      setState({ data: cache.get(url), loading: false });
    } else {
      fetchData();
    }

    if (options.refreshInterval) {
      const interval = setInterval(fetchData, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [url, options.refreshInterval]);

  const mutate = async () => {
    cache.delete(url);
    await fetchData();
  };

  return { ...state, mutate };
}

export async function liteFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
