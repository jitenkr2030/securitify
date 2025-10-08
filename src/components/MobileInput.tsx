"use client";

import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const mobileInputVariants = cva(
  "touch-target transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  {
    variants: {
      size: {
        default: "h-12 px-4 py-3 text-base",
        sm: "h-10 px-3 py-2 text-sm",
        lg: "h-14 px-5 py-4 text-lg",
      },
      touch: {
        default: "min-h-[44px]",
        enhanced: "min-h-[48px]",
        xl: "min-h-[56px]",
      },
    },
    defaultVariants: {
      size: "default",
      touch: "default",
    },
  }
);

export interface MobileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof mobileInputVariants> {
  clearable?: boolean;
  showPasswordToggle?: boolean;
  haptic?: boolean;
  error?: string;
  label?: string;
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    className, 
    size, 
    touch, 
    type = "text",
    clearable = false,
    showPasswordToggle = false,
    haptic = true,
    error,
    label,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const triggerHaptic = () => {
      if (!haptic) return;
      
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      triggerHaptic();
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      triggerHaptic();
    };

    const togglePassword = () => {
      setShowPassword(!showPassword);
      triggerHaptic();
    };

    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password") 
      : type;

    const hasValue = value && value.toString().length > 0;

    return (
      <div className="relative">
        {label && (
          <label 
            className={`block text-sm font-medium mb-2 transition-colors ${
              error ? "text-red-600" : isFocused ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              ${mobileInputVariants({ size, touch, className })}
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${clearable || showPasswordToggle ? "pr-12" : ""}
            `}
            {...props}
          />
          
          {/* Clear button */}
          {clearable && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-target h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Password toggle */}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-target h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

export default MobileInput;