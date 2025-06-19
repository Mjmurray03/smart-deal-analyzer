import { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * Reusable number input component with label and error state
 * Uses Tailwind CSS for styling
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = '',
  error,
  helperText,
  disabled = false,
  required = false,
  min,
  max,
  step = 1,
  className = '',
}: InputProps) {
  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange('');
    } else {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  // Base styles for the input container
  const containerStyles = 'w-full';
  
  // Base styles for the label
  const labelStyles = 'block text-sm font-medium text-gray-700 mb-1';
  
  // Base styles for the input
  const inputBaseStyles = 'block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  // Input state styles
  const inputStateStyles = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  // Disabled styles
  const disabledStyles = disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : 'bg-white';
  
  // Combine all input styles
  const inputStyles = `${inputBaseStyles} ${inputStateStyles} ${disabledStyles} ${className}`;

  return (
    <div className={containerStyles}>
      <label className={labelStyles}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        className={inputStyles}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : helperText && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
} 