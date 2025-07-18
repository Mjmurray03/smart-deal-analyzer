'use client';

import React from 'react';
import { DollarSign, Percent, Hash, Type, Calendar, MapPin } from 'lucide-react';
import Input, { InputProps } from './Input';
import { cn } from '@/lib/design-system/utils';

interface InputWithTypeProps extends Omit<InputProps, 'leftIcon' | 'prefix' | 'formatAs'> {
  inputType?: 'currency' | 'percentage' | 'number' | 'text' | 'date' | 'address';
  currencySymbol?: string;
  showTypeIndicator?: boolean;
  onValueChange?: (value: string | number) => void;
}

const InputWithType = React.forwardRef<HTMLInputElement, InputWithTypeProps>(({
  inputType = 'text',
  currencySymbol = '$',
  showTypeIndicator = true,
  onValueChange,
  label,
  placeholder,
  helper,
  className,
  onChange,
  ...props
}, ref) => {
  
  // Type-specific configurations
  const typeConfig = {
    currency: {
      icon: DollarSign,
      formatAs: 'currency' as const,
      placeholder: placeholder || 'Enter amount',
      prefix: currencySymbol,
      helper: helper || 'Enter monetary value in dollars',
      type: 'text'
    },
    percentage: {
      icon: Percent,
      formatAs: 'percentage' as const,
      placeholder: placeholder || 'Enter percentage',
      suffix: '%',
      helper: helper || 'Enter percentage (0-100)',
      type: 'number'
    },
    number: {
      icon: Hash,
      formatAs: 'number' as const,
      placeholder: placeholder || 'Enter number',
      helper: helper || 'Enter numeric value',
      type: 'number'
    },
    text: {
      icon: Type,
      placeholder: placeholder || 'Enter text',
      helper: helper || 'Enter text value',
      type: 'text'
    },
    date: {
      icon: Calendar,
      placeholder: placeholder || 'Select date',
      helper: helper || 'Select a date',
      type: 'date'
    },
    address: {
      icon: MapPin,
      placeholder: placeholder || 'Enter address',
      helper: helper || 'Enter property address',
      type: 'text'
    }
  };

  const config = typeConfig[inputType];
  const IconComponent = config.icon;

  // Enhanced label with type indicator
  const enhancedLabel: string | React.ReactNode = showTypeIndicator && label ? (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        inputType === 'currency' && "bg-green-100 text-green-700",
        inputType === 'percentage' && "bg-blue-100 text-blue-700", 
        inputType === 'number' && "bg-purple-100 text-purple-700",
        inputType === 'text' && "bg-gray-100 text-gray-700",
        inputType === 'date' && "bg-indigo-100 text-indigo-700",
        inputType === 'address' && "bg-orange-100 text-orange-700"
      )}>
        <IconComponent className="w-3 h-3" />
        <span className="capitalize">{inputType === 'address' ? 'location' : inputType}</span>
      </div>
    </div>
  ) : label;

  // Handle value changes with proper typing
  const handleChange = (value: any) => {
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

  // Handle complex label rendering
  if (typeof enhancedLabel !== 'string' && enhancedLabel !== undefined) {
    return (
      <div className="w-full">
        <div className="mb-2">{enhancedLabel}</div>
        <Input
          ref={ref}
          placeholder={config.placeholder}
          helper={config.helper}
          type={config.type}
          leftIcon={showTypeIndicator ? IconComponent : undefined}
          onChange={handleChange}
          className={cn(
            // Add subtle border color based on input type for better visual distinction
            inputType === 'currency' && "focus:border-green-500 focus:ring-green-500/10",
            inputType === 'percentage' && "focus:border-blue-500 focus:ring-blue-500/10",
            inputType === 'number' && "focus:border-purple-500 focus:ring-purple-500/10",
            className
          )}
          {...('formatAs' in config ? { formatAs: config.formatAs } : {})}
          {...('prefix' in config ? { prefix: config.prefix } : {})}
          {...('suffix' in config ? { suffix: config.suffix } : {})}
          {...(currencySymbol && inputType === 'currency' ? { currencySymbol } : {})}
          {...props}
        />
      </div>
    );
  }

  return (
    <Input
      ref={ref}
      label={enhancedLabel as string}
      placeholder={config.placeholder}
      helper={config.helper}
      type={config.type}
      leftIcon={showTypeIndicator ? IconComponent : undefined}
      onChange={handleChange}
      className={cn(
        // Add subtle border color based on input type for better visual distinction
        inputType === 'currency' && "focus:border-green-500 focus:ring-green-500/10",
        inputType === 'percentage' && "focus:border-blue-500 focus:ring-blue-500/10",
        inputType === 'number' && "focus:border-purple-500 focus:ring-purple-500/10",
        className
      )}
      {...('formatAs' in config ? { formatAs: config.formatAs } : {})}
      {...('prefix' in config ? { prefix: config.prefix } : {})}
      {...('suffix' in config ? { suffix: config.suffix } : {})}
      {...(currencySymbol && inputType === 'currency' ? { currencySymbol } : {})}
      {...props}
    />
  );
});

InputWithType.displayName = 'InputWithType';

export default InputWithType;
export { InputWithType };
export type { InputWithTypeProps };