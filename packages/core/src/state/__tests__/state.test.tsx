import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useLiteState } from '../index';

describe('State Management', () => {
  describe('useLiteState', () => {
    it('should initialize with default value', () => {
      const { result } = renderHook(() => useLiteState('counter', 0));
      expect(result.current[0]).toBe(0);
    });

    it('should update state', () => {
      const { result } = renderHook(() => useLiteState('counter', 0));

      act(() => {
        result.current[1](1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should handle functional updates', () => {
      const { result } = renderHook(() => useLiteState('counter', 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should share state between hooks', () => {
      const { result: result1 } = renderHook(() => useLiteState('counter', 0));
      const { result: result2 } = renderHook(() => useLiteState('counter', 0));

      act(() => {
        result1.current[1](1);
      });

      expect(result1.current[0]).toBe(1);
      expect(result2.current[0]).toBe(1);
    });

    it('should handle complex objects', () => {
      const initialState = { name: 'John', age: 30 };
      const { result } = renderHook(() => useLiteState('user', initialState));

      act(() => {
        result.current[1]({ ...initialState, age: 31 });
      });

      expect(result.current[0]).toEqual({ name: 'John', age: 31 });
    });

    it('should handle undefined initial value', () => {
      const { result } = renderHook(() => useLiteState('counter'));
      expect(result.current[0]).toBeUndefined();
    });

    it('should handle null value', () => {
      const { result } = renderHook(() => useLiteState('user', null));

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]({ name: 'John' });
      });

      expect(result.current[0]).toEqual({ name: 'John' });
    });

    it('should handle arrays', () => {
      const { result } = renderHook(() => useLiteState('items', ['a', 'b']));

      act(() => {
        result.current[1]([...result.current[0], 'c']);
      });

      expect(result.current[0]).toEqual(['a', 'b', 'c']);
    });

    it('should handle multiple state updates', () => {
      const { result } = renderHook(() => useLiteState('counter', 0));

      act(() => {
        result.current[1](1);
        result.current[1](2);
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3);
    });

    it('should handle async state updates', async () => {
      const { result } = renderHook(() => useLiteState('counter', 0));

      act(() => {
        Promise.resolve().then(() => {
          result.current[1](1);
        });
      });

      await waitFor(() => {
        expect(result.current[0]).toBe(1);
      });
    });
  });
});
