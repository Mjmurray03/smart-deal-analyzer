# Smart Deal Analyzer Design System

A comprehensive design system that supports both **'Quick Start'** and **'Professional'** modes, built specifically for financial software with institutional-grade quality.

## Philosophy

The design system follows a **dual-purpose philosophy**:

- **Quick Start Mode**: Approachable and friendly for new users who want to calculate Cap Rate in 30 seconds
- **Professional Mode**: Institutional-grade interface for sophisticated commercial real estate analysis

## Key Features

### 🎨 **Mode-Aware Design**
- Seamless switching between Quick Start and Professional modes
- Consistent visual language across both modes
- Responsive design that adapts to user preferences

### 💼 **Financial Software Optimized**
- Purpose-built colors for financial metrics and status indicators
- Accessibility compliant (WCAG 2.1 AA)
- Optimized for data visualization and financial analysis

### 🏗️ **Institutional Quality**
- Professional color palette suitable for enterprise environments
- Comprehensive component library with variants for different use cases
- Built-in support for progressive disclosure and complexity management

## Architecture

```
lib/design-system/
├── tokens.ts          # Design tokens (colors, typography, spacing)
├── components.ts      # Component variants and styling
├── hooks.ts          # React hooks for design system state
├── utils.ts          # Utility functions
├── index.ts          # Main exports
└── README.md         # This file
```

## Usage Examples

### Basic Component Usage

```typescript
import { button, card, input } from '@/lib/design-system';

// Quick Start button
<button className={button.variants.quickStart.primary}>
  Calculate Cap Rate
</button>

// Professional button
<button className={button.variants.professional.primary}>
  Analyze Investment
</button>
```

### Using Mode-Aware Hooks

```typescript
import { useDesignMode } from '@/lib/design-system';

function MyComponent() {
  const { mode, toggleMode, isQuickStart } = useDesignMode();
  
  return (
    <div className={isQuickStart ? 'p-6' : 'p-4'}>
      <button onClick={toggleMode}>
        Switch to {isQuickStart ? 'Professional' : 'Quick Start'}
      </button>
    </div>
  );
}
```

### Component Builder

```typescript
import { componentBuilder } from '@/lib/design-system';

function MetricCard({ status, mode }) {
  const cardClass = componentBuilder.metric(status, mode);
  
  return (
    <div className={cardClass}>
      {/* Metric content */}
    </div>
  );
}
```

### Using Utility Functions

```typescript
import { formatMetricValue, getMetricStatus } from '@/lib/design-system';

const capRate = 8.5;
const formattedValue = formatMetricValue(capRate, 'percentage'); // "8.50%"
const status = getMetricStatus(capRate, {
  excellent: 8,
  good: 6,
  fair: 4
}); // "excellent"
```

## Design Tokens

### Color System

#### Primary Colors
- **Blue Palette**: Professional brand colors optimized for financial software
- **Success Green**: For positive metrics and good performance
- **Warning Orange**: For caution metrics and fair performance
- **Error Red**: For negative metrics and poor performance

#### Financial Metrics Colors
```typescript
financial: {
  excellent: '#059669',  // Strong green
  good: '#10b981',      // Green
  fair: '#f59e0b',      // Orange
  poor: '#dc2626',      // Red
}
```

#### Mode-Specific Colors
```typescript
mode: {
  quickStart: {
    primary: '#0ea5e9',    // Bright blue
    secondary: '#22c55e',  // Friendly green
    accent: '#f59e0b',     // Warm orange
  },
  professional: {
    primary: '#0369a1',    // Deep blue
    secondary: '#059669',  // Professional green
    accent: '#d97706',     // Sophisticated orange
  }
}
```

### Typography

#### Quick Start Mode
- Larger, friendlier font sizes
- More generous spacing
- Emphasis on readability

#### Professional Mode
- Refined, compact typography
- Efficient use of space
- Optimized for data density

### Spacing & Layout

#### Quick Start
- Generous padding and margins
- Comfortable touch targets
- Breathing room for new users

#### Professional
- Efficient use of screen space
- Compact layouts for power users
- Optimized for productivity

## Component Variants

### Buttons

#### Quick Start
- **Primary**: Bright blue with friendly hover effects
- **Secondary**: Light background with subtle shadows
- **Outline**: Transparent background with border
- **Ghost**: Minimal styling for secondary actions

#### Professional
- **Primary**: Deep blue with professional shadows
- **Secondary**: Refined styling with subtle borders
- **Outline**: Crisp outline with hover states
- **Ghost**: Clean minimal styling

### Cards

#### Quick Start
- **Default**: Rounded corners with generous shadows
- **Elevated**: Enhanced shadow for emphasis
- **Outline**: Clean border with hover effects

#### Professional
- **Default**: Subtle shadows with refined borders
- **Elevated**: Professional elevation
- **Outline**: Crisp borders with minimal styling

### Inputs

#### Quick Start
- **Default**: Light background with friendly styling
- **Filled**: Subtle background fill for visual hierarchy

#### Professional
- **Default**: Clean white background with subtle borders
- **Filled**: Refined background for form organization

## Hooks

### `useDesignMode()`
Manages Quick Start vs Professional mode switching with localStorage persistence.

### `useMetricStatus()`
Determines metric status (excellent/good/fair/poor) based on value and thresholds.

### `useProgressiveDisclosure()`
Manages progressive disclosure of features from basic to institutional level.

### `useFormComplexity()`
Handles form complexity progression (basic → standard → advanced).

### `useAccessibility()`
Provides accessibility features including announcements and focus management.

## Utilities

### Class Name Utilities
- `cn()`: Combines class names with falsy value filtering
- `conditional()`: Conditional class application
- `responsive()`: Responsive class generation

### Color Utilities
- `getMetricColor()`: Gets appropriate color for metric status
- `withOpacity()`: Adds opacity to colors
- `getTextColor()`: Determines text color for background

### Metric Utilities
- `formatMetricValue()`: Formats values for display
- `getMetricStatus()`: Determines metric status from value
- `createAriaLabel()`: Creates accessible labels

### Form Utilities
- `validateField()`: Field validation by type
- `getInputState()`: Input styling based on state

## Progressive Disclosure

The design system supports 5 levels of progressive disclosure:

1. **Level 1**: Basic Cap Rate (2 fields)
2. **Level 2**: + Cash-on-Cash (4 fields)
3. **Level 3**: + DSCR (7 fields)
4. **Level 4**: Full Analysis (all basic fields)
5. **Level 5**: Institutional Features (tenant rolls, advanced metrics)

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratios meet accessibility standards
- Focus indicators for keyboard navigation
- Screen reader support with proper ARIA labels
- Reduced motion support for accessibility preferences

### Keyboard Navigation
- Tab order follows logical flow
- Focus indicators are clearly visible
- Skip links for efficient navigation
- All interactive elements are keyboard accessible

## Performance

### Optimizations
- Lazy loading of complex components
- Debounced form inputs
- Efficient re-renders with React.memo
- Optimized bundle size with tree shaking

### Device Adaptation
- Responsive design for all screen sizes
- Performance mode for slower devices
- Reduced animations on low-end devices
- Efficient memory usage

## Integration with Existing Components

### Migration Strategy
1. **Gradual Adoption**: Start with new components, migrate existing ones
2. **Mode Support**: Add mode switching to existing components
3. **Token Usage**: Replace hardcoded values with design tokens
4. **Accessibility**: Enhance existing components with accessibility features

### Example Migration
```typescript
// Before
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Calculate
</button>

// After
import { useDesignMode, componentBuilder } from '@/lib/design-system';

function MyButton() {
  const { mode } = useDesignMode();
  const buttonClass = componentBuilder.button('primary', 'md', mode);
  
  return (
    <button className={buttonClass}>
      Calculate
    </button>
  );
}
```

## Best Practices

### Component Development
1. **Always support both modes** in new components
2. **Use design tokens** instead of hardcoded values
3. **Include accessibility features** from the start
4. **Test responsive behavior** across screen sizes
5. **Provide proper TypeScript types** for all props

### Mode Switching
1. **Preserve user preferences** in localStorage
2. **Smooth transitions** between modes
3. **Consistent behavior** across all components
4. **Clear mode indicators** in the UI

### Performance
1. **Lazy load** complex components
2. **Debounce** expensive operations
3. **Optimize** re-renders with proper dependencies
4. **Use React.memo** for pure components

## Future Enhancements

### Planned Features
- **Theme Customization**: Allow users to customize colors and branding
- **Dark Mode**: Support for dark theme preferences
- **Advanced Animations**: More sophisticated micro-interactions
- **Component Variants**: Additional component styles and layouts
- **Accessibility Enhancements**: Enhanced screen reader support

### Integration Opportunities
- **Storybook**: Component documentation and testing
- **Figma**: Design system in Figma for designers
- **Testing**: Automated visual regression testing
- **Documentation**: Interactive component documentation

## Support

For questions or issues with the design system:
1. Check this README for common usage patterns
2. Review the TypeScript types for component APIs
3. Test with both Quick Start and Professional modes
4. Ensure accessibility compliance with your implementations