// lib/calculations/asset-metrics/retail/index.ts
// Comprehensive retail property analytics for institutional investors

import { PropertyData } from '../../types';

// ==================== TYPE DEFINITIONS ====================

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

// ==================== SALES & PRODUCTIVITY ANALYSIS ====================

/**
 * Comprehensive sales analysis with trending and health metrics
 */
export function analyzeSalesPerformance(
  salesData: SalesData[],
  tenants: RetailTenant[],
  centerType: 'Regional Mall' | 'Lifestyle' | 'Strip' | 'Power' | 'Outlet'
): {
  centerMetrics: {
    totalSalesPSF: number;
    salesGrowthYOY: number;
    topPerformers: { tenant: string; salesPSF: number; growth: number }[];
    bottomPerformers: { tenant: string; salesPSF: number; decline: number }[];
    categoryPerformance: Map<string, { salesPSF: number; growth: number }>;
  };
  tenantHealth: {
    tenant: string;
    salesPSF: number;
    occupancyCost: number;
    healthScore: number; // 0-100
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    indicators: string[];
  }[];
  salesTrends: {
    seasonalPattern: { month: string; index: number }[]; // 100 = average
    weekdayDistribution: Map<string, number>;
    peakHours: { hour: number; percentage: number }[];
    conversionRate: number;
  };
  benchmarkComparison: {
    metric: string;
    centerValue: number;
    benchmark: number;
    percentile: number;
  }[];
} {
  // Group sales by tenant and calculate metrics
  const tenantSalesMap = new Map<string, number[]>();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  salesData.forEach(sale => {
    if (!tenantSalesMap.has(sale.tenant)) {
      tenantSalesMap.set(sale.tenant, []);
    }
    tenantSalesMap.get(sale.tenant)!.push(sale.netSales);
  });
  
  // Calculate center-wide metrics
  let totalCurrentSales = 0;
  let totalLastYearSales = 0;
  let totalSF = 0;
  
  const tenantMetrics: any[] = [];
  const categoryMetrics = new Map<string, { sales: number; sf: number; lastYear: number }>();
  
  tenants.forEach(tenant => {
    const currentYearSales = salesData
      .filter(s => s.tenant === tenant.tenantName && s.year === currentYear)
      .reduce((sum, s) => sum + s.netSales, 0);
    
    const lastYearSales = salesData
      .filter(s => s.tenant === tenant.tenantName && s.year === lastYear)
      .reduce((sum, s) => sum + s.netSales, 0);
    
    totalCurrentSales += currentYearSales;
    totalLastYearSales += lastYearSales;
    totalSF += tenant.squareFootage;
    
    const salesPSF = currentYearSales / tenant.squareFootage;
    const growth = lastYearSales > 0 ? 
      ((currentYearSales - lastYearSales) / lastYearSales) * 100 : 0;
    
    tenantMetrics.push({
      tenant: tenant.tenantName,
      category: tenant.merchandiseType,
      salesPSF,
      growth,
      sales: currentYearSales,
      sf: tenant.squareFootage
    });
    
    // Category aggregation
    const category = categoryMetrics.get(tenant.merchandiseType) || { sales: 0, sf: 0, lastYear: 0 };
    category.sales += currentYearSales;
    category.sf += tenant.squareFootage;
    category.lastYear += lastYearSales;
    categoryMetrics.set(tenant.merchandiseType, category);
  });
  
  const totalSalesPSF = totalSF > 0 ? totalCurrentSales / totalSF : 0;
  const salesGrowthYOY = totalLastYearSales > 0 ? 
    ((totalCurrentSales - totalLastYearSales) / totalLastYearSales) * 100 : 0;
  
  // Top and bottom performers
  const sortedTenants = tenantMetrics.sort((a, b) => b.salesPSF - a.salesPSF);
  const topPerformers = sortedTenants.slice(0, 5).map(t => ({
    tenant: t.tenant,
    salesPSF: t.salesPSF,
    growth: t.growth
  }));
  const bottomPerformers = sortedTenants.slice(-5).map(t => ({
    tenant: t.tenant,
    salesPSF: t.salesPSF,
    decline: Math.abs(t.growth)
  }));
  
  // Category performance
  const categoryPerformance = new Map<string, { salesPSF: number; growth: number }>();
  categoryMetrics.forEach((data, category) => {
    const salesPSF = data.sf > 0 ? data.sales / data.sf : 0;
    const growth = data.lastYear > 0 ? ((data.sales - data.lastYear) / data.lastYear) * 100 : 0;
    categoryPerformance.set(category, { salesPSF, growth });
  });
  
  // Tenant health analysis
  const tenantHealth = tenants.map(tenant => {
    const currentYearSales = salesData
      .filter(s => s.tenant === tenant.tenantName && s.year === currentYear)
      .reduce((sum, s) => sum + s.netSales, 0);
    
    const salesPSF = currentYearSales / tenant.squareFootage;
    const occupancyCost = (tenant.baseRentPSF * 12) / salesPSF;
    
    // Health score calculation (0-100)
    let healthScore = 50;
    if (salesPSF > 400) healthScore += 20;
    else if (salesPSF > 300) healthScore += 10;
    else if (salesPSF < 200) healthScore -= 20;
    
    if (occupancyCost < 0.08) healthScore += 15;
    else if (occupancyCost > 0.12) healthScore -= 15;
    
    if (tenant.creditRating && ['A', 'AA', 'AAA'].includes(tenant.creditRating)) {
      healthScore += 10;
    }
    
    if (tenant.essentialService) healthScore += 5;
    
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    // Risk level determination
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    if (healthScore >= 80) riskLevel = 'Low';
    else if (healthScore >= 60) riskLevel = 'Medium';
    else if (healthScore >= 40) riskLevel = 'High';
    else riskLevel = 'Critical';
    
    // Risk indicators
    const indicators: string[] = [];
    if (salesPSF < 250) indicators.push('Low sales productivity');
    if (occupancyCost > 0.12) indicators.push('High occupancy cost');
    if (tenant.creditRating === 'NR') indicators.push('No credit rating');
    if (!tenant.essentialService && salesPSF < 300) indicators.push('Non-essential low performer');
    
    return {
      tenant: tenant.tenantName,
      salesPSF,
      occupancyCost,
      healthScore,
      riskLevel,
      indicators
    };
  });
  
  // Sales trends analysis
  const monthlySales = new Map<number, number>();
  const weekdaySales = new Map<string, number>();
  const hourlySales = new Map<number, number>();
  
  salesData.forEach(sale => {
    const month = sale.month;
    monthlySales.set(month, (monthlySales.get(month) || 0) + sale.netSales);
  });
  
  // Seasonal pattern (simplified - would need actual date data)
  const seasonalPattern = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
    index: monthlySales.get(i + 1) ? (monthlySales.get(i + 1)! / (totalCurrentSales / 12)) * 100 : 100
  }));
  
  // Benchmark comparison
  const benchmarks = getCenterBenchmarks(centerType);
  const benchmarkComparison = [
    {
      metric: 'Sales PSF',
      centerValue: totalSalesPSF,
      benchmark: benchmarks.avgSalesPSF,
      percentile: totalSalesPSF > benchmarks.avgSalesPSF ? 75 : 25
    },
    {
      metric: 'Sales Growth',
      centerValue: salesGrowthYOY,
      benchmark: benchmarks.avgGrowth,
      percentile: salesGrowthYOY > benchmarks.avgGrowth ? 75 : 25
    }
  ];
  
  return {
    centerMetrics: {
      totalSalesPSF,
      salesGrowthYOY,
      topPerformers,
      bottomPerformers,
      categoryPerformance
    },
    tenantHealth,
    salesTrends: {
      seasonalPattern,
      weekdayDistribution: weekdaySales,
      peakHours: Array.from(hourlySales.entries()).map(([hour, sales]) => ({
        hour,
        percentage: (sales / totalCurrentSales) * 100
      })),
      conversionRate: 0.65 // Placeholder - would need transaction data
    },
    benchmarkComparison
  };
}

/**
 * Co-tenancy and critical tenant analysis
 */
export function analyzeCoTenancy(
  tenants: RetailTenant[],
  currentOccupancy: number,
  totalGLA: number
): {
  coTenancyRisk: {
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    exposedGLA: number;
    exposedRent: number;
    triggers: {
      tenant: string;
      triggerTenant: string;
      remedy: string;
      probability: number;
    }[];
  };
  anchorDependency: {
    anchorName: string;
    glaPercentage: number;
    dependentTenants: number;
    dependentGLA: number;
    replacementDifficulty: 'Low' | 'Medium' | 'High';
  }[];
  criticalMass: {
    currentStatus: 'Healthy' | 'At Risk' | 'Below Critical';
    minimumOccupancy: number;
    cushion: number;
    vulnerableTenants: string[];
  };
  tenantSynergies: {
    cluster: string;
    tenants: string[];
    synergyScore: number;
    crossShoppingIndex: number;
  }[];
} {
  // Identify anchors and their dependencies
  const anchors = tenants.filter(t => t.category === 'Anchor' || t.category === 'Junior Anchor');
  const anchorNames = anchors.map(a => a.tenantName);
  
  // Analyze co-tenancy clauses
  const coTenancyTriggers: any[] = [];
  let exposedGLA = 0;
  let exposedRent = 0;
  
  tenants.forEach(tenant => {
    if (tenant.coTenancy) {
      const requiredTenants = tenant.coTenancy.required;
      const missingTenants = requiredTenants.filter(req => 
        !tenants.some(t => t.tenantName === req)
      );
      
      if (missingTenants.length > 0) {
        exposedGLA += tenant.squareFootage;
        exposedRent += tenant.baseRentPSF * tenant.squareFootage;
        
        missingTenants.forEach(missing => {
          coTenancyTriggers.push({
            tenant: tenant.tenantName,
            triggerTenant: missing,
            remedy: tenant.coTenancy!.remedy,
            probability: 0.8 // High probability since tenant is already missing
          });
        });
      } else {
        // Check future risk
        requiredTenants.forEach(required => {
          const reqTenant = tenants.find(t => t.tenantName === required);
          if (reqTenant) {
            const monthsToExpiry = Math.max(0,
              (reqTenant.leaseEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
            );
            
            if (monthsToExpiry < 24) {
              const probability = monthsToExpiry < 12 ? 0.5 : 0.3;
              coTenancyTriggers.push({
                tenant: tenant.tenantName,
                triggerTenant: required,
                remedy: tenant.coTenancy!.remedy,
                probability
              });
              
              exposedGLA += tenant.squareFootage * probability;
              exposedRent += tenant.baseRentPSF * tenant.squareFootage * probability;
            }
          }
        });
      }
    }
  });
  
  // Determine co-tenancy risk level
  const exposurePercentage = (exposedGLA / totalGLA) * 100;
  let coTenancyRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  if (exposurePercentage < 5) coTenancyRiskLevel = 'Low';
  else if (exposurePercentage < 15) coTenancyRiskLevel = 'Medium';
  else if (exposurePercentage < 25) coTenancyRiskLevel = 'High';
  else coTenancyRiskLevel = 'Critical';
  
  // Anchor dependency analysis
  const anchorDependency = anchors.map(anchor => {
    const dependentTenants = tenants.filter(t => 
      t.coTenancy?.required.includes(anchor.tenantName)
    );
    
    const dependentGLA = dependentTenants.reduce((sum, t) => sum + t.squareFootage, 0);
    
    // Assess replacement difficulty
    let replacementDifficulty: 'Low' | 'Medium' | 'High';
    if (anchor.squareFootage < 20000) {
      replacementDifficulty = 'Low';
    } else if (anchor.squareFootage < 50000 && !anchor.essentialService) {
      replacementDifficulty = 'Medium';
    } else {
      replacementDifficulty = 'High';
    }
    
    return {
      anchorName: anchor.tenantName,
      glaPercentage: Number(((anchor.squareFootage / totalGLA) * 100).toFixed(2)),
      dependentTenants: dependentTenants.length,
      dependentGLA,
      replacementDifficulty
    };
  });
  
  // Critical mass analysis
  const essentialTenants = tenants.filter(t => 
    t.essentialService || t.category === 'Anchor' || t.salesPSF! > 500
  );
  const essentialOccupancy = (essentialTenants.reduce((sum, t) => 
    sum + t.squareFootage, 0) / totalGLA) * 100;
  
  // Minimum occupancy varies by center type
  const minimumOccupancy = totalGLA > 500000 ? 85 : 
                          totalGLA > 200000 ? 80 : 75;
  const cushion = currentOccupancy - minimumOccupancy;
  
  let criticalMassStatus: 'Healthy' | 'At Risk' | 'Below Critical';
  if (currentOccupancy >= minimumOccupancy + 10) criticalMassStatus = 'Healthy';
  else if (currentOccupancy >= minimumOccupancy) criticalMassStatus = 'At Risk';
  else criticalMassStatus = 'Below Critical';
  
  // Identify vulnerable tenants
  const vulnerableTenants = tenants
    .filter(t => {
      const health = analyzeTenantHealth(t);
      return health.riskLevel === 'High' || health.riskLevel === 'Critical';
    })
    .map(t => t.tenantName);
  
  // Tenant synergy analysis
  const merchandiseGroups = new Map<string, RetailTenant[]>();
  tenants.forEach(tenant => {
    if (!merchandiseGroups.has(tenant.merchandiseType)) {
      merchandiseGroups.set(tenant.merchandiseType, []);
    }
    merchandiseGroups.get(tenant.merchandiseType)!.push(tenant);
  });
  
  const tenantSynergies = Array.from(merchandiseGroups.entries())
    .filter(([_, group]) => group.length >= 3)
    .map(([category, group]) => {
      // Calculate synergy score based on proximity and performance
      const avgSalesPSF = group.reduce((sum, t) => sum + (t.salesPSF || 0), 0) / group.length;
      const synergyScore = Math.min(100, group.length * 10 + (avgSalesPSF / 5));
      
      // Cross-shopping index (simplified)
      const crossShoppingIndex = category === 'Apparel' ? 0.8 :
                                category === 'Food' ? 0.6 :
                                category === 'Service' ? 0.4 : 0.5;
      
      return {
        cluster: category,
        tenants: group.map(t => t.tenantName),
        synergyScore: Number(synergyScore.toFixed(0)),
        crossShoppingIndex: Number(crossShoppingIndex.toFixed(2))
      };
    })
    .sort((a, b) => b.synergyScore - a.synergyScore);
  
  return {
    coTenancyRisk: {
      level: coTenancyRiskLevel,
      exposedGLA,
      exposedRent,
      triggers: coTenancyTriggers
    },
    anchorDependency,
    criticalMass: {
      currentStatus: criticalMassStatus,
      minimumOccupancy,
      cushion: Number(cushion.toFixed(2)),
      vulnerableTenants
    },
    tenantSynergies
  };
}

// ==================== TRADE AREA & DEMOGRAPHICS ====================

/**
 * Advanced trade area analysis with void analysis
 */
export function analyzeTradeArea(
  demographics: TradeArea[],
  tenants: RetailTenant[],
  competitors: {
    name: string;
    type: string;
    distance: number;
    gla: number;
    anchors: string[];
  }[],
  trafficCounts: {
    location: string;
    dailyCount: number;
    growthRate: number;
  }[]
): {
  primaryTradeArea: {
    definition: string;
    population: number;
    spendingPower: number;
    penetrationRate: number;
    marketShare: number;
  };
  customerProfile: {
    dominantSegment: string;
    incomeIndex: number;
    lifestyleTraits: string[];
    spendingPatterns: Map<string, number>;
  };
  competitivePosition: {
    directCompetitors: number;
    competitiveDensity: number; // SF per capita
    differentiators: string[];
    vulnerabilities: string[];
    marketGaps: string[];
  };
  growthPotential: {
    populationGrowth: number;
    incomeGrowth: number;
    developmentPipeline: number;
    captureRate: number;
    fiveYearProjection: number;
  };
  voidAnalysis: {
    category: string;
    demand: number;
    supply: number;
    gap: number;
    opportunity: 'High' | 'Medium' | 'Low';
  }[];
} {
  // Define primary trade area (typically 3-mile for neighborhood, 5-mile for community)
  const primaryRadius = demographics[0]; // Assume first is primary
  const totalPopulation = demographics.reduce((sum, d) => sum + d.population, 0);
  
  // Calculate spending power
  const avgHouseholdSpending = 35000; // Annual retail spending per household
  const incomeAdjustment = primaryRadius.medianIncome / 65000; // National median
  const totalSpendingPower = primaryRadius.households * avgHouseholdSpending * incomeAdjustment;
  
  // Market share and penetration
  const ourGLA = tenants.reduce((sum, t) => sum + t.squareFootage, 0);
  const competitorGLA = competitors.reduce((sum, c) => sum + c.gla, 0);
  const totalMarketGLA = ourGLA + competitorGLA;
  const marketShare = (ourGLA / totalMarketGLA) * 100;
  
  // Assume $400 PSF sales average
  const estimatedSales = ourGLA * 400;
  const penetrationRate = (estimatedSales / totalSpendingPower) * 100;
  
  // Customer profile analysis
  const incomeIndex = primaryRadius.medianIncome / 65000 * 100;
  let dominantSegment: string;
  const lifestyleTraits: string[] = [];
  
  if (incomeIndex > 150) {
    dominantSegment = 'Affluent Professionals';
    lifestyleTraits.push('Quality focused', 'Brand conscious', 'Experience driven');
  } else if (incomeIndex > 120) {
    dominantSegment = 'Upper Middle Class';
    lifestyleTraits.push('Value conscious', 'Family oriented', 'Convenience seeking');
  } else if (incomeIndex > 80) {
    dominantSegment = 'Middle Income';
    lifestyleTraits.push('Price sensitive', 'Deal seeking', 'Practical');
  } else {
    dominantSegment = 'Value Oriented';
    lifestyleTraits.push('Budget conscious', 'Necessity focused', 'Discount driven');
  }
  
  // Spending patterns by category
  const spendingPatterns = new Map<string, number>([
    ['Apparel', incomeIndex > 120 ? 15 : 10],
    ['Food', 25],
    ['Entertainment', incomeIndex > 100 ? 10 : 5],
    ['Home', 15],
    ['Electronics', 10],
    ['Services', 15],
    ['Other', incomeIndex > 120 ? 10 : 20]
  ]);
  
  // Competitive position analysis
  const directCompetitors = competitors.filter(c => 
    c.distance <= 3 && c.type !== 'Convenience'
  ).length;
  
  const competitiveDensity = totalMarketGLA / primaryRadius.population;
  
  // Identify differentiators and vulnerabilities
  const differentiators: string[] = [];
  const vulnerabilities: string[] = [];
  
  // Check for unique anchors
  const ourAnchors = tenants.filter(t => t.category === 'Anchor').map(t => t.tenantName);
  const competitorAnchors = competitors.flatMap(c => c.anchors);
  const uniqueAnchors = ourAnchors.filter(a => !competitorAnchors.includes(a));
  
  if (uniqueAnchors.length > 0) {
    differentiators.push(`Unique anchors: ${uniqueAnchors.join(', ')}`);
  }
  
  // Location advantages
  const avgTrafficCount = trafficCounts.reduce((sum, t) => sum + t.dailyCount, 0) / trafficCounts.length;
  if (avgTrafficCount > 30000) {
    differentiators.push('High traffic location');
  } else if (avgTrafficCount < 15000) {
    vulnerabilities.push('Low traffic visibility');
  }
  
  // Age and condition
  const avgCompetitorAge = 15; // Assumed
  if (competitors.some(c => c.distance < 2)) {
    vulnerabilities.push('Direct competition within 2 miles');
  }
  
  // Void analysis
  const categoryDemand = calculateCategoryDemand(primaryRadius, spendingPatterns);
  const categorySupply = calculateCategorySupply(tenants, competitors);
  
  const voidAnalysis = Array.from(categoryDemand.entries()).map(([category, demand]) => {
    const supply = categorySupply.get(category) || 0;
    const gap = demand - supply;
    const gapPercentage = (gap / demand) * 100;
    
    let opportunity: 'High' | 'Medium' | 'Low';
    if (gapPercentage > 30 && gap > 1000000) opportunity = 'High';
    else if (gapPercentage > 15 && gap > 500000) opportunity = 'Medium';
    else opportunity = 'Low';
    
    return {
      category,
      demand: Math.round(demand),
      supply: Math.round(supply),
      gap: Math.round(gap),
      opportunity
    };
  }).sort((a, b) => b.gap - a.gap);
  
  const marketGaps = voidAnalysis
    .filter(v => v.opportunity === 'High')
    .map(v => v.category);
  
  // Growth potential
  const populationGrowth = primaryRadius.growth5Year;
  const incomeGrowth = populationGrowth * 0.6; // Assumed correlation
  const developmentPipeline = competitors
    .filter(c => c.gla === 0) // Planned but not built
    .reduce((sum, c) => sum + c.gla, 0);
  
  const currentCaptureRate = penetrationRate;
  const projectedCaptureRate = currentCaptureRate * (1 + (populationGrowth / 100));
  const fiveYearProjection = totalSpendingPower * (1 + (populationGrowth / 100)) * 
                            (projectedCaptureRate / 100);
  
  return {
    primaryTradeArea: {
      definition: `${primaryRadius.radius}-mile radius`,
      population: primaryRadius.population,
      spendingPower: Math.round(totalSpendingPower),
      penetrationRate: Number(penetrationRate.toFixed(2)),
      marketShare: Number(marketShare.toFixed(2))
    },
    customerProfile: {
      dominantSegment,
      incomeIndex: Number(incomeIndex.toFixed(0)),
      lifestyleTraits,
      spendingPatterns
    },
    competitivePosition: {
      directCompetitors,
      competitiveDensity: Number(competitiveDensity.toFixed(2)),
      differentiators,
      vulnerabilities,
      marketGaps
    },
    growthPotential: {
      populationGrowth: Number(populationGrowth.toFixed(2)),
      incomeGrowth: Number(incomeGrowth.toFixed(2)),
      developmentPipeline,
      captureRate: Number(projectedCaptureRate.toFixed(2)),
      fiveYearProjection: Math.round(fiveYearProjection)
    },
    voidAnalysis
  };
}

// ==================== LEASE & FINANCIAL OPTIMIZATION ====================

/**
 * Percentage rent analysis and optimization
 */
export function analyzePercentageRent(
  tenants: RetailTenant[],
  salesData: SalesData[]
): {
  currentPerformance: {
    totalPercentageRent: number;
    percentageOfTotal: number;
    performingTenants: number;
    underperformingTenants: number;
  };
  tenantAnalysis: {
    tenant: string;
    naturalBreakpoint: number;
    actualSales: number;
    percentageRent: number;
    overagePercentage: number;
    optimization: 'Lower Breakpoint' | 'Increase Base' | 'Optimal' | 'Restructure';
  }[];
  optimizationOpportunities: {
    tenant: string;
    currentStructure: string;
    recommendedStructure: string;
    estimatedIncrease: number;
  }[];
  marketComparison: {
    category: string;
    marketRate: number;
    averageBreakpoint: number;
    ourAverage: number;
  }[];
} {
  const currentYear = new Date().getFullYear();
  let totalPercentageRent = 0;
  let totalBaseRent = 0;
  let performingCount = 0;
  let underperformingCount = 0;
  
  // Analyze each tenant
  const tenantAnalysis = tenants.map(tenant => {
    // Get actual sales
    const tenantSales = salesData
      .filter(s => s.tenant === tenant.tenantName && s.year === currentYear)
      .reduce((sum, s) => sum + s.netSales, 0);
    
    // Calculate percentage rent
    let percentageRent = 0;
    let overagePercentage = 0;
    
    if (tenant.percentageRent && tenantSales > 0) {
      const breakpoint = tenant.percentageRent.naturalBreakpoint;
      const overage = Math.max(0, tenantSales - breakpoint);
      percentageRent = overage * (tenant.percentageRent.rate / 100);
      overagePercentage = (overage / tenantSales) * 100;
      
      if (percentageRent > 0) {
        performingCount++;
      } else {
        underperformingCount++;
      }
    }
    
    totalPercentageRent += percentageRent;
    totalBaseRent += tenant.baseRentPSF * tenant.squareFootage;
    
    // Determine optimization strategy
    let optimization: 'Lower Breakpoint' | 'Increase Base' | 'Optimal' | 'Restructure';
    const salesPSF = tenantSales / tenant.squareFootage;
    const breakpointPSF = tenant.percentageRent ? 
      tenant.percentageRent.naturalBreakpoint / tenant.squareFootage : 0;
    
    if (salesPSF > breakpointPSF * 1.5) {
      optimization = 'Lower Breakpoint'; // Strong sales, capture more
    } else if (salesPSF > breakpointPSF * 1.2) {
      optimization = 'Optimal';
    } else if (salesPSF < breakpointPSF * 0.8) {
      optimization = 'Increase Base'; // Weak sales, need guaranteed rent
    } else {
      optimization = 'Restructure';
    }
    
    return {
      tenant: tenant.tenantName,
      naturalBreakpoint: tenant.percentageRent?.naturalBreakpoint || 0,
      actualSales: tenantSales,
      percentageRent,
      overagePercentage: Number(overagePercentage.toFixed(2)),
      optimization
    };
  });
  
  // Identify optimization opportunities
  const optimizationOpportunities = tenantAnalysis
    .filter(t => t.optimization !== 'Optimal')
    .map(analysis => {
      const tenant = tenants.find(t => t.tenantName === analysis.tenant)!;
      let recommendedStructure = '';
      let estimatedIncrease = 0;
      
      switch (analysis.optimization) {
        case 'Lower Breakpoint':
          const newBreakpoint = analysis.actualSales * 0.7;
          const additionalRent = (analysis.actualSales - newBreakpoint) * 
            (tenant.percentageRent?.rate || 6) / 100;
          estimatedIncrease = additionalRent - analysis.percentageRent;
          recommendedStructure = `Lower breakpoint to $${(newBreakpoint / 1000).toFixed(0)}k`;
          break;
          
        case 'Increase Base':
          const marketBase = getMarketBaseRent(tenant.merchandiseType);
          const baseIncrease = (marketBase - tenant.baseRentPSF) * tenant.squareFootage;
          estimatedIncrease = Math.max(0, baseIncrease);
          recommendedStructure = `Increase base to $${marketBase}/SF`;
          break;
          
        case 'Restructure':
          recommendedStructure = 'Convert to graduated or CPI-based rent';
          estimatedIncrease = tenant.baseRentPSF * tenant.squareFootage * 0.03; // 3% assumed
          break;
      }
      
      return {
        tenant: analysis.tenant,
        currentStructure: `Base: $${tenant.baseRentPSF}/SF, ${tenant.percentageRent?.rate || 0}% over ${
          tenant.percentageRent ? (tenant.percentageRent.naturalBreakpoint / 1000).toFixed(0) + 'k' : 'N/A'
        }`,
        recommendedStructure,
        estimatedIncrease
      };
    })
    .filter(o => o.estimatedIncrease > 0)
    .sort((a, b) => b.estimatedIncrease - a.estimatedIncrease);
  
  // Market comparison by category
  const categoryGroups = new Map<string, RetailTenant[]>();
  tenants.forEach(tenant => {
    if (!categoryGroups.has(tenant.merchandiseType)) {
      categoryGroups.set(tenant.merchandiseType, []);
    }
    categoryGroups.get(tenant.merchandiseType)!.push(tenant);
  });
  
  const marketComparison = Array.from(categoryGroups.entries()).map(([category, group]) => {
    const marketRates = getMarketPercentageRates(category);
    const avgBreakpoint = group.reduce((sum, t) => 
      sum + (t.percentageRent?.naturalBreakpoint || 0), 0) / group.length;
    const ourAverage = group.reduce((sum, t) => 
      sum + (t.percentageRent?.rate || 0), 0) / group.length;
    
    return {
      category,
      marketRate: marketRates.rate,
      averageBreakpoint: marketRates.breakpoint,
      ourAverage: Number(ourAverage.toFixed(2))
    };
  });
  
  return {
    currentPerformance: {
      totalPercentageRent,
      percentageOfTotal: Number(((totalPercentageRent / (totalBaseRent + totalPercentageRent)) * 100).toFixed(2)),
      performingTenants: performingCount,
      underperformingTenants: underperformingCount
    },
    tenantAnalysis,
    optimizationOpportunities,
    marketComparison
  };
}

/**
 * CAM and expense recovery optimization
 */
export function analyzeExpenseRecovery(
  expenses: {
    category: string;
    amount: number;
    recoverable: boolean;
    allocation: 'Pro-Rata' | 'Fixed' | 'Direct';
  }[],
  tenants: RetailTenant[],
  totalGLA: number
): {
  totalExpenses: number;
  recoverableExpenses: number;
  actualRecovery: number;
  recoveryRate: number;
  leakage: {
    amount: number;
    causes: {
      reason: string;
      amount: number;
      affectedTenants: number;
    }[];
  };
  tenantRecovery: {
    tenant: string;
    proRataShare: number;
    actualBilled: number;
    collected: number;
    variance: number;
    structure: string;
  }[];
  optimizationStrategies: {
    strategy: string;
    impact: number;
    implementation: string;
    timeline: string;
  }[];
  adminFeeOpportunity: number;
} {
  // Calculate expense totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recoverableExpenses = expenses
    .filter(e => e.recoverable)
    .reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate actual recovery by tenant
  const tenantRecoveries = tenants.map(tenant => {
    const proRataShare = tenant.squareFootage / totalGLA;
    let actualBilled = 0;
    let structure = '';
    
    switch (tenant.camStructure) {
      case 'Pro-rata':
        actualBilled = recoverableExpenses * proRataShare;
        structure = 'Full pro-rata';
        break;
        
      case 'Fixed':
        actualBilled = (tenant.camCap || 0) * tenant.squareFootage;
        structure = `Fixed at $${tenant.camCap}/SF`;
        break;
        
      case 'Capped':
        const fullProRata = recoverableExpenses * proRataShare;
        const cap = (tenant.camCap || 0) * tenant.squareFootage;
        actualBilled = Math.min(fullProRata, cap);
        structure = `Capped at $${tenant.camCap}/SF`;
        break;
        
      case 'Excluded':
        actualBilled = 0;
        structure = 'Excluded from CAM';
        break;
    }
    
    // Assume 95% collection rate for simplicity
    const collected = actualBilled * 0.95;
    
    return {
      tenant: tenant.tenantName,
      proRataShare: recoverableExpenses * proRataShare,
      actualBilled,
      collected,
      variance: collected - (recoverableExpenses * proRataShare),
      structure
    };
  });
  
  const actualRecovery = tenantRecoveries.reduce((sum, t) => sum + t.collected, 0);
  const recoveryRate = (actualRecovery / recoverableExpenses) * 100;
  
  // Identify leakage causes
  const leakageAmount = recoverableExpenses - actualRecovery;
  const leakageCauses = [];
  
  // CAM caps leakage
  const capLeakage = tenantRecoveries
    .filter(t => t.structure.includes('Capped'))
    .reduce((sum, t) => sum + Math.max(0, t.proRataShare - t.actualBilled), 0);
  
  if (capLeakage > 0) {
    leakageCauses.push({
      reason: 'CAM caps below market',
      amount: capLeakage,
      affectedTenants: tenantRecoveries.filter(t => t.structure.includes('Capped')).length
    });
  }
  
  // Exclusions leakage
  const exclusionLeakage = tenantRecoveries
    .filter(t => t.structure === 'Excluded from CAM')
    .reduce((sum, t) => sum + t.proRataShare, 0);
  
  if (exclusionLeakage > 0) {
    leakageCauses.push({
      reason: 'Tenant exclusions',
      amount: exclusionLeakage,
      affectedTenants: tenantRecoveries.filter(t => t.structure === 'Excluded from CAM').length
    });
  }
  
  // Collection leakage
  const collectionLeakage = tenantRecoveries
    .reduce((sum, t) => sum + (t.actualBilled - t.collected), 0);
  
  if (collectionLeakage > 0) {
    leakageCauses.push({
      reason: 'Collection shortfalls',
      amount: collectionLeakage,
      affectedTenants: tenantRecoveries.filter(t => t.collected < t.actualBilled).length
    });
  }
  
  // Optimization strategies
  const optimizationStrategies = [];
  
  // Strategy 1: Renegotiate caps
  const lowCapTenants = tenantRecoveries.filter(t => 
    t.structure.includes('Capped') && t.variance < -1000
  );
  
  if (lowCapTenants.length > 0) {
    const potentialRecovery = lowCapTenants.reduce((sum, t) => 
      sum + Math.abs(t.variance), 0
    ) * 0.5; // Assume 50% success
    
    optimizationStrategies.push({
      strategy: 'Renegotiate CAM caps at renewal',
      impact: potentialRecovery,
      implementation: 'Target tenants with caps >20% below actual',
      timeline: '12-24 months'
    });
  }
  
  // Strategy 2: Expense reduction
  const controllableExpenses = expenses
    .filter(e => ['Cleaning', 'Landscaping', 'Security'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);
  
  if (controllableExpenses > 0) {
    optimizationStrategies.push({
      strategy: 'Competitive bid controllable services',
      impact: controllableExpenses * 0.15, // 15% savings target
      implementation: 'RFP process for major contracts',
      timeline: '3-6 months'
    });
  }
  
  // Strategy 3: Direct bill exclusions
  const excludedTenants = tenantRecoveries.filter(t => t.structure === 'Excluded from CAM');
  if (excludedTenants.length > 0) {
    optimizationStrategies.push({
      strategy: 'Direct bill certain expenses',
      impact: exclusionLeakage * 0.3,
      implementation: 'Separate meter utilities, direct bill specific services',
      timeline: '6-12 months'
    });
  }
  
  // Admin fee opportunity (typically 10-15% of recoverable expenses)
  const currentAdminFee = 0; // Assume not charging
  const adminFeeOpportunity = recoverableExpenses * 0.10;
  
  optimizationStrategies.push({
    strategy: 'Implement administrative fee',
    impact: adminFeeOpportunity,
    implementation: '10% admin fee on CAM charges',
    timeline: 'Next lease cycle'
  });
  
  return {
    totalExpenses,
    recoverableExpenses,
    actualRecovery,
    recoveryRate: Number(recoveryRate.toFixed(2)),
    leakage: {
      amount: leakageAmount,
      causes: leakageCauses
    },
    tenantRecovery: tenantRecoveries,
    optimizationStrategies: optimizationStrategies.sort((a, b) => b.impact - a.impact),
    adminFeeOpportunity
  };
}

// ==================== REDEVELOPMENT & REPOSITIONING ====================

/**
 * Redevelopment and repositioning analysis
 */
export function analyzeRedevelopmentPotential(
  currentState: {
    gla: number;
    occupancy: number;
    avgRent: number;
    salesPSF: number;
    parkingSpaces: number;
    landArea: number; // acres
  },
  marketData: {
    newConstructionRent: number;
    landValue: number; // per acre
    constructionCost: number; // per SF
    parkingCost: number; // per space
  },
  zoning: {
    maxFAR: number;
    maxHeight: number;
    allowedUses: string[];
    parkingRequired: number; // per 1000 SF
  }
): {
  highestBestUse: {
    use: string;
    totalSF: number;
    estimatedValue: number;
    estimatedNOI: number;
    developmentCost: number;
    profit: number;
  };
  redevelopmentOptions: {
    scenario: string;
    description: string;
    capEx: number;
    newGLA: number;
    proformaNOI: number;
    stabilizedYield: number;
    irr: number;
  }[];
  densificationPotential: {
    additionalGLA: number;
    padSites: number;
    outparcelValue: number;
    mixedUseOption: boolean;
  };
  conversionAnalysis: {
    fromUse: string;
    toUse: string;
    feasibility: 'High' | 'Medium' | 'Low';
    conversionCost: number;
    marketSupport: string;
  }[];
} {
  const landSF = currentState.landArea * 43560;
  const currentFAR = currentState.gla / landSF;
  const maxBuildable = landSF * zoning.maxFAR;
  
  // Highest and best use analysis
  const potentialUses = [];
  
  // Retail redevelopment
  if (zoning.allowedUses.includes('Retail')) {
    const retailSF = maxBuildable * 0.8; // 80% efficiency
    const retailNOI = retailSF * marketData.newConstructionRent * 0.9; // 90% occupancy
    const retailCost = (retailSF * marketData.constructionCost) + 
                      (currentState.landArea * marketData.landValue);
    
    potentialUses.push({
      use: 'Modern Retail Center',
      totalSF: retailSF,
      estimatedValue: retailNOI / 0.065, // 6.5% cap rate
      estimatedNOI: retailNOI,
      developmentCost: retailCost,
      profit: (retailNOI / 0.065) - retailCost
    });
  }
  
  // Mixed-use option
  if (zoning.allowedUses.includes('Residential') && zoning.allowedUses.includes('Retail')) {
    const retailSF = maxBuildable * 0.25;
    const resSF = maxBuildable * 0.65;
    const retailNOI = retailSF * marketData.newConstructionRent * 0.95;
    const resNOI = resSF * 24; // $2/SF/month for apartments
    const totalNOI = retailNOI + resNOI;
    const mixedCost = maxBuildable * marketData.constructionCost * 1.2; // 20% premium
    
    potentialUses.push({
      use: 'Mixed-Use Development',
      totalSF: maxBuildable * 0.9,
      estimatedValue: totalNOI / 0.055, // 5.5% cap for mixed
      estimatedNOI: totalNOI,
      developmentCost: mixedCost + (currentState.landArea * marketData.landValue),
      profit: (totalNOI / 0.055) - mixedCost
    });
  }
  
  const highestBestUse = potentialUses.reduce((best, use) => 
    use.profit > best.profit ? use : best
  );
  
  // Redevelopment scenarios
  const redevelopmentOptions = [];
  
  // Scenario 1: Facade and common area renovation
  const facadeReno = {
    scenario: 'Modernization',
    description: 'Facade upgrade, new signage, landscaping, and common areas',
    capEx: currentState.gla * 25,
    newGLA: currentState.gla,
    proformaNOI: currentState.avgRent * 1.15 * currentState.gla * 0.92,
    stabilizedYield: 0,
    irr: 0
  };
  facadeReno.stabilizedYield = facadeReno.proformaNOI / facadeReno.capEx;
  facadeReno.irr = calculateSimpleIRR(facadeReno.capEx, facadeReno.proformaNOI, 5);
  redevelopmentOptions.push(facadeReno);
  
  // Scenario 2: Partial demolition and rebuild
  const partialDemo = {
    scenario: 'Partial Redevelopment',
    description: 'Demo underperforming wing, add lifestyle component',
    capEx: currentState.gla * 0.3 * marketData.constructionCost + currentState.gla * 0.7 * 35,
    newGLA: currentState.gla * 0.85 + 25000, // Add 25k SF
    proformaNOI: 0,
    stabilizedYield: 0,
    irr: 0
  };
  partialDemo.proformaNOI = partialDemo.newGLA * marketData.newConstructionRent * 0.85 * 0.92;
  partialDemo.stabilizedYield = partialDemo.proformaNOI / partialDemo.capEx;
  partialDemo.irr = calculateSimpleIRR(partialDemo.capEx, partialDemo.proformaNOI, 5);
  redevelopmentOptions.push(partialDemo);
  
  // Scenario 3: Add density
  if (currentFAR < zoning.maxFAR * 0.8) {
    const addDensity = {
      scenario: 'Densification',
      description: 'Add second level retail, parking deck, pad sites',
      capEx: 50000 * marketData.constructionCost + 500 * marketData.parkingCost,
      newGLA: currentState.gla + 50000,
      proformaNOI: 0,
      stabilizedYield: 0,
      irr: 0
    };
    addDensity.proformaNOI = addDensity.newGLA * marketData.newConstructionRent * 0.88 * 0.92;
    addDensity.stabilizedYield = addDensity.proformaNOI / addDensity.capEx;
    addDensity.irr = calculateSimpleIRR(addDensity.capEx, addDensity.proformaNOI, 5);
    redevelopmentOptions.push(addDensity);
  }
  
  // Densification potential
  const additionalGLA = Math.max(0, maxBuildable - currentState.gla);
  const excessLand = Math.max(0, currentState.landArea - (currentState.gla / 15000)); // 15k SF/acre typical
  const padSites = Math.floor(excessLand / 0.75); // 0.75 acres per pad
  const outparcelValue = padSites * 0.75 * marketData.landValue * 1.5; // Premium for pads
  
  // Conversion analysis
  const conversionOptions = [];
  
  // Big box to last-mile logistics
  if (currentState.gla > 50000 && zoning.allowedUses.includes('Industrial')) {
    conversionOptions.push({
      fromUse: 'Retail',
      toUse: 'Last-Mile Logistics',
      feasibility: (marketData.constructionCost < 100 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
      conversionCost: currentState.gla * 35,
      marketSupport: 'E-commerce growth driving demand for urban logistics'
    });
  }
  
  // Traditional retail to experiential
  conversionOptions.push({
    fromUse: 'Traditional Retail',
    toUse: 'Entertainment/Experiential',
    feasibility: (currentState.salesPSF < 300 ? 'High' : 'Low') as 'High' | 'Medium' | 'Low',
    conversionCost: currentState.gla * 50,
    marketSupport: 'Consumer shift to experience-based retail'
  });
  
  // To medical/office
  if (zoning.allowedUses.includes('Office')) {
    conversionOptions.push({
      fromUse: 'Retail',
      toUse: 'Medical Office',
      feasibility: 'Medium' as const,
      conversionCost: currentState.gla * 75,
      marketSupport: 'Aging demographics increase healthcare demand'
    });
  }
  
  return {
    highestBestUse,
    redevelopmentOptions: redevelopmentOptions.sort((a, b) => b.irr - a.irr),
    densificationPotential: {
      additionalGLA,
      padSites,
      outparcelValue,
      mixedUseOption: zoning.allowedUses.includes('Residential')
    },
    conversionAnalysis: conversionOptions
  };
}

// ==================== HELPER FUNCTIONS ====================

function getIdealOCR(merchandiseType: string, centerType: string): number {
  const ocrMatrix: Record<string, Record<string, number>> = {
    'Apparel': { 'Regional Mall': 13, 'Lifestyle': 12, 'Strip': 10, 'Power': 8, 'Outlet': 10 },
    'Food': { 'Regional Mall': 8, 'Lifestyle': 7, 'Strip': 6, 'Power': 6, 'Outlet': 7 },
    'Entertainment': { 'Regional Mall': 10, 'Lifestyle': 9, 'Strip': 8, 'Power': 8, 'Outlet': 9 },
    'Service': { 'Regional Mall': 15, 'Lifestyle': 14, 'Strip': 12, 'Power': 10, 'Outlet': 12 },
    'Fitness': { 'Regional Mall': 12, 'Lifestyle': 11, 'Strip': 10, 'Power': 9, 'Outlet': 10 }
  };
  
  return ocrMatrix[merchandiseType]?.[centerType] || 10;
}

function getCenterBenchmarks(centerType: string): any {
  const benchmarks: Record<string, any> = {
    'Regional Mall': { salesPSF: 550, growthRate: 2.5, avgOCR: 12 },
    'Lifestyle': { salesPSF: 450, growthRate: 3.5, avgOCR: 10 },
    'Strip': { salesPSF: 350, growthRate: 2.0, avgOCR: 8 },
    'Power': { salesPSF: 300, growthRate: 1.5, avgOCR: 7 },
    'Outlet': { salesPSF: 400, growthRate: 3.0, avgOCR: 9 }
  };
  
  return benchmarks[centerType] || benchmarks['Strip'];
}

function analyzeTenantHealth(tenant: RetailTenant): { riskLevel: string } {
  // Simplified for this example
  const salesPSF = tenant.salesPSF || 0;
  if (salesPSF > 500) return { riskLevel: 'Low' };
  if (salesPSF > 300) return { riskLevel: 'Medium' };
  if (salesPSF > 150) return { riskLevel: 'High' };
  return { riskLevel: 'Critical' };
}

function calculateCategoryDemand(
  tradeArea: TradeArea,
  spendingPatterns: Map<string, number>
): Map<string, number> {
  const totalSpending = tradeArea.households * tradeArea.averageIncome * 0.35; // 35% retail spending
  const categoryDemand = new Map<string, number>();
  
  spendingPatterns.forEach((percentage, category) => {
    categoryDemand.set(category, totalSpending * (percentage / 100));
  });
  
  return categoryDemand;
}

function calculateCategorySupply(
  tenants: RetailTenant[],
  competitors: any[]
): Map<string, number> {
  const categorySupply = new Map<string, number>();
  
  // Our center
  tenants.forEach(tenant => {
    const current = categorySupply.get(tenant.merchandiseType) || 0;
    const estimatedSales = (tenant.salesPSF || 350) * tenant.squareFootage;
    categorySupply.set(tenant.merchandiseType, current + estimatedSales);
  });
  
  // Competitors (simplified)
  competitors.forEach(comp => {
    // Assume average sales of $300 PSF
    const competitorSales = comp.gla * 300 * 0.8; // 80% of GLA is leasable
    // Distribute among categories (simplified)
    categorySupply.forEach((value, key) => {
      categorySupply.set(key, value + competitorSales * 0.15);
    });
  });
  
  return categorySupply;
}

function getMarketBaseRent(merchandiseType: string): number {
  const marketRents: Record<string, number> = {
    'Apparel': 35,
    'Food': 45,
    'Entertainment': 25,
    'Service': 30,
    'Fitness': 20,
    'Electronics': 40,
    'Home': 25,
    'Other': 28
  };
  
  return marketRents[merchandiseType] || 30;
}

function getMarketPercentageRates(category: string): { rate: number; breakpoint: number } {
  const marketRates: Record<string, { rate: number; breakpoint: number }> = {
    'Apparel': { rate: 6, breakpoint: 400000 },
    'Food': { rate: 6, breakpoint: 1000000 },
    'Entertainment': { rate: 8, breakpoint: 500000 },
    'Service': { rate: 5, breakpoint: 300000 },
    'Fitness': { rate: 4, breakpoint: 600000 },
    'Electronics': { rate: 4, breakpoint: 800000 },
    'Home': { rate: 5, breakpoint: 400000 },
    'Other': { rate: 5, breakpoint: 400000 }
  };
  
  return marketRates[category] || { rate: 5, breakpoint: 400000 };
}

function calculateSimpleIRR(
  initialInvestment: number,
  annualCashFlow: number,
  years: number
): number {
  // Simplified IRR calculation
  const totalReturn = annualCashFlow * years;
  const multiple = totalReturn / initialInvestment;
  const irr = (Math.pow(multiple, 1 / years) - 1) * 100;
  return Number(irr.toFixed(2));
}