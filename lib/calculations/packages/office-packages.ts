// lib/calculations/packages/office-packages.ts
// Institutional-grade office property investment packages

import { CalculationPackage, PropertyData, MetricFlags } from '../types';

export const officePackages: CalculationPackage[] = [
  // ==================== CORE/CORE-PLUS STRATEGIES ====================
  {
    id: 'office-institutional-acquisition',
    name: 'Institutional Core Acquisition',
    description: 'Comprehensive analysis for stabilized office properties with credit tenants',
    category: 'Core',
    includedMetrics: [
      'capRate', 'cashOnCash', 'dscr', 'irr', 'npv', 'equityMultiple',
      'walt', 'tenantCredit', 'leaseRollover', 'effectiveRent',
      'loadFactor', 'parkingRatio', 'expenseReimbursement'
    ],
    requiredFields: [
      // Basic Property Info
      'propertyName', 'propertyType', 'address', 'yearBuilt', 'lastRenovated',
      'totalSquareFootage', 'rentableSquareFeet', 'usableSquareFeet',
      'numberOfFloors', 'typicalFloorPlate', 'parkingSpaces',
      
      // Financial
      'purchasePrice', 'currentNOI', 'projectedNOI', 'grossIncome',
      'operatingExpenses', 'realEstateTaxes', 'insurance',
      
      // Tenant Info
      'numberOfTenants', 'weightedAverageLeaseTerm', 'averageRentPSF',
      'marketRentPSF', 'largestTenantSF', 'topFiveTenantsSF',
      
      // Debt
      'loanAmount', 'interestRate', 'loanTerm', 'amortizationPeriod',
      
      // Lease Expiration Schedule
      'currentYearExpiringSF', 'nextYearExpiringSF', 'year3ExpiringSF',
      'year4ExpiringSF', 'year5ExpiringSF'
    ],
    optionalFields: [
      'leedCertification', 'energyStarScore', 'amenityScore',
      'transitScore', 'walkScore', 'averageFloorClearHeight',
      'numberOfElevators', 'conferenceRoomCount', 'hasGym',
      'hasCafeteria', 'lobbyRenovationYear'
    ],
    templates: ['institutionalMemo', 'icPresentation', 'argentusModel'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'office-core-plus-repositioning',
    name: 'Core-Plus Repositioning Analysis',
    description: 'Light value-add for Class A- properties with modest capital improvements',
    category: 'Core-Plus',
    includedMetrics: [
      'capRate', 'yieldOnCost', 'stabilizedYield', 'developmentSpread',
      'irrLevered', 'irrUnlevered', 'equityMultiple', 'averageCashYield',
      'peakEquity', 'paybackPeriod', 'breakEvenOccupancy'
    ],
    requiredFields: [
      'purchasePrice', 'currentNOI', 'currentOccupancy', 'marketOccupancy',
      'renovationBudget', 'tiAllowance', 'leasingCommissions',
      'projectedStabilizedNOI', 'stabilizationPeriod', 'marketRentGrowth'
    ],
    optionalFields: [
      'amenityUpgrades', 'lobbyRenovation', 'commonAreaImprovements',
      'sustainabilityCertificationCost', 'techUpgrades'
    ],
    templates: ['valueAddModel', 'renovationBudget', 'leasingProjections'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'detailed'
  },

  // ==================== VALUE-ADD STRATEGIES ====================
  {
    id: 'office-heavy-value-add',
    name: 'Heavy Value-Add Transformation',
    description: 'Major repositioning of Class B to A properties with significant CapEx',
    category: 'Value-Add',
    includedMetrics: [
      'developmentYield', 'yieldOnCost', 'profitMargin', 'developmentSpread',
      'constructionLoanMetrics', 'peakEquityRequired', 'irrGrossPotential',
      'multipleOnInvestedCapital', 'unleveredYieldOnCost'
    ],
    requiredFields: [
      'purchasePrice', 'totalDevelopmentCost', 'hardCosts', 'softCosts',
      'constructionPeriod', 'leaseUpPeriod', 'targetRents', 'exitCapRate',
      'constructionLoanLTV', 'constructionInterestRate', 'permanentLoanLTV'
    ],
    optionalFields: [
      'architecturalPlans', 'permitTimeline', 'constructionContingency',
      'tenantImprovementReserve', 'preLeasingTargets', 'anchorTenantLOIs'
    ],
    templates: ['developmentProforma', 'constructionBudget', 'ganttChart'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'comprehensive'
  },

  {
    id: 'office-adaptive-reuse',
    name: 'Office-to-Residential Conversion',
    description: 'Conversion feasibility for office to multifamily or mixed-use',
    category: 'Development',
    includedMetrics: [
      'conversionCostPSF', 'zoningAnalysis', 'floorPlateEfficiency',
      'unitYieldAnalysis', 'parkingRatioCompliance', 'developmentYield',
      'constructionRiskMetrics', 'absorptionProjections'
    ],
    requiredFields: [
      'buildingFootprint', 'floorPlateSize', 'ceilingHeights', 'windowLine',
      'structuralSystem', 'mechanicalSystem', 'plumbingCapacity',
      'zoningDesignation', 'allowableFAR', 'heightRestrictions',
      'parkingRequirements', 'targetUnitMix', 'conversionCostEstimate'
    ],
    optionalFields: [
      'historicTaxCredits', 'opportunityZoneStatus', 'tifEligibility',
      'utilityCapacity', 'environmentalConditions', 'seismicRequirements'
    ],
    templates: ['conversionFeasibility', 'unitMixOptimization', 'incentivesAnalysis'],
    minimumDataThreshold: 0.70,
    analysisDepth: 'specialized'
  },

  // ==================== SPECIALIZED STRATEGIES ====================
  {
    id: 'office-life-sciences-conversion',
    name: 'Life Sciences/Lab Conversion',
    description: 'Technical analysis for office to lab/R&D conversion',
    category: 'Specialized',
    includedMetrics: [
      'labRentPremium', 'hvacCapacityAnalysis', 'floorLoadCapacity',
      'vibrationAnalysis', 'ceilingHeightAdequacy', 'powerCapacityPSF',
      'exhaustSystemRequirements', 'cleanRoomPotential'
    ],
    requiredFields: [
      'currentHVACCapacity', 'electricalCapacity', 'floorLoadRating',
      'ceilingHeights', 'columnSpacing', 'elevatorCapacity',
      'chemicalStorageCapability', 'wasteHandling', 'backupPowerSystems',
      'targetLabClass', 'marketLabRents', 'tenantImprovementBudget'
    ],
    optionalFields: [
      'proximityToUniversities', 'proximityToHospitals', 'talentPoolAnalysis',
      'competingLabSpace', 'pharmaClusterDistance', 'incubatorPotential'
    ],
    templates: ['labConversionMatrix', 'technicalSpecifications', 'tenantTargeting'],
    minimumDataThreshold: 0.80,
    analysisDepth: 'technical'
  },

  {
    id: 'office-medical-conversion',
    name: 'Medical Office Building (MOB) Analysis',
    description: 'Healthcare-specific office property evaluation',
    category: 'Specialized',
    includedMetrics: [
      'healthSystemCreditAnalysis', 'medicareReimbursementRisk',
      'certificateOfNeedAnalysis', 'acuityMixImpact', 'outpatientTrends',
      'teleHealthImpact', 'parkingTurnoverRatio'
    ],
    requiredFields: [
      'proximityToHospital', 'anchorHealthSystem', 'specialtyMix',
      'medicarePercentage', 'averagePatientVolume', 'parkingRatio',
      'ADACompliance', 'medicalWasteHandling', 'specializedHVAC'
    ],
    optionalFields: [
      'onSitePharmacy', 'imagingCenter', 'surgeryCenter', 'urgentCare',
      'physicalTherapy', 'laboratoryServices', 'dialysisCapability'
    ],
    templates: ['mobValuation', 'healthcareMarketAnalysis', 'regulatoryChecklist'],
    minimumDataThreshold: 0.85,
    analysisDepth: 'specialized'
  },

  // ==================== DISTRESSED/OPPORTUNISTIC ====================
  {
    id: 'office-distressed-acquisition',
    name: 'Distressed Office Acquisition',
    description: 'Analysis for foreclosure, REO, or deeply discounted properties',
    category: 'Opportunistic',
    includedMetrics: [
      'discountToReplacement', 'debtAssumptionAnalysis', 'carryingCostBurn',
      'minimumOccupancyThreshold', 'breakEvenAnalysis', 'workoutProbability',
      'specialServicingStatus', 'taxLienAnalysis'
    ],
    requiredFields: [
      'outstandingDebt', 'specialServicer', 'maturityDate', 'currentOccupancy',
      'majorTenantBankruptcy', 'deferredMaintenance', 'capExNeeds',
      'realEstateTaxArrears', 'pendingLitigation', 'environmentalIssues'
    ],
    optionalFields: [
      'receivershipStatus', 'mechLiens', 'tenantEstoppels', 'titleDefects',
      'groundLeaseTerms', 'crossDefaultProvisions', 'intercreditorAgreements'
    ],
    templates: ['distressedPricing', 'workoutScenarios', 'exitStrategies'],
    minimumDataThreshold: 0.65,
    analysisDepth: 'forensic'
  },

  // ==================== PORTFOLIO/REIT ANALYSIS ====================
  {
    id: 'office-portfolio-acquisition',
    name: 'Office Portfolio Acquisition',
    description: 'Multi-property portfolio analysis with synergy evaluation',
    category: 'Portfolio',
    includedMetrics: [
      'portfolioIRR', 'blendedCapRate', 'diversificationScore',
      'geographicConcentration', 'tenantOverlap', 'economiesOfScale',
      'dispositionStrategy', 'financingSynergies'
    ],
    requiredFields: [
      'propertyCount', 'totalPortfolioSF', 'portfolioPurchasePrice',
      'blendedNOI', 'majorMarkets', 'tenantConcentration',
      'managementStructure', 'existingDebtSchedule'
    ],
    optionalFields: [
      'crossCollateralization', 'dragAlongRights', 'keymAnProvisions',
      'transferTaxOptimization', 'like kindExchange', 'upREITStructure'
    ],
    templates: ['portfolioRollup', 'synergiesAnalysis', 'dispositionWaterfall'],
    minimumDataThreshold: 0.75,
    analysisDepth: 'portfolio'
  },

  // ==================== QUICK SCREENS ====================
  {
    id: 'office-quick-screen',
    name: 'Quick Office Screen',
    description: 'Rapid 5-minute evaluation for initial deal screening',
    category: 'Screening',
    includedMetrics: [
      'capRate', 'pricePerSF', 'rentToMarket', 'occupancyRate',
      'walt', 'parkingRatio'
    ],
    requiredFields: [
      'purchasePrice', 'currentNOI', 'totalSquareFootage',
      'currentOccupancy', 'averageRentPSF', 'marketRentPSF',
      'weightedAverageLeaseTerm', 'parkingSpaces'
    ],
    optionalFields: ['submarket', 'buildingClass', 'majorTenants'],
    templates: ['quickScreen', 'teaserMemo'],
    minimumDataThreshold: 0.60,
    analysisDepth: 'basic'
  }
];

export const officeMetricDefinitions = {
  walt: {
    name: 'Weighted Average Lease Term',
    category: 'Lease',
    formula: 'Σ(Rent × Remaining Term) / Total Rent',
    benchmark: { min: 3, target: 5, max: 10 },
    unit: 'years'
  },
  effectiveRent: {
    name: 'Net Effective Rent',
    category: 'Revenue',
    formula: 'NPV of all lease payments / lease term',
    includesConcessions: true
  },
  loadFactor: {
    name: 'Load Factor',
    category: 'Efficiency',
    formula: '(Rentable - Usable) / Usable',
    benchmark: { min: 10, target: 15, max: 20 },
    unit: 'percentage'
  },
  tenantCredit: {
    name: 'Weighted Average Credit Rating',
    category: 'Risk',
    includesPublicPrivate: true,
    investmentGradeThreshold: 'BBB-'
  }
};