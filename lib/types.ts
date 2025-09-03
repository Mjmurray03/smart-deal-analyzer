// lib/types-clean.ts
// Clean, consolidated type definitions for the Smart Deal Analyzer
// All duplicates removed, all custom additions preserved

import { RetailTenant } from './calculations/types';

export type PropertyType = 'office' | 'retail' | 'industrial' | 'multifamily' | 'mixed-use';

export interface PropertyData {
  // Basic Property Information
  propertyType: PropertyType;
  purchasePrice: number;
  squareFootage: number;
  numberOfUnits: number;
  parkingSpaces: number;
  
  // Financial Information
  currentNOI: number;
  projectedNOI: number;
  grossIncome: number;
  grossRent?: number;
  operatingExpenses: number;
  annualCashFlow: number;
  totalInvestment: number;
  occupancyRate: number;
  rentPerSF?: number;
  averageRent: number;
  parkingIncome?: number;
  
  // Retail-specific rent fields
  baseRentPSF?: number;
  camPSF?: number;
  percentageRent?: number;
  anchorTenantRent?: number;
  
  // Industrial-specific rent fields
  warehouseRentPSF?: number;
  officeRentPSF?: number;
  officePercentage?: number;
  numberOfDocks?: number;
  
  // Multifamily-specific fields
  averageRentPerUnit?: number;
  otherIncome?: number;
  unitMix?: string;
  
  // Mixed-use specific fields
  retailSF?: number;
  officeSF?: number;
  residentialUnits?: number;
  retailRentPSF?: number;
  avgResidentialRent?: number;
  retailOccupancy?: number;
  officeOccupancy?: number;
  residentialOccupancy?: number;
  
  // Loan Information
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  
  // Investment Analysis
  discountRate: number;
  holdingPeriod: number;
  
  // Missing fields for calculations
  selectedPackageId?: string;
  columnWidth?: number;
  columnDepth?: number;
  tenants?: SimpleTenant[];
  optionProbability?: number;
  truckCourtDepth?: number;
  industrialTenants?: any;
  distanceToRail?: number;
  schoolRating?: number;
  crimeIndex?: number;

  // Enhanced Property Data for Institutional Analysis
  // Office-specific
  buildingClass?: string;
  yearBuilt?: number;
  buildingSystems?: string[];
  tenantCredit?: string;
  leaseExpirations?: Date[];
  parkingRatio?: number;
  walt?: number; // Weighted Average Lease Term
  
  // Office Tenants Data
  officeTenants?: OfficeTenantsData;
  
  // Retail-specific
  totalGLA?: number;
  anchorGLA?: number;
  anchorTenants?: string[];
  anchorExpirations?: Date[];
  salesPerSF?: number;
  tradeAreaDemographics?: any;
  anchorSalesReporting?: boolean;
  coTenancyClauses?: boolean;
  goingDarkRights?: boolean;
  parkingFieldSF?: number;
  excessLandSF?: number;
  crossAccessEasements?: boolean;
  reciprocalAgreements?: boolean;
  padSitePotential?: boolean;
  camExpenses?: number;
  camReimbursements?: number;
  percentageRentCollected?: number;
  daytimePopulation?: number;
  trafficCount?: number;
  restaurantGLA?: number;
  entertainmentGLA?: number;
  retailGLA?: number;
  commonAreaSF?: number;
  eventSpaceSF?: number;
  outdoorSeating?: number;
  percentageRentStructure?: any;
  marketingFund?: number;
  sponsorshipIncome?: number;
  parkingRevenue?: number;
  numberOfAnchors?: number;
  numberOfTenants?: number;
  tenantMix?: any;
  localVsNational?: any;
  averageTenantSize?: number;
  visibility?: string;
  ingressEgress?: string;
  population1Mile?: number;
  rooftopCount?: number;
  tenant?: string;
  creditRating?: string;
  guarantorEntity?: string;
  originalLeaseDate?: Date;
  leaseExpiration?: Date;
  baseRent?: number;
  rentIncreases?: any[];
  optionPeriods?: any[];
  buildingSF?: number;
  landSF?: number;
  constructionType?: string;
  darkProvisions?: any;
  numberOfStores?: number;
  luxuryBrandCount?: number;
  touristAttractions?: string[];
  distanceToMetro?: number;
  annualVisitors?: number;
  commonAreaCharges?: number;
  marketingAssessment?: number;
  valet_income?: number;
  tour_partnerships?: any;
  currentGLA?: number;
  landArea?: number;
  zoning?: string;
  allowableFAR?: number;
  parking_structures?: any;
  demo_costs?: number;
  environmental_status?: string;
  anchor_lease_buyouts?: any;
  easement_modifications?: any;
  municipality_support?: any;
  tif_eligibility?: boolean;
  medicalGLA?: number;
  serviceGLA?: number;
  medicalTenants?: string[];
  imaging_center?: boolean;
  urgent_care?: boolean;
  physical_therapy?: boolean;
  medical_parking_ratio?: number;
  ada_compliance?: boolean;
  hvac_medical_grade?: boolean;
  currentOccupancy?: number;
  population3Mile?: number;
  avgHHIncome3Mile?: number;
  
  // Additional missing properties
  shopGLA?: number;
  padSites?: any;
  anchorTenant?: string;
  anchorLeaseExpiration?: Date;
  anchorRentPSF?: number;
  anchorSalesVolume?: number;
  anchorOptions?: any;
  anchorCoTenancy?: any;
  
  // Industrial-specific
  clearHeight?: number;
  dockDoors?: number;
  powerCapacity?: number;
  sprinklerSystem?: boolean;
  railAccess?: boolean;
  truckCourts?: number;
  environmentalStatus?: string;
  utilityCapacity?: any;
  expansionPotential?: boolean;
  specializedEquipment?: string[];
  hazmatStorage?: boolean;
  temperatureControl?: boolean;
  securityFeatures?: string[];
  loadingAreas?: number;
  trailerParking?: number;
  yardSpace?: number;
  officeSpace?: number;
  mezzanineSpace?: number;
  coldStorage?: boolean;
  crossDock?: boolean;
  railSpur?: boolean;
  airCargo?: boolean;
  portAccess?: boolean;
  interstateAccess?: boolean;
  laborPool?: any;
  supplierNetwork?: any;
  customerProximity?: any;
  logisticsScore?: number;
  functionalUtility?: number;
  specializedScore?: number;
  landAnalysis?: any;
  redevelopmentPotential?: number;
  environmentalRisk?: number;
  infrastructureReadiness?: number;
  
  // Multifamily-specific
  averageUnitSize?: number;
  amenities?: string[];
  marketRent?: number;
  rentGrowth?: number;
  turnoverRate?: number;
  maintenanceCosts?: number;
  propertyManagement?: number;
  vacancyLoss?: number;
  badDebt?: number;
  utilityReimbursements?: number;
  storageIncome?: number;
  petRent?: number;
  applicationFees?: number;
  lateFees?: number;
  leaseUpCosts?: number;
  marketingCosts?: number;
  leasingCommissions?: number;
  propertyTaxes?: number;
  insurance?: number;
  utilities?: number;
  repairs?: number;
  landscaping?: number;
  pestControl?: number;
  trashRemoval?: number;
  managementFees?: number;
  legalFees?: number;
  accountingFees?: number;
  otherExpenses?: number;
  marketComps?: any[];
  residentAnalytics?: any;
  revenueOptimization?: any;
  unitAnalytics?: any;
  
  // New "Wow" Metrics Data Fields
  monthlyRentalIncome?: number; // Multifamily - for revenue per unit calculation
  marketAverageRent?: number; // Multifamily - for market comparison
  retailTenants?: RetailTenant[]; // Retail - for sales per SF analysis
  
  // Mixed-use-specific
  componentBreakdown?: any;
  synergyMetrics?: any;
  allocationModels?: any;
  conversionAnalysis?: any;
  
  // Portfolio-specific
  propertyCount?: number;
  totalPortfolioSF?: number;
  portfolioPurchasePrice?: number;
  blendedNOI?: number;
  majorMarkets?: string[];
  tenantConcentration?: any;
  managementStructure?: string;
  existingDebtSchedule?: any;
  propertyName?: any;
  address?: any;
  lastRenovated?: any;
  totalSquareFootage?: any;
  rentableSquareFeet?: any;
  usableSquareFeet?: any;
  numberOfFloors?: any;
  typicalFloorPlate?: any;
  averageRentPSF?: any;
  marketRentPSF?: any;
  largestTenantSF?: any;
  topFiveTenantsSF?: any;
  amortizationPeriod?: any;
  currentYearExpiringSF?: any;
  nextYearExpiringSF?: any;
  year3ExpiringSF?: any;
  year4ExpiringSF?: any;
  year5ExpiringSF?: any;
  leedCertification?: any;
  energyStarScore?: any;
  amenityScore?: any;
  transitScore?: any;
  walkScore?: any;
  averageFloorClearHeight?: any;
  numberOfElevators?: any;
  conferenceRoomCount?: any;
  hasGym?: any;
  hasCafeteria?: any;
  lobbyRenovationYear?: any;
  renovationBudget?: any;
  tiAllowance?: any;
  projectedStabilizedNOI?: any;
  stabilizationPeriod?: any;
  marketRentGrowth?: any;
  amenityUpgrades?: any;
  lobbyRenovation?: any;
  commonAreaImprovements?: any;
  sustainabilityCertificationCost?: any;
  techUpgrades?: any;
  architecturalPlans?: any;
  permitTimeline?: any;
  constructionContingency?: any;
  tenantImprovementReserve?: any;
  preLeasingTargets?: any;
  anchorTenantLOIs?: any;
  developmentYield?: any;
  totalDevelopmentCost?: any;
  hardCosts?: any;
  softCosts?: any;
  constructionPeriod?: any;
  leaseUpPeriod?: any;
  targetRents?: any;
  exitCapRate?: any;
  constructionLoanLTV?: any;
  constructionInterestRate?: any;
  permanentLoanLTV?: any;
  buildingFootprint?: any;
  floorPlateSize?: any;
  ceilingHeights?: any;
  windowLine?: any;
  structuralSystem?: any;
  mechanicalSystem?: any;
  plumbingCapacity?: any;
  zoningDesignation?: any;
  heightRestrictions?: any;
  parkingRequirements?: any;
  targetUnitMix?: any;
  conversionCostEstimate?: any;
  historicTaxCredits?: any;
  opportunityZoneStatus?: any;
  tifEligibility?: any;
  environmentalConditions?: any;
  seismicRequirements?: any;
  onSitePharmacy?: any;
  imagingCenter?: any;
  surgeryCenter?: any;
  urgentCare?: any;
  physicalTherapy?: any;
  laboratoryServices?: any;
  dialysisCapability?: any;
  crossCollateralization?: any;
  dragAlongRights?: any;
  keymAnProvisions?: any;
  transferTaxOptimization?: any;
  likeKindExchange?: any;
  upREITStructure?: any;
  submarket?: any;
  majorTenants?: any;
  poolCount?: any;
  fitnessCenter?: any;
  businessCenter?: any;
  dogPark?: any;
  coveredParking?: any;
  gatedAccess?: any;
  washerDryerInUnit?: any;
  recentRenovations?: any;
  schoolRatings?: any;
  deliveryDate?: any;
  subMarketAbsorption?: any;
  competingNewSupply?: any;
  proposedRentSchedule?: any;
  concessionPackage?: any;
  leasingStaffSize?: any;
  modelUnitCount?: any;
  preferredEmployerPrograms?: any;
  brokerCoOp?: any;
  socialMediaBudget?: any;
  movingSpecials?: any;
  amenityActivation?: any;
  grandOpeningEvents?: any;
  nonprofitSetAside?: any;
  specialNeeds?: any;
  seniorRestrictions?: any;
  ruralDesignation?: any;
  qct_dda_status?: any;
  radConversion?: any;
  minimumAge?: any;
  currentCensus?: any;
  averageAge?: any;
  marketPenetration?: any;
  primaryMarketRadius?: any;
  seniors75Plus?: any;
  medianSeniorIncome?: any;
  competitiveProperties?: any;
  monthlyServiceFees?: any;
  mealPlans?: any;
  transportationServices?: any;
  wellnessPrograms?: any;
  socialActivities?: any;
  housekeepingIncluded?: any;
  continuum_of_care?: any;
  memoryCareLicense?: any;
  totalHomes?: any;
  averageHomeSF?: any;
  lotSizes?: any;
  communityAcreage?: any;
  constructionCostPerHome?: any;
  landCostPerLot?: any;
  developmentTimeline?: any;
  expectedRentsByType?: any;
  competingSFR_rates?: any;
  propertyManagementModel?: any;
  gatedEntry?: any;
  communityPool?: any;
  dogParks?: any;
  walkingTrails?: any;
  smartHomeTechnology?: any;
  solarPanels?: any;
  ev_charging?: any;
  opportunity_zone?: any;
  communityLandTrust?: any;
  socialServices?: any;
  jobTrainingPrograms?: any;
  childcare?: any;
  healthClinic?: any;
  recentSales?: any;
  propertyClass?: any;
  totalSF?: any;
  residentialSF?: any;
  hotelKeys?: any;
  retailGLA_breakdown?: any;
  officeRSF?: any;
  retailNOI?: any;
  officeNOI?: any;
  residentialNOI?: any;
  hotelNOI?: any;
  signageRevenue?: any;
  eventSpaceRevenue?: any;
  totalParkingSpaces?: any;
  sharedAmenities?: any;
  centralPlant?: any;
  commonAreaMaintenance?: any;
  securityCosts?: any;
  bikeScore?: any;
  proximityToTransit?: any;
  ground_floor_activation?: any;
  public_plaza?: any;
  green_roof?: any;
  district_energy?: any;
  shared_loading?: any;
  autonomous_vehicle_ready?: any;
  digital_infrastructure?: any;
  sustainability_certifications?: any;
  national_register?: any;
  local_landmark?: any;
  conservation_district?: any;
  facade_easement?: any;
  interior_features?: any;
  archaeological_concerns?: any;
  interpretive_requirements?: any;
  museum_quality_restoration?: any;
  originalUse?: any;
  historicDesignation?: any;
  structural_system?: any;
  facade_condition?: any;
  abatement_costs?: any;
  seismic_requirements?: any;
  ada_retrofit?: any;
  preservation_standards?: any;
  
  // Additional unique custom property fields from package files
  // Industrial-specific unique fields
  numberOfDockDoors?: number;
  numberOfDriveInDoors?: number;
  trailerParkingSpaces?: number;
  carParkingSpaces?: number;
  columnSpacing?: number;
  floorThickness?: number;
  floorLoadCapacity?: number;
  distanceToHighway?: number;
  distanceToPort?: number;
  distanceToAirport?: number;
  distanceToIntermodal?: number;
  populationOneHour?: number;
  laborAvailability?: number;
  leaseTermRemaining?: number;
  tenantCreditRating?: string;
  powerCostPerKwh?: number;
  gasAvailable?: boolean;
  sewerCapacity?: number;
  loadingPositions?: number;
  households3Miles?: number;
  medianHouseholdIncome?: number;
  trafficCounts?: number;
  powerForEV?: number;
  fiberConnectivity?: boolean;
  ecommerceDeliveryVolume?: number;
  productionSF?: number;
  warehouseSF?: number;
  voltageAvailable?: number;
  naturalGasCapacity?: number;
  waterCapacity?: number;
  airPermits?: boolean;
  zoningCompliance?: boolean;
  craneTonnage?: number;
  compressedAir?: boolean;
  totalCubicFeet?: number;
  numberOfZones?: number;
  temperatureRanges?: any;
  refrigerationSystems?: number;
  refrigerationAge?: number;
  energyUsagePSF?: number;
  insulationR_value?: number;
  dockSealTypes?: string;
  batteryChargingStations?: number;
  palletPositions?: number;
  turns_per_year?: number;
  commodityMix?: any;
  labSF?: number;
  divisibilityOptions?: any;
  finishLevel?: string;
  totalPower_MW?: number;
  it_load_MW?: number;
  cooling_tons?: number;
  raised_floor_sf?: number;
  generator_capacity?: number;
  ups_capacity?: number;
  fuel_storage_hours?: number;
  fiber_providers?: number;
  meet_me_rooms?: number;
  power_cost_kwh?: number;
  water_usage_gallons?: number;
  tier_certification?: string;
  cultivationSF?: number;
  processingSF?: number;
  packagingSF?: number;
  vaultSF?: number;
  licenses_held?: string[];
  license_transferability?: boolean;
  track_trace_system?: boolean;
  security_systems?: any;
  hvac_redundancy?: boolean;
  water_recycling?: boolean;
  power_backup?: boolean;
  local_approvals?: boolean;
  total_acres?: number;
  usable_acres?: number;
  paved_acres?: number;
  gravel_acres?: number;
  fence_height?: number;
  gates_count?: number;
  lighting_coverage?: number;
  truck_parking_spaces?: number;
  container_capacity?: number;
  equipment_allowed?: boolean;
  environmental_phase1?: boolean;
  storm_water_permit?: boolean;
  
  // Retail-specific unique fields
  population5Mile?: number;
  competitorDistance?: number;
  
  // Mixed-use-specific unique fields
  transitType?: string;
  stationDistance?: number;
  dailyRidership?: number;
  park_and_ride_spaces?: number;
  kiss_and_ride?: boolean;
  bus_connections?: number;
  bike_storage?: number;
  pedestrian_connectivity?: string;
  ada_accessibility?: boolean;
  morning_peak_capacity?: number;
  evening_peak_capacity?: number;
  weekend_service?: boolean;
  planned_service_improvements?: any;
  transitAccess?: boolean;

  // Hotel-specific fields
  hotelBrand?: string;
  numberOfKeys?: number;
  averageRate?: number;
  revPAR?: number;
  f_and_b_revenue?: number;
  conference_sf?: number;
  ballroom_sf?: number;
  restaurant_seats?: number;
  bar_lounge_capacity?: number;
  pool_deck_sf?: number;
  fitness_spa_sf?: number;
  retail_lobby_sf?: number;

  // Entertainment/venue-specific fields
  arena_stadium_capacity?: number;
  annual_events?: number;
  theater_seats?: number;
  casino_gaming_sf?: number;
  sports_book_sf?: number;
  concert_venue_capacity?: number;
  cinema_screens?: number;
  bowling_lanes?: number;
  arcade_sf?: number;
  sports_bar_sf?: number;
  team_store_sf?: number;
  hall_of_fame_sf?: number;

  // Student housing fields
  totalUnits?: number;
  marketOccupancy?: number;
  studioUnits?: number;
  oneBedUnits?: number;
  twoBedUnits?: number;
  threeBedUnits?: number;
  avgRentStudio?: number;
  avgRent1Bed?: number;
  avgRent2Bed?: number;
  avgRent3Bed?: number;
  marketRentStudio?: number;
  marketRent1Bed?: number;
  marketRent2Bed?: number;
  marketRent3Bed?: number;
  realEstateTaxes?: number;
  repairsAndMaintenance?: number;
  petFeeIncome?: number;
  utilityRecovery?: number;
  bedLeaseAnalysis?: any;
  preLeasingVelocity?: number;
  summerOccupancy?: number;
  parentGuarantorRate?: number;
  universityEnrollmentTrends?: any;
  competitiveBedSupply?: number;
  walkToCampusTime?: number;
  totalBeds?: number;
  unitConfiguration?: any;
  fallOccupancy?: number;
  springOccupancy?: number;
  summerSession?: boolean;
  academicYearLength?: number;
  universityEnrollment?: number;
  onCampusHousing?: boolean;
  preLeasingStartDate?: Date;
  avgRentPerBed?: number;
  utilitiesIncluded?: boolean;
  furnishingStatus?: string;
  internetIncluded?: boolean;

  // Renovation/Value-add fields
  renovationROI?: number;
  rentPremiumCapture?: number;
  unleveredYieldLift?: number;
  leveragedReturns?: number;
  lossToLeaseCapture?: number;
  phaseAnalysis?: any;
  displacementCost?: number;
  currentRentsByType?: any;
  marketRentsByType?: any;
  renovatedComps?: any;
  renovationCostPerUnit?: number;
  scopeOfWork?: any;
  unitsToRenovate?: number;
  monthlyRenovationPace?: number;
  expectedRentLift?: number;
  concessionBurnOff?: number;
  currentExpenseRatio?: number;
  projectedExpenseRatio?: number;
  marketingBudget?: number;

  // Affordable housing fields
  affordableUnits?: number;
  marketRateUnits?: number;
  amiLevels?: any;
  rentRestrictions?: any;
  compliancePeriodRemaining?: number;
  section8Contract?: boolean;
  hacPaymentStandard?: number;
  utilityAllowanceSchedule?: any;
  qap_score?: number;
  synergyWithTaxCredits?: any;
  workforceUnits?: number;
  amiTargeting?: any;
  publicSubsidies?: any;
  taxCreditEquity?: number;
  groundLeaseTerms?: any;
  affordabilityPeriod?: number;
  exitRestrictions?: any;

  // Healthcare/lab/office advanced fields
  labRentPremium?: number;
  hvacCapacityAnalysis?: any;
  vibrationAnalysis?: any;
  ceilingHeightAdequacy?: any;
  powerCapacityPSF?: number;
  exhaustSystemRequirements?: any;
  cleanRoomPotential?: boolean;
  currentHVACCapacity?: number;
  electricalCapacity?: number;
  floorLoadRating?: number;
  chemicalStorageCapability?: boolean;
  wasteHandling?: any;
  backupPowerSystems?: any;
  targetLabClass?: string;
  marketLabRents?: number;
  tenantImprovementBudget?: number;
  proximityToHospital?: number;
  anchorHealthSystem?: string;
  specialtyMix?: any;
  medicarePercentage?: number;
  averagePatientVolume?: number;
  ADACompliance?: boolean;
  medicalWasteHandling?: any;
  specializedHVAC?: any;
  discountToReplacement?: number;
  debtAssumptionAnalysis?: any;
  carryingCostBurn?: number;
  minimumOccupancyThreshold?: number;
  breakEvenAnalysis?: any;
  workoutProbability?: number;
  specialServicingStatus?: string;
  taxLienAnalysis?: any;
  outstandingDebt?: number;
  specialServicer?: string;
  maturityDate?: Date;
  majorTenantBankruptcy?: boolean;
  deferredMaintenance?: number;
  capExNeeds?: number;
  realEstateTaxArrears?: number;
  pendingLitigation?: boolean;
  environmentalIssues?: any;
  dispositionStrategy?: string;

  // Additional missing fields with exact casing from packages
  weightedAverageLeaseTerm?: number;
  grossLeasableArea?: number;
  currentRentPSF?: number;
  loadingDocks?: number;
  driveInDoors?: number;
  hvacZones?: number;
  internetBandwidth?: number;
  nhpa_compliance?: any;
  shpo_approval?: any;
  f_and_b_SF?: number;
  entertainment_SF?: number;
  fitness_wellness_SF?: number;
  cultural_SF?: number;
  event_space_SF?: number;
  co_working_SF?: number;
  maker_space_SF?: number;
  daycare_capacity?: number;
  community_garden_SF?: number;
  existingMallGLA?: number;
  anchor_vacancies?: number;
  inline_occupancy?: number;
  parking_structure_sf?: number;
  environmental_issues?: any;
  deed_restrictions?: any;
  reciprocal_agreements?: any;
  bond_obligations?: any;
  municipal_vision?: any;
  zoning_flexibility?: any;
  infrastructure_capacity?: any;
  tenantSalesReporting?: boolean;
  elevatorCapacity?: number;
  downPayment?: number;

  // Additional missing fields with special characters
  netOperatingIncome?: number;
  occupancyCostRatio?: number;

  // Special-case fields with ampersands, underscores, etc.
  'f&b_SF'?: number;
  'f&b_revenue'?: number;
  'f&b_capture_rate'?: number;
  'insulationR-value'?: number;
  'cross subsidyAnalysis'?: any;
  annualDebtService?: number;
}

// Office Tenants Data Interfaces
export interface OfficeTenantsData {
  tenants: SimpleTenant[];
}

export interface SimpleTenant {
  name: string;
  annualRent: number;
  leaseExpiration: string; // YYYY-MM format for easy input
}

export interface MetricFlags {
  // Basic Metrics
  capRate: boolean;
  cashOnCash: boolean;
  
  // Debt Metrics
  dscr: boolean;
  irr: boolean;
  roi: boolean;
  breakeven: boolean;
  
  // Property-Specific Metrics
  pricePerSF: boolean;
  ltv: boolean;
  grm: boolean;
  pricePerUnit: boolean;
  egi: boolean;
  
  // Missing common metrics
  effectiveRentPSF?: boolean;
  tenantFinancialHealth?: boolean;
  leaseValuation?: boolean;
  tenantHealth?: boolean;
  tradeAreaAnalysis?: boolean;
  functionalScore?: boolean;
  revenueMetrics?: boolean;
  marketPosition?: boolean;
  marketPositioning?: boolean;

  // Enhanced Institutional Metrics
  // Office-specific
  rentToMarket?: boolean;
  walt?: boolean;
  parkingRatio?: boolean;
  tenantOverlap?: boolean;
  economiesOfScale?: boolean;
  financingSynergies?: boolean;
  
  // Retail-specific
  salesPerSF?: boolean;
  occupancyCostRatio?: boolean;
  anchorSalesProductivity?: boolean;
  inlineTenantsNOI?: boolean;
  percentageRent?: boolean;
  camRecovery?: boolean;
  tradeAreaDemographics?: boolean;
  grocerMarketShare?: boolean;
  anchorDependency?: boolean;
  coTenancyRisk?: boolean;
  boxDivisionPotential?: boolean;
  ecommerceResilience?: boolean;
  categoryDiversification?: boolean;
  parkingFieldValue?: boolean;
  redevelopmentOptions?: boolean;
  dining_entertainment_mix?: boolean;
  eventIncome?: boolean;
  socialMediaMetrics?: boolean;
  dwellTime?: boolean;
  visitFrequency?: boolean;
  tenantSalesGrowth?: boolean;
  experientialScore?: boolean;
  serviceTenantsPercentage?: boolean;
  medicalDentalComponent?: boolean;
  quickServiceRestaurants?: boolean;
  localTenantRisk?: boolean;
  driveTimeAnalysis?: boolean;
  repeat_visit_frequency?: boolean;
  creditAnalysis?: boolean;
  leaseTermRemaining?: boolean;
  rentBumps?: boolean;
  corporateGuarantee?: boolean;
  darkStoreRisk?: boolean;
  replacementCost?: boolean;
  alternativeUse?: boolean;
  saleLeasebackPremium?: boolean;
  tourism_dependency?: boolean;
  trade_radius?: boolean;
  tour_bus_revenue?: boolean;
  brand_mix_score?: boolean;
  comp_sales_growth?: boolean;
  coupon_redemption?: boolean;
  international_visitor_percentage?: boolean;
  seasonal_volatility?: boolean;
  existingNOI?: boolean;
  landValue?: boolean;
  far_utilization?: boolean;
  mixed_use_potential?: boolean;
  residential_density?: boolean;
  entitlement_risk?: boolean;
  phasing_analysis?: boolean;
  public_subsidy_potential?: boolean;
  medical_percentage?: boolean;
  service_percentage?: boolean;
  amazon_resistance?: boolean;
  appointment_based_percentage?: boolean;
  healthcare_system_affiliation?: boolean;
  medicare_reimbursement_exposure?: boolean;
  wellness_trend_alignment?: boolean;
  occupancy?: boolean;
  sales_psf?: boolean;
  anchor_dependency?: boolean;
  trade_area_strength?: boolean;
  
  // Industrial-specific
  functionalUtility?: boolean;
  logisticsScoring?: boolean;
  specializedIndustrial?: boolean;
  landAnalysis?: boolean;
  clearHeight?: boolean;
  dockDoors?: boolean;
  powerCapacity?: boolean;
  railAccess?: boolean;
  environmentalRisk?: boolean;
  expansionPotential?: boolean;
  leaseStability?: boolean;
  buildingSystems?: boolean;
  energyEfficiency?: boolean;
  sustainabilityScore?: boolean;
  technologyReadiness?: boolean;
  workforceAvailability?: boolean;
  supplyChainProximity?: boolean;
  transportationAccess?: boolean;
  regulatoryCompliance?: boolean;
  operationalEfficiency?: boolean;
  costCompetitiveness?: boolean;
  marketDemand?: boolean;
  competitivePosition?: boolean;
  redevelopmentPotential?: boolean;
  environmentalLiability?: boolean;
  infrastructureReadiness?: boolean;
  utilityCapacity?: boolean;
  specializedEquipment?: boolean;
  hazmatStorage?: boolean;
  temperatureControl?: boolean;
  securityFeatures?: boolean;
  loadingAreas?: boolean;
  trailerParking?: boolean;
  yardSpace?: boolean;
  officeSpace?: boolean;
  mezzanineSpace?: boolean;
  coldStorage?: boolean;
  crossDock?: boolean;
  railSpur?: boolean;
  airCargo?: boolean;
  portAccess?: boolean;
  interstateAccess?: boolean;
  laborPool?: boolean;
  supplierNetwork?: boolean;
  customerProximity?: boolean;
  logisticsScore?: boolean;
  specializedScore?: boolean;
  
  // Multifamily-specific
  marketComp?: boolean;
  residentAnalytics?: boolean;
  revenueOptimization?: boolean;
  unitAnalytics?: boolean;
  rentGrowth?: boolean;
  turnoverRate?: boolean;
  maintenanceCosts?: boolean;
  propertyManagement?: boolean;
  vacancyLoss?: boolean;
  badDebt?: boolean;
  otherIncome?: boolean;
  utilityReimbursements?: boolean;
  parkingIncome?: boolean;
  storageIncome?: boolean;
  petRent?: boolean;
  applicationFees?: boolean;
  lateFees?: boolean;
  leaseUpCosts?: boolean;
  marketingCosts?: boolean;
  leasingCommissions?: boolean;
  propertyTaxes?: boolean;
  insurance?: boolean;
  utilities?: boolean;
  repairs?: boolean;
  landscaping?: boolean;
  pestControl?: boolean;
  trashRemoval?: boolean;
  managementFees?: boolean;
  legalFees?: boolean;
  accountingFees?: boolean;
  otherExpenses?: boolean;
  marketComps?: boolean;
  
  // Mixed-use-specific
  componentAnalysis?: boolean;
  synergyMetrics?: boolean;
  allocationModels?: boolean;
  conversionAnalysis?: boolean;
  geographicConcentration?: boolean;
  npv?: boolean;
  equityMultiple?: boolean;
  yieldOnCost?: boolean;
  stabilizedYield?: boolean;
  developmentSpread?: boolean;
  irrLevered?: boolean;
  irrUnlevered?: boolean;
  averageCashYield?: boolean;
  peakEquity?: boolean;
  paybackPeriod?: boolean;
  breakEvenOccupancy?: boolean;
  developmentYield?: boolean;
  profitMargin?: boolean;
  constructionLoanMetrics?: boolean;
  peakEquityRequired?: boolean;
  irrGrossPotential?: boolean;
  multipleOnInvestedCapital?: boolean;
  unleveredYieldOnCost?: boolean;
  conversionCostPSF?: boolean;
  zoningAnalysis?: boolean;
  floorPlateEfficiency?: boolean;
  unitYieldAnalysis?: boolean;
  parkingRatioCompliance?: boolean;
  constructionRiskMetrics?: boolean;
  absorptionProjections?: boolean;
  healthSystemCreditAnalysis?: boolean;
  medicareReimbursementRisk?: boolean;
  certificateOfNeedAnalysis?: boolean;
  acuityMixImpact?: boolean;
  outpatientTrends?: boolean;
  teleHealthImpact?: boolean;
  parkingTurnoverRatio?: boolean;
  portfolioIRR?: boolean;
  blendedCapRate?: boolean;
  diversificationScore?: boolean;
  leaseRollover?: boolean;
  effectiveRent?: boolean;
  loadFactor?: boolean;
  expenseReimbursement?: boolean;
  revPAU?: boolean;
  rentPerSF?: boolean;
  economicOccupancy?: boolean;
  lossToLease?: boolean;
  expenseRatio?: boolean;
  concessionRate?: boolean;
  residentRetention?: boolean;
  concessionStrategy?: boolean;
  stabilizationTimeline?: boolean;
  carryingCosts?: boolean;
  marketingBudget?: boolean;
  competitivePositioning?: boolean;
  velocityByUnitType?: boolean;
  seasonalityAdjustments?: boolean;
  affordabilityCompliance?: boolean;
  taxCreditValue?: boolean;
  section8Analysis?: boolean;
  utilityAllowances?: boolean;
  incomeVerification?: boolean;
  rentRestrictions?: boolean;
  recertificationSchedule?: boolean;
  waitlistDepth?: boolean;
  penetrationRate?: boolean;
  ageQualifiedHouseholds?: boolean;
  competitiveCensus?: boolean;
  moveInRate?: boolean;
  mortalityImpact?: boolean;
  careProgressionAnalysis?: boolean;
  adaCompliance?: boolean;
  medicareAdvantage?: boolean;
  horizontalDensity?: boolean;
  maintenanceEfficiency?: boolean;
  hoa_structure?: boolean;
  sfr_premiums?: boolean;
  yard_maintenance?: boolean;
  dispersedManagement?: boolean;
  crossSubsidyAnalysis?: boolean;
  incomeSegmentation?: boolean;
  socialImpactScore?: boolean;
  publicPrivateStructure?: boolean;
  taxAbatements?: boolean;
  tif_analysis?: boolean;
  communityBenefits?: boolean;
  priceToRentRatio?: boolean;
  componentNOI?: boolean;
  synergyCaptureRate?: boolean;
  crossUtilizationMetrics?: boolean;
  integratedParkingEfficiency?: boolean;
  live_work_play_score?: boolean;
  transitOrientedPremium?: boolean;
  verticalRetailSuccess?: boolean;
  residentialStabilization?: boolean;
  historic_tax_credits?: boolean;
  preservation_easements?: boolean;
  structural_adaptation_cost?: boolean;
  character_preservation_value?: boolean;
  sustainability_score?: boolean;
  embodied_carbon_savings?: boolean;
  community_support_index?: boolean;
  cultural_significance_premium?: boolean;
  dockDoorRatio?: boolean;
  clearHeightPremium?: boolean;
  trailerParkingRatio?: boolean;
  powerCapacityAnalysis?: boolean;
  locationScore?: boolean;
  lastMileProximity?: boolean;
  powerIntensity?: boolean;
  utilityRedundancy?: boolean;
  environmentalCompliance?: boolean;
  specializedSystems?: boolean;
  craneCapacity?: boolean;
  hazmatCapability?: boolean;
  waterUsageRights?: boolean;
  temperatureZones?: boolean;
  refrigerationRedundancy?: boolean;
  energyIntensity?: boolean;
  insulationValue?: boolean;
  rackingCapacity?: boolean;
  blastFreezerCapacity?: boolean;
  ammonia_vs_freon?: boolean;
  defrostSystems?: boolean;
  officePercentage?: boolean;
  labBuildOutPotential?: boolean;
  parkingDensity?: boolean;
  hvacFlexibility?: boolean;
  dataCapacity?: boolean;
  divisibility?: boolean;
  showroomPotential?: boolean;
  tech_tenant_appeal?: boolean;
  powerDensity?: boolean;
  pue_rating?: boolean;
  redundancyLevel?: boolean;
  uptimeRating?: boolean;
  coolingCapacity?: boolean;
  connectivityScore?: boolean;
  securityLevel?: boolean;
  disaster_recovery?: boolean;
  latency_metrics?: boolean;
  
  // Additional unique custom metrics from package files
  // Industrial-specific unique metrics
  populationDensity1Mile?: boolean;
  deliveryRadius?: boolean;
  ecommercePenetration?: boolean;
  competingFacilities?: boolean;
  vanParkingRatio?: boolean;
  multiStoryFeasibility?: boolean;
  truckAccessibility?: boolean;
  canopySquareFootage?: boolean;
  plantsPerSF?: boolean;
  gramsPerSF?: boolean;
  hvacLoadPerSF?: boolean;
  waterUsageTracking?: boolean;
  securityCompliance?: boolean;
  odorMitigation?: boolean;
  state_local_compliance?: boolean;
  acreage?: boolean;
  improved_percentage?: boolean;
  fence_security?: boolean;
  surface_type?: boolean;
  drainage_quality?: boolean;
  weight_capacity?: boolean;
  ingress_egress?: boolean;
  stacking_rights?: boolean;
  
  // Office-specific unique metrics
  leaseAnalysis?: boolean;
  tenantAnalytics?: boolean;

  // Event/venue/hospitality metrics
  event_day_capture?: boolean;
  non_event_activation?: boolean;
  sponsorship_revenue?: boolean;
  naming_rights_value?: boolean;
  media_production_income?: boolean;
  gambling_revenue_impact?: boolean;
  concert_theater_utilization?: boolean;
  sports_venue_synergy?: boolean;
  complexityFactor?: boolean;
  // Student housing/affordable/advanced
  bedLeaseAnalysis?: boolean;
  preLeasingVelocity?: boolean;
  summerOccupancy?: boolean;
  parentGuarantorRate?: boolean;
  universityEnrollmentTrends?: boolean;
  competitiveBedSupply?: boolean;
  walkToCampusTime?: boolean;
  renovationROI?: boolean;
  rentPremiumCapture?: boolean;
  unleveredYieldLift?: boolean;
  leveragedReturns?: boolean;
  lossToLeaseCapture?: boolean;
  phaseAnalysis?: boolean;
  displacementCost?: boolean;

  // Additional missing metrics with exact casing from packages
  location_score?: boolean;
  activation_hours?: boolean;
  cross_pollination_index?: boolean;
  amenity_sharing_efficiency?: boolean;
  community_engagement_score?: boolean;
  walkability_premium?: boolean;
  internal_capture_rate?: boolean;
  destination_draw_factor?: boolean;
  social_infrastructure_value?: boolean;
  demo_vs_adaptive_costs?: boolean;
  anchor_replacement_strategy?: boolean;
  residential_conversion_yield?: boolean;
  healthcare_integration?: boolean;
  entertainment_component_roi?: boolean;
  parking_deck_conversion?: boolean;
  green_space_creation?: boolean;
  district_energy_potential?: boolean;
  hotel_demand_generators?: boolean;
  f_and_b_capture_rate?: boolean;
  conference_utilization?: boolean;
  extended_stay_impact?: boolean;
  airbnb_competition?: boolean;
  group_vs_transient?: boolean;
  spa_wellness_revenue?: boolean;
  rooftop_activation?: boolean;
  cross_subsidy_analysis?: boolean;
  labRentPremium?: boolean;
  hvacCapacityAnalysis?: boolean;
  floorLoadCapacity?: boolean;
  vibrationAnalysis?: boolean;
  ceilingHeightAdequacy?: boolean;
  powerCapacityPSF?: boolean;
  exhaustSystemRequirements?: boolean;
  cleanRoomPotential?: boolean;
  discountToReplacement?: boolean;
  debtAssumptionAnalysis?: boolean;
  carryingCostBurn?: boolean;
  minimumOccupancyThreshold?: boolean;
  breakEvenAnalysis?: boolean;
  workoutProbability?: boolean;
  specialServicingStatus?: boolean;
  taxLienAnalysis?: boolean;
  dispositionStrategy?: boolean;
  occupancyRate?: boolean;

  // Additional missing metrics with special characters
  tenantCredit?: boolean;

  // Special-case metrics with ampersands, underscores, etc.
  'f&b_capture_rate'?: boolean;
  'cross subsidyAnalysis'?: boolean;

  // New "Wow" Metrics
  simpleWalt?: boolean; // Office - Simple WALT calculation
  clearHeightAnalysis?: boolean; // Industrial - Clear height premium analysis
  revenuePerUnit?: boolean; // Multifamily - Revenue per unit analysis
  industrialMetrics?: boolean; // Industrial - Clear height premium analysis
  multifamilyMetrics?: boolean; // Multifamily - Revenue per unit with market comparison
}

export interface CalculatedMetrics {
  capRate?: number | null;
  cashOnCash?: number | null;
  dscr?: number | null;
  irr?: number | null;
  roi?: number | null;
  breakeven?: number | null;
  pricePerSF?: number | null;
  ltv?: number | null;
  grm?: number | null;
  pricePerUnit?: number | null;
  egi?: number | null;
  
  // Missing common metrics
  effectiveRentPSF?: number | null;
  packageError?: string;
  assetAnalysis?: any;
  validationErrors?: Record<string, string>;
  
  // New "Wow" Metrics Results
  walt?: number | null; // Office - WALT in years
  simpleWalt?: number | null; // Office - Simple WALT in years
  salesPerSF?: {
    average: number;
    byTenant: { name: string; salesPerSF: number }[];
  } | null; // Retail - Sales per SF analysis
  clearHeightAnalysis?: {
    pricePerSF: number;
    clearHeightCategory: string;
    estimatedPremium: string;
  } | null; // Industrial - Clear height premium analysis
  revenuePerUnit?: {
    revenuePerUnit: number;
    annualizedRevenue: number;
    marketComparison?: string;
  } | null; // Multifamily - Revenue per unit analysis
  industrialMetrics?: {
    pricePerSF: number;
    clearHeightCategory: string;
    estimatedPremium: string;
  } | null; // Industrial - Clear height premium analysis
  multifamilyMetrics?: {
    revenuePerUnit: number;
    annualizedRevenue: number;
    marketComparison?: string;
  } | null; // Multifamily - Revenue per unit with market comparison
  
  // Allow additional calculated metrics
  [key: string]: any;
}

export type AssessmentLevel = 'strong' | 'moderate' | 'weak' | 'insufficient';

export interface DealAssessment {
  overall: AssessmentLevel;
  recommendation: string;
  metricScores: {
    [key: string]: AssessmentLevel;
  };
  // Optional for backward compatibility
  scores?: {
    [key: string]: AssessmentLevel;
  };
  activeMetrics?: number;
}

export interface CalculationPackage {
  id: string;
  name: string;
  description: string;
  includedMetrics: (keyof MetricFlags)[];
  requiredFields: (keyof PropertyData)[];
  
  // Additional custom properties from package files
  category?: string;
  optionalFields?: string[];
  templates?: string[];
  minimumDataThreshold?: number;
  analysisDepth?: string;
} 