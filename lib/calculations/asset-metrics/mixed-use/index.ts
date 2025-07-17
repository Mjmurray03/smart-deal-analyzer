// lib/calculations/asset-metrics/mixed-use/index.ts
// Comprehensive mixed-use property analytics for institutional investors


// Import component-specific metrics
import { OfficeTenant } from '../office';
import { RetailTenant } from '../retail';
import { Unit as ResidentialUnit } from '../multifamily';

// ==================== TYPE DEFINITIONS ====================

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

// ==================== INTEGRATED PERFORMANCE ANALYSIS ====================

/**
 * Comprehensive mixed-use property performance analysis
 */
export function analyzeMixedUsePerformance(
  components: MixedUseComponent[],
  sharedSystems: SharedSystems,
  totalInvestment: number,
  debtService: number
): {
  financialSummary: {
    totalNOI: number;
    blendedCapRate: number;
    totalRevenue: number;
    totalExpenses: number;
    expenseRatio: number;
    cashFlow: number;
    dscr: number;
    cashOnCash: number;
  };
  componentPerformance: {
    component: string;
    noiContribution: number;
    revenuePerSF: number;
    expensePerSF: number;
    marginPercentage: number;
    capRateVsMarket: number;
    performanceRating: 'Outperforming' | 'Meeting' | 'Underperforming';
  }[];
  synergyValue: {
    operationalSynergies: number;
    revenueSynergies: number;
    costSynergies: number;
    totalSynergyValue: number;
    synergyMultiple: number; // vs standalone
  };
  riskAnalysis: {
    concentrationRisk: {
      largestComponent: string;
      percentOfNOI: number;
      riskLevel: 'Low' | 'Medium' | 'High';
    };
    operationalComplexity: number; // 0-100
    crossDefaultRisk: string[];
    marketCycleExposure: Map<string, 'Stable' | 'Growing' | 'Declining'>;
  };
  optimizationOpportunities: {
    opportunity: string;
    components: string[];
    potentialValue: number;
    implementation: string;
    timeline: string;
  }[];
} {
  // Calculate total metrics
  const totalNOI = components.reduce((sum, c) => sum + c.noi, 0);
  const totalSF = components.reduce((sum, c) => sum + c.squareFootage, 0);
  const totalRevenue = components.reduce((sum, c) => {
    const occupiedSF = c.squareFootage * c.occupancy / 100;
    return sum + (c.rentPSF ? c.rentPSF * occupiedSF * 12 : c.noi / 0.6); // Assume 60% margin if no rent data
  }, 0);
  
  const totalDirectExpenses = components.reduce((sum, c) => sum + c.directExpenses, 0);
  const totalProRataExpenses = components.reduce((sum, c) => sum + c.proRataExpenses, 0);
  const totalExpenses = totalDirectExpenses + totalProRataExpenses;
  
  // Financial summary
  const blendedCapRate = (totalNOI / totalInvestment) * 100;
  const expenseRatio = (totalExpenses / totalRevenue) * 100;
  const cashFlow = totalNOI - debtService;
  const dscr = totalNOI / debtService;
  const equity = totalInvestment * 0.3; // Assume 70% LTV
  const cashOnCash = (cashFlow / equity) * 100;
  
  // Component performance analysis
  const marketCapRates: Record<string, number> = {
    'Office': 6.5,
    'Retail': 7.0,
    'Residential': 5.5,
    'Hotel': 8.5,
    'Other': 7.5
  };
  
  const componentPerformance = components.map(comp => {
    const noiContribution = (comp.noi / totalNOI) * 100;
    const revenuePerSF = comp.rentPSF ? comp.rentPSF * 12 : 
                         (comp.noi / 0.6) / comp.squareFootage; // Estimated
    const expensePerSF = (comp.directExpenses + comp.proRataExpenses) / comp.squareFootage;
    const margin = comp.noi / (revenuePerSF * comp.squareFootage) * 100;
    const marketCap = marketCapRates[comp.type] ?? 7.0;
    const capRateVsMarket = comp.capRate - marketCap;
    
    let performanceRating: 'Outperforming' | 'Meeting' | 'Underperforming';
    if (comp.capRate > marketCap + 0.5) performanceRating = 'Underperforming';
    else if (comp.capRate < marketCap - 0.5) performanceRating = 'Outperforming';
    else performanceRating = 'Meeting';
    
    return {
      component: comp.type,
      noiContribution: Number(noiContribution.toFixed(2)),
      revenuePerSF: Number(revenuePerSF.toFixed(2)),
      expensePerSF: Number(expensePerSF.toFixed(2)),
      marginPercentage: Number(margin.toFixed(2)),
      capRateVsMarket: Number(capRateVsMarket.toFixed(2)),
      performanceRating
    };
  });
  
  // Synergy value calculation
  const operationalSynergies = calculateOperationalSynergies(components, sharedSystems);
  const revenueSynergies = calculateRevenueSynergies(components);
  const costSynergies = calculateCostSynergies(components, sharedSystems);
  
  const totalSynergyValue = operationalSynergies + revenueSynergies + costSynergies;
  const standaloneValue = totalNOI / 0.065; // Assumed standalone cap rate
  const synergyMultiple = (standaloneValue + totalSynergyValue) / standaloneValue;
  
  // Risk analysis
  const largestComponent = componentPerformance.reduce((max, c) => 
    c.noiContribution > max.noiContribution ? c : max
  );
  
  const concentrationRiskLevel = largestComponent.noiContribution > 60 ? 'High' :
                                largestComponent.noiContribution > 40 ? 'Medium' : 'Low';
  
  // Operational complexity scoring
  let complexityScore = 30; // Base
  complexityScore += components.length * 10; // More components = more complex
  if (!sharedSystems.utilities.masterMetered) complexityScore += 10;
  if (!sharedSystems.security.integrated) complexityScore += 10;
  if (components.some(c => !c.separateManagement)) complexityScore -= 15;
  complexityScore = Math.min(100, Math.max(0, complexityScore));
  
  // Cross-default risk
  const crossDefaultRisks: string[] = [];
  if (components.some(c => c.type === 'Retail' && c.occupancy < 85)) {
    crossDefaultRisks.push('Retail vacancy may impact residential desirability');
  }
  if (components.some(c => c.type === 'Office' && c.occupancy < 80)) {
    crossDefaultRisks.push('Office vacancy reduces daytime retail traffic');
  }
  
  // Market cycle exposure
  const marketCycleExposure = new Map<string, 'Stable' | 'Growing' | 'Declining'>();
  components.forEach(comp => {
    if (comp.type === 'Office') {
      marketCycleExposure.set(comp.type, comp.occupancy > 90 ? 'Stable' : 'Declining');
    } else if (comp.type === 'Retail') {
      marketCycleExposure.set(comp.type, comp.occupancy > 92 ? 'Growing' : 'Declining');
    } else if (comp.type === 'Residential') {
      marketCycleExposure.set(comp.type, 'Growing');
    }
  });
  
  // Optimization opportunities
  const optimizationOpportunities = identifyOptimizationOpportunities(
    components, 
    sharedSystems, 
    componentPerformance
  );
  
  return {
    financialSummary: {
      totalNOI,
      blendedCapRate: Number(blendedCapRate.toFixed(2)),
      totalRevenue,
      totalExpenses,
      expenseRatio: Number(expenseRatio.toFixed(2)),
      cashFlow,
      dscr: Number(dscr.toFixed(2)),
      cashOnCash: Number(cashOnCash.toFixed(2))
    },
    componentPerformance,
    synergyValue: {
      operationalSynergies,
      revenueSynergies,
      costSynergies,
      totalSynergyValue,
      synergyMultiple: Number(synergyMultiple.toFixed(2))
    },
    riskAnalysis: {
      concentrationRisk: {
        largestComponent: largestComponent.component,
        percentOfNOI: largestComponent.noiContribution,
        riskLevel: concentrationRiskLevel
      },
      operationalComplexity: complexityScore,
      crossDefaultRisk: crossDefaultRisks,
      marketCycleExposure
    },
    optimizationOpportunities
  };
}

/**
 * Cross-use synergy and conflict analysis
 */
export function analyzeCrossUseInteractions(
  components: MixedUseComponent[],
  tenantData: {
    office?: OfficeTenant[];
    retail?: RetailTenant[];
    residential?: ResidentialUnit[];
  },
  sharedAmenities: {
    name: string;
    location: string;
    accessibleTo: string[];
    operatingHours: string;
    cost: number;
  }[]
): CrossUseAnalysis {
  const synergies: CrossUseAnalysis['synergies'] = [];
  const conflicts: CrossUseAnalysis['conflicts'] = [];
  
  // Identify synergies
  const hasOffice = components.some(c => c.type === 'Office');
  const hasRetail = components.some(c => c.type === 'Retail');
  const hasResidential = components.some(c => c.type === 'Residential');
  
  // Office-Retail synergies
  if (hasOffice && hasRetail) {
    synergies.push({
      description: 'Lunchtime retail traffic from office workers',
      beneficiary: ['Retail'],
      valueAdd: 50000, // Annual value estimate
      implementation: 'Existing'
    });
    
    if (tenantData.retail?.some(t => t.merchandiseType === 'Food')) {
      synergies.push({
        description: 'Catering opportunities for office tenants',
        beneficiary: ['Retail', 'Office'],
        valueAdd: 30000,
        implementation: 'Potential'
      });
    }
  }
  
  // Residential-Retail synergies
  if (hasResidential && hasRetail) {
    synergies.push({
      description: 'Captive customer base for retail',
      beneficiary: ['Retail'],
      valueAdd: 100000,
      implementation: 'Existing'
    });
    
    if (tenantData.retail?.some(t => t.essentialService)) {
      synergies.push({
        description: 'Convenience factor increases residential rents',
        beneficiary: ['Residential'],
        valueAdd: 75000,
        implementation: 'Existing'
      });
    }
  }
  
// All three synergies
if (hasOffice && hasRetail && hasResidential) {
  synergies.push({
    description: '24/7 activity creates vibrant live-work-play environment',
    beneficiary: ['Office', 'Retail', 'Residential'],
    valueAdd: 200000,
    implementation: 'Existing'
  });
  
  synergies.push({
    description: 'Shared amenities reduce per-component costs',
    beneficiary: ['Office', 'Retail', 'Residential'],
    valueAdd: 150000,
    implementation: 'Existing'
  });
}

// Identify conflicts

// Noise conflicts
if (hasResidential && hasRetail) {
  const hasNightlife = tenantData.retail?.some(t => 
    t.merchandiseType === 'Entertainment'
  );
  if (hasNightlife) {
    conflicts.push({
      issue: 'Late-night retail noise affecting residents',
      affected: ['Residential'],
      severity: 'High',
      mitigation: 'Sound insulation, restricted hours, tenant selection'
    });
  }
}

// Parking conflicts
if (components.length > 2) {
  conflicts.push({
    issue: 'Peak parking demand overlap',
    affected: components.map(c => c.type),
    severity: 'Medium',
    mitigation: 'Time-based allocation, validation systems, shared parking agreements'
  });
}

// Loading/service conflicts
if (hasRetail && (hasOffice || hasResidential)) {
  conflicts.push({
    issue: 'Delivery truck routing and timing',
    affected: ['Retail', hasOffice ? 'Office' : 'Residential'],
    severity: 'Medium',
    mitigation: 'Designated delivery hours, separate service entrances'
  });
}

// Security conflicts
if (hasResidential && (hasOffice || hasRetail)) {
  conflicts.push({
    issue: 'Access control for residential security',
    affected: ['Residential'],
    severity: 'Medium',
    mitigation: 'Separate entrances, controlled access points, security protocols'
  });
}

// HVAC scheduling conflicts
if (hasOffice && hasResidential) {
  conflicts.push({
    issue: 'Different HVAC scheduling needs',
    affected: ['Office', 'Residential'],
    severity: 'Low',
    mitigation: 'Zone controls, separate systems for major components'
  });
}

// Analyze shared amenities
const sharedAmenitiesAnalysis = sharedAmenities.map(amenity => {
  const userCount = amenity.accessibleTo.length;
  const costPerUser = amenity.cost / userCount;
  
  // Estimate utilization based on amenity type and users
  let utilization = 50; // Base
  if (amenity.name.includes('Fitness') && amenity.accessibleTo.includes('Residential')) {
    utilization += 20;
  }
  if (amenity.name.includes('Conference') && amenity.accessibleTo.includes('Office')) {
    utilization += 25;
  }
  if (amenity.name.includes('Parking')) {
    utilization = 85; // Parking typically high utilization
  }
  
  // Adjust utilization based on user count (more users = higher utilization)
  if (userCount > 3) utilization += 10;
  if (userCount > 5) utilization += 5;
  
  // Cost sharing based on usage patterns
  const costSharing = new Map<string, number>();
  amenity.accessibleTo.forEach(user => {
    if (user === 'Office' && amenity.name.includes('Conference')) {
      costSharing.set(user, 0.6); // Office pays more for conference facilities
    } else if (user === 'Residential' && amenity.name.includes('Fitness')) {
      costSharing.set(user, 0.5); // Residential pays more for fitness
    } else {
      costSharing.set(user, 1 / userCount); // Equal split
    }
  });
  
  // Normalize cost sharing to sum to 1
  const total = Array.from(costSharing.values()).reduce((sum, v) => sum + v, 0);
  costSharing.forEach((value, key) => {
    costSharing.set(key, value / total);
  });
  
  return {
    amenity: amenity.name,
    users: amenity.accessibleTo,
    utilization: Math.min(100, utilization),
    costPerUser,
    costSharing
  };
});

return {
  synergies,
  conflicts,
  sharedAmenities: sharedAmenitiesAnalysis
};
}

// ==================== OPERATIONAL INTEGRATION ====================

/**
* Operational integration and efficiency analysis
*/
export function analyzeOperationalIntegration(
components: MixedUseComponent[],
sharedSystems: SharedSystems,
management: {
  structure: 'Integrated' | 'Separate' | 'Hybrid';
  propertyManager: string;
  componentManagers?: Map<string, string>;
  staffCount: number;
  sharedStaff: boolean;
},
expenses: {
  category: string;
  amount: number;
  allocation: 'Direct' | 'ProRata' | 'Usage';
  directAssignment?: Map<string, number>;
}[]
): {
integrationEfficiency: {
  score: number; // 0-100
  strengths: string[];
  inefficiencies: string[];
  savingsRealized: number;
  additionalPotential: number;
};
expenseAllocation: {
  component: string;
  directExpenses: number;
  allocatedExpenses: number;
  totalExpenses: number;
  expenseRatio: number;
  allocationMethod: string;
}[];
staffingAnalysis: {
  currentModel: string;
  fteByComponent: Map<string, number>;
  sharedFunctions: string[];
  redundancies: string[];
  optimalStaffing: number;
  savingsOpportunity: number;
};
systemsIntegration: {
  system: string;
  integrationLevel: 'Full' | 'Partial' | 'None';
  efficiency: number;
  issues: string[];
  upgradeROI?: {
    cost: number;
    annualSavings: number;
    payback: number;
  } | undefined;
}[];
bestPractices: {
  practice: string;
  currentlyImplemented: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Medium' | 'Low';
  recommendation: string;
}[];
} {
// Integration efficiency scoring
let integrationScore = 50; // Base
const strengths: string[] = [];
const inefficiencies: string[] = [];

// Management structure scoring
if (management.structure === 'Integrated') {
  integrationScore += 20;
  strengths.push('Unified management structure');
} else if (management.structure === 'Hybrid') {
  integrationScore += 10;
  strengths.push('Balanced management approach');
} else {
  inefficiencies.push('Separate management creates silos');
}

// Shared systems scoring
if (sharedSystems.utilities.masterMetered) {
  integrationScore += 5;
  strengths.push('Master metered utilities');
} else {
  inefficiencies.push('Complex utility submetering');
}

if (sharedSystems.security.integrated) {
  integrationScore += 10;
  strengths.push('Integrated security systems');
} else {
  integrationScore -= 5;
  inefficiencies.push('Fragmented security approach');
}

// Shared staff scoring
if (management.sharedStaff) {
  integrationScore += 10;
  strengths.push('Efficient staff sharing');
} else {
  inefficiencies.push('Duplicated staff functions');
}

// Calculate savings
const integratedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
const standaloneEstimate = integratedExpenses * 1.15; // 15% premium for standalone
const savingsRealized = standaloneEstimate - integratedExpenses;
const additionalPotential = integratedExpenses * 0.05; // 5% additional possible

integrationScore = Math.min(100, Math.max(0, integrationScore));

// Expense allocation analysis
const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
const totalSF = components.reduce((sum, c) => sum + c.squareFootage, 0);

const expenseAllocation = components.map(comp => {
  let directExpenses = 0;
  let allocatedExpenses = 0;
  
  expenses.forEach(expense => {
    if (expense.allocation === 'Direct' && expense.directAssignment) {
      directExpenses += expense.directAssignment.get(comp.type) || 0;
    } else if (expense.allocation === 'ProRata') {
      allocatedExpenses += expense.amount * (comp.squareFootage / totalSF);
    } else if (expense.allocation === 'Usage') {
      // Simplified usage-based allocation
      const usageRatio = comp.type === 'Office' ? 0.4 :
                        comp.type === 'Retail' ? 0.3 : 0.3;
      allocatedExpenses += expense.amount * usageRatio;
    }
  });
  
  const total = directExpenses + allocatedExpenses;
  const revenue = comp.rentPSF ? comp.rentPSF * comp.squareFootage * 12 : comp.noi / 0.6;
  
  return {
    component: comp.type,
    directExpenses,
    allocatedExpenses,
    totalExpenses: total,
    expenseRatio: Number((total / revenue * 100).toFixed(2)),
    allocationMethod: allocatedExpenses > directExpenses ? 'Primarily Allocated' : 'Primarily Direct'
  };
});

// Staffing analysis
const currentFTE = management.staffCount;
const fteByComponent = new Map<string, number>();

// Estimate FTE allocation
if (management.structure === 'Integrated') {
  components.forEach(comp => {
    fteByComponent.set(comp.type, currentFTE * (comp.squareFootage / totalSF));
  });
} else if (management.componentManagers) {
  // Would need actual data, using estimates
  components.forEach(comp => {
    const baseStaff = comp.squareFootage / 50000; // 1 per 50k SF
    fteByComponent.set(comp.type, baseStaff);
  });
}

const sharedFunctions = management.sharedStaff ? 
  ['Accounting', 'Marketing', 'Maintenance', 'Security'] : [];

const redundancies = management.structure === 'Separate' ?
  ['Multiple accounting systems', 'Separate maintenance teams', 'Duplicated admin'] : [];

// Optimal staffing calculation
const optimalStaffing = Math.ceil(totalSF / 40000); // 1 per 40k SF for mixed-use
const currentCost = currentFTE * 50000; // Assumed average salary
const optimalCost = optimalStaffing * 50000;
const savingsOpportunity = currentCost - optimalCost;

// Systems integration analysis
const systemsToAnalyze = [
  { name: 'HVAC', system: sharedSystems.hvac },
  { name: 'Security', system: sharedSystems.security },
  { name: 'Parking', system: sharedSystems.parking },
  { name: 'Utilities', system: sharedSystems.utilities }
];

const systemsIntegration = systemsToAnalyze.map(({ name, system }) => {
  let integrationLevel: 'Full' | 'Partial' | 'None' = 'None';
  let efficiency = 50;
  const issues: string[] = [];
  
  // Analyze system integration based on its configuration
  if (system && typeof system === 'object') {
    // Check if system has integration indicators
    const hasIntegration = Object.values(system).some(value => 
      typeof value === 'boolean' && value === true
    );
    if (hasIntegration) {
      integrationLevel = 'Partial';
      efficiency += 20;
    }
  }
  
  switch (name) {
    case 'HVAC':
      if (sharedSystems.hvac.type === 'Central') {
        integrationLevel = 'Full';
        efficiency = 85;
      } else if (sharedSystems.hvac.type === 'Hybrid') {
        integrationLevel = 'Partial';
        efficiency = 70;
        issues.push('Some separate systems increase complexity');
      } else {
        integrationLevel = 'None';
        efficiency = 50;
        issues.push('Separate systems miss efficiency opportunities');
      }
      break;
      
    case 'Security':
      if (sharedSystems.security.integrated) {
        integrationLevel = 'Full';
        efficiency = 90;
      } else {
        integrationLevel = 'Partial';
        efficiency = 60;
        issues.push('Multiple access systems');
        issues.push('Coordination challenges');
      }
      break;
      
    case 'Parking':
      if (sharedSystems.parking.validationSystem) {
        integrationLevel = 'Full';
        efficiency = 80;
      } else if (sharedSystems.parking.separateLevels) {
        integrationLevel = 'Partial';
        efficiency = 65;
        issues.push('Underutilized during off-peak');
      } else {
        integrationLevel = 'None';
        efficiency = 50;
        issues.push('No sharing between uses');
      }
      break;
      
    case 'Utilities':
      if (sharedSystems.utilities.masterMetered) {
        integrationLevel = 'Full';
        efficiency = 75;
      } else {
        integrationLevel = 'Partial';
        efficiency = 60;
        issues.push('Complex billing reconciliation');
      }
      break;
  }
  
  // Calculate upgrade ROI for non-integrated systems
  let upgradeROI: { cost: number; annualSavings: number; payback: number; } | undefined = undefined;
  if (integrationLevel !== 'Full') {
    const upgradeCost = totalSF * (name === 'HVAC' ? 15 : 5);
    const currentInefficiency = (100 - efficiency) / 100;
    const annualSavings = totalExpenses * 0.02 * currentInefficiency; // 2% of expenses per inefficiency point
    
    upgradeROI = {
      cost: upgradeCost,
      annualSavings,
      payback: Number((upgradeCost / annualSavings).toFixed(1))
    };
  }
  
  return {
    system: name,
    integrationLevel,
    efficiency,
    issues,
    upgradeROI
  };
});

// Best practices assessment
const bestPractices = [
  {
    practice: 'Unified property management system',
    currentlyImplemented: management.structure === 'Integrated',
    difficulty: 'Medium' as const,
    impact: 'High' as const,
    recommendation: 'Implement integrated software platform for all components'
  },
  {
    practice: 'Shared parking optimization',
    currentlyImplemented: sharedSystems.parking.validationSystem,
    difficulty: 'Easy' as const,
    impact: 'High' as const,
    recommendation: 'Use dynamic pricing and time-based allocation'
  },
  {
    practice: 'Integrated maintenance team',
    currentlyImplemented: management.sharedStaff,
    difficulty: 'Easy' as const,
    impact: 'Medium' as const,
    recommendation: 'Cross-train maintenance staff for all components'
  },
  {
    practice: 'Centralized vendor management',
    currentlyImplemented: management.structure !== 'Separate',
    difficulty: 'Easy' as const,
    impact: 'Medium' as const,
    recommendation: 'Consolidate vendors for volume discounts'
  },
  {
    practice: 'Energy management system',
    currentlyImplemented: sharedSystems.hvac.type === 'Central',
    difficulty: 'Hard' as const,
    impact: 'High' as const,
    recommendation: 'Install building-wide BMS with component submetering'
  },
  {
    practice: 'Integrated marketing strategy',
    currentlyImplemented: management.structure === 'Integrated',
    difficulty: 'Medium' as const,
    impact: 'Medium' as const,
    recommendation: 'Market property as lifestyle destination'
  }
];

return {
  integrationEfficiency: {
    score: integrationScore,
    strengths,
    inefficiencies,
    savingsRealized,
    additionalPotential
  },
  expenseAllocation,
  staffingAnalysis: {
    currentModel: management.structure,
    fteByComponent,
    sharedFunctions,
    redundancies,
    optimalStaffing,
    savingsOpportunity
  },
  systemsIntegration,
  bestPractices: bestPractices.sort((a, b) => {
    const impactOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2 };
    return impactOrder[a.impact] - impactOrder[b.impact] || 
           difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  })
};
}

// ==================== DEVELOPMENT & REPOSITIONING ====================

/**
* Mixed-use development and repositioning analysis
*/
export function analyzeMixedUseDevelopment(
currentState: {
  components: MixedUseComponent[];
  totalSF: number;
  landArea: number;
  far: number;
  height: number;
  parkingSpaces: number;
},
zoning: {
  maxFAR: number;
  maxHeight: number;
  allowedUses: string[];
  bonusFAR?: number; // for affordable housing, etc.
  parkingRequirements: Map<string, number>; // use -> spaces per 1000 SF
},
marketDemand: {
  componentType: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  achievableRent: number;
  absorptionMonths: number;
}[],
constructionCosts: Map<string, number> // use -> $/SF
): {
developmentPotential: {
  additionalFAR: number;
  additionalSF: number;
  optimalMix: {
    use: string;
    squareFootage: number;
    floors: number;
    estimatedNOI: number;
  }[];
  totalDevelopmentCost: number;
  stabilizedNOI: number;
  developmentYield: number;
};
conversionOpportunities: {
  fromUse: string;
  toUse: string;
  squareFootage: number;
  conversionCost: number;
  noiImprovement: number;
  paybackPeriod: number;
  feasibility: 'High' | 'Medium' | 'Low';
}[];
phasingStrategy: {
  phase: number;
  description: string;
  components: string[];
  capEx: number;
  timeline: string;
  preLeasingRequired: number; // percentage
}[];
valueCreation: {
  currentValue: number;
  projectedValue: number;
  totalInvestment: number;
  valueAdd: number;
  irr: number;
  equityMultiple: number;
};
riskMitigation: {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  mitigation: string;
}[];
} {
// Calculate development potential
const maxBuildableSF = currentState.landArea * 43560 * zoning.maxFAR;
const currentFAR = currentState.totalSF / (currentState.landArea * 43560);
const additionalFAR = zoning.maxFAR - currentFAR;
const additionalSF = Math.max(0, maxBuildableSF - currentState.totalSF);

// Determine optimal mix based on demand
const optimalMix: any[] = [];
let remainingSF = additionalSF;

// Sort by demand level and achievable rent
const sortedDemand = [...marketDemand].sort((a, b) => {
  const demandScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
  return demandScore[b.demandLevel] - demandScore[a.demandLevel] ||
         b.achievableRent - a.achievableRent;
});

sortedDemand.forEach(demand => {
  if (remainingSF > 0 && zoning.allowedUses.includes(demand.componentType)) {
    const allocatedSF = Math.min(remainingSF, additionalSF * 0.4); // Max 40% per use
    const floors = Math.floor(allocatedSF / 20000); // Assume 20k SF floor plates
    const rentableSF = allocatedSF * 0.85; // 85% efficiency
    const estimatedNOI = rentableSF * demand.achievableRent * 0.92 * 0.65; // 92% occ, 65% margin
    
    optimalMix.push({
      use: demand.componentType,
      squareFootage: allocatedSF,
      floors,
      estimatedNOI
    });
    
    remainingSF -= allocatedSF;
  }
});

// Calculate development metrics
const totalDevelopmentCost = optimalMix.reduce((sum, component) => {
  const costPSF = constructionCosts.get(component.use) || 200;
  return sum + (component.squareFootage * costPSF);
}, 0);

const stabilizedNOI = optimalMix.reduce((sum, c) => sum + c.estimatedNOI, 0);
const developmentYield = (stabilizedNOI / totalDevelopmentCost) * 100;

// Identify conversion opportunities
const conversionOpportunities: any[] = [];

currentState.components.forEach(component => {
  // Check underperforming components
  if (component.occupancy < 75 || component.capRate > 8) {
    sortedDemand.forEach(demand => {
      if (demand.componentType !== component.type && 
          demand.demandLevel === 'High' &&
          zoning.allowedUses.includes(demand.componentType)) {
        
        const conversionCostPSF = getConversionCost(component.type, demand.componentType);
        const conversionCost = component.squareFootage * conversionCostPSF;
        const newNOI = component.squareFootage * 0.85 * demand.achievableRent * 0.9 * 0.65;
        const noiImprovement = newNOI - component.noi;
        const paybackPeriod = conversionCost / noiImprovement;
        
        const feasibility = paybackPeriod < 5 ? 'High' :
                           paybackPeriod < 8 ? 'Medium' : 'Low';
        
        conversionOpportunities.push({
          fromUse: component.type,
          toUse: demand.componentType,
          squareFootage: component.squareFootage,
          conversionCost,
          noiImprovement,
          paybackPeriod: Number(paybackPeriod.toFixed(1)),
          feasibility
        });
      }
    });
  }
});

// Phasing strategy
const totalProject = [...optimalMix, ...conversionOpportunities];
const phases = [];

if (totalProject.length > 0) {
  // Phase 1: Highest return conversions
  const phase1Conversions = conversionOpportunities
    .filter(c => c.feasibility === 'High')
    .slice(0, 2);
  
  if (phase1Conversions.length > 0) {
    phases.push({
      phase: 1,
      description: 'High-return conversions',
      components: phase1Conversions.map(c => `${c.fromUse} to ${c.toUse}`),
      capEx: phase1Conversions.reduce((sum, c) => sum + c.conversionCost, 0),
      timeline: '0-12 months',
      preLeasingRequired: 0
    });
  }
  
  // Phase 2: New development
  if (optimalMix.length > 0) {
    const phase2Components = optimalMix.slice(0, 2);
    phases.push({
      phase: phases.length + 1,
      description: 'New development - Phase 1',
      components: phase2Components.map(c => c.use),
      capEx: phase2Components.reduce((sum, c) => 
        sum + c.squareFootage * (constructionCosts.get(c.use) || 200), 0
      ),
      timeline: '12-30 months',
      preLeasingRequired: 40
    });
  }
  
  // Phase 3: Remaining development
  if (optimalMix.length > 2) {
    const phase3Components = optimalMix.slice(2);
    phases.push({
      phase: phases.length + 1,
      description: 'New development - Phase 2',
      components: phase3Components.map(c => c.use),
      capEx: phase3Components.reduce((sum, c) => 
        sum + c.squareFootage * (constructionCosts.get(c.use) || 200), 0
      ),
      timeline: '30-48 months',
      preLeasingRequired: 50
    });
  }
}

// Value creation analysis
const currentNOI = currentState.components.reduce((sum, c) => sum + c.noi, 0);
const currentValue = currentNOI / 0.065; // 6.5% cap rate

const projectedNOI = currentNOI + stabilizedNOI + 
  conversionOpportunities.reduce((sum, c) => sum + c.noiImprovement, 0);
const projectedValue = projectedNOI / 0.055; // 5.5% cap rate for stabilized mixed-use

const totalInvestment = totalDevelopmentCost + 
  conversionOpportunities.reduce((sum, c) => sum + c.conversionCost, 0);

const valueAdd = projectedValue - currentValue - totalInvestment;

// Simple IRR calculation
const holdPeriod = 5;
const avgAnnualCashFlow = (currentNOI + projectedNOI) / 2;
const totalReturn = projectedValue - currentValue + (avgAnnualCashFlow * holdPeriod);
const irr = Math.pow(totalReturn / currentValue, 1/holdPeriod) - 1;
const equityMultiple = totalReturn / (currentValue * 0.3); // Assume 30% equity

// Risk mitigation
const riskMitigation = [
  {
    risk: 'Construction cost overruns',
    impact: 'High' as const,
    probability: 'Medium' as const,
    mitigation: 'Fixed-price contracts, 10% contingency, value engineering'
  },
  {
    risk: 'Leasing delays',
    impact: 'Medium' as const,
    probability: 'Medium' as const,
    mitigation: 'Pre-leasing requirements, anchor tenant LOIs, marketing budget'
  },
  {
    risk: 'Market downturn',
    impact: 'High' as const,
    probability: 'Low' as const,
    mitigation: 'Phased development, diverse component mix, flexible spaces'
  },
  {
    risk: 'Zoning/permitting delays',
    impact: 'Medium' as const,
    probability: 'Medium' as const,
    mitigation: 'Early engagement, experienced team, contingency timeline'
  },
  {
    risk: 'Integration complexity',
    impact: 'Medium' as const,
    probability: 'High' as const,
    mitigation: 'Experienced mixed-use operator, detailed planning, technology systems'
  }
];

return {
  developmentPotential: {
    additionalFAR: Number(additionalFAR.toFixed(2)),
    additionalSF: Math.round(additionalSF),
    optimalMix,
    totalDevelopmentCost,
    stabilizedNOI: Math.round(stabilizedNOI),
    developmentYield: Number(developmentYield.toFixed(2))
  },
  conversionOpportunities: conversionOpportunities
    .sort((a, b) => a.paybackPeriod - b.paybackPeriod)
    .slice(0, 5), // Top 5 opportunities
  phasingStrategy: phases,
  valueCreation: {
    currentValue: Math.round(currentValue),
    projectedValue: Math.round(projectedValue),
    totalInvestment: Math.round(totalInvestment),
    valueAdd: Math.round(valueAdd),
    irr: Number((irr * 100).toFixed(2)),
    equityMultiple: Number(equityMultiple.toFixed(2))
  },
  riskMitigation
};
}

// ==================== HELPER FUNCTIONS ====================

function calculateOperationalSynergies(
components: MixedUseComponent[],
sharedSystems: SharedSystems
): number {
let synergies = 0;

// Shared HVAC savings
if (sharedSystems.hvac.type === 'Central') {
  synergies += components.length * 50000; // $50k per component vs separate
}

// Integrated security savings
if (sharedSystems.security.integrated) {
  synergies += 100000; // Vs separate security systems
}

// Shared parking efficiency
if (sharedSystems.parking.validationSystem) {
  const totalSpaces = sharedSystems.parking.totalSpaces;
  const requiredIfSeparate = totalSpaces * 1.3; // 30% more if not shared
  synergies += (requiredIfSeparate - totalSpaces) * 20000; // $20k per space
}

return synergies;
}

function calculateRevenueSynergies(components: MixedUseComponent[]): number {
let synergies = 0;

// Cross-component customer base
const hasRetail = components.some(c => c.type === 'Retail');
const hasOffice = components.some(c => c.type === 'Office');
const hasResidential = components.some(c => c.type === 'Residential');

if (hasRetail && hasOffice) {
  const officeSF = components.find(c => c.type === 'Office')?.squareFootage || 0;
  synergies += officeSF * 0.5; // $0.50/SF retail benefit
}

if (hasRetail && hasResidential) {
  const resSF = components.find(c => c.type === 'Residential')?.squareFootage || 0;
  synergies += resSF * 0.75; // $0.75/SF retail benefit
}

if (hasResidential && (hasRetail || hasOffice)) {
  const resSF = components.find(c => c.type === 'Residential')?.squareFootage || 0;
  synergies += resSF * 1.0; // $1/SF rent premium for amenities
}

return synergies;
}

function calculateCostSynergies(
components: MixedUseComponent[],
sharedSystems: SharedSystems
): number {
let synergies = 0;
const totalSF = components.reduce((sum, c) => sum + c.squareFootage, 0);

// Economies of scale in operations
synergies += totalSF * 0.25; // $0.25/SF from bulk purchasing

// Shared utilities infrastructure
if (sharedSystems.utilities.masterMetered) {
  synergies += 75000; // Avoid separate utility setups
}

// Combined insurance
synergies += components.length * 25000; // Insurance savings

return synergies;
}

function identifyOptimizationOpportunities(
components: MixedUseComponent[],
sharedSystems: SharedSystems,
performance: any[]
): any[] {
const opportunities = [];

// Parking optimization
if (!sharedSystems.parking.validationSystem) {
  opportunities.push({
    opportunity: 'Implement dynamic parking allocation',
    components: components.map(c => c.type),
    potentialValue: 150000,
    implementation: 'Install validation system, time-based pricing',
    timeline: '3-6 months'
  });
}

// Energy efficiency
if (sharedSystems.hvac.type !== 'Central') {
  opportunities.push({
    opportunity: 'Centralize HVAC systems',
    components: components.map(c => c.type),
    potentialValue: 200000,
    implementation: 'Phased conversion to central plant',
    timeline: '12-24 months'
  });
}

// Underperforming component
const weakest = performance.reduce((min, p) => 
  p.noiContribution < min.noiContribution ? p : min
);

if (weakest.performanceRating === 'Underperforming') {
  opportunities.push({
    opportunity: `Reposition ${weakest.component} component`,
    components: [weakest.component],
    potentialValue: weakest.noiContribution * 0.3 * 1000000, // 30% improvement potential
    implementation: 'Renovation, re-tenanting, or conversion',
    timeline: '6-18 months'
  });
}

return opportunities.sort((a, b) => b.potentialValue - a.potentialValue);
}

function getConversionCost(fromUse: string, toUse: string): number {
const conversionMatrix: Record<string, Record<string, number>> = {
  'Office': {
    'Residential': 150,
    'Retail': 100,
    'Hotel': 200
  },
  'Retail': {
    'Office': 125,
    'Residential': 175,
    'Entertainment': 100
  },
  'Residential': {
    'Office': 150,
    'Hotel': 125,
    'Senior Living': 100
  }
};

return conversionMatrix[fromUse]?.[toUse] || 150; // Default $150/SF
}