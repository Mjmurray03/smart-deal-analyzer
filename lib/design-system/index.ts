/**
 * Smart Deal Analyzer Design System
 * 
 * A comprehensive design system that supports both 'Quick Start' and 'Professional' modes
 * Built for financial software with institutional-grade quality
 */

// Core exports
export * from './tokens';
export * from './components';
export * from './hooks';
export * from './utils';

// Re-export key types for convenience
export type {
  Mode,
  MetricStatus,
  ButtonVariant,
  ButtonSize,
  CardVariant,
  InputVariant,
  InputState,
  AlertType,
} from './components';

export type {
  ColorToken,
  TypographyToken,
  SpacingToken,
  ComponentToken,
} from './tokens';

// Design system metadata
export const designSystem = {
  name: 'Smart Deal Analyzer Design System',
  version: '1.0.0',
  description: 'Professional design system for commercial real estate analysis',
  modes: ['quickStart', 'professional'] as const,
  philosophy: {
    quickStart: 'Approachable and friendly for new users',
    professional: 'Institutional-grade for sophisticated analysis',
  },
} as const;