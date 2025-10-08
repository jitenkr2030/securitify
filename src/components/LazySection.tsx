"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LazySectionProps {
  children: ReactNode;
  id?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
  placeholder?: ReactNode;
  onLoad?: () => void;
}

export default function LazySection({
  children,
  id,
  threshold = 0.1,
  rootMargin = "100px",
  className = "",
  minHeight = "400px",
  placeholder,
  onLoad
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Simulate loading time for better UX
          setTimeout(() => {
            setIsLoaded(true);
            onLoad?.();
          }, 300);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, isVisible, onLoad]);

  if (!isVisible) {
    return (
      <div 
        ref={ref}
        id={id}
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ minHeight }}
      >
        {placeholder || (
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-gray-600">Loading section...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      id={id}
      className={`transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Component for lazy loading multiple sections with staggered animation
interface LazySectionsProps {
  sections: Array<{
    id: string;
    children: ReactNode;
    className?: string;
    minHeight?: string;
  }>;
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
}

export function LazySections({
  sections,
  threshold = 0.1,
  rootMargin = "100px",
  staggerDelay = 200
}: LazySectionsProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSections(prev => new Set([...prev, section.id]));
            }, sections.indexOf(section) * staggerDelay);
            observer.unobserve(element);
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sections, threshold, rootMargin, staggerDelay]);

  return (
    <>
      {sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className={`transition-all duration-700 ${
            visibleSections.has(section.id)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          } ${section.className}`}
          style={{ minHeight: section.minHeight }}
        >
          {section.children}
        </div>
      ))}
    </>
  );
}