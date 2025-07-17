'use client';

import React, { ReactNode } from 'react';
import { Calculator, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/design-system/utils';
import { Card, CardBody } from './Card';
import { useReducedMotion } from '@/lib/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

interface PageLoaderProps {
  message?: string;
  className?: string;
}

interface CalculationLoaderProps {
  stage?: string;
  progress?: number;
  onCancel?: () => void;
}

interface SectionLoaderProps {
  title?: string;
  itemCount?: number;
  columns?: number;
  className?: string;
}

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ContentTransitionProps {
  isLoading: boolean;
  loadingComponent: ReactNode;
  children: ReactNode;
  className?: string;
}

// Base loading spinner component
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  color = 'primary'
}) => {
  const reducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    success: 'border-green-600 border-t-transparent',
    warning: 'border-orange-600 border-t-transparent',
    error: 'border-red-600 border-t-transparent'
  };

  return (
    <div
      className={cn(
        'border-2 rounded-full',
        sizeClasses[size],
        colorClasses[color],
        !reducedMotion && 'animate-spin',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

// Full page loading component
export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...", 
  className 
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gray-50", className)}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div 
            className={cn(
              "absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent",
              !reducedMotion && "animate-spin"
            )}
          />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Calculation loading overlay with progress
export const CalculationLoader: React.FC<CalculationLoaderProps> = ({ 
  stage = "Calculating metrics...", 
  progress,
  onCancel
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Background circle */}
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              {/* Progress circle */}
              <div 
                className="absolute inset-0 border-4 border-primary-600 rounded-full transition-all duration-300"
                style={{
                  borderTopColor: 'transparent',
                  transform: !reducedMotion && progress ? `rotate(${progress * 3.6}deg)` : 'none'
                }}
              />
              {/* Center icon */}
              <Calculator className="absolute inset-0 m-auto w-8 h-8 text-primary-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analyzing Your Investment
            </h3>
            <p className="text-gray-600 mb-4">{stage}</p>
            
            {progress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                <div 
                  className={cn(
                    "bg-primary-600 h-full",
                    !reducedMotion && "transition-all duration-300 ease-out"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Section loading with customizable layout
export const SectionLoader: React.FC<SectionLoaderProps> = ({ 
  title, 
  itemCount = 3,
  columns = 3,
  className
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
      )}
      <div className={cn("grid gap-6", gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-3')}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-3 animate-pulse" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/5 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline loading for buttons and small actions
export const InlineLoader: React.FC<InlineLoaderProps> = ({ 
  size = 'md', 
  className 
}) => {
  const reducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <svg 
      className={cn(
        "text-current",
        sizeClasses[size],
        !reducedMotion && "animate-spin",
        className
      )} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Smooth content transition component
export const ContentTransition: React.FC<ContentTransitionProps> = ({ 
  isLoading, 
  loadingComponent, 
  children,
  className 
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      {isLoading ? (
        <div className={cn(
          !reducedMotion && "animate-in fade-in duration-200"
        )}>
          {loadingComponent}
        </div>
      ) : (
        <div className={cn(
          !reducedMotion && "animate-in fade-in slide-in-from-bottom-2 duration-300"
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

// Specialized loading states for different app sections
export const MetricsLoader: React.FC<{ count?: number; className?: string }> = ({ 
  count = 6, 
  className 
}) => (
  <div className={cn("grid grid-cols-3 gap-6", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
    ))}
  </div>
);

export const ChartLoader: React.FC<{ type?: 'bar' | 'line' | 'pie'; className?: string }> = ({ 
  type = 'bar', 
  className 
}) => (
  <div className={cn("bg-white rounded-lg p-6 border border-gray-200", className)}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-gray-300" />
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
    </div>
    
    {type === 'pie' ? (
      <div className="flex items-center justify-center h-64">
        <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse" />
      </div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-48 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded animate-pulse"
              style={{ 
                width: '100%',
                height: `${Math.random() * 60 + 40}%`
              }}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
          ))}
        </div>
      </div>
    )}
  </div>
);

export const FormLoader: React.FC<{ sections?: number; className?: string }> = ({ 
  sections = 3, 
  className 
}) => (
  <div className={cn("space-y-6", className)}>
    {Array.from({ length: sections }).map((_, sectionIndex) => (
      <div key={sectionIndex} className="bg-white rounded-xl border-2 border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, fieldIndex) => (
              <div key={fieldIndex}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SummaryLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-xl p-8 border border-gray-200 shadow-sm", className)}>
    <div className="grid grid-cols-3 gap-8">
      <div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div>
            <div className="h-8 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-7 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Progressive loading states for multi-stage operations
export const ProgressiveLoader: React.FC<{
  stages: Array<{ label: string; completed: boolean; active: boolean }>;
  className?: string;
}> = ({ stages, className }) => (
  <div className={cn("space-y-4", className)}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
      <div className="text-sm text-gray-500">
        {stages.filter(s => s.completed).length} of {stages.length} complete
      </div>
    </div>
    
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            stage.completed && "bg-green-500 border-green-500",
            stage.active && !stage.completed && "border-primary-500 bg-primary-50",
            !stage.active && !stage.completed && "border-gray-300"
          )}>
            {stage.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {stage.active && !stage.completed && (
              <InlineLoader size="sm" />
            )}
          </div>
          <span className={cn(
            "text-sm",
            stage.completed && "text-green-600 font-medium",
            stage.active && !stage.completed && "text-primary-600 font-medium",
            !stage.active && !stage.completed && "text-gray-500"
          )}>
            {stage.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LoadingComponents = {
  LoadingSpinner,
  PageLoader,
  CalculationLoader,
  SectionLoader,
  InlineLoader,
  ContentTransition,
  MetricsLoader,
  ChartLoader,
  FormLoader,
  SummaryLoader,
  ProgressiveLoader
};

export default LoadingComponents;