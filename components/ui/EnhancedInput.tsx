'use client';

import React from 'react';
import { DollarSign, Percent, Hash, Type, Calendar, MapPin } from 'lucide-react';
import Input, { InputProps } from './Input';
import { cn } from '@/lib/design-system/utils';

interface EnhancedInputProps extends Omit<InputProps, 'leftIcon' | 'prefix' | 'formatAs'> {
  headerText?: string;
  currencySymbol?: string;
  showTypeIndicator?: boolean;
  onValueChange?: (value: string | number) => void;
  autoDetectType?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(({
  headerText,
  currencySymbol = '$',
  showTypeIndicator = true,
  onValueChange,
  autoDetectType = true,
  label,
  placeholder,
  helper,
  className,
  onChange,
  ...props
}, ref) => {
  
  // Auto-detect input type based on header text or label
  const detectInputType = (): 'currency' | 'percentage' | 'number' | 'text' | 'date' | 'address' => {
    const text = (headerText || label || '').toLowerCase();
    
    // Currency indicators
    if (text.includes('price') || text.includes('amount') || text.includes('cost') || 
        text.includes('income') || text.includes('expense') || text.includes('fee') ||
        text.includes('noi') || text.includes('loan') || text.includes('cash') ||
        text.includes('dollar') || text.includes('revenue') || text.includes('value')) {
      return 'currency';
    }
    
    // Percentage indicators
    if (text.includes('rate') || text.includes('percentage') || text.includes('percent') ||
        text.includes('yield') || text.includes('return') || text.includes('cap rate') ||
        text.includes('vacancy') || text.includes('occupancy')) {
      return 'percentage';
    }
    
    // Address indicators
    if (text.includes('address') || text.includes('location') || text.includes('street') ||
        text.includes('property address')) {
      return 'address';
    }
    
    // Date indicators
    if (text.includes('date') || text.includes('year') || text.includes('time')) {
      return 'date';
    }
    
    // Number indicators
    if (text.includes('square') || text.includes('sf') || text.includes('footage') ||
        text.includes('unit') || text.includes('number of') || text.includes('count') ||
        text.includes('term') || text.includes('age') || text.includes('floor')) {
      return 'number';
    }
    
    return 'text';
  };

  const inputType = autoDetectType ? detectInputType() : 'text';
  
  // Type-specific configurations
  const typeConfig = {
    currency: {
      icon: DollarSign,
      formatAs: 'currency' as const,
      placeholder: placeholder || 'Enter amount',
      prefix: currencySymbol,
      helper: helper || 'Enter monetary value',
      type: 'text',
      iconColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-700'
    },
    percentage: {
      icon: Percent,
      formatAs: 'percentage' as const,
      placeholder: placeholder || 'Enter percentage',
      suffix: '%',
      helper: helper || 'Enter percentage (0-100)',
      type: 'number',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    number: {
      icon: Hash,
      formatAs: 'number' as const,
      placeholder: placeholder || 'Enter number',
      helper: helper || 'Enter numeric value',
      type: 'number',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    text: {
      icon: Type,
      placeholder: placeholder || 'Enter text',
      helper: helper || 'Enter text value',
      type: 'text',
      iconColor: 'text-gray-600',
      badgeColor: 'bg-gray-100 text-gray-700'
    },
    date: {
      icon: Calendar,
      placeholder: placeholder || 'Select date',
      helper: helper || 'Select a date',
      type: 'date',
      iconColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    address: {
      icon: MapPin,
      placeholder: placeholder || 'Enter address',
      helper: helper || 'Enter property address',
      type: 'text',
      iconColor: 'text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-700'
    }
  };

  const config = typeConfig[inputType];
  const IconComponent = config.icon;

  // Enhanced header with proper spacing and z-index
  const enhancedHeader = headerText && (
    <div className="relative z-10 mb-3">
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <IconComponent className={cn("w-5 h-5", config.iconColor)} />
          <h3 className="text-sm font-semibold text-gray-900">{headerText}</h3>
        </div>
        {showTypeIndicator && (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            config.badgeColor
          )}>
            <IconComponent className="w-3 h-3" />
            <span className="capitalize">{inputType === 'address' ? 'location' : inputType}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced label for cases without header
  const enhancedLabel = !headerText && showTypeIndicator && label ? (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        config.badgeColor
      )}>
        <IconComponent className="w-3 h-3" />
        <span className="capitalize">{inputType === 'address' ? 'location' : inputType}</span>
      </div>
    </div>
  ) : label;

  // Handle value changes with proper typing
  const handleChange = (value: string | number) => {
    // Call the original onChange if provided
    if (onChange) {
      // Create a synthetic event-like object for backward compatibility
      const syntheticEvent = {
        target: { value },
        currentTarget: { value }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
    
    // Call the typed onValueChange handler
    if (onValueChange) {
      onValueChange(value);
    }
  };

  // Prepare Input props conditionally to avoid TypeScript errors
  const baseInputProps = {
    ref,
    placeholder: config.placeholder,
    helper: config.helper,
    type: config.type,
    onChange: handleChange,
    className: cn(
      // Ensure proper spacing from header
      headerText && "mt-0",
      // Add subtle border color based on input type for better visual distinction
      inputType === 'currency' && "focus:border-green-500 focus:ring-green-500/10",
      inputType === 'percentage' && "focus:border-blue-500 focus:ring-blue-500/10",
      inputType === 'number' && "focus:border-purple-500 focus:ring-purple-500/10",
      inputType === 'date' && "focus:border-indigo-500 focus:ring-indigo-500/10",
      inputType === 'address' && "focus:border-orange-500 focus:ring-orange-500/10",
      className
    ),
    ...('formatAs' in config ? { formatAs: config.formatAs } : {}),
    ...('prefix' in config ? { prefix: config.prefix } : {}),
    ...('suffix' in config ? { suffix: config.suffix } : {}),
    ...(currencySymbol && inputType === 'currency' ? { currencySymbol } : {}),
    ...props
  };

  // Conditionally add optional props that must be properly typed
  const conditionalProps: { label?: string; leftIcon?: typeof IconComponent } = {};
  
  if (typeof enhancedLabel === 'string') {
    conditionalProps.label = enhancedLabel;
  }
  
  if (!headerText && showTypeIndicator) {
    conditionalProps.leftIcon = IconComponent;
  }

  return (
    <div className="w-full">
      {enhancedHeader}
      <div className="relative z-0">
        <Input {...baseInputProps} {...conditionalProps} />
        
        {/* Render complex label separately for header mode */}
        {!headerText && typeof enhancedLabel !== 'string' && enhancedLabel && (
          <div className="absolute -top-6 left-0 z-10">{enhancedLabel}</div>
        )}
      </div>
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';

export default EnhancedInput;
export { EnhancedInput };
export type { EnhancedInputProps };