import { useState, useCallback, useEffect } from "react";

type StateListener<T> = (value: T) => void;

class StateStore<T> {
  private value: T;
  private listeners: Set<StateListener<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
    this.listeners.forEach((listener) => listener(newValue));
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

const stores = new Map<string, StateStore<any>>();

export function useLiteState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [store] = useState(() => {
    if (!stores.has(key)) {
      stores.set(key, new StateStore(initialValue));
    }
    return stores.get(key)!;
  });

  const [value, setValue] = useState<T>(store.getValue());

  useEffect(() => {
    return store.subscribe((newValue) => setValue(newValue));
  }, [store]);

  const updateValue = useCallback(
    (newValue: T) => {
      store.setValue(newValue);
    },
    [store]
  );

  return [value, updateValue];
}

export function getLiteState<T>(key: string): T | undefined {
  return stores.get(key)?.getValue();
}

export function setLiteState<T>(key: string, value: T): void {
  stores.get(key)?.setValue(value);
}

export function createLiteState<T>(key: string, initialValue: T): void {
  if (!stores.has(key)) {
    stores.set(key, new StateStore(initialValue));
  }
}
