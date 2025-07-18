import { PropertyData, MetricFlags, CalculatedMetrics } from './types';
import { validatePropertyData, validateMetricCalculation, isValidNumber } from './validation';
import { calculateMetrics } from './metrics';
import { quickPackages, advancedPackages } from './packages';
import { FieldDefinition } from './packages/enhanced-package-types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CalculationResult {
  success: boolean;
  metrics: CalculatedMetrics;
  validationErrors: Record<string, string>;
  warnings: string[];
  error: string;
}

// Type definitions for field handling
type FieldType = string | FieldDefinition;

// Type guards for field validation
function isFieldDefinition(field: FieldType): field is FieldDefinition {
  return typeof field === 'object' && field !== null && 'field' in field && 'type' in field;
}

function getFieldName(field: FieldType): string {
  return isFieldDefinition(field) ? field.field : field;
}

function getFieldType(field: FieldType): string {
  return isFieldDefinition(field) ? field.type : 'number';
}

// Enhanced package type that can handle both old and new field formats
interface EnhancedPackage {
  id: string;
  name: string;
  description: string;
  requiredFields: FieldType[];
  optionalFields?: FieldType[];
  includedMetrics: string[];
}

/**
 * Validates data completeness for a specific package
 * @param packageId - The package ID to validate for
 * @param data - Property data object
 * @returns Validation result with errors and warnings
 */
export function validateDataForPackage(packageId: string, data: PropertyData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find the package in quick or advanced packages
  const propertyType = data.propertyType;
  const allPackages = { ...quickPackages, ...advancedPackages };
  const packages = allPackages[propertyType] || [];
  const selectedPackage = packages.find(pkg => pkg.id === packageId);

  if (!selectedPackage) {
    errors.push(`Package ${packageId} not found for property type ${propertyType}`);
    return { isValid: false, errors, warnings };
  }

  // Validate basic property data
  const basicValidation = validatePropertyData(data);
  errors.push(...basicValidation);

  // Validate required fields for package
  if (selectedPackage.requiredFields) {
    (selectedPackage as EnhancedPackage).requiredFields.forEach(field => {
      const fieldName = getFieldName(field);
      const fieldType = getFieldType(field);
      
      const fieldValue = data[fieldName as keyof PropertyData];
      
      if (!fieldValue) {
        errors.push(`${fieldName} is required for ${selectedPackage.name}`);
      } else if (fieldType === 'number' && !isValidNumber(fieldValue)) {
        errors.push(`${fieldName} must be a valid number`);
      } else if (fieldType === 'currency' && typeof fieldValue === 'number' && fieldValue <= 0) {
        errors.push(`${fieldName} must be greater than 0`);
      }
    });
  }

  // Validate specific metrics for this package
  if (selectedPackage.includedMetrics) {
    selectedPackage.includedMetrics.forEach(metric => {
      const metricValidation = validateMetricCalculation(metric, data);
      errors.push(...metricValidation.errors);
      warnings.push(...metricValidation.warnings);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates and calculates metrics for a package with comprehensive error handling
 * @param packageId - The package ID to calculate
 * @param data - Property data object
 * @returns Calculation result with metrics, errors, and warnings
 */
export function validateAndCalculate(packageId: string, data: PropertyData): CalculationResult {
  try {
    // Step 1: Validate data completeness for the package
    const packageValidation = validateDataForPackage(packageId, data);
    
    if (!packageValidation.isValid) {
      return {
        success: false,
        metrics: {} as CalculatedMetrics,
        validationErrors: packageValidation.errors.reduce((acc, error, index) => {
          acc[`validation_${index}`] = error;
          return acc;
        }, {} as Record<string, string>),
        warnings: packageValidation.warnings,
        error: `Data validation failed: ${packageValidation.errors.join(', ')}`
      };
    }

    // Step 2: Build metric flags for the package
    const propertyType = data.propertyType;
    const allPackages = { ...quickPackages, ...advancedPackages };
    const packages = allPackages[propertyType] || [];
    const selectedPackage = packages.find(pkg => pkg.id === packageId);

    if (!selectedPackage) {
      return {
        success: false,
        metrics: {} as CalculatedMetrics,
        validationErrors: { package: `Package ${packageId} not found` },
        warnings: [],
        error: `Package ${packageId} not found for property type ${propertyType}`
      };
    }

    // Create metric flags based on package
    const metricFlags: MetricFlags = {} as MetricFlags;
    selectedPackage.includedMetrics.forEach(metric => {
      metricFlags[metric] = true;
    });

    // Step 3: Calculate metrics with validation
    const calculationResult = calculateMetrics(data, metricFlags);

    // Step 4: Validate calculation results
    const resultValidation = validateCalculationResults(calculationResult);

    return {
      success: true,
      metrics: calculationResult,
      validationErrors: calculationResult.validationErrors || {},
      warnings: [...packageValidation.warnings, ...resultValidation.warnings],
      error: resultValidation.errors.length > 0 ? resultValidation.errors.join(', ') : ''
    };

  } catch (error) {
    console.error('Error in validateAndCalculate:', error);
    return {
      success: false,
      metrics: {} as CalculatedMetrics,
      validationErrors: { 
        calculation: error instanceof Error ? error.message : 'Unknown calculation error' 
      },
      warnings: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred during calculation'
    };
  }
}

/**
 * Validates calculation results for reasonableness
 * @param results - Calculated metrics
 * @returns Validation result with warnings for unusual values
 */
export function validateCalculationResults(results: CalculatedMetrics): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate Cap Rate
  if (results.capRate !== undefined && results.capRate !== null) {
    if (results.capRate < 0) {
      errors.push('Cap Rate cannot be negative');
    } else if (results.capRate > 50) {
      errors.push('Cap Rate is unrealistically high (>50%)');
    } else if (results.capRate < 1) {
      warnings.push('Cap Rate is unusually low (<1%)');
    } else if (results.capRate > 20) {
      warnings.push('Cap Rate is unusually high (>20%)');
    }
  }

  // Validate Cash-on-Cash Return
  if (results.cashOnCash !== undefined && results.cashOnCash !== null) {
    if (results.cashOnCash < -50) {
      errors.push('Cash-on-Cash Return is unrealistically negative');
    } else if (results.cashOnCash > 100) {
      warnings.push('Cash-on-Cash Return is unusually high (>100%)');
    } else if (results.cashOnCash < 0) {
      warnings.push('Cash-on-Cash Return is negative');
    }
  }

  // Validate DSCR
  if (results.dscr !== undefined && results.dscr !== null) {
    if (results.dscr < 0) {
      errors.push('DSCR cannot be negative');
    } else if (results.dscr < 1) {
      warnings.push('DSCR is below 1.0, indicating potential cash flow issues');
    } else if (results.dscr > 10) {
      warnings.push('DSCR is unusually high (>10)');
    }
  }

  // Validate LTV
  if (results.ltv !== undefined && results.ltv !== null) {
    if (results.ltv < 0) {
      errors.push('LTV cannot be negative');
    } else if (results.ltv > 100) {
      errors.push('LTV cannot exceed 100%');
    } else if (results.ltv > 90) {
      warnings.push('LTV is very high (>90%)');
    }
  }

  // Validate Price per SF
  if (results.pricePerSF !== undefined && results.pricePerSF !== null) {
    if (results.pricePerSF <= 0) {
      errors.push('Price per SF must be positive');
    } else if (results.pricePerSF > 1000) {
      warnings.push('Price per SF is unusually high (>$1,000/SF)');
    }
  }

  // Validate GRM
  if (results.grm !== undefined && results.grm !== null) {
    if (results.grm <= 0) {
      errors.push('GRM must be positive');
    } else if (results.grm > 30) {
      warnings.push('GRM is unusually high (>30)');
    } else if (results.grm < 5) {
      warnings.push('GRM is unusually low (<5)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Safe wrapper for individual metric calculations
 * @param metricName - Name of the metric
 * @param calculationFn - Function to calculate the metric
 * @param data - Property data
 * @returns Safe calculation result
 */
export function safeCalculateMetric<T>(
  metricName: string,
  calculationFn: (data: PropertyData) => T,
  data: PropertyData
): { success: boolean; result?: T; error?: string } {
  try {
    const result = calculationFn(data);
    
    // Validate result
    if (typeof result === 'number' && (!isValidNumber(result) || !isFinite(result))) {
      return {
        success: false,
        error: `${metricName} calculation resulted in invalid number: ${result}`
      };
    }

    return {
      success: true,
      result
    };
  } catch (error) {
    console.error(`Error calculating ${metricName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error calculating ${metricName}`
    };
  }
}

/**
 * Batch validation for multiple metrics
 * @param metrics - Array of metric names to validate
 * @param data - Property data
 * @returns Map of metric validations
 */
export function batchValidateMetrics(
  metrics: (keyof MetricFlags)[],
  data: PropertyData
): Map<keyof MetricFlags, ValidationResult> {
  const validationMap = new Map<keyof MetricFlags, ValidationResult>();

  metrics.forEach(metric => {
    const validation = validateMetricCalculation(metric, data);
    validationMap.set(metric, validation);
  });

  return validationMap;
}