'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useReducedMotion, animationClasses } from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transition?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  duration?: 'fast' | 'base' | 'slow';
  delay?: number;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

interface TransitionConfig {
  enter: string;
  exit: string;
  duration: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  transition = 'fade',
  duration = 'base',
  delay = 0,
  loading = false,
  loadingComponent
}) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);
  const reducedMotion = useReducedMotion();

  // Duration mapping
  const durationMap = {
    fast: 'duration-200',
    base: 'duration-300',
    slow: 'duration-500'
  };

  // Transition configurations
  const transitions: Record<string, TransitionConfig> = {
    fade: {
      enter: 'animate-in fade-in',
      exit: 'animate-out fade-out',
      duration: durationMap[duration]
    },
    slide: {
      enter: 'animate-in slide-in-from-right',
      exit: 'animate-out slide-out-to-left',
      duration: durationMap[duration]
    },
    scale: {
      enter: 'animate-in zoom-in-95',
      exit: 'animate-out zoom-out-95',
      duration: durationMap[duration]
    },
    slideUp: {
      enter: 'animate-in slide-in-from-bottom-4',
      exit: 'animate-out slide-out-to-top-4',
      duration: durationMap[duration]
    },
    slideDown: {
      enter: 'animate-in slide-in-from-top-4',
      exit: 'animate-out slide-out-to-bottom-4',
      duration: durationMap[duration]
    },
    slideLeft: {
      enter: 'animate-in slide-in-from-right-4',
      exit: 'animate-out slide-out-to-left-4',
      duration: durationMap[duration]
    },
    slideRight: {
      enter: 'animate-in slide-in-from-left-4',
      exit: 'animate-out slide-out-to-right-4',
      duration: durationMap[duration]
    }
  };

  const currentTransition = transitions[transition];

  // Handle path changes
  useEffect(() => {
    if (pathname !== currentPath && !reducedMotion) {
      setIsExiting(true);
      
      // Wait for exit animation to complete
      const exitTimeout = setTimeout(() => {
        setCurrentPath(pathname);
        setIsExiting(false);
        setIsVisible(false);
        
        // Trigger enter animation
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 300); // Match with animation duration

      return () => clearTimeout(exitTimeout);
    } else {
      setCurrentPath(pathname);
      setIsVisible(true);
      return undefined;
    }
  }, [pathname, currentPath, reducedMotion]);

  // Initial load
  useEffect(() => {
    if (!reducedMotion) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      return undefined;
    }
  }, [delay, reducedMotion]);

  // Base classes for the container
  const containerClasses = cn(
    'w-full h-full',
    // Animation classes (only if motion is enabled)
    !reducedMotion && isVisible && !isExiting && currentTransition?.enter,
    !reducedMotion && isExiting && currentTransition?.exit,
    !reducedMotion && currentTransition?.duration,
    // Static classes for reduced motion
    reducedMotion && 'opacity-100',
    className
  );

  // Show loading state
  if (loading) {
    return (
      <div className={cn(
        'w-full h-full flex items-center justify-center',
        !reducedMotion && animationClasses.fadeIn,
        className
      )}>
        {loadingComponent || (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Don't render content during exit animation or if not visible
  if (!reducedMotion && (isExiting || !isVisible)) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Specialized transition components for common patterns
export const FadeTransition: React.FC<Omit<PageTransitionProps, 'transition'>> = (props) => (
  <PageTransition {...props} transition="fade" />
);

export const SlideTransition: React.FC<Omit<PageTransitionProps, 'transition'>> = (props) => (
  <PageTransition {...props} transition="slide" />
);

export const ScaleTransition: React.FC<Omit<PageTransitionProps, 'transition'>> = (props) => (
  <PageTransition {...props} transition="scale" />
);

// Route-based transition hook
export const usePageTransition = (options?: Partial<PageTransitionProps>) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!reducedMotion) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, options?.duration === 'fast' ? 200 : options?.duration === 'slow' ? 500 : 300);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pathname, reducedMotion, options?.duration]);

  return { isTransitioning, pathname };
};

// Layout transition wrapper for consistent page animations
interface LayoutTransitionProps {
  children: ReactNode;
  className?: string;
}

export const LayoutTransition: React.FC<LayoutTransitionProps> = ({ 
  children, 
  className 
}) => {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <div 
      key={pathname}
      className={cn(
        'w-full',
        !reducedMotion && animationClasses.pageEnter,
        className
      )}
    >
      {children}
    </div>
  );
};

// Staggered children animation for lists and grids
interface StaggeredTransitionProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}

export const StaggeredTransition: React.FC<StaggeredTransitionProps> = ({
  children,
  staggerDelay = 100,
  className,
  as: Component = 'div'
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <Component className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            !reducedMotion && animationClasses.fadeInUp,
          )}
          style={
            !reducedMotion ? {
              animationDelay: `${index * staggerDelay}ms`,
              animationFillMode: 'both'
            } : undefined
          }
        >
          {child}
        </div>
      ))}
    </Component>
  );
};

// Modal/Dialog transition
interface ModalTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  children,
  onClose,
  className,
  overlayClassName,
  closeOnOverlayClick = true
}) => {
  const reducedMotion = useReducedMotion();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        !reducedMotion && animationClasses.fadeIn,
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto',
          !reducedMotion && animationClasses.scaleInBounce,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
export type { PageTransitionProps, LayoutTransitionProps, StaggeredTransitionProps, ModalTransitionProps };