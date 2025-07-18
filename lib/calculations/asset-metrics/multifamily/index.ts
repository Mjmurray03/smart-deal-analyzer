// lib/calculations/asset-metrics/multifamily/index.ts
// Comprehensive multifamily property analytics for institutional investors

// Types are defined locally to avoid unused imports

// ==================== TYPE DEFINITIONS ====================

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

// ==================== REVENUE & OPERATIONS ANALYSIS ====================

/**
 * Comprehensive revenue and rent roll analysis
 */
export function analyzeRevenuePerformance(
  units: Unit[],
  marketComps: MarketComps[]
): {
  revenueMetrics: {
    grossPotentialRent: number;
    actualRent: number;
    lossToLease: number;
    vacancy: number;
    concessions: number;
    effectiveRent: number;
    otherIncome: number;
    totalRevenue: number;
  };
  unitPerformance: {
    revPAU: number; // Revenue per available unit
    revPOccU: number; // Revenue per occupied unit
    avgRentPSF: number;
    occupancy: number;
    economicOccupancy: number;
  };
  unitMixAnalysis: {
    unitType: string;
    count: number;
    occupancy: number;
    avgRent: number;
    avgMarketRent: number;
    lossToLease: number;
    revenuePSF: number;
    percentOfRevenue: number;
  }[];
  rentGrowthAnalysis: {
    renewalIncreases: number;
    newLeaseGrowth: number;
    blendedGrowth: number;
    trailingGrowth: number;
    marketRentGrowth: number;
  };
  concessionAnalysis: {
    unitsWithConcessions: number;
    avgConcessionValue: number;
    concessionRate: number;
    netEffectiveRent: number;
    concessionTrend: 'Increasing' | 'Stable' | 'Decreasing';
  };
  otherIncomeAnalysis: {
    category: string;
    monthlyAmount: number;
    perUnitAmount: number;
    percentOfRevenue: number;
    growthPotential: number;
  }[];
} {
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.occupied);
  const occupancy = occupiedUnits.length / totalUnits;
  
  // Revenue calculations
  const grossPotentialRent = units.reduce((sum, u) => sum + u.marketRent * 12, 0);
  const actualRent = occupiedUnits.reduce((sum, u) => sum + u.currentRent * 12, 0);
  const lossToLease = occupiedUnits.reduce((sum, u) => 
    sum + Math.max(0, (u.marketRent - u.currentRent) * 12), 0
  );
  
  const vacancyLoss = units.filter(u => !u.occupied)
    .reduce((sum, u) => sum + u.marketRent * 12, 0);
  
  const concessionTotal = occupiedUnits
    .filter(u => u.concessions)
    .reduce((sum, u) => {
      const monthly = (u.concessions?.amount || 0) / (u.concessions?.months || 1);
      return sum + monthly * 12;
    }, 0);
  
  const effectiveRent = actualRent - concessionTotal;
  
  // Other income
  const otherIncomeTotal = occupiedUnits.reduce((sum, u) => {
    if (!u.otherIncome) return sum;
    const unitOther = Object.values(u.otherIncome).reduce((s, v) => s + (v || 0), 0);
    return sum + unitOther * 12;
  }, 0);
  
  const totalRevenue = effectiveRent + otherIncomeTotal;
  
  // Unit performance metrics
  const revPAU = totalRevenue / totalUnits / 12;
  const revPOccU = totalRevenue / occupiedUnits.length / 12;
  const totalSF = units.reduce((sum, u) => sum + u.squareFootage, 0);
  const avgRentPSF = actualRent / 12 / totalSF;
  const economicOccupancy = effectiveRent / grossPotentialRent;
  
  // Unit mix analysis
  const unitTypes = ['Studio', '1BR', '2BR', '3BR'];
  const unitMixAnalysis = unitTypes.map(type => {
    const typeUnits = units.filter(u => {
      if (type === '1BR') return u.unitType === '1BR';
      if (type === '2BR') return u.unitType === '2BR';
      if (type === '3BR') return u.unitType === '3BR' || u.unitType === '4BR';
      return u.unitType === 'Studio';
    });
    
    if (typeUnits.length === 0) return null;
    
    const occupied = typeUnits.filter(u => u.occupied);
    const typeOccupancy = occupied.length / typeUnits.length;
    const avgRent = occupied.reduce((sum, u) => sum + u.currentRent, 0) / (occupied.length || 1);
    const avgMarketRent = typeUnits.reduce((sum, u) => sum + u.marketRent, 0) / typeUnits.length;
    const typeLTL = occupied.reduce((sum, u) => 
      sum + Math.max(0, u.marketRent - u.currentRent), 0
    );
    const typeSF = typeUnits.reduce((sum, u) => sum + u.squareFootage, 0);
    const typeRevenue = occupied.reduce((sum, u) => sum + u.currentRent * 12, 0);
    
    return {
      unitType: type,
      count: typeUnits.length,
      occupancy: Number((typeOccupancy * 100).toFixed(1)),
      avgRent: Math.round(avgRent),
      avgMarketRent: Math.round(avgMarketRent),
      lossToLease: Math.round(typeLTL),
      revenuePSF: Number((typeRevenue / typeSF).toFixed(2)),
      percentOfRevenue: Number((typeRevenue / actualRent * 100).toFixed(1))
    };
  }).filter((analysis): analysis is NonNullable<typeof analysis> => analysis !== null);
  
  // Rent growth analysis (simplified - would need historical data)
  const renewalIncreases = 3.5; // Assumed
  const newLeaseGrowth = 5.0; // Assumed
  const blendedGrowth = renewalIncreases * 0.7 + newLeaseGrowth * 0.3;
  const trailingGrowth = 4.0; // Assumed
  
  // Market rent growth from comps
  const avgCompRentPSF = marketComps.reduce((sum, c) => sum + c.avgRentPSF, 0) / marketComps.length;
  const marketRentGrowth = ((avgRentPSF - avgCompRentPSF) / avgCompRentPSF) * 100;
  
  // Concession analysis
  const unitsWithConcessions = occupiedUnits.filter(u => u.concessions).length;
  const totalConcessionValue = occupiedUnits
    .filter(u => u.concessions)
    .reduce((sum, u) => sum + (u.concessions?.amount || 0), 0);
  const avgConcessionValue = unitsWithConcessions > 0 ? 
    totalConcessionValue / unitsWithConcessions : 0;
  const concessionRate = (unitsWithConcessions / occupiedUnits.length) * 100;
  const netEffectiveRent = actualRent - concessionTotal;
  
  // Determine concession trend (simplified)
  const marketConcessionRate = marketComps.filter(c => c.concessionOffered).length / marketComps.length * 100;
  const concessionTrend = concessionRate > marketConcessionRate * 1.2 ? 'Increasing' :
                         concessionRate < marketConcessionRate * 0.8 ? 'Decreasing' : 'Stable';
  
  // Other income analysis
  const otherIncomeCategories = ['parking', 'storage', 'pet', 'utilities'];
  const otherIncomeAnalysis = otherIncomeCategories.map(category => {
    const categoryIncome = occupiedUnits.reduce((sum, u) => {
      if (!u.otherIncome) return sum;
      const income = u.otherIncome as Record<string, number>;
      return sum + (income[category] || 0);
    }, 0);
    
    const monthlyAmount = categoryIncome;
    const perUnitAmount = categoryIncome / occupiedUnits.length;
    const percentOfRevenue = (categoryIncome * 12 / totalRevenue) * 100;
    
    // Growth potential based on market and current penetration
    const penetration = occupiedUnits.filter(u => {
      if (!u.otherIncome) return false;
      const income = u.otherIncome as Record<string, number>;
      return (income[category] || 0) > 0;
    }).length / occupiedUnits.length;
    
    const growthPotential = (1 - penetration) * 50; // Max 50% growth if 0% penetration
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      monthlyAmount,
      perUnitAmount: Number(perUnitAmount.toFixed(2)),
      percentOfRevenue: Number(percentOfRevenue.toFixed(2)),
      growthPotential: Number(growthPotential.toFixed(1))
    };
  });
  
  return {
    revenueMetrics: {
      grossPotentialRent,
      actualRent,
      lossToLease,
      vacancy: vacancyLoss,
      concessions: concessionTotal,
      effectiveRent,
      otherIncome: otherIncomeTotal,
      totalRevenue
    },
    unitPerformance: {
      revPAU: Number(revPAU.toFixed(2)),
      revPOccU: Number(revPOccU.toFixed(2)),
      avgRentPSF: Number(avgRentPSF.toFixed(2)),
      occupancy: Number((occupancy * 100).toFixed(1)),
      economicOccupancy: Number((economicOccupancy * 100).toFixed(1))
    },
    unitMixAnalysis,
    rentGrowthAnalysis: {
      renewalIncreases: Number(renewalIncreases.toFixed(1)),
      newLeaseGrowth: Number(newLeaseGrowth.toFixed(1)),
      blendedGrowth: Number(blendedGrowth.toFixed(1)),
      trailingGrowth: Number(trailingGrowth.toFixed(1)),
      marketRentGrowth: Number(marketRentGrowth.toFixed(1))
    },
    concessionAnalysis: {
      unitsWithConcessions,
      avgConcessionValue: Math.round(avgConcessionValue),
      concessionRate: Number(concessionRate.toFixed(1)),
      netEffectiveRent,
      concessionTrend
    },
    otherIncomeAnalysis
  };
}

/**
 * Operations and expense analysis
 */
export function analyzeOperatingPerformance(
  units: Unit[],
  expenses: {
    taxes: number;
    insurance: number;
    utilities: number;
    payroll: number;
    maintenance: number;
    management: number;
    marketing: number;
    administrative: number;
    other: number;
  },
  maintenanceLog: {
    date: Date;
    unit?: string;
    type: 'Routine' | 'Emergency' | 'Turnover' | 'Capital';
    category: string;
    cost: number;
    vendor: string;
  }[],
  staffing: {
    role: string;
    count: number;
    avgSalary: number;
    turnoverRate: number;
  }[]
): {
  expenseMetrics: {
    totalExpenses: number;
    expenseRatio: number;
    perUnitExpenses: number;
    expensePSF: number;
    controllableRatio: number;
  };
  expenseBreakdown: {
    category: string;
    amount: number;
    perUnit: number;
    percentOfTotal: number;
    benchmark: number;
    variance: number;
  }[];
  maintenanceAnalysis: {
    totalMaintenanceCost: number;
    routinePercentage: number;
    emergencyPercentage: number;
    turnoverCost: number;
    avgTurnoverCost: number;
    maintenancePerUnit: number;
    responseTime: number; // hours
    preventiveRatio: number;
  };
  staffingEfficiency: {
    unitsPerEmployee: number;
    payrollPerUnit: number;
    staffTurnover: number;
    overtimePercentage: number;
    productivity: {
      role: string;
      metric: string;
      value: number;
      benchmark: number;
    }[];
  };
  operationalKPIs: {
    metric: string;
    value: number;
    target: number;
    status: 'On Track' | 'Needs Attention' | 'Critical';
  }[];
} {
  const totalUnits = units.length;
  const totalSF = units.reduce((sum, u) => sum + u.squareFootage, 0);
  const occupiedUnits = units.filter(u => u.occupied).length;
  
  // Calculate total expenses
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const revenue = units.filter(u => u.occupied)
    .reduce((sum, u) => sum + u.currentRent * 12, 0);
  const expenseRatio = (totalExpenses / revenue) * 100;
  const perUnitExpenses = totalExpenses / totalUnits;
  const expensePSF = totalExpenses / totalSF;
  
  // Controllable vs non-controllable
  const nonControllable = expenses.taxes + expenses.insurance;
  const controllable = totalExpenses - nonControllable;
  const controllableRatio = (controllable / totalExpenses) * 100;
  
  // Expense breakdown with benchmarks
  const benchmarks: Record<string, number> = {
    taxes: 0.15, // 15% of expenses
    insurance: 0.08,
    utilities: 0.12,
    payroll: 0.20,
    maintenance: 0.15,
    management: 0.10,
    marketing: 0.05,
    administrative: 0.10,
    other: 0.05
  };
  
  const expenseBreakdown = Object.entries(expenses).map(([category, amount]) => {
    const percentOfTotal = (amount / totalExpenses) * 100;
    const benchmark = (benchmarks[category] || 0) * 100;
    const variance = benchmark > 0 ? ((percentOfTotal - benchmark) / benchmark) * 100 : 0;
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount,
      perUnit: amount / totalUnits,
      percentOfTotal: Number(percentOfTotal.toFixed(1)),
      benchmark: Number(benchmark.toFixed(1)),
      variance: Number(variance.toFixed(1))
    };
  }).sort((a, b) => b.amount - a.amount);
  
  // Maintenance analysis
  const currentYear = new Date().getFullYear();
  const currentYearMaintenance = maintenanceLog.filter(m => 
    m.date.getFullYear() === currentYear
  );
  
  const totalMaintenanceCost = currentYearMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const routineCost = currentYearMaintenance
    .filter(m => m.type === 'Routine')
    .reduce((sum, m) => sum + m.cost, 0);
  const emergencyCost = currentYearMaintenance
    .filter(m => m.type === 'Emergency')
    .reduce((sum, m) => sum + m.cost, 0);
  const turnoverCost = currentYearMaintenance
    .filter(m => m.type === 'Turnover')
    .reduce((sum, m) => sum + m.cost, 0);
  
  const routinePercentage = (routineCost / totalMaintenanceCost) * 100;
  const emergencyPercentage = (emergencyCost / totalMaintenanceCost) * 100;
  
  const turnovers = currentYearMaintenance.filter(m => m.type === 'Turnover').length;
  const avgTurnoverCost = turnovers > 0 ? turnoverCost / turnovers : 0;
  const maintenancePerUnit = totalMaintenanceCost / totalUnits;
  
  // Response time (simplified - would need actual ticket data)
  const responseTime = 4; // hours average
  const preventiveRatio = routinePercentage;
  
  // Staffing efficiency
  const totalStaff = staffing.reduce((sum, s) => sum + s.count, 0);
  const unitsPerEmployee = totalUnits / totalStaff;
  const totalPayroll = staffing.reduce((sum, s) => sum + s.count * s.avgSalary, 0);
  const payrollPerUnit = totalPayroll / totalUnits;
  const avgTurnover = staffing.reduce((sum, s) => sum + s.turnoverRate * s.count, 0) / totalStaff;
  
  // Overtime (estimated)
  const overtimePercentage = 5; // Assumed 5%
  
  // Productivity metrics
  const productivity = [
    {
      role: 'Maintenance',
      metric: 'Work orders per tech per month',
      value: 45,
      benchmark: 50
    },
    {
      role: 'Leasing',
      metric: 'Leases per agent per month',
      value: 8,
      benchmark: 10
    },
    {
      role: 'Management',
      metric: 'Units per manager',
      value: unitsPerEmployee * 3, // Assuming 1/3 are management
      benchmark: 150
    }
  ];
  
  // Operational KPIs
  const occupancyRate = Number(((occupiedUnits / totalUnits) * 100).toFixed(1));
  const marketRentGrowth = 3; // Default value, should be passed as parameter
  const expenseRatioValue = Number((expenseRatio * 100).toFixed(1));
  
  const operationalKPIs: {
    metric: string;
    value: number;
    target: number;
    status: 'On Track' | 'Needs Attention' | 'Critical';
  }[] = [
    {
      metric: 'Occupancy Rate',
      value: occupancyRate,
      target: 95,
      status: occupancyRate >= 95 ? 'On Track' : occupancyRate >= 90 ? 'Needs Attention' : 'Critical'
    },
    {
      metric: 'Rent Growth',
      value: marketRentGrowth,
      target: 3,
      status: marketRentGrowth >= 3 ? 'On Track' : marketRentGrowth >= 1 ? 'Needs Attention' : 'Critical'
    },
    {
      metric: 'Expense Ratio',
      value: expenseRatioValue,
      target: 35,
      status: expenseRatioValue <= 35 ? 'On Track' : expenseRatioValue <= 40 ? 'Needs Attention' : 'Critical'
    }
  ];
  
  return {
    expenseMetrics: {
      totalExpenses,
      expenseRatio: Number(expenseRatio.toFixed(1)),
      perUnitExpenses: Math.round(perUnitExpenses),
      expensePSF: Number(expensePSF.toFixed(2)),
      controllableRatio: Number(controllableRatio.toFixed(1))
    },
    expenseBreakdown,
    maintenanceAnalysis: {
      totalMaintenanceCost,
      routinePercentage: Number(routinePercentage.toFixed(1)),
      emergencyPercentage: Number(emergencyPercentage.toFixed(1)),
      turnoverCost,
      avgTurnoverCost: Math.round(avgTurnoverCost),
      maintenancePerUnit: Math.round(maintenancePerUnit),
      responseTime,
      preventiveRatio: Number(preventiveRatio.toFixed(1))
    },
    staffingEfficiency: {
      unitsPerEmployee: Number(unitsPerEmployee.toFixed(1)),
      payrollPerUnit: Math.round(payrollPerUnit),
      staffTurnover: Number(avgTurnover.toFixed(1)),
      overtimePercentage,
      productivity
    },
    operationalKPIs
  };
}

// ==================== MARKET & COMPETITIVE ANALYSIS ====================

/**
 * Market positioning and competitive analysis
 */
export function analyzeMarketPosition(
  property: {
    units: Unit[];
    amenities: PropertyAmenities;
    yearBuilt: number;
    lastRenovation?: number;
    location: {
      walkScore: number;
      transitScore: number;
      schoolRating: number;
      crimeIndex: number; // lower is better
    };
  },
  marketComps: MarketComps[],
  submarket: {
    avgOccupancy: number;
    avgRentGrowth: number;
    newSupplyUnits: number;
    population: number;
    medianIncome: number;
    rentToIncomeRatio: number;
  }
): {
  competitivePosition: {
    marketRank: number; // out of comp set
    rentPremiumDiscount: number; // vs market
    occupancyOutperformance: number;
    amenityScore: number;
    overallRating: 'Leader' | 'Competitive' | 'Follower' | 'Laggard';
  };
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pricingPower: {
    score: number; // 0-100
    indicators: string[];
    recommendedStrategy: string;
    maxRentIncrease: number; // percentage
  };
  amenityGapAnalysis: {
    amenity: string;
    marketAdoption: number; // percentage of comps
    hasAmenity: boolean;
    additionCost?: number;
    rentPremium?: number;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  demographicAlignment: {
    targetResident: string;
    alignmentScore: number;
    mismatches: string[];
    recommendations: string[];
  };
} {
  const totalUnits = property.units.length;
  const occupiedUnits = property.units.filter(u => u.occupied);
  const occupiedUnitsCount = occupiedUnits.length;
  const propertyOccupancy = (occupiedUnitsCount / totalUnits) * 100;
  const avgRent = occupiedUnitsCount > 0 ? 
    occupiedUnits.reduce((sum, u) => sum + u.currentRent, 0) / occupiedUnitsCount : 0;
  const totalSF = property.units.reduce((sum, u) => sum + u.squareFootage, 0);
  const avgRentPSF = avgRent / (totalSF / totalUnits);
  
  // Calculate market averages
  const marketAvgRentPSF = marketComps.reduce((sum, c) => sum + c.avgRentPSF, 0) / marketComps.length;
  const marketAvgOccupancy = marketComps.reduce((sum, c) => sum + c.occupancy, 0) / marketComps.length;
  
  // Competitive position
  const rentPremiumDiscount = ((avgRentPSF - marketAvgRentPSF) / marketAvgRentPSF) * 100;
  const occupancyOutperformance = propertyOccupancy - marketAvgOccupancy;
  
  // Amenity scoring
  const amenityScore = calculateAmenityScore(property.amenities);
  const marketAvgAmenityScore = marketComps.reduce((sum, c) => sum + c.amenityScore, 0) / marketComps.length;
  
  // Market rank (simplified)
  const propertyScore = avgRentPSF * 0.4 + propertyOccupancy * 0.3 + amenityScore * 0.3;
  const compScores = marketComps.map(c => c.avgRentPSF * 0.4 + c.occupancy * 0.3 + c.amenityScore * 0.3);
  const marketRank = compScores.filter(score => score > propertyScore).length + 1;
  
  // Overall rating
  let overallRating: 'Leader' | 'Competitive' | 'Follower' | 'Laggard';
  if (marketRank <= marketComps.length * 0.25) overallRating = 'Leader';
  else if (marketRank <= marketComps.length * 0.5) overallRating = 'Competitive';
  else if (marketRank <= marketComps.length * 0.75) overallRating = 'Follower';
  else overallRating = 'Laggard';
  
  // SWOT Analysis
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];
  
  // Strengths
  if (propertyOccupancy > 95) strengths.push('High occupancy');
  if (rentPremiumDiscount > 5) strengths.push('Premium rent achievement');
  if (property.location.walkScore > 80) strengths.push('Excellent walkability');
  if (property.location.transitScore > 70) strengths.push('Strong transit access');
  if (amenityScore > marketAvgAmenityScore) strengths.push('Superior amenity package');
  if (property.lastRenovation && new Date().getFullYear() - property.lastRenovation < 5) {
    strengths.push('Recently renovated');
  }
  
  // Weaknesses
  if (propertyOccupancy < 90) weaknesses.push('Below-market occupancy');
  if (rentPremiumDiscount < -5) weaknesses.push('Below-market rents');
  if (new Date().getFullYear() - property.yearBuilt > 20 && !property.lastRenovation) {
    weaknesses.push('Dated property');
  }
  if (property.location.crimeIndex > 50) weaknesses.push('Safety concerns');
  if (amenityScore < marketAvgAmenityScore * 0.8) weaknesses.push('Inferior amenity package');
  
  // Opportunities
  const unitsNotRenovated = property.units.filter(u => !u.renovated).length;
  if (unitsNotRenovated > totalUnits * 0.3) opportunities.push('Unit renovation program');
  if (rentPremiumDiscount < 0) opportunities.push('Rent growth potential');
  if (!property.amenities.smartHome) opportunities.push('Smart home technology adoption');
  if (!property.amenities.packageLockers) opportunities.push('Package management solution');
  
  // Threats
  if (submarket.newSupplyUnits > submarket.population * 0.02) threats.push('Significant new supply');
  if (submarket.rentToIncomeRatio > 0.35) threats.push('Affordability pressure');
  if (marketComps.filter(c => c.renovated).length > marketComps.length * 0.5) {
    threats.push('Competitor renovations');
  }
  const concessionRate = marketComps.filter(c => c.concessionOffered).length / marketComps.length;
  if (concessionRate > 0.5) threats.push('Market-wide concessions');
  
  // Pricing power analysis
  let pricingScore = 50; // Base
  const pricingIndicators: string[] = [];
  
  if (propertyOccupancy > 95) {
    pricingScore += 20;
    pricingIndicators.push('High occupancy supports increases');
  }
  if (rentPremiumDiscount < -5) {
    pricingScore += 15;
    pricingIndicators.push('Below-market rents');
  }
  if (property.location.walkScore > 80) {
    pricingScore += 10;
    pricingIndicators.push('Premium location');
  }
  if (submarket.avgRentGrowth > 3) {
    pricingScore += 10;
    pricingIndicators.push('Strong market rent growth');
  }
  if (concessionRate > 0.5) {
    pricingScore -= 15;
    pricingIndicators.push('High market concessions');
  }
  if (submarket.newSupplyUnits > submarket.population * 0.02) {
    pricingScore -= 10;
    pricingIndicators.push('New supply pressure');
  }
  
  pricingScore = Math.max(0, Math.min(100, pricingScore));
  
  // Pricing strategy
  let recommendedStrategy = '';
  let maxRentIncrease = 0;
  
  if (pricingScore >= 80) {
    recommendedStrategy = 'Aggressive rent growth - push 5-7% on renewals';
    maxRentIncrease = 7;
  } else if (pricingScore >= 60) {
    recommendedStrategy = 'Moderate growth - target 3-5% increases';
    maxRentIncrease = 5;
  } else if (pricingScore >= 40) {
    recommendedStrategy = 'Conservative approach - 2-3% increases';
    maxRentIncrease = 3;
  } else {
    recommendedStrategy = 'Focus on occupancy - minimal increases';
    maxRentIncrease = 2;
  }
  
  // Amenity gap analysis
  const amenityChecklist = [
    { key: 'pool', name: 'Swimming Pool', cost: 250000, premium: 15 },
    { key: 'fitness', name: 'Fitness Center', cost: 100000, premium: 20 },
    { key: 'clubhouse', name: 'Clubhouse', cost: 150000, premium: 10 },
    { key: 'dogPark', name: 'Dog Park', cost: 50000, premium: 15 },
    { key: 'packageLockers', name: 'Package Lockers', cost: 30000, premium: 10 },
    { key: 'smartHome', name: 'Smart Home Features', cost: 1000, premium: 25 }, // per unit
    { key: 'evCharging', name: 'EV Charging', cost: 10000, premium: 5 }, // per station
    { key: 'valet', name: 'Valet Trash', cost: 0, premium: 20 } // service contract
  ];
  
  const amenityGapAnalysis = amenityChecklist.map(amenity => {
    const hasAmenity = Boolean((property.amenities as unknown as Record<string, unknown>)?.[amenity.key]);
    const marketAdoption = marketComps.filter(c => {
      // Simplified - would need actual amenity data for comps
      return c.amenityScore > 70; // Assume high-scoring comps have it
    }).length / marketComps.length * 100;
    
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (!hasAmenity && marketAdoption > 70) priority = 'High';
    else if (!hasAmenity && marketAdoption > 40) priority = 'Medium';
    
    const result: {
      amenity: string;
      marketAdoption: number;
      hasAmenity: boolean;
      additionCost?: number;
      rentPremium?: number;
      priority: 'High' | 'Medium' | 'Low';
    } = {
      amenity: amenity.name,
      marketAdoption,
      hasAmenity,
      priority
    };
    
    if (!hasAmenity) {
      result.additionCost = amenity.cost;
      result.rentPremium = amenity.premium;
    }
    
    return result;
  });
  
  // Demographic alignment
  const avgIncome = property.units.filter(u => u.occupied)
    .reduce((sum, u) => sum + u.currentRent * 12 * 3, 0) / occupiedUnits.length; // 3x rent rule
  
  let targetResident = '';
  let alignmentScore = 70; // Base
  const mismatches: string[] = [];
  const recommendations: string[] = [];
  
  if (avgIncome > submarket.medianIncome * 1.5) {
    targetResident = 'Young Professionals';
    if (!property.amenities.fitness) {
      mismatches.push('No fitness center for active demographic');
      recommendations.push('Add fitness center');
      alignmentScore -= 10;
    }
    if (!property.amenities.smartHome) {
      mismatches.push('No smart home features');
      recommendations.push('Implement smart home technology');
      alignmentScore -= 10;
    }
  } else if (avgIncome > submarket.medianIncome * 0.8) {
    targetResident = 'Middle Income Families';
    if (!property.amenities.playground) {
      mismatches.push('No playground for families');
      recommendations.push('Add playground');
      alignmentScore -= 10;
    }
    if (property.location.schoolRating < 7) {
      mismatches.push('Below-average schools');
      alignmentScore -= 15;
    }
  } else {
    targetResident = 'Value-Conscious Renters';
    if (property.amenities.valet || property.amenities.concierge) {
      mismatches.push('Luxury amenities increase costs');
      recommendations.push('Focus on essential amenities only');
      alignmentScore -= 5;
    }
  }
  
  return {
    competitivePosition: {
      marketRank,
      rentPremiumDiscount: Number(rentPremiumDiscount.toFixed(2)),
      occupancyOutperformance: Number(occupancyOutperformance.toFixed(2)),
      amenityScore: Number(amenityScore.toFixed(1)),
      overallRating
    },
    strengthsWeaknesses: {
      strengths,
      weaknesses,
      opportunities,
      threats
    },
    pricingPower: {
      score: pricingScore,
      indicators: pricingIndicators,
      recommendedStrategy,
      maxRentIncrease
    },
    amenityGapAnalysis: amenityGapAnalysis.sort((a, b) => {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    demographicAlignment: {
      targetResident,
      alignmentScore,
      mismatches,
      recommendations
    }
  };
}

// ==================== VALUE-ADD & RENOVATION ANALYSIS ====================

/**
 * Value-add and renovation opportunity analysis
 */
export function analyzeValueAddPotential(
  units: Unit[],
  currentNOI: number,
  marketComps: MarketComps[],
  renovationCosts: {
    classic: { perUnit: number; scope: string };
    premium: { perUnit: number; scope: string };
    luxury: { perUnit: number; scope: string };
  },
  capRate: number
): {
  renovationROI: {
    scenario: string;
    totalCost: number;
    unitsToRenovate: number;
    avgRentIncrease: number;
    incrementalNOI: number;
    valueCreated: number;
    roi: number;
    paybackYears: number;
  }[];
  phasedApproach: {
    phase: number;
    units: number;
    investment: number;
    timeline: string;
    expectedNOI: number;
  }[];
  marketSupport: {
    renovatedComps: number;
    avgPremium: number;
    demandIndicators: string[];
    riskFactors: string[];
  };
  financingConsiderations: {
    option: string;
    structure: string;
    pros: string[];
    cons: string[];
  }[];
  executionPlan: {
    step: string;
    timeline: string;
    criticalFactors: string[];
    mitigation: string[];
  }[];
} {
  const unRenovatedUnits = units.filter(u => !u.renovated);
  
  // Calculate current metrics
  const avgUnrenovatedRent = unRenovatedUnits.length > 0 ?
    unRenovatedUnits.filter(u => u.occupied).reduce((sum, u) => sum + u.currentRent, 0) / 
    unRenovatedUnits.filter(u => u.occupied).length : 0;
  

  
  // Market support analysis
  const renovatedComps = marketComps.filter(c => c.renovated).length;
  const renovatedCompAvgRent = renovatedComps > 0 ?
    marketComps.filter(c => c.renovated).reduce((sum, c) => sum + c.avgRentPSF, 0) / renovatedComps : 0;
  const unRenovatedCompAvgRent = marketComps.filter(c => !c.renovated).length > 0 ?
    marketComps.filter(c => !c.renovated).reduce((sum, c) => sum + c.avgRentPSF, 0) / 
    marketComps.filter(c => !c.renovated).length : 0;
  
  const marketPremium = unRenovatedCompAvgRent > 0 ?
    ((renovatedCompAvgRent - unRenovatedCompAvgRent) / unRenovatedCompAvgRent) * 100 : 20;
  
  // ROI scenarios
  const scenarios = [
    { name: 'Classic', costs: renovationCosts.classic, premium: marketPremium * 0.6 },
    { name: 'Premium', costs: renovationCosts.premium, premium: marketPremium * 0.8 },
    { name: 'Luxury', costs: renovationCosts.luxury, premium: marketPremium * 1.0 }
  ];
  
  const renovationROI = scenarios.map(scenario => {
    const unitsToRenovate = unRenovatedUnits.length;
    const totalCost = unitsToRenovate * scenario.costs.perUnit;
    const avgRentIncrease = avgUnrenovatedRent * (scenario.premium / 100);
    const incrementalNOI = avgRentIncrease * unitsToRenovate * 12 * 0.95; // 95% collection
    const valueCreated = incrementalNOI / capRate;
    const roi = ((valueCreated - totalCost) / totalCost) * 100;
    const paybackYears = totalCost / incrementalNOI;
    
    return {
      scenario: scenario.name,
      totalCost,
      unitsToRenovate,
      avgRentIncrease: Math.round(avgRentIncrease),
      incrementalNOI: Math.round(incrementalNOI),
      valueCreated: Math.round(valueCreated),
      roi: Number(roi.toFixed(1)),
      paybackYears: Number(paybackYears.toFixed(1))
    };
  });
  
  // Phased approach (using Premium scenario)
  const premiumScenario = renovationROI.find(r => r.scenario === 'Premium');
  if (!premiumScenario) throw new Error('Premium scenario not found');
  const unitsPerPhase = Math.ceil(unRenovatedUnits.length / 3);
  
  const phasedApproach = [1, 2, 3].map(phase => {
    const phaseUnits = phase < 3 ? unitsPerPhase : unRenovatedUnits.length - (unitsPerPhase * 2);
    const phaseInvestment = phaseUnits * renovationCosts.premium.perUnit;
    const completedUnits = unitsPerPhase * phase;
    const phaseNOI = currentNOI + (premiumScenario.avgRentIncrease * completedUnits * 12 * 0.95);
    
    return {
      phase,
      units: phaseUnits,
      investment: phaseInvestment,
      timeline: `Months ${(phase - 1) * 6 + 1}-${phase * 6}`,
      expectedNOI: Math.round(phaseNOI)
    };
  });
  
  // Market support
  const demandIndicators: string[] = [];
  const riskFactors: string[] = [];
  
  if (renovatedComps / marketComps.length > 0.5) {
    demandIndicators.push('Majority of comps are renovated');
  }
  if (marketPremium > 15) {
    demandIndicators.push(`Strong ${marketPremium.toFixed(0)}% renovation premium`);
  }
  if (units.filter(u => u.occupied).length / units.length > 0.95) {
    demandIndicators.push('High occupancy supports renovation');
  }
  
  if (marketComps.some(c => c.concessionOffered)) {
    riskFactors.push('Market concessions may limit rent growth');
  }
  if (unRenovatedUnits.length < units.length * 0.3) {
    riskFactors.push('Limited units remaining to renovate');
  }
  
  // Financing considerations
  const financingConsiderations = [
    {
      option: 'Cash/Existing Reserves',
      structure: 'Self-fund from operations',
      pros: ['No financing costs', 'Quick execution', 'Full control'],
      cons: ['Depletes reserves', 'Opportunity cost', 'Limited scale']
    },
    {
      option: 'Supplemental Loan',
      structure: 'Add to existing mortgage',
      pros: ['Preserve cash', 'Tax deductible interest', 'Single payment'],
      cons: ['Increases leverage', 'May require lender approval', 'Higher LTV']
    },
    {
      option: 'Construction Line',
      structure: 'Draw as needed for renovations',
      pros: ['Pay only for what you use', 'Flexible timing', 'Interest-only period'],
      cons: ['Variable rate risk', 'Requires conversion', 'Fees']
    },
    {
      option: 'Preferred Equity',
      structure: 'JV partner funds renovation',
      pros: ['No additional debt', 'Partner expertise', 'Larger scale possible'],
      cons: ['Dilutes ownership', 'Higher cost of capital', 'Less control']
    }
  ];
  
  // Execution plan
  const executionPlan = [
    {
      step: 'Pre-Development',
      timeline: 'Months 1-2',
      criticalFactors: ['Finalize scope and budget', 'Secure financing', 'Contractor selection'],
      mitigation: ['Get multiple bids', 'Include contingency', 'Check references']
    },
    {
      step: 'Pilot Program',
      timeline: 'Months 3-4',
      criticalFactors: ['Test 2-3 units', 'Refine scope', 'Gauge market response'],
      mitigation: ['A/B test finishes', 'Survey residents', 'Monitor leasing']
    },
    {
      step: 'Full Rollout',
      timeline: 'Months 5-18',
      criticalFactors: ['Minimize disruption', 'Maintain occupancy', 'Quality control'],
      mitigation: ['Phase by building', 'Temporary relocations', 'Daily inspections']
    },
    {
      step: 'Stabilization',
      timeline: 'Months 19-24',
      criticalFactors: ['Achieve target rents', 'Maintain occupancy', 'Control expenses'],
      mitigation: ['Gradual increases', 'Marketing push', 'Retention incentives']
    }
  ];
  
  return {
    renovationROI: renovationROI.sort((a, b) => b.roi - a.roi),
    phasedApproach,
    marketSupport: {
      renovatedComps,
      avgPremium: Number(marketPremium.toFixed(1)),
      demandIndicators,
      riskFactors
    },
    financingConsiderations,
    executionPlan
  };
}

// ==================== HELPER FUNCTIONS ====================

function calculateAmenityScore(amenities: PropertyAmenities): number {
  let score = 0;
  const weights = {
    // High-value amenities
    pool: 8,
    fitness: 8,
    smartHome: 10,
    packageLockers: 7,
    evCharging: 6,
    
    // Medium-value amenities
    clubhouse: 5,
    businessCenter: 4,
    dogPark: 5,
    concierge: 5,
    valet: 4,
    
    // Basic amenities
    gatedParking: 3,
    coveredParking: 3,
    bbqArea: 2,
    playground: 3,
    
    // Utility features
    centralHVAC: 4,
    highSpeedInternet: 4,
    keylessEntry: 3,
    trashValet: 3
  };
  
  Object.entries(weights).forEach(([amenity, weight]) => {
    if ((amenities as unknown as Record<string, unknown>)?.[amenity]) {
      score += weight;
    }
  });
  
  // Parking ratio bonus
  if (amenities.parkingRatio >= 1.5) score += 5;
  else if (amenities.parkingRatio >= 1.0) score += 3;
  
  // Normalize to 100
  const maxScore = Object.values(weights).reduce((sum, w) => sum + w, 0) + 5;
  return (score / maxScore) * 100;
}