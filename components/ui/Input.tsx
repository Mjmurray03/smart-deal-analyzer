'use client';

import { InputHTMLAttributes, ReactNode, forwardRef, useState, useEffect, useCallback } from 'react';
import { LucideIcon, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion, useFocusAnimation } from '@/lib/animations';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helper?: string;
  error?: string;
  success?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  prefix?: string;
  suffix?: string;
  floating?: boolean;
  formatAs?: 'currency' | 'percentage' | 'number' | 'phone';
  currencySymbol?: string;
  allowNegative?: boolean;
  decimals?: number;
  // Backward compatibility props
  helperText?: string;
  onChange?: (value: string | number) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  helper,
  helperText, // backward compatibility
  error,
  success = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftElement,
  rightElement,
  prefix,
  suffix,
  floating = false,
  formatAs,
  currencySymbol, // destructure to filter out
  allowNegative = false,
  decimals, // destructure to filter out
  className,
  disabled,
  required,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  type = 'text',
  ...htmlInputProps // renamed to make it clear these are HTML props only
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [hasValue, setHasValue] = useState(!!value);
  
  const reducedMotion = useReducedMotion();
  const { focusProps, focusClasses: animatedFocusClasses } = useFocusAnimation();

  // Use helper or helperText for backward compatibility
  const helpText = helper || helperText;

  // Size variants with precise measurements
  const sizeVariants = {
    sm: {
      height: 'h-8', // 32px
      padding: 'px-3',
      text: 'text-sm',
      iconSize: 16,
      iconPadding: { left: 'pl-8', right: 'pr-8' },
    },
    md: {
      height: 'h-10', // 40px
      padding: 'px-4',
      text: 'text-base',
      iconSize: 18,
      iconPadding: { left: 'pl-10', right: 'pr-10' },
    },
    lg: {
      height: 'h-12', // 48px
      padding: 'px-5',
      text: 'text-lg',
      iconSize: 20,
      iconPadding: { left: 'pl-12', right: 'pr-12' },
    },
  };

  // Input variants with enhanced micro-interactions
  const inputVariants = {
    default: cn(
      'border-2 border-gray-300 bg-white',
      // Enhanced hover states
      !reducedMotion && 'hover:border-gray-400 hover:shadow-sm hover:-translate-y-px',
      reducedMotion && 'hover:border-gray-400',
      // Enhanced focus states
      'focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
      !reducedMotion && 'focus:shadow-md focus:scale-[1.01]',
      // Smooth transitions
      !reducedMotion ? 'transition-all duration-200 ease-out' : 'transition-colors duration-200',
      // Error and success states
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
      error && !reducedMotion && 'focus:shadow-red-500/10',
      success && 'border-green-500 focus:border-green-500 focus:ring-green-500/10',
      success && !reducedMotion && 'focus:shadow-green-500/10',
      // Disabled state
      disabled && 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50 hover:transform-none hover:shadow-none'
    ),
    filled: cn(
      'bg-gray-100 border-2 border-transparent',
      // Enhanced hover states
      !reducedMotion && 'hover:bg-gray-50 hover:shadow-sm hover:-translate-y-px',
      reducedMotion && 'hover:bg-gray-50',
      // Enhanced focus states
      'focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
      !reducedMotion && 'focus:shadow-lg focus:scale-[1.01]',
      // Smooth transitions
      !reducedMotion ? 'transition-all duration-200 ease-out' : 'transition-colors duration-200',
      // Error and success states
      error && 'bg-red-50 focus:border-red-500 focus:ring-red-500/10',
      success && 'bg-green-50 focus:border-green-500 focus:ring-green-500/10',
      // Disabled state
      disabled && 'bg-gray-50 cursor-not-allowed opacity-50 hover:transform-none hover:shadow-none'
    ),
    flushed: cn(
      'bg-transparent border-0 border-b-2 border-gray-300 rounded-none',
      // Enhanced hover states
      'hover:border-gray-400',
      !reducedMotion && 'hover:border-b-4 hover:pb-px',
      // Enhanced focus states with morphing effect
      'focus:border-primary-500',
      !reducedMotion && 'focus:border-b-4 focus:pb-px focus:scale-y-105 focus:origin-bottom',
      // Smooth transitions
      !reducedMotion ? 'transition-all duration-300 ease-out' : 'transition-colors duration-200',
      // Error and success states
      error && 'border-red-500 focus:border-red-500',
      success && 'border-green-500 focus:border-green-500',
      // Disabled state
      disabled && 'border-gray-200 cursor-not-allowed opacity-50 hover:transform-none'
    ),
    unstyled: cn(
      'bg-transparent border-0 focus:ring-0 focus:outline-none',
      disabled && 'cursor-not-allowed opacity-50'
    ),
  };

  const sizeConfig = sizeVariants[size];

  // Format value based on formatAs prop - minimal formatting to preserve user input
  const formatValue = useCallback((val: string | number): string => {
    if (!val && val !== 0) return '';
    
    const stringVal = String(val);
    
    switch (formatAs) {
      case 'phone':
        const phoneVal = stringVal.replace(/\D/g, '');
        if (phoneVal.length <= 3) return phoneVal;
        if (phoneVal.length <= 6) return `(${phoneVal.slice(0, 3)}) ${phoneVal.slice(3)}`;
        return `(${phoneVal.slice(0, 3)}) ${phoneVal.slice(3, 6)}-${phoneVal.slice(6, 10)}`;
        
      default:
        // For currency, percentage, number - return as-is to avoid forced formatting
        return stringVal;
    }
  }, [formatAs]);

  // Handle input changes with simplified formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Apply format-specific validation
    if (formatAs === 'number' || formatAs === 'currency') {
      if (!allowNegative && newValue.includes('-')) {
        newValue = newValue.replace('-', '');
      }
    }
    
    setInternalValue(newValue);
    setHasValue(!!newValue);
    
    // Call original onChange with the raw value to prevent incorrect number display
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    focusProps.onFocus();
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    focusProps.onBlur();
    
    // Only format phone numbers on blur to avoid forced currency formatting
    if (formatAs === 'phone' && internalValue) {
      const formatted = formatValue(String(internalValue));
      setInternalValue(formatted);
    }
    
    onBlur?.(e);
  };

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      const formatted = formatAs ? formatValue(String(value)) : String(value || '');
      setInternalValue(formatted);
      setHasValue(!!value);
    }
  }, [value, formatAs, formatValue]);

  // Enhanced floating label classes with micro-animations
  const floatingLabelClasses = cn(
    'absolute left-3 pointer-events-none',
    // Enhanced transitions
    !reducedMotion ? 'transition-all duration-300 ease-out' : 'transition-all duration-200',
    'text-gray-500',
    // Enhanced label animations
    (isFocused || hasValue || floating) ? cn(
      '-top-2 text-xs bg-white px-1 text-primary-600 transform scale-90 origin-left',
      !reducedMotion && isFocused && 'animate-in slide-in-from-bottom-1 zoom-in-95 duration-200'
    ) : 'top-1/2 -translate-y-1/2 text-sm',
    // Color states
    error && 'text-red-600',
    success && 'text-green-600',
    // Subtle glow on focus
    isFocused && !reducedMotion && 'drop-shadow-sm'
  );

  // Enhanced base input classes with micro-interactions
  const inputClasses = cn(
    'w-full rounded-lg outline-none',
    // Enhanced placeholder animations
    'placeholder:text-gray-400',
    !reducedMotion && 'placeholder:transition-opacity placeholder:duration-300',
    // Size and typography
    sizeConfig.height,
    sizeConfig.padding,
    sizeConfig.text,
    // Variant styles
    inputVariants[variant],
    // Icon spacing
    LeftIcon || leftElement ? sizeConfig.iconPadding.left : '',
    RightIcon || rightElement || success ? sizeConfig.iconPadding.right : '',
    // Enhanced floating behavior
    floating && cn(
      'placeholder:opacity-0',
      !reducedMotion && 'focus:placeholder:opacity-100 focus:placeholder:transition-opacity focus:placeholder:delay-200'
    ),
    // Enhanced error animations
    error && !reducedMotion && 'animate-wiggle',
    // Enhanced success animations
    success && !reducedMotion && 'animate-in zoom-in-95 duration-300',
    success && !reducedMotion && isFocused && 'animate-checkmark',
    // Transform optimizations
    !reducedMotion && 'transform-gpu will-change-transform',
    // Apply custom focus animations
    !reducedMotion && animatedFocusClasses,
    className
  );

  // Enhanced icon positioning classes with micro-animations
  const iconClasses = cn(
    'absolute top-1/2 -translate-y-1/2 pointer-events-none',
    // Enhanced transitions
    !reducedMotion ? 'transition-all duration-200 ease-out' : 'transition-colors duration-200',
    'text-gray-400',
    // Enhanced icon animations on focus
    isFocused && cn(
      'text-primary-500',
      !reducedMotion && 'animate-in zoom-in-95 duration-200'
    ),
    // Enhanced state colors with animations
    error && cn(
      'text-red-500',
      !reducedMotion && 'animate-wiggle'
    ),
    success && cn(
      'text-green-500',
      !reducedMotion && 'animate-bounceIn'
    ),
    // Subtle scale on hover for interactive feel
    !reducedMotion && 'hover:scale-110'
  );

  const leftIconClasses = cn(iconClasses, 'left-3');
  const rightIconClasses = cn(iconClasses, 'right-3');

  return (
    <div className="w-full">
      <div className="relative">
        {/* Floating Label */}
        {floating && label && (
          <label className={floatingLabelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Regular Label */}
        {!floating && label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <LeftIcon 
              size={sizeConfig.iconSize} 
              className={leftIconClasses}
            />
          )}
          
          {/* Left Element */}
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftElement}
            </div>
          )}

          {/* Prefix */}
          {prefix && (
            <span className={cn(leftIconClasses, 'pointer-events-none text-gray-500')}>
              {prefix}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={formatAs === 'number' || formatAs === 'currency' ? 'text' : type}
            value={internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={floating ? (isFocused ? placeholder : '') : placeholder}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${htmlInputProps.id}-error` : 
              helpText ? `${htmlInputProps.id}-helper` : undefined
            }
            {...htmlInputProps}
          />

          {/* Success Icon */}
          {success && !RightIcon && !rightElement && (
            <Check 
              size={sizeConfig.iconSize} 
              className={cn(rightIconClasses, 'text-green-500')}
            />
          )}

          {/* Right Icon */}
          {RightIcon && (
            <RightIcon 
              size={sizeConfig.iconSize} 
              className={rightIconClasses}
            />
          )}
          
          {/* Right Element */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}

          {/* Suffix */}
          {suffix && (
            <span className={cn(rightIconClasses, 'pointer-events-none text-gray-500')}>
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Helper Text */}
      {helpText && !error && (
        <p id={`${htmlInputProps.id}-helper`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center">
          <AlertCircle size={16} className="text-red-500 mr-1 flex-shrink-0" />
          <p id={`${htmlInputProps.id}-error`} className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
export { Input };
export type { InputProps };