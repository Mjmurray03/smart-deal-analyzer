// lib/calculations/packages/retail-packages.ts
// Institutional-grade retail property investment packages

import { CalculationPackage, PropertyData, MetricFlags } from '../types';

export const retailPackages: CalculationPackage[] = [
  // ==================== GROCERY-ANCHORED ====================
  {
    id: 'retail-grocery-anchored',
    name: 'Grocery-Anchored Center',
    description: 'Necessity-based retail with credit grocery anchor',
    category: 'Core',
    includedMetrics: [
      'capRate', 'cashOnCash', 'dscr', 'irr', 'salesPerSF',
      'occupancyCostRatio', 'anchorSalesProductivity',
      'inlineTenantsNOI', 'percentageRent', 'camRecovery',
      'tradeAreaDemographics', 'grocerMarketShare'
    ],
    requiredFields: [
      // Property Info
      'totalGLA', 'anchorGLA', 'shopGLA', 'padSites',
      'parkingSpaces', 'yearBuilt', 'lastRenovated',
      
      // Anchor Details
      'anchorTenant', 'anchorLeaseExpiration', 'anchorRentPSF',
      'anchorSalesVolume', 'anchorOptions', 'anchorCoTenancy',
      
      // Financial
      'purchasePrice', 'currentNOI', 'grossIncome', 'camExpenses',
      'camReimbursements', 'percentageRentCollected',
      
      // Demographics
      'population3Mile', 'population5Mile', 'avgHHIncome3Mile',
      'daytimePopulation', 'trafficCount'
    ],
    optionalFields: [
      'competitorDistance', 'online_grocery_impact', 'curbside_pickup',
      'pharmacy_presence', 'fuel_center', 'exclusive_uses',
      'shadow_anchor', 'outparcel_development'
    ],
    templates: ['groceryAnchoredModel', 'salesAnalysis', 'tradeAreaMap'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'retail-power-center',
    name: 'Power Center',
    description: 'Big box retail with multiple anchors',
    category: 'Core-Plus',
    includedMetrics: [
      'anchorDependency', 'coTenancyRisk', 'boxDivisionPotential',
      'ecommerceResilience', 'categoryDiversification',
      'parkingFieldValue', 'redevelopmentOptions'
    ],
    requiredFields: [
      'totalGLA', 'numberOfAnchors', 'anchorTenants', 'anchorExpirations',
      'anchorSalesReporting', 'coTenancyClauses', 'goingDarkRights',
      'parkingFieldSF', 'excessLandSF', 'crossAccessEasements',
      'reciprocalAgreements', 'padSitePotential'
    ],
    optionalFields: [
      'entertainment_component', 'fitness_users', 'medical_tenants',
      'experiential_percentage', 'last_mile_conversion',
      'solar_income_potential', 'ev_charging_revenue'
    ],
    templates: ['powerCenterModel', 'anchorMatrix', 'redevelopmentScenarios'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'detailed'
  },

  // ==================== LIFESTYLE/SPECIALTY ====================
  {
    id: 'retail-lifestyle-center',
    name: 'Lifestyle Center',
    description: 'Open-air shopping with dining and entertainment focus',
    category: 'Value-Add',
    includedMetrics: [
      'salesPerSF', 'dining_entertainment_mix', 'eventIncome',
      'socialMediaMetrics', 'dwellTime', 'visitFrequency',
      'tenantSalesGrowth', 'experientialScore'
    ],
    requiredFields: [
      'totalGLA', 'restaurantGLA', 'entertainmentGLA', 'retailGLA',
      'commonAreaSF', 'eventSpaceSF', 'outdoorSeating',
      'tenantSalesReporting', 'percentageRentStructure',
      'marketingFund', 'sponsorshipIncome', 'parkingRevenue'
    ],
    optionalFields: [
      'wi-fi_analytics', 'loyalty_program', 'app_engagement',
      'food_hall_component', 'popup_revenue', 'seasonal_activation',
      'residential_integration', 'hotel_component'
    ],
    templates: ['lifestyleModel', 'tenantMixStrategy', 'eventCalendar'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'experiential'
  },

  {
    id: 'retail-strip-center',
    name: 'Neighborhood Strip Center',
    description: 'Convenience-oriented neighborhood retail',
    category: 'Core',
    includedMetrics: [
      'serviceTenantsPercentage', 'medicalDentalComponent',
      'quickServiceRestaurants', 'localTenantRisk',
      'driveTimeAnalysis', 'repeat_visit_frequency'
    ],
    requiredFields: [
      'totalGLA', 'numberOfTenants', 'tenantMix', 'localVsNational',
      'averageTenantSize', 'parkingRatio', 'visibility',
      'ingressEgress', 'population1Mile', 'rooftopCount'
    ],
    optionalFields: [
      'driveThru_count', 'medical_buildout', 'pet_services',
      'fitness_boutique', 'daycare_presence', 'municipal_services'
    ],
    templates: ['stripCenterModel', 'tenantRoster', 'local_analysis'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'standard'
  },

  // ==================== SINGLE-TENANT NET LEASE ====================
  {
    id: 'retail-single-tenant-nnn',
    name: 'Single-Tenant Net Lease',
    description: 'Triple-net investment grade retail',
    category: 'Net Lease',
    includedMetrics: [
      'creditAnalysis', 'leaseTermRemaining', 'rentBumps',
      'corporateGuarantee', 'darkStoreRisk', 'replacementCost',
      'alternativeUse', 'saleLeasebackPremium'
    ],
    requiredFields: [
      'tenant', 'creditRating', 'guarantorEntity', 'originalLeaseDate',
      'leaseExpiration', 'baseRent', 'rentIncreases', 'optionPeriods',
      'buildingSF', 'landSF', 'constructionType', 'darkProvisions'
    ],
    optionalFields: [
      'percentageRent', 'radius_restriction', 'continuous_operation',
      'alterationRights', 'assignment_subletting', 'purchase_options',
      'master_lease_portfolio'
    ],
    templates: ['nnnModel', 'creditPackage', 'lease_abstract'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'credit-focused'
  },

  // ==================== SPECIALTY RETAIL ====================
  {
    id: 'retail-outlet-center',
    name: 'Outlet Center',
    description: 'Manufacturer direct and off-price retail',
    category: 'Specialty',
    includedMetrics: [
      'tourism_dependency', 'trade_radius', 'tour_bus_revenue',
      'brand_mix_score', 'comp_sales_growth', 'coupon_redemption',
      'international_visitor_percentage', 'seasonal_volatility'
    ],
    requiredFields: [
      'totalGLA', 'numberOfStores', 'luxuryBrandCount',
      'touristAttractions', 'distanceToMetro', 'annualVisitors',
      'salesPerSF', 'commonAreaCharges', 'marketingAssessment',
      'valet_income', 'tour_partnerships'
    ],
    optionalFields: [
      'shuttle_service', 'tourist_info_center', 'currency_exchange',
      'tax_free_shopping', 'personal_shopping', 'vip_lounge',
      'event_pavilion', 'food_truck_plaza'
    ],
    templates: ['outletModel', 'tourism_analysis', 'brand_scorecard'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'tourism'
  },

  // ==================== REDEVELOPMENT ====================
  {
    id: 'retail-redevelopment',
    name: 'Retail Redevelopment/Densification',
    description: 'Mall or big box transformation opportunity',
    category: 'Redevelopment',
    includedMetrics: [
      'existingNOI', 'landValue', 'far_utilization',
      'mixed_use_potential', 'residential_density', 'entitlement_risk',
      'phasing_analysis', 'public_subsidy_potential'
    ],
    requiredFields: [
      'currentGLA', 'landArea', 'zoning', 'allowableFAR',
      'parking_structures', 'demo_costs', 'environmental_status',
      'anchor_lease_buyouts', 'easement_modifications',
      'municipality_support', 'tif_eligibility'
    ],
    optionalFields: [
      'historic_designation', 'opportunity_zone', 'brownfield_status',
      'infrastructure_needs', 'utility_capacity', 'traffic_studies',
      'community_benefits', 'affordable_housing_requirement'
    ],
    templates: ['redevelopmentModel', 'highest_best_use', 'phasing_plan'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'development'
  },

  // ==================== E-COMMERCE RESISTANT ====================
  {
    id: 'retail-service-medical',
    name: 'Service & Medical Retail',
    description: 'E-commerce resistant service and medical tenants',
    category: 'Defensive',
    includedMetrics: [
      'medical_percentage', 'service_percentage', 'amazon_resistance',
      'appointment_based_percentage', 'healthcare_system_affiliation',
      'medicare_reimbursement_exposure', 'wellness_trend_alignment'
    ],
    requiredFields: [
      'medicalGLA', 'serviceGLA', 'retailGLA', 'medicalTenants',
      'imaging_center', 'urgent_care', 'physical_therapy',
      'medical_parking_ratio', 'ada_compliance', 'hvac_medical_grade'
    ],
    optionalFields: [
      'surgery_center', 'dialysis', 'cancer_treatment',
      'medical_office_conversion', 'helicopter_pad',
      'medical_waste_handling', 'generator_backup'
    ],
    templates: ['medicalRetailModel', 'provider_analysis', 'payor_mix'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'specialized'
  },

  // ==================== QUICK ANALYSIS ====================
  {
    id: 'retail-quick-screen',
    name: 'Quick Retail Screen',
    description: 'Rapid evaluation for initial screening',
    category: 'Screening',
    includedMetrics: [
      'capRate', 'pricePerSF', 'occupancy', 'sales_psf',
      'anchor_dependency', 'trade_area_strength'
    ],
    requiredFields: [
      'purchasePrice', 'totalGLA', 'currentNOI', 'currentOccupancy',
      'anchorTenant', 'population3Mile', 'avgHHIncome3Mile'
    ],
    optionalFields: ['recentSales', 'tenantWatchlist', 'upcomingVacancies'],
    templates: ['quickScreen', 'snapshot'],
    minimumDataThreshold: 0.60,
    analysisDepth: 'basic'
  }
];

export const retailMetricDefinitions = {
  occupancyCostRatio: {
    name: 'Occupancy Cost Ratio',
    category: 'Tenant Health',
    formula: 'Total Rent / Tenant Sales',
    benchmark: { 
      'General Retail': { min: 8, target: 10, max: 13 },
      'Restaurants': { min: 6, target: 8, max: 10 },
      'Service': { min: 10, target: 15, max: 20 }
    },
    unit: 'percentage'
  },
  salesPerSF: {
    name: 'Sales Per Square Foot',
    category: 'Performance',
    frequency: 'Annual',
    benchmark: {
      'Grocery': { min: 400, target: 500, max: 700 },
      'Apparel': { min: 200, target: 350, max: 500 },
      'Restaurant': { min: 300, target: 450, max: 600 }
    },
    unit: 'dollars'
  },
  coTenancyRisk: {
    name: 'Co-Tenancy Risk Score',
    category: 'Risk',
    factors: [
      'Anchor dependency',
      'Cross-default provisions',
      'Tenant concentration',
      'Lease expiration clustering'
    ],
    scoring: 'Low/Medium/High'
  }
};