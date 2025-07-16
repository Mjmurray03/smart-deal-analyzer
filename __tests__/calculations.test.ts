import { PropertyData, MetricFlags } from '../lib/calculations/types';
import { 
  hasRequiredData, 
  hasRequiredDataForMetric, 
  calculateMetrics,
  calculateAnnualDebtService,
  formatMetricValue
} from '../lib/calculations/metrics';
import { 
  validatePropertyData, 
  validateMetricRequirements, 
  isValidNumber, 
  safeToNumber,
  isValidPercentage 
} from '../lib/calculations/validation';
import { 
  validateDataForPackage, 
  validateAndCalculate,
  validateCalculationResults 
} from '../lib/calculations/validation-wrapper';

describe('Metric Calculations', () => {
  const validPropertyData: PropertyData = {
    propertyType: 'office',
    purchasePrice: 1000000,
    currentNOI: 80000,
    totalInvestment: 250000,
    annualCashFlow: 50000,
    loanAmount: 750000,
    interestRate: 5.5,
    loanTerm: 30,
    grossIncome: 120000,
    operatingExpenses: 40000,
    squareFootage: 10000,
    numberOfUnits: 1
  };

  describe('hasRequiredData', () => {
    test('should return true when all required data is present for Cap Rate', () => {
      const result = hasRequiredData('capRate', validPropertyData);
      expect(result).toBe(true);
    });

    test('should return false when required data is missing for Cap Rate', () => {
      const incompleteData = { ...validPropertyData, currentNOI: undefined };
      const result = hasRequiredData('capRate', incompleteData);
      expect(result).toBe(false);
    });

    test('should return true for Cash-on-Cash when data is complete', () => {
      const result = hasRequiredData('cashOnCash', validPropertyData);
      expect(result).toBe(true);
    });

    test('should return false for Cash-on-Cash when data is incomplete', () => {
      const incompleteData = { ...validPropertyData, totalInvestment: undefined };
      const result = hasRequiredData('cashOnCash', incompleteData);
      expect(result).toBe(false);
    });
  });

  describe('hasRequiredDataForMetric', () => {
    test('should be an alias for hasRequiredData', () => {
      const result1 = hasRequiredData('capRate', validPropertyData);
      const result2 = hasRequiredDataForMetric('capRate', validPropertyData);
      expect(result1).toBe(result2);
    });
  });

  describe('calculateMetrics', () => {
    const metricFlags: MetricFlags = {
      capRate: true,
      cashOnCash: true,
      dscr: true,
      ltv: true,
      pricePerSF: true,
      grm: true,
      roi: false,
      breakeven: false,
      irr: false,
      pricePerUnit: false,
      egi: false,
      walt: false,
      simpleWalt: false,
      salesPerSF: false,
      clearHeightAnalysis: false,
      revenuePerUnit: false,
      industrialMetrics: false,
      multifamilyMetrics: false,
      occupancyCostRatio: false,
      effectiveRentPSF: false
    };

    test('should calculate Cap Rate correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.capRate).toBe(8.0); // (80000 / 1000000) * 100
    });

    test('should calculate Cash-on-Cash Return correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.cashOnCash).toBe(20.0); // (50000 / 250000) * 100
    });

    test('should calculate LTV correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.ltv).toBe(75.0); // (750000 / 1000000) * 100
    });

    test('should calculate Price per SF correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.pricePerSF).toBe(100.0); // 1000000 / 10000
    });

    test('should calculate GRM correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.grm).toBe(8.33); // 1000000 / 120000 rounded
    });

    test('should handle missing data gracefully', () => {
      const incompleteData = { ...validPropertyData, currentNOI: undefined };
      const result = calculateMetrics(incompleteData, metricFlags);
      expect(result.capRate).toBeUndefined();
      expect(result.validationErrors?.capRate).toBeDefined();
    });

    test('should calculate DSCR correctly', () => {
      const result = calculateMetrics(validPropertyData, metricFlags);
      expect(result.dscr).toBeDefined();
      expect(result.dscr).toBeGreaterThan(0);
    });
  });

  describe('calculateAnnualDebtService', () => {
    test('should calculate debt service correctly', () => {
      const result = calculateAnnualDebtService(750000, 5.5, 30);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100000); // Reasonable range
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateAnnualDebtService(0, 5.5, 30)).toBe(0);
      expect(calculateAnnualDebtService(750000, 0, 30)).toBe(0);
      expect(calculateAnnualDebtService(750000, 5.5, 0)).toBe(0);
    });
  });

  describe('formatMetricValue', () => {
    test('should format percentage values correctly', () => {
      expect(formatMetricValue(8.5, 'percentage')).toBe('8.50%');
      expect(formatMetricValue(0, 'percentage')).toBe('0.00%');
    });

    test('should format currency values correctly', () => {
      expect(formatMetricValue(1000000, 'currency')).toBe('$1,000,000');
      expect(formatMetricValue(1500.50, 'currency')).toBe('$1,501');
    });

    test('should format ratio values correctly', () => {
      expect(formatMetricValue(1.25, 'ratio')).toBe('1.25');
      expect(formatMetricValue(0.75, 'ratio')).toBe('0.75');
    });

    test('should handle null/undefined values', () => {
      expect(formatMetricValue(null, 'percentage')).toBe('N/A');
      expect(formatMetricValue(undefined, 'currency')).toBe('N/A');
    });
  });
});

describe('Validation Functions', () => {
  describe('validatePropertyData', () => {
    test('should pass validation for valid data', () => {
      const validData: PropertyData = {
        propertyType: 'office',
        purchasePrice: 1000000,
        currentNOI: 80000,
        totalInvestment: 250000,
        loanAmount: 750000,
        interestRate: 5.5,
        loanTerm: 30,
        squareFootage: 10000,
        numberOfUnits: 1,
        occupancyRate: 95
      };

      const errors = validatePropertyData(validData);
      expect(errors).toHaveLength(0);
    });

    test('should fail validation for invalid data', () => {
      const invalidData: PropertyData = {
        propertyType: 'office',
        purchasePrice: -1000000, // Invalid: negative
        currentNOI: 80000,
        totalInvestment: 0, // Invalid: zero
        loanAmount: 1500000, // Invalid: exceeds purchase price
        interestRate: 150, // Invalid: > 100%
        loanTerm: -5, // Invalid: negative
        squareFootage: 0, // Invalid: zero
        numberOfUnits: 0, // Invalid: zero
        occupancyRate: 120 // Invalid: > 100%
      };

      const errors = validatePropertyData(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Purchase price must be greater than 0');
      expect(errors).toContain('Total investment must be greater than 0');
      expect(errors).toContain('Interest rate must be between 0 and 100');
      expect(errors).toContain('Loan term must be greater than 0');
      expect(errors).toContain('Square footage must be greater than 0');
      expect(errors).toContain('Number of units must be greater than 0');
      expect(errors).toContain('Occupancy rate must be between 0 and 100');
    });
  });

  describe('validateMetricRequirements', () => {
    test('should validate Cap Rate requirements', () => {
      const validData = { currentNOI: 80000, purchasePrice: 1000000 };
      const errors = validateMetricRequirements('capRate', validData);
      expect(errors).toHaveLength(0);
    });

    test('should catch missing Cap Rate requirements', () => {
      const invalidData = { currentNOI: 80000 }; // Missing purchasePrice
      const errors = validateMetricRequirements('capRate', invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Purchase Price is required for Cap Rate calculation');
    });

    test('should validate DSCR requirements', () => {
      const validData = { 
        currentNOI: 80000, 
        loanAmount: 750000, 
        interestRate: 5.5, 
        loanTerm: 30 
      };
      const errors = validateMetricRequirements('dscr', validData);
      expect(errors).toHaveLength(0);
    });
  });

  describe('isValidNumber', () => {
    test('should return true for valid numbers', () => {
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-5.5)).toBe(true);
    });

    test('should return false for invalid numbers', () => {
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber('42')).toBe(false);
    });
  });

  describe('safeToNumber', () => {
    test('should convert valid numbers', () => {
      expect(safeToNumber(42)).toBe(42);
      expect(safeToNumber('42')).toBe(42);
      expect(safeToNumber('3.14')).toBe(3.14);
    });

    test('should return 0 for invalid inputs', () => {
      expect(safeToNumber(null)).toBe(0);
      expect(safeToNumber(undefined)).toBe(0);
      expect(safeToNumber('not a number')).toBe(0);
      expect(safeToNumber(NaN)).toBe(0);
    });
  });

  describe('isValidPercentage', () => {
    test('should validate percentage ranges', () => {
      expect(isValidPercentage(0)).toBe(true);
      expect(isValidPercentage(50)).toBe(true);
      expect(isValidPercentage(100)).toBe(true);
    });

    test('should reject invalid percentages', () => {
      expect(isValidPercentage(-1)).toBe(false);
      expect(isValidPercentage(101)).toBe(false);
      expect(isValidPercentage(NaN)).toBe(false);
    });
  });
});

describe('Validation Wrapper', () => {
  const mockPropertyData: PropertyData = {
    propertyType: 'office',
    purchasePrice: 1000000,
    currentNOI: 80000,
    totalInvestment: 250000,
    annualCashFlow: 50000,
    loanAmount: 750000,
    interestRate: 5.5,
    loanTerm: 30,
    grossIncome: 120000,
    operatingExpenses: 40000,
    squareFootage: 10000
  };

  describe('validateCalculationResults', () => {
    test('should validate normal calculation results', () => {
      const results = {
        capRate: 8.0,
        cashOnCash: 20.0,
        dscr: 1.5,
        ltv: 75.0,
        pricePerSF: 100.0,
        grm: 8.33
      };

      const validation = validateCalculationResults(results);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should catch invalid calculation results', () => {
      const results = {
        capRate: -5.0, // Invalid: negative
        cashOnCash: 150.0, // Warning: very high
        dscr: -1.0, // Invalid: negative
        ltv: 110.0, // Invalid: > 100%
        pricePerSF: 0, // Invalid: zero
        grm: -2.0 // Invalid: negative
      };

      const validation = validateCalculationResults(results);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('Cap Rate cannot be negative');
      expect(validation.errors).toContain('DSCR cannot be negative');
      expect(validation.errors).toContain('LTV cannot exceed 100%');
      expect(validation.errors).toContain('Price per SF must be positive');
    });

    test('should generate warnings for unusual values', () => {
      const results = {
        capRate: 0.5, // Low cap rate warning
        cashOnCash: 150.0, // High cash-on-cash warning
        dscr: 0.8, // Low DSCR warning
        ltv: 95.0, // High LTV warning
        pricePerSF: 1200.0, // High price per SF warning
        grm: 35.0 // High GRM warning
      };

      const validation = validateCalculationResults(results);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings).toContain('Cap Rate is unusually low (<1%)');
      expect(validation.warnings).toContain('Cash-on-Cash Return is unusually high (>100%)');
      expect(validation.warnings).toContain('DSCR is below 1.0, indicating potential cash flow issues');
      expect(validation.warnings).toContain('LTV is very high (>90%)');
    });
  });
});

describe('Error Handling', () => {
  test('should handle division by zero gracefully', () => {
    const dataWithZero: PropertyData = {
      propertyType: 'office',
      purchasePrice: 0, // This will cause division by zero
      currentNOI: 80000,
      totalInvestment: 250000
    };

    const metricFlags: MetricFlags = {
      capRate: true,
      cashOnCash: false,
      dscr: false,
      ltv: false,
      pricePerSF: false,
      grm: false,
      roi: false,
      breakeven: false,
      irr: false,
      pricePerUnit: false,
      egi: false,
      walt: false,
      simpleWalt: false,
      salesPerSF: false,
      clearHeightAnalysis: false,
      revenuePerUnit: false,
      industrialMetrics: false,
      multifamilyMetrics: false,
      occupancyCostRatio: false,
      effectiveRentPSF: false
    };

    const result = calculateMetrics(dataWithZero, metricFlags);
    expect(result.capRate).toBeUndefined();
    expect(result.validationErrors?.capRate).toBeDefined();
  });

  test('should handle null/undefined inputs gracefully', () => {
    const nullData = null as any;
    const metricFlags: MetricFlags = {
      capRate: true,
      cashOnCash: false,
      dscr: false,
      ltv: false,
      pricePerSF: false,
      grm: false,
      roi: false,
      breakeven: false,
      irr: false,
      pricePerUnit: false,
      egi: false,
      walt: false,
      simpleWalt: false,
      salesPerSF: false,
      clearHeightAnalysis: false,
      revenuePerUnit: false,
      industrialMetrics: false,
      multifamilyMetrics: false,
      occupancyCostRatio: false,
      effectiveRentPSF: false
    };

    expect(() => calculateMetrics(nullData, metricFlags)).not.toThrow();
  });
});