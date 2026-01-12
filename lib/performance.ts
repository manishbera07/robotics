// Performance monitoring utilities

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Log to console in development
    console.log(metric)
    
    // You can send to analytics service here
    // Example: analytics.track(metric.name, metric.value)
  }
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${componentName}-start`)
    
    return () => {
      performance.mark(`${componentName}-end`)
      performance.measure(
        componentName,
        `${componentName}-start`,
        `${componentName}-end`
      )
      
      const measure = performance.getEntriesByName(componentName)[0]
      if (measure && process.env.NODE_ENV === 'development') {
        console.log(`${componentName} rendered in ${measure.duration.toFixed(2)}ms`)
      }
      
      // Cleanup
      performance.clearMarks(`${componentName}-start`)
      performance.clearMarks(`${componentName}-end`)
      performance.clearMeasures(componentName)
    }
  }
  
  return () => {}
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Request idle callback with fallback
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(cb, 1)

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id)
