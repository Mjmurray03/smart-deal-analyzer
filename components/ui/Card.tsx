'use client';

import { HTMLAttributes, ReactNode, forwardRef, ElementType } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion, useHoverAnimation, useScrollAnimation } from '@/lib/animations';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  selected?: boolean;
  as?: ElementType;
  children: ReactNode;
  animateOnScroll?: boolean;
  glowOnHover?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  separator?: boolean;
  children?: ReactNode;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  hover = false,
  interactive = false,
  selected = false,
  animateOnScroll = false,
  glowOnHover = false,
  as: Component = 'div',
  className,
  children,
  ...props
}, ref) => {
  const reducedMotion = useReducedMotion();
  const { hoverProps } = useHoverAnimation({
    scale: interactive ? 1.02 : 1.01,
    duration: 200
  });
  const { ref: scrollRef, isVisible } = useScrollAnimation();

  // Base styles for all cards
  const baseStyles = cn(
    'relative overflow-hidden',
    // Enhanced transitions
    !reducedMotion && 'transition-all duration-200 ease-out',
    // Scroll animations
    animateOnScroll && !isVisible && !reducedMotion && 'opacity-0 translate-y-4',
    animateOnScroll && isVisible && !reducedMotion && 'animate-in fade-in slide-in-from-bottom-4 duration-500',
    // Hardware acceleration
    'transform-gpu will-change-transform'
  );

  // Padding variants
  const paddingVariants = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Card variants with enhanced micro-interactions
  const cardVariants = {
    default: cn(
      'bg-white border border-gray-200 shadow-sm rounded-xl',
      // Enhanced hover states
      hover && !reducedMotion && 'hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1',
      hover && reducedMotion && 'hover:shadow-md',
      // Glow effect
      glowOnHover && !reducedMotion && 'hover:shadow-primary-500/20'
    ),
    elevated: cn(
      'bg-white shadow-lg rounded-xl',
      // Enhanced hover states with depth
      hover && !reducedMotion && 'hover:shadow-xl hover:shadow-black/15 hover:-translate-y-2',
      hover && reducedMotion && 'hover:shadow-xl',
      // Glow effect
      glowOnHover && !reducedMotion && 'hover:shadow-primary-500/25'
    ),
    bordered: cn(
      'bg-white border-2 border-gray-300 rounded-xl',
      // Enhanced border transitions
      !reducedMotion && 'transition-all duration-200 ease-out',
      hover && 'hover:border-primary-500 hover:shadow-md',
      'focus-within:border-primary-500 focus-within:shadow-md',
      // Subtle lift on hover
      hover && !reducedMotion && 'hover:-translate-y-0.5'
    ),
    glass: cn(
      'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-xl',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none',
      // Enhanced glass effect
      hover && !reducedMotion && 'hover:bg-white/90 hover:shadow-2xl hover:-translate-y-1',
      hover && reducedMotion && 'hover:bg-white/90 hover:shadow-2xl',
      // Shimmer effect on hover
      hover && !reducedMotion && 'hover:before:animate-shimmer'
    ),
    gradient: cn(
      'bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 p-[2px] rounded-xl shadow-lg',
      'after:absolute after:inset-[2px] after:bg-white after:rounded-[10px] after:content-[""]',
      // Enhanced gradient animations
      hover && !reducedMotion && 'hover:from-primary-600 hover:via-purple-600 hover:to-primary-700 hover:shadow-xl hover:-translate-y-1',
      hover && reducedMotion && 'hover:shadow-xl',
      // Glow effect for gradient
      glowOnHover && !reducedMotion && 'hover:shadow-purple-500/30'
    ),
  };

  // Interactive states with enhanced feedback
  const interactiveStyles = cn(
    interactive && 'cursor-pointer',
    interactive && !reducedMotion && 'active:scale-[0.98] active:transition-transform active:duration-75',
    selected && 'ring-2 ring-primary-500 ring-offset-2',
    selected && !reducedMotion && 'animate-in zoom-in-95 duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    // Enhanced focus states
    interactive && 'focus-visible:scale-[1.01] focus-visible:shadow-lg'
  );

  // Combine all styles
  const cardClasses = cn(
    baseStyles,
    cardVariants[variant],
    paddingVariants[padding],
    interactiveStyles,
    className
  );

  // Combine refs for scroll animation
  const combinedRef = (node: HTMLDivElement | null) => {
    if (animateOnScroll) scrollRef(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <Component
      ref={combinedRef}
      className={cardClasses}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...(interactive && !reducedMotion ? hoverProps : {})}
      {...props}
    >
      <div className={cn('relative z-10', variant === 'gradient' && 'h-full')}>
        {children}
      </div>
    </Component>
  );
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  title,
  subtitle,
  action,
  separator = false,
  className,
  children,
  ...props
}, ref) => {
  const headerClasses = cn(
    'flex items-start justify-between',
    separator && 'border-b border-gray-200 pb-4 mb-6',
    className
  );

  if (children) {
    return (
      <div ref={ref} className={headerClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={headerClasses} {...props}>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
});

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({
  className,
  children,
  ...props
}, ref) => {
  const bodyClasses = cn(
    'flex-1',
    // Provide consistent spacing when used without explicit Card padding
    className
  );

  return (
    <div ref={ref} className={bodyClasses} {...props}>
      {children}
    </div>
  );
});

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  separator = false,
  className,
  children,
  ...props
}, ref) => {
  const footerClasses = cn(
    'flex items-center justify-between',
    separator && 'border-t border-gray-200 pt-4 mt-6',
    className
  );

  return (
    <div ref={ref} className={footerClasses} {...props}>
      {children}
    </div>
  );
});

// Set display names for debugging
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps };