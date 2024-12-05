import React, { Suspense, lazy, useEffect, useState } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';

// Types
export type RenderOptions = {
  streaming?: boolean;
  hydration?: boolean;
  cache?: boolean;
  suspense?: boolean;
};

export type RenderResult = {
  html: string;
  state: Record<string, any>;
  head: string[];
};

// Cache for component chunks
const chunkCache = new Map<string, Promise<any>>();

// Component loader with caching
async function loadComponent(path: string) {
  if (!chunkCache.has(path)) {
    chunkCache.set(path, import(path));
  }
  return chunkCache.get(path);
}

// Server-side component wrapper
export function ServerComponent({
  path,
  props,
  fallback = null,
}: {
  path: string;
  props?: any;
  fallback?: React.ReactNode;
}) {
  const Component = lazy(() => loadComponent(path));

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

// Client hydration wrapper
export function ClientHydration({
  children,
  state = {},
}: {
  children: React.ReactNode;
  state?: Record<string, any>;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restore state
    Object.entries(state).forEach(([key, value]) => {
      window.__LITEFLOW_STATE__ = window.__LITEFLOW_STATE__ || {};
      window.__LITEFLOW_STATE__[key] = value;
    });
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}

// Main render function
export async function render(
  App: React.ComponentType,
  options: RenderOptions = {}
): Promise<RenderResult> {
  const {
    streaming = false,
    hydration = true,
    cache = true,
    suspense = true,
  } = options;

  // Collect head tags and state
  const head: string[] = [];
  const state: Record<string, any> = {};

  // Create app instance
  const app = (
    <ClientHydration state={state}>
      {suspense ? (
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      ) : (
        <App />
      )}
    </ClientHydration>
  );

  // Handle streaming render
  if (streaming) {
    const { renderToPipeableStream } = await import('react-dom/server');
    const stream = renderToPipeableStream(app);

    return new Promise(resolve => {
      const chunks: Buffer[] = [];
      stream.pipe({
        write(chunk: Buffer) {
          chunks.push(chunk);
        },
        end() {
          resolve({
            html: Buffer.concat(chunks).toString(),
            state,
            head,
          });
        },
      });
    });
  }

  // Handle regular render
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(app);

  return { html, state, head };
}

// Client-side render
export function mount(
  App: React.ComponentType,
  container: Element,
  options: RenderOptions = {}
) {
  const { hydration = true } = options;

  const app = (
    <ClientHydration state={window.__LITEFLOW_STATE__}>
      <App />
    </ClientHydration>
  );

  if (hydration) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
}

// Cache handler
export class RenderCache {
  private cache = new Map<string, RenderResult>();

  set(key: string, result: RenderResult): void {
    this.cache.set(key, result);
  }

  get(key: string): RenderResult | undefined {
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Stream handler
export async function handleStream(
  stream: ReadableStream,
  onChunk: (chunk: string) => void
): Promise<void> {
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(new TextDecoder().decode(value));
  }
}
