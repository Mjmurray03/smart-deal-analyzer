// lib/calculations/asset-metrics/office/index.ts
// Comprehensive office property analytics for institutional investors

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

// Core analysis functions
export function analyzeTenantFinancialHealth(
  tenants: OfficeTenant[],
  marketData: MarketIntelligence
): {
  portfolioCredit: {
    weightedCreditScore: number;
    investmentGradePercentage: number;
    publicCompanyPercentage: number;
    watchList: {
      tenant: string;
      reason: string[];
      riskLevel: 'High' | 'Medium' | 'Low';
      recommendedAction: string;
    }[];
  };
  tenantConcentration: {
    herfindahlIndex: number;
    topTenantExposure: number;
    industryConcentration: {
      industry: string;
      percentage: number;
      tenantCount: number;
      marketOutlook: 'Growing' | 'Stable' | 'Declining';
    }[];
  };
  financialMetrics: {
    tenant: string;
    employeeDensity: number;
    expansionProbability: number;
    downsizingRisk: number;
    indicators: {
      positive: string[];
      negative: string[];
    };
  }[];
} {
  // Implementation would go here
  return {
    portfolioCredit: {
      weightedCreditScore: 75,
      investmentGradePercentage: 60,
      publicCompanyPercentage: 40,
      watchList: []
    },
    tenantConcentration: {
      herfindahlIndex: 0.25,
      topTenantExposure: 15,
      industryConcentration: []
    },
    financialMetrics: []
  };
}

export function analyzeLeaseEconomics(
  tenants: OfficeTenant[],
  marketData: MarketIntelligence
): {
  leaseValuation: {
    tenant: string;
    contractualRent: number;
    marketRent: number;
    leaseValue: number;
    effectiveRent: number;
    faceRent: number;
  }[];
  escalationAnalysis: {
    avgEscalation: number;
    escalationTypes: { type: string; count: number; avgRate: number }[];
    cpiExposure: number;
    fixedIncreases: number;
  };
  concessionAnalysis: {
    totalConcessions: number;
    freeRentValue: number;
    tiAllowances: number;
    concessionRate: number;
    paybackPeriod: number;
  };
} {
  // Implementation would go here
  return {
    leaseValuation: [],
    escalationAnalysis: {
      avgEscalation: 2.5,
      escalationTypes: [],
      cpiExposure: 30,
      fixedIncreases: 70
    },
    concessionAnalysis: {
      totalConcessions: 0,
      freeRentValue: 0,
      tiAllowances: 0,
      concessionRate: 0,
      paybackPeriod: 0
    }
  };
}

export function analyzeBuildingOperations(
  building: BuildingOperations,
  tenants: OfficeTenant[],
  propertyAge: number,
  totalSF: number
): {
  operationalEfficiency: {
    overallScore: number;
    energyEfficiency: number;
    waterEfficiency: number;
    wasteEfficiency: number;
    indoorEnvironment: number;
  };
  systemsCondition: {
    system: string;
    age: number;
    remainingLife: number;
    condition: string;
    replacementCost: number;
    annualMaintenance: number;
  }[];
  expenseAnalysis: {
    totalExpenses: number;
    expensePSF: number;
    controllable: number;
    nonControllable: number;
  };
} {
  // Implementation would go here
  return {
    operationalEfficiency: {
      overallScore: 80,
      energyEfficiency: 75,
      waterEfficiency: 85,
      wasteEfficiency: 70,
      indoorEnvironment: 90
    },
    systemsCondition: [],
    expenseAnalysis: {
      totalExpenses: 0,
      expensePSF: 0,
      controllable: 0,
      nonControllable: 0
    }
  };
}

export function analyzeMarketPositioning(
  property: {
    tenants: OfficeTenant[];
    building: BuildingOperations;
    totalSF: number;
    occupancy: number;
    avgRent: number;
    parkingRatio: number;
  },
  market: MarketIntelligence
): {
  marketPosition: {
    overallRank: number;
    totalProperties: number;
    percentile: number;
    classification: 'Market Leader' | 'Above Average' | 'Average' | 'Below Average';
    keyDifferentiators: string[];
    competitiveWeaknesses: string[];
  };
  pricingAnalysis: {
    askingVsMarket: number;
    effectiveVsMarket: number;
    pricingPower: 'Strong' | 'Moderate' | 'Weak';
    recommendedStrategy: string;
    targetRent: number;
  };
} {
  // Implementation would go here
  return {
    marketPosition: {
      overallRank: 5,
      totalProperties: 20,
      percentile: 75,
      classification: 'Above Average',
      keyDifferentiators: ['LEED Certification', 'Prime Location'],
      competitiveWeaknesses: []
    },
    pricingAnalysis: {
      askingVsMarket: 5,
      effectiveVsMarket: 2,
      pricingPower: 'Moderate',
      recommendedStrategy: 'Selective rent increases',
      targetRent: 0
    }
  };
}

// Helper functions
export function getIndustryOutlook(industry: string): string {
  const outlooks: Record<string, string> = {
    'Technology': 'Growing',
    'Healthcare': 'Growing',
    'Financial Services': 'Stable',
    'Legal': 'Stable',
    'Government': 'Stable',
    'Media': 'Declining',
    'Insurance': 'Declining'
  };
  return outlooks[industry] || 'Stable';
}

export function getWFHImpact(industry: string): string {
  const impacts: Record<string, string> = {
    'Technology': 'High',
    'Financial Services': 'Medium',
    'Legal': 'Low',
    'Healthcare': 'Low',
    'Government': 'Low'
  };
  return impacts[industry] || 'Medium';
}

export function calculateRealEstateOptionValue(
  currentValue: number,
  strikePrice: number,
  timeToExpiry: number,
  volatility: number = 0.15,
  riskFreeRate: number = 0.03
): number {
  const timeValue = Math.sqrt(timeToExpiry) * volatility * currentValue;
  const intrinsicValue = Math.max(0, currentValue - strikePrice);
  const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);
  return (intrinsicValue + timeValue * 0.4) * discountFactor;
}

export function calculateSpaceEfficiencyScore(
  usableSF: number,
  rentableSF: number,
  occupancy: number,
  tenantCount: number,
  avgFloorPlate: number
): number {
  let score = 50;
  const coreEfficiency = (usableSF / rentableSF) * 100;
  if (coreEfficiency >= 85) score += 30;
  else if (coreEfficiency >= 82) score += 20;
  else if (coreEfficiency >= 78) score += 10;
  else score -= 10;
  
  if (occupancy >= 95) score += 25;
  else if (occupancy >= 90) score += 15;
  else if (occupancy >= 85) score += 5;
  else score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

export function determineMarketCycle(
  vacancy: number,
  rentGrowth: number,
  newSupply: number,
  absorption: number
): 'Recovery' | 'Expansion' | 'Hypersupply' | 'Recession' {
  if (vacancy > 15 && rentGrowth < 0) return 'Recession';
  if (vacancy > 10 && newSupply > absorption * 2) return 'Hypersupply';
  if (vacancy < 10 && rentGrowth > 3) return 'Expansion';
  return 'Recovery';
}

export function calculateRetentionProbability(
  tenant: OfficeTenant,
  marketConditions: {
    avgRent: number;
    vacancy: number;
    competitorSpace: number;
  }
): number {
  let probability = 0.7;
  const rentVsMarket = tenant.baseRentSchedule[0].rentPSF / marketConditions.avgRent;
  if (rentVsMarket < 0.9) probability += 0.15;
  else if (rentVsMarket > 1.1) probability -= 0.15;
  
  if (tenant.creditRating && ['AAA', 'AA', 'A'].includes(tenant.creditRating)) {
    probability += 0.1;
  }
  
  return Math.max(0.1, Math.min(0.95, probability));
} 