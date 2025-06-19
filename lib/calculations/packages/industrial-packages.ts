// lib/calculations/packages/industrial-packages.ts
// Institutional-grade industrial property investment packages

import { CalculationPackage, PropertyData, MetricFlags } from '../types';

export const industrialPackages: CalculationPackage[] = [
  // ==================== LOGISTICS/DISTRIBUTION ====================
  {
    id: 'industrial-logistics-acquisition',
    name: 'Logistics & Distribution Center',
    description: 'Big box distribution and fulfillment center analysis',
    category: 'Logistics',
    includedMetrics: [
      'capRate', 'cashOnCash', 'dscr', 'irr', 'pricePerSF',
      'clearHeightPremium', 'dockDoorRatio', 'trailerParkingRatio',
      'powerCapacityAnalysis', 'locationScore', 'lastMileProximity'
    ],
    requiredFields: [
      // Building Specs
      'totalSquareFootage', 'clearHeight', 'numberOfDockDoors',
      'numberOfDriveInDoors', 'trailerParkingSpaces', 'carParkingSpaces',
      'columnSpacing', 'floorThickness', 'floorLoadCapacity',
      
      // Location
      'distanceToHighway', 'distanceToPort', 'distanceToAirport',
      'distanceToIntermodal', 'populationOneHour', 'laborAvailability',
      
      // Financial
      'purchasePrice', 'currentNOI', 'grossIncome', 'operatingExpenses',
      'currentOccupancy', 'leaseTermRemaining', 'tenantCreditRating',
      
      // Utilities
      'powerCapacity', 'powerCostPerKwh', 'gasAvailable', 'sewerCapacity'
    ],
    optionalFields: [
      'crossDockCapability', 'temperatureControlled', 'sprinklerSystem',
      'esdCompliance', 'railSiding', 'foreignTradeZone', 'truckerLounges',
      'ev_chargingInfrastructure', 'solar_readiness'
    ],
    templates: ['logisticsModel', 'locationAnalysis', 'tenantCreditReview'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'industrial-last-mile',
    name: 'Last-Mile Distribution',
    description: 'Urban infill logistics for e-commerce fulfillment',
    category: 'Last-Mile',
    includedMetrics: [
      'populationDensity1Mile', 'driveTimeAnalysis', 'deliveryRadius',
      'ecommercePenetration', 'competingFacilities', 'vanParkingRatio',
      'multiStoryFeasibility', 'truckAccessibility'
    ],
    requiredFields: [
      'totalSquareFootage', 'clearHeight', 'loadingPositions',
      'populationOneHour', 'households3Miles', 'medianHouseholdIncome',
      'trafficCounts', 'ingressEgress', 'powerForEV', 'fiberConnectivity',
      'currentRentPSF', 'marketRentGrowth', 'ecommerceDeliveryVolume'
    ],
    optionalFields: [
      'rooftopParking', 'mezzanineSpace', 'chargingStations',
      'refrigerationCapacity', 'conveyorSystems', 'automationReadiness'
    ],
    templates: ['lastMileModel', 'deliveryAnalytics', 'urbanLogistics'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'specialized'
  },

  // ==================== MANUFACTURING ====================
  {
    id: 'industrial-manufacturing',
    name: 'Manufacturing Facility',
    description: 'Heavy and light manufacturing property analysis',
    category: 'Manufacturing',
    includedMetrics: [
      'powerIntensity', 'utilityRedundancy', 'environmentalCompliance',
      'specializedSystems', 'craneCapacity', 'railAccess',
      'hazmatCapability', 'waterUsageRights'
    ],
    requiredFields: [
      'totalSquareFootage', 'productionSF', 'warehouseSF', 'officeSF',
      'powerCapacity', 'voltageAvailable', 'naturalGasCapacity',
      'waterCapacity', 'sewerCapacity', 'airPermits', 'zoningCompliance',
      'craneTonnage', 'compressedAir', 'specializedEquipment'
    ],
    optionalFields: [
      'iso_certifications', 'cleanRoomClass', 'temperatureControl',
      'humidityControl', 'vibrationIsolation', 'electromagneticShielding',
      'backupGenerators', 'ups_systems', 'fireSuppression'
    ],
    templates: ['manufacturingValuation', 'utilityAnalysis', 'equipmentSchedule'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'technical'
  },

  // ==================== COLD STORAGE ====================
  {
    id: 'industrial-cold-storage',
    name: 'Cold Storage Facility',
    description: 'Refrigerated and frozen storage facility analysis',
    category: 'Cold Storage',
    includedMetrics: [
      'temperatureZones', 'refrigerationRedundancy', 'energyIntensity',
      'insulationValue', 'rackingCapacity', 'blastFreezerCapacity',
      'ammonia_vs_freon', 'defrostSystems'
    ],
    requiredFields: [
      'totalCubicFeet', 'numberOfZones', 'temperatureRanges',
      'refrigerationSystems', 'refrigerationAge', 'energyUsagePSF',
      'insulationR-value', 'dockSealTypes', 'batteryChargingStations',
      'palletPositions', 'turns_per_year', 'commodityMix'
    ],
    optionalFields: [
      'usda_approval', 'fda_compliance', 'organic_certification',
      'blast_cells', 'rail_refrigerated', 'generator_capacity',
      'ammonia_sensors', 'employee_ppe_requirements'
    ],
    templates: ['coldStorageModel', 'energyAnalysis', 'commodityMatrix'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'specialized'
  },

  // ==================== FLEX/R&D ====================
  {
    id: 'industrial-flex-rd',
    name: 'Flex/R&D Space',
    description: 'Flexible industrial with office component',
    category: 'Flex',
    includedMetrics: [
      'officePercentage', 'labBuildOutPotential', 'parkingDensity',
      'hvacFlexibility', 'dataCapacity', 'divisibility',
      'showroomPotential', 'tech_tenant_appeal'
    ],
    requiredFields: [
      'totalSquareFootage', 'officeSF', 'warehouseSF', 'labSF',
      'clearHeight', 'loadingDocks', 'driveInDoors', 'parkingSpaces',
      'hvacZones', 'electricalCapacity', 'internetBandwidth',
      'divisibilityOptions', 'finishLevel'
    ],
    optionalFields: [
      'conferenceRooms', 'sharedAmenities', 'fitness_center',
      'cafeteria', 'outdoor_space', 'monument_signage',
      'clean_manufacturing', 'showroom_space'
    ],
    templates: ['flexModel', 'tenantMixAnalysis', 'improvement_allowances'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'detailed'
  },

  // ==================== DATA CENTERS ====================
  {
    id: 'industrial-data-center',
    name: 'Data Center Facility',
    description: 'Mission-critical data center infrastructure',
    category: 'Data Center',
    includedMetrics: [
      'powerDensity', 'pue_rating', 'redundancyLevel', 'uptimeRating',
      'coolingCapacity', 'connectivityScore', 'securityLevel',
      'disaster_recovery', 'latency_metrics'
    ],
    requiredFields: [
      'totalPower_MW', 'it_load_MW', 'cooling_tons', 'raised_floor_sf',
      'generator_capacity', 'ups_capacity', 'fuel_storage_hours',
      'fiber_providers', 'meet_me_rooms', 'power_cost_kwh',
      'water_usage_gallons', 'tier_certification'
    ],
    optionalFields: [
      'renewable_energy', 'carbon_credits', 'water_recycling',
      'ai_ml_optimization', 'edge_capabilities', 'quantum_ready',
      'submarine_cable_access', 'satellite_uplinks'
    ],
    templates: ['datacenterModel', 'powerAnalysis', 'connectivityMap'],
    minimumDataThreshold: 0.95,
    analysisDepth: 'technical'
  },

  // ==================== SPECIALIZED INDUSTRIAL ====================
  {
    id: 'industrial-cannabis',
    name: 'Cannabis Cultivation/Processing',
    description: 'Licensed cannabis facility analysis',
    category: 'Cannabis',
    includedMetrics: [
      'canopySquareFootage', 'plantsPerSF', 'gramsPerSF',
      'hvacLoadPerSF', 'waterUsageTracking', 'securityCompliance',
      'odorMitigation', 'state_local_compliance'
    ],
    requiredFields: [
      'cultivationSF', 'processingSF', 'packagingSF', 'vaultSF',
      'licenses_held', 'license_transferability', 'track_trace_system',
      'security_systems', 'hvac_redundancy', 'water_recycling',
      'power_backup', 'local_approvals'
    ],
    optionalFields: [
      'extraction_equipment', 'testing_lab', 'kitchen_mip',
      'retail_license', 'delivery_license', 'social_equity',
      'union_agreements', 'supply_agreements'
    ],
    templates: ['cannabisModel', 'licenseValuation', 'compliance_matrix'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'specialized'
  },

  // ==================== OUTDOOR STORAGE ====================
  {
    id: 'industrial-outdoor-storage',
    name: 'Industrial Outdoor Storage (IOS)',
    description: 'Truck yards, equipment yards, and container storage',
    category: 'IOS',
    includedMetrics: [
      'acreage', 'improved_percentage', 'fence_security',
      'surface_type', 'drainage_quality', 'weight_capacity',
      'ingress_egress', 'stacking_rights'
    ],
    requiredFields: [
      'total_acres', 'usable_acres', 'paved_acres', 'gravel_acres',
      'fence_height', 'gates_count', 'lighting_coverage',
      'truck_parking_spaces', 'container_capacity', 'equipment_allowed',
      'environmental_phase1', 'storm_water_permit'
    ],
    optionalFields: [
      'guard_house', 'truck_scale', 'maintenance_shop',
      'fuel_island', 'truck_wash', 'driver_amenities',
      'cbp_approved', 'rail_access'
    ],
    templates: ['iosModel', 'yardUtilization', 'environmental_checklist'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'basic'
  },

  // ==================== QUICK ANALYSIS ====================
  {
    id: 'industrial-quick-screen',
    name: 'Quick Industrial Screen',
    description: 'Rapid evaluation for initial screening',
    category: 'Screening',
    includedMetrics: [
      'capRate', 'pricePerSF', 'clearHeight', 'dockDoors',
      'location_score', 'occupancy'
    ],
    requiredFields: [
      'purchasePrice', 'totalSquareFootage', 'currentNOI',
      'clearHeight', 'numberOfDockDoors', 'currentOccupancy',
      'distanceToHighway', 'currentRentPSF'
    ],
    optionalFields: ['tenant_name', 'lease_expiration', 'submarket'],
    templates: ['quickScreen', 'comparables'],
    minimumDataThreshold: 0.60,
    analysisDepth: 'basic'
  }
];

export const industrialMetricDefinitions = {
  dockDoorRatio: {
    name: 'Dock Door Ratio',
    category: 'Functionality',
    formula: 'Dock Doors per 10,000 SF',
    benchmark: { 
      'Big Box': { min: 0.5, target: 1.0, max: 1.5 },
      'Last Mile': { min: 2.0, target: 3.0, max: 5.0 },
      'Manufacturing': { min: 0.3, target: 0.5, max: 1.0 }
    },
    unit: 'doors/10k SF'
  },
  clearHeightPremium: {
    name: 'Clear Height Premium',
    category: 'Valuation',
    interpretation: 'Rent premium per foot above 24\'',
    benchmark: { 
      premium: '2-3% per foot',
      baseline: 24
    }
  },
  locationScore: {
    name: 'Location Score',
    category: 'Location',
    factors: [
      'Highway proximity',
      'Population access',
      'Labor availability',
      'Intermodal access'
    ],
    scoring: '0-100 composite'
  }
};