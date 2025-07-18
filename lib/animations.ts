'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from './design-system/utils';

// Core animation utilities and timing
export const animations = {
  // Timing functions - carefully calibrated for feel
  duration: {
    instant: '50ms',
    fast: '150ms',
    base: '200ms',
    moderate: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms'
  },
  
  // Easing curves for different use cases
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.095, 1.75)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },

  // Delays for staggered animations
  delay: {
    none: '0ms',
    xs: '50ms',
    sm: '100ms',
    md: '150ms',
    lg: '200ms',
    xl: '300ms'
  }
};

// Tailwind animation classes - organized by purpose
export const animationClasses = {
  // Entrance animations
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-150',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-2 duration-300',
  fadeInDown: 'animate-in fade-in slide-in-from-top-2 duration-300',
  fadeInLeft: 'animate-in fade-in slide-in-from-left-2 duration-300',
  fadeInRight: 'animate-in fade-in slide-in-from-right-2 duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-150',
  scaleInBounce: 'animate-in zoom-in-90 duration-300 ease-out',
  
  // Slide animations
  slideInRight: 'animate-in slide-in-from-right duration-300',
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideUp: 'animate-in slide-in-from-bottom duration-300',
  slideDown: 'animate-in slide-in-from-top duration-300',
  
  // Exit animations
  slideOutRight: 'animate-out slide-out-to-right duration-200',
  slideOutLeft: 'animate-out slide-out-to-left duration-200',
  slideOutUp: 'animate-out slide-out-to-top duration-200',
  slideOutDown: 'animate-out slide-out-to-bottom duration-200',
  
  // Special effects
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  bounce: 'animate-bounce',
  wiggle: 'animate-wiggle',
  
  // Loading states
  skeleton: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer',
  shimmer: 'animate-shimmer',
  
  // Interactive states
  hoverLift: 'transition-transform duration-200 hover:-translate-y-0.5',
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-lg hover:shadow-primary-500/25',
  
  // Status animations
  success: 'animate-in zoom-in-95 duration-300 ease-out',
  error: 'animate-shake',
  warning: 'animate-pulse',
  
  // Page transitions
  pageEnter: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
  pageExit: 'animate-out fade-out slide-out-to-top-4 duration-300'
};

// Stagger animation helper for child elements
export const staggerChildren = (delay: number = 50) => ({
  parent: 'transition-all',
  child: (index: number) => ({
    style: { 
      animationDelay: `${index * delay}ms`,
      animationFillMode: 'both'
    },
    className: 'animate-in fade-in slide-in-from-bottom-2 duration-300'
  })
});

// Intersection Observer hook for scroll-triggered animations
export function useScrollAnimation(threshold = 0.1, rootMargin = '0px 0px -50px 0px') {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    if (!ref) return;
    
    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          // Only trigger once, then cleanup
          observerRef.current?.unobserve(ref);
        }
      },
      { 
        threshold,
        rootMargin
      }
    );
    
    observerRef.current.observe(ref);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, threshold, rootMargin]);
  
  return { ref: setRef, isVisible };
}

// Reduced motion preference check
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// Animation state management hook
export function useAnimation(triggerDeps: unknown[] = []) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  
  const trigger = () => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    
    // Reset animation state after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  useEffect(() => {
    if (triggerDeps.length > 0) {
      trigger();
    }
  }, triggerDeps);
  
  return { isAnimating, animationKey, trigger };
}

// Hover animation hook for interactive elements
export function useHoverAnimation(config = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  
  const defaultConfig = {
    scale: 1.02,
    duration: 200,
    ease: 'ease-out'
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: reducedMotion ? {} : {
      transform: isHovered ? `scale(${finalConfig.scale})` : 'scale(1)',
      transition: `transform ${finalConfig.duration}ms ${finalConfig.ease}`
    }
  };
  
  return { isHovered, hoverProps };
}

// Focus animation hook for form elements
export function useFocusAnimation() {
  const [isFocused, setIsFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  
  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false)
  };
  
  const focusClasses = cn(
    'transition-all duration-200',
    !reducedMotion && isFocused && 'ring-4 ring-primary-500/20 border-primary-500 scale-[1.01]'
  );
  
  return { isFocused, focusProps, focusClasses };
}

// Ripple effect for buttons
export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  element: HTMLElement,
  color = 'rgba(255, 255, 255, 0.6)'
) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.backgroundColor = color;
  ripple.classList.add('ripple-effect');
  
  element.appendChild(ripple);
  
  // Cleanup after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Performance monitoring for animations
export function useAnimationPerformance() {
  const frameRate = useRef<number[]>([]);
  const lastTime = useRef(performance.now());
  
  useEffect(() => {
    let animationId: number;
    
    const measureFrame = (currentTime: number) => {
      const delta = currentTime - lastTime.current;
      const fps = 1000 / delta;
      
      frameRate.current.push(fps);
      
      // Keep only last 60 frames
      if (frameRate.current.length > 60) {
        frameRate.current.shift();
      }
      
      lastTime.current = currentTime;
      animationId = requestAnimationFrame(measureFrame);
    };
    
    animationId = requestAnimationFrame(measureFrame);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  const getAverageFPS = () => {
    if (frameRate.current.length === 0) return 60;
    const sum = frameRate.current.reduce((a, b) => a + b, 0);
    return Math.round(sum / frameRate.current.length);
  };
  
  return { getAverageFPS };
}

// Utility to conditionally apply animations based on reduced motion
export function withReducedMotion(
  normalClasses: string,
  reducedClasses: string = '',
  prefersReduced?: boolean
) {
  if (prefersReduced === undefined) {
    // If not provided, we need to use the hook
    // This is a utility, so we assume it's used within a component
    return normalClasses;
  }
  
  return prefersReduced ? reducedClasses : normalClasses;
}

// Animation sequence manager
export class AnimationSequence {
  private queue: Array<() => Promise<void>> = [];
  private isRunning = false;
  
  add(animation: () => Promise<void>) {
    this.queue.push(animation);
    return this;
  }
  
  addDelay(ms: number) {
    this.queue.push(() => new Promise(resolve => setTimeout(resolve, ms)));
    return this;
  }
  
  async play() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    for (const animation of this.queue) {
      await animation();
    }
    
    this.isRunning = false;
    this.queue = [];
  }
  
  clear() {
    this.queue = [];
    this.isRunning = false;
  }
}

// Export animation constants for use in components
export const ANIMATION_DURATIONS = animations.duration;
export const ANIMATION_EASINGS = animations.easing;
export const ANIMATION_DELAYS = animations.delay;