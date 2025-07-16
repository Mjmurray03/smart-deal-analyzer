// lib/calculations/integration-test.ts
// Comprehensive integration test for enhanced asset-specific modules

import { PropertyData, MetricFlags } from './types';
import { calculateMetrics, calculateDealAssessment } from './metrics';
import { 
  getAssetCalculationFunctions, 
  validateAssetDataRequirements,
  getAssetMetricCategories
} from './asset-metrics';
import { 
  getAssetPackageRecommendations, 
  getAvailableAssetAnalysis,
  getRequiredFields 
} from './packages';

// Test data for different property types
const testOfficeData: PropertyData = {
  propertyType: 'office',
  purchasePrice: 1000000,
  currentNOI: 80000,
  projectedNOI: 90000,
  totalInvestment: 1200000,
  annualCashFlow: 50000,
  loanAmount: 800000,
  interestRate: 4.5,
  loanTerm: 30,
  grossIncome: 120000,
  operatingExpenses: 40000,
  discountRate: 7,
  holdingPeriod: 10,
  weightedAverageLeaseTerm: 5.2,
  squareFootage: 10000,
  numberOfUnits: 10,
  parkingSpaces: 20,
  occupancyRate: 0.95,
  averageRent: 2000
};

const testRetailData: PropertyData = {
  propertyType: 'retail',
  purchasePrice: 2000000,
  currentNOI: 150000,
  projectedNOI: 170000,
  totalInvestment: 2200000,
  annualCashFlow: 90000,
  loanAmount: 1500000,
  interestRate: 4.2,
  loanTerm: 25,
  grossIncome: 250000,
  operatingExpenses: 100000,
  discountRate: 6.5,
  holdingPeriod: 7,
  trafficCount: 5000,
  squareFootage: 20000,
  numberOfUnits: 15,
  parkingSpaces: 40,
  occupancyRate: 0.92,
  averageRent: 1800
};

const testIndustrialData: PropertyData = {
  propertyType: 'industrial',
  purchasePrice: 3000000,
  currentNOI: 250000,
  projectedNOI: 270000,
  totalInvestment: 3200000,
  annualCashFlow: 120000,
  loanAmount: 2000000,
  interestRate: 4.0,
  loanTerm: 20,
  grossIncome: 350000,
  operatingExpenses: 100000,
  discountRate: 6.0,
  holdingPeriod: 8,
  distanceToHighway: 2,
  squareFootage: 30000,
  numberOfUnits: 5,
  parkingSpaces: 50,
  occupancyRate: 0.98,
  averageRent: 1500
};

const testMultifamilyData: PropertyData = {
  propertyType: 'multifamily',
  purchasePrice: 4000000,
  currentNOI: 350000,
  projectedNOI: 370000,
  totalInvestment: 4200000,
  annualCashFlow: 150000,
  loanAmount: 2500000,
  interestRate: 3.8,
  loanTerm: 30,
  grossIncome: 450000,
  operatingExpenses: 100000,
  discountRate: 5.5,
  holdingPeriod: 12,
  unitMix: [],
  squareFootage: 40000,
  numberOfUnits: 40,
  parkingSpaces: 60,
  occupancyRate: 0.93,
  averageRent: 1200
};

const testMixedUseData: PropertyData = {
  propertyType: 'mixed-use',
  purchasePrice: 5000000,
  currentNOI: 450000,
  projectedNOI: 470000,
  totalInvestment: 5200000,
  annualCashFlow: 180000,
  loanAmount: 3000000,
  interestRate: 4.1,
  loanTerm: 25,
  grossIncome: 550000,
  operatingExpenses: 100000,
  discountRate: 6.2,
  holdingPeriod: 10,
  totalSquareFootage: 50000,
  squareFootage: 50000,
  numberOfUnits: 20,
  parkingSpaces: 80,
  occupancyRate: 0.90,
  averageRent: 2200
};

// Test metric flags
const testMetricFlags: MetricFlags = {
  capRate: true,
  cashOnCash: true,
  dscr: true,
  ltv: false,
  irr: true,
  roi: true,
  breakeven: true,
  pricePerSF: true,
  grm: false,
  pricePerUnit: false,
  egi: false
};

/* 
const mockAssessment: DealAssessment = {
  overall: 'Excellent',
  recommendation: 'Strong deal',
  metricScores: {
    capRate: 'Excellent',
    cashOnCash: 'Good',
    dscr: 'Fair',
    irr: 'Poor',
  },
  activeMetrics: 4
};
*/

/**
 * Comprehensive integration test function
 */
export function runIntegrationTests(): {
  passed: number;
  failed: number;
  results: Array<{ test: string; status: 'PASS' | 'FAIL'; message: string }>;
} {
  const results: Array<{ test: string; status: 'PASS' | 'FAIL'; message: string }> = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Basic metric calculations
  try {
    const officeMetrics = calculateMetrics(testOfficeData, testMetricFlags);
    if (officeMetrics.capRate && officeMetrics.capRate > 0) {
      results.push({ test: 'Basic Office Metrics', status: 'PASS', message: 'Office metrics calculated successfully' });
      passed++;
    } else {
      results.push({ test: 'Basic Office Metrics', status: 'FAIL', message: 'Office metrics calculation failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Basic Office Metrics', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 2: Asset-specific function availability
  try {
    const officeFunctions = getAssetCalculationFunctions('office');
    if (Object.keys(officeFunctions).length > 0) {
      results.push({ test: 'Office Asset Functions', status: 'PASS', message: `Found ${Object.keys(officeFunctions).length} office functions` });
      passed++;
    } else {
      results.push({ test: 'Office Asset Functions', status: 'FAIL', message: 'No office functions found' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Office Asset Functions', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 3: Data validation
  try {
    const officeValidation = validateAssetDataRequirements(testOfficeData, 'office');
    if (officeValidation.isValid) {
      results.push({ test: 'Office Data Validation', status: 'PASS', message: 'Office data validation passed' });
      passed++;
    } else {
      results.push({ test: 'Office Data Validation', status: 'FAIL', message: `Missing fields: ${officeValidation.missingFields.join(', ')}` });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Office Data Validation', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 4: Package recommendations
  try {
    const officePackages = getAssetPackageRecommendations(testOfficeData);
    if (officePackages.length > 0) {
      results.push({ test: 'Office Package Recommendations', status: 'PASS', message: `Found ${officePackages.length} package recommendations` });
      passed++;
    } else {
      results.push({ test: 'Office Package Recommendations', status: 'FAIL', message: 'No package recommendations found' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Office Package Recommendations', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 5: Asset analysis availability
  try {
    const officeAnalysis = getAvailableAssetAnalysis(testOfficeData);
    if (officeAnalysis.length > 0) {
      results.push({ test: 'Office Asset Analysis', status: 'PASS', message: `Found ${officeAnalysis.length} analysis functions` });
      passed++;
    } else {
      results.push({ test: 'Office Asset Analysis', status: 'FAIL', message: 'No analysis functions found' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Office Asset Analysis', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 6: Retail property integration
  try {
    const retailMetrics = calculateMetrics(testRetailData, testMetricFlags);
    const retailValidation = validateAssetDataRequirements(testRetailData, 'retail');
    if (retailMetrics.capRate && retailValidation.isValid) {
      results.push({ test: 'Retail Integration', status: 'PASS', message: 'Retail integration working' });
      passed++;
    } else {
      results.push({ test: 'Retail Integration', status: 'FAIL', message: 'Retail integration failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Retail Integration', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 7: Industrial property integration
  try {
    const industrialMetrics = calculateMetrics(testIndustrialData, testMetricFlags);
    const industrialValidation = validateAssetDataRequirements(testIndustrialData, 'industrial');
    if (industrialMetrics.capRate && industrialValidation.isValid) {
      results.push({ test: 'Industrial Integration', status: 'PASS', message: 'Industrial integration working' });
      passed++;
    } else {
      results.push({ test: 'Industrial Integration', status: 'FAIL', message: 'Industrial integration failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Industrial Integration', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 8: Multifamily property integration
  try {
    const multifamilyMetrics = calculateMetrics(testMultifamilyData, testMetricFlags);
    const multifamilyValidation = validateAssetDataRequirements(testMultifamilyData, 'multifamily');
    if (multifamilyMetrics.capRate && multifamilyValidation.isValid) {
      results.push({ test: 'Multifamily Integration', status: 'PASS', message: 'Multifamily integration working' });
      passed++;
    } else {
      results.push({ test: 'Multifamily Integration', status: 'FAIL', message: 'Multifamily integration failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Multifamily Integration', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 9: Mixed-use property integration
  try {
    const mixedUseMetrics = calculateMetrics(testMixedUseData, testMetricFlags);
    const mixedUseValidation = validateAssetDataRequirements(testMixedUseData, 'mixed-use');
    if (mixedUseMetrics.capRate && mixedUseValidation.isValid) {
      results.push({ test: 'Mixed-Use Integration', status: 'PASS', message: 'Mixed-use integration working' });
      passed++;
    } else {
      results.push({ test: 'Mixed-Use Integration', status: 'FAIL', message: 'Mixed-use integration failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Mixed-Use Integration', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 10: Deal assessment
  try {
    const officeMetrics = calculateMetrics(testOfficeData, testMetricFlags);
    const assessment = calculateDealAssessment(officeMetrics, testMetricFlags);
    if (assessment.overall && assessment.recommendation) {
      results.push({ test: 'Deal Assessment', status: 'PASS', message: `Assessment: ${assessment.overall}` });
      passed++;
    } else {
      results.push({ test: 'Deal Assessment', status: 'FAIL', message: 'Deal assessment failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Deal Assessment', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 11: Required fields calculation
  try {
    const requiredFields = getRequiredFields(['capRate', 'cashOnCash', 'dscr'], testOfficeData);
    if (requiredFields.length > 0) {
      results.push({ test: 'Required Fields', status: 'PASS', message: `Calculated ${requiredFields.length} required fields` });
      passed++;
    } else {
      results.push({ test: 'Required Fields', status: 'FAIL', message: 'Required fields calculation failed' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Required Fields', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  // Test 12: Asset metric categories
  try {
    const categories = getAssetMetricCategories('office');
    if (categories.length > 0) {
      results.push({ test: 'Asset Categories', status: 'PASS', message: `Found ${categories.length} categories` });
      passed++;
    } else {
      results.push({ test: 'Asset Categories', status: 'FAIL', message: 'No categories found' });
      failed++;
    }
  } catch (error) {
    results.push({ test: 'Asset Categories', status: 'FAIL', message: `Error: ${error}` });
    failed++;
  }

  return { passed, failed, results };
}

/**
 * Quick validation function for development
 */
export function quickValidation(): boolean {
  try {
    // Test basic functionality
    const officeMetrics = calculateMetrics(testOfficeData, testMetricFlags);
    const officeFunctions = getAssetCalculationFunctions('office');
    const officeValidation = validateAssetDataRequirements(testOfficeData, 'office');
    
    return !!(officeMetrics.capRate && Object.keys(officeFunctions).length > 0 && officeValidation.isValid);
  } catch (error) {
    console.error('Quick validation failed:', error);
    return false;
  }
}

// Export test data for external use
export {
  testOfficeData,
  testRetailData,
  testIndustrialData,
  testMultifamilyData,
  testMixedUseData,
  testMetricFlags
}; 