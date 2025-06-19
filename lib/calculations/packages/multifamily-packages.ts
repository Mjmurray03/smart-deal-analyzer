// lib/calculations/packages/multifamily-packages.ts
// Institutional-grade multifamily property investment packages

import { CalculationPackage, PropertyData, MetricFlags } from '../types';

export const multifamilyPackages: CalculationPackage[] = [
  // ==================== CORE STRATEGIES ====================
  {
    id: 'mf-institutional-acquisition',
    name: 'Institutional Multifamily Acquisition',
    description: 'Comprehensive analysis for stabilized Class A/B multifamily properties',
    category: 'Core',
    includedMetrics: [
      'capRate', 'cashOnCash', 'dscr', 'irr', 'equityMultiple',
      'revPAU', 'rentPerSF', 'economicOccupancy', 'lossToLease',
      'expenseRatio', 'concessionRate', 'residentRetention'
    ],
    requiredFields: [
      // Property Details
      'propertyName', 'propertyType', 'yearBuilt', 'totalUnits',
      'averageUnitSize', 'currentOccupancy', 'marketOccupancy',
      
      // Unit Mix
      'studioUnits', 'oneBedUnits', 'twoBedUnits', 'threeBedUnits',
      'avgRentStudio', 'avgRent1Bed', 'avgRent2Bed', 'avgRent3Bed',
      'marketRentStudio', 'marketRent1Bed', 'marketRent2Bed', 'marketRent3Bed',
      
      // Financials
      'purchasePrice', 'currentNOI', 'grossIncome', 'operatingExpenses',
      'realEstateTaxes', 'insurance', 'utilities', 'repairsAndMaintenance',
      
      // Other Income
      'parkingIncome', 'petFeeIncome', 'storageIncome', 'utilityRecovery',
      
      // Debt
      'loanAmount', 'interestRate', 'loanTerm', 'amortizationPeriod'
    ],
    optionalFields: [
      'poolCount', 'fitnessCenter', 'businessCenter', 'dogPark',
      'coveredParking', 'gatedAccess', 'washerDryerInUnit',
      'recentRenovations', 'walkScore', 'schoolRatings'
    ],
    templates: ['multifamilyProforma', 'rentRoll', 'unitMixAnalysis'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'mf-student-housing',
    name: 'Student Housing Investment',
    description: 'Purpose-built student housing near major universities',
    category: 'Specialized',
    includedMetrics: [
      'bedLeaseAnalysis', 'preLeasingVelocity', 'summerOccupancy',
      'parentGuarantorRate', 'universityEnrollmentTrends',
      'competitiveBedSupply', 'walkToCampusTime'
    ],
    requiredFields: [
      'totalBeds', 'unitConfiguration', 'fallOccupancy', 'springOccupancy',
      'summerSession', 'academicYearLength', 'universityEnrollment',
      'onCampusHousing', 'preLeasingStartDate', 'avgRentPerBed',
      'utilitiesIncluded', 'furnishingStatus', 'internetIncluded'
    ],
    optionalFields: [
      'shuttleService', 'studyRooms', 'computerLab', 'recreationAmenities',
      'gatedSecurity', 'residentAssistants', 'academicSupport'
    ],
    templates: ['studentHousingModel', 'enrollmentAnalysis', 'competitiveSet'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'specialized'
  },

  // ==================== VALUE-ADD STRATEGIES ====================
  {
    id: 'mf-value-add-renovation',
    name: 'Value-Add Renovation Program',
    description: 'Classic to premium unit upgrade analysis with phased approach',
    category: 'Value-Add',
    includedMetrics: [
      'renovationROI', 'rentPremiumCapture', 'paybackPeriod',
      'unleveredYieldLift', 'leveragedReturns', 'lossToLeaseCapture',
      'phaseAnalysis', 'displacementCost'
    ],
    requiredFields: [
      'currentRentsByType', 'marketRentsByType', 'renovatedComps',
      'renovationCostPerUnit', 'scopeOfWork', 'unitsToRenovate',
      'monthlyRenovationPace', 'expectedRentLift', 'concessionBurnOff',
      'currentExpenseRatio', 'projectedExpenseRatio'
    ],
    optionalFields: [
      'contractorBids', 'permitTimeline', 'residentRelocation',
      'lossOfRentDuringReno', 'marketingBudgetIncrease'
    ],
    templates: ['renovationAnalysis', 'phasedProforma', 'returnWaterfall'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'detailed'
  },

  {
    id: 'mf-lease-up-acquisition',
    name: 'Lease-Up Acquisition',
    description: 'Newly delivered or unstabilized property lease-up analysis',
    category: 'Opportunistic',
    includedMetrics: [
      'absorptionProjections', 'concessionStrategy', 'stabilizationTimeline',
      'carryingCosts', 'marketingBudget', 'competitivePositioning',
      'velocityByUnitType', 'seasonalityAdjustments'
    ],
    requiredFields: [
      'currentOccupancy', 'deliveryDate', 'subMarketAbsorption',
      'competingNewSupply', 'proposedRentSchedule', 'concessionPackage',
      'marketingBudget', 'leasingStaffSize', 'modelUnitCount'
    ],
    optionalFields: [
      'preferredEmployerPrograms', 'brokerCoOp', 'socialMediaBudget',
      'movingSpecials', 'amenityActivation', 'grandOpeningEvents'
    ],
    templates: ['leaseUpModel', 'absorptionCurve', 'concessionAnalysis'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'dynamic'
  },

  // ==================== AFFORDABLE/WORKFORCE ====================
  {
    id: 'mf-affordable-housing',
    name: 'Affordable Housing Acquisition',
    description: 'LIHTC, Section 8, and workforce housing analysis',
    category: 'Affordable',
    includedMetrics: [
      'affordabilityCompliance', 'taxCreditValue', 'section8Analysis',
      'utilityAllowances', 'incomeVerification', 'rentRestrictions',
      'recertificationSchedule', 'waitlistDepth'
    ],
    requiredFields: [
      'affordableUnits', 'marketRateUnits', 'amiLevels', 'rentRestrictions',
      'compliancePeriodRemaining', 'section8Contract', 'hacPaymentStandard',
      'utilityAllowanceSchedule', 'qap_score', 'synergyWithTaxCredits'
    ],
    optionalFields: [
      'nonprofitSetAside', 'specialNeeds', 'seniorRestrictions',
      'ruralDesignation', 'qct_dda_status', 'radConversion'
    ],
    templates: ['lihtcModel', 'section8Analysis', 'complianceChecklist'],
    minimumDataThreshold: 0.90,
    analysisDepth: 'regulatory'
  },

  // ==================== SENIOR HOUSING ====================
  {
    id: 'mf-senior-independent-living',
    name: 'Senior Housing - Independent Living',
    description: 'Age-restricted multifamily and IL communities',
    category: 'Seniors',
    includedMetrics: [
      'penetrationRate', 'ageQualifiedHouseholds', 'competitiveCensus',
      'moveInRate', 'mortalityImpact', 'careProgressionAnalysis',
      'adaCompliance', 'medicareAdvantage'
    ],
    requiredFields: [
      'minimumAge', 'currentCensus', 'averageAge', 'marketPenetration',
      'primaryMarketRadius', 'seniors75Plus', 'medianSeniorIncome',
      'competitiveProperties', 'monthlyServiceFees', 'mealPlans'
    ],
    optionalFields: [
      'transportationServices', 'wellnessPrograms', 'socialActivities',
      'housekeepingIncluded', 'continuum_of_care', 'memoryCareLicense'
    ],
    templates: ['seniorHousingModel', 'marketPenetration', 'demographicAnalysis'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'demographic'
  },

  // ==================== BUILD-TO-RENT ====================
  {
    id: 'mf-build-to-rent',
    name: 'Build-to-Rent Community',
    description: 'Single-family rental and horizontal multifamily analysis',
    category: 'BTR',
    includedMetrics: [
      'yieldOnCost', 'developmentSpread', 'horizontalDensity',
      'maintenanceEfficiency', 'hoa_structure', 'sfr_premiums',
      'yard_maintenance', 'dispersedManagement'
    ],
    requiredFields: [
      'totalHomes', 'averageHomeSF', 'lotSizes', 'communityAcreage',
      'constructionCostPerHome', 'landCostPerLot', 'developmentTimeline',
      'expectedRentsByType', 'competingSFR_rates', 'propertyManagementModel'
    ],
    optionalFields: [
      'gatedEntry', 'communityPool', 'dogParks', 'walkingTrails',
      'smartHomeTechnology', 'solarPanels', 'ev_charging'
    ],
    templates: ['btrDevelopment', 'horizontalProforma', 'maintenancePlanning'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'development'
  },

  // ==================== MIXED-INCOME STRATEGIES ====================
  {
    id: 'mf-mixed-income',
    name: 'Mixed-Income Community',
    description: 'Combining market-rate with affordable components',
    category: 'Mixed-Income',
    includedMetrics: [
      'blendedCapRate', 'cross subsidyAnalysis', 'incomeSegmentation',
      'socialImpactScore', 'publicPrivateStructure', 'taxAbatements',
      'tif_analysis', 'communityBenefits'
    ],
    requiredFields: [
      'marketRateUnits', 'workforceUnits', 'affordableUnits',
      'amiTargeting', 'publicSubsidies', 'taxCreditEquity',
      'groundLeaseTerms', 'affordabilityPeriod', 'exitRestrictions'
    ],
    optionalFields: [
      'opportunity_zone', 'communityLandTrust', 'socialServices',
      'jobTrainingPrograms', 'childcare', 'healthClinic'
    ],
    templates: ['mixedIncomeModel', 'subsidyStack', 'socialImpact'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'structured'
  },

  // ==================== QUICK ANALYSIS ====================
  {
    id: 'mf-quick-screen',
    name: 'Quick Multifamily Screen',
    description: 'Rapid evaluation for initial deal screening',
    category: 'Screening',
    includedMetrics: [
      'capRate', 'pricePerUnit', 'rentPerSF', 'occupancy',
      'expenseRatio', 'priceToRentRatio'
    ],
    requiredFields: [
      'purchasePrice', 'totalUnits', 'currentNOI', 'grossIncome',
      'operatingExpenses', 'currentOccupancy', 'averageRent'
    ],
    optionalFields: ['submarket', 'propertyClass', 'recentSales'],
    templates: ['quickScreen', 'backOfEnvelope'],
    minimumDataThreshold: 0.60,
    analysisDepth: 'basic'
  }
];

export const multifamilyMetricDefinitions = {
  revPAU: {
    name: 'Revenue Per Available Unit',
    category: 'Revenue',
    formula: 'Total Revenue / Total Units / Period',
    benchmark: { varies: 'by market and class' },
    unit: 'dollars'
  },
  lossToLease: {
    name: 'Loss to Lease',
    category: 'Revenue',
    formula: 'Σ(Market Rent - Actual Rent)',
    interpretation: 'Opportunity for rent growth'
  },
  residentRetention: {
    name: 'Resident Retention Rate',
    category: 'Operations',
    formula: 'Renewals / Lease Expirations',
    benchmark: { min: 50, target: 65, max: 80 },
    unit: 'percentage'
  },
  economicOccupancy: {
    name: 'Economic Occupancy',
    category: 'Revenue',
    formula: 'Actual Rent Collected / Gross Potential Rent',
    includesConcessions: true,
    benchmark: { min: 88, target: 93, max: 96 },
    unit: 'percentage'
  }
};