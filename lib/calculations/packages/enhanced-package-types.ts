// lib/calculations/packages/enhanced-package-types.ts
// Enhanced package definition system with complex field support

export interface FieldDefinition {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'select' | 'date' | 'currency' | 'percentage';
  label?: string;
  description?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  options?: string[] | { value: string; label: string }[];
  subFields?: FieldDefinition[];
  defaultValue?: any;
  unit?: string;
  placeholder?: string;
  helperText?: string;
  dependsOn?: string; // Field depends on another field
  showWhen?: (data: any) => boolean;
}

export interface EnhancedCalculationPackage {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Core-Plus' | 'Value-Add' | 'Development' | 'Opportunistic' | 'Specialized' | 'Risk' | 'Financial' | 'Operational' | 'Market' | 'Portfolio' | 'Screening';
  
  // Metrics and calculations
  includedMetrics: string[];
  customMetrics?: string[];
  
  // Field definitions with complex validation
  requiredFields: FieldDefinition[];
  optionalFields?: FieldDefinition[];
  
  // Package metadata
  propertyTypes: ('office' | 'retail' | 'industrial' | 'multifamily' | 'mixed-use')[];
  investmentStrategies: string[];
  minimumDataThreshold: number; // 0-1, percentage of fields required
  analysisDepth: 'basic' | 'detailed' | 'comprehensive' | 'specialized' | 'forensic' | 'technical' | 'strategic';
  
  // Output configuration
  templates: string[];
  reportSections: string[];
  exportFormats: ('pdf' | 'excel' | 'json' | 'csv')[];
  
  // Calculation configuration
  calculationPriority: 'high' | 'medium' | 'low';
  dependencies?: string[]; // Other packages this depends on
  conflictsWith?: string[]; // Packages that conflict with this one
  
  // Validation and constraints
  dataValidation?: {
    crossFieldValidation?: (data: any) => boolean | string;
    businessRules?: (data: any) => string[];
  };
  
  // UI configuration
  formLayout?: 'tabs' | 'sections' | 'wizard' | 'single';
  grouping?: {
    [groupName: string]: string[]; // group name -> field names
  };
  
  // Performance and caching
  cacheable?: boolean;
  estimatedProcessingTime?: number; // milliseconds
  
  // Access control
  accessLevel?: 'public' | 'premium' | 'enterprise';
  userRoles?: string[];
  
  // Versioning and updates
  version?: string;
  lastUpdated?: Date;
  changelog?: string[];
  
  // Help and documentation
  documentation?: {
    overview?: string;
    methodology?: string;
    interpretation?: string;
    examples?: any[];
    references?: string[];
  };
  
  // Benchmarking
  benchmarkData?: {
    source: string;
    metrics: {
      [metricName: string]: {
        min: number;
        median: number;
        max: number;
        percentile25: number;
        percentile75: number;
      };
    };
  };
}

// Factory function to create field definitions with common patterns
export class FieldDefinitionFactory {
  static currency(field: string, label?: string, options?: Partial<FieldDefinition>): FieldDefinition {
    return {
      field,
      type: 'currency',
      label: label || field,
      validation: { min: 0 },
      unit: '$',
      ...options
    };
  }
  
  static percentage(field: string, label?: string, options?: Partial<FieldDefinition>): FieldDefinition {
    return {
      field,
      type: 'percentage',
      label: label || field,
      validation: { min: 0, max: 100 },
      unit: '%',
      ...options
    };
  }
  
  static tenantArray(subFields: string[]): FieldDefinition {
    return {
      field: 'tenants',
      type: 'array',
      label: 'Tenant Information',
      description: 'Detailed information about each tenant',
      subFields: subFields.map(field => ({
        field,
        type: this.inferFieldType(field),
        label: this.fieldToLabel(field),
        required: this.isRequiredField(field)
      })),
      validation: {
        min: 1,
        custom: (tenants: any[]) => {
          if (!Array.isArray(tenants)) return 'Tenants must be an array';
          if (tenants.length === 0) return 'At least one tenant is required';
          return true;
        }
      }
    };
  }
  
  static select(field: string, options: string[] | { value: string; label: string }[], label?: string): FieldDefinition {
    return {
      field,
      type: 'select',
      label: label || this.fieldToLabel(field),
      options,
      required: true
    };
  }
  
  static objectWithFields(field: string, subFields: string[], label?: string): FieldDefinition {
    return {
      field,
      type: 'object',
      label: label || this.fieldToLabel(field),
      subFields: subFields.map(sf => ({
        field: sf,
        type: this.inferFieldType(sf),
        label: this.fieldToLabel(sf),
        required: this.isRequiredField(sf)
      }))
    };
  }
  
  private static inferFieldType(field: string): FieldDefinition['type'] {
    const lowerField = field.toLowerCase();
    
    if (lowerField.includes('date')) return 'date';
    if (lowerField.includes('rate') || lowerField.includes('percent') || lowerField.includes('growth')) return 'percentage';
    if (lowerField.includes('rent') || lowerField.includes('price') || lowerField.includes('cost') || lowerField.includes('income')) return 'currency';
    if (lowerField.includes('count') || lowerField.includes('number') || lowerField.includes('sf') || lowerField.includes('feet')) return 'number';
    if (lowerField.includes('public') || lowerField.includes('has') || lowerField.includes('is')) return 'boolean';
    
    return 'string';
  }
  
  private static fieldToLabel(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  private static isRequiredField(field: string): boolean {
    const alwaysRequired = ['tenantName', 'squareFootage', 'rentableSF', 'baseRent', 'leaseExpiration'];
    return alwaysRequired.includes(field);
  }
}

// Validation utilities
export class PackageValidator {
  static validatePackage(pkg: EnhancedCalculationPackage): string[] {
    const errors: string[] = [];
    
    if (!pkg.id) errors.push('Package ID is required');
    if (!pkg.name) errors.push('Package name is required');
    if (!pkg.description) errors.push('Package description is required');
    if (!pkg.propertyTypes.length) errors.push('At least one property type is required');
    if (!pkg.requiredFields.length) errors.push('At least one required field is needed');
    if (pkg.minimumDataThreshold < 0 || pkg.minimumDataThreshold > 1) {
      errors.push('Minimum data threshold must be between 0 and 1');
    }
    
    // Validate field definitions
    pkg.requiredFields.forEach((field, index) => {
      const fieldErrors = this.validateField(field, `requiredFields[${index}]`);
      errors.push(...fieldErrors);
    });
    
    if (pkg.optionalFields) {
      pkg.optionalFields.forEach((field, index) => {
        const fieldErrors = this.validateField(field, `optionalFields[${index}]`);
        errors.push(...fieldErrors);
      });
    }
    
    return errors;
  }
  
  static validateField(field: FieldDefinition, path: string): string[] {
    const errors: string[] = [];
    
    if (!field.field) errors.push(`${path}: Field name is required`);
    if (!field.type) errors.push(`${path}: Field type is required`);
    
    // Type-specific validation
    switch (field.type) {
      case 'select':
        if (!field.options || field.options.length === 0) {
          errors.push(`${path}: Select fields must have options`);
        }
        break;
      case 'array':
        if (!field.subFields || field.subFields.length === 0) {
          errors.push(`${path}: Array fields must have subFields`);
        }
        break;
      case 'object':
        if (!field.subFields || field.subFields.length === 0) {
          errors.push(`${path}: Object fields must have subFields`);
        }
        break;
    }
    
    // Validate subFields recursively
    if (field.subFields) {
      field.subFields.forEach((subField, index) => {
        const subErrors = this.validateField(subField, `${path}.subFields[${index}]`);
        errors.push(...subErrors);
      });
    }
    
    return errors;
  }
  
  static validateFieldData(field: FieldDefinition, value: any): string[] {
    const errors: string[] = [];
    
    if (field.required && (value === null || value === undefined || value === '')) {
      errors.push(`${field.label || field.field} is required`);
      return errors;
    }
    
    if (value === null || value === undefined) return errors;
    
    // Type validation
    switch (field.type) {
      case 'number':
      case 'currency':
      case 'percentage':
        if (typeof value !== 'number') {
          errors.push(`${field.label || field.field} must be a number`);
        } else if (field.validation) {
          if (field.validation.min !== undefined && value < field.validation.min) {
            errors.push(`${field.label || field.field} must be at least ${field.validation.min}`);
          }
          if (field.validation.max !== undefined && value > field.validation.max) {
            errors.push(`${field.label || field.field} must be at most ${field.validation.max}`);
          }
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${field.label || field.field} must be a string`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${field.label || field.field} must be a boolean`);
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${field.label || field.field} must be an array`);
        } else if (field.validation?.min && value.length < field.validation.min) {
          errors.push(`${field.label || field.field} must have at least ${field.validation.min} items`);
        }
        break;
      case 'select':
        if (field.options) {
          const validOptions = Array.isArray(field.options) && typeof field.options[0] === 'string' 
            ? field.options as string[]
            : (field.options as { value: string; label: string }[]).map(o => o.value);
          
          if (!validOptions.includes(value)) {
            errors.push(`${field.label || field.field} must be one of: ${validOptions.join(', ')}`);
          }
        }
        break;
    }
    
    // Custom validation
    if (field.validation?.custom) {
      const result = field.validation.custom(value);
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : `${field.label || field.field} is invalid`);
      }
    }
    
    return errors;
  }
}

// Export utilities for backward compatibility
export function convertToLegacyPackage(enhanced: EnhancedCalculationPackage): any {
  return {
    id: enhanced.id,
    name: enhanced.name,
    description: enhanced.description,
    category: enhanced.category,
    includedMetrics: enhanced.includedMetrics,
    requiredFields: enhanced.requiredFields.map(f => f.field),
    optionalFields: enhanced.optionalFields?.map(f => f.field),
    templates: enhanced.templates,
    minimumDataThreshold: enhanced.minimumDataThreshold,
    analysisDepth: enhanced.analysisDepth
  };
}