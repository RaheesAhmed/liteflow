import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CreateStoreOptions {
  name: string;
  persist?: boolean;
  devtools?: boolean;
}

export function createStore<T extends object>(
  initialState: T,
  options: CreateStoreOptions
) {
  let store = create<T>();

  if (options.devtools) {
    store = store.use(devtools({ name: options.name }));
  }

  if (options.persist) {
    store = store.use(
      persist({
        name: options.name,
        skipHydration: true,
      })
    );
  }

  return store(() => initialState);
}

// Example usage:
// const useCounterStore = createStore(
//   { count: 0, increment: () => set(state => ({ count: state.count + 1 })) },
//   { name: 'counter', persist: true, devtools: true }
// );
