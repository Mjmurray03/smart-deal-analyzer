# Implementation Plan for Advanced Asset-Class Metrics

## Phase 1: Enhanced Data Model

### Expand PropertyData Interface
```typescript
// lib/calculations/types.ts - Enhanced PropertyData

export interface PropertyData {
  // === EXISTING FIELDS ===
  propertyType?: 'office' | 'retail' | 'industrial' | 'multifamily' | 'mixed-use';
  purchasePrice?: number;
  currentNOI?: number;
  // ... existing fields ...

  // === COMMON FIELDS ===
  propertyName?: string;
  address?: string;
  yearBuilt?: number;
  lastRenovated?: number;
  totalSquareFootage?: number;
  landArea?: number;
  zoningClassification?: string;
  
  // === OFFICE SPECIFIC ===
  rentableSquareFeet?: number;
  usableSquareFeet?: number;
  numberOfFloors?: number;
  typicalFloorPlate?: number;
  parkingSpaces?: number;
  parkingRatio?: number; // per 1000 RSF
  averageFloorClearHeight?: number;
  numberOfElevators?: number;
  leedCertification?: 'None' | 'Certified' | 'Silver' | 'Gold' | 'Platinum';
  energyStarScore?: number;
  
  // Tenant Information
  numberOfTenants?: number;
  largestTenantSF?: number;
  largestTenantName?: string;
  topFiveTenantsSF?: number;
  weightedAverageLeaseTerm?: number;
  averageRentPSF?: number;
  marketRentPSF?: number;
  
  // Lease Rollover
  currentYearExpiringSF?: number;
  nextYearExpiringSF?: number;
  year3ExpiringSF?: number;
  year4ExpiringSF?: number;
  year5ExpiringSF?: number;
  
  // === RETAIL SPECIFIC ===
  grossLeasableArea?: number;
  anchorTenants?: string[];
  anchorGLA?: number;
  inlineGLA?: number;
  padSites?: number;
  salesPerSF?: number;
  occupancyCostRatio?: number;
  parkingRatioRetail?: number; // per 1000 SF GLA
  
  // Trade Area Demographics
  population3Mile?: number;
  population5Mile?: number;
  avgHHIncome3Mile?: number;
  avgHHIncome5Mile?: number;
  trafficCount?: number;
  
  // === INDUSTRIAL SPECIFIC ===
  clearHeight?: number;
  numberOfDockDoors?: number;
  dockDoorRatio?: number; // per 10,000 SF
  numberOfDriveInDoors?: number;
  truckCourtDepth?: number;
  columnSpacing?: string; // e.g., "50x60"
  floorThickness?: number; // inches
  floorLoadCapacity?: number; // PSF
  powerCapacity?: number; // KW
  ceilingLoadCapacity?: number; // PSF
  
  // Location Attributes
  distanceToHighway?: number; // miles
  distanceToPort?: number;
  distanceToAirport?: number;
  distanceToRail?: number;
  hasRailSiding?: boolean;
  
  // === MULTIFAMILY SPECIFIC ===
  numberOfUnits?: number;
  unitMix?: {
    studio: number;
    oneBed: number;
    twoBed: number;
    threeBed: number;
  };
  averageUnitSize?: number;
  currentOccupancy?: number;
  marketOccupancy?: number;
  averageRentPerUnit?: number;
  marketRentPerUnit?: number;
  
  // Unit-Level Rent Roll
  avgRentStudio?: number;
  avgRent1Bed?: number;
  avgRent2Bed?: number;
  avgRent3Bed?: number;
  marketRentStudio?: number;
  marketRent1Bed?: number;
  marketRent2Bed?: number;
  marketRent3Bed?: number;
  
  // Amenities & Other Income
  parkingIncome?: number;
  petFeeIncome?: number;
  storageIncome?: number;
  otherIncome?: number;
  utilityRecoveryRatio?: number;
  
  // === FINANCIAL DETAILS ===
  // Operating Expenses Breakdown
  realEstateTaxes?: number;
  insurance?: number;
  utilities?: number;
  repairsAndMaintenance?: number;
  managementFees?: number;
  payroll?: number;
  marketing?: number;
  administrative?: number;
  
  // Capital Expenditures
  immediateCapEx?: number;
  year1CapEx?: number;
  year2CapEx?: number;
  year3CapEx?: number;
  year4CapEx?: number;
  year5CapEx?: number;
  
  // Revenue Details
  baseRentalRevenue?: number;
  percentageRent?: number;
  camReimbursements?: number;
  taxReimbursements?: number;
  insuranceReimbursements?: number;
  otherReimbursements?: number;
  
  // Debt Details (Enhanced)
  loanType?: 'Fixed' | 'Floating' | 'Construction' | 'Bridge';
  prepaymentPenalty?: string;
  recourse?: 'Full' | 'Limited' | 'Non-Recourse';
  debtYield?: number;
}
```

## Phase 2: New Calculation Functions

### Office-Specific Calculations
```typescript
// lib/calculations/office-metrics.ts

export function calculateWALT(tenantData: TenantInfo[]): number {
  // Weighted Average Lease Term calculation
  const totalRent = tenantData.reduce((sum, t) => sum + t.annualRent, 0);
  const weightedTerm = tenantData.reduce((sum, t) => 
    sum + (t.annualRent * t.remainingLeaseTerm), 0
  );
  return weightedTerm / totalRent;
}

export function calculateLoadFactor(rentableSF: number, usableSF: number): number {
  return ((rentableSF - usableSF) / usableSF) * 100;
}

export function calculateEffectiveRent(
  baseRent: number,
  freeMonths: number,
  leaseTerm: number,
  tiAllowance: number,
  leasingCommission: number,
  discountRate: number = 0.08
): number {
  // NPV of all lease cash flows
  // Complex calculation involving present value
}

export function calculateTenantConcentrationRisk(tenantData: TenantInfo[]): {
  hhi: number;
  topTenantPercent: number;
  topFivePercent: number;
} {
  // Herfindahl-Hirschman Index calculation
}
```

### Retail-Specific Calculations
```typescript
// lib/calculations/retail-metrics.ts

export function calculateOccupancyCostRatio(
  tenantRent: number,
  tenantSales: number
): number {
  return (tenantRent / tenantSales) * 100;
}

export function calculatePercentageRent(
  sales: number,
  breakpoint: number,
  percentageRate: number,
  baseRent: number
): number {
  const overage = Math.max(0, sales - breakpoint);
  return Math.max(baseRent, overage * percentageRate);
}

export function calculateTradeAreaScore(demographics: TradeAreaData): number {
  // Weighted scoring based on population, income, competition
}
```

### Industrial-Specific Calculations
```typescript
// lib/calculations/industrial-metrics.ts

export function calculateCubicFootage(
  squareFootage: number,
  clearHeight: number
): number {
  return squareFootage * clearHeight;
}

export function calculateDockDoorRatio(
  numberOfDockDoors: number,
  squareFootage: number
): number {
  return (numberOfDockDoors / squareFootage) * 10000;
}

export function calculateLocationScore(distances: LocationDistances): number {
  // Weighted scoring based on proximity to transportation
}

export function calculateColdStorageMetrics(
  cubicFeet: number,
  temperatureZones: TempZone[],
  energyCost: number
): ColdStorageAnalysis {
  // Specialized cold storage calculations
}
```

### Multifamily-Specific Calculations
```typescript
// lib/calculations/multifamily-metrics.ts

export function calculateRevPAU(
  totalRevenue: number,
  totalUnits: number,
  occupancy: number
): number {
  return totalRevenue / (totalUnits * occupancy);
}

export function calculateLossToLease(
  currentRents: UnitRentRoll[],
  marketRents: MarketRentData
): LossToLeaseAnalysis {
  // Unit-by-unit comparison of current vs market
}

export function calculateUnitMixEfficiency(
  unitMix: UnitMixData,
  revenues: RevenueByType
): UnitMixAnalysis {
  // Revenue per SF by unit type
}
```

## Phase 3: Asset-Class Specific Packages

### Office Investment Packages
```typescript
// lib/calculations/packages/office-packages.ts

export const officePackages: CalculationPackage[] = [
  {
    id: 'office-institutional-acquisition',
    name: 'Institutional Acquisition Analysis',
    description: 'Comprehensive analysis for core/core-plus office acquisitions',
    includedMetrics: [
      'capRate', 'cashOnCash', 'dscr', 'irr', 'debtYield',
      'walt', 'loadFactor', 'effectiveRent', 'tenantConcentration',
      'leaseRollover', 'expenseReimbursementRatio', 'parkingRatio'
    ],
    requiredFields: [
      // All standard fields plus office-specific
      'rentableSquareFeet', 'usableSquareFeet', 'numberOfTenants',
      'weightedAverageLeaseTerm', 'parkingSpaces', // etc...
    ],
    templates: ['argus', 'institutionalMemo', 'icMemo']
  },
  {
    id: 'office-value-add',
    name: 'Value-Add Repositioning Analysis',
    description: 'For B to A property upgrades with lease-up risk',
    includedMetrics: [
      'capRate', 'stabilizedYield', 'yieldOnCost', 'irrLevered',
      'equityMultiple', 'renovationROI', 'leaseUpVelocity',
      'marketRentGrowth', 'tenantImprovementAnalysis'
    ],
    requiredFields: [
      // Includes renovation costs, market rents, lease-up assumptions
    ]
  },
  {
    id: 'office-life-sciences-conversion',
    name: 'Life Sciences Conversion Feasibility',
    description: 'Analyze office to lab conversion potential',
    includedMetrics: [
      'conversionCostPSF', 'labRentPremium', 'developmentYield',
      'hvacCapacityAnalysis', 'floorLoadAnalysis', 'vibrationStudy'
    ],
    requiredFields: [
      // Technical specifications, lab market rents, conversion costs
    ]
  }
];
```

### Retail Investment Packages
```typescript
// lib/calculations/packages/retail-packages.ts

export const retailPackages: CalculationPackage[] = [
  {
    id: 'retail-grocery-anchored',
    name: 'Grocery-Anchored Center Analysis',
    description: 'Necessity-based retail with credit tenant',
    includedMetrics: [
      'capRate', 'salesPerSF', 'occupancyCostRatio', 'percentageRent',
      'anchorSalesProductivity', 'inlineNOIPercent', 'camRecovery',
      'tradeAreaDemographics', 'competitionAnalysis'
    ]
  },
  {
    id: 'retail-redevelopment',
    name: 'Retail Redevelopment Analysis',
    description: 'Big box transformation or densification',
    includedMetrics: [
      'existingNOI', 'redevelopmentYield', 'phasedDelivery',
      'anchorBackfill', 'padDevelopmentValue', 'mixedUseConversion'
    ]
  }
];
```

## Phase 4: Enhanced UI Components

### Property-Specific Input Forms
```typescript
// components/calculator/property-forms/OfficeInputForm.tsx
// Organized sections:
// - Basic Property Info
// - Physical Characteristics  
// - Tenant Information
// - Lease Rollover Schedule
// - Operating Expenses Detail
// - Market Assumptions

// Similar for Retail, Industrial, Multifamily
```

### Advanced Metrics Display
```typescript
// components/calculator/metrics/AdvancedMetricsGrid.tsx
// Grouped display:
// - Financial Returns
// - Risk Metrics
// - Property-Specific KPIs
// - Market Positioning
// - Sensitivity Analysis
```

### Professional Report Templates
```typescript
// components/report/templates/InstitutionalMemo.tsx
// Sections:
// - Executive Summary
// - Investment Thesis
// - Property Overview
// - Market Analysis  
// - Financial Analysis
// - Risk Factors
// - Exit Strategy
// - Appendices
```

## Phase 5: Integration Steps

### 1. Database Schema Update
- Extend PropertyData interface
- Create sub-interfaces for each property type
- Add validation rules for required fields

### 2. Calculation Engine Enhancement
- Import asset-specific calculation modules
- Update main calculateMetrics to route by property type
- Add error handling for missing specialized data

### 3. Package System Upgrade
- Create hierarchical package structure
- Add package categories (Core, Value-Add, Development, etc.)
- Include recommended templates with each package

### 4. UI/UX Improvements
- Progressive disclosure for complex forms
- Contextual help for each metric
- Benchmark data integration
- Sensitivity analysis tools

### 5. Reporting Enhancement
- Multiple report templates
- Custom branding options
- Excel export with full models
- API integration readiness

## Phase 6: Advanced Features Roadmap

### Near-term (Months 1-2)
1. Core asset-specific calculations
2. Enhanced packages for each property type
3. Improved data input forms
4. Basic sensitivity analysis

### Medium-term (Months 3-4)
1. Monte Carlo simulation
2. Regression-based forecasting
3. Competitive set analysis
4. API integrations (CoStar, REIS)

### Long-term (Months 5-6)
1. Machine learning rent prediction
2. Portfolio optimization tools
3. Fund-level reporting
4. White-label capabilities

## Testing & Validation

### Test Cases by Asset Class
- Office: Trophy CBD vs Suburban
- Retail: Regional Mall vs Strip Center
- Industrial: Last-mile vs Bulk Distribution
- Multifamily: Urban High-rise vs Garden Style

### Benchmark Against
- Argus outputs
- REPE fund models
- Broker packages
- Appraisal reports