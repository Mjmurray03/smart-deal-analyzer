/**
 * Design Tokens for Smart Deal Analyzer
 * 
 * Philosophy: Financial software with institutional credibility
 * - Professional yet approachable colors
 * - Clear hierarchy for Quick Start vs Professional modes
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Optimized for data visualization and financial metrics
 */

// ==================== COLOR PALETTE ====================

export const colors = {
  // Primary Brand Colors - Professional Blue
  primary: {
    50: '#f0f9ff',   // Very light blue background
    100: '#e0f2fe',  // Light blue accent
    200: '#bae6fd',  // Soft blue
    300: '#7dd3fc',  // Medium blue
    400: '#38bdf8',  // Bright blue
    500: '#0ea5e9',  // Main brand blue
    600: '#0284c7',  // Darker blue
    700: '#0369a1',  // Deep blue
    800: '#075985',  // Very dark blue
    900: '#0c4a6e',  // Navy blue
  },

  // Secondary Colors - Financial Green (for positive metrics)
  success: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Soft green
    300: '#86efac',  // Medium green
    400: '#4ade80',  // Bright green
    500: '#22c55e',  // Main success green
    600: '#16a34a',  // Darker green
    700: '#15803d',  // Deep green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Forest green
  },

  // Warning Colors - Financial Orange (for caution metrics)
  warning: {
    50: '#fffbeb',   // Very light orange
    100: '#fef3c7',  // Light orange
    200: '#fde68a',  // Soft orange
    300: '#fcd34d',  // Medium orange
    400: '#fbbf24',  // Bright orange
    500: '#f59e0b',  // Main warning orange
    600: '#d97706',  // Darker orange
    700: '#b45309',  // Deep orange
    800: '#92400e',  // Very dark orange
    900: '#78350f',  // Dark brown
  },

  // Error Colors - Financial Red (for negative metrics)
  error: {
    50: '#fef2f2',   // Very light red
    100: '#fee2e2',  // Light red
    200: '#fecaca',  // Soft red
    300: '#fca5a5',  // Medium red
    400: '#f87171',  // Bright red
    500: '#ef4444',  // Main error red
    600: '#dc2626',  // Darker red
    700: '#b91c1c',  // Deep red
    800: '#991b1b',  // Very dark red
    900: '#7f1d1d',  // Dark maroon
  },

  // Neutral Colors - Professional Grays
  neutral: {
    0: '#ffffff',    // Pure white
    50: '#f9fafb',   // Almost white
    100: '#f3f4f6',  // Very light gray
    200: '#e5e7eb',  // Light gray
    300: '#d1d5db',  // Medium light gray
    400: '#9ca3af',  // Medium gray
    500: '#6b7280',  // Main gray
    600: '#4b5563',  // Dark gray
    700: '#374151',  // Very dark gray
    800: '#1f2937',  // Almost black
    900: '#111827',  // Near black
    950: '#030712',  // Pure black
  },

  // Financial Metric Colors
  financial: {
    // Positive performance indicators
    excellent: '#059669',  // Strong green for excellent metrics
    good: '#10b981',      // Green for good metrics
    fair: '#f59e0b',      // Orange for fair metrics
    poor: '#dc2626',      // Red for poor metrics
    
    // Specialized financial colors
    revenue: '#0ea5e9',   // Blue for revenue metrics
    expense: '#dc2626',   // Red for expense metrics
    cash: '#059669',      // Green for cash flow
    debt: '#b91c1c',      // Dark red for debt metrics
    
    // Market indicators
    bullish: '#22c55e',   // Green for positive market
    bearish: '#ef4444',   // Red for negative market
    neutral: '#6b7280',   // Gray for neutral market
  },

  // Mode-Specific Colors
  mode: {
    // Quick Start - Friendly and approachable
    quickStart: {
      primary: '#0ea5e9',    // Bright blue
      secondary: '#22c55e',  // Friendly green
      accent: '#f59e0b',     // Warm orange
      background: '#f9fafb', // Light background
      surface: '#ffffff',    // Clean white
      text: '#1f2937',       // Dark gray text
    },

    // Professional - Institutional and sophisticated
    professional: {
      primary: '#0369a1',    // Deep blue
      secondary: '#059669',  // Professional green
      accent: '#d97706',     // Sophisticated orange
      background: '#f3f4f6', // Subtle background
      surface: '#ffffff',    // Clean white
      text: '#111827',       // Black text
    },
  },

  // Chart and Visualization Colors
  chart: {
    primary: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
    secondary: ['#0284c7', '#16a34a', '#d97706', '#dc2626', '#7c3aed'],
    gradient: {
      positive: ['#22c55e', '#16a34a'],
      negative: ['#ef4444', '#dc2626'],
      neutral: ['#0ea5e9', '#0284c7'],
    },
  },
} as const;

// ==================== TYPOGRAPHY ====================

export const typography = {
  // Font families
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },

  // Font sizes (rem values)
  sizes: {
    // Quick Start mode - larger, friendlier
    quickStart: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },

    // Professional mode - refined, compact
    professional: {
      xs: '0.6875rem',  // 11px
      sm: '0.75rem',    // 12px
      base: '0.875rem', // 14px
      lg: '1rem',       // 16px
      xl: '1.125rem',   // 18px
      '2xl': '1.25rem', // 20px
      '3xl': '1.5rem',  // 24px
      '4xl': '1.875rem', // 30px
      '5xl': '2.25rem', // 36px
    },
  },

  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ==================== SPACING ====================

export const spacing = {
  // Base spacing scale (rem values)
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ==================== BREAKPOINTS ====================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ==================== SHADOWS ====================

export const shadows = {
  // Quick Start - Softer shadows
  quickStart: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Professional - Crisp shadows
  professional: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.08)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.12), 0 1px 2px -1px rgb(0 0 0 / 0.12)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.12)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.12)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.12)',
  },

  // Metric status shadows
  metric: {
    excellent: '0 0 0 1px rgb(5 150 105 / 0.1), 0 4px 6px -1px rgb(5 150 105 / 0.1)',
    good: '0 0 0 1px rgb(34 197 94 / 0.1), 0 4px 6px -1px rgb(34 197 94 / 0.1)',
    fair: '0 0 0 1px rgb(245 158 11 / 0.1), 0 4px 6px -1px rgb(245 158 11 / 0.1)',
    poor: '0 0 0 1px rgb(220 38 38 / 0.1), 0 4px 6px -1px rgb(220 38 38 / 0.1)',
  },
} as const;

// ==================== BORDER RADIUS ====================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ==================== ANIMATION ====================

export const animation = {
  // Timing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Duration
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
  },

  // Mode-specific animations
  mode: {
    quickStart: {
      // Friendly, bouncy animations
      scale: 'scale(1.05)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    professional: {
      // Subtle, professional animations
      scale: 'scale(1.02)',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// ==================== Z-INDEX ====================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ==================== COMPONENT TOKENS ====================

export const components = {
  // Button variants
  button: {
    quickStart: {
      primary: {
        bg: colors.primary[500],
        hover: colors.primary[600],
        text: colors.neutral[0],
        shadow: shadows.quickStart.md,
        radius: borderRadius.lg,
      },
      secondary: {
        bg: colors.neutral[100],
        hover: colors.neutral[200],
        text: colors.primary[700],
        shadow: shadows.quickStart.sm,
        radius: borderRadius.md,
      },
    },
    professional: {
      primary: {
        bg: colors.primary[600],
        hover: colors.primary[700],
        text: colors.neutral[0],
        shadow: shadows.professional.md,
        radius: borderRadius.md,
      },
      secondary: {
        bg: colors.neutral[50],
        hover: colors.neutral[100],
        text: colors.primary[700],
        shadow: shadows.professional.sm,
        radius: borderRadius.base,
      },
    },
  },

  // Card variants
  card: {
    quickStart: {
      bg: colors.neutral[0],
      border: colors.neutral[200],
      shadow: shadows.quickStart.lg,
      radius: borderRadius.xl,
    },
    professional: {
      bg: colors.neutral[0],
      border: colors.neutral[200],
      shadow: shadows.professional.base,
      radius: borderRadius.lg,
    },
  },

  // Input variants
  input: {
    quickStart: {
      bg: colors.neutral[50],
      border: colors.neutral[300],
      focus: colors.primary[500],
      radius: borderRadius.lg,
    },
    professional: {
      bg: colors.neutral[0],
      border: colors.neutral[300],
      focus: colors.primary[600],
      radius: borderRadius.md,
    },
  },
} as const;

// ==================== UTILITY FUNCTIONS ====================

export const tokenUtils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number) => 
    `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,

  // Get mode-specific token
  getMode: (mode: 'quickStart' | 'professional') => ({
    colors: colors.mode[mode],
    shadows: shadows[mode],
    typography: typography.sizes[mode],
    animation: animation.mode[mode],
    components: components.button[mode],
  }),

  // Get financial metric color
  getMetricColor: (status: 'excellent' | 'good' | 'fair' | 'poor') => 
    colors.financial[status],

  // Get chart color palette
  getChartColors: (count: number) => 
    colors.chart.primary.slice(0, count),
} as const;

// Type exports for TypeScript
export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type ComponentToken = typeof components;
export type Mode = 'quickStart' | 'professional';
export type MetricStatus = 'excellent' | 'good' | 'fair' | 'poor';