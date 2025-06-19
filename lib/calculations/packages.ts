import { MetricFlags, PropertyData, CalculationPackage } from './types';
import { getAssetCalculationFunctions, validateAssetDataRequirements } from './asset-metrics';

export const propertyPackages: Record<string, CalculationPackage[]> = {
  office: [
    {
      id: 'office-basic',
      name: 'Office Quick Analysis',
      description: 'Basic metrics for office properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'office-complete',
      name: 'Complete Office Analysis',
      description: 'Full analysis for office properties',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'office-institutional',
      name: 'Institutional Office Analysis',
      description: 'Comprehensive institutional-grade office analysis with tenant and lease analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'rentableSquareFeet', 'numberOfTenants', 
                      'averageRentPSF', 'weightedAverageLeaseTerm'] as (keyof PropertyData)[]
    }
  ],
  retail: [
    {
      id: 'retail-basic',
      name: 'Retail Quick Analysis',
      description: 'Basic metrics for retail properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-complete',
      name: 'Complete Retail Analysis',
      description: 'Full analysis for retail properties',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-institutional',
      name: 'Institutional Retail Analysis',
      description: 'Comprehensive retail analysis with sales performance and trade area analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'grossLeasableArea', 'salesPerSF', 
                      'occupancyCostRatio', 'trafficCount'] as (keyof PropertyData)[]
    }
  ],
  industrial: [
    {
      id: 'industrial-basic',
      name: 'Industrial Quick Analysis',
      description: 'Basic metrics for industrial properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-investment',
      name: 'Investment Analysis',
      description: 'Returns and financing metrics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'roi'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment',
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-institutional',
      name: 'Institutional Industrial Analysis',
      description: 'Comprehensive industrial analysis with building functionality and logistics analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'clearHeight', 'numberOfDockDoors', 
                      'powerCapacity', 'distanceToHighway'] as (keyof PropertyData)[]
    }
  ],
  multifamily: [
    {
      id: 'multifamily-basic',
      name: 'Multifamily Quick Analysis',
      description: 'Basic metrics for multifamily properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-complete',
      name: 'Complete Multifamily Analysis',
      description: 'Full analysis for multifamily properties',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-institutional',
      name: 'Institutional Multifamily Analysis',
      description: 'Comprehensive multifamily analysis with revenue performance and market analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerUnit', 'grm', 'egi'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'numberOfUnits', 'currentOccupancy', 
                      'averageRentPerUnit', 'unitMix'] as (keyof PropertyData)[]
    }
  ],
  'mixed-use': [
    {
      id: 'mixed-basic',
      name: 'Mixed-Use Quick Analysis',
      description: 'Basic metrics for mixed-use properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'mixed-complete',
      name: 'Complete Mixed-Use Analysis',
      description: 'Full analysis for mixed residential/commercial',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'mixed-institutional',
      name: 'Institutional Mixed-Use Analysis',
      description: 'Comprehensive mixed-use analysis with component performance and synergy analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'totalSquareFootage', 'propertyType'] as (keyof PropertyData)[]
    }
  ]
};

// Additional individual metrics for custom selection
export const allMetrics = {
  // Basic Metrics
  capRate: {
    name: "Cap Rate",
    category: "Basic",
    description: "Annual return on investment based on property's net operating income",
    requiredFields: ['purchasePrice', 'currentNOI'] as (keyof PropertyData)[]
  },
  cashOnCash: {
    name: "Cash-on-Cash Return",
    category: "Basic",
    description: "Annual return on actual cash invested in the property",
    requiredFields: ['totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
  },
  
  // Debt Metrics
  dscr: {
    name: "Debt Service Coverage Ratio",
    category: "Debt",
    description: "Ability to cover debt payments with property income",
    requiredFields: ['currentNOI', 'loanAmount', 'interestRate', 'loanTerm'] as (keyof PropertyData)[]
  },
  ltv: {
    name: "Loan-to-Value Ratio",
    category: "Debt",
    description: "Ratio of loan amount to property value",
    requiredFields: ['loanAmount', 'purchasePrice'] as (keyof PropertyData)[]
  },
  
  // Advanced Metrics
  irr: {
    name: "Internal Rate of Return",
    category: "Advanced",
    description: "Expected annual return over the investment period",
    requiredFields: ['totalInvestment', 'annualCashFlow', 'currentNOI', 'projectedNOI'] as (keyof PropertyData)[]
  },
  roi: {
    name: "Return on Investment",
    category: "Advanced",
    description: "Total return on investment relative to initial cost",
    requiredFields: ['totalInvestment', 'currentNOI', 'projectedNOI'] as (keyof PropertyData)[]
  },
  breakeven: {
    name: "Breakeven Analysis",
    category: "Advanced",
    description: "Point where income equals expenses",
    requiredFields: ['operatingExpenses', 'grossIncome', 'loanAmount', 'interestRate', 'loanTerm'] as (keyof PropertyData)[]
  },
  
  // Property-Specific Metrics
  pricePerSF: {
    name: "Price per Square Foot",
    category: "Property",
    description: "Property value per square foot of space",
    requiredFields: ['purchasePrice', 'squareFootage'] as (keyof PropertyData)[]
  },
  
  // Multifamily Specific
  pricePerUnit: {
    name: "Price per Unit",
    category: "Multifamily",
    description: "Property value per residential unit",
    requiredFields: ['purchasePrice', 'numberOfUnits'] as (keyof PropertyData)[]
  },
  grm: {
    name: "Gross Rent Multiplier",
    category: "Multifamily",
    description: "Ratio of property price to gross rental income",
    requiredFields: ['purchasePrice', 'grossIncome'] as (keyof PropertyData)[]
  },
  egi: {
    name: "Effective Gross Income",
    category: "Multifamily",
    description: "Gross income adjusted for vacancy and collection losses",
    requiredFields: ['grossIncome', 'occupancyRate'] as (keyof PropertyData)[]
  }
};

// Enhanced function to get required fields with asset-specific validation
export function getRequiredFields(
  metrics: (keyof MetricFlags)[],
  propertyData: Partial<PropertyData>
): (keyof PropertyData)[] {
  const requiredFields = new Set<keyof PropertyData>();
  
  // Add fields required by selected metrics
  metrics.forEach(metric => {
    const metricInfo = allMetrics[metric as keyof typeof allMetrics];
    if (metricInfo) {
      metricInfo.requiredFields.forEach((field: keyof PropertyData) => requiredFields.add(field));
    }
  });
  
  // Add asset-specific required fields if property type is specified
  if (propertyData.propertyType) {
    const validation = propertyData.propertyType ? 
      validateAssetDataRequirements(propertyData as PropertyData, propertyData.propertyType) :
      { isValid: true, missingFields: [] };
    validation.missingFields.forEach(field => {
      requiredFields.add(field as keyof PropertyData);
    });
  }
  
  return Array.from(requiredFields);
}

// New function to get asset-specific package recommendations
export function getAssetPackageRecommendations(
  propertyData: Partial<PropertyData>
): { packageId: string; name: string; description: string; matchScore: number }[] {
  if (!propertyData.propertyType) {
    return [];
  }
  
  const packages = propertyPackages[propertyData.propertyType] || [];
  const recommendations = packages.map(pkg => {
    const availableFields = pkg.requiredFields.filter(field => 
      propertyData[field] !== undefined && propertyData[field] !== null
    );
    const matchScore = (availableFields.length / pkg.requiredFields.length) * 100;
    
    return {
      packageId: pkg.id,
      name: pkg.name,
      description: pkg.description,
      matchScore: Math.round(matchScore)
    };
  });
  
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

// New function to get available asset-specific analysis functions
export function getAvailableAssetAnalysis(
  propertyData: Partial<PropertyData>
): { functionName: string; description: string; available: boolean; requirements: string[] }[] {
  if (!propertyData.propertyType) {
    return [];
  }
  
  try {
    const assetFunctions = getAssetCalculationFunctions(propertyData.propertyType);
    const validation = propertyData.propertyType ? 
      validateAssetDataRequirements(propertyData as PropertyData, propertyData.propertyType) :
      { isValid: true, missingFields: [] };
    
    return Object.entries(assetFunctions).map(([functionName, func]) => ({
      functionName,
      description: getFunctionDescription(functionName),
      available: validation.isValid,
      requirements: validation.missingFields
    }));
  } catch (error) {
    return [];
  }
}

// Helper function to get descriptions for asset-specific functions
function getFunctionDescription(functionName: string): string {
  const descriptions: Record<string, string> = {
    // Office functions
    'analyzeTenantFinancialHealth': 'Comprehensive tenant credit and financial health analysis',
    'analyzeLeaseEconomics': 'Detailed lease economics and valuation analysis',
    'analyzeBuildingOperations': 'Building systems and operational efficiency analysis',
    'analyzeWorkplaceStrategy': 'Post-COVID workplace strategy and space utilization analysis',
    'analyzeMarketPositioning': 'Market positioning and competitive analysis',
    
    // Retail functions
    'analyzeSalesPerformance': 'Sales performance and tenant productivity analysis',
    'analyzeCoTenancy': 'Co-tenancy risk and anchor dependency analysis',
    'analyzeTradeArea': 'Trade area demographics and market analysis',
    'analyzePercentageRent': 'Percentage rent optimization analysis',
    'analyzeExpenseRecovery': 'Expense recovery and CAM analysis',
    'analyzeRedevelopmentPotential': 'Redevelopment and highest-best-use analysis',
    
    // Industrial functions
    'analyzeBuildingFunctionality': 'Building functionality and efficiency analysis',
    'analyzeLocationLogistics': 'Location logistics and accessibility analysis',
    'analyzeColdStorage': 'Cold storage facility analysis',
    'analyzeLastMileFacility': 'Last-mile delivery facility analysis',
    
    // Multifamily functions
    'analyzeRevenuePerformance': 'Revenue performance and rent roll analysis',
    'analyzeOperatingPerformance': 'Operating performance and expense analysis',
    'analyzeMarketPosition': 'Market position and competitive analysis',
    'analyzeValueAddPotential': 'Value-add renovation and improvement analysis',
    
    // Mixed-use functions
    'analyzeMixedUsePerformance': 'Mixed-use component performance analysis',
    'analyzeCrossUseInteractions': 'Cross-use synergies and conflicts analysis',
    'analyzeOperationalIntegration': 'Operational integration and efficiency analysis',
    'analyzeMixedUseDevelopment': 'Mixed-use development potential analysis'
  };
  
  return descriptions[functionName] || 'Asset-specific analysis function';
}

export const fieldMetadata: Partial<Record<keyof PropertyData, {
  label: string;
  category: 'basic' | 'financial' | 'loan' | 'property' | 'projection';
  type: 'number' | 'text' | 'percentage';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helperText?: string;
}>> = {
  // Basic Information
  propertyType: {
    label: 'Property Type',
    category: 'basic',
    type: 'text',
    helperText: 'Select the type of property'
  },
  purchasePrice: {
    label: 'Purchase Price',
    category: 'basic',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total purchase price of the property'
  },
  
  // Financial Information
  currentNOI: {
    label: 'Current NOI',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Current Net Operating Income'
  },
  projectedNOI: {
    label: 'Projected NOI (Year 5)',
    placeholder: '$0',
    helperText: 'Expected NOI in year 5',
    category: 'projection',
    type: 'number'
  },
  grossIncome: {
    label: 'Gross Income',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total income before expenses'
  },
  operatingExpenses: {
    label: 'Operating Expenses',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total annual operating expenses'
  },
  annualCashFlow: {
    label: 'Annual Cash Flow',
    category: 'financial',
    type: 'number',
    prefix: '$',
    step: 1000,
    helperText: 'Net cash flow after all expenses'
  },
  totalInvestment: {
    label: 'Total Investment',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total amount invested in the property'
  },
  occupancyRate: {
    label: 'Occupancy Rate',
    category: 'financial',
    type: 'percentage',
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Current occupancy percentage'
  },
  averageRent: {
    label: 'Average Rent',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 100,
    helperText: 'Average rent per unit'
  },
  
  // Loan Information
  loanAmount: {
    label: 'Loan Amount',
    category: 'loan',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total loan amount'
  },
  interestRate: {
    label: 'Interest Rate',
    category: 'loan',
    type: 'percentage',
    min: 0,
    max: 100,
    step: 0.125,
    helperText: 'Annual interest rate'
  },
  loanTerm: {
    label: 'Loan Term (Years)',
    category: 'loan',
    type: 'number',
    min: 1,
    max: 30,
    step: 1,
    helperText: 'Length of the loan in years'
  },
  
  // Property Details
  squareFootage: {
    label: 'Square Footage',
    category: 'property',
    type: 'number',
    min: 0,
    step: 100,
    helperText: 'Total square footage of the property'
  },
  numberOfUnits: {
    label: 'Number of Units',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1,
    helperText: 'Total number of units'
  },
  parkingSpaces: {
    label: 'Parking Spaces',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1,
    helperText: 'Number of parking spaces'
  },
  
  // Projections & Analysis
  discountRate: {
    label: 'Discount Rate',
    category: 'projection',
    type: 'percentage',
    min: 0,
    max: 100,
    step: 0.5,
    helperText: 'Discount rate for NPV calculations'
  },
  holdingPeriod: {
    label: 'Holding Period (Years)',
    category: 'projection',
    type: 'number',
    min: 1,
    max: 30,
    step: 1,
    helperText: 'Expected holding period'
  },
  downPayment: {
    label: 'Down Payment',
    category: 'loan',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Initial down payment amount'
  },
  netOperatingIncome: {
    label: 'Net Operating Income',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Net Operating Income (NOI)'
  },
  annualDebtService: {
    label: 'Annual Debt Service',
    category: 'loan',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Annual loan payments'
  }
}; 
