"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MobileGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  className?: string;
  disabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export default function MobileGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  onLongPress,
  threshold = 50,
  longPressDelay = 500,
  doubleTapDelay = 300,
  className = "",
  disabled = false
}: MobileGestureHandlerProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    const point = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    
    setTouchStart(point);
    setTouchEnd(point);

    // Set up long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }

    // Handle double tap
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;
    if (tapLength < doubleTapDelay && tapLength > 0) {
      e.preventDefault();
      onDoubleTap?.();
    }
    setLastTap(currentTime);
  }, [disabled, onLongPress, onDoubleTap, lastTap, longPressDelay, doubleTapDelay]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !touchStart) return;
    
    const touch = e.touches[0];
    const point = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    
    setTouchEnd(point);

    // Cancel long press if user moves finger too much
    if (longPressTimerRef.current) {
      const moveDistance = Math.sqrt(
        Math.pow(point.x - touchStart.x, 2) + Math.pow(point.y - touchStart.y, 2)
      );
      if (moveDistance > 10) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  }, [disabled, touchStart]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || !touchStart || !touchEnd) return;

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const deltaTime = touchEnd.timestamp - touchStart.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Handle swipe gestures
    if (distance > threshold && deltaTime < 1000) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    } else if (distance < 10) {
      // Handle tap
      onTap?.();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [disabled, touchStart, touchEnd, threshold, onTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Add touch feedback classes
  const touchClasses = disabled ? '' : 'touch-feedback gesture-area-xy';

  return (
    <div 
      ref={elementRef as any}
      className={`${touchClasses} ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
}

// Hook for swipeable cards
export function useSwipeableCard() {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  const [isSwipedRight, setIsSwipedRight] = useState(false);

  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    setIsSwiping(true);
  }, []);

  const handleSwipeMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const currentX = e.changedTouches[0]?.clientX || startX;
    const offset = currentX - startX;
    
    setSwipeOffset(offset);
    
    // Update swipe states
    setIsSwipedLeft(offset < -50);
    setIsSwipedRight(offset > 50);
  }, [isSwiping]);

  const handleSwipeEnd = useCallback(() => {
    setIsSwiping(false);
    
    // Reset if not swiped far enough
    if (Math.abs(swipeOffset) < 100) {
      setSwipeOffset(0);
      setIsSwipedLeft(false);
      setIsSwipedRight(false);
    }
  }, [swipeOffset]);

  const resetSwipe = useCallback(() => {
    setSwipeOffset(0);
    setIsSwipedLeft(false);
    setIsSwipedRight(false);
  }, []);

  return {
    isSwiping,
    swipeOffset,
    isSwipedLeft,
    isSwipedRight,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd,
    resetSwipe,
    transformStyle: {
      transform: `translateX(${swipeOffset}px)`,
      transition: isSwiping ? 'none' : 'transform 0.3s ease'
    }
  };
}

// Hook for pull-to-refresh functionality
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const distance = currentY - startYRef.current;
    
    // Only allow pull-to-refresh when at the top of the page
    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance, 100)); // Max pull distance of 100px
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshing) return;
    
    setIsPulling(false);
    
    if (pullDistance > 60) { // Threshold to trigger refresh
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, isRefreshing, pullDistance, onRefresh]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    pullStyle: {
      transform: `translateY(${pullDistance}px)`,
      transition: isPulling ? 'none' : 'transform 0.3s ease'
    }
  };
}