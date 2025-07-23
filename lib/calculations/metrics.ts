// Internal imports - absolute paths
import type { PropertyData, MetricFlags, CalculatedMetrics, DealAssessment, AssessmentLevel } from '../types';
import type { RetailTenant, TradeArea } from './types';
import { SimpleTenant } from '../types';
import { getAssetCalculationFunctions, validateAssetDataRequirements } from './asset-metrics';

// Asset-specific calculation functions - organized by property type
import { 
  analyzeTenantFinancialHealth,
  analyzeLeaseEconomics,
  analyzeBuildingOperations,
  analyzeMarketPositioning,
  OfficeTenant,
  BuildingOperations,
  MarketIntelligence
} from './asset-metrics/office';

import {
  analyzeSalesPerformance,
  analyzeCoTenancy,
  analyzeTradeArea,
  RetailTenant as RetailTenantType,
  SalesData
} from './asset-metrics/retail';

import {
  analyzeBuildingFunctionality,
  analyzeLocationLogistics,
  analyzeColdStorage,
  analyzeLastMileFacility,
  IndustrialTenant,
  BuildingSpecs,
  LocationMetrics
} from './asset-metrics/industrial';

import {
  analyzeRevenuePerformance,
  analyzeOperatingPerformance,
  Unit,
  PropertyAmenities,
  MarketComps
} from './asset-metrics/multifamily';

import {
  analyzeMixedUsePerformance,
  MixedUseComponent,
  SharedSystems
} from './asset-metrics/mixed-use';

/**
 * Calculates annual debt service payment based on loan details
 * @param loanAmount - Total loan amount
 * @param interestRate - Annual interest rate (as a decimal)
 * @param loanTerm - Loan term in years
 * @returns Annual debt service payment
 */
export function calculateAnnualDebtService(
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!loanAmount || !interestRate || !loanTerm) return 0;
  
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Calculate monthly payment using the loan amortization formula
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  // Return annual payment (monthly × 12)
  return monthlyPayment * 12;
}

/**
 * Formats metric values based on their type
 * @param value - The value to format
 * @param type - The type of metric ('percentage', 'currency', 'ratio')
 * @returns Formatted string value
 */
export function formatMetricValue(
  value: number | null | undefined,
  type: 'percentage' | 'currency' | 'ratio'
): string {
  if (value === null || value === undefined) return 'N/A';
  
  switch (type) {
    case 'percentage':
      return `${value.toFixed(2)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'ratio':
      return value.toFixed(2);
    default:
      return value.toString();
  }
}

/**
 * Checks if all required data fields are present for a specific metric
 * @param metric - The metric to check
 * @param data - Property data object
 * @returns boolean indicating if all required data is present
 */
export function hasRequiredData(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): boolean {
  switch (metric) {
    case 'capRate':
      return !!(data.currentNOI && data.purchasePrice);
    case 'cashOnCash':
      return !!(data.annualCashFlow && data.totalInvestment);
    case 'dscr':
      return !!(data.currentNOI && data.loanAmount && data.interestRate && data.loanTerm);
    case 'roi':
      return !!(data.projectedNOI && data.purchasePrice && data.totalInvestment && data.currentNOI);
    case 'breakeven':
      return !!(data.operatingExpenses && data.grossIncome && data.loanAmount && data.interestRate && data.loanTerm);
    case 'irr':
      return !!(data.annualCashFlow && data.totalInvestment && data.projectedNOI && data.currentNOI);
    case 'pricePerSF':
      return !!(data.purchasePrice && data.squareFootage);
    case 'ltv':
      return !!(data.loanAmount && data.purchasePrice);
    case 'grm':
      return !!(data.purchasePrice && data.grossIncome);
    case 'pricePerUnit':
      return !!(data.purchasePrice && data.numberOfUnits);
    case 'egi':
      return !!(data.grossIncome && data.occupancyRate);
    
    // New "Wow" Metrics
    case 'walt':
      return !!(data.purchasePrice && data.currentNOI && data.officeTenants?.tenants && data.officeTenants.tenants.length > 0);
    case 'simpleWalt':
      return !!(data.officeTenants?.tenants && data.officeTenants.tenants.length > 0);
    case 'salesPerSF':
      return !!(data.retailTenants && data.retailTenants.length > 0);
    case 'clearHeightAnalysis':
      return !!(data.squareFootage && data.purchasePrice && data.clearHeight);
    case 'revenuePerUnit':
      return !!(data.totalUnits && data.monthlyRentalIncome);
    case 'industrialMetrics':
      return !!(data.squareFootage && data.purchasePrice && data.clearHeight);
    case 'multifamilyMetrics':
      return !!(data.numberOfUnits && data.monthlyRentalIncome);
    
    // Additional Office Metrics
    case 'occupancyCostRatio':
      return !!(data.operatingExpenses && data.grossIncome);
    
    default:
      return false;
  }
}

/**
 * Alias for hasRequiredData function - checks if all required data fields are present for a specific metric
 * @param metric - The metric to check
 * @param data - Property data object
 * @returns boolean indicating if all required data is present
 */
export function hasRequiredDataForMetric(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): boolean {
  return hasRequiredData(metric, data);
}

/**
 * Get detailed error message for missing fields required for metric calculation
 * @param metric - The metric to check
 * @param data - Property data object
 * @returns Detailed error message or null if all required fields are present
 */
export function getMetricValidationError(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): string | null {
  if (hasRequiredDataForMetric(metric, data)) {
    return null;
  }
  
  switch (metric) {
    case 'capRate':
      const capRateMissing = [];
      if (!data.currentNOI) capRateMissing.push('Current NOI');
      if (!data.purchasePrice) capRateMissing.push('Purchase Price');
      return `Cap Rate calculation requires: ${capRateMissing.join(', ')}`;
      
    case 'cashOnCash':
      const cocMissing = [];
      if (!data.annualCashFlow) cocMissing.push('Annual Cash Flow');
      if (!data.totalInvestment) cocMissing.push('Total Investment');
      return `Cash-on-Cash Return calculation requires: ${cocMissing.join(', ')}`;
      
    case 'dscr':
      const dscrMissing = [];
      if (!data.currentNOI) dscrMissing.push('Current NOI');
      if (!data.loanAmount) dscrMissing.push('Loan Amount');
      if (!data.interestRate) dscrMissing.push('Interest Rate');
      if (!data.loanTerm) dscrMissing.push('Loan Term');
      return `DSCR calculation requires: ${dscrMissing.join(', ')}`;
      
    case 'ltv':
      const ltvMissing = [];
      if (!data.loanAmount) ltvMissing.push('Loan Amount');
      if (!data.purchasePrice) ltvMissing.push('Purchase Price');
      return `LTV calculation requires: ${ltvMissing.join(', ')}`;
      
    case 'pricePerSF':
      const psfMissing = [];
      if (!data.purchasePrice) psfMissing.push('Purchase Price');
      if (!data.squareFootage && !data.totalSF && !data.grossLeasableArea) {
        psfMissing.push('Square Footage (any of: squareFootage, totalSF, or grossLeasableArea)');
      }
      return `Price per SF calculation requires: ${psfMissing.join(', ')}`;
      
    case 'grm':
      const grmMissing = [];
      if (!data.purchasePrice) grmMissing.push('Purchase Price');
      if (!data.grossIncome) grmMissing.push('Gross Income');
      return `GRM calculation requires: ${grmMissing.join(', ')}`;
      
    case 'walt':
      const waltMissing = [];
      if (!data.purchasePrice) waltMissing.push('Purchase Price');
      if (!data.currentNOI) waltMissing.push('Current NOI');
      if (!data.officeTenants?.tenants || data.officeTenants.tenants.length === 0) {
        waltMissing.push('Office Tenants (at least one tenant with lease expiration date)');
      }
      return `WALT calculation requires: ${waltMissing.join(', ')}`;
      
    case 'effectiveRentPSF':
      const effectiveRentMissing = [];
      if (!data.averageRentPSF) effectiveRentMissing.push('Average Rent per SF');
      if (!data.operatingExpenses) effectiveRentMissing.push('Operating Expenses');
      return `Effective Rent per SF calculation requires: ${effectiveRentMissing.join(', ')}`;
      
    case 'salesPerSF':
      if (!data.retailTenants || data.retailTenants.length === 0) {
        return 'Sales per SF calculation requires: Retail Tenants (at least one tenant with sales data)';
      }
      return 'Sales per SF calculation requires valid retail tenant data with sales information';
      
    case 'industrialMetrics':
      const industrialMissing = [];
      if (!data.squareFootage) industrialMissing.push('Square Footage');
      if (!data.purchasePrice) industrialMissing.push('Purchase Price');
      if (!data.clearHeight) industrialMissing.push('Clear Height');
      return `Industrial Metrics calculation requires: ${industrialMissing.join(', ')}`;
      
    default:
      return `${metric} calculation requires additional data fields that are not available`;
  }
}

/**
 * Enhanced function to calculate all enabled metrics based on available property data
 * Now includes asset-specific analysis capabilities
 * @param data - Property data object
 * @param flags - Object indicating which metrics to calculate
 * @returns Object containing calculated metrics and asset-specific analysis
 */
export function calculateMetrics(
  data: PropertyData,
  flags: MetricFlags
): CalculatedMetrics & { assetAnalysis?: any; validationErrors?: Record<string, string> } {
  const metrics: CalculatedMetrics & { assetAnalysis?: any; validationErrors?: Record<string, string> } = {};
  const validationErrors: Record<string, string> = {};

  // Cap Rate = (NOI / Purchase Price) × 100
  if (flags.capRate) {
    try {
      if (hasRequiredDataForMetric('capRate', data)) {
        metrics.capRate = ((data.currentNOI || 0) / (data.purchasePrice || 1)) * 100;
        // Cap Rate calculation successful
      } else {
        const error = getMetricValidationError('capRate', data);
        validationErrors.capRate = error || 'Validation error';
        // Cap Rate calculation failed - missing required data
      }
    } catch (error) {
      console.error('Error calculating Cap Rate:', error);
      validationErrors.capRate = 'Error calculating Cap Rate';
      metrics.capRate = 0;
    }
  }

  // Cash-on-Cash Return = (Annual Cash Flow / Total Investment) × 100
  if (flags.cashOnCash) {
    try {
      if (hasRequiredDataForMetric('cashOnCash', data)) {
        metrics.cashOnCash = ((data.annualCashFlow || 0) / (data.totalInvestment || 1)) * 100;
        // Cash-on-Cash Return calculation successful
      } else {
        const error = getMetricValidationError('cashOnCash', data);
        validationErrors.cashOnCash = error || 'Validation error';
        // Cash-on-Cash Return calculation failed - missing required data
      }
    } catch (error) {
      console.error('Error calculating Cash-on-Cash Return:', error);
      validationErrors.cashOnCash = 'Error calculating Cash-on-Cash Return';
      metrics.cashOnCash = 0;
    }
  }

  // DSCR = NOI / Annual Debt Service
  if (flags.dscr) {
    try {
      if (hasRequiredDataForMetric('dscr', data)) {
        const monthlyRate = (data.interestRate || 0) / 100 / 12;
        const numPayments = (data.loanTerm || 0) * 12;
        
        if (monthlyRate > 0) {
          const monthlyPayment = (data.loanAmount || 0) * 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);
          const annualDebtService = monthlyPayment * 12;
          
          if (annualDebtService > 0) {
            metrics.dscr = (data.currentNOI || 0) / annualDebtService;
          }
        }
      } else {
        const error = getMetricValidationError('dscr', data);
        validationErrors.dscr = error || 'Validation error';
      }
    } catch (error) {
      console.error('Error calculating DSCR:', error);
      validationErrors.dscr = 'Error calculating DSCR';
      metrics.dscr = 0;
    }
  }

  // LTV = (Loan Amount / Purchase Price) × 100
  if (flags.ltv) {
    try {
      if (hasRequiredDataForMetric('ltv', data)) {
        metrics.ltv = ((data.loanAmount || 0) / (data.purchasePrice || 1)) * 100;
      } else {
        const error = getMetricValidationError('ltv', data);
        validationErrors.ltv = error || 'Validation error';
      }
    } catch (error) {
      console.error('Error calculating LTV:', error);
      validationErrors.ltv = 'Error calculating LTV';
      metrics.ltv = 0;
    }
  }

  // Price per SF = Purchase Price / Square Footage
  if (flags.pricePerSF) {
    if (hasRequiredDataForMetric('pricePerSF', data)) {
      const sf = data.squareFootage || data.totalSF || data.grossLeasableArea || 0;
      metrics.pricePerSF = (data.purchasePrice || 0) / sf;
    } else {
      const error = getMetricValidationError('pricePerSF', data);
      validationErrors.pricePerSF = error || 'Validation error';
    }
  }

  // GRM = Purchase Price / Gross Income
  if (flags.grm) {
    if (hasRequiredDataForMetric('grm', data)) {
      metrics.grm = (data.purchasePrice || 0) / (data.grossIncome || 1);
    } else {
      const error = getMetricValidationError('grm', data);
      validationErrors.grm = error || 'Validation error';
    }
  }

  // Effective Rent per SF = Average Rent per SF - (Operating Expenses / Total SF)
  if (flags.effectiveRentPSF) {
    if (hasRequiredDataForMetric('effectiveRentPSF', data)) {
      const sf = data.squareFootage || data.totalSF || data.grossLeasableArea || 1;
      const opExpensesPSF = (data.operatingExpenses || 0) / sf;
      metrics.effectiveRentPSF = (data.averageRentPSF || 0) - opExpensesPSF;
    } else {
      const error = getMetricValidationError('effectiveRentPSF', data);
      validationErrors.effectiveRentPSF = error || 'Validation error';
    }
  }

  // IRR (5-year approximation with property appreciation)
  if (flags.irr && data.annualCashFlow !== undefined && data.totalInvestment !== undefined && 
      data.currentNOI !== undefined && data.projectedNOI !== undefined && 
      data.totalInvestment > 0 && data.currentNOI > 0) {
    const noiGrowth = data.projectedNOI - data.currentNOI;
    const assumedCapRate = 0.08; // 8% exit cap rate
    const propertyAppreciation = noiGrowth / assumedCapRate;
    const totalCashFlows = (data.annualCashFlow * 5) + propertyAppreciation;
    const totalReturn = data.totalInvestment + totalCashFlows;
    
    if (totalReturn > 0 && data.totalInvestment > 0) {
      metrics.irr = (Math.pow(totalReturn / data.totalInvestment, 1/5) - 1) * 100;
    }
  }

  // ROI calculation - try both methods
  if (flags.roi) {
    // Method 1: Using NOI growth (preferred for packages)
    if (data.currentNOI !== undefined && data.projectedNOI !== undefined && 
        data.totalInvestment !== undefined && data.totalInvestment > 0) {
      const noiGrowth = data.projectedNOI - data.currentNOI;
      const assumedCapRate = 0.08;
      const propertyAppreciation = noiGrowth / assumedCapRate;
      const totalReturnPercent = (propertyAppreciation / data.totalInvestment) * 100;
      metrics.roi = totalReturnPercent / 5; // Annualized over 5 years
    }
    // Method 2: Simple cash-on-cash style ROI (fallback)
    else if (data.annualCashFlow !== undefined && data.totalInvestment !== undefined && 
             data.totalInvestment > 0) {
      // Simple ROI based on cash flow
      metrics.roi = (data.annualCashFlow / data.totalInvestment) * 100;
    }
  }

  // Breakeven = ((Operating Expenses + Annual Debt Service) / Gross Income) × 100
  if (flags.breakeven && data.operatingExpenses !== undefined && data.grossIncome !== undefined && 
      data.loanAmount !== undefined && data.interestRate !== undefined && 
      data.loanTerm !== undefined && data.grossIncome > 0) {
    const monthlyRate = data.interestRate / 100 / 12;
    const numPayments = data.loanTerm * 12;
    
    if (monthlyRate > 0) {
      const monthlyPayment = data.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      const annualDebtService = monthlyPayment * 12;
      
      metrics.breakeven = ((data.operatingExpenses + annualDebtService) / data.grossIncome) * 100;
    }
  }

  // Enhanced: Add asset-specific analysis if property type is specified
  if (data.propertyType) {
    try {
      const assetFunctions = getAssetCalculationFunctions(data.propertyType);
      const validation = validateAssetDataRequirements(data, data.propertyType);
      
      if (validation.isValid && Object.keys(assetFunctions).length > 0) {
        // Execute asset-specific analysis functions based on enabled flags
        const assetAnalysisResults: any = {};
        
        // Office-specific analysis
        if (data.propertyType === 'office') {
          if (flags.tenantFinancialHealth && assetFunctions.analyzeTenantFinancialHealth) {
            assetAnalysisResults.tenantFinancialHealth = assetFunctions.analyzeTenantFinancialHealth(
              (data.officeTenants?.tenants || []) as unknown as OfficeTenant[]
            );
          }
          
          if (flags.leaseValuation && assetFunctions.analyzeLeaseEconomics) {
            assetAnalysisResults.leaseEconomics = assetFunctions.analyzeLeaseEconomics(
              (data.officeTenants?.tenants || []) as unknown as OfficeTenant[],
              {} as MarketIntelligence
            );
          }
          
          if (flags.operationalEfficiency && assetFunctions.analyzeBuildingOperations) {
            assetAnalysisResults.buildingOperations = assetFunctions.analyzeBuildingOperations(
              {} as BuildingOperations,
              (data.officeTenants?.tenants || []) as unknown as OfficeTenant[],
              20, // property age placeholder
              data.rentableSquareFeet || 0
            );
          }
          
          if (flags.marketPositioning && assetFunctions.analyzeMarketPositioning) {
            assetAnalysisResults.marketPositioning = assetFunctions.analyzeMarketPositioning(
              {
                tenants: (data.officeTenants?.tenants || []) as unknown as OfficeTenant[],
                building: {} as BuildingOperations,
                totalSF: data.rentableSquareFeet || 0,
                occupancy: 90, // placeholder
                avgRent: data.averageRentPSF || 0,
                parkingRatio: 3 // placeholder
              },
              {} as MarketIntelligence
            );
          }
        }
        
        // Retail-specific analysis
        if (data.propertyType === 'retail') {
          if (flags.tenantHealth && assetFunctions.analyzeSalesPerformance) {
            assetAnalysisResults.salesPerformance = assetFunctions.analyzeSalesPerformance(
              [] as SalesData[],
              data.retailTenants || [],
              'Regional Mall' // center type placeholder
            );
          }
          
          if (flags.coTenancyRisk && assetFunctions.analyzeCoTenancy) {
            assetAnalysisResults.coTenancy = assetFunctions.analyzeCoTenancy(
              data.retailTenants || [],
              90, // current occupancy placeholder
              data.grossLeasableArea || 0
            );
          }
          
          if (flags.tradeAreaAnalysis && assetFunctions.analyzeTradeArea) {
            assetAnalysisResults.tradeArea = assetFunctions.analyzeTradeArea(
              [], // demographics placeholder
              data.retailTenants || [],
              [], // competitors placeholder
              [] // traffic counts placeholder
            );
          }
        }
        
        // Industrial-specific analysis
        if (data.propertyType === 'industrial') {
          if (flags.functionalScore && assetFunctions.analyzeBuildingFunctionality) {
            assetAnalysisResults.buildingFunctionality = assetFunctions.analyzeBuildingFunctionality(
              {
                totalSF: data.squareFootage || 0,
                clearHeight: data.clearHeight || 0,
                dockDoors: data.numberOfDockDoors || 0,
                powerCapacity: data.powerCapacity || 0,
                // other specs would be added here
              } as BuildingSpecs,
              [] as IndustrialTenant[],
              'Warehouse' // property type placeholder
            );
          }
          
          if (flags.locationScore && assetFunctions.analyzeLocationLogistics) {
            assetAnalysisResults.locationLogistics = assetFunctions.analyzeLocationLogistics(
              {
                distanceToHighway: data.distanceToHighway || 0,
                // other location metrics would be added here
              } as LocationMetrics,
              'Warehouse', // property type placeholder
              [] as IndustrialTenant[]
            );
          }
        }
        
        // Multifamily-specific analysis
        if (data.propertyType === 'multifamily') {
          if (flags.revenueMetrics && assetFunctions.analyzeRevenuePerformance) {
            assetAnalysisResults.revenuePerformance = assetFunctions.analyzeRevenuePerformance(
              [] as Unit[],
              [] as MarketComps[]
            );
          }
          
          if (flags.marketPosition && assetFunctions.analyzeMarketPosition) {
            assetAnalysisResults.marketPosition = assetFunctions.analyzeMarketPosition(
              {
                units: [] as Unit[],
                amenities: {} as PropertyAmenities,
                yearBuilt: 2000, // placeholder
                location: {
                  walkScore: 70,
                  transitScore: 60,
                  schoolRating: 7,
                  crimeIndex: 30
                }
              },
              [] as MarketComps[],
              {
                avgOccupancy: 90,
                avgRentGrowth: 3,
                newSupplyUnits: 0,
                population: 50000,
                medianIncome: 60000,
                rentToIncomeRatio: 30
              }
            );
          }
        }
        
        // Add asset-specific analysis capabilities
        metrics.assetAnalysis = {
          availableFunctions: Object.keys(assetFunctions),
          dataValidation: validation,
          propertyType: data.propertyType,
          results: assetAnalysisResults
        };
      }
    } catch (error) {
      console.warn('Asset analysis not available for property type:', data.propertyType);
    }
  }

  // New "Wow" Metrics Calculations
  // Office: WALT calculation
  if (flags.walt && data.officeTenants?.tenants) {
    metrics.walt = calculateSimpleWALT(data.officeTenants.tenants);
  }

  // Office: Simple WALT calculation (for backward compatibility)
  if (flags.simpleWalt && data.officeTenants?.tenants) {
    metrics.simpleWalt = calculateSimpleWALT(data.officeTenants.tenants);
  }

  // Retail: Sales per SF analysis
  if (flags.salesPerSF && data.retailTenants) {
    metrics.salesPerSF = calculateSalesPerSF(data.retailTenants);
  }

  // Industrial: Clear height premium analysis
  if (flags.industrialMetrics && data.squareFootage && data.purchasePrice && data.clearHeight) {
    metrics.industrialMetrics = calculateIndustrialMetrics({
      squareFootage: data.squareFootage,
      clearHeight: data.clearHeight,
      purchasePrice: data.purchasePrice
    });
  }

  // Industrial: Clear height analysis (new metric)
  if (flags.clearHeightAnalysis && data.squareFootage && data.clearHeight && data.purchasePrice) {
    metrics.clearHeightAnalysis = calculateIndustrialMetrics({
      squareFootage: data.squareFootage,
      clearHeight: data.clearHeight,
      purchasePrice: data.purchasePrice
    });
  }

  // Multifamily: Revenue per unit analysis (new metric)
  if (flags.revenuePerUnit && data.totalUnits && data.monthlyRentalIncome) {
    metrics.revenuePerUnit = calculateMultifamilyMetrics({
      totalUnits: data.totalUnits,
      monthlyRentalIncome: data.monthlyRentalIncome,
      ...(data.marketAverageRent !== undefined && { marketAverageRent: data.marketAverageRent })
    });
  }

  // Multifamily: Revenue per unit with market comparison
  if (flags.multifamilyMetrics && data.numberOfUnits && data.monthlyRentalIncome) {
    metrics.multifamilyMetrics = calculateMultifamilyMetrics({
      totalUnits: data.numberOfUnits,
      monthlyRentalIncome: data.monthlyRentalIncome,
      ...(data.marketAverageRent !== undefined && { marketAverageRent: data.marketAverageRent })
    });
  }

  // PACKAGE-BASED ROUTING FOR ASSET-SPECIFIC CALCULATIONS
  if (data.selectedPackageId) {
    try {
      const packageResult = calculatePackageMetrics(data.selectedPackageId, data);
      if (packageResult) {
        // Merge package-specific results with basic metrics
        Object.assign(metrics, packageResult);
      }
    } catch (error) {
      console.error(`❌ MAIN METRICS: Error calculating package ${data.selectedPackageId}:`, error);
      metrics.packageError = 'Unable to calculate package metrics. Please check input data.';
    }
  }

  // Add validation errors to metrics result if any exist
  if (Object.keys(validationErrors).length > 0) {
    metrics.validationErrors = validationErrors;
  }

  return metrics;
}

// DATA CONVERSION FUNCTIONS
function convertToOfficeTenants(tenantArray: any[]): OfficeTenant[] {
  if (!tenantArray || !Array.isArray(tenantArray)) return [];
  
  return tenantArray.map(t => ({
    tenantName: t.name || t.tenantName || 'Unknown Tenant',
    legalEntityName: t.legalName || t.tenantName || t.name || 'Unknown',
    parentCompany: t.parentCompany,
    industry: t.industry || 'Unknown',
    naicsCode: t.naicsCode || '000000',
    creditRating: (t.creditRating as string) || 'NR',
    
    // Space Configuration
    suites: [{
      suiteNumber: t.suiteNumber || '100',
      floor: t.floor || 1,
      rentableSF: t.rentableSF || t.rentableSquareFeet || t.squareFootage || 1000,
      usableSF: t.usableSF || t.rentableSquareFeet || t.squareFootage || 1000,
      loadFactor: t.loadFactor || 1.15,
      configuration: t.configuration || 'Open',
      privateOffices: t.privateOffices || 0,
      workstations: t.workstations || 10,
      conferenceRooms: t.conferenceRooms || 1,
      hasReception: t.hasReception || false,
      hasPrivateRestroom: t.hasPrivateRestroom || false,
      interconnected: t.interconnected || false
    }],
    totalRentableSF: t.rentableSF || t.rentableSquareFeet || t.squareFootage || 1000,
    totalUsableSF: t.usableSF || t.rentableSquareFeet || t.squareFootage || 1000,
    expansion: {
      rightOfFirstOffer: [],
      rightOfFirstRefusal: [],
      mustTake: []
    },
    
    // Lease Terms
    leaseID: t.leaseID || `lease-${Date.now()}`,
    leaseType: t.leaseType || 'Direct',
    originalLeaseDate: new Date(t.originalLeaseDate || t.leaseStartDate || Date.now()),
    commencementDate: new Date(t.commencementDate || t.leaseStartDate || Date.now()),
    rentCommencementDate: new Date(t.rentCommencementDate || t.leaseStartDate || Date.now()),
    expirationDate: new Date(t.expirationDate || t.leaseExpirationDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
    
    // Rent Structure
    baseRentSchedule: [{
      startDate: new Date(t.leaseStartDate || Date.now()),
      endDate: new Date(t.expirationDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
      annualRent: t.annualRent || (t.baseRentPSF || t.rentPSF || 30) * (t.rentableSquareFeet || t.rentableSF || 1000),
      monthlyRent: (t.annualRent || (t.baseRentPSF || t.rentPSF || 30) * (t.rentableSquareFeet || t.rentableSF || 1000)) / 12,
      rentPSF: t.baseRentPSF || t.rentPSF || 30
    }],
    escalations: {
      type: t.escalationType || 'Fixed',
      amount: t.escalationAmount || 3,
      frequency: t.escalationFrequency || 'Annual',
      compounded: t.escalationCompounded || false,
      nextEscalationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    
    // Concessions
    freeRent: {
      months: t.freeRentMonths || 0,
      type: t.freeRentType || 'Net',
      period: t.freeRentPeriod || 'Upfront'
    },
    tenantImprovement: {
      totalAllowance: t.tiAllowance || 0,
      psfAllowance: t.tiPSF || 0,
      standardsBuildout: t.standardsBuildout || false,
      unused: t.unusedTI || 'Forfeit'
    },
    
    // Operating Expenses
    expenseStructure: t.expenseStructure || 'Full Service',
    baseYear: t.baseYear || new Date().getFullYear(),
    
    // Parking
    parking: {
      includedSpaces: t.includedParking || 0,
      additionalSpaces: t.additionalParking || 0,
      monthlyRate: t.parkingRate || 0,
      location: t.parkingLocation || 'Surface',
      reserved: t.reservedParking || false
    },
    
    // Security
    securityDeposit: {
      amount: t.securityDeposit || 0,
      type: t.securityDepositType || 'Cash'
    },
    insurance: {
      liability: t.liabilityInsurance || 1000000,
      property: t.propertyInsurance || 100000,
      businessInterruption: t.businessInterruption || false,
      waiver: t.insuranceWaiver || false
    },
    
    // Operational
    operatingHours: t.operatingHours || 'Standard',
    hvacHours: t.hvacHours || '7:00 AM - 6:00 PM',
    afterHoursHVAC: t.afterHoursHVAC || 35,
    employees: t.employees || 10,
    visitors: t.visitors || 5,
    
    // Performance
    paymentHistory: {
      onTime: t.onTimePayments || 12,
      late: t.latePayments || 0,
      defaulted: t.defaultedPayments || 0,
      averageDaysLate: t.averageDaysLate || 0
    },
    maintenanceTickets: t.maintenanceTickets || 1,
    
    // Options
    renewalOptions: t.renewalOptions || [],
    terminationOptions: t.terminationOptions || [],
    expansionOptions: t.expansionOptions || [],
    
    // Sublease
    subleaseRights: t.subleaseRights || 'Consent Required',
    recapture: t.recapture || false
  })) as unknown as OfficeTenant[];
}

function convertToRetailTenants(tenantArray: any[]): RetailTenantType[] {
  if (!tenantArray || !Array.isArray(tenantArray)) return [];
  
  return tenantArray.map(t => ({
    tenantName: t.name || t.tenantName || 'Unknown Tenant',
    parentCompany: t.parentCompany,
    franchisee: t.franchisee || false,
    nationalTenant: t.nationalTenant || false,
    
    // Store Classification
    category: t.category || 'Inline',
    merchandiseType: t.merchandiseType || 'Other',
    naicsCode: t.naicsCode || '000000',
    essentialService: t.essentialService || false,
    
    // Space Details
    unit: t.unit || 'Unit 1',
    squareFootage: t.squareFootage || 1000,
    frontage: t.frontage || 25,
    location: t.location || 'Strip',
    floor: t.floor || 1,
    
    // Financial Terms
    leaseStartDate: new Date(t.leaseStartDate || Date.now()),
    leaseEndDate: new Date(t.leaseEndDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
    baseRentPSF: t.baseRentPSF || t.rentPSF || 25,
    percentageRent: {
      rate: t.percentageRentRate || 6,
      naturalBreakpoint: t.naturalBreakpoint || (t.baseRentPSF || 25) * (t.squareFootage || 1000) / 0.06,
      artificial: t.artificialBreakpoint
    },
    
    // Sales Data
    reportedSales: t.reportedSales || t.annualSales,
    salesPSF: t.salesPSF || (t.reportedSales || t.annualSales || 0) / (t.squareFootage || 1000),
    compSales: t.compSales || 0,
    salesReporting: t.salesReporting || 'Annual',
    
    // Operating Terms
    camStructure: t.camStructure || 'Pro-rata',
    camCap: t.camCap,
    taxStructure: t.taxStructure || 'Pro-rata',
    insuranceStructure: t.insuranceStructure || 'Pro-rata',
    utilities: t.utilities || 'Separately Metered',
    
    // Lease Clauses
    exclusiveUse: t.exclusiveUse,
    radius: t.radius,
    kickout: t.kickout ? {
      salesThreshold: t.kickout.salesThreshold || 0,
      measurementPeriod: t.kickout.measurementPeriod || 12,
      noticeRequired: t.kickout.noticeRequired || 180
    } : undefined,
    coTenancy: t.coTenancy ? {
      required: t.coTenancy.required || [],
      remedy: t.coTenancy.remedy || 'Rent Reduction',
      rentReduction: t.coTenancy.rentReduction
    } : undefined,
    goingDark: t.goingDark || 'Prohibited',
    
    // Credit & Risk
    creditRating: t.creditRating,
    bankruptcyHistory: t.bankruptcyHistory || false,
    storePerformanceRating: t.storePerformanceRating || 'B'
  })) as unknown as RetailTenant[];
}

function convertToIndustrialTenants(tenantArray: any[]): IndustrialTenant[] {
  if (!tenantArray || !Array.isArray(tenantArray)) return [];
  
  return tenantArray.map(t => ({
    tenantName: t.name || t.tenantName || 'Unknown Tenant',
    parentCompany: t.parentCompany,
    industry: t.industry || 'Logistics',
    naicsCode: t.naicsCode,
    creditRating: t.creditRating,
    publicCompany: t.publicCompany || false,
    
    // Lease Terms
    suiteNumber: t.suiteNumber,
    squareFootage: t.squareFootage || 10000,
    leaseStartDate: new Date(t.leaseStartDate || Date.now()),
    leaseExpirationDate: new Date(t.leaseExpirationDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
    baseRentPSF: t.baseRentPSF || t.rentPSF || 8,
    rentType: t.rentType || 'NNN',
    escalationType: t.escalationType || 'Fixed',
    escalationRate: t.escalationRate || 3,
    
    // Space Configuration
    officePercentage: t.officePercentage || 10,
    warehousePercentage: t.warehousePercentage || 90,
    manufacturingPercentage: t.manufacturingPercentage || 0,
    yardSpace: t.yardSpace,
    
    // Operating Requirements
    clearHeightRequired: t.clearHeightRequired || 24,
    dockDoorsRequired: t.dockDoorsRequired || 2,
    driveInDoorsRequired: t.driveInDoorsRequired || 0,
    powerRequirement: t.powerRequirement || 400,
    temperatureControl: t.temperatureControl || 'Ambient',
    
    // Specialized Features
    railAccess: t.railAccess || false,
    craneCoverage: t.craneCoverage,
    specializedRacking: t.specializedRacking,
    hazmatPermits: t.hazmatPermits || false,
    
    // Operations
    operatingHours: t.operatingHours || '8-5',
    employeeCount: t.employeeCount || 25,
    truckTraffic: t.truckTraffic || 10,
    parkingRequired: t.parkingRequired || 30
  }));
}


function convertToMixedUseComponents(componentArray: any[]): MixedUseComponent[] {
  if (!componentArray || !Array.isArray(componentArray)) return [];
  
  return componentArray.map(c => ({
    type: c.type || 'Office',
    squareFootage: c.squareFootage || 10000,
    floors: c.floors || [1],
    separateEntrance: c.separateEntrance || false,
    dedicatedElevators: c.dedicatedElevators || false,
    percentOfTotal: c.percentOfTotal || 25,
    
    // Financial
    noi: c.noi || 100000,
    capRate: c.capRate || 6,
    rentPSF: c.rentPSF || 30,
    occupancy: c.occupancy || 90,
    
    // Operations
    separateManagement: c.separateManagement || false,
    proRataExpenses: c.proRataExpenses || 50000,
    directExpenses: c.directExpenses || 20000
  }));
}

// PACKAGE-BASED CALCULATION ROUTER
function calculatePackageMetrics(packageId: string, data: PropertyData): any {
  
  switch (packageId) {
    // OFFICE CALCULATIONS
    case 'office-tenant-financial-health':
      if (data.officeTenants?.tenants) {
        const tenants = convertToOfficeTenants(data.officeTenants.tenants);
        const mockMarketData: MarketIntelligence = {
          submarket: {
            name: 'CBD',
            totalInventory: 10000000,
            class: 'CBD',
            vacancy: {
              current: 15,
              classA: 12,
              classB: 18,
              classC: 25,
              trend: 'Stable'
            },
            absorption: {
              trailing12Months: 500000,
              quarterly: [100000, 150000, 125000, 125000],
              trend: 'Positive'
            },
            construction: {
              underConstruction: 1000000,
              planned: 500000,
              delivering: [
                { quarter: 'Q1 2024', sf: 250000 },
                { quarter: 'Q2 2024', sf: 300000 }
              ]
            }
          },
          competitiveProperties: [],
          demandDrivers: {
            employmentGrowth: {
              metro: 2.5,
              submarket: 3.2,
              keyIndustries: [
                { industry: 'Technology', growth: 5.5, share: 25 },
                { industry: 'Financial Services', growth: 2.1, share: 20 }
              ]
            },
            majorEmployers: [],
            transportation: {
              highways: [],
              transit: [],
              airports: []
            }
          }
        };
        
        return {
          tenantFinancialHealth: analyzeTenantFinancialHealth(tenants, mockMarketData)
        };
      }
      break;
      
    case 'office-lease-economics':
      if (data.officeTenants?.tenants) {
        const tenants = convertToOfficeTenants(data.officeTenants.tenants);
        const mockMarketData: MarketIntelligence = {
          submarket: {
            name: 'CBD',
            totalInventory: 10000000,
            class: 'CBD',
            vacancy: {
              current: 15,
              classA: 12,
              classB: 18,
              classC: 25,
              trend: 'Stable'
            },
            absorption: {
              trailing12Months: 500000,
              quarterly: [100000, 150000, 125000, 125000],
              trend: 'Positive'
            },
            construction: {
              underConstruction: 1000000,
              planned: 500000,
              delivering: [
                { quarter: 'Q1 2024', sf: 250000 },
                { quarter: 'Q2 2024', sf: 300000 }
              ]
            }
          },
          competitiveProperties: [],
          demandDrivers: {
            employmentGrowth: {
              metro: 2.5,
              submarket: 3.2,
              keyIndustries: [
                { industry: 'Technology', growth: 5.5, share: 25 },
                { industry: 'Financial Services', growth: 2.1, share: 20 }
              ]
            },
            majorEmployers: [],
            transportation: {
              highways: [],
              transit: [],
              airports: []
            }
          }
        };
        
        return {
          leaseEconomics: analyzeLeaseEconomics(tenants, mockMarketData)
        };
      }
      break;
      
    case 'office-building-operations':
      if (data.rentableSquareFeet && data.operatingExpenses && data.grossIncome) {
        const mockBuilding: BuildingOperations = {
          propertyManager: 'ABC Property Management',
          assetManager: 'XYZ Asset Management',
          engineeringStaff: 3,
          securityStaff: 2,
          janitorialStaff: 5,
          
          hvacSystems: [{
            type: 'VAV',
            age: 10,
            condition: 'Good',
            maintenanceContract: true,
            energyEfficiency: 12.5,
            controls: 'DDC'
          }],
          
          electricalSystems: {
            capacity: 6,
            voltage: '480V',
            backupPower: 'Generator',
            backupCapacity: 100,
            substations: 2
          },
          
          plumbing: {
            domesticWaterAge: 15,
            sewerAge: 20,
            fixtures: 'Low Flow',
            hotWaterSystem: 'Central'
          },
          
          elevatorSystems: {
            passenger: {
              count: 4,
              capacity: 3500,
              speed: 700,
              type: 'Traction',
              age: 8,
              modernized: true
            },
            freight: {
              count: 1,
              capacity: 4000,
              access: ['Loading Dock', 'Parking Garage']
            },
            destinationDispatch: true
          },
          
          technology: {
            internetProviders: ['Verizon', 'AT&T', 'Comcast'],
            fiberOptic: true,
            bandwidth: '1 Gbps',
            riserCapacity: 'Full',
            cellularDAS: true,
            smartBuildingSystems: ['BMS', 'Access Control', 'Security'],
            accessControl: 'Card'
          },
          
          sustainability: {
            energyStarScore: 75,
            energyStarCertified: true,
            leedCertification: 'Gold',
            leedVersion: 'v4',
            boma360: true,
            wireCertification: 'Silver',
            fitWelCertification: false
          },
          
          expenses: [
            {
              category: 'Utilities',
              annual: data.operatingExpenses * 0.35,
              perSF: (data.operatingExpenses * 0.35) / data.rentableSquareFeet,
              recoverable: true,
              trend3Year: 3.5,
              contractual: false
            },
            {
              category: 'Maintenance',
              annual: data.operatingExpenses * 0.25,
              perSF: (data.operatingExpenses * 0.25) / data.rentableSquareFeet,
              recoverable: true,
              trend3Year: 2.8,
              contractual: false
            },
            {
              category: 'Management',
              annual: data.operatingExpenses * 0.15,
              perSF: (data.operatingExpenses * 0.15) / data.rentableSquareFeet,
              recoverable: false,
              trend3Year: 2.0,
              contractual: true
            }
          ]
        };
        
        const mockTenants = data.officeTenants?.tenants ? convertToOfficeTenants(data.officeTenants.tenants) : [];
        
        return {
          buildingOperations: analyzeBuildingOperations(
            mockBuilding,
            mockTenants,
            data.yearBuilt ? new Date().getFullYear() - data.yearBuilt : 20,
            data.rentableSquareFeet
          )
        };
      }
      break;
      
    case 'office-market-positioning':
      if (data.rentableSquareFeet && data.occupancyRate && data.averageRentPSF) {
        const mockProperty = {
          tenants: data.officeTenants?.tenants ? convertToOfficeTenants(data.officeTenants.tenants) : [],
          building: {} as BuildingOperations,
          totalSF: data.rentableSquareFeet,
          occupancy: data.occupancyRate,
          avgRent: data.averageRentPSF,
          parkingRatio: data.parkingSpaces ? data.parkingSpaces / data.rentableSquareFeet * 1000 : 3.0
        };
        
        const mockMarket: MarketIntelligence = {
          submarket: {
            name: 'CBD',
            totalInventory: 10000000,
            class: 'CBD',
            vacancy: {
              current: 15,
              classA: 12,
              classB: 18,
              classC: 25,
              trend: 'Stable'
            },
            absorption: {
              trailing12Months: 500000,
              quarterly: [100000, 150000, 125000, 125000],
              trend: 'Positive'
            },
            construction: {
              underConstruction: 1000000,
              planned: 500000,
              delivering: [
                { quarter: 'Q1 2024', sf: 250000 },
                { quarter: 'Q2 2024', sf: 300000 }
              ]
            }
          },
          competitiveProperties: [],
          demandDrivers: {
            employmentGrowth: {
              metro: 2.5,
              submarket: 3.2,
              keyIndustries: [
                { industry: 'Technology', growth: 5.5, share: 25 },
                { industry: 'Financial Services', growth: 2.1, share: 20 }
              ]
            },
            majorEmployers: [],
            transportation: {
              highways: [],
              transit: [],
              airports: []
            }
          }
        };
        
        return {
          marketPositioning: analyzeMarketPositioning(mockProperty, mockMarket)
        };
      }
      break;

    // ADDITIONAL OFFICE ENHANCED PACKAGES
    case 'office-walt-enhanced':
      if (data.tenants) {
        const tenants = convertToOfficeTenants(data.tenants);
        // Enhanced WALT calculation with credit weighting and options
        const totalRentableSF = tenants.reduce((sum, t) => sum + t.totalRentableSF, 0);
        const weightedLeaseTerms = tenants.map(tenant => {
          const leaseTermMonths = Math.max(0, 
            (tenant.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)
          );
          const creditWeight = tenant.creditRating === 'AAA' ? 1.2 : 
                              tenant.creditRating === 'AA' ? 1.1 : 
                              tenant.creditRating === 'A' ? 1.0 : 0.9;
          return {
            tenant: tenant.tenantName,
            leaseTermMonths,
            rentableSF: tenant.totalRentableSF,
            creditWeight,
            weightedTerm: leaseTermMonths * creditWeight
          };
        });
        
        const walt = totalRentableSF > 0 ? 
          weightedLeaseTerms.reduce((sum, t) => sum + (t.weightedTerm * t.rentableSF), 0) / totalRentableSF : 0;
        
        const waltInYears = walt / 12; // Convert to years
        
        const result = {
          // Basic metrics that display components expect
          walt: waltInYears,
          creditWeightedWALT: waltInYears,
          
          // Enhanced WALT specific metrics
          enhancedWALT: waltInYears,
          tenantConcentration: Math.max(...tenants.map(t => t.totalRentableSF)) / totalRentableSF * 100,
          renewalProbability: data.optionProbability || 75,
          leaseValueScore: tenants.reduce((sum, t) => sum + (t.creditRating === 'AAA' ? 100 : 
            t.creditRating === 'AA' ? 90 : t.creditRating === 'A' ? 80 : 70), 0) / tenants.length,
          
          // Detailed breakdown
          tenantBreakdown: weightedLeaseTerms.map(t => ({
            ...t,
            leaseTermYears: t.leaseTermMonths / 12,
            weightedTermYears: t.weightedTerm / 12
          })),
          totalRentableSF,
          averageCreditRating: tenants.reduce((sum, t) => sum + (t.creditRating === 'AAA' ? 7 : 
            t.creditRating === 'AA' ? 6 : t.creditRating === 'A' ? 5 : 4), 0) / tenants.length
        };
        
        return result;
      }
      break;

    case 'office-tenant-credit-risk':
      if (data.tenants) {
        const tenants = convertToOfficeTenants(data.tenants);
        const totalRentableSF = tenants.reduce((sum, t) => sum + t.totalRentableSF, 0);
        
        const creditAnalysis = tenants.map(tenant => {
          const creditScore = tenant.creditRating === 'AAA' ? 95 : 
                             tenant.creditRating === 'AA' ? 90 : 
                             tenant.creditRating === 'A' ? 85 : 
                             tenant.creditRating === 'BBB' ? 75 : 60;
          const riskScore = 100 - creditScore;
          const sfWeight = tenant.totalRentableSF / totalRentableSF;
          
          return {
            tenant: tenant.tenantName,
            creditRating: tenant.creditRating,
            creditScore,
            riskScore,
            sfWeight,
            weightedRisk: riskScore * sfWeight
          };
        });
        
        const portfolioRisk = creditAnalysis.reduce((sum, t) => sum + t.weightedRisk, 0);
        
        return {
          creditRiskAnalysis: {
            portfolioRiskScore: portfolioRisk,
            tenantAnalysis: creditAnalysis,
            riskLevel: portfolioRisk < 15 ? 'Low' : portfolioRisk < 30 ? 'Medium' : 'High',
            concentration: Math.max(...creditAnalysis.map(t => t.sfWeight)) * 100
          }
        };
      }
      break;

    case 'office-lease-expiration':
      if (data.tenants) {
        const tenants = convertToOfficeTenants(data.tenants);
        const totalRentableSF = tenants.reduce((sum, t) => sum + t.totalRentableSF, 0);
        
        const expirationAnalysis = tenants.map(tenant => {
          const monthsToExpiration = Math.max(0, 
            (tenant.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)
          );
          const yearBucket = Math.floor(monthsToExpiration / 12);
          
          return {
            tenant: tenant.tenantName,
            expirationDate: tenant.expirationDate,
            monthsToExpiration,
            yearBucket,
            rentableSF: tenant.totalRentableSF,
            percentOfTotal: (tenant.totalRentableSF / totalRentableSF) * 100,
            annualRent: tenant.baseRentSchedule[0]?.annualRent || 0
          };
        });
        
        // Group by year buckets
        const yearBuckets = [0, 1, 2, 3, 4, 5].map(year => {
          const tenants = expirationAnalysis.filter(t => t.yearBucket === year);
          return {
            year,
            tenantCount: tenants.length,
            totalSF: tenants.reduce((sum, t) => sum + t.rentableSF, 0),
            percentOfTotal: (tenants.reduce((sum, t) => sum + t.rentableSF, 0) / totalRentableSF) * 100,
            annualRent: tenants.reduce((sum, t) => sum + t.annualRent, 0)
          };
        });
        
        return {
          leaseExpirationAnalysis: {
            tenantExpirations: expirationAnalysis,
            yearBuckets,
            rolloverRisk: yearBuckets.slice(0, 2).reduce((sum, b) => sum + b.percentOfTotal, 0),
            averageLeaseLength: expirationAnalysis.reduce((sum, t) => sum + t.monthsToExpiration, 0) / 
                               expirationAnalysis.length / 12
          }
        };
      }
      break;

    case 'office-space-efficiency':
      if (data.rentableSquareFeet && data.tenants) {
        const tenants = convertToOfficeTenants(data.tenants);
        const totalRentableSF = tenants.reduce((sum, t) => sum + t.totalRentableSF, 0);
        const totalUsableSF = tenants.reduce((sum, t) => sum + t.totalUsableSF, 0);
        
        const spaceAnalysis = tenants.map(tenant => {
          const efficiency = tenant.totalUsableSF / tenant.totalRentableSF;
          const loadFactor = tenant.totalRentableSF / tenant.totalUsableSF;
          const workstationDensity = tenant.suites.reduce((sum, s) => sum + s.workstations, 0) / 
                                    tenant.totalUsableSF * 1000; // per 1000 sf
          
          return {
            tenant: tenant.tenantName,
            rentableSF: tenant.totalRentableSF,
            usableSF: tenant.totalUsableSF,
            efficiency,
            loadFactor,
            workstationDensity,
            configuration: tenant.suites[0]?.configuration || 'Unknown'
          };
        });
        
        return {
          spaceEfficiencyAnalysis: {
            buildingEfficiency: totalUsableSF / totalRentableSF,
            averageLoadFactor: totalRentableSF / totalUsableSF,
            tenantAnalysis: spaceAnalysis,
            utilizationScore: spaceAnalysis.reduce((sum, t) => sum + t.efficiency, 0) / spaceAnalysis.length,
            densityScore: spaceAnalysis.reduce((sum, t) => sum + t.workstationDensity, 0) / spaceAnalysis.length
          }
        };
      }
      break;

    case 'office-lease-npv':
      if (data.tenants && data.discountRate) {
        const tenants = convertToOfficeTenants(data.tenants);
        const discountRate = data.discountRate / 100;
        
        const npvAnalysis = tenants.map(tenant => {
          const schedule = tenant.baseRentSchedule;
          const monthsRemaining = Math.max(0, 
            (tenant.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)
          );
          
          // Calculate NPV of remaining lease payments
          let npv = 0;
          for (let month = 1; month <= monthsRemaining; month++) {
            const monthlyRent = schedule[0]?.monthlyRent || 0;
            const escalatedRent = monthlyRent * Math.pow(1 + (tenant.escalations.amount || 0) / 100 / 12, month);
            npv += escalatedRent / Math.pow(1 + discountRate / 12, month);
          }
          
          return {
            tenant: tenant.tenantName,
            monthsRemaining,
            currentMonthlyRent: schedule[0]?.monthlyRent || 0,
            npv,
            annualizedValue: npv * 12 / monthsRemaining,
            npvPerSF: npv / tenant.totalRentableSF
          };
        });
        
        return {
          leaseNPVAnalysis: {
            tenantNPVs: npvAnalysis,
            portfolioNPV: npvAnalysis.reduce((sum, t) => sum + t.npv, 0),
            weightedNPVPerSF: npvAnalysis.reduce((sum, t) => sum + t.npvPerSF, 0) / npvAnalysis.length,
            discountRate: data.discountRate
          }
        };
      }
      break;

    case 'office-market-position':
      if (data.rentableSquareFeet && data.averageRentPSF && data.occupancyRate) {
        // Enhanced market positioning analysis
        const marketMetrics = {
          averageMarketRent: data.averageRentPSF * 1.1, // Assume 10% above market
          marketOccupancy: 88, // Typical market occupancy
          marketCapRate: 6.5,
          submarketVacancy: 12,
          newSupply: 500000 // SF
        };
        
        const positioning = {
          rentPremium: ((data.averageRentPSF - marketMetrics.averageMarketRent) / marketMetrics.averageMarketRent) * 100,
          occupancyPremium: data.occupancyRate - marketMetrics.marketOccupancy,
          marketShare: data.rentableSquareFeet / 10000000 * 100, // Assume 10M SF submarket
          competitiveAdvantage: data.averageRentPSF > marketMetrics.averageMarketRent ? 'Premium' : 'Discount',
          stabilityScore: data.occupancyRate > 90 ? 'High' : data.occupancyRate > 80 ? 'Medium' : 'Low'
        };
        
        return {
          marketPositionAnalysis: {
            currentMetrics: {
              rentPSF: data.averageRentPSF,
              occupancy: data.occupancyRate,
              totalSF: data.rentableSquareFeet
            },
            marketMetrics,
            positioning,
            recommendations: positioning.rentPremium > 10 ? 
              ['Maintain premium positioning', 'Focus on retention'] :
              ['Opportunity for rent growth', 'Improve tenant amenities']
          }
        };
      }
      break;

    // RETAIL CALCULATIONS
    case 'retail-sales-performance':
      if (data.retailTenants && data.grossLeasableArea && data.trafficCount) {
        const tenants = convertToRetailTenants(data.retailTenants);
        const mockSalesData: SalesData[] = tenants.map(tenant => ({
          tenant: tenant.tenantName,
          month: 12,
          year: 2023,
          grossSales: tenant.reportedSales || (tenant.salesPSF || 0) * tenant.squareFootage,
          returns: (tenant.reportedSales || (tenant.salesPSF || 0) * tenant.squareFootage) * 0.05,
          netSales: (tenant.reportedSales || (tenant.salesPSF || 0) * tenant.squareFootage) * 0.95,
          transactions: Math.floor((tenant.reportedSales || (tenant.salesPSF || 0) * tenant.squareFootage) / 50),
          averageTicket: 50
        }));
        
        return {
          salesPerformance: analyzeSalesPerformance(
            mockSalesData,
            tenants,
            'Strip'
          )
        };
      }
      break;

    case 'retail-co-tenancy':
      if (data.retailTenants && data.grossLeasableArea && data.occupancyRate) {
        const tenants = convertToRetailTenants(data.retailTenants);
        
        return {
          coTenancy: analyzeCoTenancy(tenants, data.occupancyRate, data.grossLeasableArea)
        };
      }
      break;

    // ADDITIONAL RETAIL ENHANCED PACKAGES
    case 'retail-trade-area':
      if (data.retailTenants && data.grossLeasableArea) {
        const tenants = convertToRetailTenants(data.retailTenants);
        const mockDemographics = [
          { distance: 1, population: 25000, households: 9500, medianIncome: 75000, ageMedian: 42 },
          { distance: 3, population: 125000, households: 47000, medianIncome: 68000, ageMedian: 39 },
          { distance: 5, population: 280000, households: 105000, medianIncome: 62000, ageMedian: 36 }
        ];
        
        const mockCompetitors = [
          { name: 'Competing Center A', distance: 1.2, gla: 150000, anchors: ['Target', 'Best Buy'] },
          { name: 'Competing Center B', distance: 2.8, gla: 200000, anchors: ['Walmart', 'TJ Maxx'] }
        ];
        
        const mockTrafficCounts = [
          { location: 'Main Street', count: 45000, peak: 'PM' },
          { location: 'Highway 101', count: 78000, peak: 'AM/PM' }
        ];
        
        return {
          tradeAreaAnalysis: analyzeTradeArea(
            mockDemographics as unknown as TradeArea[],
            tenants,
            mockCompetitors as any,
            mockTrafficCounts as any
          )
        };
      }
      break;

    case 'retail-percentage-rent':
      if (data.retailTenants && data.grossLeasableArea) {
        const tenants = convertToRetailTenants(data.retailTenants);
        
        const percentageRentAnalysis = tenants.map(tenant => {
          const annualSales = tenant.reportedSales || (tenant.salesPSF || 0) * tenant.squareFootage;
          const baseRent = tenant.baseRentPSF * tenant.squareFootage;
          const breakpoint = baseRent / (tenant.percentageRent?.rate || 6) * 100;
          const percentageRent = Math.max(0, (annualSales - breakpoint) * (tenant.percentageRent?.rate || 6) / 100);
          
          return {
            tenant: tenant.tenantName,
            annualSales,
            baseRent,
            breakpoint,
            percentageRent,
            totalRent: baseRent + percentageRent,
            percentageRentRatio: percentageRent / baseRent,
            salesAboveBreakpoint: Math.max(0, annualSales - breakpoint)
          };
        });
        
        return {
          percentageRentAnalysis: {
            tenantAnalysis: percentageRentAnalysis,
            totalPercentageRent: percentageRentAnalysis.reduce((sum, t) => sum + t.percentageRent, 0),
            averagePercentageRatio: percentageRentAnalysis.reduce((sum, t) => sum + t.percentageRentRatio, 0) / percentageRentAnalysis.length,
            tenantsPayingPercentage: percentageRentAnalysis.filter(t => t.percentageRent > 0).length
          }
        };
      }
      break;

    case 'retail-expense-recovery':
      if (data.operatingExpenses && data.grossLeasableArea && data.retailTenants) {
        const tenants = convertToRetailTenants(data.retailTenants);
        const totalGLA = tenants.reduce((sum, t) => sum + t.squareFootage, 0);
        const expensePerSF = data.operatingExpenses / totalGLA;
        
        const recoveryAnalysis = tenants.map(tenant => {
          const proRataShare = tenant.squareFootage / totalGLA;
          const recoverableExpenses = data.operatingExpenses * proRataShare;
          const recoveryRate = 0.95; // 95% recovery assumption
          const actualRecovery = recoverableExpenses * recoveryRate;
          
          return {
            tenant: tenant.tenantName,
            squareFootage: tenant.squareFootage,
            proRataShare,
            recoverableExpenses,
            actualRecovery,
            recoveryPerSF: actualRecovery / tenant.squareFootage,
            shortfall: recoverableExpenses - actualRecovery
          };
        });
        
        return {
          expenseRecoveryAnalysis: {
            tenantRecoveries: recoveryAnalysis,
            totalRecoverable: data.operatingExpenses,
            totalRecovered: recoveryAnalysis.reduce((sum, t) => sum + t.actualRecovery, 0),
            recoveryRate: recoveryAnalysis.reduce((sum, t) => sum + t.actualRecovery, 0) / data.operatingExpenses,
            totalShortfall: recoveryAnalysis.reduce((sum, t) => sum + t.shortfall, 0),
            expensePerSF
          }
        };
      }
      break;

    case 'retail-redevelopment-potential':
      if (data.grossLeasableArea && data.purchasePrice && data.landArea) {
        const currentFAR = data.grossLeasableArea / data.landArea;
        const allowableFAR = data.allowableFAR || currentFAR * 1.5;
        const additionalSF = Math.max(0, (allowableFAR - currentFAR) * data.landArea);
        
        const redevelopmentAnalysis = {
          currentMetrics: {
            totalGLA: data.grossLeasableArea,
            landArea: data.landArea,
            currentFAR,
            utilizationRate: currentFAR / allowableFAR * 100
          },
          redevelopmentPotential: {
            allowableFAR,
            additionalSF,
            totalPotentialSF: data.grossLeasableArea + additionalSF,
            densificationPotential: additionalSF / data.grossLeasableArea * 100
          },
          financialProjection: {
            constructionCostPerSF: 200, // Estimated
            totalConstructionCost: additionalSF * 200,
            projectedRentPerSF: 25,
            additionalNOI: additionalSF * 25 * 0.7, // 70% net margin
            investmentYield: (additionalSF * 25 * 0.7) / (additionalSF * 200) * 100,
            paybackPeriod: (additionalSF * 200) / (additionalSF * 25 * 0.7)
          }
        };
        
        return {
          redevelopmentAnalysis
        };
      }
      break;

    // INDUSTRIAL CALCULATIONS
    case 'industrial-building-functionality':
      if (data.squareFootage && data.clearHeight && data.numberOfDockDoors && data.powerCapacity) {
        const mockSpecs: BuildingSpecs = {
          totalSF: data.squareFootage,
          clearHeight: data.clearHeight,
          columnSpacing: '50x60',
          bayDepth: 200,
          floorThickness: 6,
          floorLoadCapacity: 125,
          
          dockDoors: data.numberOfDockDoors,
          dockDoorSize: '9x10',
          driveInDoors: 0,
          dockLevelers: true,
          dockSeals: true,
          truckCourtDepth: data.truckCourtDepth || 130,
          
          powerCapacity: data.powerCapacity,
          powerType: '3-Phase',
          lightingType: 'LED',
          footCandles: 30,
          hvacType: 'Rooftop',
          fireSuppressionType: 'ESFR',
          sprinklerDensity: 'K-25.2'
        };
        
        const mockTenants = data.industrialTenants ? convertToIndustrialTenants(data.industrialTenants) : [];
        
        return {
          buildingFunctionality: analyzeBuildingFunctionality(
            mockSpecs,
            mockTenants,
            'Warehouse'
          )
        };
      }
      break;

    case 'industrial-location-logistics':
      if (data.squareFootage && data.distanceToHighway) {
        const mockLocation: LocationMetrics = {
          distanceToHighway: data.distanceToHighway,
          distanceToPort: data.distanceToPort || 50,
          distanceToAirport: data.distanceToAirport || 25,
          distanceToRail: data.distanceToRail || 10,
          distanceToIntermodal: data.distanceToIntermodal || 20,
          
          populationOneHour: 1000000,
          laborForceParticipation: 65,
          averageWage: 45000,
          unemploymentRate: 4.5,
          unionPresence: false,
          
          submarket: 'Industrial Park',
          totalInventorySF: 50000000,
          vacancyRate: 8.5,
          netAbsorption12Mo: 2000000,
          underConstruction: 5000000,
          avgAskingRent: 8.50
        };
        
        const mockTenants = data.industrialTenants ? convertToIndustrialTenants(data.industrialTenants) : [];
        
        return {
          locationLogistics: analyzeLocationLogistics(
            mockLocation,
            'Warehouse',
            mockTenants
          )
        };
      }
      break;

    // ADDITIONAL INDUSTRIAL ENHANCED PACKAGES
    case 'industrial-cold-storage':
      if (data.squareFootage && data.clearHeight && data.temperatureControl) {
        const coldStorageAnalysis = {
          buildingSpecs: {
            totalSF: data.squareFootage,
            clearHeight: data.clearHeight,
            temperatureZones: data.numberOfZones || 3,
            temperatureRanges: data.temperatureRanges || [
              { zone: 'Frozen', temp: -10, sf: data.squareFootage * 0.4 },
              { zone: 'Cooler', temp: 35, sf: data.squareFootage * 0.4 },
              { zone: 'Dry', temp: 55, sf: data.squareFootage * 0.2 }
            ],
            refrigerationSystems: data.refrigerationSystems || 2,
            redundancy: data.refrigerationSystems && data.refrigerationSystems > 1
          },
          operationalMetrics: {
            energyUsagePSF: data.energyUsagePSF || 25, // kWh per SF annually
            totalEnergyUsage: (data.energyUsagePSF || 25) * data.squareFootage,
            energyCostPSF: (data.energyUsagePSF || 25) * (data.powerCostPerKwh || 0.12),
            annualEnergyCost: (data.energyUsagePSF || 25) * data.squareFootage * (data.powerCostPerKwh || 0.12),
            insulationRating: data.insulationR_value || 25,
            thermalEfficiency: (data.insulationR_value || 25) / 30 * 100 // Percentage
          },
          marketPosition: {
            coldStorageRentPremium: 3.5, // Premium over warehouse per SF
            demandDrivers: ['E-commerce growth', 'Food delivery', 'Pharmaceutical distribution'],
            competitiveAdvantage: data.clearHeight > 28 ? 'High' : 'Medium',
            specialization: (data.temperatureControl as unknown as string) === 'Multi-Zone' ? 'Specialized' : 'Standard'
          }
        };
        
        return {
          coldStorageAnalysis: analyzeColdStorage(
            coldStorageAnalysis.buildingSpecs as any,
            coldStorageAnalysis.operationalMetrics as any,
            coldStorageAnalysis.marketPosition as any,
            0 // placeholder for additional parameter
          )
        };
      }
      break;

    case 'industrial-last-mile':
      if (data.squareFootage && data.distanceToHighway && data.populationOneHour) {
        const lastMileAnalysis = {
          locationMetrics: {
            distanceToHighway: data.distanceToHighway,
            distanceToAirport: data.distanceToAirport || 15,
            populationOneHour: data.populationOneHour,
            households3Miles: data.households3Miles || 15000,
            ecommerceDeliveryVolume: data.ecommerceDeliveryVolume || 5000 // daily packages
          },
          facilitySpecs: {
            totalSF: data.squareFootage,
            clearHeight: data.clearHeight || 24,
            dockDoors: data.numberOfDockDoors || 4,
            driveInDoors: data.numberOfDriveInDoors || 2,
            batteryChargingStations: data.batteryChargingStations || 0,
            autonomousVehicleReady: data.autonomous_vehicle_ready || false
          },
          operationalCapacity: {
            vehicleCapacity: (data.numberOfDockDoors || 4) * 8, // 8 vehicles per dock
            dailyPackageCapacity: data.squareFootage * 0.5, // 0.5 packages per SF
            sortingCapacity: data.squareFootage * 0.3,
            lastMileRadius: 5, // miles
            deliveryTimeTarget: 2 // hours
          },
          marketMetrics: {
            lastMileRentPremium: 2.5, // Premium over warehouse per SF
            utilization: 85, // Percentage
            growthProjection: 15, // Annual percentage growth
            competitionLevel: data.distanceToHighway < 2 ? 'High' : 'Medium'
          }
        };
        
        return {
          lastMileAnalysis: analyzeLastMileFacility(
            lastMileAnalysis.locationMetrics as any,
            lastMileAnalysis.facilitySpecs as any,
            lastMileAnalysis.operationalCapacity as any
          )
        };
      }
      break;

    // MULTIFAMILY CALCULATIONS
    case 'multifamily-revenue-performance':
      if (data.numberOfUnits && data.monthlyRentalIncome && data.occupancyRate && data.averageRentPerUnit) {
        const mockUnits = Array.from({ length: Math.min(data.numberOfUnits, 10) }, (_, i) => ({
          unitNumber: `Unit ${i + 1}`,
          unitType: ['1BR', '2BR', '2BR', '3BR'][i % 4] as '1BR' | '2BR' | '3BR',
          squareFootage: [750, 1000, 1000, 1200][i % 4],
          floor: Math.floor(i / 4) + 1,
          currentRent: (data.averageRentPerUnit || 1500) + (Math.random() - 0.5) * 200,
          marketRent: (data.averageRentPerUnit || 1500) + 100,
          occupied: Math.random() > (100 - data.occupancyRate) / 100,
          renovated: Math.random() > 0.7,
          amenities: {
            washerDryer: Math.random() > 0.5,
            balcony: Math.random() > 0.6,
            fireplace: Math.random() > 0.8,
            walkInCloset: Math.random() > 0.4,
            upgradedKitchen: Math.random() > 0.7,
            upgradedBath: Math.random() > 0.6
          }
        })) as Unit[];
        
        const mockMarketComps: MarketComps[] = [
          {
            propertyName: 'Comparable Property 1',
            distance: 0.5,
            yearBuilt: 2010,
            totalUnits: 200,
            occupancy: 94,
            avgRentPSF: 1.8,
            amenityScore: 75,
            renovated: true,
            unitMix: { 
              studio: { count: 0, avgRent: 0, avgSF: 0 },
              oneBed: { count: 25, avgRent: 1400, avgSF: 700 },
              twoBed: { count: 50, avgRent: 1800, avgSF: 1000 },
              threeBed: { count: 25, avgRent: 2200, avgSF: 1200 }
            },
            concessionOffered: false
          }
        ];
        
        
        return {
          revenuePerformance: analyzeRevenuePerformance(
            mockUnits,
            mockMarketComps
          )
        };
      }
      break;

    case 'multifamily-operating-performance':
      if (data.operatingExpenses && data.grossIncome && data.numberOfUnits && data.currentOccupancy) {
        const mockUnits = Array.from({ length: Math.min(data.numberOfUnits, 10) }, (_, i) => ({
          unitNumber: `Unit ${i + 1}`,
          unitType: ['1BR', '2BR', '2BR', '3BR'][i % 4] as '1BR' | '2BR' | '3BR',
          squareFootage: [750, 1000, 1000, 1200][i % 4],
          floor: Math.floor(i / 4) + 1,
          currentRent: (data.grossIncome / 12) / data.numberOfUnits,
          marketRent: (data.grossIncome / 12) / data.numberOfUnits + 100,
          occupied: Math.random() > (100 - (data.currentOccupancy || 95)) / 100,
          renovated: Math.random() > 0.7,
          amenities: {
            washerDryer: Math.random() > 0.5,
            balcony: Math.random() > 0.6,
            fireplace: Math.random() > 0.8,
            walkInCloset: Math.random() > 0.4,
            upgradedKitchen: Math.random() > 0.7,
            upgradedBath: Math.random() > 0.6
          }
        })) as Unit[];
        
        const mockExpenses = {
          taxes: data.operatingExpenses * 0.15,
          insurance: data.operatingExpenses * 0.10,
          utilities: data.operatingExpenses * 0.25,
          payroll: data.operatingExpenses * 0.20,
          maintenance: data.operatingExpenses * 0.35,
          management: data.operatingExpenses * 0.15,
          marketing: data.operatingExpenses * 0.05,
          administrative: data.operatingExpenses * 0.08,
          other: data.operatingExpenses * 0.07
        };
        
        const mockMaintenanceLog = Array.from({ length: 20 }, (_, i) => {
          const types = ['Routine', 'Emergency', 'Turnover', 'Capital'] as const;
          const categories = ['HVAC', 'Plumbing', 'Electrical', 'Appliance'];
          const vendors = ['ABC Plumbing', 'XYZ Electric', 'HVAC Pro'];
          
          return {
            date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
            unit: `Unit ${Math.floor(Math.random() * data.numberOfUnits) + 1}`,
            type: types[Math.floor(Math.random() * types.length)]!,
            category: categories[Math.floor(Math.random() * categories.length)]!,
            cost: Math.floor(Math.random() * 500) + 50,
            vendor: vendors[Math.floor(Math.random() * vendors.length)]!
          };
        });
        
        const mockStaffing = [
          { role: 'manager', count: 1, avgSalary: 65000, turnoverRate: 0.15 },
          { role: 'maintenance', count: 2, avgSalary: 45000, turnoverRate: 0.25 },
          { role: 'leasing', count: 1, avgSalary: 40000, turnoverRate: 0.30 }
        ];
        
        return {
          operatingPerformance: analyzeOperatingPerformance(
            mockUnits,
            mockExpenses,
            mockMaintenanceLog,
            mockStaffing
          )
        };
      }
      break;

    // ADDITIONAL MULTIFAMILY ENHANCED PACKAGES
    case 'multifamily-market-position':
      if (data.numberOfUnits && data.averageRent && data.occupancyRate) {
        const marketPositionAnalysis = {
          propertyMetrics: {
            totalUnits: data.numberOfUnits,
            currentRent: data.averageRent,
            occupancy: data.occupancyRate,
            yearBuilt: data.yearBuilt || 2005,
            location: {
              walkScore: data.walkScore || 65,
              transitScore: data.transitScore || 55,
              schoolRating: data.schoolRating || 7,
              crimeIndex: data.crimeIndex || 35
            }
          },
          marketComparisons: {
            averageMarketRent: data.averageRent * 1.05, // 5% premium assumption
            marketOccupancy: 92,
            rentGrowth: 3.5, // Annual percentage
            newSupplyUnits: 500,
            absorptionRate: 85 // Units per month
          },
          competitivePosition: {
            rentPremium: ((data.averageRent - (data.averageRent * 1.05)) / (data.averageRent * 1.05)) * 100,
            occupancyPremium: data.occupancyRate - 92,
            marketShare: data.numberOfUnits / 5000 * 100, // Assume 5000 unit submarket
            amenityScore: 75, // Based on amenities
            conditionScore: (data.yearBuilt || 1980) > 2010 ? 85 : (data.yearBuilt || 1980) > 2000 ? 70 : 60
          }
        };
        
        return {
          marketPositionAnalysis
        };
      }
      break;

    case 'multifamily-value-add':
      if (data.numberOfUnits && data.averageRent && data.renovationBudget) {
        const valueAddAnalysis = {
          currentMetrics: {
            totalUnits: data.numberOfUnits,
            currentRent: data.averageRent,
            occupancy: data.occupancyRate || 85,
            yearBuilt: data.yearBuilt || 1995,
            condition: (data.yearBuilt || 1980) > 2010 ? 'Good' : (data.yearBuilt || 1980) > 2000 ? 'Fair' : 'Poor'
          },
          renovationProgram: {
            totalBudget: data.renovationBudget,
            budgetPerUnit: data.renovationBudget / data.numberOfUnits,
            scope: data.renovationBudget / data.numberOfUnits > 15000 ? 'Full Renovation' : 
                   data.renovationBudget / data.numberOfUnits > 8000 ? 'Moderate Upgrade' : 'Light Refresh',
            timeline: Math.ceil(data.numberOfUnits / 20), // 20 units per month
            phasedApproach: data.numberOfUnits > 100
          },
          projectedReturns: {
            rentIncrease: data.renovationBudget / data.numberOfUnits > 15000 ? 200 : 
                         data.renovationBudget / data.numberOfUnits > 8000 ? 125 : 75,
            occupancyIncrease: 5, // Percentage points
            noiIncrease: ((data.averageRent + (data.renovationBudget / data.numberOfUnits > 15000 ? 200 : 125)) * 
                         (data.occupancyRate + 5) / 100 * 12 * data.numberOfUnits) - 
                         (data.averageRent * (data.occupancyRate || 85) / 100 * 12 * data.numberOfUnits),
            investmentYield: (((data.averageRent + 125) * 90 / 100 * 12 * data.numberOfUnits) - 
                             (data.averageRent * 85 / 100 * 12 * data.numberOfUnits)) / data.renovationBudget * 100,
            paybackPeriod: data.renovationBudget / 
                          (((data.averageRent + 125) * 90 / 100 * 12 * data.numberOfUnits) - 
                           (data.averageRent * 85 / 100 * 12 * data.numberOfUnits)) * 12
          }
        };
        
        return {
          valueAddAnalysis
        };
      }
      break;

    // MIXED-USE CALCULATIONS
    case 'mixeduse-cross-interactions':
      if (data.totalSquareFootage && data.retailSF && data.officeSF && data.residentialUnits) {
        const crossInteractionAnalysis = {
          componentMix: {
            totalSF: data.totalSquareFootage,
            retailSF: data.retailSF,
            officeSF: data.officeSF,
            residentialUnits: data.residentialUnits,
            residentialSF: data.residentialSF || data.residentialUnits * 800,
            diversificationIndex: 1 - Math.max(
              (data.retailSF / data.totalSquareFootage) ** 2,
              (data.officeSF / data.totalSquareFootage) ** 2,
              ((data.residentialSF || data.residentialUnits * 800) / data.totalSquareFootage) ** 2
            )
          },
          synergyMetrics: {
            residentRetailCapture: 15, // Percentage of resident spending captured
            officeRetailCapture: 25, // Percentage of office worker spending captured
            crossUtilization: {
              parkingShared: 20, // Percentage efficiency gain
              amenityShared: 30, // Percentage of amenities shared
              securityShared: 25 // Percentage of security costs shared
            },
            activationScore: 75, // 24-hour activation score
            internalCaptureRate: 18 // Percentage of total spending captured internally
          },
          financialSynergies: {
            sharedCostSavings: data.operatingExpenses * 0.12, // 12% savings from shared systems
            crossTenantRevenue: (data.retailNOI || 0) * 0.15, // 15% revenue boost from cross-traffic
            parkingOptimization: data.parkingSpaces * 50 * 12, // $50/month revenue optimization
            amenityPremium: data.residentialUnits * 25 * 12 // $25/month amenity premium
          }
        };
        
        return {
          crossInteractionAnalysis
        };
      }
      break;

    case 'mixeduse-operational-integration':
      if (data.totalSquareFootage && data.operatingExpenses) {
        const operationalIntegration = {
          sharedSystems: {
            hvac: {
              integrated: true,
              centralPlant: true,
              efficiency: 15, // Percentage improvement
              costSavings: data.operatingExpenses * 0.08
            },
            security: {
              integrated: true,
              centralMonitoring: true,
              accessControl: 'Unified',
              costSavings: data.operatingExpenses * 0.05
            },
            parking: {
              shared: true,
              validationSystem: true,
              efficiency: 25, // Percentage space optimization
              additionalRevenue: data.parkingSpaces * 40 * 12 // $40/month optimization
            },
            utilities: {
              masterMetered: true,
              subMetering: true,
              costAllocation: 'Pro-rata',
              efficiency: 10 // Percentage savings
            }
          },
          managementStructure: {
            integratedManagement: true,
            sharedStaff: ['Maintenance', 'Security', 'Leasing'],
            centralizedOperations: true,
            costReduction: data.operatingExpenses * 0.12
          },
          operationalEfficiency: {
            staffUtilization: 85, // Percentage
            systemIntegration: 80, // Percentage
            costSynergies: data.operatingExpenses * 0.15,
            maintenanceEfficiency: 20 // Percentage improvement
          }
        };
        
        return {
          operationalIntegration
        };
      }
      break;

    case 'mixeduse-development':
      if (data.totalSF && data.totalDevelopmentCost && data.targetRents) {
        const developmentAnalysis = {
          projectMetrics: {
            totalSF: data.totalSF,
            totalDevelopmentCost: data.totalDevelopmentCost,
            costPerSF: data.totalDevelopmentCost / data.totalSF,
            constructionPeriod: data.constructionPeriod || 24,
            leaseUpPeriod: data.leaseUpPeriod || 18,
            totalProjectPeriod: (data.constructionPeriod || 24) + (data.leaseUpPeriod || 18)
          },
          phasingStrategy: {
            phase1: 'Retail + Parking',
            phase2: 'Office Tower',
            phase3: 'Residential',
            phase1Duration: 18,
            phase2Duration: 24,
            phase3Duration: 20,
            totalDuration: 42 // months
          },
          financialProjections: {
            stabilizedNOI: data.targetRents * data.totalSF * 0.7, // 70% net margin
            stabilizedValue: data.targetRents * data.totalSF * 0.7 / 0.065, // 6.5% cap rate
            totalReturn: (data.targetRents * data.totalSF * 0.7 / 0.065) - data.totalDevelopmentCost,
            yieldOnCost: (data.targetRents * data.totalSF * 0.7) / data.totalDevelopmentCost * 100,
            developmentMargin: ((data.targetRents * data.totalSF * 0.7 / 0.065) - data.totalDevelopmentCost) / 
                              data.totalDevelopmentCost * 100
          }
        };
        
        return {
          developmentAnalysis
        };
      }
      break;

    case 'mixeduse-performance':
      if (data.totalSquareFootage && data.grossIncome && data.operatingExpenses) {
        const performanceAnalysis = {
          componentBreakdown: {
            office: {
              sf: data.officeSF || data.totalSquareFootage * 0.4,
              noi: data.officeNOI || data.grossIncome * 0.4 - data.operatingExpenses * 0.4,
              occupancy: 90,
              rentPSF: 35
            },
            retail: {
              sf: data.retailSF || data.totalSquareFootage * 0.3,
              noi: data.retailNOI || data.grossIncome * 0.3 - data.operatingExpenses * 0.3,
              occupancy: 85,
              rentPSF: 25
            },
            residential: {
              sf: data.residentialSF || data.totalSquareFootage * 0.3,
              noi: data.residentialNOI || data.grossIncome * 0.3 - data.operatingExpenses * 0.3,
              occupancy: 95,
              rentPSF: 2.5
            }
          },
          blendedMetrics: {
            blendedCapRate: (data.grossIncome - data.operatingExpenses) / data.purchasePrice * 100,
            blendedOccupancy: 90, // Weighted average
            totalNOI: data.grossIncome - data.operatingExpenses,
            diversificationScore: 75, // Based on component mix
            synergyScore: 65 // Based on cross-utilization
          }
        };
        
        return {
          performanceAnalysis
        };
      }
      break;

    case 'mixed-use-performance':
      if (data.totalSquareFootage && data.grossIncome && data.operatingExpenses) {
        const mockComponents = convertToMixedUseComponents([
          {
            type: 'Office',
            squareFootage: data.totalSquareFootage * 0.4,
            floors: [2, 3, 4],
            noi: data.grossIncome * 0.4 - data.operatingExpenses * 0.4,
            capRate: 6.5,
            rentPSF: 35,
            occupancy: 90
          },
          {
            type: 'Retail',
            squareFootage: data.totalSquareFootage * 0.3,
            floors: [1],
            noi: data.grossIncome * 0.3 - data.operatingExpenses * 0.3,
            capRate: 7.0,
            rentPSF: 25,
            occupancy: 85
          },
          {
            type: 'Residential',
            squareFootage: data.totalSquareFootage * 0.3,
            floors: [5, 6, 7, 8],
            noi: data.grossIncome * 0.3 - data.operatingExpenses * 0.3,
            capRate: 5.5,
            rentPSF: 2.5,
            occupancy: 95
          }
        ]);
        
        const mockSharedSystems: SharedSystems = {
          hvac: {
            type: 'Central',
            allocation: new Map([
              ['Office', 40],
              ['Retail', 30],
              ['Residential', 30]
            ]),
            redundancy: true
          },
          elevators: {
            total: 4,
            dedicated: new Map([
              ['Office', 2],
              ['Residential', 1]
            ]),
            shared: 1
          },
          parking: {
            totalSpaces: Math.floor(data.totalSquareFootage / 300),
            allocation: new Map([
              ['Office', 4.0],
              ['Retail', 3.0],
              ['Residential', 1.5]
            ]),
            validationSystem: true,
            separateLevels: true
          },
          utilities: {
            masterMetered: true,
            subMetering: new Map([
              ['Office', true],
              ['Retail', true],
              ['Residential', false]
            ]),
            allocation: 'ProRata'
          },
          security: {
            integrated: true,
            separateAccess: new Map([
              ['Office', true],
              ['Retail', false],
              ['Residential', true]
            ]),
            sharedLobby: false,
            afterHoursProtocol: 'Card access with security monitoring'
          }
        };
        
        return {
          mixedUsePerformance: analyzeMixedUsePerformance(
            mockComponents,
            mockSharedSystems,
            data.totalInvestment || data.purchasePrice || 0,
            data.loanAmount && data.interestRate && data.loanTerm ? 
              calculateAnnualDebtService(data.loanAmount, data.interestRate, data.loanTerm) : 0
          )
        };
      }
      break;

    // QUICK VALUATION PACKAGES
    case 'office-quick-valuation':
      const quickOfficeResults: any = {};
      
      // Cap Rate = (NOI / Purchase Price) × 100
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickOfficeResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Price Per SF = Purchase Price / Total SF
      if (data.purchasePrice && data.totalSF && data.totalSF > 0) {
        quickOfficeResults.pricePerSF = data.purchasePrice / data.totalSF;
      }
      
      // GRM = Purchase Price / Gross Annual Income
      if (data.purchasePrice && data.currentNOI && data.currentNOI > 0) {
        // Estimate gross income as NOI / 0.75 (assuming 75% NOI ratio)
        const estimatedGrossIncome = data.currentNOI / 0.75;
        quickOfficeResults.grm = data.purchasePrice / estimatedGrossIncome;
      }
      
      return quickOfficeResults;

    case 'office-quick-returns':
      const quickReturnsResults: any = {};
      
      // Cap Rate
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickReturnsResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Cash-on-Cash Return
      if (data.annualCashFlow && data.totalInvestment && data.totalInvestment > 0) {
        quickReturnsResults.cashOnCash = (data.annualCashFlow / data.totalInvestment) * 100;
      }
      
      // ROI - use simple annual return calculation
      if (data.annualCashFlow && data.totalInvestment && data.totalInvestment > 0) {
        quickReturnsResults.roi = (data.annualCashFlow / data.totalInvestment) * 100;
      }
      
      return quickReturnsResults;

    case 'retail-quick-valuation':
      const quickRetailResults: any = {};
      
      // Cap Rate
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickRetailResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Price Per SF
      if (data.purchasePrice && data.grossLeasableArea && data.grossLeasableArea > 0) {
        quickRetailResults.pricePerSF = data.purchasePrice / data.grossLeasableArea;
      }
      
      return quickRetailResults;

    case 'industrial-quick-valuation':
      const quickIndustrialResults: any = {};
      
      // Cap Rate
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickIndustrialResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Price Per SF
      if (data.purchasePrice && data.totalSF && data.totalSF > 0) {
        quickIndustrialResults.pricePerSF = data.purchasePrice / data.totalSF;
      }
      
      return quickIndustrialResults;

    case 'office-quick-lease':
      const quickLeaseResults: any = {};
      
      // Effective Rent PSF = Average Rent PSF - Operating Expenses PSF
      if (data.averageRentPSF && data.operatingExpenses) {
        // Assume building is 50,000 SF for expense PSF calculation if not provided
        const assumedSF = 50000;
        const expensesPSF = data.operatingExpenses / assumedSF;
        quickLeaseResults.effectiveRentPSF = data.averageRentPSF - expensesPSF;
      }
      
      return quickLeaseResults;

    case 'multifamily-quick-valuation':
      const quickMultifamilyResults: any = {};
      
      // Cap Rate = NOI / Purchase Price
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickMultifamilyResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Price Per Unit
      if (data.purchasePrice && data.numberOfUnits && data.numberOfUnits > 0) {
        quickMultifamilyResults.pricePerUnit = data.purchasePrice / data.numberOfUnits;
      }
      
      // GRM = Purchase Price / Gross Annual Rent
      if (data.purchasePrice && data.averageRent && data.numberOfUnits && data.occupancyRate) {
        const grossAnnualRent = data.averageRent * 12 * data.numberOfUnits * (data.occupancyRate / 100);
        if (grossAnnualRent > 0) {
          quickMultifamilyResults.grm = data.purchasePrice / grossAnnualRent;
        }
      }
      
      return quickMultifamilyResults;

    case 'mixeduse-quick-valuation':
      const quickMixedUseResults: any = {};
      
      // Cap Rate
      if (data.currentNOI && data.purchasePrice && data.purchasePrice > 0) {
        quickMixedUseResults.capRate = (data.currentNOI / data.purchasePrice) * 100;
      }
      
      // Price Per SF
      if (data.purchasePrice && data.totalSF && data.totalSF > 0) {
        quickMixedUseResults.pricePerSF = data.purchasePrice / data.totalSF;
      }
      
      return quickMixedUseResults;

    default:
      console.warn(`Unknown package ID: ${packageId}`);
      return null;
  }
  
  return null;
}

// Calculate DSCR (NOI / Annual Debt Service)
// export function calculateDSCR(noi: number, annualDebtService: number): number {
//   if (!noi || !annualDebtService) return 0;
//   return noi / annualDebtService;
// }

// Calculate breakeven occupancy
// export function calculateBreakeven(
//   operatingExpenses: number,
//   grossIncome: number
// ): number {
//   if (!operatingExpenses || !grossIncome) return 0;
//   return (operatingExpenses / grossIncome) * 100;
// }

// Calculate Cap Rate
// export function calculateCapRate(noi: number, purchasePrice: number): number {
//   if (!noi || !purchasePrice) return 0;
//   return (noi / purchasePrice) * 100;
// }

// Calculate Cash on Cash Return
// export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
//   if (!annualCashFlow || !totalInvestment) return 0;
//   return (annualCashFlow / totalInvestment) * 100;
// }

/**
 * Calculates the Return on Investment
 * @param annualCashFlow Annual cash flow
 * @param totalInvestment Initial investment amount
 * @param holdingPeriod Holding period in years
 * @param currentNOI Current Net Operating Income
 * @param projectedNOI Projected Net Operating Income
 * @param capRate Current cap rate
 * @returns ROI as a percentage (e.g., 15.3 for 15.3%)
 */
export function calculateROI(
  annualCashFlow: number,
  totalInvestment: number,
  holdingPeriod: number,
  currentNOI: number,
  projectedNOI: number,
  capRate: number
): number {

  if (!annualCashFlow || !totalInvestment || !holdingPeriod || !currentNOI || !projectedNOI) {
    return 0;
  }

  if (totalInvestment <= 0 || holdingPeriod <= 0) {
    return 0;
  }

  // Calculate property appreciation based on NOI growth
  const noiGrowth = projectedNOI - currentNOI;
  let propertyAppreciation = 0;

  // Only calculate appreciation if we have a valid cap rate
  if (capRate && capRate > 0) {
    propertyAppreciation = noiGrowth / (capRate / 100); // Convert cap rate from percentage to decimal
  } else {
    // If no cap rate, use a conservative estimate based on NOI growth
    propertyAppreciation = noiGrowth * 10; // Assume 10x NOI growth as property value
  }

  // Calculate total return (cash flow + appreciation)
  const totalCashFlow = annualCashFlow * holdingPeriod;
  const totalReturn = totalCashFlow + propertyAppreciation;

  // Calculate ROI
  const roi = (totalReturn / totalInvestment) * 100;


  // Validate the result
  if (isNaN(roi) || !isFinite(roi)) {
    return 0;
  }

  return Math.max(roi, 0);
}

// Calculate IRR using a simplified approximation
export function calculateIRR(
  annualCashFlow: number,
  totalInvestment: number,
  holdingPeriod: number,
  currentNOI: number,
  projectedNOI: number,
  capRate: number
): number {

  // Validate inputs
  if (!annualCashFlow || !totalInvestment || !holdingPeriod || !currentNOI || !projectedNOI) {
    return 0;
  }

  if (totalInvestment <= 0) {
    return 0;
  }

  if (holdingPeriod <= 0) {
    return 0;
  }

  // Calculate property appreciation based on NOI growth
  const noiGrowth = projectedNOI - currentNOI;
  let propertyAppreciation = 0;

  // Only calculate appreciation if we have a valid cap rate
  if (capRate && capRate > 0) {
    propertyAppreciation = noiGrowth / (capRate / 100); // Convert cap rate from percentage to decimal
  } else {
    // If no cap rate, use a conservative estimate based on NOI growth
    propertyAppreciation = noiGrowth * 10; // Assume 10x NOI growth as property value
  }
  
  // Calculate total return (cash flow + appreciation)
  const totalCashFlow = annualCashFlow * holdingPeriod;
  const totalReturn = totalCashFlow + propertyAppreciation;

  // Ensure total return is positive
  if (totalReturn <= 0) {
    return 0;
  }

  // Calculate IRR using the formula: IRR = (Total Return / Total Investment)^(1/holdingPeriod) - 1
  const irr = (Math.pow(totalReturn / totalInvestment, 1 / holdingPeriod) - 1) * 100;
  

  // Validate the result
  if (isNaN(irr) || !isFinite(irr)) {
    return 0;
  }

  // Cap the IRR at a reasonable maximum (e.g., 50%)
  return Math.min(Math.max(irr, 0), 50);
}

// Calculate all metrics
export function calculateAllMetrics(propertyData: PropertyData, flags: MetricFlags): CalculatedMetrics {
  const metrics: CalculatedMetrics = {};

  if (flags.capRate && propertyData.currentNOI && propertyData.purchasePrice) {
    metrics.capRate = calculateCapRate(propertyData.currentNOI, propertyData.purchasePrice);
  }

  if (flags.cashOnCash && propertyData.annualCashFlow && propertyData.totalInvestment) {
    metrics.cashOnCash = calculateCashOnCash(propertyData.annualCashFlow, propertyData.totalInvestment);
  }

  if (flags.dscr && propertyData.currentNOI && propertyData.loanAmount && 
      propertyData.interestRate && propertyData.loanTerm) {
    metrics.dscr = calculateDSCR(
      propertyData.currentNOI,
      propertyData.loanAmount,
      propertyData.interestRate,
      propertyData.loanTerm
    );
  }

  if (flags.irr && propertyData.annualCashFlow && propertyData.totalInvestment && 
      propertyData.currentNOI && propertyData.projectedNOI && propertyData.holdingPeriod) {
    metrics.irr = calculateIRR(
      propertyData.annualCashFlow,
      propertyData.totalInvestment,
      propertyData.holdingPeriod,
      propertyData.currentNOI,
      propertyData.projectedNOI,
      metrics.capRate || 0
    );
  }

  if (flags.roi && propertyData.annualCashFlow && propertyData.totalInvestment && 
      propertyData.holdingPeriod && propertyData.currentNOI && propertyData.projectedNOI) {
    metrics.roi = calculateROI(
      propertyData.annualCashFlow,
      propertyData.totalInvestment,
      propertyData.holdingPeriod,
      propertyData.currentNOI,
      propertyData.projectedNOI,
      metrics.capRate || 0
    );
  }

  if (flags.breakeven && propertyData.operatingExpenses && propertyData.grossIncome && 
      propertyData.loanAmount && propertyData.interestRate && propertyData.loanTerm) {
    metrics.breakeven = calculateBreakeven(
      propertyData.operatingExpenses,
      propertyData.grossIncome,
      propertyData.loanAmount,
      propertyData.interestRate,
      propertyData.loanTerm
    );
  }

  return metrics;
}

// Calculate deal assessment
export function calculateDealAssessment(metrics: CalculatedMetrics, flags: MetricFlags): DealAssessment {
  const activeMetrics = Object.values(flags).filter(Boolean).length;
  
  if (activeMetrics === 0) {
    return {
      overall: 'insufficient',
      recommendation: 'Please enable metrics to get an assessment.',
      metricScores: {},
      activeMetrics: 0
    };
  }

  const scores: { [key: string]: AssessmentLevel } = {};
  let excellentCount = 0;
  let goodCount = 0;
  let fairCount = 0;
  let poorCount = 0;

  // Assess each enabled metric
  if (flags.capRate && typeof metrics.capRate === 'number' && metrics.capRate > 0) {
    scores.capRate = metrics.capRate >= 8 ? 'strong' : metrics.capRate >= 6 ? 'moderate' : 'weak';
    if (scores.capRate === 'strong') excellentCount++;
    else if (scores.capRate === 'moderate') goodCount++;
    else if (scores.capRate === 'weak') fairCount++;
    else poorCount++;
  }

  if (flags.cashOnCash && typeof metrics.cashOnCash === 'number' && metrics.cashOnCash > 0) {
    scores.cashOnCash = metrics.cashOnCash >= 8 ? 'strong' : metrics.cashOnCash >= 6 ? 'moderate' : 'weak';
    if (scores.cashOnCash === 'strong') excellentCount++;
    else if (scores.cashOnCash === 'moderate') goodCount++;
    else if (scores.cashOnCash === 'weak') fairCount++;
    else poorCount++;
  }

  if (flags.dscr && typeof metrics.dscr === 'number' && metrics.dscr > 0) {
    scores.dscr = metrics.dscr >= 1.25 ? 'strong' : metrics.dscr >= 1.1 ? 'moderate' : 'weak';
    if (scores.dscr === 'strong') excellentCount++;
    else if (scores.dscr === 'moderate') goodCount++;
    else if (scores.dscr === 'weak') fairCount++;
    else poorCount++;
  }

  if (flags.irr && typeof metrics.irr === 'number' && metrics.irr > 0) {
    scores.irr = metrics.irr >= 12 ? 'strong' : metrics.irr >= 8 ? 'moderate' : 'weak';
    if (scores.irr === 'strong') excellentCount++;
    else if (scores.irr === 'moderate') goodCount++;
    else if (scores.irr === 'weak') fairCount++;
    else poorCount++;
  }

  if (flags.roi && typeof metrics.roi === 'number' && metrics.roi > 0) {
    scores.roi = metrics.roi >= 12 ? 'strong' : metrics.roi >= 8 ? 'moderate' : 'weak';
    if (scores.roi === 'strong') excellentCount++;
    else if (scores.roi === 'moderate') goodCount++;
    else if (scores.roi === 'weak') fairCount++;
    else poorCount++;
  }

  if (flags.breakeven && typeof metrics.breakeven === 'number' && metrics.breakeven > 0) {
    scores.breakeven = metrics.breakeven <= 85 ? 'strong' : metrics.breakeven <= 90 ? 'moderate' : 'weak';
    if (scores.breakeven === 'strong') excellentCount++;
    else if (scores.breakeven === 'moderate') goodCount++;
    else if (scores.breakeven === 'weak') fairCount++;
    else poorCount++;
  }

  // Determine overall assessment
  let overall: AssessmentLevel;
  let recommendation: string;

  if (excellentCount > goodCount && excellentCount > fairCount && excellentCount > poorCount) {
    overall = 'strong';
    recommendation = 'This deal shows excellent potential with multiple positive metrics.';
  } else if (goodCount >= excellentCount && goodCount >= fairCount && goodCount >= poorCount) {
    overall = 'moderate';
    recommendation = 'This deal shows good potential. Consider negotiating better terms.';
  } else if (fairCount > excellentCount && fairCount > goodCount && fairCount > poorCount) {
    overall = 'weak';
    recommendation = 'This deal shows moderate potential with some areas of concern.';
  } else {
    overall = 'insufficient';
    recommendation = 'This deal shows several areas of concern. Consider passing or renegotiating.';
  }

  return {
    overall,
    recommendation,
    metricScores: scores,
    activeMetrics: Object.keys(scores).length
  };
}

/**
 * Calculates the price per square foot of a property
 * @param purchasePrice Total purchase price of the property
 * @param squareFootage Total square footage of the property
 * @returns Price per square foot
 */
export function calculatePricePerSF(purchasePrice: number, squareFootage: number): number {
  if (!squareFootage || squareFootage <= 0) {
    throw new Error('Square footage must be greater than 0');
  }
  return purchasePrice / squareFootage;
}

/**
 * Calculates the Loan-to-Value ratio
 * @param loanAmount Amount of the loan
 * @param purchasePrice Total purchase price of the property
 * @returns LTV as a percentage (e.g., 75 for 75%)
 */
export function calculateLTV(loanAmount: number, purchasePrice: number): number {
  if (!purchasePrice || purchasePrice <= 0) {
    throw new Error('Purchase price must be greater than 0');
  }
  return (loanAmount / purchasePrice) * 100;
}

/**
 * Calculates the Gross Rent Multiplier
 * @param purchasePrice Total purchase price of the property
 * @param grossIncome Annual gross income
 * @returns Gross Rent Multiplier
 */
export function calculateGrossRentMultiplier(purchasePrice: number, grossIncome: number): number {
  if (!grossIncome || grossIncome <= 0) {
    throw new Error('Gross income must be greater than 0');
  }
  return purchasePrice / grossIncome;
}

/**
 * Calculates the price per unit for multifamily properties
 * @param purchasePrice Total purchase price of the property
 * @param numberOfUnits Number of units in the property
 * @returns Price per unit
 */
export function calculatePricePerUnit(purchasePrice: number, numberOfUnits: number): number {
  if (!numberOfUnits || numberOfUnits <= 0) {
    throw new Error('Number of units must be greater than 0');
  }
  return purchasePrice / numberOfUnits;
}

/**
 * Calculates the Effective Gross Income considering occupancy
 * @param grossIncome Potential gross income
 * @param occupancyRate Occupancy rate as a percentage (e.g., 95 for 95%)
 * @returns Effective gross income
 */
export function calculateEffectiveGrossIncome(grossIncome: number, occupancyRate: number): number {
  if (occupancyRate < 0 || occupancyRate > 100) {
    throw new Error('Occupancy rate must be between 0 and 100');
  }
  return grossIncome * (occupancyRate / 100);
}

/**
 * Calculates the Cap Rate
 * @param currentNOI Net Operating Income
 * @param purchasePrice Total purchase price of the property
 * @returns Cap Rate as a percentage (e.g., 6.5 for 6.5%)
 */
export function calculateCapRate(currentNOI: number, purchasePrice: number): number {
  if (!purchasePrice || purchasePrice <= 0) {
    throw new Error('Purchase price must be greater than 0');
  }
  return (currentNOI / purchasePrice) * 100;
}

/**
 * Calculates the Cash-on-Cash Return
 * @param annualCashFlow Annual cash flow
 * @param totalInvestment Total investment amount
 * @returns Cash-on-Cash Return as a percentage (e.g., 8.2 for 8.2%)
 */
export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
  if (!totalInvestment || totalInvestment <= 0) {
    throw new Error('Total investment must be greater than 0');
  }
  return (annualCashFlow / totalInvestment) * 100;
}

/**
 * Calculates the Debt Service Coverage Ratio
 * @param currentNOI Net Operating Income
 * @param loanAmount Amount of the loan
 * @param interestRate Annual interest rate as a percentage (e.g., 5.5 for 5.5%)
 * @param loanTerm Loan term in years
 * @returns Debt Service Coverage Ratio
 */
export function calculateDSCR(
  currentNOI: number,
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!loanAmount || loanAmount <= 0) {
    throw new Error('Loan amount must be greater than 0');
  }
  if (interestRate <= 0 || interestRate > 100) {
    throw new Error('Interest rate must be between 0 and 100');
  }
  if (!loanTerm || loanTerm <= 0) {
    throw new Error('Loan term must be greater than 0');
  }

  // Calculate monthly payment using the loan amortization formula
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const annualDebtService = monthlyPayment * 12;
  return currentNOI / annualDebtService;
}

/**
 * Calculates the Breakeven Point
 * @param operatingExpenses Total operating expenses
 * @param grossIncome Gross income
 * @returns Breakeven occupancy rate as a percentage (e.g., 85.5 for 85.5%)
 */
export function calculateBreakeven(
  operatingExpenses: number,
  grossIncome: number,
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number {
  if (!operatingExpenses || !grossIncome || !loanAmount || !interestRate || !loanTerm) return 0;
  
  const annualDebtService = calculateAnnualDebtService(loanAmount, interestRate, loanTerm);
  return ((operatingExpenses + annualDebtService) / grossIncome) * 100;
}

/**
 * Calculates simplified Weighted Average Lease Term (WALT) for office tenants
 * @param tenants Array of SimpleTenant objects with name, annualRent, and leaseExpiration
 * @returns WALT in years, or null if no valid data
 */
export function calculateSimpleWALT(tenants: SimpleTenant[]): number | null {
  if (!tenants || tenants.length === 0) return null;
  
  const currentDate = new Date();
  const totalRent = tenants.reduce((sum, t) => sum + t.annualRent, 0);
  
  if (totalRent === 0) return null;
  
  let weightedMonths = 0;
  
  tenants.forEach(tenant => {
    const expirationDate = new Date(tenant.leaseExpiration);
    const monthsRemaining = Math.max(0, 
      (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const rentWeight = tenant.annualRent / totalRent;
    weightedMonths += rentWeight * monthsRemaining;
  });
  
  return Number((weightedMonths / 12).toFixed(2)); // Convert to years
}

/**
 * Calculates sales per square foot for retail tenants
 * @param tenants Array of RetailTenant objects
 * @returns Object with average sales per SF and breakdown by tenant, or null if no data
 */
export function calculateSalesPerSF(tenants: RetailTenant[]): {
  average: number;
  byTenant: { name: string; salesPerSF: number }[];
} | null {
  if (!tenants || tenants.length === 0) return null;
  
  const results = tenants.map(tenant => ({
    name: tenant.tenantName,
    salesPerSF: (tenant.reportedSales || 0) / tenant.squareFootage
  }));
  
  const average = results.reduce((sum, t) => sum + t.salesPerSF, 0) / results.length;
  
  return {
    average: Number(average.toFixed(2)),
    byTenant: results.map(r => ({
      ...r,
      salesPerSF: Number(r.salesPerSF.toFixed(2))
    }))
  };
}

/**
 * Calculates industrial property metrics based on clear height and other factors
 * @param data Object containing squareFootage, clearHeight, and purchasePrice
 * @returns Object with price per SF, clear height category, and estimated premium, or null if invalid data
 */
export function calculateIndustrialMetrics(data: {
  squareFootage: number;
  clearHeight: number;
  purchasePrice: number;
}): {
  pricePerSF: number;
  clearHeightCategory: string;
  estimatedPremium: string;
} | null {
  if (!data.squareFootage || !data.purchasePrice) return null;
  
  const pricePerSF = data.purchasePrice / data.squareFootage;
  
  // Industry standard clear height categories
  let category = '';
  let premium = '';
  
  if (data.clearHeight >= 36) {
    category = 'Modern Spec (36ft+)';
    premium = '15-25% premium';
  } else if (data.clearHeight >= 28) {
    category = 'Standard Modern (28-35ft)';
    premium = 'Market rate';
  } else if (data.clearHeight >= 24) {
    category = 'Older Generation (24-27ft)';
    premium = '10-20% discount';
  } else {
    category = 'Functionally Obsolete (<24ft)';
    premium = '25-40% discount';
  }
  
  return {
    pricePerSF: Number(pricePerSF.toFixed(2)),
    clearHeightCategory: category,
    estimatedPremium: premium
  };
}

/**
 * Calculates multifamily property metrics and market comparison
 * @param data Object containing totalUnits, monthlyRentalIncome, and optional marketAverageRent
 * @returns Object with revenue per unit, annualized revenue, and market comparison, or null if invalid data
 */
export function calculateMultifamilyMetrics(data: {
  totalUnits: number;
  monthlyRentalIncome: number;
  marketAverageRent?: number;
}): {
  revenuePerUnit: number;
  annualizedRevenue: number;
  marketComparison?: string;
} | null {
  if (!data.totalUnits || !data.monthlyRentalIncome) return null;
  
  const revenuePerUnit = data.monthlyRentalIncome / data.totalUnits;
  const annualizedRevenue = data.monthlyRentalIncome * 12;
  
  let marketComparison;
  if (data.marketAverageRent) {
    const difference = ((revenuePerUnit - data.marketAverageRent) / data.marketAverageRent) * 100;
    if (difference > 5) {
      marketComparison = `${difference.toFixed(1)}% above market`;
    } else if (difference < -5) {
      marketComparison = `${Math.abs(difference).toFixed(1)}% below market`;
    } else {
      marketComparison = 'At market rate';
    }
  }
  
  return {
    revenuePerUnit: Number(revenuePerUnit.toFixed(2)),
    annualizedRevenue,
    ...(marketComparison !== undefined && { marketComparison })
  };
} 