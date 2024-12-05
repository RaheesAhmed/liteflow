import React from 'react';
import { Store, useStore, useSelector } from '../index';
import { act, renderHook } from '@testing-library/react';

describe('React Hooks', () => {
  let store: Store<any>;

  beforeEach(() => {
    store = new Store({
      counter: 0,
      user: null,
    });
  });

  describe('useStore', () => {
    it('should return current value and setter', () => {
      const { result } = renderHook(() => useStore('counter', 0, store));

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should initialize state if not present', () => {
      const { result } = renderHook(() => useStore('newKey', 'initial', store));

      expect(result.current[0]).toBe('initial');
      expect(store.getState().newKey).toBe('initial');
    });

    it('should handle undefined initial value', () => {
      const { result } = renderHook(() =>
        useStore('counter', undefined, store)
      );

      expect(result.current[0]).toBe(0); // Should use existing store value
    });

    it('should update when store changes externally', () => {
      const { result } = renderHook(() => useStore('counter', 0, store));

      act(() => {
        store.setState({ counter: 5 });
      });

      expect(result.current[0]).toBe(5);
    });
  });

  describe('useSelector', () => {
    it('should return computed value', () => {
      store.setState({ counter: 5 });

      const selector = (state: any) => state.counter * 2;
      const { result } = renderHook(() => useSelector(selector, store));

      expect(result.current).toBe(10);
    });

    it('should update on relevant state changes', () => {
      const selector = (state: any) => state.counter * 2;
      const { result } = renderHook(() => useSelector(selector, store));

      act(() => {
        store.setState({ counter: 5 });
      });

      expect(result.current).toBe(10);
    });

    it('should handle complex selectors', () => {
      store.setState({
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
      });

      const selectUserById = (id: number) => (state: any) =>
        state.users.find((user: any) => user.id === id);

      const { result } = renderHook(() =>
        useSelector(selectUserById(1), store)
      );

      expect(result.current).toEqual({ id: 1, name: 'John' });
    });

    it('should not update on irrelevant state changes', () => {
      const selector = (state: any) => state.counter * 2;
      const { result } = renderHook(() => useSelector(selector, store));

      const renderCount = jest.fn();
      renderHook(() => {
        React.useEffect(renderCount, [result.current]);
      });

      act(() => {
        store.setState({ user: { name: 'John' } });
      });

      expect(renderCount).toHaveBeenCalledTimes(1); // Only initial render
    });
  });
});
