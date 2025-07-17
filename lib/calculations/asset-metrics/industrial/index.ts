// lib/calculations/asset-metrics/industrial/index.ts
// Comprehensive industrial property analytics for institutional investors

// Types are defined locally to avoid unused imports
import type { PropertyRequirements as BasePropertyRequirements } from '../../types';

// ==================== TYPE DEFINITIONS ====================

export interface PropertyRequirements extends BasePropertyRequirements {
  idealPowerPerSF?: number;
  minPowerPerSF?: number;
  idealDockRatio?: number;
  minDockRatio?: number;
  idealClearHeight?: number;
  minClearHeight?: number;
}

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
  leaseExpirationDate: Date;
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

// ==================== FUNCTIONAL ANALYSIS ====================

/**
 * Comprehensive building functionality and efficiency analysis
 */
export function analyzeBuildingFunctionality(
  specs: BuildingSpecs,
  tenants: IndustrialTenant[],
  propertyType: 'Warehouse' | 'Manufacturing' | 'Flex' | 'Cold Storage' | 'Last Mile'
): {
  functionalScore: {
    overall: number; // 0-100
    clearHeight: number;
    loading: number;
    power: number;
    layout: number;
    specialFeatures: number;
  };
  tenantSuitability: {
    tenant: string;
    requirementsMet: number; // percentage
    gaps: string[];
    criticalGaps: boolean;
  }[];
  marketPositioning: {
    classification: 'Class A' | 'Class B' | 'Class C';
    competitiveAdvantages: string[];
    functionalObsolescence: string[];
    modernizationNeeds: {
      item: string;
      cost: number;
      impact: 'Critical' | 'High' | 'Medium' | 'Low';
    }[];
  };
  efficiency: {
    cubicFootage: number;
    cubicFootPerDock: number;
    dockDoorRatio: number; // per 10k SF
    employeeParkingRatio: number;
    trailerParkingRatio: number;
    columnEfficiency: number; // % of space between columns
  };
} {
  // Calculate cubic footage
  const cubicFootage = specs.totalSF * specs.clearHeight;
  const cubicFootPerDock = specs.dockDoors > 0 ? cubicFootage / specs.dockDoors : 0;
  const dockDoorRatio = (specs.dockDoors / specs.totalSF) * 10000;
  
  // Calculate functional scores based on property type requirements
  const typeRequirements = getPropertyTypeRequirements(propertyType);
  
  // Clear height scoring
  let clearHeightScore = 0;
  if (typeRequirements && specs.clearHeight >= (typeRequirements.idealClearHeight || 0)) {
    clearHeightScore = 100;
  } else if (typeRequirements && specs.clearHeight >= (typeRequirements.minClearHeight || 0)) {
    clearHeightScore = 50 + ((specs.clearHeight - (typeRequirements.minClearHeight || 0)) / 
                            ((typeRequirements.idealClearHeight || 0) - (typeRequirements.minClearHeight || 0))) * 50;
  } else if (typeRequirements && typeRequirements.minClearHeight) {
    clearHeightScore = (specs.clearHeight / typeRequirements.minClearHeight) * 50;
  }
  
  // Loading scoring
  let loadingScore = 0;
  const idealDockRatio = typeRequirements?.idealDockRatio || 1;
  if (dockDoorRatio >= idealDockRatio) {
    loadingScore = 100;
  } else {
    loadingScore = (dockDoorRatio / idealDockRatio) * 100;
  }
  
  // Truck court scoring
  if (specs.truckCourtDepth >= 130) {
    loadingScore = loadingScore * 1.0;
  } else if (specs.truckCourtDepth >= 120) {
    loadingScore = loadingScore * 0.9;
  } else if (specs.truckCourtDepth >= 110) {
    loadingScore = loadingScore * 0.7;
  } else {
    loadingScore = loadingScore * 0.5;
  }
  
  // Power scoring
  let powerScore = 0;
  const powerPerSF = specs.powerCapacity * 1000 / specs.totalSF; // Watts per SF
  if (typeRequirements && powerPerSF >= (typeRequirements.idealPowerPerSF || 0)) {
    powerScore = 100;
  } else if (typeRequirements && powerPerSF >= (typeRequirements.minPowerPerSF || 0)) {
    powerScore = 50 + ((powerPerSF - (typeRequirements.minPowerPerSF || 0)) / 
                       ((typeRequirements.idealPowerPerSF || 0) - (typeRequirements.minPowerPerSF || 0))) * 50;
  } else if (typeRequirements && typeRequirements.minPowerPerSF) {
    powerScore = (powerPerSF / typeRequirements.minPowerPerSF) * 50;
  }
  
  // Layout scoring
  let layoutScore = 70; // Base score
  const [columnWidth, columnDepth] = specs.columnSpacing.split('x').map(Number);
  const columnArea = (columnWidth || 0) * (columnDepth || 0);
  
  if (columnArea >= 3000) layoutScore += 20;
  else if (columnArea >= 2000) layoutScore += 10;
  
  if (specs.bayDepth >= 48) layoutScore += 10;
  else if (specs.bayDepth >= 40) layoutScore += 5;
  
  layoutScore = Math.min(100, layoutScore);
  
  // Special features scoring
  let specialScore = 50; // Base
  if (specs.fireSuppressionType === 'ESFR') specialScore += 20;
  if (specs.lightingType === 'LED') specialScore += 10;
  if (specs.railSiding) specialScore += 10;
  if (specs.craneSystem) specialScore += 10;
  
  // Overall functional score
  const weights = {
    clearHeight: 0.25,
    loading: 0.25,
    power: 0.20,
    layout: 0.20,
    special: 0.10
  };
  
  const overallScore = 
    clearHeightScore * weights.clearHeight +
    loadingScore * weights.loading +
    powerScore * weights.power +
    layoutScore * weights.layout +
    specialScore * weights.special;
  
  // Tenant suitability analysis
  const tenantSuitability = tenants.map(tenant => {
    const gaps: string[] = [];
    let requirementsMet = 100;
    
    // Check clear height
    if (specs.clearHeight < tenant.clearHeightRequired) {
      gaps.push(`Clear height ${specs.clearHeight}' < required ${tenant.clearHeightRequired}'`);
      requirementsMet -= 25;
    }
    
    // Check dock doors
    if (specs.dockDoors < tenant.dockDoorsRequired) {
      gaps.push(`${specs.dockDoors} dock doors < required ${tenant.dockDoorsRequired}`);
      requirementsMet -= 20;
    }
    
    // Check power
    const tenantPowerNeed = (tenant.powerRequirement || 0) * tenant.squareFootage / 1000;
    const availablePower = specs.powerCapacity * (tenant.squareFootage / specs.totalSF);
    if (availablePower < tenantPowerNeed) {
      gaps.push(`Insufficient power capacity`);
      requirementsMet -= 15;
    }
    
    // Check specialized needs
    if (tenant.railAccess && !specs.railSiding) {
      gaps.push(`No rail access available`);
      requirementsMet -= 20;
    }
    
    if (tenant.temperatureControl && tenant.temperatureControl !== 'Ambient' && !specs.coldStorage) {
      gaps.push(`No temperature-controlled space`);
      requirementsMet -= 30;
    }
    
    requirementsMet = Math.max(0, requirementsMet);
    const criticalGaps = requirementsMet < 70;
    
    return {
      tenant: tenant.tenantName,
      requirementsMet,
      gaps,
      criticalGaps
    };
  });
  
  // Market positioning
  let classification: 'Class A' | 'Class B' | 'Class C';
  if (overallScore >= 85 && specs.clearHeight >= 32) {
    classification = 'Class A';
  } else if (overallScore >= 70 && specs.clearHeight >= 24) {
    classification = 'Class B';
  } else {
    classification = 'Class C';
  }
  
  // Competitive advantages
  const competitiveAdvantages = [];
  if (specs.clearHeight >= 36) competitiveAdvantages.push('36\'+ clear height');
  if (dockDoorRatio >= 1.5) competitiveAdvantages.push('Abundant loading');
  if (specs.truckCourtDepth >= 130) competitiveAdvantages.push('Deep truck courts');
  if (specs.railSiding) competitiveAdvantages.push('Rail-served');
  if (specs.fireSuppressionType === 'ESFR') competitiveAdvantages.push('ESFR sprinklers');
  if (specs.lightingType === 'LED') competitiveAdvantages.push('LED lighting');
  if (powerPerSF >= 5) competitiveAdvantages.push('High power capacity');
  
  // Functional obsolescence
  const functionalObsolescence = [];
  if (specs.clearHeight < 24) functionalObsolescence.push('Low clear height');
  if (dockDoorRatio < 1.0) functionalObsolescence.push('Insufficient dock doors');
  if (specs.truckCourtDepth < 120) functionalObsolescence.push('Shallow truck courts');
  if (columnArea < 2000) functionalObsolescence.push('Tight column spacing');
  if (specs.lightingType !== 'LED') functionalObsolescence.push('Outdated lighting');
  
  // Modernization needs
  const modernizationNeeds = [];
  
  if (typeRequirements && specs.clearHeight < (typeRequirements.minClearHeight || 0)) {
    modernizationNeeds.push({
      item: 'Raise roof/clear height',
      cost: specs.totalSF * 25,
      impact: 'Critical' as const
    });
  }
  
  if (dockDoorRatio < 1.0) {
    const doorsNeeded = Math.ceil((specs.totalSF / 10000) - specs.dockDoors);
    modernizationNeeds.push({
      item: `Add ${doorsNeeded} dock doors`,
      cost: doorsNeeded * 25000,
      impact: 'High' as const
    });
  }
  
  if (specs.lightingType !== 'LED') {
    modernizationNeeds.push({
      item: 'LED lighting retrofit',
      cost: specs.totalSF * 2.5,
      impact: 'Medium' as const
    });
  }
  
  if (typeRequirements && powerPerSF < (typeRequirements.minPowerPerSF || 0)) {
    modernizationNeeds.push({
      item: 'Electrical service upgrade',
      cost: specs.totalSF * 5,
      impact: 'High' as const
    });
  }
  
  // Calculate efficiency metrics
  const totalEmployees = tenants.reduce((sum, t) => sum + t.employeeCount, 0);
  const totalParkingNeeded = tenants.reduce((sum, t) => sum + t.parkingRequired, 0);
  const totalTrailerParking = Math.ceil(specs.dockDoors * 1.5);
  
  const employeeParkingRatio = totalParkingNeeded / totalEmployees;
  const trailerParkingRatio = totalTrailerParking / specs.dockDoors;
  const columnEfficiency = calculateColumnEfficiency(columnWidth, columnDepth, specs.totalSF);
  
  return {
    functionalScore: {
      overall: Number(overallScore.toFixed(1)),
      clearHeight: Number(clearHeightScore.toFixed(1)),
      loading: Number(loadingScore.toFixed(1)),
      power: Number(powerScore.toFixed(1)),
      layout: Number(layoutScore.toFixed(1)),
      specialFeatures: Number(specialScore.toFixed(1))
    },
    tenantSuitability,
    marketPositioning: {
      classification,
      competitiveAdvantages,
      functionalObsolescence,
      modernizationNeeds: modernizationNeeds.sort((a, b) => {
        const impactOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      })
    },
    efficiency: {
      cubicFootage,
      cubicFootPerDock: Number(cubicFootPerDock.toFixed(0)),
      dockDoorRatio: Number(dockDoorRatio.toFixed(2)),
      employeeParkingRatio: Number(employeeParkingRatio.toFixed(1)),
      trailerParkingRatio: Number(trailerParkingRatio.toFixed(1)),
      columnEfficiency: Number(columnEfficiency.toFixed(1))
    }
  };
}

/**
 * Location and logistics analysis
 */
export function analyzeLocationLogistics(
  location: LocationMetrics,
  propertyType: string,
  tenants: IndustrialTenant[]
): {
  locationScore: {
    overall: number;
    transportation: number;
    labor: number;
    market: number;
  };
  logisticsProfile: {
    lastMileSuitability: number;
    regionalDistribution: number;
    nationalDistribution: number;
    manufacturingSuitability: number;
  };
  laborAnalysis: {
    availability: 'Abundant' | 'Adequate' | 'Tight' | 'Critical';
    costCompetitiveness: number; // percentile
    skillMatch: string[];
    risks: string[];
  };
  marketDynamics: {
    supplyDemandBalance: 'Oversupplied' | 'Balanced' | 'Undersupplied';
    rentGrowthPotential: number;
    occupancyOutlook: 'Strengthening' | 'Stable' | 'Weakening';
    competitiveThreats: string[];
  };
  strategicValue: {
    eCommerceFulfillment: number; // 0-100
    portProximity: number;
    intermodalAccess: number;
    distributionReach: {
      oneDay: number; // population
      twoDay: number;
    };
  };
} {
  // Transportation scoring
  let transportationScore = 50; // Base
  
  // Adjust scoring based on property type requirements
  const isLastMile = propertyType.toLowerCase().includes('last mile');
  const isDistribution = propertyType.toLowerCase().includes('warehouse') || propertyType.toLowerCase().includes('distribution');
  const isManufacturing = propertyType.toLowerCase().includes('manufacturing');
  
  // Highway access is critical
  if (location.distanceToHighway <= 1) transportationScore += 30;
  else if (location.distanceToHighway <= 3) transportationScore += 20;
  else if (location.distanceToHighway <= 5) transportationScore += 10;
  else transportationScore -= 10;
  
  // Property type specific adjustments
  if (isLastMile && location.distanceToHighway <= 0.5) transportationScore += 10; // Last mile needs ultra-close highway access
  if (isDistribution && location.distanceToPort && location.distanceToPort <= 50) transportationScore += 15; // Distribution benefits from port access
  if (isManufacturing && location.distanceToRail && location.distanceToRail <= 2) transportationScore += 20; // Manufacturing benefits from rail
  
  // Additional transportation modes
  if (location.distanceToPort && location.distanceToPort <= 25) transportationScore += 10;
  if (location.distanceToRail && location.distanceToRail <= 1) transportationScore += 10;
  
  transportationScore = Math.min(100, Math.max(0, transportationScore));
  
  // Labor scoring
  let laborScore = 50; // Base
  
  // Population availability
  if (location.populationOneHour >= 1000000) laborScore += 20;
  else if (location.populationOneHour >= 500000) laborScore += 10;
  else if (location.populationOneHour < 250000) laborScore -= 10;
  
  // Wage competitiveness (compared to national average)
  const nationalAvgWage = 18.50;
  const wageRatio = location.averageWage / nationalAvgWage;
  if (wageRatio < 0.9) laborScore += 15;
  else if (wageRatio < 1.0) laborScore += 10;
  else if (wageRatio > 1.2) laborScore -= 10;
  
  // Unemployment as proxy for availability
  if (location.unemploymentRate > 5) laborScore += 10;
  else if (location.unemploymentRate < 3) laborScore -= 5;
  
  laborScore = Math.min(100, Math.max(0, laborScore));
  
  // Market scoring
  let marketScore = 50; // Base
  
  // Vacancy rate
  if (location.vacancyRate < 3) marketScore += 20;
  else if (location.vacancyRate < 5) marketScore += 10;
  else if (location.vacancyRate > 10) marketScore -= 20;
  else if (location.vacancyRate > 7) marketScore -= 10;
  
  // Net absorption
  const absorptionRatio = location.netAbsorption12Mo / location.totalInventorySF;
  if (absorptionRatio > 0.03) marketScore += 15;
  else if (absorptionRatio > 0.01) marketScore += 10;
  else if (absorptionRatio < -0.01) marketScore -= 10;
  
  // Supply pipeline
  const pipelineRatio = location.underConstruction / location.totalInventorySF;
  if (pipelineRatio < 0.02) marketScore += 10;
  else if (pipelineRatio > 0.05) marketScore -= 10;
  else if (pipelineRatio > 0.08) marketScore -= 20;
  
  marketScore = Math.min(100, Math.max(0, marketScore));
  
  // Overall location score
  const overallLocationScore = (transportationScore * 0.4) + (laborScore * 0.3) + (marketScore * 0.3);
  
  // Logistics profile scoring
  const lastMileSuitability = calculateLastMileSuitability(location, transportationScore);
  const regionalDistribution = calculateRegionalSuitability(location, transportationScore);
  const nationalDistribution = calculateNationalSuitability(location, transportationScore);
  const manufacturingSuitability = calculateManufacturingSuitability(location, laborScore);
  
  // Labor analysis
  let laborAvailability: 'Abundant' | 'Adequate' | 'Tight' | 'Critical';
  if (location.populationOneHour > 1000000 && location.unemploymentRate > 4) {
    laborAvailability = 'Abundant';
  } else if (location.populationOneHour > 500000 && location.unemploymentRate > 3) {
    laborAvailability = 'Adequate';
  } else if (location.populationOneHour > 250000) {
    laborAvailability = 'Tight';
  } else {
    laborAvailability = 'Critical';
  }
  
  const costCompetitiveness = wageRatio < 0.9 ? 90 :
                             wageRatio < 1.0 ? 75 :
                             wageRatio < 1.1 ? 50 : 25;
  
  // Skill match based on tenant needs
  const skillMatch: string[] = [];
  const hasLogisticsTenants = tenants.some(t => t.industry === 'Logistics' || t.industry === 'Distribution');
  const hasManufacturing = tenants.some(t => t.industry === 'Manufacturing');
  
  if (hasLogisticsTenants) skillMatch.push('Warehouse workers', 'Forklift operators', 'Logistics coordinators');
  if (hasManufacturing) skillMatch.push('Machine operators', 'Quality control', 'Maintenance technicians');
  
  const laborRisks: string[] = [];
  if (location.unemploymentRate < 3) laborRisks.push('Tight labor market');
  if (location.unionPresence) laborRisks.push('Union presence');
  if (wageRatio > 1.2) laborRisks.push('Above-average wage pressure');
  
  // Market dynamics
  let supplyDemandBalance: 'Oversupplied' | 'Balanced' | 'Undersupplied';
  if (location.vacancyRate > 8 || pipelineRatio > 0.08) {
    supplyDemandBalance = 'Oversupplied';
  } else if (location.vacancyRate < 4 && pipelineRatio < 0.03) {
    supplyDemandBalance = 'Undersupplied';
  } else {
    supplyDemandBalance = 'Balanced';
  }
// Continue with market dynamics
const rentGrowthPotential = location.vacancyRate < 5 && absorptionRatio > 0.02 ? 5.0 :
location.vacancyRate < 7 && absorptionRatio > 0 ? 3.0 :
location.vacancyRate > 10 || absorptionRatio < 0 ? 0.0 : 2.0;

let occupancyOutlook: 'Strengthening' | 'Stable' | 'Weakening';
if (absorptionRatio > 0.02 && pipelineRatio < 0.05) {
occupancyOutlook = 'Strengthening';
} else if (absorptionRatio < -0.01 || pipelineRatio > 0.08) {
occupancyOutlook = 'Weakening';
} else {
occupancyOutlook = 'Stable';
}

const competitiveThreats: string[] = [];
if (pipelineRatio > 0.05) competitiveThreats.push(`${(pipelineRatio * 100).toFixed(1)}% new supply coming`);
if (location.vacancyRate > 10) competitiveThreats.push('High existing vacancy');
if (absorptionRatio < 0) competitiveThreats.push('Negative net absorption');

// Strategic value calculation
const eCommerceFulfillment = lastMileSuitability * 0.7 + 
 (location.populationOneHour > 1000000 ? 30 : 15);

const portProximity = location.distanceToPort ? 
Math.max(0, 100 - (location.distanceToPort * 2)) : 0;

const intermodalAccess = location.distanceToIntermodal ?
Math.max(0, 100 - (location.distanceToIntermodal * 10)) : 0;

// Distribution reach (simplified calculation)
const oneDayReach = location.populationOneHour * 20; // Rough multiplier
const twoDayReach = location.populationOneHour * 50;

return {
locationScore: {
overall: Number(overallLocationScore.toFixed(1)),
transportation: Number(transportationScore.toFixed(1)),
labor: Number(laborScore.toFixed(1)),
market: Number(marketScore.toFixed(1))
},
logisticsProfile: {
lastMileSuitability: Number(lastMileSuitability.toFixed(1)),
regionalDistribution: Number(regionalDistribution.toFixed(1)),
nationalDistribution: Number(nationalDistribution.toFixed(1)),
manufacturingSuitability: Number(manufacturingSuitability.toFixed(1))
},
laborAnalysis: {
availability: laborAvailability,
costCompetitiveness,
skillMatch,
risks: laborRisks
},
marketDynamics: {
supplyDemandBalance,
rentGrowthPotential: Number(rentGrowthPotential.toFixed(1)),
occupancyOutlook,
competitiveThreats
},
strategicValue: {
eCommerceFulfillment: Number(eCommerceFulfillment.toFixed(1)),
portProximity: Number(portProximity.toFixed(1)),
intermodalAccess: Number(intermodalAccess.toFixed(1)),
distributionReach: {
oneDay: Math.round(oneDayReach),
twoDay: Math.round(twoDayReach)
}
}
};
}

// ==================== SPECIALIZED INDUSTRIAL ANALYSIS ====================

/**
* Cold storage facility analysis
*/
export function analyzeColdStorage(
coldSpecs: BuildingSpecs['coldStorage'],
totalSF: number,
tenants: IndustrialTenant[],
energyCost: number // $/kWh
): {
operationalMetrics: {
temperatureZoneMix: {
ambient: number;
cooler: number;
freezer: number;
blastFreezer: number;
};
energyIntensity: number; // kWh/SF/year
estimatedEnergyCost: number;
pue: number; // Power Usage Effectiveness
};
refrigerationAnalysis: {
systemRedundancy: 'N+1' | 'N+2' | '2N' | 'None';
backupPowerCoverage: number; // percentage
ammoniaSafety: boolean;
temperatureMonitoring: 'Manual' | 'Automated' | 'IoT-Enabled';
alarmSystems: string[];
};
tenantRequirements: {
tenant: string;
tempRequired: string;
tempProvided: boolean;
capacityAvailable: number; // SF
specialRequirements: string[];
}[];
marketPosition: {
coldStoragePercentage: number;
marketDemandLevel: 'High' | 'Medium' | 'Low';
premiumOverDryWarehouse: number; // percentage
competitiveAdvantages: string[];
};
capExConsiderations: {
equipmentAge: number;
replacementSchedule: {
component: string;
yearsRemaining: number;
estimatedCost: number;
}[];
energyEfficiencyUpgrades: {
upgrade: string;
cost: number;
paybackPeriod: number;
}[];
};
} | null {
if (!coldSpecs) return null;

// Calculate temperature zone mix
const totalColdSF = (coldSpecs.coolerSF || 0) + (coldSpecs.freezerSF || 0) + (coldSpecs.blastFreezerSF || 0);
const ambientSF = totalSF - totalColdSF;

const temperatureZoneMix = {
ambient: Number(((ambientSF / totalSF) * 100).toFixed(1)),
cooler: Number(((coldSpecs.coolerSF / totalSF) * 100).toFixed(1)),
freezer: Number(((coldSpecs.freezerSF / totalSF) * 100).toFixed(1)),
blastFreezer: Number(((coldSpecs.blastFreezerSF || 0) / totalSF * 100).toFixed(1))
};

// Energy intensity calculations (industry averages)
const energyIntensityByType = {
ambient: 15, // kWh/SF/year
cooler: 35,
freezer: 55,
blastFreezer: 85
};

const totalEnergyUsage = 
ambientSF * energyIntensityByType.ambient +
coldSpecs.coolerSF * energyIntensityByType.cooler +
coldSpecs.freezerSF * energyIntensityByType.freezer +
(coldSpecs.blastFreezerSF || 0) * energyIntensityByType.blastFreezer;

const energyIntensity = totalEnergyUsage / totalSF;
const estimatedEnergyCost = totalEnergyUsage * energyCost;

// PUE calculation (simplified)
const totalPowerUsage = totalEnergyUsage * 1.3; // Assume 30% overhead
const itPowerUsage = totalEnergyUsage;
const pue = totalPowerUsage / itPowerUsage;

// System redundancy analysis
let systemRedundancy: 'N+1' | 'N+2' | '2N' | 'None' = 'None';
if (coldSpecs.redundancy) {
if (coldSpecs.redundancy.includes('2N')) systemRedundancy = '2N';
else if (coldSpecs.redundancy.includes('N+2')) systemRedundancy = 'N+2';
else if (coldSpecs.redundancy.includes('N+1')) systemRedundancy = 'N+1';
}

// Backup power coverage (estimated)
const criticalLoad = totalColdSF / totalSF;
const backupPowerCoverage = systemRedundancy !== 'None' ? criticalLoad * 100 : 0;

// Safety and monitoring
const ammoniaSafety = coldSpecs.refrigerationSystem.includes('Ammonia');
const temperatureMonitoring = coldSpecs.refrigerationSystem.includes('IoT') ? 'IoT-Enabled' :
  coldSpecs.refrigerationSystem.includes('Automated') ? 'Automated' : 'Manual';

const alarmSystems = ['Temperature deviation', 'Power failure', 'Refrigerant leak'];
if (ammoniaSafety) alarmSystems.push('Ammonia detection');

// Tenant requirements analysis
const tenantRequirements = tenants.map(tenant => {
const tempRequired = tenant.temperatureControl || 'Ambient';
let tempProvided = false;
let capacityAvailable = 0;

switch (tempRequired) {
case 'Ambient':
tempProvided = true;
capacityAvailable = ambientSF - tenants
.filter(t => t !== tenant && t.temperatureControl === 'Ambient')
.reduce((sum, t) => sum + t.squareFootage, 0);
break;
case 'Cooler':
tempProvided = coldSpecs.coolerSF > 0;
capacityAvailable = coldSpecs.coolerSF - tenants
.filter(t => t !== tenant && t.temperatureControl === 'Cooler')
.reduce((sum, t) => sum + t.squareFootage, 0);
break;
case 'Freezer':
tempProvided = coldSpecs.freezerSF > 0;
capacityAvailable = coldSpecs.freezerSF - tenants
.filter(t => t !== tenant && t.temperatureControl === 'Freezer')
.reduce((sum, t) => sum + t.squareFootage, 0);
break;
}

const specialRequirements: string[] = [];
if (tenant.hazmatPermits) specialRequirements.push('Hazmat storage');
if (tenant.operatingHours === '24/7') specialRequirements.push('24/7 access');
if (tenant.railAccess) specialRequirements.push('Rail access');

return {
tenant: tenant.tenantName,
tempRequired,
tempProvided,
capacityAvailable: Math.max(0, capacityAvailable),
specialRequirements
};
});

// Market positioning
const coldStoragePercentage = (totalColdSF / totalSF) * 100;
const marketDemandLevel = coldStoragePercentage > 50 ? 'High' :
coldStoragePercentage > 20 ? 'Medium' : 'Low';

// Premium calculation (cold storage typically commands 30-100% premium)
const premiumOverDryWarehouse = coldStoragePercentage > 80 ? 100 :
     coldStoragePercentage > 50 ? 75 :
     coldStoragePercentage > 20 ? 50 : 30;

const competitiveAdvantages: string[] = [];
if (systemRedundancy !== 'None') competitiveAdvantages.push(`${systemRedundancy} redundancy`);
if (coldSpecs.blastFreezerSF) competitiveAdvantages.push('Blast freezing capability');
if (temperatureMonitoring === 'IoT-Enabled') competitiveAdvantages.push('IoT monitoring');
if (backupPowerCoverage > 90) competitiveAdvantages.push('Full backup power');

// CapEx considerations (simplified)
const equipmentAge = 10; // Assumed average
const replacementSchedule = [
{
component: 'Compressors',
yearsRemaining: Math.max(0, 20 - equipmentAge),
estimatedCost: totalColdSF * 15
},
{
component: 'Condensers',
yearsRemaining: Math.max(0, 15 - equipmentAge),
estimatedCost: totalColdSF * 10
},
{
component: 'Evaporators',
yearsRemaining: Math.max(0, 15 - equipmentAge),
estimatedCost: totalColdSF * 8
},
{
component: 'Controls',
yearsRemaining: Math.max(0, 10 - equipmentAge),
estimatedCost: totalColdSF * 5
}
];

const energyEfficiencyUpgrades = [
{
upgrade: 'Variable frequency drives',
cost: totalColdSF * 3,
paybackPeriod: 3.5
},
{
upgrade: 'LED lighting conversion',
cost: totalColdSF * 2,
paybackPeriod: 2.5
},
{
upgrade: 'Automated door systems',
cost: 50000,
paybackPeriod: 4.0
},
{
upgrade: 'Advanced controls/IoT',
cost: totalColdSF * 4,
paybackPeriod: 3.0
}
];

return {
operationalMetrics: {
temperatureZoneMix,
energyIntensity: Number(energyIntensity.toFixed(1)),
estimatedEnergyCost: Math.round(estimatedEnergyCost),
pue: Number(pue.toFixed(2))
},
refrigerationAnalysis: {
systemRedundancy,
backupPowerCoverage: Number(backupPowerCoverage.toFixed(1)),
ammoniaSafety,
temperatureMonitoring,
alarmSystems
},
tenantRequirements,
marketPosition: {
coldStoragePercentage: Number(coldStoragePercentage.toFixed(1)),
marketDemandLevel,
premiumOverDryWarehouse,
competitiveAdvantages
},
capExConsiderations: {
equipmentAge,
replacementSchedule: replacementSchedule.filter(r => r.yearsRemaining < 10),
energyEfficiencyUpgrades
}
};
}

/**
* Last-mile delivery facility analysis
*/
export function analyzeLastMileFacility(
specs: BuildingSpecs,
location: LocationMetrics,
deliveryMetrics: {
dailyDeliveries: number;
peakHourDeliveries: number;
avgDeliveryRadius: number;
vehicleTypes: {
vans: number;
boxTrucks: number;
semis: number;
};
}
): {
lastMileScore: number; // 0-100
operationalEfficiency: {
throughputCapacity: number; // packages/day
dockUtilization: number; // percentage
parkingAdequacy: 'Sufficient' | 'Adequate' | 'Insufficient';
sortationCapability: number; // packages/hour
};
deliveryMetrics: {
deliveryDensity: number; // deliveries per sq mile
routeEfficiency: number; // percentage
avgDeliveryTime: number; // minutes
costPerDelivery: number;
};
facilityOptimization: {
layoutEfficiency: number;
crossDockPotential: boolean;
automationReadiness: number; // 0-100
expansionPotential: boolean;
};
competitivePosition: {
marketCoverage: number; // population within delivery radius
sameNextDayCapability: boolean;
amazonCompetitive: boolean;
uniqueAdvantages: string[];
};
} {
// Last mile scoring based on facility characteristics
let lastMileScore = 0;

// Location factors (40 points)
if (location.distanceToHighway <= 2) lastMileScore += 20;
else if (location.distanceToHighway <= 5) lastMileScore += 10;

if (location.populationOneHour >= 2000000) lastMileScore += 20;
else if (location.populationOneHour >= 1000000) lastMileScore += 15;
else if (location.populationOneHour >= 500000) lastMileScore += 10;

// Facility factors (40 points)
if (specs.clearHeight >= 24) lastMileScore += 10;
else if (specs.clearHeight >= 18) lastMileScore += 5;

const dockDoorRatio = (specs.dockDoors / specs.totalSF) * 10000;
if (dockDoorRatio >= 2.0) lastMileScore += 15;
else if (dockDoorRatio >= 1.5) lastMileScore += 10;
else if (dockDoorRatio >= 1.0) lastMileScore += 5;

if (specs.truckCourtDepth >= 120) lastMileScore += 10;
else if (specs.truckCourtDepth >= 100) lastMileScore += 5;

if (specs.driveInDoors >= 2) lastMileScore += 5;

// Market factors (20 points)
if (location.vacancyRate < 3) lastMileScore += 10;
else if (location.vacancyRate < 5) lastMileScore += 5;

if (deliveryMetrics.avgDeliveryRadius <= 25) lastMileScore += 10;
else if (deliveryMetrics.avgDeliveryRadius <= 50) lastMileScore += 5;

// Operational efficiency calculations
const vehicleCapacity = {
vans: 150, // packages
boxTrucks: 300,
semis: 2000
};

const totalVehicles = deliveryMetrics.vehicleTypes.vans + 
deliveryMetrics.vehicleTypes.boxTrucks + 
deliveryMetrics.vehicleTypes.semis;

const throughputCapacity = 
deliveryMetrics.vehicleTypes.vans * vehicleCapacity.vans +
deliveryMetrics.vehicleTypes.boxTrucks * vehicleCapacity.boxTrucks +
deliveryMetrics.vehicleTypes.semis * vehicleCapacity.semis;

// Dock utilization
const docksNeededPeak = Math.ceil(deliveryMetrics.peakHourDeliveries / 4); // 15 min per dock
const dockUtilization = (docksNeededPeak / specs.dockDoors) * 100;

// Parking adequacy
const parkingNeeded = totalVehicles * 1.2; // 20% buffer
let parkingAdequacy: 'Sufficient' | 'Adequate' | 'Insufficient';
if (specs.totalSF / 1000 >= parkingNeeded) parkingAdequacy = 'Sufficient';
else if (specs.totalSF / 1500 >= parkingNeeded) parkingAdequacy = 'Adequate';
else parkingAdequacy = 'Insufficient';

// Sortation capability (packages per hour)
const sortationCapability = specs.totalSF * 0.05; // Rough estimate

// Delivery metrics
const serviceArea = Math.PI * Math.pow(deliveryMetrics.avgDeliveryRadius, 2);
const deliveryDensity = deliveryMetrics.dailyDeliveries / serviceArea;

// Route efficiency (simplified)
const idealRoutes = Math.ceil(deliveryMetrics.dailyDeliveries / 150); // 150 stops per route
const actualRoutes = totalVehicles;
const routeEfficiency = Math.min(100, (idealRoutes / actualRoutes) * 100);

// Average delivery time (simplified)
const avgDeliveryTime = 20 + (deliveryMetrics.avgDeliveryRadius * 1.5); // Base + travel

// Cost per delivery (simplified)
const laborCost = 25; // $/hour
const vehicleCost = 50; // $/day per vehicle
const facilityShare = (specs.totalSF * 8) / 365 / deliveryMetrics.dailyDeliveries; // Rent allocation
const costPerDelivery = (laborCost * avgDeliveryTime / 60) + 
(vehicleCost / 150) + facilityShare;

// Facility optimization
const layoutEfficiency = specs.clearHeight >= 24 && dockDoorRatio >= 1.5 ? 85 :
specs.clearHeight >= 18 && dockDoorRatio >= 1.0 ? 70 : 50;

const crossDockPotential = specs.dockDoors >= 20 && specs.truckCourtDepth >= 130;

const automationReadiness = 
(specs.clearHeight >= 24 ? 25 : 10) +
(specs.floorLoadCapacity >= 250 ? 25 : 10) +
(specs.powerCapacity >= 2000 ? 25 : 10) +
(layoutEfficiency >= 70 ? 25 : 10);

const expansionPotential = specs.totalSF < 100000 && dockDoorRatio < 3.0;

// Competitive position
const marketCoverage = location.populationOneHour * 
(deliveryMetrics.avgDeliveryRadius / 50); // Adjusted for radius

const sameNextDayCapability = deliveryMetrics.avgDeliveryRadius <= 50 && 
   specs.totalSF >= 50000;

const amazonCompetitive = lastMileScore >= 75 && 
location.populationOneHour >= 1000000 &&
deliveryMetrics.avgDeliveryRadius <= 25;

const uniqueAdvantages: string[] = [];
if (location.distanceToHighway <= 1) uniqueAdvantages.push('Highway adjacent');
if (specs.driveInDoors > 0) uniqueAdvantages.push('Drive-in capability');
if (crossDockPotential) uniqueAdvantages.push('Cross-dock potential');
if (location.populationOneHour >= 2000000) uniqueAdvantages.push('Major metro location');

return {
lastMileScore: Number(lastMileScore.toFixed(1)),
operationalEfficiency: {
throughputCapacity,
dockUtilization: Number(dockUtilization.toFixed(1)),
parkingAdequacy,
sortationCapability: Math.round(sortationCapability)
},
deliveryMetrics: {
deliveryDensity: Number(deliveryDensity.toFixed(2)),
routeEfficiency: Number(routeEfficiency.toFixed(1)),
avgDeliveryTime: Number(avgDeliveryTime.toFixed(1)),
costPerDelivery: Number(costPerDelivery.toFixed(2))
},
facilityOptimization: {
layoutEfficiency: Number(layoutEfficiency.toFixed(1)),
crossDockPotential,
automationReadiness: Number(automationReadiness.toFixed(1)),
expansionPotential
},
competitivePosition: {
marketCoverage: Math.round(marketCoverage),
sameNextDayCapability,
amazonCompetitive,
uniqueAdvantages
}
};
}

// ==================== HELPER FUNCTIONS ====================

interface PropertyRequirements { minClearHeight: number; idealClearHeight: number; minDockRatio: number; idealDockRatio: number; minColumnSpacing: number; idealColumnSpacing: number; minTruckTurning: number; idealTruckTurning: number; minTrailerStorageDepth: number; idealTrailerStorageDepth: number; minOfficeRatio: number; idealOfficeRatio: number; }

function getPropertyTypeRequirements(propertyType: string): PropertyRequirements | null {
const requirements: Record<string, PropertyRequirements> = {
'Warehouse': {
minClearHeight: 24,
idealClearHeight: 32,
minDockRatio: 0.8,
idealDockRatio: 1.2,
minPowerPerSF: 2,
idealPowerPerSF: 3
},
'Manufacturing': {
minClearHeight: 20,
idealClearHeight: 28,
minDockRatio: 0.5,
idealDockRatio: 0.8,
minPowerPerSF: 5,
idealPowerPerSF: 10
},
'Flex': {
minClearHeight: 16,
idealClearHeight: 20,
minDockRatio: 0.3,
idealDockRatio: 0.5,
minPowerPerSF: 3,
idealPowerPerSF: 5
},
'Cold Storage': {
minClearHeight: 28,
idealClearHeight: 35,
minDockRatio: 1.0,
idealDockRatio: 1.5,
minPowerPerSF: 10,
idealPowerPerSF: 15
},
'Last Mile': {
minClearHeight: 18,
idealClearHeight: 24,
minDockRatio: 1.5,
idealDockRatio: 2.5,
minPowerPerSF: 2,
idealPowerPerSF: 3
}
};

return requirements[propertyType] || requirements['Warehouse'] || null;
}

function calculateColumnEfficiency(width: number, depth: number, totalSF: number): number {
const columnArea = width * depth;
const columnsEstimate = totalSF / columnArea;
const columnFootprint = columnsEstimate * 4; // Assume 2x2 columns
return ((totalSF - columnFootprint) / totalSF) * 100;
}

function calculateLastMileSuitability(location: LocationMetrics, transportScore: number): number {
let score = transportScore * 0.3;

if (location.populationOneHour >= 1000000) score += 40;
else if (location.populationOneHour >= 500000) score += 25;
else if (location.populationOneHour >= 250000) score += 15;

if (location.distanceToHighway <= 3) score += 20;
else if (location.distanceToHighway <= 5) score += 10;

return Math.min(100, score);
}

function calculateRegionalSuitability(location: LocationMetrics, transportScore: number): number {
let score = transportScore * 0.4;

if (location.distanceToHighway <= 1) score += 30;
else if (location.distanceToHighway <= 3) score += 20;

if (location.populationOneHour >= 500000) score += 20;
if (location.distanceToRail && location.distanceToRail <= 5) score += 10;

return Math.min(100, score);
}

function calculateNationalSuitability(location: LocationMetrics, transportScore: number): number {
let score = transportScore * 0.3;

if (location.distanceToIntermodal && location.distanceToIntermodal <= 10) score += 30;
else if (location.distanceToRail && location.distanceToRail <= 2) score += 20;

if (location.distanceToHighway <= 1) score += 20;
if (location.distanceToAirport && location.distanceToAirport <= 10) score += 20;

return Math.min(100, score);
}

function calculateManufacturingSuitability(location: LocationMetrics, laborScore: number): number {
let score = laborScore * 0.5;

if (location.averageWage < 20) score += 20;
if (location.populationOneHour >= 250000) score += 15;
if (!location.unionPresence) score += 15;

return Math.min(100, score);
}