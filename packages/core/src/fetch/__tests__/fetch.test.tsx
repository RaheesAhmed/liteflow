import { renderHook, act } from '@testing-library/react';
import { useLiteFetch, liteFetch } from '../index';

describe('LiteFetch', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should handle successful data fetching', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useLiteFetch('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch';
    mockFetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useLiteFetch('/api/test'));

    expect(result.current.loading).toBe(true);

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should use cache for subsequent requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result: result1 } = renderHook(() => useLiteFetch('/api/test'));

    // Wait for the first fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const { result: result2 } = renderHook(() => useLiteFetch('/api/test'));

    expect(result2.current.loading).toBe(false);
    expect(result2.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should support manual revalidation', async () => {
    const mockData1 = { id: 1, name: 'Test 1' };
    const mockData2 = { id: 1, name: 'Test 2' };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

    const { result } = renderHook(() => useLiteFetch('/api/test'));

    // Wait for the initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(mockData1);

    // Trigger and wait for revalidation
    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.data).toEqual(mockData2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should support direct fetch using liteFetch', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await liteFetch('/api/test');
    expect(data).toEqual(mockData);
  });
});
