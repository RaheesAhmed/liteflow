import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useParams,
  useLocation,
  Outlet,
  type RouteObject,
} from 'react-router-dom';
import { z } from 'zod';

// Type definitions
export type RouteParams<
  T extends Record<string, string> = Record<string, string>
> = T;
export type RouteGuard = () => boolean | Promise<boolean>;
export type RouteMiddleware = (context: RouteContext) => void | Promise<void>;

export interface RouteContext {
  params: RouteParams;
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
}

export interface RouteConfig<T extends RouteParams = RouteParams> {
  path: string;
  component: React.ComponentType<{ params: T }>;
  loader?: () => Promise<any>;
  guard?: RouteGuard;
  middleware?: RouteMiddleware[];
  validate?: z.ZodType<any>;
  children?: RouteConfig<T>[];
}

// Route wrapper component with middleware support
function RouteWrapperComponent<T extends RouteParams>({
  component: Component,
  guard,
  middleware = [],
  validate,
}: Omit<RouteConfig<T>, 'path'>) {
  const params = useParams() as T;
  const location = useLocation();
  const navigate = useNavigate();

  const context: RouteContext = {
    params,
    location,
    navigate,
  };

  // Execute middleware
  React.useEffect(() => {
    middleware.forEach(async mw => {
      await mw(context);
    });
  }, [middleware, context]);

  // Execute guard
  if (guard && !guard()) {
    navigate('/');
    return null;
  }

  // Validate params if schema provided
  if (validate) {
    try {
      validate.parse(params);
    } catch (error) {
      console.error('Route params validation failed:', error);
      navigate('/404');
      return null;
    }
  }

  return React.createElement(
    Suspense,
    { fallback: React.createElement('div', null, 'Loading...') },
    React.createElement(Component, { params })
  );
}

const RouteWrapper = React.memo(
  RouteWrapperComponent
) as typeof RouteWrapperComponent;

// Create type-safe routes
export function createRoutes<T extends RouteParams = RouteParams>(
  configs: RouteConfig<T>[]
): RouteObject[] {
  return configs.map(config => ({
    path: config.path,
    element: React.createElement(RouteWrapper, config as any),
    children: config.children ? createRoutes(config.children) : undefined,
    loader: config.loader,
  }));
}

// Router provider component
export const LiteRouter = React.memo(function LiteRouter({
  routes,
}: {
  routes: RouteConfig[];
}) {
  const router = createBrowserRouter(createRoutes(routes));
  return React.createElement(RouterProvider, { router });
});

// Hooks
export { useNavigate, useParams, useLocation, Outlet };

// File-based routing utility
export async function createFileBasedRoutes(
  pagesDir: string
): Promise<RouteConfig[]> {
  const routes: RouteConfig[] = [];
  // Implementation would scan the pages directory and create routes
  // based on file structure, similar to Next.js
  return routes;
}
