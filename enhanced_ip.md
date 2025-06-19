# Enhanced Smart Deal Analyzer - Implementation Plan

## New User Flow

1. **Property Type Selection** → 2. **Calculation Package/Custom Selection** → 3. **Dynamic Input Form** → 4. **Results**

## Phase 1: Define Calculation Packages

### Property Type Packages

```typescript
// lib/calculations/packages.ts

export interface CalculationPackage {
  name: string;
  description: string;
  includedMetrics: (keyof MetricFlags)[];
  requiredFields: (keyof PropertyData)[];
}

export const propertyPackages: Record<string, CalculationPackage[]> = {
  office: [
    {
      name: "Quick Analysis",
      description: "Basic metrics for initial screening",
      includedMetrics: ['capRate', 'cashOnCash'],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow']
    },
    {
      name: "Financing Analysis",
      description: "Debt coverage and returns with financing",
      includedMetrics: ['capRate', 'cashOnCash', 'dscr'],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm']
    },
    {
      name: "Full Investment Analysis",
      description: "Complete analysis with projections",
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven'],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 'operatingExpenses', 'grossIncome']
    }
  ],
  retail: [
    {
      name: "Retail Quick Look",
      description: "Key metrics for retail properties",
      includedMetrics: ['capRate', 'cashOnCash', 'breakeven'],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow', 'operatingExpenses', 'grossIncome']
    },
    // ... more retail packages
  ],
  industrial: [
    {
      name: "Industrial Basics",
      description: "Core metrics for warehouses and industrial",
      includedMetrics: ['capRate', 'dscr'],
      requiredFields: ['purchasePrice', 'currentNOI', 'loanAmount', 'interestRate', 'loanTerm']
    },
    // ... more industrial packages
  ],
  multifamily: [
    {
      name: "Apartment Quick Analysis",
      description: "Per-unit and overall returns",
      includedMetrics: ['capRate', 'cashOnCash', 'dscr'],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm']
    },
    // ... more multifamily packages
  ]
};

// Additional individual metrics for custom selection
export const allMetrics = {
  // Basic Metrics
  capRate: {
    name: "Cap Rate",
    category: "Basic",
    requiredFields: ['purchasePrice', 'currentNOI']
  },
  cashOnCash: {
    name: "Cash-on-Cash Return",
    category: "Basic",
    requiredFields: ['totalInvestment', 'annualCashFlow']
  },
  
  // Debt Metrics
  dscr: {
    name: "Debt Service Coverage Ratio",
    category: "Debt",
    requiredFields: ['currentNOI', 'loanAmount', 'interestRate', 'loanTerm']
  },
  loanToValue: {
    name: "Loan-to-Value Ratio",
    category: "Debt",
    requiredFields: ['loanAmount', 'purchasePrice']
  },
  
  // Advanced Metrics
  irr: {
    name: "Internal Rate of Return",
    category: "Advanced",
    requiredFields: ['totalInvestment', 'annualCashFlow', 'currentNOI', 'projectedNOI']
  },
  npv: {
    name: "Net Present Value",
    category: "Advanced",
    requiredFields: ['totalInvestment', 'annualCashFlow', 'discountRate', 'holdingPeriod']
  },
  
  // Property-Specific Metrics
  pricePerSF: {
    name: "Price per Square Foot",
    category: "Property",
    requiredFields: ['purchasePrice', 'squareFootage']
  },
  rentPerSF: {
    name: "Rent per Square Foot",
    category: "Property",
    requiredFields: ['grossIncome', 'squareFootage']
  },
  
  // Multifamily Specific
  pricePerUnit: {
    name: "Price per Unit",
    category: "Multifamily",
    requiredFields: ['purchasePrice', 'numberOfUnits']
  },
  grossRentMultiplier: {
    name: "Gross Rent Multiplier",
    category: "Multifamily",
    requiredFields: ['purchasePrice', 'grossIncome']
  }
};
```

## Phase 2: New UI Components

### 1. Property Type Selector
```typescript
// components/calculator/PropertyTypeSelector.tsx
interface PropertyTypeSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
}

// Visual cards for each property type with icons
```

### 2. Calculation Selector
```typescript
// components/calculator/CalculationSelector.tsx
interface CalculationSelectorProps {
  propertyType: string;
  onSelectPackage: (metrics: string[]) => void;
  onSelectCustom: (metrics: string[]) => void;
}

// Shows packages or custom metric selection
```

### 3. Dynamic Input Form
```typescript
// components/calculator/DynamicInputForm.tsx
interface DynamicInputFormProps {
  requiredFields: string[];
  optionalFields?: string[];
  data: PropertyData;
  onChange: (data: PropertyData) => void;
}

// Only shows fields needed for selected calculations
```

## Phase 3: Enhanced Calculations

### New Metrics to Add
```typescript
// lib/calculations/metrics.ts additions

// Loan-to-Value
export function calculateLTV(loanAmount: number, purchasePrice: number): number {
  return (loanAmount / purchasePrice) * 100;
}

// Price per Square Foot
export function calculatePricePerSF(purchasePrice: number, squareFootage: number): number {
  return purchasePrice / squareFootage;
}

// Gross Rent Multiplier
export function calculateGRM(purchasePrice: number, grossIncome: number): number {
  return purchasePrice / grossIncome;
}

// Net Present Value
export function calculateNPV(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number {
  let npv = -initialInvestment;
  cashFlows.forEach((cf, year) => {
    npv += cf / Math.pow(1 + discountRate, year + 1);
  });
  return npv;
}

// More sophisticated IRR using Newton's method
export function calculateIRR(
  initialInvestment: number,
  cashFlows: number[]
): number {
  // Implementation here
}
```

## Phase 4: New App Flow

### Updated app/analyzer/page.tsx Structure
```typescript
export default function AnalyzerPage() {
  const [step, setStep] = useState<'property-type' | 'calculations' | 'analysis'>('property-type');
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [propertyData, setPropertyData] = useState<PropertyData>({});

  // Step 1: Select Property Type
  // Step 2: Select Calculation Package or Custom
  // Step 3: Fill Required Fields
  // Step 4: View Results
}
```

## Implementation Steps

### Step 1: Create New Types and Packages
1. Add new PropertyData fields (squareFootage, numberOfUnits, etc.)
2. Create calculation packages configuration
3. Define field metadata (labels, helpers, validation)

### Step 2: Build Selection UI
1. Property type selector with nice cards/icons
2. Package selector with descriptions
3. Custom metric selector with categories

### Step 3: Implement Dynamic Form
1. Field registry with all possible inputs
2. Dynamic form that shows only required fields
3. Progress indicator showing completion

### Step 4: Add New Calculations
1. Implement additional metric calculations
2. Update assessment logic for new metrics
3. Enhance PDF report with selected metrics only

### Step 5: Polish UX
1. Add transitions between steps
2. Allow going back to change selections
3. Save/load analysis configurations

## Example User Journey

1. **User selects "Office"** → Sees 3 packages
2. **Selects "Financing Analysis"** → Form shows only 7 required fields
3. **Fills in the 7 fields** → Sees real-time validation
4. **Views results** → Only sees Cap Rate, Cash-on-Cash, and DSCR
5. **Can add more metrics** → Form dynamically adds needed fields

## Benefits
- Users aren't overwhelmed with unnecessary fields
- Faster to get initial results
- Can progressively add complexity
- Property-type specific guidance
- Better mobile experience with fewer fields