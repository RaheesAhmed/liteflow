import type { Metric } from "web-vitals";

// Analytics event types
export type AnalyticsEvent = {
  name: string;
  params?: Record<string, any>;
  timestamp?: number;
};

class Analytics {
  private static instance: Analytics;
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;

  private constructor() {
    // Initialize queue processing
    this.processQueue();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Initialize web vitals monitoring
  initWebVitals(): void {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.reportWebVital);
      getFID(this.reportWebVital);
      getFCP(this.reportWebVital);
      getLCP(this.reportWebVital);
      getTTFB(this.reportWebVital);
    });
  }

  // Report web vitals metrics
  private reportWebVital = (metric: Metric): void => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(metric);
    }

    // Track the metric
    this.track("web-vital", {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
    });
  };

  // Track custom events
  track(eventName: string, params?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      params,
      timestamp: Date.now(),
    };

    if (this.isInitialized) {
      this.sendEvent(event);
    } else {
      this.queue.push(event);
    }
  }

  // Process queued events
  private async processQueue(): Promise<void> {
    if (this.queue.length > 0) {
      const events = [...this.queue];
      this.queue = [];
      await Promise.all(events.map((event) => this.sendEvent(event)));
    }

    // Check queue every second
    setTimeout(() => this.processQueue(), 1000);
  }

  // Send event to analytics service
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // In development, just log to console
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics Event:", event);
        return;
      }

      // In production, send to your analytics service
      // await fetch('your-analytics-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (error) {
      console.error("Failed to send analytics event:", error);
    }
  }

  // Performance monitoring methods
  measurePageLoad(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("load", () => {
        const navigationTiming = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        const paintTiming = performance.getEntriesByType("paint");

        this.track("page-load", {
          loadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
          firstPaint: paintTiming.find(({ name }) => name === "first-paint")
            ?.startTime,
          firstContentfulPaint: paintTiming.find(
            ({ name }) => name === "first-contentful-paint"
          )?.startTime,
        });
      });
    }
  }

  // Resource timing monitoring
  measureResourceTiming(): void {
    if (typeof window !== "undefined") {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry instanceof PerformanceResourceTiming) {
            this.track("resource-timing", {
              name: entry.name,
              duration: entry.duration,
              initiatorType: entry.initiatorType,
            });
          }
        });
      });

      observer.observe({ entryTypes: ["resource"] });
    }
  }

  // Error tracking
  trackError(error: Error): void {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      type: error.name,
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();
