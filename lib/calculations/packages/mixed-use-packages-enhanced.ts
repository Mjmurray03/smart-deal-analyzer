// lib/calculations/packages/mixed-use-packages-enhanced.ts
// Enhanced mixed-use property calculation packages with complex field definitions

import { EnhancedCalculationPackage, FieldDefinition, FieldDefinitionFactory } from './enhanced-package-types';

export const enhancedMixedUsePackages: EnhancedCalculationPackage[] = [
  // 25. Mixed-Use Component Performance
  {
    id: 'mixeduse-performance',
    name: 'Mixed-Use Component Performance',
    description: 'Analyze individual component performance and synergies',
    category: 'Financial',
    propertyTypes: ['mixed-use'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Development'],
    
    includedMetrics: [
      'componentNOI', 'componentCapRates', 'synergyValue', 'crossSubsidization',
      'componentROI', 'allocationEfficiency', 'revenueOptimization',
      'expenseAllocation', 'performanceVariance', 'componentGrowth'
    ],
    
    requiredFields: [
      {
        field: 'components',
        type: 'array',
        label: 'Property Components',
        description: 'Individual use components within the mixed-use property',
        validation: { min: 2 },
        subFields: [
          {
            field: 'use',
            type: 'select',
            label: 'Use Type',
            options: ['Residential', 'Retail', 'Office', 'Hotel', 'Entertainment', 'Parking', 'Other'],
            required: true
          },
          { field: 'squareFootage', type: 'number', label: 'Square Footage', validation: { min: 1000 } },
          { field: 'floors', type: 'number', label: 'Number of Floors', validation: { min: 1, max: 50 } },
          FieldDefinitionFactory.currency('revenue', 'Annual Revenue'),
          FieldDefinitionFactory.currency('expenses', 'Annual Expenses'),
          FieldDefinitionFactory.currency('noi', 'Net Operating Income'),
          { field: 'tenantCount', type: 'number', label: 'Number of Tenants/Units' }
        ]
      },
      {
        field: 'sharedAmenities',
        type: 'array',
        label: 'Shared Amenities',
        description: 'Amenities shared across multiple use components',
        validation: { min: 1 },
        subFields: [
          {
            field: 'amenity',
            type: 'select',
            label: 'Amenity Type',
            options: ['Fitness Center', 'Pool', 'Concierge', 'Conference Rooms', 'Rooftop Terrace', 'Loading Dock', 'Storage', 'Other']
          },
          FieldDefinitionFactory.currency('cost', 'Annual Operating Cost'),
          {
            field: 'allocation',
            type: 'select',
            label: 'Cost Allocation Method',
            options: ['Square Footage', 'Usage-Based', 'Equal Split', 'Revenue-Based', 'Tenant Count']
          }
        ]
      },
      {
        field: 'parkingAllocation',
        type: 'object',
        label: 'Parking Allocation',
        description: 'Parking space allocation among different uses',
        subFields: [
          { field: 'totalSpaces', type: 'number', label: 'Total Parking Spaces', validation: { min: 10 } },
          { field: 'retailAllocation', type: 'number', label: 'Retail Allocation' },
          { field: 'officeAllocation', type: 'number', label: 'Office Allocation' },
          { field: 'residentialAllocation', type: 'number', label: 'Residential Allocation' }
        ]
      }
    ],
    
    optionalFields: [
      {
        field: 'crossPromotions',
        type: 'array',
        label: 'Cross-Promotions',
        subFields: [
          { field: 'promotion', type: 'string', label: 'Promotion Description' },
          { field: 'participants', type: 'string', label: 'Participating Uses' },
          FieldDefinitionFactory.currency('impact', 'Revenue Impact')
        ]
      }
    ],
    
    templates: ['componentAnalysis', 'synergyReport', 'allocationMatrix'],
    reportSections: ['Component Performance', 'Synergy Analysis', 'Cost Allocation', 'Optimization Opportunities'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Analysis of individual component performance within mixed-use properties',
      methodology: 'Evaluates each use component and identifies synergies and cross-subsidization',
      interpretation: 'Higher synergy values indicate better integration and value creation'
    }
  },

  // 26. Cross-Use Synergies & Conflicts
  {
    id: 'mixeduse-cross-interactions',
    name: 'Cross-Use Synergies & Conflicts',
    description: 'Analyze interactions between different uses',
    category: 'Operational',
    propertyTypes: ['mixed-use'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Development'],
    
    includedMetrics: [
      'synergyScore', 'conflictMitigation', 'crossUtilization', 'sharedBenefits',
      'operationalEfficiency', 'customerFlowOptimization', 'systemIntegration',
      'conflictResolution', 'interactionValue', 'compatibilityIndex'
    ],
    
    requiredFields: [
      {
        field: 'interactions',
        type: 'array',
        label: 'Use Interactions',
        description: 'Interactions between different use types',
        validation: { min: 1 },
        subFields: [
          {
            field: 'use1',
            type: 'select',
            label: 'Use Type 1',
            options: ['Residential', 'Retail', 'Office', 'Hotel', 'Entertainment', 'Parking']
          },
          {
            field: 'use2',
            type: 'select',
            label: 'Use Type 2',
            options: ['Residential', 'Retail', 'Office', 'Hotel', 'Entertainment', 'Parking']
          },
          {
            field: 'type',
            type: 'select',
            label: 'Interaction Type',
            options: ['Synergy', 'Conflict', 'Neutral', 'Dependency']
          },
          {
            field: 'impact',
            type: 'select',
            label: 'Impact Level',
            options: ['High Positive', 'Medium Positive', 'Low Positive', 'Neutral', 'Low Negative', 'Medium Negative', 'High Negative']
          },
          { field: 'mitigation', type: 'string', label: 'Mitigation Strategy' }
        ]
      },
      {
        field: 'sharedSystems',
        type: 'array',
        label: 'Shared Systems',
        description: 'Building systems shared across multiple uses',
        validation: { min: 1 },
        subFields: [
          {
            field: 'system',
            type: 'select',
            label: 'System Type',
            options: ['HVAC', 'Elevators', 'Fire Safety', 'Security', 'Utilities', 'Waste Management', 'IT/Telecom']
          },
          { field: 'uses', type: 'string', label: 'Uses Served' },
          {
            field: 'allocation',
            type: 'select',
            label: 'Cost Allocation',
            options: ['Square Footage', 'Usage-Based', 'Equal Split', 'Capacity-Based']
          },
          { field: 'conflicts', type: 'string', label: 'Potential Conflicts' }
        ]
      },
      {
        field: 'customerFlow',
        type: 'object',
        label: 'Customer Flow Analysis',
        description: 'Analysis of customer movement between uses',
        subFields: [
          FieldDefinitionFactory.percentage('crossShopping', 'Cross-Shopping Rate'),
          FieldDefinitionFactory.percentage('sharedParking', 'Shared Parking Utilization'),
          { field: 'peakTimes', type: 'string', label: 'Peak Usage Times by Use' }
        ]
      }
    ],
    
    templates: ['interactionMatrix', 'conflictAnalysis', 'synergyOptimization'],
    reportSections: ['Interaction Summary', 'Synergy Analysis', 'Conflict Management', 'Flow Optimization'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'detailed',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of cross-use interactions, synergies, and conflict mitigation',
      methodology: 'Maps interactions between uses and identifies optimization opportunities',
      interpretation: 'Higher synergy scores indicate better use integration and value creation'
    }
  },

  // 27. Operational Integration Analysis
  {
    id: 'mixeduse-operational-integration',
    name: 'Operational Integration Analysis',
    description: 'Analyze operational efficiency and cost sharing',
    category: 'Operational',
    propertyTypes: ['mixed-use'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'operationalEfficiency', 'costSharingOptimization', 'managementEfficiency',
      'serviceIntegration', 'utilityOptimization', 'maintenanceEfficiency',
      'staffingOptimization', 'systemRedundancy', 'operationalSynergies'
    ],
    
    requiredFields: [
      {
        field: 'management',
        type: 'object',
        label: 'Management Structure',
        description: 'Management and operational structure',
        subFields: [
          {
            field: 'structure',
            type: 'select',
            label: 'Management Structure',
            options: ['Single Manager', 'Separate Managers', 'Hybrid Model', 'Third-Party Management']
          },
          { field: 'staffing', type: 'string', label: 'Staffing Model' },
          {
            field: 'costAllocation',
            type: 'select',
            label: 'Cost Allocation Method',
            options: ['Square Footage', 'Revenue-Based', 'Usage-Based', 'Hybrid']
          }
        ]
      },
      {
        field: 'sharedServices',
        type: 'array',
        label: 'Shared Services',
        description: 'Services shared across multiple use components',
        validation: { min: 1 },
        subFields: [
          {
            field: 'service',
            type: 'select',
            label: 'Service Type',
            options: ['Security', 'Cleaning', 'Maintenance', 'Landscaping', 'Waste Management', 'IT Support', 'Concierge']
          },
          { field: 'provider', type: 'string', label: 'Service Provider' },
          FieldDefinitionFactory.currency('cost', 'Annual Cost'),
          {
            field: 'allocation',
            type: 'select',
            label: 'Cost Allocation',
            options: ['Square Footage', 'Usage-Based', 'Equal Split', 'Benefit-Based']
          }
        ]
      },
      {
        field: 'utilities',
        type: 'object',
        label: 'Utility Management',
        description: 'Utility metering and cost allocation',
        subFields: [
          { field: 'masterMetered', type: 'boolean', label: 'Master Metered' },
          { field: 'submetering', type: 'boolean', label: 'Submetering Available' },
          {
            field: 'allocation',
            type: 'select',
            label: 'Utility Allocation Method',
            options: ['Square Footage', 'Usage-Based', 'Separate Meters', 'RUBS']
          }
        ]
      },
      {
        field: 'maintenance',
        type: 'array',
        label: 'Maintenance Systems',
        description: 'Maintenance responsibilities and cost allocation',
        validation: { min: 1 },
        subFields: [
          {
            field: 'system',
            type: 'select',
            label: 'System/Area',
            options: ['HVAC', 'Elevators', 'Common Areas', 'Parking', 'Roof', 'Exterior', 'Landscaping', 'Security Systems']
          },
          {
            field: 'responsibility',
            type: 'select',
            label: 'Maintenance Responsibility',
            options: ['Landlord', 'Tenant', 'Shared', 'Third-Party']
          },
          FieldDefinitionFactory.currency('cost', 'Annual Maintenance Cost')
        ]
      }
    ],
    
    templates: ['operationalAnalysis', 'costAllocationReport', 'efficiencyOptimization'],
    reportSections: ['Management Structure', 'Service Integration', 'Utility Management', 'Maintenance Optimization'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'detailed',
    calculationPriority: 'medium',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Analysis of operational integration and cost sharing efficiency',
      methodology: 'Evaluates management structure, service integration, and cost allocation methods',
      interpretation: 'Higher efficiency scores indicate better operational integration and cost management'
    }
  },

  // 28. Development & Repositioning Potential
  {
    id: 'mixeduse-development',
    name: 'Development & Repositioning Potential',
    description: 'Analyze development opportunities and optimal mix',
    category: 'Development',
    propertyTypes: ['mixed-use'],
    investmentStrategies: ['Development', 'Opportunistic', 'Value-Add'],
    
    includedMetrics: [
      'developmentYield', 'optimalMixAnalysis', 'densityOptimization',
      'marketDemandAlignment', 'developmentFeasibility', 'phasingStrategy',
      'repositioningROI', 'landUtilization', 'zoneOptimization'
    ],
    
    requiredFields: [
      {
        field: 'currentState',
        type: 'object',
        label: 'Current State',
        description: 'Current property characteristics and utilization',
        subFields: [
          { field: 'totalSF', type: 'number', label: 'Total Square Footage', validation: { min: 10000 } },
          { field: 'landArea', type: 'number', label: 'Land Area (sq ft)', validation: { min: 5000 } },
          { field: 'far', type: 'number', label: 'Current FAR', validation: { min: 0.1, max: 20 } },
          { field: 'parkingRatio', type: 'number', label: 'Parking Ratio (spaces/1000 SF)' }
        ]
      },
      {
        field: 'zoning',
        type: 'object',
        label: 'Zoning Analysis',
        description: 'Zoning regulations and development potential',
        subFields: [
          { field: 'allowedUses', type: 'string', label: 'Allowed Uses' },
          { field: 'maxFAR', type: 'number', label: 'Maximum FAR', validation: { min: 0.1, max: 20 } },
          { field: 'maxHeight', type: 'number', label: 'Maximum Height (feet)', validation: { min: 20 } },
          { field: 'bonuses', type: 'string', label: 'Density Bonuses Available' }
        ]
      },
      {
        field: 'marketDemand',
        type: 'array',
        label: 'Market Demand Analysis',
        description: 'Demand for different use types in the market',
        validation: { min: 2 },
        subFields: [
          {
            field: 'use',
            type: 'select',
            label: 'Use Type',
            options: ['Residential', 'Retail', 'Office', 'Hotel', 'Entertainment', 'Parking']
          },
          {
            field: 'demand',
            type: 'select',
            label: 'Demand Level',
            options: ['High', 'Medium', 'Low', 'Oversupplied']
          },
          FieldDefinitionFactory.currency('achievableRent', 'Achievable Rent/Price'),
          { field: 'absorption', type: 'number', label: 'Expected Absorption (months)' }
        ]
      },
      {
        field: 'developmentCosts',
        type: 'array',
        label: 'Development Costs',
        description: 'Construction costs by use type',
        validation: { min: 1 },
        subFields: [
          {
            field: 'use',
            type: 'select',
            label: 'Use Type',
            options: ['Residential', 'Retail', 'Office', 'Hotel', 'Entertainment', 'Parking', 'Common Areas']
          },
          FieldDefinitionFactory.currency('costPSF', 'Cost per Square Foot'),
          { field: 'timeline', type: 'number', label: 'Construction Timeline (months)' }
        ]
      }
    ],
    
    optionalFields: [
      {
        field: 'incentives',
        type: 'array',
        label: 'Development Incentives',
        subFields: [
          { field: 'incentive', type: 'string', label: 'Incentive Type' },
          FieldDefinitionFactory.currency('value', 'Estimated Value'),
          { field: 'requirements', type: 'string', label: 'Requirements' }
        ]
      }
    ],
    
    templates: ['developmentAnalysis', 'optimalMixStudy', 'feasibilityReport'],
    reportSections: ['Development Summary', 'Optimal Mix Analysis', 'Market Feasibility', 'Financial Projections'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Analysis of development and repositioning opportunities for mixed-use properties',
      methodology: 'Evaluates optimal use mix, market demand, and development feasibility',
      interpretation: 'Higher development yields indicate better development opportunities and market positioning'
    }
  }
];

