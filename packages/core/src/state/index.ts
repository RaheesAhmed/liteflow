import React from 'react';
import { produce } from 'immer';
import { EventEmitter } from 'events';
import { createSelector } from 'reselect';

// Types
export type StateKey = string;
export type StateValue = any;
export type Selector<T> = (state: StoreState) => T;
export type Middleware = (
  store: Store<any>
) => (next: Function) => (action: Action) => any;
export type Reducer<T = any> = (state: T, payload: any) => T;
export type StoreState = Record<StateKey, StateValue>;
export type Action = {
  type: string;
  payload?: any;
};

// Store class
export class Store<T extends StoreState = StoreState> {
  private state: T;
  private emitter: EventEmitter;
  private middlewares: Middleware[];
  private reducers: Map<string, Reducer>;
  private selectors: Map<string, Selector<any>>;

  constructor(initialState: T = {} as T) {
    this.state = initialState;
    this.emitter = new EventEmitter();
    this.middlewares = [];
    this.reducers = new Map();
    this.selectors = new Map();
  }

  getState<K extends keyof T>(key?: K): K extends undefined ? T : T[K] {
    return (key ? this.state[key] : this.state) as any;
  }

  setState<K extends keyof T>(
    keyOrState: K | Partial<T>,
    value?: T[K] | ((prev: T[K]) => T[K])
  ): void {
    if (typeof keyOrState === 'string') {
      const key = keyOrState;
      const newValue =
        typeof value === 'function'
          ? (value as Function)(this.state[key])
          : value;

      this.state = produce(this.state, draft => {
        draft[key] = newValue;
      });
    } else {
      this.state = produce(this.state, draft => {
        Object.assign(draft, keyOrState);
      });
    }

    this.emitter.emit('change');
  }

  subscribe(listener: () => void): () => void {
    this.emitter.on('change', listener);
    return () => this.emitter.off('change', listener);
  }

  addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  addReducer<K extends keyof T>(key: K, reducer: Reducer<T[K]>): void {
    this.reducers.set(key as string, reducer);
  }

  dispatch(action: Action): any {
    const chain = this.middlewares.map(middleware => middleware(this));
    const dispatch = action => {
      if (typeof action === 'function') {
        return action(this.dispatch.bind(this), this.getState.bind(this));
      }

      const { type, payload } = action;
      const [key, actionType] = type.split('/');
      const reducer = this.reducers.get(key);

      if (reducer) {
        const newState = reducer(this.state[key], payload);
        this.setState(key, newState);
      }

      return action;
    };

    return chain.reduceRight(
      (next, middleware) => middleware(next),
      dispatch
    )(action);
  }

  select<R>(selector: Selector<R>): R {
    const key = selector.toString();
    let memoizedSelector = this.selectors.get(key);

    if (!memoizedSelector) {
      memoizedSelector = createSelector(state => state, selector);
      this.selectors.set(key, memoizedSelector);
    }

    return memoizedSelector(this.state);
  }
}

// Default store instance
export const defaultStore = new Store();

// React hooks
export function useLiteState<T>(
  key: StateKey,
  initialValue?: T,
  store: Store = defaultStore
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = React.useState<T>(
    () => store.getState(key) ?? initialValue
  );

  React.useEffect(() => {
    if (initialValue !== undefined && store.getState(key) === undefined) {
      store.setState(key, initialValue);
    }

    const unsubscribe = store.subscribe(() => {
      const newValue = store.getState(key);
      setValue(newValue);
    });

    return unsubscribe;
  }, [key, initialValue, store]);

  const updateValue = React.useCallback(
    (newValue: T | ((prev: T) => T)) => {
      store.setState(key, newValue);
    },
    [key, store]
  );

  return [value, updateValue];
}

export function useSelector<T>(
  selector: Selector<T>,
  store: Store = defaultStore
): T {
  const [value, setValue] = React.useState(() => store.select(selector));

  React.useEffect(() => {
    return store.subscribe(() => {
      const newValue = store.select(selector);
      setValue(newValue);
    });
  }, [selector, store]);

  return value;
}

// Middleware creators
export function createLogger() {
  return (store: Store) => (next: Function) => (action: Action) => {
    console.group(action.type);
    console.log('Previous state:', store.getState());
    console.log('Action:', action);

    const result = next(action);

    console.log('Next state:', store.getState());
    console.groupEnd();

    return result;
  };
}

export function createThunk() {
  return (store: Store) => (next: Function) => (action: Action) => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState);
    }
    return next(action);
  };
}

// Helper functions
export function createAction<T = void>(type: string) {
  return (payload?: T) => ({ type, payload });
}

export function createSlice<T>({
  name,
  initialState,
  reducers,
}: {
  name: string;
  initialState: T;
  reducers: Record<string, Reducer<T>>;
}) {
  const actions = {} as Record<string, (payload?: any) => Action>;
  const reducer = (state = initialState, action: Action) => {
    const [sliceName, actionType] = action.type.split('/');
    if (sliceName === name && reducers[actionType]) {
      return reducers[actionType](state, action.payload);
    }
    return state;
  };

  Object.keys(reducers).forEach(actionType => {
    const type = `${name}/${actionType}`;
    actions[actionType] = createAction(type);
  });

  return { actions, reducer };
}

// Error boundary component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
