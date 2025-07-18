'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/design-system/utils';
import { useReducedMotion } from '@/lib/animations';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'button' | 'input';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number; // For text variant
  children?: never; // Skeleton shouldn't have children
}

interface SkeletonGroupProps {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
}

interface SkeletonCardProps {
  hasImage?: boolean;
  hasActions?: boolean;
  textLines?: number;
  className?: string;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  lines = 1
}) => {
  const reducedMotion = useReducedMotion();
  
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    !reducedMotion && 'animate-shimmer',
    reducedMotion && 'bg-gray-300 dark:bg-gray-600' // Static state for reduced motion
  );
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
    button: 'rounded-lg h-10',
    input: 'rounded-md h-10'
  };

  const defaultSizes = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '2.5rem', height: '2.5rem' },
    rectangular: { width: '100%', height: '8rem' },
    card: { width: '100%', height: '12rem' },
    button: { width: '6rem', height: '2.5rem' },
    input: { width: '100%', height: '2.5rem' }
  };

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{
              width: index === lines - 1 ? '75%' : (width || defaultSizes[variant].width),
              height: height || defaultSizes[variant].height
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width || defaultSizes[variant].width,
        height: height || defaultSizes[variant].height
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

// Skeleton group for complex layouts with stagger effect
export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ 
  children, 
  stagger = false,
  className 
}) => {
  const reducedMotion = useReducedMotion();
  
  return (
    <div className={cn('space-y-4', className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const existingStyle = ((child.props as any)?.style as React.CSSProperties) || {};
        const newStyle = {
          ...existingStyle,
          ...(stagger && !reducedMotion && {
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          })
        };
        
        return React.cloneElement(child as React.ReactElement<any>, {
          style: newStyle
        });
      })}
    </div>
  );
};

// Pre-built skeleton layouts
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  hasActions = true,
  textLines = 3,
  className
}) => {
  return (
    <div className={cn('p-6 border border-gray-200 rounded-xl bg-white', className)}>
      {hasImage && (
        <Skeleton variant="rectangular" height="12rem" className="mb-4" />
      )}
      
      <div className="space-y-3">
        <Skeleton variant="text" width="75%" height="1.25rem" />
        <Skeleton variant="text" lines={textLines} />
        
        {hasActions && (
          <div className="flex gap-2 pt-4">
            <Skeleton variant="button" width="5rem" />
            <Skeleton variant="button" width="4rem" />
          </div>
        )}
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className
}) => {
  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      {hasHeader && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} variant="text" height="1rem" />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" height="0.875rem" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for forms
export const SkeletonForm: React.FC<{ fields?: number; className?: string }> = ({
  fields = 4,
  className
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="25%" height="0.875rem" />
          <Skeleton variant="input" />
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <Skeleton variant="button" width="6rem" />
        <Skeleton variant="button" width="5rem" />
      </div>
    </div>
  );
};

// Skeleton for metrics/stats
export const SkeletonStats: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width="60%" height="0.875rem" />
            <Skeleton variant="circular" width="2rem" height="2rem" />
          </div>
          <Skeleton variant="text" width="40%" height="2rem" className="mb-2" />
          <Skeleton variant="text" width="80%" height="0.75rem" />
        </div>
      ))}
    </div>
  );
};

// Skeleton for navigation
export const SkeletonNav: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className
}) => {
  return (
    <nav className={cn('flex space-x-8', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <Skeleton key={index} variant="text" width="4rem" height="1rem" />
      ))}
    </nav>
  );
};

// Skeleton for user avatar and info
export const SkeletonUser: React.FC<{ showDetails?: boolean; className?: string }> = ({
  showDetails = true,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
      {showDetails && (
        <div className="space-y-1">
          <Skeleton variant="text" width="6rem" height="0.875rem" />
          <Skeleton variant="text" width="4rem" height="0.75rem" />
        </div>
      )}
    </div>
  );
};

// Loading state for entire page sections
export const SkeletonPage: React.FC<{ 
  layout?: 'dashboard' | 'form' | 'table' | 'cards';
  className?: string;
}> = ({ layout = 'dashboard', className }) => {
  const layouts = {
    dashboard: (
      <div className="space-y-8">
        <SkeletonStats count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard hasImage={false} />
        </div>
        <SkeletonTable />
      </div>
    ),
    
    form: (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Skeleton variant="text" width="50%" height="2rem" className="mb-2" />
          <Skeleton variant="text" width="75%" height="1rem" />
        </div>
        <SkeletonForm fields={6} />
      </div>
    ),
    
    table: (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="30%" height="1.5rem" />
          <Skeleton variant="button" width="8rem" />
        </div>
        <SkeletonTable rows={8} />
      </div>
    ),
    
    cards: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  };
  
  return (
    <div className={cn('animate-pulse', className)}>
      {layouts[layout]}
    </div>
  );
};

// Additional composite skeleton components for specific use cases
export const SkeletonStat: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-lg p-4 border border-gray-200", className)}>
    <Skeleton variant="text" width="50%" height="0.75rem" className="mb-2" />
    <Skeleton variant="text" width="70%" height="1.75rem" />
  </div>
);

export const SkeletonMetric: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-lg p-6 border border-gray-200", className)}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
    </div>
    <Skeleton variant="text" width="60%" height="2rem" className="mb-3" />
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton variant="text" width="30%" height="0.875rem" />
        <Skeleton variant="text" width="20%" height="0.875rem" />
      </div>
      <div className="flex justify-between">
        <Skeleton variant="text" width="35%" height="0.875rem" />
        <Skeleton variant="text" width="25%" height="0.875rem" />
      </div>
    </div>
  </div>
);

// Executive Summary Skeleton
export const ExecutiveSummarySkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-xl p-8 border border-gray-200 shadow-sm", className)}>
    <div className="grid grid-cols-3 gap-8">
      <div>
        <Skeleton variant="text" width="150px" className="mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circular" width="5rem" height="5rem" />
          <div>
            <Skeleton variant="text" width="100px" height="2rem" className="mb-2" />
            <Skeleton variant="text" width="120px" />
          </div>
        </div>
        <Skeleton variant="text" lines={3} />
      </div>
      <div className="col-span-2">
        <Skeleton variant="text" width="200px" className="mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Metrics Grid Skeleton
export const MetricsGridSkeleton: React.FC<{ 
  columns?: number;
  count?: number;
  className?: string;
}> = ({ columns = 3, count = 9, className }) => (
  <div className={cn(
    "grid gap-6",
    columns === 2 && "grid-cols-2",
    columns === 3 && "grid-cols-3",
    columns === 4 && "grid-cols-4",
    className
  )}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonMetric key={i} />
    ))}
  </div>
);

// Form Section Skeleton
export const FormSectionSkeleton: React.FC<{ 
  fieldCount?: number;
  className?: string;
}> = ({ fieldCount = 4, className }) => (
  <div className={cn("bg-white rounded-xl border-2 border-gray-200 mb-6", className)}>
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Skeleton variant="rectangular" width="2rem" height="2rem" />
        <Skeleton variant="text" width="150px" />
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i}>
            <Skeleton variant="text" width="100px" height="0.875rem" className="mb-2" />
            <Skeleton variant="rectangular" height="2.5rem" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Chart/Visualization Skeleton
export const ChartSkeleton: React.FC<{ 
  type?: 'bar' | 'line' | 'pie';
  className?: string;
}> = ({ type = 'bar', className }) => (
  <div className={cn("bg-white rounded-lg p-6 border border-gray-200", className)}>
    <div className="flex items-center justify-between mb-6">
      <Skeleton variant="text" width="150px" height="1.25rem" />
      <Skeleton variant="rectangular" width="80px" height="2rem" />
    </div>
    
    {type === 'pie' ? (
      <div className="flex items-center justify-center">
        <Skeleton variant="circular" width="12rem" height="12rem" />
      </div>
    ) : (
      <div className="space-y-4">
        {/* Chart bars/lines */}
        <div className="flex items-end justify-between h-48 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width="100%"
              height={`${Math.random() * 60 + 40}%`}
            />
          ))}
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="text" width="40px" height="0.75rem" />
          ))}
        </div>
      </div>
    )}
  </div>
);

// Data Table Skeleton
export const DataTableSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn("bg-white rounded-lg border border-gray-200 overflow-hidden", className)}>
    {/* Header */}
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" height="1rem" width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height="0.875rem" width="90%" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Progress Indicator Skeleton
export const ProgressSkeleton: React.FC<{ 
  steps?: number;
  className?: string;
}> = ({ steps = 4, className }) => (
  <div className={cn("space-y-4", className)}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="120px" height="0.875rem" />
      <Skeleton variant="text" width="60px" height="0.875rem" />
    </div>
    <div className="flex items-center gap-2">
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          <Skeleton variant="circular" width="2rem" height="2rem" />
          {index < steps - 1 && (
            <Skeleton variant="rectangular" width="2rem" height="2px" />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Export all skeleton components
export {
  SkeletonCard as Card,
  SkeletonTable as Table,
  SkeletonForm as Form,
  SkeletonStats as Stats,
  SkeletonNav as Nav,
  SkeletonUser as User,
  SkeletonPage as Page
};

// Default export
export default Skeleton;