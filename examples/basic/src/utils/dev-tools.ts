import * as React from "react";
import { analytics } from "./analytics";

// Development environment detection
export const isDev = process.env.NODE_ENV === "development";

// Performance measurement utility
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static start(label: string): void {
    if (isDev) {
      this.marks.set(label, performance.now());
    }
  }

  static end(label: string): void {
    if (isDev && this.marks.has(label)) {
      const startTime = this.marks.get(label)!;
      const duration = performance.now() - startTime;
      console.log(`🕒 ${label}: ${duration.toFixed(2)}ms`);
      analytics.track("performance", { label, duration });
      this.marks.delete(label);
    }
  }
}

// Component render tracking
export function trackRender(componentName: string): void {
  if (isDev) {
    console.log(`🔄 Rendering: ${componentName}`);
    analytics.track("component-render", { component: componentName });
  }
}

// Development logger
export const devLog = {
  info: (message: string, ...args: any[]): void => {
    if (isDev) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]): void => {
    if (isDev) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]): void => {
    if (isDev) {
      console.error(`❌ ${message}`, ...args);
    }
    analytics.trackError(new Error(message));
  },
  debug: (message: string, ...args: any[]): void => {
    if (isDev) {
      console.debug(`🔍 ${message}`, ...args);
    }
  },
};

// React component performance HOC
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const PerformanceTrackedComponent: React.FC<P> = (props) => {
    React.useEffect(() => {
      if (isDev) {
        const startTime = performance.now();
        return () => {
          const duration = performance.now() - startTime;
          analytics.track("component-lifecycle", {
            component: componentName,
            duration,
          });
        };
      }
    }, []);

    return React.createElement(WrappedComponent, props);
  };

  PerformanceTrackedComponent.displayName = `WithPerformanceTracking(${componentName})`;
  return PerformanceTrackedComponent;
}

// Development feature flags
export class FeatureFlags {
  private static flags: Map<string, boolean> = new Map();

  static setFlag(name: string, enabled: boolean): void {
    this.flags.set(name, enabled);
    if (isDev) {
      console.log(`🚩 Feature flag "${name}" set to ${enabled}`);
    }
  }

  static isEnabled(name: string): boolean {
    return this.flags.get(name) || false;
  }

  static getAllFlags(): Record<string, boolean> {
    return Object.fromEntries(this.flags);
  }
}

// Development error boundary
export class DevErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    analytics.trackError(error);
    if (isDev) {
      console.error(
        "🔥 React Error Boundary caught an error:",
        error,
        errorInfo
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return isDev
        ? React.createElement(
            "div",
            { style: { padding: "20px", backgroundColor: "#ffebee" } },
            React.createElement("h2", null, "🐛 Development Error"),
            React.createElement("pre", null, this.state.error?.message),
            React.createElement("pre", null, this.state.error?.stack)
          )
        : React.createElement(
            "div",
            null,
            "Something went wrong. Please try again."
          );
    }

    return this.props.children;
  }
}

// Development utilities
export const devUtils = {
  // Measure async function execution time
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (!isDev) return fn();

    PerformanceMonitor.start(label);
    try {
      const result = await fn();
      PerformanceMonitor.end(label);
      return result;
    } catch (error) {
      PerformanceMonitor.end(label);
      throw error;
    }
  },

  // Log React props changes
  logPropsChanges<P extends object>(
    prevProps: P,
    nextProps: P,
    componentName: string
  ): void {
    if (!isDev) return;

    Object.keys(nextProps).forEach((key) => {
      if (prevProps[key as keyof P] !== nextProps[key as keyof P]) {
        console.log(
          `📊 ${componentName} prop "${key}" changed:`,
          prevProps[key as keyof P],
          "→",
          nextProps[key as keyof P]
        );
      }
    });
  },

  // Memory usage tracking
  logMemoryUsage(): void {
    if (!isDev || typeof window === "undefined") return;

    const memory = (performance as any).memory;
    if (memory) {
      console.log("📈 Memory Usage:", {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      });
    }
  },
};
