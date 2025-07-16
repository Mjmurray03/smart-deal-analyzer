import { MetricFlags, PropertyData, CalculationPackage } from './types';
import { getAssetCalculationFunctions, validateAssetDataRequirements } from './asset-metrics';
// Import enhanced packages
import { enhancedOfficePackages } from './packages/office-packages-enhanced';
import { enhancedRetailPackages } from './packages/retail-packages-enhanced';
import { enhancedIndustrialPackages } from './packages/industrial-packages-enhanced';
import { enhancedMultifamilyPackages } from './packages/multifamily-packages-enhanced';
import { enhancedMixedUsePackages } from './packages/mixed-use-packages-enhanced';

// Quick packages for back-of-envelope calculations
export const quickPackages: Record<string, CalculationPackage[]> = {
  office: [
    {
      id: 'office-quick-valuation',
      name: 'Quick Property Valuation',
      description: 'Basic valuation metrics for office properties',
      includedMetrics: ['capRate', 'pricePerSF', 'grm'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalSF'] as (keyof PropertyData)[]
    },
    {
      id: 'office-quick-returns',
      name: 'Quick Return Analysis',
      description: 'Essential return metrics for office investments',
      includedMetrics: ['capRate', 'cashOnCash', 'roi'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    },
    {
      id: 'office-quick-lease',
      name: 'Quick Lease Analysis',
      description: 'Lease-focused analysis for office properties',
      includedMetrics: ['effectiveRentPSF'] as (keyof MetricFlags)[],
      requiredFields: ['averageRentPSF', 'operatingExpenses'] as (keyof PropertyData)[]
    },
    {
      id: 'office-quick-financing',
      name: 'Quick Financing Check',
      description: 'Financing feasibility for office properties',
      includedMetrics: ['ltv', 'dscr'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'loanAmount', 'interestRate', 'loanTerm', 'currentNOI'] as (keyof PropertyData)[]
    }
  ],
  retail: [
    {
      id: 'retail-quick-valuation',
      name: 'Quick Center Valuation',
      description: 'Basic valuation metrics for retail properties',
      includedMetrics: ['capRate', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'grossLeasableArea'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-quick-sales',
      name: 'Quick Sales Analysis',
      description: 'Sales performance analysis for retail tenants',
      includedMetrics: ['salesPerSF'] as (keyof MetricFlags)[],
      requiredFields: ['retailTenants', 'grossLeasableArea'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-quick-tenant',
      name: 'Quick Tenant Health',
      description: 'Tenant occupancy and performance analysis',
      includedMetrics: ['salesPerSF'] as (keyof MetricFlags)[],
      requiredFields: ['averageRent', 'retailTenants', 'grossLeasableArea'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-quick-income',
      name: 'Quick Income Analysis',
      description: 'Income and recovery analysis for retail properties',
      includedMetrics: ['capRate'] as (keyof MetricFlags)[],
      requiredFields: ['grossIncome', 'operatingExpenses', 'occupancyRate'] as (keyof PropertyData)[]
    }
  ],
  industrial: [
    {
      id: 'industrial-quick-valuation',
      name: 'Quick Warehouse Valuation',
      description: 'Basic valuation metrics for industrial properties',
      includedMetrics: ['capRate', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'squareFootage'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-quick-efficiency',
      name: 'Quick Building Efficiency',
      description: 'Building efficiency and functionality analysis',
      includedMetrics: ['industrialMetrics'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'squareFootage', 'clearHeight', 'numberOfDockDoors'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-quick-rent',
      name: 'Quick Rent Analysis',
      description: 'Effective rent analysis for industrial properties',
      includedMetrics: ['effectiveRentPSF'] as (keyof MetricFlags)[],
      requiredFields: ['averageRentPSF', 'operatingExpenses'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-quick-operations',
      name: 'Quick Operating Analysis',
      description: 'Operating performance analysis for industrial properties',
      includedMetrics: ['capRate'] as (keyof MetricFlags)[],
      requiredFields: ['grossIncome', 'operatingExpenses', 'purchasePrice'] as (keyof PropertyData)[]
    }
  ],
  multifamily: [
    {
      id: 'multifamily-quick-valuation',
      name: 'Quick Property Valuation',
      description: 'Basic valuation metrics for multifamily properties',
      includedMetrics: ['pricePerUnit', 'grm', 'capRate'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'numberOfUnits', 'averageRent', 'occupancyRate'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-quick-income',
      name: 'Quick Income Analysis',
      description: 'Income performance analysis for multifamily properties',
      includedMetrics: ['egi'] as (keyof MetricFlags)[],
      requiredFields: ['numberOfUnits', 'averageRent', 'occupancyRate', 'operatingExpenses'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-quick-unit',
      name: 'Quick Per-Unit Metrics',
      description: 'Per-unit performance analysis for multifamily properties',
      includedMetrics: ['pricePerUnit', 'revenuePerUnit'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-quick-returns',
      name: 'Quick Return Metrics',
      description: 'Return analysis for multifamily properties',
      includedMetrics: ['cashOnCash', 'capRate', 'roi'] as (keyof MetricFlags)[],
      requiredFields: ['totalInvestment', 'annualCashFlow', 'purchasePrice', 'currentNOI'] as (keyof PropertyData)[]
    }
  ],
  'mixed-use': [
    {
      id: 'mixeduse-quick-valuation',
      name: 'Quick Mixed-Use Valuation',
      description: 'Basic valuation metrics for mixed-use properties',
      includedMetrics: ['capRate', 'pricePerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalSF'] as (keyof PropertyData)[]
    },
    {
      id: 'mixeduse-quick-allocation',
      name: 'Quick Component Analysis',
      description: 'Component allocation and performance analysis',
      includedMetrics: ['capRate'] as (keyof MetricFlags)[],
      requiredFields: ['currentNOI', 'purchasePrice'] as (keyof PropertyData)[]
    },
    {
      id: 'mixeduse-quick-efficiency',
      name: 'Quick Efficiency Metrics',
      description: 'Operating efficiency analysis for mixed-use properties',
      includedMetrics: ['capRate'] as (keyof MetricFlags)[],
      requiredFields: ['grossIncome', 'operatingExpenses', 'purchasePrice'] as (keyof PropertyData)[]
    },
    {
      id: 'mixeduse-quick-returns',
      name: 'Quick Investment Returns',
      description: 'Return analysis for mixed-use properties',
      includedMetrics: ['capRate', 'cashOnCash'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalInvestment', 'annualCashFlow'] as (keyof PropertyData)[]
    }
  ]
};


// Advanced packages for comprehensive institutional analysis - ENHANCED 28 PACKAGES
export const advancedPackages: Record<string, CalculationPackage[]> = {
  office: enhancedOfficePackages,
  retail: enhancedRetailPackages,
  industrial: enhancedIndustrialPackages,
  multifamily: enhancedMultifamilyPackages,
  'mixed-use': enhancedMixedUsePackages
};

// Legacy packages for backward compatibility
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
      description: 'Full analysis for office properties with WALT calculation',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven', 'simpleWalt'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'officeTenants'] as (keyof PropertyData)[]
    },
    {
      id: 'office-institutional',
      name: 'Institutional Office Analysis',
      description: 'Comprehensive institutional-grade office analysis with tenant and lease analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF', 'walt', 'simpleWalt'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'rentableSquareFeet', 'numberOfTenants', 
                      'averageRentPSF', 'weightedAverageLeaseTerm', 'officeTenants'] as (keyof PropertyData)[]
    },
    {
      id: 'office-wow',
      name: 'Office WALT Analysis',
      description: 'Quick WALT calculation with tenant input form for office properties',
      includedMetrics: ['capRate', 'walt'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'officeTenants'] as (keyof PropertyData)[]
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
      description: 'Full analysis for retail properties with sales performance',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven', 'salesPerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'retailTenants'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-institutional',
      name: 'Institutional Retail Analysis',
      description: 'Comprehensive retail analysis with sales performance and trade area analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF', 'salesPerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'grossLeasableArea', 'salesPerSF', 
                      'occupancyCostRatio', 'trafficCount', 'retailTenants'] as (keyof PropertyData)[]
    },
    {
      id: 'retail-wow',
      name: 'Retail Sales Analysis',
      description: 'Sales per square foot analysis for retail properties',
      includedMetrics: ['capRate', 'salesPerSF'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'retailTenants'] as (keyof PropertyData)[]
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
      description: 'Returns and financing metrics with clear height analysis',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'roi', 'industrialMetrics'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment',
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 'clearHeight'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-institutional',
      name: 'Institutional Industrial Analysis',
      description: 'Comprehensive industrial analysis with building functionality and logistics analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerSF', 'industrialMetrics'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'clearHeight', 'numberOfDockDoors', 
                      'powerCapacity', 'distanceToHighway', 'squareFootage'] as (keyof PropertyData)[]
    },
    {
      id: 'industrial-wow',
      name: 'Industrial Clear Height Analysis',
      description: 'Clear height premium analysis for industrial properties',
      includedMetrics: ['capRate', 'clearHeightAnalysis'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'squareFootage', 'clearHeight'] as (keyof PropertyData)[]
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
      description: 'Full analysis for multifamily properties with revenue analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'breakeven', 'multifamilyMetrics'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-institutional',
      name: 'Institutional Multifamily Analysis',
      description: 'Comprehensive multifamily analysis with revenue performance and market analytics',
      includedMetrics: ['capRate', 'cashOnCash', 'dscr', 'irr', 'roi', 'breakeven', 'pricePerUnit', 'grm', 'egi', 'multifamilyMetrics'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'projectedNOI', 'totalInvestment', 
                      'annualCashFlow', 'loanAmount', 'interestRate', 'loanTerm', 
                      'operatingExpenses', 'grossIncome', 'numberOfUnits', 'currentOccupancy', 
                      'averageRentPerUnit', 'unitMix', 'monthlyRentalIncome'] as (keyof PropertyData)[]
    },
    {
      id: 'multifamily-wow',
      name: 'Multifamily Revenue Analysis',
      description: 'Revenue per unit analysis with market comparison for multifamily properties',
      includedMetrics: ['capRate', 'revenuePerUnit'] as (keyof MetricFlags)[],
      requiredFields: ['purchasePrice', 'currentNOI', 'totalUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
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
  
  // New "Wow" Metrics
  walt: {
    name: "WALT",
    category: "Office",
    description: "Weighted Average Lease Term calculation for office tenants",
    requiredFields: ['purchasePrice', 'currentNOI', 'officeTenants'] as (keyof PropertyData)[]
  },
  simpleWalt: {
    name: "Simple WALT",
    category: "Office",
    description: "Weighted Average Lease Term calculation for office tenants",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  salesPerSF: {
    name: "Sales per Square Foot",
    category: "Retail",
    description: "Sales performance analysis for retail tenants",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  clearHeightAnalysis: {
    name: "Clear Height Analysis",
    category: "Industrial",
    description: "Clear height premium analysis for industrial properties",
    requiredFields: ['squareFootage', 'clearHeight', 'purchasePrice'] as (keyof PropertyData)[]
  },
  revenuePerUnit: {
    name: "Revenue per Unit",
    category: "Multifamily",
    description: "Revenue per unit analysis with market comparison",
    requiredFields: ['totalUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[],
    optionalFields: ['marketAverageRent'] as (keyof PropertyData)[]
  },
  industrialMetrics: {
    name: "Industrial Clear Height Analysis",
    category: "Industrial",
    description: "Clear height premium analysis for industrial properties",
    requiredFields: ['squareFootage', 'clearHeight', 'purchasePrice'] as (keyof PropertyData)[]
  },
  multifamilyMetrics: {
    name: "Multifamily Revenue Analysis",
    category: "Multifamily",
    description: "Revenue per unit analysis with market comparison",
    requiredFields: ['numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
  },
  
  // Advanced Office Metrics
  tenantFinancialHealth: {
    name: "Tenant Financial Health",
    category: "Office",
    description: "Comprehensive tenant creditworthiness and financial analysis",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  tenantConcentration: {
    name: "Tenant Concentration",
    category: "Office",
    description: "Tenant concentration risk analysis",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  leaseValuation: {
    name: "Lease Valuation",
    category: "Office",
    description: "Advanced lease economics and valuation analysis",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  escalationAnalysis: {
    name: "Escalation Analysis",
    category: "Office",
    description: "Rent escalation and CPI exposure analysis",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  concessionAnalysis: {
    name: "Concession Analysis",
    category: "Office",
    description: "Tenant concession and inducement analysis",
    requiredFields: ['officeTenants'] as (keyof PropertyData)[]
  },
  operationalEfficiency: {
    name: "Operational Efficiency",
    category: "Office",
    description: "Building operations and efficiency analysis",
    requiredFields: ['rentableSquareFeet'] as (keyof PropertyData)[]
  },
  marketPositioning: {
    name: "Market Positioning",
    category: "Office",
    description: "Competitive market positioning analysis",
    requiredFields: ['rentableSquareFeet'] as (keyof PropertyData)[]
  },
  spaceEfficiency: {
    name: "Space Efficiency",
    category: "Office",
    description: "Space utilization and efficiency metrics",
    requiredFields: ['rentableSquareFeet'] as (keyof PropertyData)[]
  },
  
  // Advanced Retail Metrics
  tenantHealth: {
    name: "Tenant Health",
    category: "Retail",
    description: "Retail tenant health and performance analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  categoryPerformance: {
    name: "Category Performance",
    category: "Retail",
    description: "Retail category performance analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  seasonalAnalysis: {
    name: "Seasonal Analysis",
    category: "Retail",
    description: "Seasonal sales pattern analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  tenantSynergies: {
    name: "Tenant Synergies",
    category: "Retail",
    description: "Tenant synergy and cross-shopping analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  criticalMass: {
    name: "Critical Mass",
    category: "Retail",
    description: "Critical mass and occupancy analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  tradeAreaAnalysis: {
    name: "Trade Area Analysis",
    category: "Retail",
    description: "Trade area demographics and market analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  competitivePosition: {
    name: "Competitive Position",
    category: "Retail",
    description: "Competitive positioning and market share analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  voidAnalysis: {
    name: "Void Analysis",
    category: "Retail",
    description: "Market void and opportunity analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  growthPotential: {
    name: "Growth Potential",
    category: "Retail",
    description: "Market growth potential analysis",
    requiredFields: ['retailTenants'] as (keyof PropertyData)[]
  },
  
  // Advanced Industrial Metrics
  functionalScore: {
    name: "Functional Score",
    category: "Industrial",
    description: "Building functionality and utility scoring",
    requiredFields: ['squareFootage', 'clearHeight'] as (keyof PropertyData)[]
  },
  tenantSuitability: {
    name: "Tenant Suitability",
    category: "Industrial",
    description: "Tenant suitability and space requirements analysis",
    requiredFields: ['squareFootage', 'clearHeight'] as (keyof PropertyData)[]
  },
  modernizationNeeds: {
    name: "Modernization Needs",
    category: "Industrial",
    description: "Building modernization and capital needs analysis",
    requiredFields: ['squareFootage', 'clearHeight'] as (keyof PropertyData)[]
  },
  locationScore: {
    name: "Location Score",
    category: "Industrial",
    description: "Location and accessibility scoring",
    requiredFields: ['distanceToHighway'] as (keyof PropertyData)[]
  },
  logisticsProfile: {
    name: "Logistics Profile",
    category: "Industrial",
    description: "Logistics and distribution suitability analysis",
    requiredFields: ['squareFootage'] as (keyof PropertyData)[]
  },
  laborAnalysis: {
    name: "Labor Analysis",
    category: "Industrial",
    description: "Labor market and workforce analysis",
    requiredFields: ['squareFootage'] as (keyof PropertyData)[]
  },
  lastMileSuitability: {
    name: "Last Mile Suitability",
    category: "Industrial",
    description: "Last-mile delivery facility analysis",
    requiredFields: ['squareFootage'] as (keyof PropertyData)[]
  },
  
  // Advanced Multifamily Metrics
  revenueMetrics: {
    name: "Revenue Metrics",
    category: "Multifamily",
    description: "Comprehensive revenue performance analysis",
    requiredFields: ['numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
  },
  lossToLease: {
    name: "Loss to Lease",
    category: "Multifamily",
    description: "Loss-to-lease and rent growth analysis",
    requiredFields: ['numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
  },
  pricingPower: {
    name: "Pricing Power",
    category: "Multifamily",
    description: "Rental pricing power assessment",
    requiredFields: ['numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
  },
  expenseRatio: {
    name: "Expense Ratio",
    category: "Multifamily",
    description: "Operating expense ratio analysis",
    requiredFields: ['operatingExpenses', 'grossIncome'] as (keyof PropertyData)[]
  },
  maintenanceAnalysis: {
    name: "Maintenance Analysis",
    category: "Multifamily",
    description: "Maintenance cost and efficiency analysis",
    requiredFields: ['operatingExpenses'] as (keyof PropertyData)[]
  },
  staffingEfficiency: {
    name: "Staffing Efficiency",
    category: "Multifamily",
    description: "Staffing levels and efficiency metrics",
    requiredFields: ['numberOfUnits'] as (keyof PropertyData)[]
  },
  operationalKPIs: {
    name: "Operational KPIs",
    category: "Multifamily",
    description: "Key operational performance indicators",
    requiredFields: ['numberOfUnits'] as (keyof PropertyData)[]
  },
  renovationROI: {
    name: "Renovation ROI",
    category: "Multifamily",
    description: "Renovation return on investment analysis",
    requiredFields: ['numberOfUnits', 'currentNOI'] as (keyof PropertyData)[]
  },
  marketPosition: {
    name: "Market Position",
    category: "Multifamily",
    description: "Competitive market positioning analysis",
    requiredFields: ['numberOfUnits', 'monthlyRentalIncome'] as (keyof PropertyData)[]
  },
  amenityGapAnalysis: {
    name: "Amenity Gap Analysis",
    category: "Multifamily",
    description: "Amenity gap and enhancement opportunities",
    requiredFields: ['numberOfUnits'] as (keyof PropertyData)[]
  },
  valueAddPotential: {
    name: "Value-Add Potential",
    category: "Multifamily",
    description: "Value-add and improvement opportunities",
    requiredFields: ['numberOfUnits', 'currentNOI'] as (keyof PropertyData)[]
  },
  
  // Advanced Mixed-Use Metrics
  componentPerformance: {
    name: "Component Performance",
    category: "Mixed-Use",
    description: "Individual component performance analysis",
    requiredFields: ['totalSquareFootage'] as (keyof PropertyData)[]
  },
  crossUseInteractions: {
    name: "Cross-Use Interactions",
    category: "Mixed-Use",
    description: "Cross-use synergy and interaction analysis",
    requiredFields: ['totalSquareFootage'] as (keyof PropertyData)[]
  },
  developmentPotential: {
    name: "Development Potential",
    category: "Mixed-Use",
    description: "Development and redevelopment potential analysis",
    requiredFields: ['totalSquareFootage'] as (keyof PropertyData)[]
  },
  densificationPotential: {
    name: "Densification Potential",
    category: "Mixed-Use",
    description: "Densification and expansion opportunities",
    requiredFields: ['totalSquareFootage'] as (keyof PropertyData)[]
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
  },
  marketAverageRent: {
    label: 'Market Average Rent per Unit (optional)',
    category: 'projection',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 100,
    helperText: 'Market average rent for comparison (optional)'
  },
  
  // Tenant Fields
  officeTenants: {
    label: 'Office Tenants',
    category: 'property',
    type: 'text',
    helperText: 'Add office tenants with lease terms and rent information'
  },
  retailTenants: {
    label: 'Retail Tenants',
    category: 'property',
    type: 'text',
    helperText: 'Add retail tenants with sales performance and lease information'
  }
};

// Get packages based on analysis level
export function getPackagesByLevel(
  propertyType: string,
  level: 'quick' | 'advanced'
): CalculationPackage[] {
  if (level === 'quick') {
    return quickPackages[propertyType] || [];
  } else {
    return advancedPackages[propertyType] || [];
  }
}

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
    
    return Object.entries(assetFunctions).map(([functionName]) => ({
      functionName,
      description: getFunctionDescription(functionName),
      available: validation.isValid,
      requirements: validation.missingFields
    }));
  } catch {
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
  clearHeight: {
    label: 'Clear Height (feet)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1,
    helperText: 'Clear height from floor to ceiling in feet'
  },
  totalUnits: {
    label: 'Total Units',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1,
    helperText: 'Total number of units in the property'
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
    helperText: 'Annual debt service payment'
  },
  
  // New "Wow" Metrics Fields
  monthlyRentalIncome: {
    label: 'Total Monthly Rental Income',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Total monthly rental income for multifamily properties'
  },
  marketAverageRent: {
    label: 'Market Average Rent per Unit (optional)',
    category: 'projection',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 100,
    helperText: 'Market average rent for comparison (optional)'
  },
  
  // Additional Property Fields
  rentableSquareFeet: {
    label: 'Rentable Square Feet',
    category: 'property',
    type: 'number',
    min: 0,
    step: 100,
    helperText: 'Total rentable square footage of the office building'
  },
  noi: {
    label: 'NOI',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1000,
    helperText: 'Net Operating Income'
  },
  grossLeasableArea: {
    label: 'Gross Leasable Area',
    category: 'property',
    type: 'number',
    min: 0,
    step: 100,
    helperText: 'Total gross leasable area of the retail property'
  },
  totalSquareFootage: {
    label: 'Total Square Footage',
    category: 'property',
    type: 'number',
    min: 0,
    step: 100,
    helperText: 'Total square footage of the mixed-use property'
  },
  numberOfDockDoors: {
    label: 'Number of Dock Doors',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1,
    helperText: 'Total number of dock doors in the industrial facility'
  },
  powerCapacity: {
    label: 'Power Capacity (KW)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 100,
    helperText: 'Total power capacity in kilowatts'
  },
  truckCourtDepth: {
    label: 'Truck Court Depth (feet)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 10,
    helperText: 'Depth of truck court in feet'
  },
  distanceToHighway: {
    label: 'Distance to Highway (miles)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 0.1,
    helperText: 'Distance to nearest highway in miles'
  },
  distanceToPort: {
    label: 'Distance to Port (miles)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 0.1,
    helperText: 'Distance to nearest port in miles'
  },
  distanceToRail: {
    label: 'Distance to Rail (miles)',
    category: 'property',
    type: 'number',
    min: 0,
    step: 0.1,
    helperText: 'Distance to nearest rail facility in miles'
  },
  trafficCount: {
    label: 'Daily Traffic Count',
    category: 'property',
    type: 'number',
    min: 0,
    step: 1000,
    helperText: 'Average daily traffic count'
  },
  currentOccupancy: {
    label: 'Current Occupancy Rate',
    category: 'financial',
    type: 'percentage',
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Current occupancy rate as percentage'
  },
  averageRentPerUnit: {
    label: 'Average Rent per Unit',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 100,
    helperText: 'Average rent per unit'
  },
  averageRentPSF: {
    label: 'Average Rent per SF',
    category: 'financial',
    type: 'number',
    prefix: '$',
    min: 0,
    step: 1,
    helperText: 'Average rent per square foot'
  },
  
  // Tenant Fields
  officeTenants: {
    label: 'Office Tenants',
    category: 'property',
    type: 'text',
    helperText: 'Add office tenants with lease terms and rent information'
  },
  retailTenants: {
    label: 'Retail Tenants',
    category: 'property',
    type: 'text',
    helperText: 'Add retail tenants with sales performance and lease information'
  }
}; 
