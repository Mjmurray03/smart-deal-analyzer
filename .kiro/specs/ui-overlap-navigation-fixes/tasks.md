Implementation Plan

This plan addresses the following issues in the Smart Deal Analyzer project:

"Maximum update depth exceeded" in components/calculator/EnhancedDynamicInputForm.tsx (line 185).
"Event handlers cannot be passed to Client Component props" in app/layout.tsx (line 36) and other components.
"Cannot read properties of undefined (reading 'value')" in app/calculators/cap-rate/page.tsx (lines 90, 112) with incorrect validation errors for valid inputs.
UI formatting issues (overlapping input headers and boxes) in quick calculators and advanced office WALT package.

The plan also proactively fixes similar issues across the project, ensuring no modifications to lib/calculations/, using Tailwind CSS, and maintaining TypeScript compatibility.

 
1. Fix useEffect infinite loop in EnhancedDynamicInputForm.tsx

Update the useEffect hook in components/calculator/EnhancedDynamicInputForm.tsx at line 185 to prevent infinite updates.
Memoize fieldGroups using useMemo to ensure stable dependencies.
Use a functional update in setExpandedSections to avoid redundant state changes.
Add a condition to skip updates if the section is already expanded.
Apply similar fixes to other useEffect hooks in form-related components (e.g., DynamicInputForm.tsx) to prevent potential infinite loops.
Requirements: 2.1, 2.2, 2.3


 
2. Convert Server Components with event handlers to Client Components

Add "use client" to app/layout.tsx or move interactive elements (e.g., buttons with onClick) to a new Client Component (e.g., components/ClientHeader.tsx).
Audit other components (e.g., app/calculators/cap-rate/page.tsx, app/analyzer/advanced/[propertyType]/page.tsx) for event handlers and mark them as Client Components or refactor to separate interactive logic.
Ensure all interactive components (e.g., buttons, inputs) use "use client" where necessary.
Update TypeScript interfaces to reflect Client Component changes.
Requirements: 2.4, 2.5, 4.1


 
3. Resolve undefined 'value' errors in cap-rate calculator

Update app/calculators/cap-rate/page.tsx to initialize noi and purchasePrice states with useState('').
Fix onChange handlers at lines 90 and 112 to safely access e.target.value with proper TypeScript typing.
Update validation logic to accept valid positive numbers (e.g., 3030) and only flag errors for empty, non-numeric, or non-positive inputs.
Ensure components/ui/Input.tsx correctly passes the event object to onChange handlers.
Apply similar state initialization and validation fixes to other calculator pages (e.g., app/calculators/irr/page.tsx, app/calculators/dscr/page.tsx).
Requirements: 4.2, 4.3, 4.4


 
4. Fix UI formatting issues in quick calculators and advanced office WALT package

Update components/calculator/DynamicInputForm.tsx and components/calculator/EnhancedDynamicInputForm.tsx to fix overlapping input headers and boxes.
Use Tailwind CSS flex, grid, and gap utilities to ensure proper spacing (e.g., gap-4, p-4) between headers, subheaders, and input fields.
Adjust z-index and position properties to prevent headers from appearing behind input boxes.
Implement responsive breakpoints (375px, 768px, 1024px) to ensure clear visibility on all screen sizes.
Apply fixes to app/calculators/cap-rate/page.tsx and app/analyzer/advanced/office/page.tsx (WALT package) to ensure consistent form layouts.
Requirements: 1.1, 1.2, 1.3, 3.1, 3.2


 
5. Create reusable form layout utilities to prevent future formatting issues

Create a FormContainer component in components/ui/FormContainer.tsx with responsive padding and spacing.
Implement a FormSection component for consistent section layouts with collapsible headers.
Add a FormInputGroup component for grouped inputs with clear header visibility.
Use Tailwind CSS utilities (flex, grid, gap-4, z-index) to enforce consistent spacing and hierarchy.
Update quick calculators and advanced analyzer pages to use these components.
Requirements: 1.1, 1.2, 3.1, 3.4


 
6. Optimize form state management and validation

Implement debounced validation in app/calculators/cap-rate/page.tsx and other calculator pages to reduce re-renders.
Create a useFormState hook in lib/hooks/useFormState.ts for controlled form state with batch updates.
Add memoization (useMemo, React.memo) for expensive form field rendering in EnhancedDynamicInputForm.tsx.
Fix validation logic across all calculator pages to correctly handle positive numbers and avoid false error messages.
Test form performance with large datasets (e.g., WALT package inputs).
Requirements: 4.1, 4.2, 4.3, 4.4


 
7. Implement navigation guard to prevent state-related errors

Create a useNavigationGuard hook in lib/hooks/useNavigationGuard.ts to manage navigation state and prevent rapid state updates.
Add debouncing to navigation events to avoid multiple simultaneous transitions.
Implement cleanup mechanisms for navigation state on component unmount.
Apply the hook to app/analyzer/* and app/calculators/* pages to stabilize navigation.
Requirements: 2.1, 2.2, 2.3, 2.5


 
8. Add error boundaries for robust error handling

Create an ErrorBoundary component in components/ui/ErrorBoundary.tsx to catch and display errors gracefully.
Wrap calculator and analyzer pages (e.g., app/calculators/cap-rate/page.tsx, app/analyzer/advanced/[propertyType]/page.tsx) with the ErrorBoundary.
Add error recovery mechanisms (e.g., reset state, retry navigation).
Test error scenarios (e.g., invalid inputs, navigation failures).
Requirements: 2.2, 2.5, 4.5


 
9. Verify fixes and maintain calculation logic integrity

Run npm run build to ensure no TypeScript or build errors.
Test the user flow: landing page → quick calculator (cap-rate) → advanced analyzer (office WALT) → results → PDF generation.
Verify input fields and headers are visible without overlap on all screen sizes (375px, 768px, 1024px).
Ensure valid inputs (e.g., 3030 for NOI) are accepted without validation errors.
Confirm navigation works without infinite loops or 404s.
Verify lib/calculations/ logic remains unchanged and functional.
Requirements: 5.1, 5.2, 5.3, 5.4, 5.5


