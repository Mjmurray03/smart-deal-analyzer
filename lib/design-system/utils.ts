/**
 * Design System Utilities
 * 
 * Utility functions for working with the design system
 */

import type { Mode, MetricStatus } from './tokens';
import { colors, utils as tokenUtils } from './tokens';

// ==================== CLASS NAME UTILITIES ====================

/**
 * Combines class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditionally applies classes based on conditions
 */
export function conditional(
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
): string {
  return condition ? trueClass : falseClass;
}

/**
 * Creates responsive class names for different modes
 */
export function responsive(
  quickStartClasses: string,
  professionalClasses: string,
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'lg'
): string {
  return `${quickStartClasses} ${breakpoint}:${professionalClasses}`;
}

// ==================== COLOR UTILITIES ====================

/**
 * Converts hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Adds opacity to a color
 */
export function withOpacity(color: string, opacity: number): string {
  return tokenUtils.withOpacity(color, opacity);
}

/**
 * Gets the appropriate text color for a background
 */
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return colors.neutral[900];
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? colors.neutral[900] : colors.neutral[0];
}

/**
 * Gets color based on metric status
 */
export function getMetricColor(status: MetricStatus): string {
  return tokenUtils.getMetricColor(status);
}

// ==================== ANIMATION UTILITIES ====================

/**
 * Creates a staggered animation delay
 */
export function staggerDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`;
}

/**
 * Creates hover scale based on mode
 */
export function getHoverScale(mode: Mode): string {
  return mode === 'quickStart' ? 'hover:scale-105' : 'hover:scale-102';
}

/**
 * Gets transition duration based on mode
 */
export function getTransitionDuration(mode: Mode): string {
  return mode === 'quickStart' ? 'duration-300' : 'duration-200';
}

// ==================== LAYOUT UTILITIES ====================

/**
 * Creates a grid layout class based on item count
 */
export function getGridCols(itemCount: number): string {
  if (itemCount <= 1) return 'grid-cols-1';
  if (itemCount <= 2) return 'grid-cols-1 md:grid-cols-2';
  if (itemCount <= 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  if (itemCount <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
}

/**
 * Gets appropriate spacing based on mode
 */
export function getSpacing(mode: Mode, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const quickStartSpacing = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const professionalSpacing = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return mode === 'quickStart' ? quickStartSpacing[size] : professionalSpacing[size];
}

// ==================== TYPOGRAPHY UTILITIES ====================

/**
 * Gets font size based on mode and semantic meaning
 */
export function getFontSize(
  mode: Mode,
  semantic: 'heading' | 'body' | 'caption' | 'label'
): string {
  const quickStartSizes = {
    heading: 'text-2xl',
    body: 'text-base',
    caption: 'text-sm',
    label: 'text-sm',
  };

  const professionalSizes = {
    heading: 'text-xl',
    body: 'text-sm',
    caption: 'text-xs',
    label: 'text-xs',
  };

  return mode === 'quickStart' ? quickStartSizes[semantic] : professionalSizes[semantic];
}

/**
 * Gets font weight based on mode and emphasis
 */
export function getFontWeight(
  mode: Mode,
  emphasis: 'normal' | 'medium' | 'semibold' | 'bold'
): string {
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return weights[emphasis];
}

// ==================== FORM UTILITIES ====================

/**
 * Gets input styling based on state
 */
export function getInputState(
  hasError: boolean,
  hasSuccess: boolean,
  isFocused: boolean
): {
  borderColor: string;
  ringColor: string;
  bgColor: string;
} {
  if (hasError) {
    return {
      borderColor: 'border-red-500',
      ringColor: 'ring-red-500',
      bgColor: 'bg-red-50',
    };
  }

  if (hasSuccess) {
    return {
      borderColor: 'border-green-500',
      ringColor: 'ring-green-500',
      bgColor: 'bg-green-50',
    };
  }

  if (isFocused) {
    return {
      borderColor: 'border-blue-500',
      ringColor: 'ring-blue-500',
      bgColor: 'bg-white',
    };
  }

  return {
    borderColor: 'border-gray-300',
    ringColor: 'ring-blue-500',
    bgColor: 'bg-white',
  };
}

/**
 * Validates form field based on type
 */
export function validateField(
  value: string | number,
  type: 'email' | 'number' | 'currency' | 'percentage' | 'text',
  required: boolean = false
): { isValid: boolean; error?: string } {
  // Required field validation
  if (required && (!value || value === '')) {
    return { isValid: false, error: 'This field is required' };
  }

  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value as string)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      break;

    case 'number':
    case 'currency':
    case 'percentage':
      if (value && isNaN(Number(value))) {
        return { isValid: false, error: 'Please enter a valid number' };
      }
      if (type === 'percentage' && Number(value) > 100) {
        return { isValid: false, error: 'Percentage cannot exceed 100%' };
      }
      break;

    case 'text':
      // No specific validation for text fields
      break;
  }

  return { isValid: true };
}

// ==================== METRIC UTILITIES ====================

/**
 * Formats metric values for display
 */
export function formatMetricValue(
  value: number | null,
  type: 'percentage' | 'currency' | 'ratio' | 'number',
  precision: number = 2
): string {
  if (value === null || value === undefined) return 'N/A';

  switch (type) {
    case 'percentage':
      return `${value.toFixed(precision)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      }).format(value);
    case 'ratio':
      return value.toFixed(precision);
    case 'number':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      }).format(value);
    default:
      return value.toString();
  }
}

/**
 * Gets metric status based on value and thresholds
 */
export function getMetricStatus(
  value: number | null,
  thresholds: {
    excellent: number;
    good: number;
    fair: number;
  },
  reverseScale: boolean = false
): MetricStatus {
  if (value === null || value === undefined) return 'poor';

  if (reverseScale) {
    // For metrics where lower is better (like expense ratios)
    if (value <= thresholds.excellent) return 'excellent';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.fair) return 'fair';
    return 'poor';
  } else {
    // For metrics where higher is better (like returns)
    if (value >= thresholds.excellent) return 'excellent';
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.fair) return 'fair';
    return 'poor';
  }
}

// ==================== ACCESSIBILITY UTILITIES ====================

/**
 * Creates ARIA label for screen readers
 */
export function createAriaLabel(
  label: string,
  value?: string | number,
  status?: MetricStatus
): string {
  let ariaLabel = label;
  
  if (value !== undefined) {
    ariaLabel += `, value: ${value}`;
  }
  
  if (status) {
    ariaLabel += `, status: ${status}`;
  }
  
  return ariaLabel;
}

/**
 * Gets focus ring classes with proper contrast
 */
export function getFocusRing(color: string = 'blue'): string {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`;
}

/**
 * Creates skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, label: string): string {
  return `Skip to ${label}`;
}

// ==================== PERFORMANCE UTILITIES ====================

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== CHART UTILITIES ====================

/**
 * Gets chart color palette
 */
export function getChartColors(count: number): string[] {
  return tokenUtils.getChartColors(count);
}

/**
 * Creates gradient for charts
 */
export function createGradient(
  startColor: string,
  endColor: string,
  id: string
): { id: string; gradient: string } {
  return {
    id,
    gradient: `linear-gradient(to right, ${startColor}, ${endColor})`,
  };
}

// ==================== RESPONSIVE UTILITIES ====================

/**
 * Gets responsive classes based on breakpoint
 */
export function getResponsiveClasses(
  mobile: string,
  tablet: string,
  desktop: string
): string {
  return `${mobile} md:${tablet} lg:${desktop}`;
}

/**
 * Checks if current screen matches breakpoint
 */
export function matchesBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean {
  if (typeof window === 'undefined') return false;
  
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };
  
  return window.innerWidth >= breakpoints[breakpoint];
}

// ==================== EXPORT UTILITIES ====================

/**
 * Exports data to CSV format
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

// ==================== TYPE GUARDS ====================

/**
 * Checks if value is a valid metric status
 */
export function isMetricStatus(value: unknown): value is MetricStatus {
  return ['excellent', 'good', 'fair', 'poor'].includes(value);
}

/**
 * Checks if value is a valid mode
 */
export function isMode(value: unknown): value is Mode {
  return ['quickStart', 'professional'].includes(value);
}

// ==================== LOCAL STORAGE UTILITIES ====================

/**
 * Safely gets item from localStorage
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
}

/**
 * Safely sets item in localStorage
 */
export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
}