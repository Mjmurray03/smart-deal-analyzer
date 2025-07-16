'use client';
import { ChangeEvent } from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable toggle component with checkbox and label
 * Uses Tailwind CSS for styling
 */
export default function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: ToggleProps) {
  // Handle checkbox change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  // Base styles for the container
  const containerStyles = 'flex items-center space-x-3';
  
  // Base styles for the checkbox
  const checkboxBaseStyles = 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200';
  
  // Disabled styles
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';
  
  // Label styles
  const labelStyles = 'text-sm font-medium text-gray-700';

  return (
    <div className={`${containerStyles} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`${checkboxBaseStyles} ${disabledStyles}`}
      />
      <label className={labelStyles}>
        {label}
      </label>
    </div>
  );
} 