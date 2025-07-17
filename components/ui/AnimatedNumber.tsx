'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion, useAnimation } from '@/lib/animations';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatAs?: 'currency' | 'percentage' | 'number' | 'compact';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  delay?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce';
  triggerAnimation?: boolean;
  onAnimationComplete?: () => void;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  formatAs = 'number',
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  delay = 0,
  easing = 'easeOut',
  triggerAnimation = true,
  onAnimationComplete
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(0);
  const hasAnimatedRef = useRef(false);
  
  const reducedMotion = useReducedMotion();
  const { animationKey } = useAnimation([value]);

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    bounce: (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    }
  };

  // Format number based on formatAs prop
  const formatNumber = (num: number): string => {
    const roundedNum = Number(num.toFixed(decimals));
    
    switch (formatAs) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(roundedNum);
        
      case 'percentage':
        return `${roundedNum.toFixed(decimals)}%`;
        
      case 'compact':
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: decimals,
        }).format(roundedNum);
        
      case 'number':
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(roundedNum);
    }
  };

  // Animation frame function
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp + delay;
      startValueRef.current = displayValue;
    }

    const elapsed = timestamp - startTimeRef.current;
    
    if (elapsed < 0) {
      frameRef.current = requestAnimationFrame(animate);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    
    const currentValue = startValueRef.current + (value - startValueRef.current) * easedProgress;
    setDisplayValue(currentValue);

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      onAnimationComplete?.();
    }
  };

  // Start animation
  const startAnimation = () => {
    if (reducedMotion || !triggerAnimation) {
      setDisplayValue(value);
      onAnimationComplete?.();
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = performance.now();
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    frameRef.current = requestAnimationFrame(animate);
  };

  // Effect to trigger animation when value changes
  useEffect(() => {
    if (value !== displayValue && (triggerAnimation || !hasAnimatedRef.current)) {
      startAnimation();
      hasAnimatedRef.current = true;
    }
  }, [value, triggerAnimation]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Reset animation state when animationKey changes
  useEffect(() => {
    if (animationKey > 0) {
      hasAnimatedRef.current = false;
    }
  }, [animationKey]);

  const formattedValue = formatNumber(displayValue);

  return (
    <span 
      className={cn(
        'inline-block tabular-nums',
        // Animation classes
        !reducedMotion && isAnimating && 'animate-increment',
        // Custom styling
        className
      )}
      role="text"
      aria-live="polite"
      aria-label={`${prefix}${formattedValue}${suffix}`}
    >
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

// Wrapper component for common use cases
export const AnimatedCurrency: React.FC<Omit<AnimatedNumberProps, 'formatAs'>> = (props) => (
  <AnimatedNumber {...props} formatAs="currency" />
);

export const AnimatedPercentage: React.FC<Omit<AnimatedNumberProps, 'formatAs' | 'suffix'>> = (props) => (
  <AnimatedNumber {...props} formatAs="percentage" />
);

export const AnimatedCompactNumber: React.FC<Omit<AnimatedNumberProps, 'formatAs'>> = (props) => (
  <AnimatedNumber {...props} formatAs="compact" />
);

// Hook for programmatic animation control
export const useAnimatedNumber = (initialValue: number = 0) => {
  const [value, setValue] = useState(initialValue);
  
  const animateTo = (targetValue: number) => {
    setValue(targetValue);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    setValue: animateTo,
    reset,
    isAnimating
  };
};

// Counter component with increment/decrement animations
interface AnimatedCounterProps extends Omit<AnimatedNumberProps, 'value'> {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  onValueChange?: (value: number) => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  initialValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  showControls = true,
  onValueChange,
  ...animatedNumberProps
}) => {
  const [value, setValue] = useState(initialValue);
  
  const increment = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onValueChange?.(newValue);
  };
  
  const decrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      {showControls && (
        <button
          onClick={decrement}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150"
          aria-label="Decrease"
        >
          −
        </button>
      )}
      
      <AnimatedNumber 
        value={value} 
        {...animatedNumberProps}
        className={cn(
          'font-semibold text-lg min-w-[3rem] text-center',
          animatedNumberProps.className
        )}
      />
      
      {showControls && (
        <button
          onClick={increment}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150"
          aria-label="Increase"
        >
          +
        </button>
      )}
    </div>
  );
};

export default AnimatedNumber;
export type { AnimatedNumberProps, AnimatedCounterProps };