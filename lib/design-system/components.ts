/**
 * Design System Components
 * 
 * Provides consistent component variants for Quick Start and Professional modes
 * Built on top of design tokens with proper TypeScript support
 */

import { components as _tokens } from './tokens';
import type { Mode, MetricStatus } from './tokens';

// ==================== BASE COMPONENT CLASSES ====================

/**
 * Base classes that apply to all components regardless of mode
 */
export const baseClasses = {
  // Reset and base styles
  reset: 'box-border',
  focus: 'focus:outline-none focus:ring-2 focus:ring-opacity-50',
  transition: 'transition-all duration-200 ease-in-out',
  
  // Typography
  fontSmooth: 'antialiased',
  textSelect: 'select-none',
  
  // Accessibility
  accessible: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
} as const;

// ==================== BUTTON COMPONENTS ====================

export const button = {
  // Base button styles
  base: `
    ${baseClasses.reset} 
    ${baseClasses.transition} 
    ${baseClasses.accessible}
    inline-flex items-center justify-center 
    font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
    border border-transparent
  `,

  // Size variants
  sizes: {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  },

  // Mode variants
  variants: {
    quickStart: {
      primary: `
        bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        text-white font-semibold
        rounded-lg shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-100 hover:bg-gray-200 active:bg-gray-300
        text-blue-700 font-medium
        rounded-md shadow-sm hover:shadow-md
        transform hover:scale-102 active:scale-98
        focus:ring-blue-500
      `,
      outline: `
        bg-transparent hover:bg-blue-50 active:bg-blue-100
        text-blue-600 font-medium
        border border-blue-300 hover:border-blue-400
        rounded-md shadow-sm
        focus:ring-blue-500
      `,
      ghost: `
        bg-transparent hover:bg-blue-50 active:bg-blue-100
        text-blue-600 font-medium
        rounded-md
        focus:ring-blue-500
      `,
    },
    professional: {
      primary: `
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        text-white font-semibold
        rounded-md shadow-md hover:shadow-lg
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-50 hover:bg-gray-100 active:bg-gray-200
        text-blue-700 font-medium
        rounded border border-gray-300
        shadow-sm hover:shadow-md
        focus:ring-blue-500
      `,
      outline: `
        bg-transparent hover:bg-blue-50 active:bg-blue-100
        text-blue-700 font-medium
        border border-blue-300 hover:border-blue-400
        rounded shadow-sm
        focus:ring-blue-500
      `,
      ghost: `
        bg-transparent hover:bg-blue-50 active:bg-blue-100
        text-blue-700 font-medium
        rounded
        focus:ring-blue-500
      `,
    },
  },

  // Metric status variants
  metric: {
    excellent: `
      bg-green-500 hover:bg-green-600 text-white
      shadow-lg shadow-green-500/20 hover:shadow-green-500/30
      focus:ring-green-500
    `,
    good: `
      bg-green-400 hover:bg-green-500 text-white
      shadow-lg shadow-green-400/20 hover:shadow-green-400/30
      focus:ring-green-400
    `,
    fair: `
      bg-orange-500 hover:bg-orange-600 text-white
      shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30
      focus:ring-orange-500
    `,
    poor: `
      bg-red-500 hover:bg-red-600 text-white
      shadow-lg shadow-red-500/20 hover:shadow-red-500/30
      focus:ring-red-500
    `,
  },
} as const;

// ==================== CARD COMPONENTS ====================

export const card = {
  base: `
    ${baseClasses.reset} 
    ${baseClasses.transition}
    bg-white border border-gray-200 
    overflow-hidden
  `,

  variants: {
    quickStart: {
      default: `
        rounded-xl shadow-lg hover:shadow-xl
        transform hover:scale-102
        border-0 bg-white
      `,
      elevated: `
        rounded-xl shadow-xl hover:shadow-2xl
        transform hover:scale-105
        border-0 bg-white
      `,
      outline: `
        rounded-lg border border-gray-200 hover:border-gray-300
        shadow-sm hover:shadow-md
        bg-white
      `,
    },
    professional: {
      default: `
        rounded-lg shadow-sm hover:shadow-md
        border border-gray-200 hover:border-gray-300
        bg-white
      `,
      elevated: `
        rounded-lg shadow-md hover:shadow-lg
        border border-gray-200
        bg-white
      `,
      outline: `
        rounded border border-gray-300 hover:border-gray-400
        shadow-sm
        bg-white
      `,
    },
  },

  // Content areas
  content: {
    base: 'p-6',
    compact: 'p-4',
    spacious: 'p-8',
  },

  // Header areas
  header: {
    base: 'px-6 py-4 border-b border-gray-200',
    compact: 'px-4 py-3 border-b border-gray-200',
  },

  // Metric status variants
  metric: {
    excellent: `
      border-green-200 bg-green-50
      shadow-lg shadow-green-500/10
    `,
    good: `
      border-green-200 bg-green-50
      shadow-lg shadow-green-400/10
    `,
    fair: `
      border-orange-200 bg-orange-50
      shadow-lg shadow-orange-500/10
    `,
    poor: `
      border-red-200 bg-red-50
      shadow-lg shadow-red-500/10
    `,
  },
} as const;

// ==================== INPUT COMPONENTS ====================

export const input = {
  base: `
    ${baseClasses.reset} 
    ${baseClasses.transition} 
    ${baseClasses.accessible}
    w-full border border-gray-300 
    text-gray-900 placeholder-gray-400
    focus:border-blue-500 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  variants: {
    quickStart: {
      default: `
        bg-gray-50 hover:bg-white focus:bg-white
        rounded-lg px-4 py-3 text-base
        shadow-sm hover:shadow-md focus:shadow-md
        border-gray-300 focus:border-blue-500
      `,
      filled: `
        bg-blue-50 hover:bg-blue-100 focus:bg-white
        rounded-lg px-4 py-3 text-base
        border-blue-200 focus:border-blue-500
      `,
    },
    professional: {
      default: `
        bg-white hover:bg-gray-50 focus:bg-white
        rounded px-3 py-2 text-sm
        border-gray-300 focus:border-blue-500
        shadow-sm focus:shadow-md
      `,
      filled: `
        bg-gray-50 hover:bg-gray-100 focus:bg-white
        rounded px-3 py-2 text-sm
        border-gray-300 focus:border-blue-500
      `,
    },
  },

  // Label styles
  label: {
    quickStart: 'block text-sm font-medium text-gray-700 mb-2',
    professional: 'block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide',
  },

  // Helper text
  helper: {
    quickStart: 'mt-2 text-sm text-gray-500',
    professional: 'mt-1 text-xs text-gray-500',
  },

  // Error states
  error: {
    input: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    message: 'mt-1 text-sm text-red-600',
  },

  // Success states
  success: {
    input: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    message: 'mt-1 text-sm text-green-600',
  },
} as const;

// ==================== METRIC DISPLAY COMPONENTS ====================

export const metric = {
  base: `
    ${baseClasses.reset} 
    ${baseClasses.transition}
  `,

  // Metric card variants
  card: {
    quickStart: {
      excellent: `
        bg-gradient-to-br from-green-50 to-green-100
        border border-green-200 rounded-xl p-6
        shadow-lg shadow-green-500/10 hover:shadow-green-500/20
        transform hover:scale-102
      `,
      good: `
        bg-gradient-to-br from-green-50 to-green-100
        border border-green-200 rounded-xl p-6
        shadow-lg shadow-green-400/10 hover:shadow-green-400/20
        transform hover:scale-102
      `,
      fair: `
        bg-gradient-to-br from-orange-50 to-orange-100
        border border-orange-200 rounded-xl p-6
        shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20
        transform hover:scale-102
      `,
      poor: `
        bg-gradient-to-br from-red-50 to-red-100
        border border-red-200 rounded-xl p-6
        shadow-lg shadow-red-500/10 hover:shadow-red-500/20
        transform hover:scale-102
      `,
    },
    professional: {
      excellent: `
        bg-white border border-green-200 rounded-lg p-4
        shadow-sm hover:shadow-md
        relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500 before:rounded-l-lg
      `,
      good: `
        bg-white border border-green-200 rounded-lg p-4
        shadow-sm hover:shadow-md
        relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-400 before:rounded-l-lg
      `,
      fair: `
        bg-white border border-orange-200 rounded-lg p-4
        shadow-sm hover:shadow-md
        relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-orange-500 before:rounded-l-lg
      `,
      poor: `
        bg-white border border-red-200 rounded-lg p-4
        shadow-sm hover:shadow-md
        relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500 before:rounded-l-lg
      `,
    },
  },

  // Metric value display
  value: {
    quickStart: {
      primary: 'text-2xl font-bold text-gray-900',
      secondary: 'text-xl font-semibold text-gray-700',
    },
    professional: {
      primary: 'text-lg font-bold text-gray-900',
      secondary: 'text-base font-semibold text-gray-700',
    },
  },

  // Metric labels
  label: {
    quickStart: 'text-sm font-medium text-gray-600 mb-1',
    professional: 'text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide',
  },

  // Status indicators
  status: {
    excellent: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium',
    good: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium',
    fair: 'text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs font-medium',
    poor: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium',
  },
} as const;

// ==================== NAVIGATION COMPONENTS ====================

export const navigation = {
  // Progress indicators
  progress: {
    quickStart: {
      container: 'flex items-center justify-between p-4 bg-white shadow-sm',
      step: 'flex items-center space-x-3',
      circle: 'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300',
      active: 'bg-blue-500 text-white shadow-lg',
      completed: 'bg-green-500 text-white shadow-lg',
      inactive: 'bg-gray-200 text-gray-500',
      line: 'flex-1 h-1 bg-gray-200 mx-4 rounded-full',
      activeLine: 'bg-blue-500 h-full rounded-full transition-all duration-500',
    },
    professional: {
      container: 'flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200',
      step: 'flex items-center space-x-2',
      circle: 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
      active: 'bg-blue-600 text-white',
      completed: 'bg-green-600 text-white',
      inactive: 'bg-gray-300 text-gray-600',
      line: 'flex-1 h-px bg-gray-300 mx-3',
      activeLine: 'bg-blue-600 h-full transition-all duration-300',
    },
  },

  // Breadcrumb navigation
  breadcrumb: {
    quickStart: {
      container: 'flex items-center space-x-2 text-sm font-medium text-gray-600',
      item: 'hover:text-blue-600 transition-colors',
      separator: 'text-gray-400',
      current: 'text-blue-600 font-semibold',
    },
    professional: {
      container: 'flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wide',
      item: 'hover:text-blue-700 transition-colors',
      separator: 'text-gray-400',
      current: 'text-blue-700 font-semibold',
    },
  },
} as const;

// ==================== FEEDBACK COMPONENTS ====================

export const feedback = {
  // Loading states
  loading: {
    spinner: 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-500',
    skeleton: 'animate-pulse bg-gray-300 rounded',
  },

  // Alerts and notifications
  alert: {
    base: `
      ${baseClasses.reset} 
      ${baseClasses.transition}
      p-4 border-l-4 rounded-r-lg
    `,
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-orange-50 border-orange-400 text-orange-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  },

  // Toast notifications
  toast: {
    quickStart: {
      base: 'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300',
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    },
    professional: {
      base: 'fixed top-4 right-4 p-3 rounded shadow-md z-50 transform transition-all duration-200',
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      info: 'bg-blue-600 text-white',
    },
  },
} as const;

// ==================== UTILITY FUNCTIONS ====================

export const utils = {
  // Get component variant based on mode
  getVariant: (component: 'button' | 'card' | 'input', mode: Mode, variant: string) => {
    const componentVariants = component === 'button' ? button.variants : 
                            component === 'card' ? card.variants : 
                            input.variants;
    return componentVariants[mode][variant as keyof typeof componentVariants[typeof mode]];
  },

  // Get metric styling based on status
  getMetricStyle: (status: MetricStatus, mode: Mode) => {
    return {
      card: metric.card[mode][status],
      status: metric.status[status],
      value: metric.value[mode].primary,
      label: metric.label[mode],
    };
  },

  // Combine classes utility
  cn: (...classes: (string | undefined | null | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Responsive utility
  responsive: (quickStart: string, professional: string) => 
    `sm:${quickStart} lg:${professional}`,

  // Focus ring utility
  focusRing: (color: string = 'blue') => 
    `focus:ring-2 focus:ring-${color}-500 focus:ring-opacity-50`,

  // Hover scale utility
  hoverScale: (mode: Mode) => 
    mode === 'quickStart' ? 'hover:scale-105' : 'hover:scale-102',
} as const;

// ==================== COMPONENT BUILDER ====================

export const componentBuilder = {
  // Build button class
  button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost', size: 'xs' | 'sm' | 'md' | 'lg' | 'xl', mode: Mode) => {
    return utils.cn(
      button.base,
      button.sizes[size],
      button.variants[mode][variant]
    );
  },

  // Build card class
  card: (variant: 'default' | 'elevated' | 'outline', mode: Mode) => {
    return utils.cn(
      card.base,
      card.variants[mode][variant]
    );
  },

  // Build input class
  input: (variant: 'default' | 'filled', mode: Mode, state?: 'error' | 'success') => {
    return utils.cn(
      input.base,
      input.variants[mode][variant],
      state === 'error' && input.error.input,
      state === 'success' && input.success.input
    );
  },

  // Build metric card class
  metric: (status: MetricStatus, mode: Mode) => {
    return utils.cn(
      metric.base,
      metric.card[mode][status]
    );
  },
} as const;

// ==================== TYPE EXPORTS ====================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CardVariant = 'default' | 'elevated' | 'outline';
export type InputVariant = 'default' | 'filled';
export type InputState = 'error' | 'success';
export type AlertType = 'success' | 'warning' | 'error' | 'info';

// ==================== PRESET COMBINATIONS ====================

export const presets = {
  // Quick Start presets - friendly and approachable
  quickStart: {
    primaryButton: componentBuilder.button('primary', 'lg', 'quickStart'),
    secondaryButton: componentBuilder.button('secondary', 'md', 'quickStart'),
    mainCard: componentBuilder.card('elevated', 'quickStart'),
    inputField: componentBuilder.input('default', 'quickStart'),
    metricCard: (status: MetricStatus) => componentBuilder.metric(status, 'quickStart'),
  },

  // Professional presets - institutional and refined
  professional: {
    primaryButton: componentBuilder.button('primary', 'md', 'professional'),
    secondaryButton: componentBuilder.button('secondary', 'sm', 'professional'),
    mainCard: componentBuilder.card('default', 'professional'),
    inputField: componentBuilder.input('default', 'professional'),
    metricCard: (status: MetricStatus) => componentBuilder.metric(status, 'professional'),
  },
} as const;