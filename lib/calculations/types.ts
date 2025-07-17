// lib/calculations/types-clean.ts
// Clean, consolidated calculation types for the Smart Deal Analyzer
// All duplicates removed, all custom additions preserved

// Removed unused import - MetricFlags and PropertyData are exported from ../types but not used here

export type PropertyType = 'office' | 'retail' | 'industrial' | 'multifamily' | 'mixed-use';

export type AssessmentLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

// ==================== ENHANCED ASSET-SPECIFIC TYPES ====================

// Office Property Types
export interface OfficeTenant {
  // Basic Information
  tenantName: string;
  legalEntityName: string;
  dba?: string[];
  parentCompany?: string;
  ultimateParent?: string;
  ticker?: string; // If public
  
  // Industry & Credit
  industry: string;
  naicsCode: string;
  sicCode?: string;
  creditRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D' | 'NR';
  creditAgency?: 'S&P' | 'Moodys' | 'Fitch';
  bankruptcyHistory?: {
    filed: Date;
    emerged?: Date;
    type: 'Chapter 7' | 'Chapter 11';
  }[];
  financialStrength: 'Strong' | 'Stable' | 'Watch' | 'Weak';
  
  // Space Configuration
  suites: {
    suiteNumber: string;
    floor: number;
    rentableSF: number;
    usableSF: number;
    loadFactor: number;
    configuration: 'Open' | 'Traditional' | 'Mixed';
    privateOffices: number;
    workstations: number;
    conferenceRooms: number;
    hasReception: boolean;
    hasPrivateRestroom: boolean;
    interconnected: boolean;
  }[];
  totalRentableSF: number;
  totalUsableSF: number;
  expansion: {
    rightOfFirstOffer: string[]; // suite numbers
    rightOfFirstRefusal: string[];
    mustTake: string[];
    optionDeadline?: Date;
  };
  
  // Lease Terms
  leaseID: string;
  leaseType: 'Direct' | 'Sublease' | 'License' | 'Management Agreement';
  originalLeaseDate: Date;
  commencementDate: Date;
  rentCommencementDate: Date;
  expirationDate: Date;
  
  // Rent Structure
  baseRentSchedule: {
    startDate: Date;
    endDate: Date;
    annualRent: number;
    monthlyRent: number;
    rentPSF: number;
  }[];
  escalations: {
    type: 'Fixed' | 'CPI' | 'Market' | 'Porter Wage' | 'Operating Expense';
    amount?: number; // For fixed
    floor?: number; // For CPI
    ceiling?: number; // For CPI
    frequency: 'Annual' | 'Biennial' | 'Triennial' | 'Every 5 Years';
    compounded: boolean;
    nextEscalationDate: Date;
  };
  percentageRent?: {
    breakpoint: number;
    percentage: number;
    natural: boolean;
  };
  
  // Concessions & Inducements
  freeRent: {
    months: number;
    type: 'Net' | 'Gross';
    period: 'Upfront' | 'Spread' | 'Backend';
    startDate?: Date;
    endDate?: Date;
  };
  tenantImprovement: {
    totalAllowance: number;
    psfAllowance: number;
    landlordWork?: string;
    standardsBuildout: boolean;
    unused: 'Forfeit' | 'Rent Credit' | 'Cash';
  };
  movingAllowance?: number;
  leasingCommissions: {
    listing: { broker: string; percentage: number; amount: number };
    procuring: { broker: string; percentage: number; amount: number };
    renewal?: { percentage: number };
  };
  
  // Operating Expenses
  expenseStructure: 'Full Service' | 'Modified Gross' | 'Industrial Gross' | 'NNN' | 'Absolute NNN';
  baseYear?: number;
  baseYearAmount?: number;
  expenseStop?: number;
  expenseEscalations: {
    category: string;
    method: 'Pro Rata' | 'Direct' | 'Capped' | 'Excluded';
    cap?: number;
    capType?: 'Annual' | 'Cumulative';
  }[];
  
  // Additional Rent
  parking: {
    includedSpaces: number;
    additionalSpaces: number;
    monthlyRate: number;
    location: 'Covered' | 'Surface' | 'Garage';
    reserved: boolean;
  };
  storage?: {
    location: string;
    squareFeet: number;
    monthlyRent: number;
  };
  signage?: {
    type: 'Building Top' | 'Monument' | 'Directory' | 'Floor';
    location: string;
    monthlyFee: number;
    exclusive: boolean;
  };
  
  // Options & Rights
  renewalOptions: {
    sequence: number;
    term: number; // months
    notice: { min: number; max: number }; // days
    rentBasis: 'Fixed' | 'FMV' | 'Percentage' | 'CPI';
    fixedRate?: number;
    percentageOfCurrent?: number;
    marketFloor?: number;
    marketCeiling?: number;
    exercised: boolean;
  }[];
  terminationOptions: {
    date: Date;
    notice: number; // days
    penalty: number;
    conditions?: string[];
    exercised: boolean;
  }[];
  expansionOptions: {
    space: string[];
    deadline: Date;
    terms: 'Same' | 'Market' | 'Specified';
    specifiedRate?: number;
    exercised: boolean;
  }[];
  
  // Sublease & Assignment
  subleaseRights: 'Prohibited' | 'Consent Required' | 'Permitted' | 'Sharing';
  profitSharing?: {
    threshold: number;
    landlordShare: number;
  };
  recapture: boolean;
  
  // Security & Insurance
  securityDeposit: {
    amount: number;
    type: 'Cash' | 'LOC' | 'Corporate Guarantee' | 'Personal Guarantee';
    burndown?: {
      schedule: { date: Date; reduction: number }[];
      tied: 'Time' | 'Performance';
    };
  };
  insurance: {
    liability: number;
    property: number;
    businessInterruption: boolean;
    waiver: boolean;
  };
  
  // Operational
  operatingHours: 'Standard' | '24/7' | 'Extended';
  hvacHours: string;
  afterHoursHVAC: number; // $/hour
  employees: number;
  visitors: number; // daily average
  specialRequirements?: string[];
  
  // Performance Metrics
  paymentHistory: {
    onTime: number;
    late: number;
    defaulted: number;
    averageDaysLate: number;
  };
  maintenanceTickets: number; // per month
  violations?: {
    date: Date;
    type: string;
    resolved: boolean;
  }[];
}

export interface BuildingOperations {
  // Management
  propertyManager: string;
  assetManager: string;
  engineeringStaff: number;
  securityStaff: number;
  janitorialStaff: number;
  
  // Building Systems
  hvacSystems: {
    type: 'VAV' | 'VRF' | 'Chilled Beam' | 'Split' | 'Package';
    age: number;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    maintenanceContract: boolean;
    energyEfficiency: number; // EER rating
    controls: 'Pneumatic' | 'DDC' | 'Smart';
  }[];
  electricalSystems: {
    capacity: number; // watts/SF
    voltage: string;
    backupPower: 'Generator' | 'UPS' | 'Both' | 'None';
    backupCapacity: number; // % of building
    substations: number;
  };
  plumbing: {
    domesticWaterAge: number;
    sewerAge: number;
    fixtures: 'Standard' | 'Low Flow' | 'Waterless';
    hotWaterSystem: 'Central' | 'Local' | 'Tankless';
  };
  elevatorSystems: {
    passenger: {
      count: number;
      capacity: number;
      speed: number; // fpm
      type: 'Hydraulic' | 'Traction' | 'MRL';
      age: number;
      modernized: boolean;
    };
    freight: {
      count: number;
      capacity: number;
      access: string[];
    };
    destinationDispatch: boolean;
  };
  
  // Technology Infrastructure
  technology: {
    internetProviders: string[];
    fiberOptic: boolean;
    bandwidth: string;
    riserCapacity: 'Full' | 'Limited' | 'None';
    cellularDAS: boolean;
    smartBuildingSystems: string[];
    accessControl: 'Card' | 'Fob' | 'Mobile' | 'Biometric';
  };
  
  // Sustainability
  sustainability: {
    energyStarScore?: number;
    energyStarCertified: boolean;
    leedCertification?: 'Certified' | 'Silver' | 'Gold' | 'Platinum';
    leedVersion?: string;
    wellCertification?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    boma360?: boolean;
    wireCertification?: 'Certified' | 'Silver' | 'Gold' | 'Platinum';
    fitWelCertification?: boolean;
  };
  
  // Operating Expenses Detail
  expenses: {
    category: string;
    subcategory?: string;
    annual: number;
    perSF: number;
    recoverable: boolean;
    trend3Year: number; // % annual growth
    contractual: boolean;
    vendor?: string;
  }[];
}

export interface MarketIntelligence {
  // Submarket Dynamics
  submarket: {
    name: string;
    totalInventory: number;
    class: 'CBD' | 'Suburban' | 'Urban Fringe';
    vacancy: {
      current: number;
      classA: number;
      classB: number;
      classC: number;
      trend: 'Improving' | 'Stable' | 'Deteriorating';
    };
    absorption: {
      trailing12Months: number;
      quarterly: number[];
      trend: 'Positive' | 'Neutral' | 'Negative';
    };
    construction: {
      underConstruction: number;
      planned: number;
      delivering: { quarter: string; sf: number }[];
    };
  };
  
  // Competitive Set
  competitiveProperties: {
    name: string;
    address: string;
    distance: number; // miles
    class: 'A+' | 'A' | 'B+' | 'B' | 'C';
    yearBuilt: number;
    renovated?: number;
    totalSF: number;
    occupancy: number;
    askingRent: number;
    effectiveRent: number;
    concessions: string;
    amenities: string[];
    majorTenants: { name: string; sf: number; industry: string }[];
    walkScore: number;
    transitScore: number;
  }[];
  
  // Demand Drivers
  demandDrivers: {
    employmentGrowth: {
      metro: number;
      submarket: number;
      keyIndustries: { industry: string; growth: number; share: number }[];
    };
    majorEmployers: {
      name: string;
      employees: number;
      industry: string;
      distance: number;
      expansion: 'Expanding' | 'Stable' | 'Contracting';
    }[];
    transportation: {
      highways: { name: string; distance: number; access: string }[];
      transit: { type: string; station: string; distance: number }[];
      airports: { name: string; distance: number; driveTime: number }[];
    };
  };
}

// Multifamily Property Types
export interface Unit {
  unitNumber: string;
  unitType: 'Studio' | '1BR' | '2BR' | '3BR' | '4BR' | 'Penthouse';
  squareFootage: number;
  floor: number;
  
  // Rental Information
  currentRent: number;
  marketRent: number;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  mtmStatus: boolean; // Month-to-month
  
  // Tenant Information
  occupied: boolean;
  tenantName?: string;
  tenantCreditScore?: number;
  paymentHistory?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  
  // Unit Features
  renovated: boolean;
  renovationDate?: Date;
  amenities: {
    washerDryer: boolean;
    balcony: boolean;
    fireplace: boolean;
    walkInCloset: boolean;
    upgradedKitchen: boolean;
    upgradedBath: boolean;
  };
  
  // Financial
  concessions?: {
    type: 'Free Rent' | 'Reduced Rent' | 'Other';
    amount: number;
    months: number;
  };
  otherIncome?: {
    parking?: number;
    storage?: number;
    pet?: number;
    utilities?: number;
  };
}

export interface PropertyAmenities {
  // Community Features
  pool: boolean;
  fitness: boolean;
  clubhouse: boolean;
  businessCenter: boolean;
  playground: boolean;
  dogPark: boolean;
  bbqArea: boolean;
  
  // Services
  concierge: boolean;
  valet: boolean;
  packageReceiving: boolean;
  dryCleaningService: boolean;
  maintenanceOnSite: boolean;
  
  // Parking
  coveredParking: boolean;
  gatedParking: boolean;
  evCharging: boolean;
  parkingRatio: number; // spaces per unit
  
  // Technology
  highSpeedInternet: boolean;
  smartHome: boolean;
  keylessEntry: boolean;
  packageLockers: boolean;
  
  // Utilities
  centralHVAC: boolean;
  individualHVAC: boolean;
  allElectric: boolean;
  gasHeating: boolean;
  trashValet: boolean;
}

export interface MarketComps {
  propertyName: string;
  distance: number; // miles
  yearBuilt: number;
  totalUnits: number;
  occupancy: number;
  avgRentPSF: number;
  amenityScore: number; // 0-100
  renovated: boolean;
  
  // Unit Mix
  unitMix: {
    studio: { count: number; avgRent: number; avgSF: number };
    oneBed: { count: number; avgRent: number; avgSF: number };
    twoBed: { count: number; avgRent: number; avgSF: number };
    threeBed: { count: number; avgRent: number; avgSF: number };
  };
  
  // Concessions
  concessionOffered: boolean;
  concessionType?: string;
  concessionValue?: number;
}

export interface ResidentProfile {
  // Demographics
  avgAge: number;
  avgIncome: number;
  avgCreditScore: number;
  
  // Composition
  students: number; // percentage
  families: number;
  youngProfessionals: number;
  seniors: number;
  
  // Behavior
  avgTenancy: number; // months
  renewalRate: number;
  onlinePaymentAdoption: number;
  maintenanceRequestsPerUnit: number;
}

// Retail Property Types
export interface RetailTenant {
  // Basic Information
  tenantName: string;
  dba?: string; // Doing Business As
  parentCompany?: string;
  franchisee: boolean;
  nationalTenant: boolean;
  
  // Store Classification
  category: 'Anchor' | 'Junior Anchor' | 'Inline' | 'Pad' | 'Kiosk' | 'Pop-up';
  merchandiseType: 'Apparel' | 'Food' | 'Entertainment' | 'Service' | 'Fitness' | 'Electronics' | 'Home' | 'Other';
  naicsCode: string;
  essentialService: boolean; // Grocery, pharmacy, etc.
  
  // Space Details
  unit: string;
  squareFootage: number;
  frontage: number; // Linear feet
  location: 'Mall' | 'Strip' | 'Lifestyle' | 'Power' | 'Outlet' | 'Street';
  floor: number;
  
  // Financial Terms
  leaseStartDate: Date;
  leaseEndDate: Date;
  baseRentPSF: number;
  percentageRent: {
    rate: number; // percentage
    naturalBreakpoint: number; // annual sales threshold
    artificial?: number; // if different from natural
  };
  
  // Sales Data
  reportedSales?: number;
  salesPSF?: number;
  compSales?: number; // Year-over-year
  salesReporting: 'Monthly' | 'Quarterly' | 'Annual' | 'None';
  
  // Operating Terms
  camStructure: 'Pro-rata' | 'Fixed' | 'Capped' | 'Excluded';
  camCap?: number;
  taxStructure: 'Pro-rata' | 'Fixed' | 'Excluded';
  insuranceStructure: 'Pro-rata' | 'Fixed' | 'Excluded';
  utilities: 'Separately Metered' | 'Prorated' | 'Included';
  
  // Lease Clauses
  exclusiveUse?: string;
  radius?: number; // miles
  kickout?: {
    salesThreshold: number;
    measurementPeriod: number; // months
    noticeRequired: number; // days
  };
  coTenancy?: {
    required: string[]; // tenant names
    remedy: 'Rent Reduction' | 'Termination' | 'Both';
    rentReduction?: number; // percentage
  };
  goingDark?: 'Prohibited' | 'Allowed' | 'With Conditions';
  
  // Credit & Risk
  creditRating?: string;
  bankruptcyHistory?: boolean;
  storePerformanceRating?: 'A' | 'B' | 'C' | 'D';
}

export interface SalesData {
  tenant: string;
  month: number;
  year: number;
  grossSales: number;
  returns: number;
  netSales: number;
  transactions: number;
  averageTicket: number;
}

export interface TradeArea {
  radius: number; // miles
  population: number;
  households: number;
  medianIncome: number;
  averageIncome: number;
  daytimePopulation: number;
  populationDensity: number; // per sq mile
  growth5Year: number; // percentage
  
  // Demographics
  ageDistribution: {
    under18: number;
    '18-34': number;
    '35-54': number;
    '55-74': number;
    over75: number;
  };
  
  educationLevel: {
    highSchool: number;
    someCollege: number;
    bachelors: number;
    graduate: number;
  };
  
  // Retail Metrics
  retailSpendingPower: number;
  voidAnalysis: Map<string, number>; // category -> unmet demand
}

// Industrial Property Types
export interface IndustrialTenant {
  // Basic Information
  tenantName: string;
  parentCompany?: string;
  industry: 'Logistics' | 'Manufacturing' | 'Distribution' | 'Cold Storage' | 'Data Center' | 'Flex' | 'Other';
  naicsCode?: string;
  creditRating?: string;
  publicCompany: boolean;
  
  // Lease Terms
  suiteNumber?: string;
  squareFootage: number;
  leaseStartDate: Date;
  leaseEndDate: Date;
  baseRentPSF: number;
  rentType: 'NNN' | 'Gross' | 'Modified Gross';
  escalationType: 'Fixed' | 'CPI' | 'Market';
  escalationRate?: number;
  
  // Space Configuration
  officePercentage: number;
  warehousePercentage: number;
  manufacturingPercentage?: number;
  yardSpace?: number; // SF
  
  // Operating Requirements
  clearHeightRequired: number;
  dockDoorsRequired: number;
  driveInDoorsRequired?: number;
  powerRequirement?: number; // KW
  temperatureControl?: 'Ambient' | 'Cooler' | 'Freezer' | 'Multi-Temp';
  
  // Specialized Features
  railAccess: boolean;
  craneCoverage?: number; // tons
  specializedRacking?: string;
  hazmatPermits?: boolean;
  
  // Operations
  operatingHours: '8-5' | '16-Hour' | '24/7';
  employeeCount: number;
  truckTraffic: number; // per day
  parkingRequired: number;
}

export interface BuildingSpecs {
  // Physical Characteristics
  totalSF: number;
  clearHeight: number;
  columnSpacing: string; // e.g., "50x60"
  bayDepth: number;
  floorThickness: number; // inches
  floorLoadCapacity: number; // PSF
  
  // Loading
  dockDoors: number;
  dockDoorSize: string; // e.g., "9x10"
  driveInDoors: number;
  driveInDoorSize?: string;
  dockLevelers: boolean;
  dockSeals: boolean;
  truckCourtDepth: number;
  
  // Systems
  powerCapacity: number; // KW
  powerType: '3-Phase' | 'Single Phase' | 'Both';
  lightingType: 'LED' | 'T5' | 'Metal Halide' | 'Mixed';
  footCandles: number;
  hvacType: 'Rooftop' | 'Split System' | 'Evaporative' | 'None';
  fireSuppressionType: 'ESFR' | 'Wet Pipe' | 'Dry Pipe' | 'None';
  sprinklerDensity?: string; // e.g., "K-25.2"
  
  // Additional location metrics
  distanceToHighway?: number;
  distanceToAirport?: number;
  populationOneHour?: number;
  households3Miles?: number;
  ecommerceDeliveryVolume?: number;
  
  // Specialized
  railSiding?: {
    length: number; // feet
    carCapacity: number;
    switchingService: string;
  };
  craneSystem?: {
    type: 'Bridge' | 'Gantry' | 'Jib';
    capacity: number; // tons
    coverage: number; // SF
  };
  coldStorage?: {
    coolerSF: number;
    freezerSF: number;
    blastFreezerSF?: number;
    refrigerationSystem: string;
    redundancy: string;
  };
}

export interface LocationMetrics {
  // Access
  distanceToHighway: number; // miles
  distanceToPort?: number;
  distanceToAirport?: number;
  distanceToRail?: number;
  distanceToIntermodal?: number;
  
  // Labor
  populationOneHour: number;
  laborForceParticipation: number;
  averageWage: number;
  unemploymentRate: number;
  unionPresence: boolean;
  
  // Market
  submarket: string;
  totalInventorySF: number;
  vacancyRate: number;
  netAbsorption12Mo: number;
  underConstruction: number;
  avgAskingRent: number;
}

// Mixed-Use Property Types
export interface MixedUseComponent {
  type: 'Office' | 'Retail' | 'Residential' | 'Hotel' | 'Other';
  squareFootage: number;
  floors: number[];
  separateEntrance: boolean;
  dedicatedElevators: boolean;
  percentOfTotal: number;
  
  // Financial
  noi: number;
  capRate: number;
  rentPSF?: number;
  occupancy: number;
  
  // Operations
  separateManagement: boolean;
  proRataExpenses: number;
  directExpenses: number;
}

export interface SharedSystems {
  // Infrastructure
  hvac: {
    type: 'Central' | 'Separate' | 'Hybrid';
    allocation: Map<string, number>; // component -> percentage
    redundancy: boolean;
  };
  elevators: {
    total: number;
    dedicated: Map<string, number>; // component -> count
    shared: number;
  };
  parking: {
    totalSpaces: number;
    allocation: Map<string, number>; // component -> spaces
    validationSystem: boolean;
    separateLevels: boolean;
  };
  utilities: {
    masterMetered: boolean;
    subMetering: Map<string, boolean>; // component -> has submeter
    allocation: 'Actual' | 'ProRata' | 'Fixed';
  };
  
  // Security & Access
  security: {
    integrated: boolean;
    separateAccess: Map<string, boolean>;
    sharedLobby: boolean;
    afterHoursProtocol: string;
  };
}

export interface CrossUseAnalysis {
  synergies: {
    description: string;
    beneficiary: string[];
    valueAdd: number;
    implementation: 'Existing' | 'Potential';
  }[];
  conflicts: {
    issue: string;
    affected: string[];
    severity: 'Low' | 'Medium' | 'High';
    mitigation: string;
  }[];
  sharedAmenities: {
    amenity: string;
    users: string[];
    utilization: number;
    costSharing: Map<string, number>;
  }[];
}

// Missing interface for industrial calculations
export interface PropertyRequirements {
  minSF?: number;
  maxSF?: number;
  clearHeightMin?: number;
  clearHeightIdeal?: number;
  dockDoorsMin?: number;
  dockDoorsIdeal?: number;
  officePercentage?: number;
  // Missing fields that are referenced in industrial calculations
  idealPowerPerSF?: number;
  minPowerPerSF?: number;
  [key: string]: any;
}

// ==================== EXISTING TYPES ====================

export interface LocalDealAssessment {
  overall: AssessmentLevel;
  recommendation: string;
  metricScores: {
    [key: string]: AssessmentLevel;
  };
  activeMetrics: number;
}

export type DealAssessment = LocalDealAssessment;

// Re-export the main types for use in this module
export type { MetricFlags, PropertyData, CalculatedMetrics, CalculationPackage } from '../types'; 