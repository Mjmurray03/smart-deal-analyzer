'use client';

import React from 'react';
import { cn } from '@/lib/design-system/utils';
import { Card, CardBody } from './Card';

interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  padding?: 'sm' | 'md' | 'lg';
  hasBottomNavigation?: boolean;
}

export function FormContainer({ 
  children, 
  className,
  maxWidth = '4xl',
  padding = 'md',
  hasBottomNavigation = false
}: FormContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl'
  };

  const paddingClasses = {
    sm: 'px-4 py-6',
    md: 'px-4 sm:px-6 lg:px-8 py-8',
    lg: 'px-6 sm:px-8 lg:px-12 py-12'
  };

  return (
    <div className={cn(
      'mx-auto',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      hasBottomNavigation && 'pb-32',
      className
    )}>
      {children}
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className,
  spacing = 'md',
  bordered = false
}: FormSectionProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  };

  const content = (
    <div className={cn(spacingClasses[spacing], className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );

  if (bordered) {
    return (
      <Card variant="bordered" className="overflow-visible">
        <CardBody>
          {content}
        </CardBody>
      </Card>
    );
  }

  return content;
}

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  className?: string;
}

export function FormGrid({ 
  children, 
  columns = 2, 
  gap = 'md',
  responsive = true,
  className 
}: FormGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6', 
    lg: 'gap-6 md:gap-8'
  };

  const columnClasses = responsive ? {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  } : {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-4'
  };

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

interface StickyFormActionsProps {
  children: React.ReactNode;
  className?: string;
  position?: 'bottom' | 'top';
  background?: 'white' | 'gray' | 'transparent';
  shadow?: boolean;
  zIndex?: number;
}

export function StickyFormActions({ 
  children, 
  className,
  position = 'bottom',
  background = 'white',
  shadow = true,
  zIndex = 50
}: StickyFormActionsProps) {
  const positionClasses = {
    bottom: 'fixed bottom-0 left-0 right-0',
    top: 'fixed top-0 left-0 right-0'
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent'
  };

  const borderClasses = {
    bottom: 'border-t border-gray-200',
    top: 'border-b border-gray-200'
  };

  return (
    <div 
      className={cn(
        positionClasses[position],
        backgroundClasses[background],
        borderClasses[position],
        shadow && (position === 'bottom' ? 'shadow-lg' : 'shadow-md'),
        className
      )}
      style={{ zIndex }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface FormFieldGroupProps {
  label?: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}

export function FormFieldGroup({ 
  label, 
  description, 
  children, 
  required,
  error,
  className 
}: FormFieldGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface ResponsiveFormLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveFormLayout({ 
  children, 
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'md',
  className 
}: ResponsiveFormLayoutProps) {
  if (!sidebar) {
    return <div className={className}>{children}</div>;
  }

  const sidebarWidthClasses = {
    sm: 'lg:w-1/4',
    md: 'lg:w-1/3', 
    lg: 'lg:w-2/5'
  };

  const mainWidthClasses = {
    sm: 'lg:w-3/4',
    md: 'lg:w-2/3',
    lg: 'lg:w-3/5'
  };

  return (
    <div className={cn('lg:flex lg:gap-8', className)}>
      {sidebarPosition === 'left' && (
        <aside className={cn('mb-8 lg:mb-0', sidebarWidthClasses[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
      
      <main className={mainWidthClasses[sidebarWidth]}>
        {children}
      </main>
      
      {sidebarPosition === 'right' && (
        <aside className={cn('mt-8 lg:mt-0', sidebarWidthClasses[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
    </div>
  );
}

// Touch-friendly button sizing for mobile
interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function TouchFriendlyButton({ 
  children, 
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  className 
}: TouchFriendlyButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  // Ensure minimum 44px touch target on mobile
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[48px] px-6 py-3 text-base',
    lg: 'min-h-[52px] px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export default {
  FormContainer,
  FormSection,
  FormGrid,
  StickyFormActions,
  FormFieldGroup,
  ResponsiveFormLayout,
  TouchFriendlyButton
};