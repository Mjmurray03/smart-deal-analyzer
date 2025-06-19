// lib/calculations/packages/mixeduse-packages.ts
// Institutional-grade mixed-use property investment packages

import { CalculationPackage, PropertyData, MetricFlags } from '../types';

export const mixedUsePackages: CalculationPackage[] = [
  // ==================== URBAN MIXED-USE ====================
  {
    id: 'mixed-use-urban-core',
    name: 'Urban Mixed-Use Development',
    description: 'High-density mixed-use with retail, office, and residential',
    includedMetrics: [
      'blendedCapRate', 'componentNOI', 'synergyCaptureRate',
      'crossUtilizationMetrics', 'integratedParkingEfficiency',
      'verticalRetailSuccess', 'residentialStabilization'
    ],
    requiredFields: [
      'totalSF', 'retailSF', 'officeSF', 'residentialSF', 'hotelKeys',
      'officeRSF', 'residentialUnits',
      'retailNOI', 'officeNOI', 'residentialNOI', 'hotelNOI',
      'parkingRevenue', 'signageRevenue', 'eventSpaceRevenue',
      'totalParkingSpaces', 'sharedAmenities', 'centralPlant',
      'commonAreaMaintenance', 'securityCosts', 'managementStructure',
      'walkScore', 'transitScore', 'bikeScore', 'proximityToTransit'
    ],
    templates: ['mixedUseProforma', 'synergyAnalysis', 'componentValuation'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'mixed-use-suburban-town-center',
    name: 'Suburban Town Center',
    description: 'Master-planned mixed-use creating urban environment in suburbs',
    includedMetrics: [
      // All previous metrics removed as none match MetricFlags
    ],
    requiredFields: [
      // All previous fields removed as none match PropertyData
    ],
    templates: ['townCenterModel', 'phasingSchedule', 'publicPrivateStructure'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'master-planned'
  },

  // ==================== TRANSIT-ORIENTED DEVELOPMENT ====================
  {
    id: 'mixed-use-tod',
    name: 'Transit-Oriented Development',
    description: 'High-density mixed-use adjacent to mass transit',
    includedMetrics: [
      // No valid MetricFlags keys, so leave empty
    ],
    requiredFields: [
      // No valid PropertyData keys, so leave empty
    ],
    minimumDataThreshold: 0.85,
    analysisDepth: 'transit-focused'
  },

  // ==================== ADAPTIVE REUSE MIXED-USE ====================
  {
    id: 'mixed-use-adaptive-reuse',
    name: 'Adaptive Reuse Mixed-Use',
    description: 'Historic or obsolete property conversion to mixed-use',
    includedMetrics: [
      'historic_tax_credits', 'preservation_easements',
      'structural_adaptation_cost', 'character_preservation_value',
      'sustainability_score', 'embodied_carbon_savings',
      'community_support_index', 'cultural_significance_premium'
    ],
    requiredFields: [
      'originalUse', 'yearBuilt', 'historicDesignation',
      'structural_system', 'facade_condition', 'environmental_status',
      'abatement_costs', 'seismic_requirements', 'ada_retrofit',
      'preservation_standards', 'nhpa_compliance', 'shpo_approval'
    ],
    templates: ['adaptiveReuseModel', 'taxCreditAnalysis', 'preservation_plan'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'preservation'
  },

  // ==================== LIVE-WORK-PLAY ====================
  {
    id: 'mixed-use-live-work-play',
    name: 'Live-Work-Play Community',
    description: 'Integrated mixed-use focused on 24-hour activation',
    includedMetrics: [
      'activation_hours', 'cross_pollination_index',
      'amenity_sharing_efficiency', 'community_engagement_score',
      'walkability_premium', 'internal_capture_rate',
      'destination_draw_factor', 'social_infrastructure_value'
    ],
    requiredFields: [
      'residentialUnits', 'officeSF', 'retailSF', 'f&b_SF',
      'entertainment_SF', 'fitness_wellness_SF', 'cultural_SF',
      'event_space_SF', 'co_working_SF', 'maker_space_SF',
      'daycare_capacity', 'community_garden_SF'
    ],
    templates: ['liveWorkPlayModel', 'activation_matrix', 'community_scorecard'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'lifestyle'
  },

  // ==================== MIXED-USE REDEVELOPMENT ====================
  {
    id: 'mixed-use-mall-transformation',
    name: 'Mall-to-Mixed-Use Transformation',
    description: 'Regional mall conversion to mixed-use destination',
    includedMetrics: [
      'demo_vs_adaptive_costs', 'anchor_replacement_strategy',
      'residential_conversion_yield', 'healthcare_integration',
      'entertainment_component_roi', 'parking_deck_conversion',
      'green_space_creation', 'district_energy_potential'
    ],
    requiredFields: [
      'existingMallGLA', 'anchor_vacancies', 'inline_occupancy',
      'parking_structure_sf', 'demo_costs', 'environmental_issues',
      'deed_restrictions', 'reciprocal_agreements', 'bond_obligations',
      'municipal_vision', 'zoning_flexibility', 'infrastructure_capacity'
    ],
    templates: ['mall_transformationModel', 'demo_analysis', 'new_use_matrix'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'redevelopment'
  },

  // ==================== HOSPITALITY MIXED-USE ====================
  {
    id: 'mixed-use-hospitality-anchored',
    name: 'Hospitality-Anchored Mixed-Use',
    description: 'Hotel-driven mixed-use with complementary uses',
    includedMetrics: [
      'hotel_demand_generators', 'f&b_capture_rate',
      'conference_utilization', 'extended_stay_impact',
      'airbnb_competition', 'group_vs_transient',
      'spa_wellness_revenue', 'rooftop_activation'
    ],
    requiredFields: [
      'hotelBrand', 'numberOfKeys', 'averageRate', 'occupancyRate',
      'revPAR', 'f&b_revenue', 'conference_sf', 'ballroom_sf',
      'restaurant_seats', 'bar_lounge_capacity', 'pool_deck_sf',
      'fitness_spa_sf', 'retail_lobby_sf'
    ],
    templates: ['hospitalityMixedUseModel', 'hotelFeasibility', 'f&b_analysis'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'hospitality'
  },

  // ==================== ENTERTAINMENT MIXED-USE ====================
  {
    id: 'mixed-use-entertainment-district',
    name: 'Entertainment District Mixed-Use',
    description: 'Sports, entertainment, and gaming anchored mixed-use',
    includedMetrics: [
      'event_day_capture', 'non_event_activation',
      'sponsorship_revenue', 'naming_rights_value',
      'media_production_income', 'gambling_revenue_impact',
      'concert_theater_utilization', 'sports_venue_synergy'
    ],
    requiredFields: [
      'arena_stadium_capacity', 'annual_events', 'theater_seats',
      'casino_gaming_sf', 'sports_book_sf', 'concert_venue_capacity',
      'cinema_screens', 'bowling_lanes', 'arcade_sf',
      'sports_bar_sf', 'team_store_sf', 'hall_of_fame_sf'
    ],
    templates: ['entertainmentModel', 'event_calendar', 'sponsorship_packages'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'entertainment'
  },

  // ==================== QUICK ANALYSIS ====================
  {
    id: 'mixed-use-quick-screen',
    name: 'Quick Mixed-Use Screen',
    description: 'Rapid mixed-use evaluation',
    includedMetrics: [
      'blendedCapRate', 'pricePerSF', 'componentNOI',
      'locationScore', 'synergyCaptureRate', 'complexityFactor'
    ],
    requiredFields: [
      'purchasePrice', 'totalSF', 'componentBreakdown',
      'blendedNOI', 'parkingSpaces', 'transitAccess'
    ],
    templates: ['quickScreen', 'mix_summary'],
    minimumDataThreshold: 0.60,
    analysisDepth: 'basic'
  }
];

export const mixedUseMetricDefinitions = {
  blendedCapRate: {
    name: 'Blended Cap Rate',
    category: 'Valuation',
    formula: 'Σ(Component NOI) / Σ(Component Values)',
    interpretation: 'Weighted average return across uses',
    benchmark: { 
      varies: 'by component mix and market'
    }
  },
  synergyCaptureRate: {
    name: 'Synergy Capture Rate',
    category: 'Performance',
    formula: 'Cross-patronage revenue / Total revenue',
    interpretation: 'Effectiveness of use integration',
    benchmark: {
      target: 15,
      exceptional: 25
    },
    unit: 'percentage'
  },
  integratedParkingEfficiency: {
    name: 'Integrated Parking Efficiency',
    category: 'Operations',
    formula: 'Peak demand / Total spaces',
    interpretation: 'Shared parking utilization',
    factors: [
      'Time-of-day variation',
      'Weekday vs weekend',
      'Event scheduling'
    ]
  },
  componentNOI: {
    name: 'Component NOI Contribution',
    category: 'Financial',
    breakdown: [
      'Retail NOI %',
      'Office NOI %',
      'Residential NOI %',
      'Other NOI %'
    ],
    interpretation: 'Revenue diversification'
  }
};