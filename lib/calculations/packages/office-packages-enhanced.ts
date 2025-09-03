// lib/calculations/packages/office-packages-enhanced.ts
// Enhanced office property calculation packages with complex field definitions

import { EnhancedCalculationPackage, FieldDefinitionFactory } from './enhanced-package-types';

export const enhancedOfficePackages: EnhancedCalculationPackage[] = [
  // 1. Enhanced WALT Analysis
  {
    id: 'office-walt-enhanced',
    name: 'Enhanced WALT Analysis',
    description: 'Weighted Average Lease Term with credit weighting and options',
    category: 'Specialized',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'walt', 'creditWeightedWALT', 'optionAdjustedWALT', 'tenantConcentration',
      'renewalProbability', 'leaseValueScore', 'contractualRentGrowth'
    ],
    
    requiredFields: [
      {
        field: 'tenants',
        type: 'array',
        label: 'Tenant Information',
        description: 'Detailed tenant lease and credit information',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          { 
            field: 'creditRating', 
            type: 'select', 
            label: 'Credit Rating',
            options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D', 'NR'],
            required: true
          },
          { field: 'rentableSquareFeet', type: 'number', label: 'Rentable Square Feet', required: true },
          { field: 'baseRentPSF', type: 'number', label: 'Base Rent Per SqFt', required: true },
          { field: 'leaseStartDate', type: 'date', label: 'Lease Start Date', required: true },
          { field: 'leaseExpirationDate', type: 'date', label: 'Lease Expiration Date', required: true },
          { field: 'renewalOptions', type: 'string', label: 'Renewal Options' },
          { field: 'publicCompany', type: 'boolean', label: 'Public Company', defaultValue: false }
        ]
      },
      {
        field: 'includeOptions',
        type: 'boolean',
        label: 'Include Renewal Options in WALT',
        description: 'Include tenant renewal options in WALT calculation',
        defaultValue: true
      },
      FieldDefinitionFactory.percentage('optionProbability', 'Option Exercise Probability', {
        validation: { min: 0, max: 100 },
        defaultValue: 70
      })
    ],
    
    templates: ['waltAnalysis', 'tenantRollReport', 'creditAnalysis'],
    reportSections: ['Executive Summary', 'WALT Analysis', 'Credit Analysis', 'Tenant Roll Schedule'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'specialized',
    calculationPriority: 'high',
    formLayout: 'tabs',
    grouping: {
      'Basic Info': ['includeOptions', 'optionProbability'],
      'Tenant Details': ['tenants']
    },
    
    documentation: {
      overview: 'Enhanced WALT analysis incorporating credit ratings and renewal options',
      methodology: 'Calculates weighted average lease term with credit and option adjustments',
      interpretation: 'Higher WALT indicates more stable cash flows and lower rollover risk'
    }
  },

  // 2. Tenant Credit Risk Analysis
  {
    id: 'office-tenant-credit-risk',
    name: 'Tenant Credit Risk Analysis',
    description: 'Comprehensive tenant creditworthiness and concentration analysis',
    category: 'Risk',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Opportunistic'],
    
    includedMetrics: [
      'tenantCreditScore', 'portfolioCreditRating', 'concentrationRisk',
      'industryDiversification', 'publicPrivateMix', 'parentGuaranteeValue',
      'financialHealthScore', 'bankruptcyRiskScore'
    ],
    
    requiredFields: [
      {
        field: 'tenants',
        type: 'array',
        label: 'Tenant Credit Information',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          { 
            field: 'creditRating', 
            type: 'select', 
            label: 'Credit Rating',
            options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D', 'NR'],
            required: true
          },
          { field: 'publicCompany', type: 'boolean', label: 'Public Company' },
          { 
            field: 'industry', 
            type: 'select',
            label: 'Industry Sector',
            options: ['Technology', 'Financial Services', 'Healthcare', 'Legal', 'Government', 'Manufacturing', 'Other']
          },
          FieldDefinitionFactory.currency('annualRevenue', 'Annual Revenue'),
          { field: 'yearsInBusiness', type: 'number', label: 'Years in Business' },
          { field: 'rentableSquareFeet', type: 'number', label: 'Rentable Square Feet' },
          { field: 'baseRentPSF', type: 'number', label: 'Base Rent Per SqFt', required: true },
          { field: 'parentCompany', type: 'string', label: 'Parent Company' }
        ]
      }
    ],
    
    templates: ['creditRiskReport', 'tenantDiversification', 'riskHeatmap'],
    reportSections: ['Credit Summary', 'Concentration Analysis', 'Industry Diversification', 'Risk Metrics'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Comprehensive analysis of tenant credit risk and portfolio concentration',
      methodology: 'Analyzes credit ratings, industry diversification, and concentration risk',
      interpretation: 'Lower risk scores indicate more stable tenant base'
    }
  },

  // 3. Lease Expiration & Rollover Analysis
  {
    id: 'office-lease-expiration',
    name: 'Lease Expiration & Rollover Analysis',
    description: 'Analyze lease expirations and renewal probability',
    category: 'Specialized',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'rolloverExposure', 'renewalProbabilityScore', 'marketLeaseSpread',
      'downtimeProjection', 'leasingCostForecast', 'cashFlowAtRisk',
      'stabilizedOccupancy'
    ],
    
    requiredFields: [
      {
        field: 'tenants',
        type: 'array',
        label: 'Tenant Lease Information',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          { field: 'leaseExpirationDate', type: 'date', label: 'Lease Expiration Date', required: true },
          { field: 'rentableSquareFeet', type: 'number', label: 'Rentable Square Feet', required: true },
          { field: 'baseRentPSF', type: 'number', label: 'Current Base Rent Per SqFt', required: true },
          { field: 'marketRentPSF', type: 'number', label: 'Market Rent Per SqFt', required: true },
          FieldDefinitionFactory.percentage('renewalProbability', 'Renewal Probability'),
          FieldDefinitionFactory.currency('tenantImprovements', 'Tenant Improvements'),
          FieldDefinitionFactory.currency('leasingCommissions', 'Leasing Commissions')
        ]
      },
      {
        field: 'holdingPeriod',
        type: 'number',
        label: 'Investment Holding Period (years)',
        validation: { min: 1, max: 20 },
        defaultValue: 7
      },
      FieldDefinitionFactory.percentage('marketRentGrowth', 'Annual Market Rent Growth'),
      {
        field: 'downtime',
        type: 'number',
        label: 'Expected Downtime (months)',
        validation: { min: 0, max: 24 },
        defaultValue: 6
      }
    ],
    
    templates: ['rolloverSchedule', 'leasingProjections', 'sensitivityAnalysis'],
    reportSections: ['Rollover Summary', 'Expiration Schedule', 'Renewal Analysis', 'Cash Flow Impact'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'detailed',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Analysis of lease rollover risk and renewal probabilities',
      methodology: 'Projects lease expirations and estimates renewal likelihood',
      interpretation: 'Lower rollover exposure indicates more stable cash flows'
    }
  },

  // 4. Building Space Efficiency Analysis
  {
    id: 'office-space-efficiency',
    name: 'Building Space Efficiency Analysis',
    description: 'Analyze load factor, core efficiency, and space utilization',
    category: 'Operational',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'loadFactor', 'coreEfficiency', 'floorPlateEfficiency',
      'parkingEfficiency', 'commonAreaRatio', 'tenantDensity',
      'revenuePerUsableSF'
    ],
    
    requiredFields: [
      {
        field: 'rentableSF',
        type: 'number',
        label: 'Total Rentable Square Feet',
        validation: { min: 1000 },
        required: true
      },
      {
        field: 'usableSF',
        type: 'number',
        label: 'Total Usable Square Feet',
        validation: { min: 1000 },
        required: true
      },
      {
        field: 'floors',
        type: 'number',
        label: 'Number of Floors',
        validation: { min: 1, max: 200 },
        required: true
      },
      {
        field: 'buildingShape',
        type: 'select',
        label: 'Building Shape',
        options: ['Square', 'Rectangle', 'L-Shape', 'Irregular'],
        required: true
      },
      {
        field: 'parkingSpaces',
        type: 'number',
        label: 'Parking Spaces',
        validation: { min: 0 },
        required: true
      },
      {
        field: 'tenantCount',
        type: 'number',
        label: 'Number of Tenants',
        validation: { min: 1 },
        required: true
      },
      {
        field: 'commonAreaSF',
        type: 'number',
        label: 'Common Area Square Feet',
        validation: { min: 0 },
        required: true
      }
    ],
    
    templates: ['efficiencyReport', 'spaceUtilization', 'benchmarkComparison'],
    reportSections: ['Efficiency Summary', 'Load Factor Analysis', 'Space Utilization', 'Benchmarking'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'detailed',
    calculationPriority: 'medium',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of building space efficiency and utilization metrics',
      methodology: 'Calculates load factor, core efficiency, and space utilization ratios',
      interpretation: 'Higher efficiency indicates better space utilization and revenue potential'
    }
  },

  // 5. Lease NPV & Economics Analysis
  {
    id: 'office-lease-npv',
    name: 'Lease NPV & Economics Analysis',
    description: 'Calculate net present value of leases including all costs',
    category: 'Financial',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'leaseNPV', 'effectiveRent', 'tenantProfitability',
      'paybackPeriod', 'leasingCostRatio', 'netEffectiveRent',
      'tenantRetentionValue'
    ],
    
    requiredFields: [
      {
        field: 'leases',
        type: 'array',
        label: 'Lease Economics',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          { field: 'startRent', type: 'number', label: 'Starting Rent Per SqFt', required: true },
          {
            field: 'escalationType',
            type: 'select',
            label: 'Escalation Type',
            options: ['Fixed', 'CPI', 'Market', 'None']
          },
          FieldDefinitionFactory.percentage('escalationRate', 'Escalation Rate'),
          { field: 'leaseTerm', type: 'number', label: 'Lease Term (years)' },
          { field: 'freeRentMonths', type: 'number', label: 'Free Rent Months' },
          { field: 'tiAllowancePSF', type: 'number', label: 'TI Allowance Per SqFt', required: true },
          FieldDefinitionFactory.currency('leasingCommission', 'Leasing Commission'),
          FieldDefinitionFactory.percentage('renewalProbability', 'Renewal Probability')
        ]
      },
      FieldDefinitionFactory.percentage('discountRate', 'Discount Rate', {
        validation: { min: 1, max: 20 },
        defaultValue: 8
      }),
      {
        field: 'marketLeaseUpTime',
        type: 'number',
        label: 'Market Lease-Up Time (months)',
        validation: { min: 1, max: 36 },
        defaultValue: 6
      },
      { field: 'marketTIAllowance', type: 'number', label: 'Market TI Allowance Per SqFt', required: true }
    ],
    
    templates: ['leaseEconomics', 'npvAnalysis', 'leasingStrategy'],
    reportSections: ['NPV Summary', 'Lease Economics', 'Profitability Analysis', 'Sensitivity Analysis'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Comprehensive analysis of lease economics and NPV calculations',
      methodology: 'Calculates NPV of lease cash flows including all costs and concessions',
      interpretation: 'Higher NPV indicates more profitable leases'
    }
  },

  // 6. Tenant Financial Health Analysis
  {
    id: 'office-tenant-financial-health',
    name: 'Tenant Financial Health Analysis',
    description: 'Deep dive into tenant financial stability and risk',
    category: 'Risk',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Opportunistic'],
    
    includedMetrics: [
      'tenantFinancialScore', 'debtServiceCapacity', 'liquidityRatio',
      'profitabilityTrend', 'stockPerformance', 'employeeTrend',
      'industryHealthScore'
    ],
    
    requiredFields: [
      {
        field: 'tenants',
        type: 'array',
        label: 'Tenant Financial Information',
        validation: { min: 1 },
        subFields: [
          { field: 'tenantName', type: 'string', label: 'Tenant Name', required: true },
          {
            field: 'creditRating',
            type: 'select',
            label: 'Credit Rating',
            options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D', 'NR']
          },
          FieldDefinitionFactory.currency('revenue', 'Annual Revenue'),
          FieldDefinitionFactory.currency('ebitda', 'EBITDA'),
          { field: 'debtToEquity', type: 'number', label: 'Debt-to-Equity Ratio' },
          { field: 'currentRatio', type: 'number', label: 'Current Ratio' },
          { field: 'dscr', type: 'number', label: 'Debt Service Coverage Ratio' },
          FieldDefinitionFactory.currency('stockPrice', 'Stock Price'),
          { field: 'employeeCount', type: 'number', label: 'Employee Count' },
          { field: 'yearsInLease', type: 'number', label: 'Years in Current Lease' }
        ]
      },
      {
        field: 'industryOutlook',
        type: 'object',
        label: 'Industry Outlook',
        subFields: [
          { field: 'industry', type: 'string', label: 'Industry' },
          {
            field: 'outlook',
            type: 'select',
            label: 'Industry Outlook',
            options: ['Positive', 'Stable', 'Negative', 'Uncertain']
          },
          {
            field: 'wfhImpact',
            type: 'select',
            label: 'Work-from-Home Impact',
            options: ['High', 'Medium', 'Low', 'Minimal']
          }
        ]
      }
    ],
    
    templates: ['financialHealthReport', 'tenantScorecard', 'industryAnalysis'],
    reportSections: ['Financial Summary', 'Health Metrics', 'Risk Assessment', 'Industry Analysis'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'forensic',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Deep analysis of tenant financial health and stability',
      methodology: 'Evaluates financial metrics, industry outlook, and risk factors',
      interpretation: 'Higher health scores indicate lower tenant default risk'
    }
  },

  // 7. Comprehensive Lease Economics
  {
    id: 'office-lease-economics',
    name: 'Comprehensive Lease Economics',
    description: 'Full lease economic analysis including effective rent',
    category: 'Financial',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'grossEffectiveRent', 'netEffectiveRent', 'tenantInducementRatio',
      'breakEvenOccupancy', 'marginAnalysis', 'escalationValue',
      'expenseRecoveryRatio'
    ],
    
    requiredFields: [
      {
        field: 'leaseTerms',
        type: 'array',
        label: 'Lease Terms',
        validation: { min: 1 },
        subFields: [
          { field: 'baseRent', type: 'number', label: 'Base Rent Per SqFt', required: true },
          { field: 'escalations', type: 'string', label: 'Escalation Schedule' },
          { field: 'freeRent', type: 'number', label: 'Free Rent (months)' },
          { field: 'tiAllowance', type: 'number', label: 'TI Allowance Per SqFt', required: true },
          FieldDefinitionFactory.currency('leasingCommissions', 'Leasing Commissions'),
          {
            field: 'expenseStructure',
            type: 'select',
            label: 'Expense Structure',
            options: ['Gross', 'Net', 'Modified Gross', 'Triple Net']
          },
          FieldDefinitionFactory.currency('parkingIncome', 'Parking Income')
        ]
      },
      {
        field: 'marketAssumptions',
        type: 'object',
        label: 'Market Assumptions',
        subFields: [
          FieldDefinitionFactory.percentage('discountRate', 'Discount Rate'),
          FieldDefinitionFactory.percentage('inflationRate', 'Inflation Rate'),
          FieldDefinitionFactory.percentage('marketRentGrowth', 'Market Rent Growth')
        ]
      }
    ],
    
    templates: ['leaseEconomicsReport', 'effectiveRentAnalysis', 'recoveryAnalysis'],
    reportSections: ['Economics Summary', 'Effective Rent', 'Recovery Analysis', 'Market Comparison'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Comprehensive analysis of lease economics and effective rent',
      methodology: 'Calculates effective rent considering all concessions and recoveries',
      interpretation: 'Higher effective rent indicates better lease economics'
    }
  },

  // 8. Building Operations Analysis
  {
    id: 'office-building-operations',
    name: 'Building Operations Analysis',
    description: 'Analyze operating efficiency and expense management',
    category: 'Operational',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'operatingEfficiency', 'expenseRatio', 'utilityEfficiency',
      'maintenanceScore', 'capitalNeedsScore', 'sustainabilityScore',
      'certificationPremium'
    ],
    
    requiredFields: [
      {
        field: 'buildingSystems',
        type: 'array',
        label: 'Building Systems',
        validation: { min: 1 },
        subFields: [
          { field: 'system', type: 'string', label: 'System Type' },
          { field: 'installedYear', type: 'number', label: 'Installed Year' },
          { field: 'expectedLife', type: 'number', label: 'Expected Life (years)' },
          FieldDefinitionFactory.currency('annualMaintenance', 'Annual Maintenance Cost'),
          FieldDefinitionFactory.percentage('energyEfficiency', 'Energy Efficiency Rating')
        ]
      },
      {
        field: 'expenses',
        type: 'object',
        label: 'Operating Expenses',
        subFields: [
          FieldDefinitionFactory.currency('utilities', 'Utilities'),
          FieldDefinitionFactory.currency('cleaning', 'Cleaning'),
          FieldDefinitionFactory.currency('security', 'Security'),
          FieldDefinitionFactory.currency('repairs', 'Repairs & Maintenance'),
          FieldDefinitionFactory.currency('management', 'Management'),
          FieldDefinitionFactory.currency('insurance', 'Insurance'),
          FieldDefinitionFactory.currency('realEstateTaxes', 'Real Estate Taxes')
        ]
      },
      {
        field: 'certifications',
        type: 'object',
        label: 'Building Certifications',
        subFields: [
          {
            field: 'leedLevel',
            type: 'select',
            label: 'LEED Level',
            options: ['None', 'Certified', 'Silver', 'Gold', 'Platinum']
          },
          { field: 'energyStar', type: 'number', label: 'Energy Star Score' },
          { field: 'wellCertification', type: 'boolean', label: 'WELL Certification' },
          { field: 'wireCertification', type: 'boolean', label: 'WiredScore Certification' }
        ]
      }
    ],
    
    templates: ['operationsReport', 'capitalPlan', 'sustainabilityScorecard'],
    reportSections: ['Operations Summary', 'Systems Analysis', 'Expense Analysis', 'Sustainability'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'technical',
    calculationPriority: 'medium',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of building operations and maintenance efficiency',
      methodology: 'Evaluates operating expenses, systems efficiency, and sustainability',
      interpretation: 'Higher efficiency scores indicate better operational performance'
    }
  },

  // 9. Market Position Analysis
  {
    id: 'office-market-position',
    name: 'Market Position Analysis',
    description: 'Competitive positioning and pricing power analysis',
    category: 'Market',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'marketPositionScore', 'pricingPower', 'competitiveAdvantage',
      'occupancyPremium', 'rentPremium', 'amenityScore',
      'locationScore'
    ],
    
    requiredFields: [
      {
        field: 'propertySpecs',
        type: 'object',
        label: 'Property Specifications',
        subFields: [
          { field: 'totalSF', type: 'number', label: 'Total Square Feet' },
          FieldDefinitionFactory.percentage('occupancy', 'Current Occupancy'),
          { field: 'avgRent', type: 'number', label: 'Average Rent Per SqFt', required: true },
          {
            field: 'class',
            type: 'select',
            label: 'Building Class',
            options: ['Class A', 'Class B', 'Class C']
          },
          { field: 'yearBuilt', type: 'number', label: 'Year Built' },
          { field: 'renovated', type: 'number', label: 'Last Renovation Year' }
        ]
      },
      {
        field: 'competitiveSet',
        type: 'array',
        label: 'Competitive Properties',
        validation: { min: 1 },
        subFields: [
          { field: 'propertyName', type: 'string', label: 'Property Name' },
          { field: 'distance', type: 'number', label: 'Distance (miles)' },
          {
            field: 'class',
            type: 'select',
            label: 'Building Class',
            options: ['Class A', 'Class B', 'Class C']
          },
          FieldDefinitionFactory.percentage('occupancy', 'Occupancy'),
          { field: 'askingRent', type: 'number', label: 'Asking Rent Per SqFt', required: true },
          { field: 'amenities', type: 'string', label: 'Key Amenities' }
        ]
      },
      {
        field: 'submarketData',
        type: 'object',
        label: 'Submarket Data',
        subFields: [
          FieldDefinitionFactory.percentage('vacancy', 'Vacancy Rate'),
          { field: 'absorption', type: 'number', label: 'Net Absorption (SF)' },
          { field: 'construction', type: 'number', label: 'Under Construction (SF)' },
          { field: 'avgRent', type: 'number', label: 'Average Rent Per SqFt', required: true }
        ]
      }
    ],
    
    templates: ['marketPositioning', 'competitiveAnalysis', 'pricingStrategy'],
    reportSections: ['Market Summary', 'Competitive Analysis', 'Positioning', 'Pricing Power'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Analysis of market position and competitive advantages',
      methodology: 'Compares property to competitive set and market benchmarks',
      interpretation: 'Higher position scores indicate stronger market position'
    }
  },

  // 10. Enhanced Market Positioning
  {
    id: 'office-market-positioning',
    name: 'Enhanced Market Positioning',
    description: 'Advanced market positioning with demand drivers',
    category: 'Market',
    propertyTypes: ['office'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Development'],
    
    includedMetrics: [
      'demandScore', 'accessibilityScore', 'futureGrowthPotential',
      'employerQuality', 'transportationScore', 'lifestyleAmenities',
      'talentAccessibility'
    ],
    
    requiredFields: [
      {
        field: 'buildingData',
        type: 'object',
        label: 'Building Location Data',
        subFields: [
          { field: 'location', type: 'string', label: 'Location Description' },
          { field: 'walkScore', type: 'number', label: 'Walk Score', validation: { min: 0, max: 100 } },
          { field: 'transitScore', type: 'number', label: 'Transit Score', validation: { min: 0, max: 100 } },
          { field: 'amenityScore', type: 'number', label: 'Amenity Score', validation: { min: 0, max: 100 } }
        ]
      },
      {
        field: 'demandDrivers',
        type: 'object',
        label: 'Demand Drivers',
        subFields: [
          FieldDefinitionFactory.percentage('employmentGrowth', 'Employment Growth'),
          { field: 'majorEmployers', type: 'string', label: 'Major Employers' },
          { field: 'transportation', type: 'string', label: 'Transportation Access' }
        ]
      },
      {
        field: 'tenantTargeting',
        type: 'array',
        label: 'Target Tenant Profile',
        validation: { min: 1 },
        subFields: [
          { field: 'targetIndustry', type: 'string', label: 'Target Industry' },
          { field: 'sizeRequirements', type: 'string', label: 'Size Requirements' },
          { field: 'creditRequirements', type: 'string', label: 'Credit Requirements' }
        ]
      }
    ],
    
    templates: ['demandAnalysis', 'targetingStrategy', 'growthForecast'],
    reportSections: ['Demand Analysis', 'Location Scoring', 'Growth Potential', 'Targeting Strategy'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'strategic',
    calculationPriority: 'medium',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Advanced market positioning analysis with demand drivers',
      methodology: 'Analyzes location factors, demand drivers, and growth potential',
      interpretation: 'Higher scores indicate stronger market positioning and growth potential'
    }
  }
];

