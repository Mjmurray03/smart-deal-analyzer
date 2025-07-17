// lib/calculations/calculation-helpers.ts
// Shared type utilities and helper functions for calculations

import type { PropertyData, MetricFlags, CalculatedMetrics } from '../types';

// Common calculation types
export type NumericValue = number | null | undefined;

// Type guards
export function isValidNumber(value: NumericValue): value is number {
  return value !== null && value !== undefined && !isNaN(value);
}

export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}

// Safe math operations
export function safeDivide(numerator: NumericValue, denominator: NumericValue): number | null {
  if (!isValidNumber(numerator) || !isValidNumber(denominator) || denominator === 0) {
    return null;
  }
  return numerator / denominator;
}

export function safeMultiply(a: NumericValue, b: NumericValue): number | null {
  if (!isValidNumber(a) || !isValidNumber(b)) {
    return null;
  }
  return a * b;
}

export function safeAdd(a: NumericValue, b: NumericValue): number | null {
  if (!isValidNumber(a) || !isValidNumber(b)) {
    return null;
  }
  return a + b;
}

export function safeSubtract(a: NumericValue, b: NumericValue): number | null {
  if (!isValidNumber(a) || !isValidNumber(b)) {
    return null;
  }
  return a - b;
}

// Array helpers
export function sum(values: NumericValue[]): number | null {
  const validValues = values.filter(isValidNumber);
  if (validValues.length === 0) return null;
  return validValues.reduce((acc, val) => acc + val, 0);
}

export function average(values: NumericValue[]): number | null {
  const validValues = values.filter(isValidNumber);
  if (validValues.length === 0) return null;
  return validValues.reduce((acc, val) => acc + val, 0) / validValues.length;
}

export function min(values: NumericValue[]): number | null {
  const validValues = values.filter(isValidNumber);
  if (validValues.length === 0) return null;
  return Math.min(...validValues);
}

export function max(values: NumericValue[]): number | null {
  const validValues = values.filter(isValidNumber);
  if (validValues.length === 0) return null;
  return Math.max(...validValues);
}

// Percentage helpers
export function toPercentage(value: NumericValue): number | null {
  if (!isValidNumber(value)) return null;
  return value * 100;
}

export function fromPercentage(value: NumericValue): number | null {
  if (!isValidNumber(value)) return null;
  return value / 100;
}

// Date helpers
export function yearsBetween(startDate: Date | string, endDate: Date | string): number | null {
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (!isValidDate(start) || !isValidDate(end)) return null;
    
    const diffTime = end.getTime() - start.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, diffYears);
  } catch {
    return null;
  }
}

export function monthsBetween(startDate: Date | string, endDate: Date | string): number | null {
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (!isValidDate(start) || !isValidDate(end)) return null;
    
    const diffTime = end.getTime() - start.getTime();
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
    return Math.max(0, diffMonths);
  } catch {
    return null;
  }
}

// Formatting helpers
export function formatCurrency(value: NumericValue, decimals: number = 2): string {
  if (!isValidNumber(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatPercentage(value: NumericValue, decimals: number = 2): string {
  if (!isValidNumber(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

export function formatNumber(value: NumericValue, decimals: number = 2): string {
  if (!isValidNumber(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// Common calculation functions
export function calculateCapRate(noi: NumericValue, purchasePrice: NumericValue): number | null {
  return safeDivide(noi, purchasePrice);
}

export function calculateCashOnCash(
  annualCashFlow: NumericValue,
  cashInvested: NumericValue
): number | null {
  return safeDivide(annualCashFlow, cashInvested);
}

export function calculateDSCR(noi: NumericValue, debtService: NumericValue): number | null {
  return safeDivide(noi, debtService);
}

export function calculateLTV(loanAmount: NumericValue, propertyValue: NumericValue): number | null {
  return safeDivide(loanAmount, propertyValue);
}

export function calculateGRM(purchasePrice: NumericValue, grossIncome: NumericValue): number | null {
  return safeDivide(purchasePrice, grossIncome);
}

export function calculatePricePerSF(
  purchasePrice: NumericValue,
  squareFootage: NumericValue
): number | null {
  return safeDivide(purchasePrice, squareFootage);
}

export function calculatePricePerUnit(
  purchasePrice: NumericValue,
  numberOfUnits: NumericValue
): number | null {
  return safeDivide(purchasePrice, numberOfUnits);
}

// Validation helpers
export function validateRequiredFields(
  data: PropertyData,
  requiredFields: (keyof PropertyData)[]
): string[] {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
}

export function validateMetricFlags(flags: MetricFlags): string[] {
  const errors: string[] = [];
  
  // Check if at least one metric is enabled
  const enabledMetrics = Object.values(flags).filter(Boolean);
  if (enabledMetrics.length === 0) {
    errors.push('At least one metric must be enabled');
  }
  
  return errors;
}

// Metric calculation helpers
export function shouldCalculateMetric(flags: MetricFlags, metric: keyof MetricFlags): boolean {
  return flags[metric] === true;
}

export function setMetricValue(
  results: CalculatedMetrics,
  metric: keyof CalculatedMetrics,
  value: number | null | undefined
): void {
  // Use type assertion only when necessary for object property assignment
  (results as Record<keyof CalculatedMetrics, number | null | undefined>)[metric] = value;
}

export function getMetricValue(
  results: CalculatedMetrics,
  metric: keyof CalculatedMetrics
): number | null | undefined {
  return results[metric];
}

// Error handling helpers
export function handleCalculationError(
  error: Error,
  metricName: string,
  data: PropertyData
): string {
  console.error(`Error calculating ${metricName} for ${data.propertyType} property:`, error);
  return `Error calculating ${metricName} for ${data.propertyType || 'unknown'} property: ${error.message}`;
}

export function createValidationError(
  field: string,
  message: string
): Record<string, string> {
  return { [field]: message };
}

// Common industry calculations
export function calculateNOI(
  grossIncome: NumericValue,
  operatingExpenses: NumericValue
): number | null {
  return safeSubtract(grossIncome, operatingExpenses);
}

export function calculateROI(
  totalReturn: NumericValue,
  totalInvestment: NumericValue
): number | null {
  return safeDivide(totalReturn, totalInvestment);
}

export function calculateBreakEven(
  fixedCosts: NumericValue,
  variableCostRate: NumericValue,
  pricePerUnit: NumericValue
): number | null {
  const contribution = safeSubtract(pricePerUnit, variableCostRate);
  return safeDivide(fixedCosts, contribution);
}

// Array processing helpers
export function processArrayField<T>(
  array: T[] | undefined,
  processor: (item: T) => any
): any[] {
  if (!array || !Array.isArray(array)) return [];
  return array.map(processor).filter(item => item !== null && item !== undefined);
}

export function findInArray<T>(
  array: T[] | undefined,
  predicate: (item: T) => boolean
): T | undefined {
  if (!array || !Array.isArray(array)) return undefined;
  return array.find(predicate);
}

export function filterArray<T>(
  array: T[] | undefined,
  predicate: (item: T) => boolean
): T[] {
  if (!array || !Array.isArray(array)) return [];
  return array.filter(predicate);
}