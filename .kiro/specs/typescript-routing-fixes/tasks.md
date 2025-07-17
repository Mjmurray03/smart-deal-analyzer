# Implementation Plan

- [ ] 1. Fix TypeScript compilation errors in EnhancedMetricsDisplay component










  - Remove all commented-out code that causes compilation issues
  - Implement proper type guards for unknown object types
  - Create safe rendering utilities for complex metrics
  - Add proper TypeScript interfaces for metric display
  - Test component compilation and runtime behavior
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Create analyzer route structure and property type selector
  - Create app/analyzer/page.tsx with redirect to quick analyzer
  - Create app/analyzer/quick/page.tsx with property type selection interface
  - Implement PropertyTypeSelector component with existing UI patterns
  - Add proper navigation and error handling
  - Test navigation flow from landing page
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 3. Implement dynamic property type analyzer routes
  - Create app/analyzer/quick/[propertyType]/page.tsx for dynamic routing
  - Add parameter validation for property types (office, retail, industrial, multifamily, mixed-use)
  - Implement basic analyzer form using existing calculation types
  - Connect to existing calculation engine from lib/calculations/
  - Add proper error handling for invalid property types
  - _Requirements: 2.2, 2.4, 3.1, 3.2, 3.3_

- [ ] 4. Create advanced analyzer page
  - Create app/analyzer/advanced/page.tsx with comprehensive analysis interface
  - Implement form for advanced metrics selection using existing MetricFlags
  - Connect to existing 200+ metrics calculation system
  - Add proper loading states and error boundaries
  - Test integration with existing calculation engine
  - _Requirements: 2.1, 3.1, 3.2, 3.4, 4.1_

- [ ] 5. Implement instant calculator pages
  - Create app/calculators/cap-rate/page.tsx for cap rate calculator
  - Create app/calculators/cash-on-cash/page.tsx for cash-on-cash calculator
  - Create app/calculators/price-psf/page.tsx for price per square foot calculator
  - Create app/calculators/grm/page.tsx for gross rent multiplier calculator
  - Use existing formatMetricValue function for consistent formatting
  - _Requirements: 2.3, 3.2, 3.3, 4.1, 4.4_

- [ ] 6. Create reusable calculator layout component
  - Create components/calculators/CalculatorLayout.tsx for consistent calculator UI
  - Implement form validation and error handling utilities
  - Add loading states and result display components
  - Use existing UI components (Button, Card, Badge) for consistency
  - Test component reusability across all calculator pages
  - _Requirements: 4.1, 4.2, 4.4, 5.2, 5.3_

- [ ] 7. Add comprehensive error handling and validation
  - Implement proper 404 error pages for invalid routes
  - Add form validation for all calculator and analyzer inputs
  - Create error boundary components for calculation failures
  - Add user-friendly error messages and recovery options
  - Test error scenarios and edge cases
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Verify build process and type safety
  - Run TypeScript compilation to ensure no errors
  - Execute npm run build to verify production build success
  - Test all routes and navigation paths
  - Verify calculation engine integration remains intact
  - Run existing tests to ensure no regressions
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4_