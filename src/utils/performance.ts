import React from "react";
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility for expensive calculations
export const memoize = <Args extends any[], Return>(
  fn: (...args: Args) => Return,
  getKey?: (...args: Args) => string,
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// React performance utilities
export const createStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T => {
  return React.useCallback(callback, deps);
};

export const createMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList,
): T => {
  return React.useMemo(factory, deps);
};

// Image optimization utilities
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  height?: number,
  quality: number = 75,
): string => {
  // This would integrate with your image optimization service
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  });
  
  if (height) {
    params.set('h', height.toString());
  }
  
  return `/api/image-proxy?${params.toString()}`;
};

// Bundle size optimization - dynamic imports
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
): React.LazyExoticComponent<T> => {
  const LazyComponent = React.lazy(importFunc);
  
  if (fallback) {
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
      <React.Suspense fallback={React.createElement(fallback)}>
        <LazyComponent {...props} ref={ref} />
      </React.Suspense>
    )) as React.LazyExoticComponent<T>;
  }
  
  return LazyComponent;
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  
  static mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
      this.marks.set(name, Date.now());
    }
  }
  
  static measure(startMark: string, endMark: string): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(`${startMark}-to-${endMark}`, startMark, endMark);
        const entries = window.performance.getEntriesByName(`${startMark}-to-${endMark}`);
        return entries[entries.length - 1]?.duration || null;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    
    const startTime = this.marks.get(startMark);
    const endTime = this.marks.get(endMark);
    
    if (startTime && endTime) {
      return endTime - startTime;
    }
    
    return null;
  }
  
  static clearMarks(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
    }
    this.marks.clear();
  }
}

// React component performance utilities
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
) => {
  return React.memo(
    React.forwardRef<any, P>((props, ref) => {
      React.useEffect(() => {
        PerformanceMonitor.mark(`${componentName}-mount-start`);
        
        return () => {
          PerformanceMonitor.mark(`${componentName}-unmount`);
          const mountTime = PerformanceMonitor.measure(
            `${componentName}-mount-start`,
            `${componentName}-unmount`
          );
          
          if (mountTime && process.env.NODE_ENV === 'development') {
            console.log(`${componentName} was mounted for ${mountTime}ms`);
          }
        };
      }, []);
      
      return <Component {...props} ref={ref} />;
    }),
  );
};

// Memory leak prevention
export const useCleanup = (cleanup: () => void) => {
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);
};

// Efficient re-renders prevention
export const arePropsEqual = <P extends Record<string, any>>(
  prevProps: P,
  nextProps: P,
  keys?: (keyof P)[],
): boolean => {
  const keysToCompare = keys || Object.keys(nextProps) as (keyof P)[];
  
  return keysToCompare.every(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];
    
    // Deep comparison for objects and arrays
    if (typeof prevValue === 'object' && typeof nextValue === 'object') {
      return JSON.stringify(prevValue) === JSON.stringify(nextValue);
    }
    
    return prevValue === nextValue;
  });
};