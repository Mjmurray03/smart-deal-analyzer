import { PropertyData, MetricFlags } from './types';

/**
 * Validates property data for completeness and correctness
 * @param data - Property data object
 * @returns Array of validation error messages
 */
export function validatePropertyData(data: PropertyData): string[] {
  const errors: string[] = [];

  // Basic required fields validation
  if (!data.propertyType) {
    errors.push('Property type is required');
  }

  // Financial validation
  if (data.purchasePrice !== undefined && data.purchasePrice <= 0) {
    errors.push('Purchase price must be greater than 0');
  }

  if (data.currentNOI !== undefined && data.currentNOI < 0) {
    errors.push('Current NOI cannot be negative');
  }

  if (data.totalInvestment !== undefined && data.totalInvestment <= 0) {
    errors.push('Total investment must be greater than 0');
  }

  if (data.loanAmount !== undefined && data.loanAmount < 0) {
    errors.push('Loan amount cannot be negative');
  }

  if (data.interestRate !== undefined && (data.interestRate < 0 || data.interestRate > 100)) {
    errors.push('Interest rate must be between 0 and 100');
  }

  if (data.loanTerm !== undefined && data.loanTerm <= 0) {
    errors.push('Loan term must be greater than 0');
  }

  // Property-specific validation
  if (data.squareFootage !== undefined && data.squareFootage <= 0) {
    errors.push('Square footage must be greater than 0');
  }

  if (data.numberOfUnits !== undefined && data.numberOfUnits <= 0) {
    errors.push('Number of units must be greater than 0');
  }

  if (data.occupancyRate !== undefined && (data.occupancyRate < 0 || data.occupancyRate > 100)) {
    errors.push('Occupancy rate must be between 0 and 100');
  }

  // Cross-field validation
  if (data.loanAmount && data.purchasePrice && data.loanAmount > data.purchasePrice) {
    errors.push('Loan amount cannot exceed purchase price');
  }

  if (data.totalInvestment && data.purchasePrice && data.totalInvestment < (data.purchasePrice * 0.1)) {
    errors.push('Total investment seems too low (less than 10% of purchase price)');
  }

  return errors;
}

/**
 * Validates specific metric calculation requirements
 * @param metric - The metric to validate
 * @param data - Property data object
 * @returns Array of specific validation errors for the metric
 */
export function validateMetricRequirements(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): string[] {
  const errors: string[] = [];

  switch (metric) {
    case 'capRate':
      if (!data.currentNOI) errors.push('Current NOI is required for Cap Rate calculation');
      if (!data.purchasePrice) errors.push('Purchase Price is required for Cap Rate calculation');
      if (data.currentNOI && data.currentNOI <= 0) errors.push('Current NOI must be positive');
      if (data.purchasePrice && data.purchasePrice <= 0) errors.push('Purchase Price must be positive');
      break;

    case 'cashOnCash':
      if (!data.annualCashFlow) errors.push('Annual Cash Flow is required for Cash-on-Cash calculation');
      if (!data.totalInvestment) errors.push('Total Investment is required for Cash-on-Cash calculation');
      if (data.totalInvestment && data.totalInvestment <= 0) errors.push('Total Investment must be positive');
      break;

    case 'dscr':
      if (!data.currentNOI) errors.push('Current NOI is required for DSCR calculation');
      if (!data.loanAmount) errors.push('Loan Amount is required for DSCR calculation');
      if (!data.interestRate) errors.push('Interest Rate is required for DSCR calculation');
      if (!data.loanTerm) errors.push('Loan Term is required for DSCR calculation');
      if (data.currentNOI && data.currentNOI <= 0) errors.push('Current NOI must be positive');
      if (data.loanAmount && data.loanAmount <= 0) errors.push('Loan Amount must be positive');
      if (data.interestRate && (data.interestRate <= 0 || data.interestRate > 100)) {
        errors.push('Interest Rate must be between 0 and 100');
      }
      if (data.loanTerm && data.loanTerm <= 0) errors.push('Loan Term must be positive');
      break;

    case 'ltv':
      if (!data.loanAmount) errors.push('Loan Amount is required for LTV calculation');
      if (!data.purchasePrice) errors.push('Purchase Price is required for LTV calculation');
      if (data.loanAmount && data.loanAmount <= 0) errors.push('Loan Amount must be positive');
      if (data.purchasePrice && data.purchasePrice <= 0) errors.push('Purchase Price must be positive');
      if (data.loanAmount && data.purchasePrice && data.loanAmount > data.purchasePrice) {
        errors.push('Loan Amount cannot exceed Purchase Price');
      }
      break;

    case 'pricePerSF':
      if (!data.purchasePrice) errors.push('Purchase Price is required for Price per SF calculation');
      if (!data.squareFootage) errors.push('Square Footage is required for Price per SF calculation');
      if (data.purchasePrice && data.purchasePrice <= 0) errors.push('Purchase Price must be positive');
      if (data.squareFootage && data.squareFootage <= 0) errors.push('Square Footage must be positive');
      break;

    case 'grm':
      if (!data.purchasePrice) errors.push('Purchase Price is required for GRM calculation');
      if (!data.grossIncome) errors.push('Gross Income is required for GRM calculation');
      if (data.purchasePrice && data.purchasePrice <= 0) errors.push('Purchase Price must be positive');
      if (data.grossIncome && data.grossIncome <= 0) errors.push('Gross Income must be positive');
      break;

    default:
      // For other metrics, perform basic validation
      break;
  }

  return errors;
}

/**
 * Checks if a number is valid (not null, undefined, NaN, or infinity)
 * @param value - The value to check
 * @returns boolean indicating if the value is valid
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safely converts a value to a number, returning 0 if invalid
 * @param value - The value to convert
 * @returns A valid number
 */
export function safeToNumber(value: unknown): number {
  if (isValidNumber(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isValidNumber(parsed)) {
      return parsed;
    }
  }
  
  return 0;
}

/**
 * Checks if a percentage value is valid (between 0 and 100)
 * @param value - The percentage value to check
 * @returns boolean indicating if the percentage is valid
 */
export function isValidPercentage(value: unknown): boolean {
  return isValidNumber(value) && value >= 0 && value <= 100;
}

/**
 * Comprehensive validation for metric calculations with detailed error reporting
 * @param metric - The metric to validate
 * @param data - Property data object
 * @returns Object with validation result and detailed errors
 */
export function validateMetricCalculation(
  metric: keyof MetricFlags,
  data: Partial<PropertyData>
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors = validateMetricRequirements(metric, data);
  const warnings: string[] = [];

  // Add warnings for potentially problematic values
  if (metric === 'capRate' && data.currentNOI && data.purchasePrice) {
    const capRate = (data.currentNOI / data.purchasePrice) * 100;
    if (capRate < 2) {
      warnings.push('Cap rate is unusually low (below 2%)');
    } else if (capRate > 15) {
      warnings.push('Cap rate is unusually high (above 15%)');
    }
  }

  if (metric === 'ltv' && data.loanAmount && data.purchasePrice) {
    const ltv = (data.loanAmount / data.purchasePrice) * 100;
    if (ltv > 90) {
      warnings.push('LTV is very high (above 90%)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}