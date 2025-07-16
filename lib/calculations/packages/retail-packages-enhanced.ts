// lib/calculations/packages/retail-packages-enhanced.ts
// Enhanced retail property calculation packages with complex field definitions

import { EnhancedCalculationPackage, FieldDefinition, FieldDefinitionFactory } from './enhanced-package-types';

export const enhancedRetailPackages: EnhancedCalculationPackage[] = [
  // 11. Sales Performance & Productivity
  {
    id: 'retail-sales-performance',
    name: 'Sales Performance & Productivity',
    description: 'Analyze tenant sales and productivity metrics',
    category: 'Financial',
    propertyTypes: ['retail'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'salesPSF', 'salesProductivity', 'tenantPerformance', 'salesVariance',
      'seasonalityIndex', 'salesGrowthTrend', 'categoryPerformance',
      'occupancyCostRatio', 'percentageRentContribution'
    ],
    
    requiredFields: [
      {
        field: 'tenants',
        type: 'array',
        label: 'Tenant Sales Information',
        description: 'Detailed tenant sales and productivity data',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          {
            field: 'category',
            type: 'select',
            label: 'Tenant Category',
            options: ['Anchor', 'Junior Anchor', 'Specialty', 'Restaurant', 'Entertainment', 'Service'],
            required: true
          },
          { field: 'gla', type: 'number', label: 'GLA (sq ft)', required: true },
          FieldDefinitionFactory.currency('annualSales', 'Annual Sales'),
          FieldDefinitionFactory.currency('salesPSF', 'Sales Per Square Foot'),
          FieldDefinitionFactory.percentage('occupancyCost', 'Occupancy Cost Ratio'),
          FieldDefinitionFactory.currency('percentageRent', 'Percentage Rent Paid')
        ]
      },
      {
        field: 'centerType',
        type: 'select',
        label: 'Center Type',
        options: ['Regional Mall', 'Lifestyle Center', 'Strip Center', 'Power Center', 'Outlet'],
        required: true
      },
      {
        field: 'totalGLA',
        type: 'number',
        label: 'Total GLA (sq ft)',
        validation: { min: 10000 },
        required: true
      },
      {
        field: 'salesReporting',
        type: 'boolean',
        label: 'Sales Reporting Available',
        description: 'Are tenant sales reports available and reliable?',
        required: true
      }
    ],
    
    optionalFields: [
      {
        field: 'salesHistory',
        type: 'array',
        label: 'Historical Sales Data',
        subFields: [
          { field: 'year', type: 'number', label: 'Year' },
          { field: 'tenant', type: 'string', label: 'Tenant' },
          FieldDefinitionFactory.currency('sales', 'Annual Sales')
        ]
      },
      {
        field: 'industryBenchmarks',
        type: 'object',
        label: 'Industry Benchmarks',
        subFields: [
          FieldDefinitionFactory.currency('avgSalesPSF', 'Average Sales PSF'),
          FieldDefinitionFactory.percentage('avgOccupancyCost', 'Average Occupancy Cost')
        ]
      }
    ],
    
    templates: ['salesAnalysis', 'tenantPerformanceReport', 'productivityBenchmark'],
    reportSections: ['Sales Summary', 'Tenant Performance', 'Category Analysis', 'Productivity Metrics'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'detailed',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Comprehensive analysis of tenant sales performance and productivity',
      methodology: 'Analyzes sales PSF, occupancy costs, and productivity metrics',
      interpretation: 'Higher sales productivity indicates stronger tenant performance'
    }
  },

  // 12. Co-Tenancy Risk Analysis
  {
    id: 'retail-co-tenancy',
    name: 'Co-Tenancy Risk Analysis',
    description: 'Analyze anchor dependencies and co-tenancy clauses',
    category: 'Risk',
    propertyTypes: ['retail'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Opportunistic'],
    
    includedMetrics: [
      'anchorDependency', 'coTenancyRisk', 'kickoutRisk', 'rentReductionExposure',
      'terminationRisk', 'replacementProbability', 'cashFlowVolatility',
      'anchorCreditRisk', 'coTenancyCompliance'
    ],
    
    requiredFields: [
      {
        field: 'anchors',
        type: 'array',
        label: 'Anchor Tenants',
        description: 'Major anchor tenants with co-tenancy impact',
        validation: { min: 1 },
        subFields: [
          { field: 'name', type: 'string', label: 'Anchor Name', required: true },
          { field: 'gla', type: 'number', label: 'GLA (sq ft)', required: true },
          FieldDefinitionFactory.currency('sales', 'Annual Sales'),
          { field: 'leaseExpiration', type: 'date', label: 'Lease Expiration', required: true },
          {
            field: 'creditRating',
            type: 'select',
            label: 'Credit Rating',
            options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D', 'NR']
          },
          { field: 'kickoutRights', type: 'boolean', label: 'Has Kickout Rights' }
        ]
      },
      {
        field: 'inlineTenants',
        type: 'array',
        label: 'Inline Tenants',
        description: 'Tenants with co-tenancy clauses',
        validation: { min: 1 },
        subFields: [
          { field: 'name', type: 'string', label: 'Tenant Name', required: true },
          {
            field: 'category',
            type: 'select',
            label: 'Category',
            options: ['Specialty', 'Restaurant', 'Entertainment', 'Service', 'Junior Anchor']
          },
          { field: 'gla', type: 'number', label: 'GLA (sq ft)' },
          { field: 'coTenancyClauses', type: 'string', label: 'Co-Tenancy Clauses' },
          FieldDefinitionFactory.percentage('rentReduction', 'Rent Reduction %'),
          { field: 'terminationRights', type: 'boolean', label: 'Termination Rights' }
        ]
      },
      {
        field: 'replacementAnchors',
        type: 'array',
        label: 'Replacement Anchor Options',
        description: 'Potential replacement anchors if current anchors leave',
        subFields: [
          { field: 'potentialTenant', type: 'string', label: 'Potential Tenant' },
          FieldDefinitionFactory.percentage('probability', 'Replacement Probability'),
          { field: 'timeline', type: 'number', label: 'Timeline (months)' }
        ]
      }
    ],
    
    templates: ['coTenancyAnalysis', 'riskAssessment', 'replacementStrategy'],
    reportSections: ['Co-Tenancy Summary', 'Risk Analysis', 'Anchor Analysis', 'Mitigation Strategies'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of co-tenancy risks and anchor dependencies',
      methodology: 'Evaluates anchor stability and inline tenant co-tenancy exposure',
      interpretation: 'Lower co-tenancy risk indicates more stable cash flows'
    }
  },

  // 13. Trade Area Demographics & Analysis
  {
    id: 'retail-trade-area',
    name: 'Trade Area Demographics & Analysis',
    description: 'Analyze trade area demographics and competition',
    category: 'Market',
    propertyTypes: ['retail'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Development'],
    
    includedMetrics: [
      'tradeAreaStrength', 'demographicScore', 'competitionIndex',
      'marketPenetration', 'demographicTrends', 'spendingPower',
      'categoryGaps', 'competitiveAdvantage', 'marketShare'
    ],
    
    requiredFields: [
      {
        field: 'tradeAreaRings',
        type: 'object',
        label: 'Trade Area Rings',
        description: 'Define primary, secondary, and tertiary trade areas',
        subFields: [
          { field: 'primaryMiles', type: 'number', label: 'Primary Ring (miles)', validation: { min: 0.5, max: 10 } },
          { field: 'secondaryMiles', type: 'number', label: 'Secondary Ring (miles)', validation: { min: 1, max: 20 } },
          { field: 'tertiaryMiles', type: 'number', label: 'Tertiary Ring (miles)', validation: { min: 2, max: 50 } }
        ]
      },
      {
        field: 'demographics',
        type: 'object',
        label: 'Demographic Data',
        description: 'Key demographic metrics for the trade area',
        subFields: [
          { field: 'population', type: 'number', label: 'Population', validation: { min: 1000 } },
          FieldDefinitionFactory.currency('avgIncome', 'Average Household Income'),
          { field: 'medianAge', type: 'number', label: 'Median Age', validation: { min: 20, max: 80 } },
          FieldDefinitionFactory.percentage('growthRate', 'Population Growth Rate')
        ]
      },
      {
        field: 'competition',
        type: 'array',
        label: 'Competitive Properties',
        description: 'Competing retail centers in the trade area',
        validation: { min: 1 },
        subFields: [
          { field: 'competitorName', type: 'string', label: 'Competitor Name' },
          { field: 'distance', type: 'number', label: 'Distance (miles)' },
          { field: 'gla', type: 'number', label: 'GLA (sq ft)' },
          { field: 'anchors', type: 'string', label: 'Anchor Tenants' },
          FieldDefinitionFactory.percentage('overlap', 'Trade Area Overlap %')
        ]
      },
      {
        field: 'voidAnalysis',
        type: 'array',
        label: 'Market Void Analysis',
        description: 'Underserved categories and opportunities',
        subFields: [
          { field: 'missingCategory', type: 'string', label: 'Missing Category' },
          {
            field: 'demandLevel',
            type: 'select',
            label: 'Demand Level',
            options: ['High', 'Medium', 'Low', 'Saturated']
          },
          { field: 'targetTenants', type: 'string', label: 'Target Tenants' }
        ]
      }
    ],
    
    templates: ['tradeAreaReport', 'demographicAnalysis', 'competitionMapping'],
    reportSections: ['Trade Area Summary', 'Demographics', 'Competition Analysis', 'Market Opportunities'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Comprehensive trade area and demographic analysis',
      methodology: 'Analyzes demographics, competition, and market gaps',
      interpretation: 'Stronger trade area demographics indicate better tenant performance potential'
    }
  },

  // 14. Percentage Rent Analysis & Optimization
  {
    id: 'retail-percentage-rent',
    name: 'Percentage Rent Analysis & Optimization',
    description: 'Analyze and optimize percentage rent structures',
    category: 'Financial',
    propertyTypes: ['retail'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'percentageRentContribution', 'breakpointAnalysis', 'overage',
      'salesThreshold', 'percentageRentYield', 'auditVariance',
      'salesReportingCompliance', 'percentageRentOptimization'
    ],
    
    requiredFields: [
      {
        field: 'percentageRentDeals',
        type: 'array',
        label: 'Percentage Rent Deals',
        description: 'Tenants with percentage rent clauses',
        validation: { min: 1 },
        subFields: [
          { field: 'tenant', type: 'string', label: 'Tenant Name', required: true },
          FieldDefinitionFactory.currency('baseRent', 'Base Rent'),
          FieldDefinitionFactory.currency('breakpoint', 'Breakpoint Sales'),
          FieldDefinitionFactory.percentage('percentageRate', 'Percentage Rate'),
          FieldDefinitionFactory.currency('currentSales', 'Current Annual Sales'),
          FieldDefinitionFactory.percentage('salesGrowth', 'Projected Sales Growth')
        ]
      },
      {
        field: 'salesHistory',
        type: 'array',
        label: 'Sales History',
        description: 'Historical sales and percentage rent data',
        validation: { min: 1 },
        subFields: [
          { field: 'year', type: 'number', label: 'Year' },
          { field: 'tenant', type: 'string', label: 'Tenant' },
          FieldDefinitionFactory.currency('reportedSales', 'Reported Sales'),
          FieldDefinitionFactory.currency('percentageRentPaid', 'Percentage Rent Paid')
        ]
      },
      {
        field: 'auditRights',
        type: 'boolean',
        label: 'Audit Rights Available',
        description: 'Does landlord have rights to audit tenant sales?',
        required: true
      }
    ],
    
    optionalFields: [
      {
        field: 'auditResults',
        type: 'array',
        label: 'Audit Results',
        subFields: [
          { field: 'tenant', type: 'string', label: 'Tenant' },
          { field: 'year', type: 'number', label: 'Year' },
          FieldDefinitionFactory.currency('adjustment', 'Sales Adjustment'),
          FieldDefinitionFactory.currency('additionalRent', 'Additional Rent Due')
        ]
      }
    ],
    
    templates: ['percentageRentAnalysis', 'breakpointOptimization', 'salesAudit'],
    reportSections: ['Percentage Rent Summary', 'Breakpoint Analysis', 'Sales Trends', 'Optimization Opportunities'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'detailed',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Analysis and optimization of percentage rent structures',
      methodology: 'Evaluates breakpoints, sales trends, and optimization opportunities',
      interpretation: 'Higher percentage rent contribution indicates better tenant performance'
    }
  },

  // 15. CAM & Expense Recovery Analysis
  {
    id: 'retail-expense-recovery',
    name: 'CAM & Expense Recovery Analysis',
    description: 'Analyze common area maintenance and recovery rates',
    category: 'Operational',
    propertyTypes: ['retail'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'camRecoveryRate', 'expenseRatio', 'recoveryEfficiency',
      'camPerSF', 'anchorContribution', 'managementEfficiency',
      'expenseGrowth', 'camVariance', 'recoveryOptimization'
    ],
    
    requiredFields: [
      {
        field: 'expenses',
        type: 'object',
        label: 'Operating Expenses',
        description: 'Breakdown of common area maintenance expenses',
        subFields: [
          FieldDefinitionFactory.currency('totalCAM', 'Total CAM Expenses'),
          FieldDefinitionFactory.currency('management', 'Management Fees'),
          FieldDefinitionFactory.currency('utilities', 'Utilities'),
          FieldDefinitionFactory.currency('security', 'Security'),
          FieldDefinitionFactory.currency('landscaping', 'Landscaping'),
          FieldDefinitionFactory.currency('snowRemoval', 'Snow Removal')
        ]
      },
      {
        field: 'tenantRecovery',
        type: 'array',
        label: 'Tenant Recovery Details',
        description: 'How expenses are recovered from each tenant',
        validation: { min: 1 },
        subFields: [
          { field: 'tenant', type: 'string', label: 'Tenant Name' },
          FieldDefinitionFactory.percentage('proRataShare', 'Pro Rata Share'),
          FieldDefinitionFactory.currency('camCap', 'CAM Cap ($/SF)'),
          { field: 'exclusions', type: 'string', label: 'Exclusions' },
          FieldDefinitionFactory.percentage('recoveryRate', 'Recovery Rate')
        ]
      },
      {
        field: 'anchorContributions',
        type: 'array',
        label: 'Anchor Contributions',
        description: 'How anchors contribute to CAM expenses',
        subFields: [
          { field: 'anchor', type: 'string', label: 'Anchor Name' },
          FieldDefinitionFactory.currency('contribution', 'Annual Contribution'),
          {
            field: 'method',
            type: 'select',
            label: 'Contribution Method',
            options: ['Fixed Amount', 'Pro Rata', 'Percentage', 'None']
          }
        ]
      }
    ],
    
    templates: ['camAnalysis', 'recoveryOptimization', 'expenseReport'],
    reportSections: ['CAM Summary', 'Recovery Analysis', 'Expense Breakdown', 'Optimization Opportunities'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'detailed',
    calculationPriority: 'medium',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of common area maintenance and expense recovery',
      methodology: 'Evaluates recovery rates, expense efficiency, and optimization opportunities',
      interpretation: 'Higher recovery rates indicate better expense management'
    }
  },

  // 16. Redevelopment & Repositioning Analysis
  {
    id: 'retail-redevelopment-potential',
    name: 'Redevelopment & Repositioning Analysis',
    description: 'Analyze highest and best use opportunities',
    category: 'Development',
    propertyTypes: ['retail'],
    investmentStrategies: ['Value-Add', 'Opportunistic', 'Development'],
    
    includedMetrics: [
      'redevelopmentYield', 'highestBestUse', 'repositioningROI',
      'alternativeUseValue', 'developmentFeasibility', 'marketDemand',
      'investmentReturns', 'riskAdjustedReturns', 'timeToStabilization'
    ],
    
    requiredFields: [
      {
        field: 'currentUse',
        type: 'object',
        label: 'Current Use Analysis',
        description: 'Current property performance and characteristics',
        subFields: [
          { field: 'gla', type: 'number', label: 'Current GLA (sq ft)' },
          FieldDefinitionFactory.currency('sales', 'Annual Sales'),
          FieldDefinitionFactory.percentage('occupancy', 'Occupancy Rate'),
          FieldDefinitionFactory.currency('noi', 'Current NOI')
        ]
      },
      {
        field: 'alternativeUses',
        type: 'array',
        label: 'Alternative Uses',
        description: 'Potential alternative uses for the property',
        validation: { min: 1 },
        subFields: [
          {
            field: 'useType',
            type: 'select',
            label: 'Use Type',
            options: ['Mixed-Use', 'Multifamily', 'Office', 'Medical', 'Self-Storage', 'Hospitality', 'Industrial']
          },
          FieldDefinitionFactory.currency('requiredInvestment', 'Required Investment'),
          FieldDefinitionFactory.currency('projectedNOI', 'Projected NOI'),
          { field: 'timeline', type: 'number', label: 'Timeline (months)' }
        ]
      },
      {
        field: 'zoning',
        type: 'object',
        label: 'Zoning Analysis',
        description: 'Current zoning and development constraints',
        subFields: [
          { field: 'currentZoning', type: 'string', label: 'Current Zoning' },
          { field: 'allowedUses', type: 'string', label: 'Allowed Uses' },
          { field: 'far', type: 'number', label: 'Floor Area Ratio' },
          { field: 'height', type: 'number', label: 'Height Limit (feet)' }
        ]
      },
      {
        field: 'marketDemand',
        type: 'array',
        label: 'Market Demand Analysis',
        description: 'Demand for alternative uses in the market',
        validation: { min: 1 },
        subFields: [
          { field: 'useType', type: 'string', label: 'Use Type' },
          {
            field: 'demandLevel',
            type: 'select',
            label: 'Demand Level',
            options: ['High', 'Medium', 'Low', 'Uncertain']
          },
          FieldDefinitionFactory.currency('achievableRents', 'Achievable Rents')
        ]
      }
    ],
    
    templates: ['redevelopmentAnalysis', 'highestBestUse', 'feasibilityStudy'],
    reportSections: ['Redevelopment Summary', 'Alternative Uses', 'Market Analysis', 'Financial Projections'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Analysis of redevelopment and repositioning opportunities',
      methodology: 'Evaluates alternative uses, market demand, and financial feasibility',
      interpretation: 'Higher redevelopment yields indicate better repositioning opportunities'
    }
  }
];

