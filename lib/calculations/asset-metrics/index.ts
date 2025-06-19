// lib/calculations/asset-metrics/index.ts
// Main aggregator for all asset-specific metrics and analytics

import { PropertyData, PropertyType } from '../types';

// Import all asset-specific modules
import * as OfficeMetrics from './office';
import * as RetailMetrics from './retail';
import * as IndustrialMetrics from './industrial';
import * as MultifamilyMetrics from './multifamily';
import * as MixedUseMetrics from './mixed-use';

// Re-export common types
export type { 
  PropertyData, 
  PropertyType,
  // Office types
  OfficeTenant,
  BuildingOperations,
  MarketIntelligence,
  // Multifamily types
  Unit,
  PropertyAmenities,
  MarketComps,
  ResidentProfile,
  // Retail types
  RetailTenant,
  SalesData,
  TradeArea,
  // Industrial types
  IndustrialTenant,
  BuildingSpecs,
  LocationMetrics,
  // Mixed-use types
  MixedUseComponent,
  SharedSystems,
  CrossUseAnalysis
} from '../types';

// Export all modules
export {
  OfficeMetrics,
  RetailMetrics,
  IndustrialMetrics,
  MultifamilyMetrics,
  MixedUseMetrics
};

// Main analytics function that routes to appropriate asset type
export function analyzeAssetMetrics(
  propertyData: PropertyData,
  assetType: PropertyType
) {
  switch (assetType) {
    case 'office':
      return OfficeMetrics;
    case 'retail':
      return RetailMetrics;
    case 'industrial':
      return IndustrialMetrics;
    case 'multifamily':
      return MultifamilyMetrics;
    case 'mixed-use':
      return MixedUseMetrics;
    default:
      throw new Error(`Unsupported asset type: ${assetType}`);
  }
}

// Enhanced function to get available metrics for an asset type
export function getAvailableMetrics(assetType: PropertyType): string[] {
  const metricsMap = {
    office: [
      'analyzeTenantFinancialHealth',
      'analyzeLeaseEconomics',
      'analyzeBuildingOperations',
      'analyzeMarketPositioning'
    ],
    retail: [
      'analyzeSalesPerformance',
      'analyzeCoTenancy',
      'analyzeTradeArea',
      'analyzePercentageRent',
      'analyzeExpenseRecovery',
      'analyzeRedevelopmentPotential'
    ],
    industrial: [
      'analyzeBuildingFunctionality',
      'analyzeLocationLogistics',
      'analyzeColdStorage',
      'analyzeLastMileFacility'
    ],
    multifamily: [
      'analyzeRevenuePerformance',
      'analyzeOperatingPerformance',
      'analyzeMarketPosition',
      'analyzeValueAddPotential'
    ],
    'mixed-use': [
      'analyzeMixedUsePerformance',
      'analyzeCrossUseInteractions',
      'analyzeOperationalIntegration',
      'analyzeMixedUseDevelopment'
    ]
  };

  return metricsMap[assetType] || [];
}

// Enhanced function to check if property data is complete for an asset type
export function isCompletePropertyData(
  data: PropertyData,
  assetType: PropertyType
): boolean {
  const requiredFields = {
    office: ['rentableSquareFeet', 'numberOfTenants', 'averageRentPSF'],
    retail: ['grossLeasableArea', 'salesPerSF', 'occupancyCostRatio'],
    industrial: ['clearHeight', 'numberOfDockDoors', 'powerCapacity'],
    multifamily: ['numberOfUnits', 'currentOccupancy', 'averageRentPerUnit'],
    'mixed-use': ['totalSquareFootage', 'propertyType']
  };

  const fields = requiredFields[assetType] || [];
  return fields.every(field => data[field as keyof PropertyData] !== undefined);
}

// New function to get asset-specific calculation functions
export function getAssetCalculationFunctions(assetType: PropertyType) {
  switch (assetType) {
    case 'office':
      return {
        analyzeTenantFinancialHealth: OfficeMetrics.analyzeTenantFinancialHealth,
        analyzeLeaseEconomics: OfficeMetrics.analyzeLeaseEconomics,
        analyzeBuildingOperations: OfficeMetrics.analyzeBuildingOperations,
        analyzeMarketPositioning: OfficeMetrics.analyzeMarketPositioning
      };
    case 'retail':
      return {
        analyzeSalesPerformance: RetailMetrics.analyzeSalesPerformance,
        analyzeCoTenancy: RetailMetrics.analyzeCoTenancy,
        analyzeTradeArea: RetailMetrics.analyzeTradeArea,
        analyzePercentageRent: RetailMetrics.analyzePercentageRent,
        analyzeExpenseRecovery: RetailMetrics.analyzeExpenseRecovery,
        analyzeRedevelopmentPotential: RetailMetrics.analyzeRedevelopmentPotential
      };
    case 'industrial':
      return {
        analyzeBuildingFunctionality: IndustrialMetrics.analyzeBuildingFunctionality,
        analyzeLocationLogistics: IndustrialMetrics.analyzeLocationLogistics,
        analyzeColdStorage: IndustrialMetrics.analyzeColdStorage,
        analyzeLastMileFacility: IndustrialMetrics.analyzeLastMileFacility
      };
    case 'multifamily':
      return {
        analyzeRevenuePerformance: MultifamilyMetrics.analyzeRevenuePerformance,
        analyzeOperatingPerformance: MultifamilyMetrics.analyzeOperatingPerformance,
        analyzeMarketPosition: MultifamilyMetrics.analyzeMarketPosition,
        analyzeValueAddPotential: MultifamilyMetrics.analyzeValueAddPotential
      };
    case 'mixed-use':
      return {
        analyzeMixedUsePerformance: MixedUseMetrics.analyzeMixedUsePerformance,
        analyzeCrossUseInteractions: MixedUseMetrics.analyzeCrossUseInteractions,
        analyzeOperationalIntegration: MixedUseMetrics.analyzeOperationalIntegration,
        analyzeMixedUseDevelopment: MixedUseMetrics.analyzeMixedUseDevelopment
      };
    default:
      return {};
  }
}

// New function to validate asset-specific data requirements
export function validateAssetDataRequirements(
  data: PropertyData,
  assetType: PropertyType
): { isValid: boolean; missingFields: string[]; recommendations: string[] } {
  const missingFields: string[] = [];
  const recommendations: string[] = [];

  switch (assetType) {
    case 'office':
      if (!data.rentableSquareFeet) missingFields.push('rentableSquareFeet');
      if (!data.numberOfTenants) missingFields.push('numberOfTenants');
      if (!data.averageRentPSF) missingFields.push('averageRentPSF');
      if (!data.weightedAverageLeaseTerm) recommendations.push('Add weightedAverageLeaseTerm for lease analysis');
      break;
    case 'retail':
      if (!data.grossLeasableArea) missingFields.push('grossLeasableArea');
      if (!data.salesPerSF) missingFields.push('salesPerSF');
      if (!data.occupancyCostRatio) missingFields.push('occupancyCostRatio');
      if (!data.trafficCount) recommendations.push('Add trafficCount for trade area analysis');
      break;
    case 'industrial':
      if (!data.clearHeight) missingFields.push('clearHeight');
      if (!data.numberOfDockDoors) missingFields.push('numberOfDockDoors');
      if (!data.powerCapacity) missingFields.push('powerCapacity');
      if (!data.distanceToHighway) recommendations.push('Add distanceToHighway for location analysis');
      break;
    case 'multifamily':
      if (!data.numberOfUnits) missingFields.push('numberOfUnits');
      if (!data.currentOccupancy) missingFields.push('currentOccupancy');
      if (!data.averageRentPerUnit) missingFields.push('averageRentPerUnit');
      if (!data.unitMix) recommendations.push('Add unitMix for detailed unit analysis');
      break;
    case 'mixed-use':
      if (!data.totalSquareFootage) missingFields.push('totalSquareFootage');
      if (!data.propertyType) missingFields.push('propertyType');
      recommendations.push('Consider adding component-specific data for detailed analysis');
      break;
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    recommendations
  };
}

// New function to get asset-specific metric categories
export function getAssetMetricCategories(assetType: PropertyType): string[] {
  const categories = {
    office: ['Tenant Analysis', 'Lease Economics', 'Building Operations', 'Market Positioning'],
    retail: ['Sales Performance', 'Tenant Health', 'Trade Area', 'Co-Tenancy', 'Expense Recovery'],
    industrial: ['Building Functionality', 'Location Logistics', 'Cold Storage', 'Last Mile'],
    multifamily: ['Revenue Performance', 'Operating Performance', 'Market Position', 'Value Add'],
    'mixed-use': ['Component Performance', 'Cross-Use Interactions', 'Operational Integration', 'Development Potential']
  };

  return categories[assetType] || [];
}
