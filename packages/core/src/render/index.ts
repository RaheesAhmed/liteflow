import {
  renderToString,
  renderToPipeableStream,
  renderToReadableStream,
} from 'react-dom/server';

import { QueryClient } from '@tanstack/react-query';

// Types for rendering options
export interface RenderOptions {
  streaming?: boolean;
  edge?: boolean;
  hydrate?: boolean;
  queryClient?: QueryClient;
  cache?: Cache;
}

export interface RenderResult {
  html: string;
  state?: any;
  stream?: ReadableStream;
}

// Server Component wrapper
export function ServerComponent<T>({
  component: Component,
  props,
  fallback,
}: {
  component: React.ComponentType<T>;
  props: T;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}

// Client hydration wrapper
export function ClientHydration({
  children,
  state,
}: {
  children: React.ReactNode;
  state?: any;
}) {
  return (
    <>
      {children}
      {state && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__LITEFLOW_STATE__ = ${JSON.stringify(state)}`,
          }}
        />
      )}
    </>
  );
}

// Main render function
export async function render(
  element: React.ReactElement,
  options: RenderOptions = {}
): Promise<RenderResult> {
  const { streaming = false, edge = false, hydrate = true } = options;

  // Edge runtime rendering
  if (edge) {
    const stream = await renderToReadableStream(element, {
      bootstrapScripts: hydrate ? ['/client.js'] : undefined,
      onError(error) {
        console.error('Error during edge rendering:', error);
      },
    });

    return { stream };
  }

  // Streaming SSR
  if (streaming) {
    let html = '';
    const stream = renderToPipeableStream(element, {
      onShellReady() {
        // Shell content is ready to be streamed
      },
      onAllReady() {
        // All content is ready, including suspended content
      },
      onError(error) {
        console.error('Error during streaming SSR:', error);
      },
    });

    return { html, stream };
  }

  // Traditional SSR
  const html = renderToString(element);
  return { html };
}

// Helper for handling streaming responses
export async function handleStream(
  stream: ReadableStream,
  res: Response
): Promise<void> {
  const reader = stream.getReader();
  const encoder = new TextEncoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = encoder.encode(value);
    await res.write(chunk);
  }

  await res.end();
}

// Cache management
export class RenderCache {
  private cache: Map<string, { html: string; timestamp: number }>;
  private ttl: number;

  constructor(ttl = 1000 * 60 * 5) {
    // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key: string, html: string) {
    this.cache.set(key, {
      html,
      timestamp: Date.now(),
    });
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.html;
  }

  clear() {
    this.cache.clear();
  }
}

// Example usage:
/*
// Server-side
const app = express();

app.get('*', async (req, res) => {
  const result = await render(
    <App />,
    {
      streaming: true,
      edge: process.env.EDGE_RUNTIME,
      hydrate: true,
    }
  );

  if (result.stream) {
    res.setHeader('Content-Type', 'text/html');
    await handleStream(result.stream, res);
  } else {
    res.send(result.html);
  }
});

// Client-side
import { hydrateRoot } from 'react-dom/client';

const state = window.__LITEFLOW_STATE__;
hydrateRoot(
  document,
  <ClientHydration state={state}>
    <App />
  </ClientHydration>
);
*/
