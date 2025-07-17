'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  changeLabel?: string;
  icon?: LucideIcon;
  helper?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  trend?: ReactNode;
  featured?: boolean;
}

const Stat: React.FC<StatProps> = ({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  helper,
  size = 'md',
  variant = 'default',
  loading = false,
  prefix,
  suffix,
  trend,
  featured = false,
  className,
  ...props
}) => {
  // Format number values with commas
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(val);
    }
    return String(val);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      value: 'text-2xl',
      label: 'text-xs',
      icon: 20,
      padding: 'p-4',
      gap: 'gap-2',
    },
    md: {
      value: 'text-3xl',
      label: 'text-sm',
      icon: 24,
      padding: 'p-6',
      gap: 'gap-3',
    },
    lg: {
      value: 'text-5xl',
      label: 'text-base',
      icon: 32,
      padding: 'p-8',
      gap: 'gap-4',
    },
  };

  const config = sizeConfig[size];

  // Container variants
  const containerVariants = {
    default: '',
    card: cn(
      'bg-white border border-gray-200 rounded-lg shadow-sm',
      'hover:shadow-md transition-shadow duration-200',
      config.padding,
      featured && 'bg-gradient-to-br from-primary-50 to-white border-primary-200 shadow-lg shadow-primary-500/10'
    ),
    minimal: cn(
      'flex items-center justify-between',
      config.padding,
      featured && 'bg-primary-50 rounded-lg'
    ),
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn(containerVariants[variant], className)} {...props}>
        <div className={cn('space-y-2', variant === 'minimal' && 'space-y-0 space-x-4 flex items-center')}>
          <div className={cn(
            'bg-gray-200 rounded animate-pulse',
            size === 'sm' ? 'h-3 w-16' : size === 'md' ? 'h-4 w-20' : 'h-5 w-24'
          )} />
          <div className={cn(
            'bg-gray-200 rounded animate-pulse',
            size === 'sm' ? 'h-8 w-20' : size === 'md' ? 'h-10 w-24' : 'h-12 w-32'
          )} />
          {change && (
            <div className="bg-gray-200 rounded animate-pulse h-4 w-16" />
          )}
        </div>
      </div>
    );
  }

  // Format change value as percentage
  const formatChange = (changeValue: number): string => {
    const formatted = Math.abs(changeValue).toFixed(1);
    return `${formatted}%`;
  };

  // Main content
  const StatContent = () => (
    <>
      {/* Icon and Label Row */}
      <div className={cn(
        'flex items-center',
        variant === 'minimal' ? 'gap-2' : config.gap
      )}>
        {Icon && (
          <Icon 
            size={config.icon} 
            className={cn(
              'text-gray-400',
              featured && 'text-primary-500'
            )}
          />
        )}
        <div className={cn(
          variant === 'minimal' ? 'flex-1' : 'space-y-1'
        )}>
          <p className={cn(
            config.label,
            'font-medium text-gray-500',
            variant === 'minimal' && 'mb-0'
          )}>
            {label}
          </p>
          
          {/* Value Display */}
          {variant === 'minimal' ? (
            <p className={cn(
              config.value,
              'font-semibold text-gray-900 ml-auto'
            )}>
              {prefix}{formatValue(value)}{suffix}
            </p>
          ) : (
            <>
              <p className={cn(
                config.value,
                'font-semibold text-gray-900',
                'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2',
                'motion-safe:duration-500'
              )}>
                {prefix}{formatValue(value)}{suffix}
              </p>
              
              {/* Trend Component */}
              {trend && (
                <div className="mt-2">
                  {trend}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className={cn(
          'flex items-center gap-1 mt-2',
          'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left',
          'motion-safe:duration-300 motion-safe:delay-200',
          variant === 'minimal' && 'mt-0 ml-4'
        )}>
          {change.type === 'increase' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={cn(
            'text-sm font-medium',
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          )}>
            {formatChange(change.value)}
          </span>
          {changeLabel && (
            <span className="text-sm text-gray-500 ml-1">
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {/* Helper Text */}
      {helper && variant !== 'minimal' && (
        <p className="text-xs text-gray-400 mt-2">
          {helper}
        </p>
      )}
    </>
  );

  return (
    <div 
      className={cn(
        containerVariants[variant],
        featured && variant === 'default' && 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-500/5 before:to-transparent before:animate-pulse',
        className
      )} 
      {...props}
    >
      <StatContent />
    </div>
  );
};

Stat.displayName = 'Stat';

export { Stat };
export type { StatProps };