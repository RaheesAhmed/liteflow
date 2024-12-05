import React from 'react';
import { z } from 'zod';

// Types
export type RouteParams = Record<string, string>;
export type RouteComponent = React.ComponentType<{ params: RouteParams }>;
export type RouteMiddleware = (params: RouteParams) => Promise<boolean>;

export interface Route {
  path: string;
  component: RouteComponent;
  children?: Route[];
  middleware?: RouteMiddleware[];
  validate?: z.ZodSchema;
}

export interface RouteMatch {
  route: Route;
  params: RouteParams;
}

// Router context
const RouterContext = React.createContext<{
  navigate: (path: string) => void;
  currentPath: string;
}>({
  navigate: () => {},
  currentPath: '',
});

// Hooks
export function useNavigate() {
  const { navigate } = React.useContext(RouterContext);
  return navigate;
}

export function useLocation() {
  const { currentPath } = React.useContext(RouterContext);
  return { pathname: currentPath };
}

// Path matching
export function matchPath(pattern: string, path: string): RouteParams | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: RouteParams = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = decodeURIComponent(pathParts[i]);

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

// Error boundary
class ErrorBoundaryComponent extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="lite-error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>{this.state.error.message}</summary>
            <pre>{this.state.error.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route component
export function RouteComponent({
  route,
  params,
}: {
  route: Route;
  params: RouteParams;
}) {
  const [isValid, setIsValid] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(true);
  const Component = route.component;

  React.useEffect(() => {
    async function validate() {
      // Validate params if schema is provided
      if (route.validate) {
        try {
          await route.validate.parseAsync(params);
          setIsValid(true);
        } catch (error) {
          setIsValid(false);
          return;
        }
      }

      // Check middleware if provided
      if (route.middleware) {
        try {
          const results = await Promise.all(
            route.middleware.map(middleware => middleware(params))
          );
          setIsAuthorized(results.every(Boolean));
        } catch (error) {
          setIsAuthorized(false);
        }
      }
    }

    validate();
  }, [route, params]);

  if (!isValid) {
    return <div>Parameter validation failed</div>;
  }

  if (!isAuthorized) {
    return <div>Not authorized</div>;
  }

  return (
    <ErrorBoundaryComponent>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component params={params} />
      </React.Suspense>
    </ErrorBoundaryComponent>
  );
}

// Router component
export function LiteRouter({ routes }: { routes: Route[] }) {
  const [currentPath, setCurrentPath] = React.useState(
    window.location.pathname || '/'
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = React.useCallback((path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  }, []);

  const match = React.useMemo(() => {
    for (const route of routes) {
      const params = matchPath(route.path, currentPath);
      if (params) {
        return { route, params };
      }
    }
    return null;
  }, [routes, currentPath]);

  if (!match) {
    return (
      <div className="lite-404">
        <h1>404 - Page Not Found</h1>
        <p>The requested path {currentPath} could not be found.</p>
      </div>
    );
  }

  return (
    <RouterContext.Provider value={{ navigate, currentPath }}>
      <RouteComponent route={match.route} params={match.params} />
    </RouterContext.Provider>
  );
}

// Outlet component for nested routes
export function Outlet({ children }: { children: React.ReactNode }) {
  return <div data-testid="route-outlet">{children}</div>;
}
