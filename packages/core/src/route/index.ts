import { useEffect, useState } from "react";

interface RouteParams {
  [key: string]: string;
}

interface Route {
  path: string;
  component: React.ComponentType<any>;
  params?: RouteParams;
}

interface RouterState {
  currentPath: string;
  params: RouteParams;
}

const routes = new Map<string, React.ComponentType<any>>();

export function defineRoute(path: string, component: React.ComponentType<any>) {
  routes.set(path, component);
}

export function useLiteRoute(): RouterState {
  const [state, setState] = useState<RouterState>({
    currentPath: window.location.pathname,
    params: {},
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const params = extractParams(path);
      setState({ currentPath: path, params });
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return state;
}

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function extractParams(path: string): RouteParams {
  const params: RouteParams = {};
  const pathSegments = path.split("/");

  routes.forEach((_, routePath) => {
    const routeSegments = routePath.split("/");
    if (routeSegments.length === pathSegments.length) {
      const matchedParams: RouteParams = {};
      const isMatch = routeSegments.every((segment, index) => {
        if (segment.startsWith("[") && segment.endsWith("]")) {
          const paramName = segment.slice(1, -1);
          matchedParams[paramName] = pathSegments[index];
          return true;
        }
        return segment === pathSegments[index];
      });

      if (isMatch) {
        Object.assign(params, matchedParams);
      }
    }
  });

  return params;
}

export function getRouteComponent(
  path: string
): React.ComponentType<any> | undefined {
  return routes.get(path);
}

export function createRouter(routes: Route[]) {
  routes.forEach((route) => defineRoute(route.path, route.component));
}
