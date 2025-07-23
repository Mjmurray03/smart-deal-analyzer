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
  tenants: OfficeTenant[]
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
  // Calculate weighted credit score based on tenant rent contribution
  const totalRent = tenants.reduce((sum, tenant) => sum + (tenant.baseRentSchedule[0]?.annualRent || 0), 0);
  let weightedCreditScore = 0;
  let investmentGradeCount = 0;
  let publicCompanyCount = 0;
  const watchList: { tenant: string; reason: string[]; riskLevel: 'High' | 'Medium' | 'Low'; recommendedAction: string; }[] = [];

  tenants.forEach(tenant => {
    const currentRent = tenant.baseRentSchedule[0]?.annualRent || 0;
  const rentWeight = totalRent > 0 ? currentRent / totalRent : 0;
    const creditScore = getCreditScore(tenant.creditRating);
    weightedCreditScore += creditScore * rentWeight;
    
    if (isInvestmentGrade(tenant.creditRating)) {
      investmentGradeCount++;
    }
    
    if (tenant.ticker) {
      publicCompanyCount++;
    }
    
    // Check for watch list candidates
    const reasons: string[] = [];
    if (tenant.bankruptcyHistory && tenant.bankruptcyHistory.length > 0) {
      reasons.push('Previous bankruptcy');
    }
    if (tenant.financialStrength === 'Weak' || tenant.financialStrength === 'Watch') {
      reasons.push('Financial weakness');
    }
    if (reasons.length > 0) {
      watchList.push({
        tenant: tenant.tenantName,
        reason: reasons,
        riskLevel: tenant.financialStrength === 'Weak' ? 'High' : 'Medium',
        recommendedAction: tenant.financialStrength === 'Weak' ? 'Immediate review required' : 'Monitor closely'
      });
    }
  });

  // Calculate tenant concentration metrics
  const tenantShares = tenants.map(t => (t.baseRentSchedule[0]?.annualRent || 0) / totalRent);
  const herfindahlIndex = tenantShares.reduce((sum, share) => sum + share * share, 0);
  const topTenantExposure = Math.max(...tenantShares) * 100;

  // Industry concentration analysis
  const industryMap = new Map<string, number>();
  tenants.forEach(tenant => {
    const currentRent = industryMap.get(tenant.industry) || 0;
    industryMap.set(tenant.industry, currentRent + (tenant.baseRentSchedule[0]?.annualRent || 0));
  });

  const industryConcentration = Array.from(industryMap.entries()).map(([industry, rent]) => ({
    industry,
    percentage: totalRent > 0 ? (rent / totalRent) * 100 : 0,
    tenantCount: tenants.filter(t => t.industry === industry).length,
    marketOutlook: getIndustryOutlookFromMarket(industry)
  }));

  // Financial metrics per tenant
  const financialMetrics = tenants.map(tenant => ({
    tenant: tenant.tenantName,
    employeeDensity: calculateEmployeeDensity(tenant),
    expansionProbability: calculateExpansionProbability(tenant),
    downsizingRisk: calculateDownsizingRisk(tenant),
    indicators: {
      positive: getPositiveIndicators(tenant),
      negative: getNegativeIndicators(tenant)
    }
  }));

  return {
    portfolioCredit: {
      weightedCreditScore: Number(weightedCreditScore.toFixed(1)),
      investmentGradePercentage: Number(((investmentGradeCount / tenants.length) * 100).toFixed(1)),
      publicCompanyPercentage: Number(((publicCompanyCount / tenants.length) * 100).toFixed(1)),
      watchList
    },
    tenantConcentration: {
      herfindahlIndex: Number(herfindahlIndex.toFixed(3)),
      topTenantExposure: Number(topTenantExposure.toFixed(1)),
      industryConcentration
    },
    financialMetrics
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
  // Calculate lease valuation for each tenant
  const leaseValuation = tenants.map(tenant => {
    const currentRent = tenant.baseRentSchedule[0]?.rentPSF || 0;
    const marketRent = marketData.submarket.vacancy.current < 10 ? currentRent * 1.1 : currentRent * 0.95;
    const totalSF = tenant.totalRentableSF;
    const contractualRent = currentRent * totalSF;
    const leaseValue = Math.max(0, (marketRent - currentRent) * totalSF);
    
    // Calculate effective rent (face rent minus concessions)
    const freeRentMonths = tenant.freeRent?.months || 0;
    const tiAllowance = tenant.tenantImprovement?.psfAllowance || 0;
    const leaseTermYears = tenant.baseRentSchedule.length > 0 ? 
      (new Date(tenant.expirationDate).getFullYear() - new Date(tenant.commencementDate).getFullYear()) : 5;
    
    const faceRent = contractualRent;
    const effectiveRent = faceRent - ((freeRentMonths / 12) * faceRent / leaseTermYears) - (tiAllowance * totalSF / leaseTermYears);
    
    return {
      tenant: tenant.tenantName,
      contractualRent,
      marketRent: marketRent * totalSF,
      leaseValue,
      effectiveRent,
      faceRent
    };
  });
  
  // Analyze escalation patterns
  const escalationTypes = new Map<string, { count: number; totalRate: number }>();
  let cpiCount = 0;
  let fixedCount = 0;
  
  tenants.forEach(tenant => {
    const escType = tenant.escalations?.type || 'Fixed';
    const escAmount = tenant.escalations?.amount || 2.5;
    
    if (!escalationTypes.has(escType)) {
      escalationTypes.set(escType, { count: 0, totalRate: 0 });
    }
    
    const current = escalationTypes.get(escType)!;
    current.count++;
    current.totalRate += escAmount;
    
    if (escType === 'CPI') cpiCount++;
    else fixedCount++;
  });
  
  const escalationTypesArray = Array.from(escalationTypes.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    avgRate: data.totalRate / data.count
  }));
  
  const avgEscalation = escalationTypesArray.reduce((sum, item) => sum + item.avgRate, 0) / escalationTypesArray.length || 2.5;
  
  // Calculate concession analysis
  const totalConcessions = tenants.reduce((sum, tenant) => {
    const freeRentValue = (tenant.freeRent?.months || 0) * (tenant.baseRentSchedule[0]?.monthlyRent || 0);
    const tiValue = tenant.tenantImprovement?.totalAllowance || 0;
    return sum + freeRentValue + tiValue;
  }, 0);
  
  const totalRentValue = tenants.reduce((sum, tenant) => {
    const leaseTermYears = tenant.baseRentSchedule.length > 0 ? 
      (new Date(tenant.expirationDate).getFullYear() - new Date(tenant.commencementDate).getFullYear()) : 5;
    return sum + (tenant.baseRentSchedule[0]?.annualRent || 0) * leaseTermYears;
  }, 0);
  
  const concessionRate = totalRentValue > 0 ? (totalConcessions / totalRentValue) * 100 : 0;
  const paybackPeriod = totalConcessions > 0 ? totalConcessions / (totalRentValue / 5) : 0;
  
  return {
    leaseValuation,
    escalationAnalysis: {
      avgEscalation: Number(avgEscalation.toFixed(2)),
      escalationTypes: escalationTypesArray,
      cpiExposure: Number(((cpiCount / tenants.length) * 100).toFixed(1)),
      fixedIncreases: Number(((fixedCount / tenants.length) * 100).toFixed(1))
    },
    concessionAnalysis: {
      totalConcessions,
      freeRentValue: tenants.reduce((sum, t) => sum + ((t.freeRent?.months || 0) * (t.baseRentSchedule[0]?.monthlyRent || 0)), 0),
      tiAllowances: tenants.reduce((sum, t) => sum + (t.tenantImprovement?.totalAllowance || 0), 0),
      concessionRate: Number(concessionRate.toFixed(2)),
      paybackPeriod: Number(paybackPeriod.toFixed(1))
    }
  };
}

export function analyzeBuildingOperations(
  building: BuildingOperations,
  _tenants: OfficeTenant[],
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
  // Calculate operational efficiency scores
  const energyEfficiency = calculateEnergyEfficiency(building, propertyAge);
  const waterEfficiency = calculateWaterEfficiency(building);
  const wasteEfficiency = calculateWasteEfficiency();
  const indoorEnvironment = calculateIndoorEnvironment(building);
  
  const overallScore = (energyEfficiency + waterEfficiency + wasteEfficiency + indoorEnvironment) / 4;
  
  // Analyze systems condition
  const systemsCondition = analyzeSystemsCondition(building, propertyAge);
  
  // Calculate expense analysis
  const totalExpenses = building.expenses?.reduce((sum, expense) => sum + expense.annual, 0) || 0;
  const expensePSF = totalSF > 0 ? totalExpenses / totalSF : 0;
  
  // Categorize expenses
  const controllableExpenses = building.expenses?.filter(e => 
    ['maintenance', 'utilities', 'management', 'marketing'].includes(e.category.toLowerCase())
  ).reduce((sum, e) => sum + e.annual, 0) || 0;
  
  const nonControllableExpenses = totalExpenses - controllableExpenses;
  
  return {
    operationalEfficiency: {
      overallScore: Number(overallScore.toFixed(1)),
      energyEfficiency: Number(energyEfficiency.toFixed(1)),
      waterEfficiency: Number(waterEfficiency.toFixed(1)),
      wasteEfficiency: Number(wasteEfficiency.toFixed(1)),
      indoorEnvironment: Number(indoorEnvironment.toFixed(1))
    },
    systemsCondition,
    expenseAnalysis: {
      totalExpenses,
      expensePSF: Number(expensePSF.toFixed(2)),
      controllable: controllableExpenses,
      nonControllable: nonControllableExpenses
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
  // Calculate market position based on competitive analysis
  const competitiveProps = market.competitiveProperties;
  const totalProperties = competitiveProps.length + 1; // Include subject property
  
  // Score property against competitors
  let propertyScore = 0;
  let betterThanCount = 0;
  
  // Occupancy comparison
  const avgOccupancy = competitiveProps.reduce((sum, prop) => sum + prop.occupancy, 0) / competitiveProps.length;
  if (property.occupancy > avgOccupancy) propertyScore += 25;
  else if (property.occupancy > avgOccupancy * 0.95) propertyScore += 15;
  else if (property.occupancy > avgOccupancy * 0.9) propertyScore += 5;
  
  // Rent comparison
  const avgRent = competitiveProps.reduce((sum, prop) => sum + prop.askingRent, 0) / competitiveProps.length;
  const rentPremium = ((property.avgRent - avgRent) / avgRent) * 100;
  if (rentPremium > 10) propertyScore += 30;
  else if (rentPremium > 5) propertyScore += 20;
  else if (rentPremium > 0) propertyScore += 10;
  
  // Building quality factors
  if (property.building.sustainability?.leedCertification) propertyScore += 20;
  if (property.building.sustainability?.energyStarCertified) propertyScore += 15;
  if (property.building.technology?.fiberOptic) propertyScore += 10;
  if (property.parkingRatio > 3) propertyScore += 10;
  
  // Count how many properties we're better than
  competitiveProps.forEach(comp => {
    let compScore = 0;
    if (comp.occupancy > avgOccupancy) compScore += 25;
    if (comp.askingRent > avgRent) compScore += 20;
    if (comp.amenities.includes('LEED')) compScore += 20;
    
    if (propertyScore > compScore) betterThanCount++;
  });
  
  const overallRank = betterThanCount + 1;
  const percentile = ((totalProperties - overallRank) / totalProperties) * 100;
  
  // Determine classification
  let classification: 'Market Leader' | 'Above Average' | 'Average' | 'Below Average';
  if (percentile >= 90) classification = 'Market Leader';
  else if (percentile >= 70) classification = 'Above Average';
  else if (percentile >= 40) classification = 'Average';
  else classification = 'Below Average';
  
  // Identify key differentiators
  const keyDifferentiators: string[] = [];
  if (property.building.sustainability?.leedCertification) keyDifferentiators.push('LEED Certification');
  if (property.building.sustainability?.energyStarCertified) keyDifferentiators.push('Energy Star Certified');
  if (property.building.technology?.fiberOptic) keyDifferentiators.push('Fiber Optic Infrastructure');
  if (property.occupancy > avgOccupancy * 1.1) keyDifferentiators.push('High Occupancy');
  if (property.parkingRatio > 4) keyDifferentiators.push('Abundant Parking');
  
  // Identify competitive weaknesses
  const competitiveWeaknesses: string[] = [];
  if (property.occupancy < avgOccupancy * 0.9) competitiveWeaknesses.push('Below Average Occupancy');
  if (property.avgRent < avgRent * 0.9) competitiveWeaknesses.push('Below Market Rent');
  if (!property.building.sustainability?.leedCertification) competitiveWeaknesses.push('No Green Certification');
  if (property.parkingRatio < 2) competitiveWeaknesses.push('Limited Parking');
  
  // Pricing analysis
  const askingVsMarket = ((property.avgRent - avgRent) / avgRent) * 100;
  const effectiveVsMarket = askingVsMarket - 3; // Assume 3% concession difference
  
  let pricingPower: 'Strong' | 'Moderate' | 'Weak';
  if (classification === 'Market Leader' && askingVsMarket > 5) pricingPower = 'Strong';
  else if (classification === 'Above Average' && askingVsMarket > 0) pricingPower = 'Moderate';
  else pricingPower = 'Weak';
  
  // Recommended strategy
  let recommendedStrategy: string;
  if (pricingPower === 'Strong') recommendedStrategy = 'Aggressive rent increases on renewals';
  else if (pricingPower === 'Moderate') recommendedStrategy = 'Selective rent increases with value-add improvements';
  else recommendedStrategy = 'Focus on occupancy retention and building improvements';
  
  // Target rent calculation
  const targetRent = pricingPower === 'Strong' ? avgRent * 1.15 : 
                    pricingPower === 'Moderate' ? avgRent * 1.05 : avgRent * 0.98;
  
  return {
    marketPosition: {
      overallRank,
      totalProperties,
      percentile: Number(percentile.toFixed(1)),
      classification,
      keyDifferentiators,
      competitiveWeaknesses
    },
    pricingAnalysis: {
      askingVsMarket: Number(askingVsMarket.toFixed(1)),
      effectiveVsMarket: Number(effectiveVsMarket.toFixed(1)),
      pricingPower,
      recommendedStrategy,
      targetRent: Number(targetRent.toFixed(2))
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
  
  // Tenant diversity scoring
  if (tenantCount > 15) score += 15; // Well-diversified
  else if (tenantCount > 10) score += 10; // Good diversity
  else if (tenantCount > 5) score += 5; // Moderate diversity
  else if (tenantCount <= 2) score -= 20; // High concentration risk
  
  // Floor plate efficiency scoring
  if (avgFloorPlate >= 25000) score += 15; // Large, efficient floor plates
  else if (avgFloorPlate >= 15000) score += 10; // Good floor plates
  else if (avgFloorPlate >= 10000) score += 5; // Adequate floor plates
  else score -= 10; // Small, inefficient floor plates
  
  return Math.max(0, Math.min(100, score));
}

// Helper functions for tenant financial analysis
function getCreditScore(rating?: string): number {
  const scoreMap: Record<string, number> = {
    'AAA': 100, 'AA': 95, 'A': 85, 'BBB': 75, 'BB': 65, 'B': 55, 'CCC': 45, 'D': 20, 'NR': 60
  };
  return scoreMap[rating || 'NR'] || 60;
}

function isInvestmentGrade(rating?: string): boolean {
  return ['AAA', 'AA', 'A', 'BBB'].includes(rating || '');
}

function getIndustryOutlookFromMarket(industry: string): 'Growing' | 'Stable' | 'Declining' {
  // Simplified industry outlook based on current market trends
  const growingIndustries = ['Technology', 'Healthcare', 'Professional Services', 'Financial Services'];
  const decliningIndustries = ['Traditional Retail', 'Print Media', 'Coal', 'Traditional Manufacturing'];
  
  if (growingIndustries.some(gi => industry.toLowerCase().includes(gi.toLowerCase()))) {
    return 'Growing';
  }
  if (decliningIndustries.some(di => industry.toLowerCase().includes(di.toLowerCase()))) {
    return 'Declining';
  }
  return 'Stable';
}

function calculateEmployeeDensity(tenant: OfficeTenant): number {
  const totalSF = tenant.suites.reduce((sum, suite) => sum + suite.usableSF, 0);
  const totalEmployees = tenant.suites.reduce((sum, suite) => sum + (suite.workstations + suite.privateOffices), 0);
  return totalSF > 0 ? totalSF / totalEmployees : 200; // Default 200 SF per employee
}

function calculateExpansionProbability(tenant: OfficeTenant): number {
  let probability = 50; // Base probability
  
  if (tenant.financialStrength === 'Strong') probability += 30;
  if (tenant.creditRating && ['AAA', 'AA', 'A'].includes(tenant.creditRating)) probability += 20;
  if (tenant.expansionOptions && tenant.expansionOptions.length > 0) probability += 25;
  
  return Math.min(100, probability);
}

function calculateDownsizingRisk(tenant: OfficeTenant): number {
  let risk = 20; // Base risk
  
  if (tenant.financialStrength === 'Weak') risk += 40;
  if (tenant.financialStrength === 'Watch') risk += 25;
  if (tenant.bankruptcyHistory && tenant.bankruptcyHistory.length > 0) risk += 30;
  
  return Math.min(100, risk);
}

function getPositiveIndicators(tenant: OfficeTenant): string[] {
  const indicators: string[] = [];
  
  if (tenant.financialStrength === 'Strong') indicators.push('Strong financial position');
  if (tenant.ticker) indicators.push('Publicly traded company');
  if (tenant.creditRating && ['AAA', 'AA', 'A'].includes(tenant.creditRating)) indicators.push('Investment grade credit');
  if (tenant.expansionOptions && tenant.expansionOptions.length > 0) indicators.push('Expansion options in lease');
  
  return indicators;
}

function getNegativeIndicators(tenant: OfficeTenant): string[] {
  const indicators: string[] = [];
  
  if (tenant.financialStrength === 'Weak') indicators.push('Weak financial position');
  if (tenant.bankruptcyHistory && tenant.bankruptcyHistory.length > 0) indicators.push('Previous bankruptcy');
  if (tenant.creditRating && ['B', 'CCC', 'D'].includes(tenant.creditRating)) indicators.push('Below investment grade');
  
  return indicators;
}

// Helper functions for building operations analysis
function calculateEnergyEfficiency(building: BuildingOperations, propertyAge: number): number {
  let efficiency = 70; // Base efficiency
  
  if (propertyAge < 5) efficiency += 20;
  else if (propertyAge < 15) efficiency += 10;
  else if (propertyAge > 30) efficiency -= 15;
  
  if (building.sustainability?.leedCertification) efficiency += 15;
  if (building.sustainability?.energyStarCertified) efficiency += 10;
  
  return Math.min(100, Math.max(0, efficiency));
}

function calculateWaterEfficiency(building: BuildingOperations): number {
  let efficiency = 75; // Base efficiency
  
  if (building.plumbing?.fixtures === 'Low Flow' || building.plumbing?.fixtures === 'Waterless') efficiency += 10;
  efficiency += 15; // Assume basic recycling capabilities
  efficiency += 10; // Assume basic monitoring capabilities
  
  return Math.min(100, Math.max(0, efficiency));
}

function calculateWasteEfficiency(): number {
  let efficiency = 65; // Base efficiency
  
  efficiency += 15; // Assume basic recycling program
  efficiency += 10; // Assume basic composting program
  efficiency += 10; // Assume basic waste reduction program
  
  return Math.min(100, Math.max(0, efficiency));
}

function calculateIndoorEnvironment(building: BuildingOperations): number {
  let score = 80; // Base score
  
  score += 10; // Assume good air quality for modern buildings
  score += 5; // Assume LED lighting for efficiency
  if (building.hvacSystems?.some(h => h.controls === 'Smart')) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function analyzeSystemsCondition(_building: BuildingOperations, propertyAge: number): any[] {
  const systems = [
    { name: 'HVAC', condition: propertyAge < 10 ? 'Good' : propertyAge < 20 ? 'Fair' : 'Poor' },
    { name: 'Electrical', condition: propertyAge < 15 ? 'Good' : propertyAge < 30 ? 'Fair' : 'Poor' },
    { name: 'Plumbing', condition: propertyAge < 20 ? 'Good' : propertyAge < 35 ? 'Fair' : 'Poor' },
    { name: 'Security', condition: 'Good' } // Assume modern security systems
  ];
  
  return systems;
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
  
  if (tenant.baseRentSchedule.length > 0) {
    const rentVsMarket = (tenant.baseRentSchedule[0]?.rentPSF || 0) / marketConditions.avgRent;
    if (rentVsMarket < 0.9) probability += 0.15;
    else if (rentVsMarket > 1.1) probability -= 0.15;
  }
  
  if (tenant.creditRating && ['AAA', 'AA', 'A'].includes(tenant.creditRating)) {
    probability += 0.1;
  }
  
  return Math.max(0.1, Math.min(0.95, probability));
} 