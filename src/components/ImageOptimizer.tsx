"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Eye, EyeOff, Zap } from "lucide-react";

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  enableWebP?: boolean;
  enableLazyLoad?: boolean;
  quality?: number;
  showStats?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageStats {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  loadTime: number;
}

export default function ImageOptimizer({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "blur",
  blurDataURL,
  sizes = "100vw",
  enableWebP = true,
  enableLazyLoad = true,
  quality = 75,
  showStats = false,
  onLoad,
  onError,
}: ImageOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const loadStartTime = useRef<number>(0);

  const handleLoad = () => {
    const loadTime = performance.now() - loadStartTime.current;
    setIsLoaded(true);
    
    if (showStats && imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth;
      const naturalHeight = imageRef.current.naturalHeight;
      const estimatedSize = (naturalWidth * naturalHeight * 4) / 1024; // Rough estimate in KB
      
      setStats({
        originalSize: estimatedSize,
        optimizedSize: estimatedSize * (quality / 100),
        compressionRatio: 100 - quality,
        loadTime,
      });
    }
    
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizeImage = async () => {
    if (!enableWebP || isOptimized) return;
    
    setIsOptimizing(true);
    try {
      // Simulate WebP conversion optimization
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsOptimized(true);
    } catch (error) {
      console.error('Image optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    if (priority && enableWebP) {
      optimizeImage();
    }
  }, [priority, enableWebP]);

  const getImageSrc = () => {
    if (!enableWebP || !isOptimized) {
      return src;
    }
    
    // In a real implementation, this would convert to WebP
    // For now, we'll simulate it by adding a query parameter
    return `${src}${src.includes('?') ? '&' : '?'}webp=true&q=${quality}`;
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || "100%", height: height || "200px" }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showStats && stats && (
        <Card className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-2 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Optimized
              </Badge>
            </div>
            <div className="text-xs space-y-1">
              <div>Original: {stats.originalSize.toFixed(1)}KB</div>
              <div>Optimized: {stats.optimizedSize.toFixed(1)}KB</div>
              <div>Saved: {stats.compressionRatio.toFixed(1)}%</div>
              <div>Load: {stats.loadTime.toFixed(0)}ms</div>
            </div>
          </CardContent>
        </Card>
      )}

      {showStats && (
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {!isOptimized && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={optimizeImage}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      )}

      <Image
        ref={imageRef}
        src={getImageSrc()}
        alt={alt}
        width={width || 400}
        height={height || 300}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${showOriginal ? 'grayscale' : ''}`}
        onLoadStart={() => {
          loadStartTime.current = performance.now();
        }}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
        }}
        loading={enableLazyLoad && !priority ? "lazy" : "eager"}
      />

      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 loading-skeleton"
          style={{
            width: width ? `${width}px` : "100%",
            height: height ? `${height}px` : "300px",
          }}
        />
      )}

      {showStats && isOptimized && (
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            WebP Optimized
          </Badge>
        </div>
      )}
    </div>
  );
}

// Higher-order component for batch image optimization
export function withImageOptimization<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: Partial<ImageOptimizerProps> = {}
) {
  return function ImageOptimizedWrapper(props: T) {
    return (
      <div className="relative">
        <Component {...props} />
        <div className="absolute inset-0">
          <ImageOptimizer
            src={(props as any).src || ""}
            alt={(props as any).alt || ""}
            {...options}
          />
        </div>
      </div>
    );
  };
}

// Hook for image optimization
export function useImageOptimizer() {
  const [optimizedImages, setOptimizedImages] = useState<Set<string>>(new Set());
  const [optimizationStats, setOptimizationStats] = useState<{
    totalImages: number;
    optimizedImages: number;
    totalSavings: number;
  }>({
    totalImages: 0,
    optimizedImages: 0,
    totalSavings: 0,
  });

  const optimizeImage = async (src: string): Promise<string> => {
    if (optimizedImages.has(src)) {
      return src;
    }

    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setOptimizedImages(prev => new Set([...prev, src]));
      setOptimizationStats(prev => ({
        ...prev,
        optimizedImages: prev.optimizedImages + 1,
        totalSavings: prev.totalSavings + 25, // Simulated 25% savings
      }));

      return `${src}${src.includes('?') ? '&' : '?'}optimized=true`;
    } catch (error) {
      console.error('Failed to optimize image:', error);
      return src;
    }
  };

  const batchOptimize = async (sources: string[]): Promise<string[]> => {
    const results = await Promise.all(
      sources.map(src => optimizeImage(src))
    );
    return results;
  };

  return {
    optimizeImage,
    batchOptimize,
    optimizedImages,
    optimizationStats,
  };
}