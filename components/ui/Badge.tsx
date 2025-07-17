'use client';

import { HTMLAttributes, ReactNode, useState } from 'react';
import { LucideIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  animated?: boolean;
  dot?: boolean;
  dotPosition?: 'left' | 'right';
  children: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  rounded = 'md',
  icon: Icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  animated = false,
  dot = false,
  dotPosition = 'left',
  children,
  className,
  ...props
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  // Size configurations
  const sizeConfig = {
    xs: {
      height: 'h-[18px]',
      padding: 'px-2 py-0.5',
      text: 'text-xs',
      iconSize: 12,
      gap: 'gap-1',
      dotSize: 'w-1.5 h-1.5',
    },
    sm: {
      height: 'h-[22px]',
      padding: 'px-2.5 py-0.5',
      text: 'text-sm',
      iconSize: 14,
      gap: 'gap-1.5',
      dotSize: 'w-2 h-2',
    },
    md: {
      height: 'h-[26px]',
      padding: 'px-3 py-1',
      text: 'text-sm',
      iconSize: 16,
      gap: 'gap-2',
      dotSize: 'w-2 h-2',
    },
    lg: {
      height: 'h-[32px]',
      padding: 'px-4 py-1.5',
      text: 'text-base',
      iconSize: 18,
      gap: 'gap-2',
      dotSize: 'w-2.5 h-2.5',
    },
  };

  // Rounded configurations
  const roundedConfig = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Variant color schemes
  const variantConfig = {
    default: {
      base: 'bg-gray-100 text-gray-800 border-gray-200',
      hover: 'hover:bg-gray-200',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    },
    primary: {
      base: 'bg-primary-100 text-primary-800 border-primary-200',
      hover: 'hover:bg-primary-200',
      outline: 'border-2 border-primary-300 text-primary-700 hover:bg-primary-50',
    },
    success: {
      base: 'bg-green-100 text-green-800 border-green-200',
      hover: 'hover:bg-green-200',
      outline: 'border-2 border-green-300 text-green-700 hover:bg-green-50',
    },
    warning: {
      base: 'bg-amber-100 text-amber-800 border-amber-200',
      hover: 'hover:bg-amber-200',
      outline: 'border-2 border-amber-300 text-amber-700 hover:bg-amber-50',
    },
    danger: {
      base: 'bg-red-100 text-red-800 border-red-200',
      hover: 'hover:bg-red-200',
      outline: 'border-2 border-red-300 text-red-700 hover:bg-red-50',
    },
    info: {
      base: 'bg-blue-100 text-blue-800 border-blue-200',
      hover: 'hover:bg-blue-200',
      outline: 'border-2 border-blue-300 text-blue-700 hover:bg-blue-50',
    },
    outline: {
      base: 'bg-transparent border-gray-300',
      hover: 'hover:bg-gray-50',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    },
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  // Handle remove with animation
  const handleRemove = () => {
    if (onRemove) {
      setIsRemoving(true);
      // Delay the actual removal to allow animation
      setTimeout(() => {
        onRemove();
      }, 200);
    }
  };

  // Dot indicator
  const DotIndicator = () => (
    <div className={cn(
      config.dotSize,
      'rounded-full bg-current opacity-60',
      animated && 'animate-pulse'
    )} />
  );

  // Remove button
  const RemoveButton = () => (
    <button
      onClick={handleRemove}
      className={cn(
        'ml-1 inline-flex items-center justify-center',
        'rounded-full hover:bg-black/10 focus:bg-black/10',
        'focus:outline-none transition-colors duration-150',
        size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
      )}
      aria-label="Remove"
    >
      <X size={size === 'xs' ? 8 : size === 'sm' ? 10 : 12} />
    </button>
  );

  // Base badge classes
  const badgeClasses = cn(
    'inline-flex items-center font-medium',
    'transition-all duration-200 ease-in-out',
    config.height,
    config.padding,
    config.text,
    config.gap,
    roundedConfig[rounded],
    variant === 'outline' ? colors.outline : cn(colors.base, colors.hover),
    animated && 'motion-safe:animate-in motion-safe:fade-in motion-safe:scale-in-95 motion-safe:duration-200',
    isRemoving && 'animate-out fade-out scale-out-95 duration-200',
    removable && 'pr-1',
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {/* Left Dot */}
      {dot && dotPosition === 'left' && <DotIndicator />}
      
      {/* Left Icon */}
      {Icon && iconPosition === 'left' && (
        <Icon size={config.iconSize} className="flex-shrink-0" />
      )}
      
      {/* Content */}
      <span className="truncate">
        {children}
      </span>
      
      {/* Right Icon */}
      {Icon && iconPosition === 'right' && (
        <Icon size={config.iconSize} className="flex-shrink-0" />
      )}
      
      {/* Right Dot */}
      {dot && dotPosition === 'right' && <DotIndicator />}
      
      {/* Remove Button */}
      {removable && <RemoveButton />}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };