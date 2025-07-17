'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion, createRipple } from '@/lib/animations';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconSize?: number;
  fullWidth?: boolean;
  gradient?: boolean;
  pulse?: boolean;
  ripple?: boolean;
  glow?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconSize,
  fullWidth = false,
  gradient = false,
  pulse = false,
  ripple = true,
  glow = false,
  className,
  disabled,
  children,
  onClick,
  ...props
}, ref) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  // Enhanced click handler with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current || (ref as React.RefObject<HTMLButtonElement>)?.current;
    
    // Create ripple effect if enabled and motion is allowed
    if (ripple && !reducedMotion && button && !disabled && !isLoading) {
      const rippleColor = variant === 'primary' ? 'rgba(255, 255, 255, 0.6)' :
                         variant === 'secondary' ? 'rgba(0, 0, 0, 0.1)' :
                         variant === 'ghost' ? 'rgba(59, 130, 246, 0.2)' :
                         'rgba(255, 255, 255, 0.6)';
      
      createRipple(e, button, rippleColor);
    }
    
    // Call original onClick handler
    onClick?.(e);
  };

  // Base styles for all buttons
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Enhanced micro-interactions
    !reducedMotion && 'active:scale-95 hover:scale-[1.02]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'relative overflow-hidden',
    // Ripple container
    ripple && 'ripple-container',
    fullWidth && 'w-full',
    // Glow effect for special buttons
    glow && !reducedMotion && 'animate-glow',
    // Smooth transform origin
    'transform-gpu'
  );

  // Size variants with precise measurements
  const sizeVariants = {
    sm: {
      height: 'h-8', // 32px
      padding: 'px-3', // 12px
      text: 'text-sm',
      iconSize: 16,
    },
    md: {
      height: 'h-10', // 40px
      padding: 'px-4', // 16px
      text: 'text-base',
      iconSize: 18,
    },
    lg: {
      height: 'h-12', // 48px
      padding: 'px-6', // 24px
      text: 'text-lg',
      iconSize: 20,
    },
    xl: {
      height: 'h-14', // 56px
      padding: 'px-8', // 32px
      text: 'text-xl',
      iconSize: 24,
    },
  };

  // Style variants with enhanced micro-interactions
  const styleVariants = {
    primary: cn(
      gradient 
        ? 'bg-gradient-to-r from-primary-600 to-primary-700' 
        : 'bg-primary-600 hover:bg-primary-700',
      'text-white',
      'focus:ring-primary-500',
      // Enhanced hover states
      !reducedMotion && 'hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5',
      // Smooth transitions
      'transition-all duration-200 ease-out',
      pulse && gradient && !reducedMotion && 'animate-pulse',
      // Disabled state
      'disabled:bg-primary-300 disabled:shadow-none disabled:transform-none disabled:hover:translate-y-0'
    ),
    secondary: cn(
      'bg-gray-100 hover:bg-gray-200 text-gray-900',
      'border border-gray-200',
      'focus:ring-gray-500',
      'shadow-sm hover:shadow-md',
      // Enhanced hover states
      !reducedMotion && 'hover:shadow-lg hover:shadow-gray-500/10 hover:-translate-y-0.5',
      // Smooth transitions
      'transition-all duration-200 ease-out',
      // Disabled state
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none disabled:transform-none disabled:hover:translate-y-0'
    ),
    ghost: cn(
      'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900',
      'focus:ring-gray-500',
      'hover:shadow-sm',
      // Enhanced hover states
      !reducedMotion && 'hover:shadow-md hover:shadow-gray-500/10 hover:-translate-y-0.5',
      // Smooth transitions
      'transition-all duration-200 ease-out',
      // Disabled state
      'disabled:bg-transparent disabled:text-gray-400 disabled:shadow-none disabled:transform-none disabled:hover:translate-y-0'
    ),
    danger: cn(
      'bg-red-600 hover:bg-red-700 text-white',
      'focus:ring-red-500',
      // Enhanced hover states
      !reducedMotion && 'hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5',
      // Smooth transitions
      'transition-all duration-200 ease-out',
      // Disabled state
      'disabled:bg-red-300 disabled:shadow-none disabled:transform-none disabled:hover:translate-y-0'
    ),
    success: cn(
      'bg-green-600 hover:bg-green-700 text-white',
      'focus:ring-green-500',
      // Enhanced hover states
      !reducedMotion && 'hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5',
      // Smooth transitions
      'transition-all duration-200 ease-out',
      // Disabled state
      'disabled:bg-green-300 disabled:shadow-none disabled:transform-none disabled:hover:translate-y-0'
    ),
  };

  const sizeConfig = sizeVariants[size];
  const actualIconSize = iconSize || sizeConfig.iconSize;

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin"
      width={actualIconSize}
      height={actualIconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );

  // Apply reduced motion preferences
  const motionClasses = cn(
    'motion-safe:transition-all motion-safe:duration-200',
    'motion-safe:hover:-translate-y-0.5',
    'motion-safe:active:scale-95',
    'motion-reduce:transition-none motion-reduce:hover:transform-none'
  );

  const buttonClasses = cn(
    baseStyles,
    sizeConfig.height,
    sizeConfig.padding,
    sizeConfig.text,
    styleVariants[variant],
    motionClasses,
    // Border radius
    'rounded-lg',
    className
  );

  const buttonContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingSpinner />
          {loadingText && <span>{loadingText}</span>}
        </>
      );
    }

    return (
      <>
        {LeftIcon && (
          <LeftIcon 
            size={actualIconSize}
            className="transition-colors duration-200"
          />
        )}
        <span>{children}</span>
        {RightIcon && (
          <RightIcon 
            size={actualIconSize}
            className="transition-colors duration-200"
          />
        )}
      </>
    );
  };

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-label={isLoading ? loadingText || 'Loading...' : undefined}
      aria-busy={isLoading}
      {...props}
      onClick={handleClick}
    >
      {buttonContent()}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, type ButtonProps };