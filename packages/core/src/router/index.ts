import React, { Suspense, useEffect, useState } from 'react';
import { z } from 'zod';

export type RouteParams = Record<string, string>;

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  validate?: z.ZodSchema;
  middleware?: RouteMiddleware[];
  children?: RouteConfig[];
}

export type RouteMiddleware = (context: {
  params: RouteParams;
  path: string;
}) => Promise<boolean | void>;

export class RouterError extends Error {
  constructor(
    message: string,
    public code:
      | 'VALIDATION_ERROR'
      | 'MIDDLEWARE_ERROR'
      | 'NOT_FOUND'
      | 'RENDER_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'RouterError';
  }
}

export function matchPath(pattern: string, path: string): RouteParams | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: RouteParams = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

export function useNavigate() {
  return (path: string) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
}

export function findRoute(
  routes: RouteConfig[],
  path: string
): { route: RouteConfig; params: RouteParams } | null {
  for (const route of routes) {
    const params = matchPath(route.path, path);
    if (params) {
      return { route, params };
    }

    if (route.children) {
      const childMatch = findRoute(route.children, path);
      if (childMatch) return childMatch;
    }
  }

  return null;
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="lite-error-boundary">
        <h2>Something went wrong</h2>
        <details>
          <summary>{error.message}</summary>
          <pre>{error.stack}</pre>
        </details>
      </div>
    );
  }

  return <>{children}</>;
}

export function RouteComponent({
  route,
  params,
}: {
  route: RouteConfig;
  params: RouteParams;
}) {
  const Component = route.component;

  const validateParams = async () => {
    try {
      if (route.validate) {
        await route.validate.parseAsync(params);
      }

      if (route.middleware) {
        for (const middleware of route.middleware) {
          const result = await middleware({
            params,
            path: window.location.pathname,
          });
          if (result === false) {
            throw new RouterError(
              'Route access denied by middleware',
              'MIDDLEWARE_ERROR'
            );
          }
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new RouterError(
          'Route parameter validation failed',
          'VALIDATION_ERROR',
          error.errors
        );
      }
      throw error;
    }
  };

  useEffect(() => {
    validateParams().catch(error => {
      console.error('Route validation error:', error);
      throw error;
    });
  }, [params]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Component params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

export function LiteRouter({ routes }: { routes: RouteConfig[] }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const match = findRoute(routes, path);

  if (!match) {
    return (
      <div className="lite-404">
        <h1>404 - Page Not Found</h1>
        <p>The requested path {path} could not be found.</p>
      </div>
    );
  }

  return <RouteComponent route={match.route} params={match.params} />;
}

// File-based routing utility
export function createFileBasedRoutes(
  pages: Record<string, React.ComponentType>
) {
  const routes: RouteConfig[] = [];

  for (const [path, component] of Object.entries(pages)) {
    const routePath =
      path
        .replace(/^pages/, '')
        .replace(/\.tsx?$/, '')
        .replace(/index$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1') || '/';

    routes.push({ path: routePath, component });
  }

  return routes;
}

// Route outlet for nested routes
export function Outlet() {
  const { params } = useContext(RouterContext);
  return <div data-testid="route-outlet">{params.children}</div>;
}
