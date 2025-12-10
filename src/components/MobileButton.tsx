"use client";

import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const mobileButtonVariants = cva(
  "touch-target transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-12 w-12 p-3",
      },
      touch: {
        default: "min-h-[44px] min-w-[44px]",
        enhanced: "min-h-[48px] min-w-[48px]",
        xl: "min-h-[56px] min-w-[56px]",
      },
    },
    defaultVariants: {
      size: "default",
      touch: "default",
    },
  }
);

export interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mobileButtonVariants> {
  loading?: boolean;
  ripple?: boolean;
  haptic?: boolean;
}

const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ 
    className, 
    size, 
    touch, 
    loading, 
    ripple = true, 
    haptic = true,
    children, 
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple) return;
      
      const button = event.currentTarget;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add("ripple");

      const rippleContainer = button.querySelector(".ripple-container") || button;
      rippleContainer.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    };

    const triggerHaptic = () => {
      if (!haptic || disabled) return;
      
      // Vibration API for haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      
      createRipple(event);
      triggerHaptic();
      onClick?.(event);
    };

    return (
      <Button
        className={mobileButtonVariants({ size, touch, className })}
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effect container */}
        <span className="ripple-container relative overflow-hidden">
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {children}
        </span>
      </Button>
    );
  }
);

MobileButton.displayName = "MobileButton";

export default MobileButton;