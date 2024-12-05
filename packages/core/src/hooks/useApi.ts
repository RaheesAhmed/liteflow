import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function useApi<T>(
  path: string,
  schema: z.ZodType<T>,
  config?: AxiosRequestConfig & {
    queryOptions?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>;
  }
) {
  return useQuery({
    queryKey: [path, config?.params],
    queryFn: async () => {
      const response = await api.get(path, config);
      return schema.parse(response.data);
    },
    ...config?.queryOptions,
  });
}

export function useApiMutation<T, TVariables = unknown>(
  path: string,
  schema: z.ZodType<T>,
  config?: AxiosRequestConfig & {
    mutationOptions?: Omit<
      UseMutationOptions<T, AxiosError, TVariables>,
      'mutationFn'
    >;
  }
) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await api.post(path, variables, config);
      return schema.parse(response.data);
    },
    ...config?.mutationOptions,
  });
}
