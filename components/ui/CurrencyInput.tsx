'use client';

import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/design-system/utils';

interface CurrencyInputProps {
  id?: string;
  label?: string;
  value?: string | number;
  onChange?: (value: number | '') => void;
  onValueChange?: (value: number | '') => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  allowNegative?: boolean;
  showCurrencySymbol?: boolean;
  className?: string;
  floating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(({
  id,
  label,
  value = '',
  onChange,
  onValueChange,
  placeholder = 'Enter amount',
  helper,
  error,
  required = false,
  disabled = false,
  allowNegative = false,
  showCurrencySymbol = true,
  className,
  floating = false,
  size = 'md'
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Size configurations with ACTUAL working spacing for $ symbol
  const sizeConfigs = {
    sm: { height: 'h-8', padding: 'px-3', text: 'text-sm', iconPadding: 'pl-8', symbolLeft: 'left-2' },
    md: { height: 'h-10', padding: 'px-4', text: 'text-base', iconPadding: 'pl-10', symbolLeft: 'left-3' },
    lg: { height: 'h-12', padding: 'px-5', text: 'text-lg', iconPadding: 'pl-12', symbolLeft: 'left-4' }
  };
  
  const sizeConfig = sizeConfigs[size];

  // Simple numeric cleaning - allow any valid number format
  const cleanNumericValue = useCallback((val: string): string => {
    // Allow digits, decimal point, and optional minus sign
    let cleaned = val.replace(/[^0-9.-]/g, '');
    
    // Handle negative sign - only at beginning if allowed
    if (!allowNegative) {
      cleaned = cleaned.replace(/-/g, '');
    } else if (cleaned.includes('-') && !cleaned.startsWith('-')) {
      cleaned = cleaned.replace(/-/g, '');
    }
    
    // Allow only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    return cleaned;
  }, [allowNegative]);

  // No forced formatting - return value as user types it
  const formatDisplayValue = useCallback((val: string): string => {
    if (!val) return '';
    return cleanNumericValue(val);
  }, [cleanNumericValue]);

  // Parse display value to numeric value
  const parseValue = useCallback((val: string): number | '' => {
    if (!val) return '';
    const cleaned = cleanNumericValue(val);
    if (!cleaned || cleaned === '-' || cleaned === '.') return '';
    const numericValue = parseFloat(cleaned);
    return isNaN(numericValue) ? '' : numericValue;
  }, [cleanNumericValue]);

  // Update display value when prop value changes
  useEffect(() => {
    if (value !== undefined) {
      const stringValue = String(value);
      const formatted = stringValue === '' ? '' : formatDisplayValue(stringValue);
      setInputValue(formatted);
      setHasValue(!!stringValue);
    }
  }, [value, formatDisplayValue]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanedValue = cleanNumericValue(rawValue);
    const formattedValue = formatDisplayValue(cleanedValue);
    
    setInputValue(formattedValue);
    setHasValue(!!formattedValue);
    
    // Call change handlers with numeric value
    const numericValue = parseValue(cleanedValue);
    if (onChange) onChange(numericValue);
    if (onValueChange) onValueChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // No formatting on blur - keep user input as-is
  };

  // Floating label classes
  const floatingLabelClasses = cn(
    'absolute left-3 pointer-events-none transition-all duration-200 text-gray-500',
    (isFocused || hasValue || floating) 
      ? '-top-2 text-xs bg-white px-1 text-blue-600 transform scale-90 origin-left'
      : 'top-1/2 -translate-y-1/2 text-sm',
    error && 'text-red-600'
  );

  // Input classes
  const inputClasses = cn(
    'w-full rounded-lg border-2 outline-none transition-all duration-200',
    'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
    'text-left', // Left-align for better UX
    sizeConfig.height,
    sizeConfig.padding,
    sizeConfig.text,
    showCurrencySymbol && sizeConfig.iconPadding,
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
    disabled && 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50',
    floating && 'placeholder:opacity-0 focus:placeholder:opacity-100',
    className
  );


  return (
    <div className="w-full">
      <div className="relative">
        {/* Floating Label */}
        {floating && label && (
          <label htmlFor={id} className={floatingLabelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Regular Label */}
        {!floating && label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Currency Symbol - ACTUALLY positioned correctly */}
          {showCurrencySymbol && (
            <div 
              className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none z-20"
              style={{ width: '20px' }}
            >
              <span 
                className={cn(
                  'text-gray-500 font-medium select-none text-base',
                  isFocused && 'text-blue-500',
                  error && 'text-red-500'
                )}
              >
                $
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={floating ? (isFocused ? placeholder : '') : placeholder}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : 
              helper ? `${id}-helper` : undefined
            }
          />
        </div>
      </div>

      {/* Helper Text */}
      {helper && !error && (
        <p id={`${id}-helper`} className="mt-2 text-sm text-gray-500">
          {helper}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center">
          <AlertCircle size={16} className="text-red-500 mr-1 flex-shrink-0" />
          <p id={`${id}-error`} className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
export { CurrencyInput };
export type { CurrencyInputProps };