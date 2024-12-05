import { renderHook, act } from '@testing-library/react';
import { useLiteFetch, useLiteMutation, FetchConfig } from '../index';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';

// Setup MSW server
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Data Fetching', () => {
  describe('useLiteFetch', () => {
    it('should fetch data successfully', async () => {
      const testData = { message: 'Hello' };
      server.use(
        http.get('http://api.test/data', () => {
          return HttpResponse.json(testData);
        })
      );

      const { result } = renderHook(() => useLiteFetch('http://api.test/data'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      server.use(
        http.get('http://api.test/error', () => {
          return new HttpResponse(JSON.stringify({ message: 'Server Error' }), {
            status: 500,
          });
        })
      );

      const { result } = renderHook(() =>
        useLiteFetch('http://api.test/error')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.status).toBe(500);
    });

    it('should handle network errors', async () => {
      server.use(
        http.get('http://api.test/network-error', () => {
          return HttpResponse.error();
        })
      );

      const { result } = renderHook(() =>
        useLiteFetch('http://api.test/network-error')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeTruthy();
    });

    it('should support cache configuration', async () => {
      let requestCount = 0;
      server.use(
        http.get('http://api.test/cached', () => {
          requestCount++;
          return HttpResponse.json({ count: requestCount });
        })
      );

      const config: FetchConfig = { cache: true };
      const { result: result1 } = renderHook(() =>
        useLiteFetch('http://api.test/cached', config)
      );

      await waitFor(() => {
        expect(result1.current.data?.count).toBe(1);
      });

      const { result: result2 } = renderHook(() =>
        useLiteFetch('http://api.test/cached', config)
      );

      await waitFor(() => {
        expect(result2.current.data?.count).toBe(1);
      });

      expect(requestCount).toBe(1); // Should only make one request
    });

    it('should handle retry logic', async () => {
      let attempts = 0;
      server.use(
        http.get('http://api.test/retry', () => {
          attempts++;
          if (attempts < 3) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({ success: true });
        })
      );

      const config: FetchConfig = { retries: 3, retryDelay: 100 };
      const { result } = renderHook(() =>
        useLiteFetch('http://api.test/retry', config)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ success: true });
      expect(attempts).toBe(3);
    });

    it('should handle request timeout', async () => {
      server.use(
        http.get('http://api.test/timeout', async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return HttpResponse.json({ success: true });
        })
      );

      const config: FetchConfig = { timeout: 100 };
      const { result } = renderHook(() =>
        useLiteFetch('http://api.test/timeout', config)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('timeout');
    });
  });

  describe('useLiteMutation', () => {
    it('should handle successful mutations', async () => {
      const testData = { id: 1, name: 'Test' };
      server.use(
        http.post('http://api.test/create', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ ...body, id: 1 });
        })
      );

      const { result } = renderHook(() =>
        useLiteMutation('http://api.test/create')
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();

      act(() => {
        result.current.mutate({ name: 'Test' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(testData);
      });
    });

    it('should handle mutation errors', async () => {
      server.use(
        http.post('http://api.test/error', () => {
          return new HttpResponse(JSON.stringify({ message: 'Invalid data' }), {
            status: 400,
          });
        })
      );

      const { result } = renderHook(() =>
        useLiteMutation('http://api.test/error')
      );

      act(() => {
        result.current.mutate({ invalid: true });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.status).toBe(400);
      });
    });

    it('should clear cache after successful mutation', async () => {
      let getData = { value: 'old' };
      server.use(
        http.get('http://api.test/data', () => {
          return HttpResponse.json(getData);
        }),
        http.post('http://api.test/update', async ({ request }) => {
          const body = await request.json();
          getData = body;
          return HttpResponse.json(body);
        })
      );

      // First fetch
      const { result: fetchResult } = renderHook(() =>
        useLiteFetch('http://api.test/data', { cache: true })
      );

      await waitFor(() => {
        expect(fetchResult.current.data).toEqual({ value: 'old' });
      });

      // Mutation
      const { result: mutationResult } = renderHook(() =>
        useLiteMutation('http://api.test/update', { cache: true })
      );

      act(() => {
        mutationResult.current.mutate({ value: 'new' });
      });

      await waitFor(() => {
        expect(mutationResult.current.data).toEqual({ value: 'new' });
      });

      // Fetch again
      const { result: newFetchResult } = renderHook(() =>
        useLiteFetch('http://api.test/data', { cache: true })
      );

      await waitFor(() => {
        expect(newFetchResult.current.data).toEqual({ value: 'new' });
      });
    });
  });
});
