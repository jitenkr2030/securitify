"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DynamicComponentProps {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorComponent?: React.ReactNode;
  props?: any;
}

export default function DynamicComponent({
  loader,
  fallback,
  errorComponent,
  props = {},
}: DynamicComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        const loadedModule = await loader();
        if (isMounted) {
          setComponent(() => loadedModule.default);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load component");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [loader]);

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading component...</p>
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      errorComponent || (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-semibold">Failed to load component</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      )
    );
  }

  if (!Component) {
    return null;
  }

  return <Component {...props} />;
}

// Higher-order component for dynamic loading
export function withDynamicLoading<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function DynamicWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}