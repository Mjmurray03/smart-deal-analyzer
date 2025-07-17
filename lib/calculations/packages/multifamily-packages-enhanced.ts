// lib/calculations/packages/multifamily-packages-enhanced.ts
// Enhanced multifamily property calculation packages with complex field definitions

import { EnhancedCalculationPackage, FieldDefinitionFactory } from './enhanced-package-types';

export const enhancedMultifamilyPackages: EnhancedCalculationPackage[] = [
  // 21. Revenue & Rent Roll Analysis
  {
    id: 'multifamily-revenue-performance',
    name: 'Revenue & Rent Roll Analysis',
    description: 'Comprehensive revenue optimization and rent roll analysis',
    category: 'Financial',
    propertyTypes: ['multifamily'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'revenuePAU', 'rentGrowthPotential', 'lossToLease', 'occupancyTrends',
      'concessionAnalysis', 'otherIncomeOptimization', 'rentRollVariance',
      'leaseExpirationSchedule', 'averageRentPSF', 'revenueEfficiency'
    ],
    
    requiredFields: [
      {
        field: 'units',
        type: 'array',
        label: 'Unit Details',
        description: 'Individual unit rent roll information',
        validation: { min: 10 },
        subFields: [
          { field: 'unitNumber', type: 'string', label: 'Unit Number', required: true },
          {
            field: 'unitType',
            type: 'select',
            label: 'Unit Type',
            options: ['Studio', '1BR', '2BR', '3BR', '4BR', 'Penthouse'],
            required: true
          },
          { field: 'bedrooms', type: 'number', label: 'Bedrooms', validation: { min: 0, max: 5 } },
          { field: 'sqft', type: 'number', label: 'Square Feet', validation: { min: 400, max: 3000 } },
          FieldDefinitionFactory.currency('currentRent', 'Current Rent'),
          FieldDefinitionFactory.currency('marketRent', 'Market Rent'),
          { field: 'leaseEnd', type: 'date', label: 'Lease End Date' },
          { field: 'occupied', type: 'boolean', label: 'Currently Occupied' }
        ]
      },
      {
        field: 'otherIncome',
        type: 'array',
        label: 'Other Income Sources',
        description: 'Additional revenue streams beyond base rent',
        validation: { min: 1 },
        subFields: [
          {
            field: 'source',
            type: 'select',
            label: 'Income Source',
            options: ['Parking', 'Pet Fees', 'Storage', 'Laundry', 'Vending', 'Late Fees', 'Application Fees', 'Other']
          },
          FieldDefinitionFactory.currency('monthlyAmount', 'Monthly Amount'),
          { field: 'perUnit', type: 'boolean', label: 'Per Unit Charge' }
        ]
      },
      {
        field: 'concessions',
        type: 'object',
        label: 'Concession Analysis',
        description: 'Current concession offerings and impact',
        subFields: [
          FieldDefinitionFactory.currency('avgConcession', 'Average Concession Value'),
          FieldDefinitionFactory.percentage('percentOffering', 'Percent of Units Offering'),
          {
            field: 'type',
            type: 'select',
            label: 'Concession Type',
            options: ['Free Rent', 'Reduced Rent', 'Move-in Specials', 'Waived Fees', 'Gift Cards', 'Other']
          }
        ]
      },
      {
        field: 'amenityIncome',
        type: 'array',
        label: 'Amenity Income',
        description: 'Revenue from amenities and services',
        subFields: [
          {
            field: 'amenity',
            type: 'select',
            label: 'Amenity',
            options: ['Fitness Center', 'Pool', 'Business Center', 'Concierge', 'Parking Garage', 'Storage', 'Other']
          },
          FieldDefinitionFactory.currency('monthlyRevenue', 'Monthly Revenue'),
          FieldDefinitionFactory.percentage('utilization', 'Utilization Rate')
        ]
      }
    ],
    
    optionalFields: [
      {
        field: 'seasonalTrends',
        type: 'array',
        label: 'Seasonal Trends',
        subFields: [
          { field: 'month', type: 'number', label: 'Month' },
          FieldDefinitionFactory.percentage('occupancyVariance', 'Occupancy Variance'),
          FieldDefinitionFactory.percentage('rentVariance', 'Rent Variance')
        ]
      }
    ],
    
    templates: ['revenueAnalysis', 'rentRollReport', 'leaseExpirationSchedule'],
    reportSections: ['Revenue Summary', 'Rent Roll Analysis', 'Other Income', 'Concession Impact'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Comprehensive analysis of multifamily revenue performance and rent roll optimization',
      methodology: 'Analyzes unit-level performance, market positioning, and revenue optimization opportunities',
      interpretation: 'Higher revenue efficiency indicates better property management and market positioning'
    }
  },

  // 22. Operating Expense Analysis
  {
    id: 'multifamily-operating-performance',
    name: 'Operating Expense Analysis',
    description: 'Analyze operating efficiency and expense optimization',
    category: 'Operational',
    propertyTypes: ['multifamily'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'operatingExpenseRatio', 'expensePerUnit', 'staffingEfficiency',
      'contractOptimization', 'utilityRecovery', 'maintenanceEfficiency',
      'adminCostRatio', 'benchmarkVariance', 'costControlOpportunities'
    ],
    
    requiredFields: [
      {
        field: 'expenses',
        type: 'object',
        label: 'Operating Expenses',
        description: 'Breakdown of annual operating expenses',
        subFields: [
          FieldDefinitionFactory.currency('admin', 'Administrative'),
          FieldDefinitionFactory.currency('maintenance', 'Maintenance & Repairs'),
          FieldDefinitionFactory.currency('utilities', 'Utilities'),
          FieldDefinitionFactory.currency('insurance', 'Insurance'),
          FieldDefinitionFactory.currency('marketing', 'Marketing & Advertising'),
          FieldDefinitionFactory.currency('payroll', 'Payroll & Benefits'),
          FieldDefinitionFactory.currency('propertyTax', 'Property Taxes')
        ]
      },
      {
        field: 'staffing',
        type: 'array',
        label: 'Staffing Details',
        description: 'On-site staffing and compensation',
        validation: { min: 1 },
        subFields: [
          {
            field: 'position',
            type: 'select',
            label: 'Position',
            options: ['Property Manager', 'Assistant Manager', 'Leasing Agent', 'Maintenance Tech', 'Maintenance Supervisor', 'Groundskeeper', 'Other']
          },
          { field: 'count', type: 'number', label: 'Number of Staff', validation: { min: 0, max: 20 } },
          FieldDefinitionFactory.currency('salary', 'Annual Salary'),
          FieldDefinitionFactory.currency('benefits', 'Annual Benefits')
        ]
      },
      {
        field: 'contracts',
        type: 'array',
        label: 'Service Contracts',
        description: 'Third-party service contracts and vendors',
        validation: { min: 1 },
        subFields: [
          { field: 'vendor', type: 'string', label: 'Vendor Name' },
          {
            field: 'service',
            type: 'select',
            label: 'Service Type',
            options: ['Landscaping', 'Pool Maintenance', 'Elevator', 'HVAC', 'Pest Control', 'Cleaning', 'Security', 'Other']
          },
          FieldDefinitionFactory.currency('annualCost', 'Annual Cost'),
          { field: 'expiration', type: 'date', label: 'Contract Expiration' }
        ]
      },
      {
        field: 'utilityMetrics',
        type: 'object',
        label: 'Utility Metrics',
        description: 'Utility billing and recovery methods',
        subFields: [
          { field: 'rubs', type: 'boolean', label: 'RUBS (Ratio Utility Billing)' },
          { field: 'masterMetered', type: 'boolean', label: 'Master Metered' },
          FieldDefinitionFactory.currency('avgPerUnit', 'Average Cost Per Unit')
        ]
      }
    ],
    
    templates: ['operatingAnalysis', 'expenseOptimization', 'staffingReport'],
    reportSections: ['Expense Summary', 'Staffing Analysis', 'Contract Review', 'Utility Analysis'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'detailed',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Comprehensive analysis of multifamily operating expenses and efficiency opportunities',
      methodology: 'Benchmarks expenses against industry standards and identifies optimization opportunities',
      interpretation: 'Lower expense ratios indicate more efficient operations and better cash flow'
    }
  },

  // 23. Market Positioning & Comp Analysis
  {
    id: 'multifamily-market-position',
    name: 'Market Positioning & Comp Analysis',
    description: 'Analyze competitive position and market dynamics',
    category: 'Market',
    propertyTypes: ['multifamily'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'marketPositionScore', 'competitiveAdvantage', 'rentPremium',
      'occupancyPremium', 'amenityScore', 'demographicAlignment',
      'marketShare', 'pricingPower', 'residentSatisfaction'
    ],
    
    requiredFields: [
      {
        field: 'propertyFeatures',
        type: 'object',
        label: 'Property Features',
        description: 'Key property characteristics and amenities',
        subFields: [
          { field: 'yearBuilt', type: 'number', label: 'Year Built', validation: { min: 1900, max: 2025 } },
          { field: 'lastRenovation', type: 'number', label: 'Last Major Renovation' },
          { field: 'amenities', type: 'string', label: 'Key Amenities' },
          { field: 'unitMix', type: 'string', label: 'Unit Mix Summary' }
        ]
      },
      {
        field: 'compProperties',
        type: 'array',
        label: 'Comparable Properties',
        description: 'Competitive properties for market comparison',
        validation: { min: 3 },
        subFields: [
          { field: 'name', type: 'string', label: 'Property Name' },
          { field: 'distance', type: 'number', label: 'Distance (miles)', validation: { min: 0, max: 10 } },
          { field: 'units', type: 'number', label: 'Number of Units' },
          FieldDefinitionFactory.currency('avgRent', 'Average Rent'),
          FieldDefinitionFactory.percentage('occupancy', 'Occupancy Rate'),
          { field: 'amenities', type: 'string', label: 'Key Amenities' },
          { field: 'built', type: 'number', label: 'Year Built' }
        ]
      },
      {
        field: 'marketTrends',
        type: 'object',
        label: 'Market Trends',
        description: 'Local market dynamics and trends',
        subFields: [
          FieldDefinitionFactory.percentage('rentGrowth', 'Annual Rent Growth'),
          { field: 'absorption', type: 'number', label: 'Net Absorption (units)' },
          { field: 'newSupply', type: 'number', label: 'New Supply (units)' },
          { field: 'demographics', type: 'string', label: 'Demographic Trends' }
        ]
      },
      {
        field: 'residentProfile',
        type: 'object',
        label: 'Resident Profile',
        description: 'Current resident demographics and characteristics',
        subFields: [
          FieldDefinitionFactory.currency('avgIncome', 'Average Resident Income'),
          { field: 'avgAge', type: 'number', label: 'Average Age', validation: { min: 18, max: 80 } },
          { field: 'avgTenancy', type: 'number', label: 'Average Tenancy (months)' },
          FieldDefinitionFactory.percentage('petOwnership', 'Pet Ownership Rate')
        ]
      }
    ],
    
    templates: ['marketAnalysis', 'competitivePositioning', 'demographicProfile'],
    reportSections: ['Market Summary', 'Competitive Analysis', 'Resident Profile', 'Positioning Strategy'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Comprehensive market positioning analysis for multifamily properties',
      methodology: 'Compares property against market comps and analyzes competitive advantages',
      interpretation: 'Higher market position scores indicate stronger competitive positioning'
    }
  },

  // 24. Value-Add & Renovation Analysis
  {
    id: 'multifamily-value-add',
    name: 'Value-Add & Renovation Analysis',
    description: 'Analyze renovation ROI and value-add opportunities',
    category: 'Value-Add',
    propertyTypes: ['multifamily'],
    investmentStrategies: ['Value-Add', 'Opportunistic'],
    
    includedMetrics: [
      'renovationROI', 'rentIncreasePotential', 'paybackPeriod',
      'yieldOnCost', 'stabilizedValue', 'costEfficiency',
      'phasedReturnAnalysis', 'modernizationScore', 'valueCreation'
    ],
    
    requiredFields: [
      {
        field: 'renovationScope',
        type: 'array',
        label: 'Renovation Scope',
        description: 'Planned renovation items and costs',
        validation: { min: 1 },
        subFields: [
          {
            field: 'item',
            type: 'select',
            label: 'Renovation Item',
            options: ['Kitchen Renovation', 'Bathroom Renovation', 'Flooring', 'Appliances', 'HVAC', 'Windows', 'Balcony/Patio', 'In-Unit Laundry', 'Other']
          },
          FieldDefinitionFactory.currency('costPerUnit', 'Cost Per Unit'),
          { field: 'timeline', type: 'number', label: 'Timeline (months)' },
          FieldDefinitionFactory.currency('rentIncrease', 'Expected Rent Increase')
        ]
      },
      {
        field: 'currentCondition',
        type: 'object',
        label: 'Current Condition',
        description: 'Assessment of current property condition',
        subFields: [
          {
            field: 'propertyGrade',
            type: 'select',
            label: 'Property Grade',
            options: ['A', 'B', 'C', 'D']
          },
          FieldDefinitionFactory.currency('deferredMaintenance', 'Deferred Maintenance'),
          FieldDefinitionFactory.currency('capExNeeds', 'Immediate CapEx Needs')
        ]
      },
      {
        field: 'marketComps',
        type: 'array',
        label: 'Renovation Comparables',
        description: 'Market comparables for renovation analysis',
        validation: { min: 2 },
        subFields: [
          { field: 'property', type: 'string', label: 'Property Name' },
          { field: 'renovated', type: 'boolean', label: 'Recently Renovated' },
          FieldDefinitionFactory.currency('beforeRent', 'Rent Before Renovation'),
          FieldDefinitionFactory.currency('afterRent', 'Rent After Renovation'),
          FieldDefinitionFactory.currency('cost', 'Renovation Cost Per Unit')
        ]
      },
      {
        field: 'phasingPlan',
        type: 'array',
        label: 'Phasing Plan',
        description: 'Renovation phasing strategy',
        validation: { min: 1 },
        subFields: [
          { field: 'phase', type: 'string', label: 'Phase Name' },
          { field: 'units', type: 'number', label: 'Units in Phase' },
          { field: 'duration', type: 'number', label: 'Duration (months)' },
          FieldDefinitionFactory.percentage('vacancy', 'Expected Vacancy During Phase')
        ]
      }
    ],
    
    templates: ['valueAddAnalysis', 'renovationROI', 'phasingStrategy'],
    reportSections: ['Renovation Summary', 'ROI Analysis', 'Market Comparables', 'Phasing Strategy'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Comprehensive analysis of value-add renovation opportunities and ROI',
      methodology: 'Evaluates renovation costs, rent increases, and phasing strategies',
      interpretation: 'Higher ROI indicates better value-add opportunities and execution strategy'
    }
  }
];

