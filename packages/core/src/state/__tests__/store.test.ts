import React from 'react';
import { Store } from '../index';
import { act, renderHook } from '@testing-library/react';

describe('Store', () => {
  let store: Store<any>;

  beforeEach(() => {
    store = new Store({
      counter: 0,
      user: null,
    });
  });

  describe('Basic State Management', () => {
    it('should initialize with default state', () => {
      expect(store.getState()).toEqual({
        counter: 0,
        user: null,
      });
    });

    it('should update state correctly', () => {
      store.setState({ counter: 1 });
      expect(store.getState().counter).toBe(1);
    });

    it('should handle partial state updates', () => {
      store.setState({ user: { name: 'John' } });
      expect(store.getState()).toEqual({
        counter: 0,
        user: { name: 'John' },
      });
    });

    it('should handle functional updates', () => {
      store.setState(state => ({ counter: state.counter + 1 }));
      expect(store.getState().counter).toBe(1);
    });
  });

  describe('Subscriptions', () => {
    it('should notify subscribers of state changes', () => {
      const listener = jest.fn();
      store.subscribe(listener);

      store.setState({ counter: 1 });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscribers', () => {
      const listeners = [jest.fn(), jest.fn(), jest.fn()];
      listeners.forEach(listener => store.subscribe(listener));

      store.setState({ counter: 1 });
      listeners.forEach(listener => {
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });

    it('should allow unsubscribing', () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      store.setState({ counter: 1 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.setState({ counter: 2 });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid state updates gracefully', () => {
      expect(() => store.setState(null as any)).not.toThrow();
    });

    it('should handle subscriber errors', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Subscriber error');
      });
      const normalListener = jest.fn();

      store.subscribe(errorListener);
      store.subscribe(normalListener);

      store.setState({ counter: 1 });

      expect(normalListener).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should handle rapid state updates', () => {
      const updates = new Array(1000).fill(0);
      const start = performance.now();

      updates.forEach((_, i) => {
        store.setState({ counter: i });
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should complete in less than 1 second
      expect(store.getState().counter).toBe(999);
    });

    it('should handle many subscribers efficiently', () => {
      const subscribers = new Array(100).fill(null).map(() => jest.fn());
      subscribers.forEach(subscriber => store.subscribe(subscriber));

      const start = performance.now();
      store.setState({ counter: 1 });
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should notify all subscribers in less than 100ms
      subscribers.forEach(subscriber => {
        expect(subscriber).toHaveBeenCalledTimes(1);
      });
    });
  });
});
