import { useEffect } from 'react'

export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function usePerformanceMonitoring(onMetrics: (metrics: PerformanceMetrics) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstPaint = entries[0]
      if (firstPaint) {
        onMetrics((prev) => ({ ...prev, fcp: firstPaint.startTime }))
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        onMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }))
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstInput = entries[0]
      if (firstInput) {
        onMetrics((prev) => ({ ...prev, fid: firstInput.processingStart - firstInput.startTime }))
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsScore = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value
        }
      }
      onMetrics((prev) => ({ ...prev, cls: clsScore }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      onMetrics((prev) => ({ ...prev, ttfb }))
    }

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [onMetrics])
}

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  fcp: {
    good: 1800,
    poor: 3000
  },
  lcp: {
    good: 2500,
    poor: 4000
  },
  fid: {
    good: 100,
    poor: 300
  },
  cls: {
    good: 0.1,
    poor: 0.25
  },
  ttfb: {
    good: 800,
    poor: 1800
  }
}

// Helper to check if metrics meet thresholds
export function checkPerformance(metrics: PerformanceMetrics) {
  return {
    fcp: metrics.fcp < PERFORMANCE_THRESHOLDS.fcp.good ? 'good' : 
         metrics.fcp < PERFORMANCE_THRESHOLDS.fcp.poor ? 'needs-improvement' : 'poor',
    lcp: metrics.lcp < PERFORMANCE_THRESHOLDS.lcp.good ? 'good' : 
         metrics.lcp < PERFORMANCE_THRESHOLDS.lcp.poor ? 'needs-improvement' : 'poor',
    fid: metrics.fid < PERFORMANCE_THRESHOLDS.fid.good ? 'good' : 
         metrics.fid < PERFORMANCE_THRESHOLDS.fid.poor ? 'needs-improvement' : 'poor',
    cls: metrics.cls < PERFORMANCE_THRESHOLDS.cls.good ? 'good' : 
         metrics.cls < PERFORMANCE_THRESHOLDS.cls.poor ? 'needs-improvement' : 'poor',
    ttfb: metrics.ttfb < PERFORMANCE_THRESHOLDS.ttfb.good ? 'good' : 
          metrics.ttfb < PERFORMANCE_THRESHOLDS.ttfb.poor ? 'needs-improvement' : 'poor'
  }
}

// Log performance metrics to console in development
export function logPerformance(metrics: PerformanceMetrics) {
  if (process.env.NODE_ENV === 'development') {
    const results = checkPerformance(metrics)
    console.group('Performance Metrics')
    console.log('First Contentful Paint:', metrics.fcp.toFixed(2), 'ms -', results.fcp)
    console.log('Largest Contentful Paint:', metrics.lcp.toFixed(2), 'ms -', results.lcp)
    console.log('First Input Delay:', metrics.fid.toFixed(2), 'ms -', results.fid)
    console.log('Cumulative Layout Shift:', metrics.cls.toFixed(3), '-', results.cls)
    console.log('Time to First Byte:', metrics.ttfb.toFixed(2), 'ms -', results.ttfb)
    console.groupEnd()
  }
} 