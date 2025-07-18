'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion, useScrollAnimation } from '@/lib/animations';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 
             'scaleIn' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' |
             'rotateIn' | 'flipIn' | 'bounceIn' | 'elasticIn';
  duration?: 'fast' | 'base' | 'slow';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  disabled?: boolean;
  onReveal?: () => void;
  onHide?: () => void;
}

interface AnimationConfig {
  initial: string;
  animate: string;
  duration: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeInUp',
  duration = 'base',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  className,
  disabled = false,
  onReveal,
  onHide
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref, isVisible } = useScrollAnimation(threshold, rootMargin);

  // Duration mapping
  const durationMap = {
    fast: 'duration-200',
    base: 'duration-500',
    slow: 'duration-700'
  };

  // Animation configurations
  const animations: Record<string, AnimationConfig> = {
    fadeIn: {
      initial: 'opacity-0',
      animate: 'animate-in fade-in',
      duration: durationMap[duration]
    },
    fadeInUp: {
      initial: 'opacity-0 translate-y-8',
      animate: 'animate-in fade-in slide-in-from-bottom-4',
      duration: durationMap[duration]
    },
    fadeInDown: {
      initial: 'opacity-0 -translate-y-8',
      animate: 'animate-in fade-in slide-in-from-top-4',
      duration: durationMap[duration]
    },
    fadeInLeft: {
      initial: 'opacity-0 -translate-x-8',
      animate: 'animate-in fade-in slide-in-from-left-4',
      duration: durationMap[duration]
    },
    fadeInRight: {
      initial: 'opacity-0 translate-x-8',
      animate: 'animate-in fade-in slide-in-from-right-4',
      duration: durationMap[duration]
    },
    scaleIn: {
      initial: 'opacity-0 scale-95',
      animate: 'animate-in fade-in zoom-in-95',
      duration: durationMap[duration]
    },
    slideInUp: {
      initial: 'translate-y-full',
      animate: 'animate-in slide-in-from-bottom',
      duration: durationMap[duration]
    },
    slideInDown: {
      initial: '-translate-y-full',
      animate: 'animate-in slide-in-from-top',
      duration: durationMap[duration]
    },
    slideInLeft: {
      initial: '-translate-x-full',
      animate: 'animate-in slide-in-from-left',
      duration: durationMap[duration]
    },
    slideInRight: {
      initial: 'translate-x-full',
      animate: 'animate-in slide-in-from-right',
      duration: durationMap[duration]
    },
    rotateIn: {
      initial: 'opacity-0 rotate-180 scale-50',
      animate: 'animate-in fade-in spin-in zoom-in-50',
      duration: durationMap[duration]
    },
    flipIn: {
      initial: 'opacity-0 scale-x-0',
      animate: 'animate-in fade-in zoom-in-x-0',
      duration: durationMap[duration]
    },
    bounceIn: {
      initial: 'opacity-0 scale-50',
      animate: 'animate-bounceIn',
      duration: durationMap[duration]
    },
    elasticIn: {
      initial: 'opacity-0 scale-50',
      animate: 'animate-elasticScale',
      duration: durationMap[duration]
    }
  };

  const config = animations[animation];

  // Handle visibility changes
  useEffect(() => {
    if (disabled || reducedMotion) {
      setIsRevealed(true);
      return undefined;
    }

    if (isVisible && (!triggerOnce || !hasAnimated)) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
        setHasAnimated(true);
        onReveal?.();
      }, delay);

      return () => clearTimeout(timer);
    } else if (!isVisible && !triggerOnce && hasAnimated) {
      setIsRevealed(false);
      onHide?.();
    }
    
    return undefined;
  }, [isVisible, hasAnimated, triggerOnce, delay, disabled, reducedMotion, onReveal, onHide]);

  // Combined classes
  const elementClasses = cn(
    // Base classes
    'transform-gpu will-change-transform',
    // Initial state (only if not reduced motion and not disabled)
    !reducedMotion && !disabled && !isRevealed && config?.initial,
    // Animated state
    !reducedMotion && !disabled && isRevealed && config?.animate,
    !reducedMotion && !disabled && isRevealed && config?.duration,
    // Fallback for reduced motion
    (reducedMotion || disabled) && 'opacity-100',
    className
  );

  return (
    <div ref={ref} className={elementClasses}>
      {children}
    </div>
  );
};

// Specialized reveal components for common patterns
export const FadeInReveal: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal {...props} animation="fadeIn" />
);

export const SlideUpReveal: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal {...props} animation="fadeInUp" />
);

export const ScaleReveal: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal {...props} animation="scaleIn" />
);

// Staggered scroll reveal for lists
interface StaggeredScrollRevealProps {
  children: ReactNode[];
  staggerDelay?: number;
  baseDelay?: number;
  animation?: ScrollRevealProps['animation'];
  duration?: ScrollRevealProps['duration'];
  threshold?: number;
  className?: string;
  itemClassName?: string;
}

export const StaggeredScrollReveal: React.FC<StaggeredScrollRevealProps> = ({
  children,
  staggerDelay = 100,
  baseDelay = 0,
  animation = 'fadeInUp',
  duration = 'base',
  threshold = 0.1,
  className,
  itemClassName
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          duration={duration}
          delay={baseDelay + (index * staggerDelay)}
          threshold={threshold}
          {...(itemClassName && { className: itemClassName })}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// Reveal on scroll hook
export const useScrollReveal = (options?: Partial<ScrollRevealProps>) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref, isVisible } = useScrollAnimation(
    options?.threshold || 0.1,
    options?.rootMargin || '0px 0px -50px 0px'
  );

  useEffect(() => {
    if (reducedMotion || options?.disabled) {
      setIsRevealed(true);
      return undefined;
    }

    if (isVisible && (options?.triggerOnce !== false ? !isRevealed : true)) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
        options?.onReveal?.();
      }, options?.delay || 0);

      return () => clearTimeout(timer);
    } else if (!isVisible && options?.triggerOnce === false) {
      setIsRevealed(false);
      options?.onHide?.();
    }
    
    return undefined;
  }, [isVisible, isRevealed, options, reducedMotion]);

  return { ref, isRevealed, isVisible };
};

// Section reveal component for major page sections
interface SectionRevealProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAnimation?: ScrollRevealProps['animation'];
  contentAnimation?: ScrollRevealProps['animation'];
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  title,
  subtitle,
  className,
  headerAnimation = 'fadeInUp',
  contentAnimation = 'fadeInUp'
}) => {
  return (
    <section className={cn('py-16', className)}>
      {(title || subtitle) && (
        <ScrollReveal animation={headerAnimation} className="text-center mb-12">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </ScrollReveal>
      )}
      
      <ScrollReveal animation={contentAnimation} delay={200}>
        {children}
      </ScrollReveal>
    </section>
  );
};

// Card grid with staggered reveal
interface CardGridRevealProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export const CardGridReveal: React.FC<CardGridRevealProps> = ({
  children,
  columns = 3,
  gap = 6,
  staggerDelay = 150,
  className,
  itemClassName
}) => {
  return (
    <div 
      className={cn(
        'grid gap-6',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        gap === 4 && 'gap-4',
        gap === 6 && 'gap-6',
        gap === 8 && 'gap-8',
        className
      )}
    >
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation="fadeInUp"
          delay={index * staggerDelay}
          threshold={0.1}
          {...(itemClassName && { className: itemClassName })}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// Progressive reveal for content sections
interface ProgressiveRevealProps {
  sections: {
    id: string;
    content: ReactNode;
    delay?: number;
    animation?: ScrollRevealProps['animation'];
  }[];
  className?: string;
  sectionClassName?: string;
}

export const ProgressiveReveal: React.FC<ProgressiveRevealProps> = ({
  sections,
  className,
  sectionClassName
}) => {
  return (
    <div className={className}>
      {sections.map((section, index) => (
        <ScrollReveal
          key={section.id}
          animation={section.animation || 'fadeInUp'}
          delay={section.delay || index * 200}
          threshold={0.2}
          {...(sectionClassName && { className: sectionClassName })}
        >
          {section.content}
        </ScrollReveal>
      ))}
    </div>
  );
};

export default ScrollReveal;
export type { 
  ScrollRevealProps, 
  StaggeredScrollRevealProps, 
  SectionRevealProps, 
  CardGridRevealProps,
  ProgressiveRevealProps 
};