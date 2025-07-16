// lib/calculations/packages/industrial-packages-enhanced.ts
// Enhanced industrial property calculation packages with complex field definitions

import { EnhancedCalculationPackage, FieldDefinition, FieldDefinitionFactory } from './enhanced-package-types';

export const enhancedIndustrialPackages: EnhancedCalculationPackage[] = [
  // 17. Building Functionality & Efficiency
  {
    id: 'industrial-building-functionality',
    name: 'Building Functionality & Efficiency',
    description: 'Analyze clear height, dock doors, and building efficiency',
    category: 'Operational',
    propertyTypes: ['industrial'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'functionalScore', 'clearHeightScore', 'loadingScore', 'powerScore',
      'layoutScore', 'dockDoorRatio', 'cubicFootage', 'tenantSuitability',
      'modernizationNeeds', 'competitiveAdvantage', 'functionalObsolescence'
    ],
    
    requiredFields: [
      {
        field: 'buildingSpecs',
        type: 'object',
        label: 'Building Specifications',
        description: 'Physical building characteristics and capabilities',
        subFields: [
          { field: 'totalSF', type: 'number', label: 'Total Square Feet', validation: { min: 10000 }, required: true },
          { field: 'clearHeight', type: 'number', label: 'Clear Height (feet)', validation: { min: 12, max: 50 }, required: true },
          { field: 'dockDoors', type: 'number', label: 'Number of Dock Doors', validation: { min: 0 }, required: true },
          { field: 'driveInDoors', type: 'number', label: 'Number of Drive-In Doors', validation: { min: 0 } },
          { field: 'columnSpacing', type: 'string', label: 'Column Spacing (e.g., 50x60)', required: true },
          { field: 'floorThickness', type: 'number', label: 'Floor Thickness (inches)', validation: { min: 4, max: 12 } }
        ]
      },
      {
        field: 'truckCourt',
        type: 'object',
        label: 'Truck Court Specifications',
        description: 'Truck maneuvering and parking areas',
        subFields: [
          { field: 'depth', type: 'number', label: 'Truck Court Depth (feet)', validation: { min: 100, max: 200 } },
          { field: 'concrete', type: 'boolean', label: 'Concrete Surface' },
          { field: 'trailerParking', type: 'number', label: 'Trailer Parking Spaces' },
          { field: 'carParking', type: 'number', label: 'Car Parking Spaces' }
        ]
      },
      {
        field: 'powerSpecs',
        type: 'object',
        label: 'Power Specifications',
        description: 'Electrical capacity and configuration',
        subFields: [
          { field: 'amps', type: 'number', label: 'Total Amps', validation: { min: 200 } },
          { field: 'voltage', type: 'number', label: 'Voltage', validation: { min: 110, max: 480 } },
          {
            field: 'powerType',
            type: 'select',
            label: 'Power Type',
            options: ['Single Phase', '3-Phase', 'Both']
          }
        ]
      },
      {
        field: 'propertyType',
        type: 'select',
        label: 'Property Type',
        options: ['Warehouse', 'Manufacturing', 'Flex', 'Cold Storage', 'Last Mile'],
        required: true
      },
      {
        field: 'tenantRequirements',
        type: 'array',
        label: 'Tenant Requirements',
        description: 'Specific tenant operational requirements',
        subFields: [
          { field: 'tenant', type: 'string', label: 'Tenant Name' },
          { field: 'clearHeightNeed', type: 'number', label: 'Clear Height Need (feet)' },
          { field: 'dockNeed', type: 'number', label: 'Dock Doors Needed' },
          { field: 'powerNeed', type: 'number', label: 'Power Need (KW)' }
        ]
      }
    ],
    
    optionalFields: [
      {
        field: 'specialFeatures',
        type: 'array',
        label: 'Special Features',
        subFields: [
          { field: 'feature', type: 'string', label: 'Feature' },
          { field: 'value', type: 'string', label: 'Value/Description' }
        ]
      }
    ],
    
    templates: ['functionalityReport', 'buildingAnalysis', 'modernizationPlan'],
    reportSections: ['Functionality Summary', 'Building Specifications', 'Efficiency Analysis', 'Tenant Suitability'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'technical',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Comprehensive analysis of industrial building functionality and efficiency',
      methodology: 'Evaluates building specifications against tenant requirements and market standards',
      interpretation: 'Higher functionality scores indicate better tenant suitability and market position'
    }
  },

  // 18. Location & Logistics Analysis
  {
    id: 'industrial-location-logistics',
    name: 'Location & Logistics Analysis',
    description: 'Analyze location efficiency for logistics operations',
    category: 'Market',
    propertyTypes: ['industrial'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add'],
    
    includedMetrics: [
      'locationScore', 'transportationScore', 'laborScore', 'marketScore',
      'lastMileSuitability', 'regionalSuitability', 'nationalSuitability',
      'logisticsEfficiency', 'competitivePosition', 'accessibilityScore'
    ],
    
    requiredFields: [
      {
        field: 'transportation',
        type: 'object',
        label: 'Transportation Access',
        description: 'Access to major transportation infrastructure',
        subFields: [
          { field: 'highwayDistance', type: 'number', label: 'Highway Distance (miles)', validation: { min: 0, max: 50 } },
          { field: 'highwayName', type: 'string', label: 'Highway Name' },
          { field: 'portDistance', type: 'number', label: 'Port Distance (miles)', validation: { min: 0 } },
          { field: 'railAccess', type: 'boolean', label: 'Rail Access Available' },
          { field: 'airportDistance', type: 'number', label: 'Airport Distance (miles)', validation: { min: 0 } }
        ]
      },
      {
        field: 'laborMarket',
        type: 'object',
        label: 'Labor Market Analysis',
        description: 'Local labor market characteristics',
        subFields: [
          { field: 'population30min', type: 'number', label: 'Population within 30 minutes' },
          FieldDefinitionFactory.percentage('unemploymentRate', 'Unemployment Rate'),
          FieldDefinitionFactory.currency('avgWage', 'Average Wage ($/hour)'),
          { field: 'unionPresence', type: 'boolean', label: 'Union Presence' }
        ]
      },
      {
        field: 'lastMileMetrics',
        type: 'object',
        label: 'Last Mile Metrics',
        description: 'Suitability for last-mile delivery operations',
        subFields: [
          { field: 'populationServed', type: 'number', label: 'Population Served (within delivery radius)' },
          { field: 'avgDeliveryTime', type: 'number', label: 'Average Delivery Time (minutes)' },
          {
            field: 'congestionLevel',
            type: 'select',
            label: 'Traffic Congestion Level',
            options: ['Low', 'Medium', 'High', 'Severe']
          }
        ]
      },
      {
        field: 'competingFacilities',
        type: 'array',
        label: 'Competing Facilities',
        description: 'Competing industrial facilities in the area',
        validation: { min: 1 },
        subFields: [
          { field: 'name', type: 'string', label: 'Facility Name' },
          { field: 'distance', type: 'number', label: 'Distance (miles)' },
          { field: 'size', type: 'number', label: 'Size (sq ft)' },
          { field: 'tenant', type: 'string', label: 'Primary Tenant' }
        ]
      }
    ],
    
    templates: ['locationAnalysis', 'logisticsReport', 'competitiveMapping'],
    reportSections: ['Location Summary', 'Transportation Access', 'Labor Market', 'Logistics Efficiency'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'comprehensive',
    calculationPriority: 'high',
    formLayout: 'tabs',
    
    documentation: {
      overview: 'Analysis of location advantages for industrial and logistics operations',
      methodology: 'Evaluates transportation access, labor market, and competitive position',
      interpretation: 'Higher location scores indicate better logistics efficiency and tenant appeal'
    }
  },

  // 19. Cold Storage Facility Analysis
  {
    id: 'industrial-cold-storage',
    name: 'Cold Storage Facility Analysis',
    description: 'Specialized analysis for temperature-controlled facilities',
    category: 'Specialized',
    propertyTypes: ['industrial'],
    investmentStrategies: ['Core', 'Core-Plus', 'Value-Add', 'Specialized'],
    
    includedMetrics: [
      'temperatureZoneMix', 'energyIntensity', 'refrigerationEfficiency',
      'operationalMetrics', 'systemRedundancy', 'coldStoragePremium',
      'energyCostAnalysis', 'capExConsiderations', 'tenantSuitability'
    ],
    
    requiredFields: [
      {
        field: 'temperatureZones',
        type: 'array',
        label: 'Temperature Zones',
        description: 'Different temperature zones within the facility',
        validation: { min: 1 },
        subFields: [
          {
            field: 'zone',
            type: 'select',
            label: 'Zone Type',
            options: ['Ambient', 'Cooler', 'Freezer', 'Blast Freezer', 'Controlled Atmosphere']
          },
          { field: 'squareFootage', type: 'number', label: 'Square Footage', validation: { min: 100 } },
          { field: 'temperature', type: 'number', label: 'Temperature (°F)', validation: { min: -20, max: 70 } },
          FieldDefinitionFactory.percentage('humidity', 'Humidity Level')
        ]
      },
      {
        field: 'refrigerationSystems',
        type: 'array',
        label: 'Refrigeration Systems',
        description: 'Refrigeration equipment and specifications',
        validation: { min: 1 },
        subFields: [
          { field: 'system', type: 'string', label: 'System Type' },
          { field: 'capacity', type: 'number', label: 'Capacity (tons)' },
          { field: 'age', type: 'number', label: 'Age (years)' },
          {
            field: 'refrigerant',
            type: 'select',
            label: 'Refrigerant Type',
            options: ['Ammonia', 'Freon', 'CO2', 'Glycol', 'Other']
          },
          FieldDefinitionFactory.percentage('efficiency', 'Energy Efficiency Rating')
        ]
      },
      {
        field: 'energyConsumption',
        type: 'object',
        label: 'Energy Consumption',
        description: 'Energy usage and costs',
        subFields: [
          { field: 'annualKwh', type: 'number', label: 'Annual kWh Usage', validation: { min: 10000 } },
          { field: 'peakDemand', type: 'number', label: 'Peak Demand (kW)' },
          FieldDefinitionFactory.currency('powerCost', 'Power Cost ($/kWh)')
        ]
      },
      {
        field: 'certifications',
        type: 'array',
        label: 'Certifications',
        description: 'Food safety and operational certifications',
        subFields: [
          {
            field: 'type',
            type: 'select',
            label: 'Certification Type',
            options: ['HACCP', 'SQF', 'BRC', 'FDA', 'USDA', 'Organic', 'Other']
          },
          { field: 'agency', type: 'string', label: 'Certifying Agency' },
          { field: 'expiration', type: 'date', label: 'Expiration Date' }
        ]
      },
      {
        field: 'productTypes',
        type: 'array',
        label: 'Product Types',
        description: 'Types of products stored in the facility',
        subFields: [
          { field: 'product', type: 'string', label: 'Product Category' },
          { field: 'tempRequirement', type: 'number', label: 'Temperature Requirement (°F)' },
          { field: 'throughput', type: 'number', label: 'Throughput (pallets/day)' }
        ]
      }
    ],
    
    templates: ['coldStorageAnalysis', 'energyEfficiencyReport', 'operationalMetrics'],
    reportSections: ['Cold Storage Summary', 'System Analysis', 'Energy Analysis', 'Operational Efficiency'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'specialized',
    calculationPriority: 'high',
    formLayout: 'sections',
    
    documentation: {
      overview: 'Specialized analysis for cold storage and temperature-controlled facilities',
      methodology: 'Evaluates temperature zones, refrigeration systems, and energy efficiency',
      interpretation: 'Higher efficiency scores indicate better operational performance and lower operating costs'
    }
  },

  // 20. Last-Mile Facility Analysis
  {
    id: 'industrial-last-mile',
    name: 'Last-Mile Facility Analysis',
    description: 'Analyze facility for last-mile delivery operations',
    category: 'Specialized',
    propertyTypes: ['industrial'],
    investmentStrategies: ['Core-Plus', 'Value-Add', 'Specialized'],
    
    includedMetrics: [
      'lastMileScore', 'throughputCapacity', 'deliveryEfficiency',
      'operationalMetrics', 'locationAdvantage', 'automationReadiness',
      'expansionPotential', 'competitivePosition', 'eCommerceIndex'
    ],
    
    requiredFields: [
      {
        field: 'deliveryMetrics',
        type: 'object',
        label: 'Delivery Operations',
        description: 'Daily delivery operation metrics',
        subFields: [
          { field: 'dailyPackages', type: 'number', label: 'Daily Packages Processed', validation: { min: 100 } },
          { field: 'deliveryVans', type: 'number', label: 'Number of Delivery Vans', validation: { min: 5 } },
          { field: 'peakHours', type: 'string', label: 'Peak Operation Hours' }
        ]
      },
      {
        field: 'populationDensity',
        type: 'array',
        label: 'Population Density',
        description: 'Population within delivery radius',
        validation: { min: 1 },
        subFields: [
          { field: 'radius', type: 'number', label: 'Radius (miles)', validation: { min: 5, max: 100 } },
          { field: 'population', type: 'number', label: 'Population' },
          { field: 'households', type: 'number', label: 'Households' }
        ]
      },
      {
        field: 'accessMetrics',
        type: 'object',
        label: 'Access Metrics',
        description: 'Facility access and circulation metrics',
        subFields: [
          { field: 'ingressEgress', type: 'number', label: 'Ingress/Egress Points' },
          { field: 'queueLength', type: 'number', label: 'Queue Length (vehicles)' },
          { field: 'turnaroundTime', type: 'number', label: 'Turnaround Time (minutes)' }
        ]
      },
      {
        field: 'technology',
        type: 'object',
        label: 'Technology Integration',
        description: 'Automation and technology systems',
        subFields: [
          {
            field: 'sortingAutomation',
            type: 'select',
            label: 'Sorting Automation',
            options: ['Manual', 'Semi-Automated', 'Fully Automated']
          },
          { field: 'wms', type: 'boolean', label: 'Warehouse Management System' },
          { field: 'crossDocking', type: 'boolean', label: 'Cross-Docking Capability' }
        ]
      },
      {
        field: 'flexSpace',
        type: 'object',
        label: 'Flexible Space',
        description: 'Office and support space configuration',
        subFields: [
          { field: 'officeSF', type: 'number', label: 'Office Space (sq ft)' },
          { field: 'parkingRatio', type: 'number', label: 'Parking Ratio (spaces per 1000 SF)' },
          { field: 'evCharging', type: 'boolean', label: 'EV Charging Stations' }
        ]
      }
    ],
    
    templates: ['lastMileAnalysis', 'deliveryOptimization', 'operationalReport'],
    reportSections: ['Last-Mile Summary', 'Delivery Metrics', 'Technology Analysis', 'Optimization Opportunities'],
    exportFormats: ['pdf', 'excel', 'json'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'specialized',
    calculationPriority: 'high',
    formLayout: 'wizard',
    
    documentation: {
      overview: 'Specialized analysis for last-mile delivery and fulfillment facilities',
      methodology: 'Evaluates delivery capacity, location advantages, and operational efficiency',
      interpretation: 'Higher last-mile scores indicate better positioning for e-commerce growth'
    }
  }
];

