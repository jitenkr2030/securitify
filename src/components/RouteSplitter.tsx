"use client";

import { useState, useEffect, useRef, Suspense, ComponentType, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface RouteSplitterProps {
  children: ReactNode;
  fallback?: React.ReactNode;
  errorComponent?: React.ReactNode;
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
}

interface LazyComponentProps {
  component: ComponentType<any>;
  props: any;
  fallback: ReactNode;
}

function LazyComponent({ component: Component, props, fallback }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

export default function RouteSplitter({
  children,
  fallback,
  errorComponent,
  preloadOnHover = true,
  preloadOnVisible = true
}: RouteSplitterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading content...</p>
      </div>
    </div>
  );

  const defaultErrorComponent = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center text-red-600">
        <p className="font-semibold">Failed to load content</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );

  const handleMouseEnter = () => {
    if (preloadOnHover && !isLoading && !hasError) {
      setIsLoading(true);
      // Simulate preloading
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return errorComponent || defaultErrorComponent;
  }

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onError={handleError}
      className="route-splitter"
    >
      {isLoading ? (fallback || defaultFallback) : children}
    </div>
  );
}

// Higher-order component for route-based code splitting
export function withRouteSplitting<P extends object>(
  Component: ComponentType<P>,
  options: {
    preloadOnHover?: boolean;
    preloadOnVisible?: boolean;
    fallback?: ReactNode;
    errorComponent?: ReactNode;
  } = {}
) {
  const {
    preloadOnHover = true,
    preloadOnVisible = true,
    fallback,
    errorComponent
  } = options;

  return function RouteSplitWrapper(props: P) {
    return (
      <RouteSplitter
        preloadOnHover={preloadOnHover}
        preloadOnVisible={preloadOnVisible}
        fallback={fallback}
        errorComponent={errorComponent}
      >
        <Component {...props} />
      </RouteSplitter>
    );
  };
}

// Component for lazy loading route segments
interface LazyRouteSegmentProps {
  importFn: () => Promise<{ default: ComponentType<any> }>;
  props?: any;
  fallback?: ReactNode;
  errorComponent?: ReactNode;
  trigger?: 'hover' | 'visible' | 'immediate';
  delay?: number;
}

export function LazyRouteSegment({
  importFn,
  props = {},
  fallback,
  errorComponent,
  trigger = 'visible',
  delay = 0
}: LazyRouteSegmentProps) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(trigger === 'immediate');
  const ref = useRef<HTMLDivElement>(null);

  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading segment...</p>
      </div>
    </div>
  );

  const defaultErrorComponent = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center text-red-600">
        <p className="font-semibold">Failed to load segment</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (shouldLoad && !Component && !isLoading && !hasError) {
      setIsLoading(true);
      
      const loadComponent = async () => {
        try {
          const loadedModule = await importFn();
          setComponent(() => loadedModule.default);
          setHasError(false);
        } catch (error) {
          console.error('Failed to load lazy component:', error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };

      if (delay > 0) {
        setTimeout(loadComponent, delay);
      } else {
        loadComponent();
      }
    }
  }, [shouldLoad, Component, isLoading, hasError, importFn, delay]);

  useEffect(() => {
    if (trigger === 'visible' && ref.current && !shouldLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [trigger, shouldLoad]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !shouldLoad) {
      setShouldLoad(true);
    }
  };

  if (hasError) {
    return errorComponent || defaultErrorComponent;
  }

  if (isLoading) {
    return fallback || defaultFallback;
  }

  if (!Component) {
    return (
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        className="lazy-route-segment"
      >
        {fallback || defaultFallback}
      </div>
    );
  }

  return <Component {...props} />;
}

// Component for chunk-based loading
interface ChunkLoaderProps {
  chunkName: string;
  children: ReactNode;
  fallback?: ReactNode;
  errorComponent?: ReactNode;
}

export function ChunkLoader({
  chunkName,
  children,
  fallback,
  errorComponent
}: ChunkLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if chunk is already loaded
    if ((window as any)[`__chunkLoaded_${chunkName}`]) {
      setIsLoaded(true);
      return;
    }

    // Simulate chunk loading
    const loadChunk = async () => {
      try {
        // In a real implementation, this would dynamically import the chunk
        await new Promise(resolve => setTimeout(resolve, 100));
        (window as any)[`__chunkLoaded_${chunkName}`] = true;
        setIsLoaded(true);
        setHasError(false);
      } catch (error) {
        console.error(`Failed to load chunk ${chunkName}:`, error);
        setHasError(true);
      }
    };

    loadChunk();
  }, [chunkName]);

  const defaultFallback = (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  const defaultErrorComponent = (
    <div className="text-red-600 text-sm p-4">
      Failed to load required resources
    </div>
  );

  if (hasError) {
    return errorComponent || defaultErrorComponent;
  }

  if (!isLoaded) {
    return fallback || defaultFallback;
  }

  return <>{children}</>;
}