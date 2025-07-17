export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationErrors {
  [field: string]: string;
}

export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value !== undefined && value !== null && value !== '',
    message
  }),

  number: (message = 'Must be a valid number'): ValidationRule => ({
    test: (value) => !isNaN(Number(value)),
    message
  }),

  positive: (message = 'Must be a positive number'): ValidationRule => ({
    test: (value) => Number(value) > 0,
    message
  }),

  min: (min: number, message?: string): ValidationRule => ({
    test: (value) => Number(value) >= min,
    message: message || `Must be at least ${min}`
  }),

  max: (max: number, message?: string): ValidationRule => ({
    test: (value) => Number(value) <= max,
    message: message || `Must be no more than ${max}`
  }),

  range: (min: number, max: number, message?: string): ValidationRule => ({
    test: (value) => Number(value) >= min && Number(value) <= max,
    message: message || `Must be between ${min} and ${max}`
  }),

  email: (message = 'Must be a valid email address'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),

  arrayMinLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => Array.isArray(value) && value.length >= min,
    message: message || `Must have at least ${min} items`
  }),

  propertyType: (message = 'Invalid property type'): ValidationRule => ({
    test: (value) => ['office', 'retail', 'industrial', 'multifamily', 'mixed-use'].includes(value),
    message
  })
};

export function validate(data: any, schema: ValidationSchema): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];
    
    for (const rule of rules) {
      if (!rule.test(value)) {
        errors[field] = rule.message;
        break; // Stop at first error for this field
      }
    }
  });

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Common validation schemas
export const calculatorSchemas = {
  capRate: {
    noi: [
      validators.required(),
      validators.number(),
      validators.positive()
    ],
    purchasePrice: [
      validators.required(),
      validators.number(),
      validators.positive()
    ]
  },
  
  cashOnCash: {
    annualCashFlow: [
      validators.required(),
      validators.number()
    ],
    cashInvested: [
      validators.required(),
      validators.number(),
      validators.positive()
    ]
  },
  
  pricePSF: {
    price: [
      validators.required(),
      validators.number(),
      validators.positive()
    ],
    squareFeet: [
      validators.required(),
      validators.number(),
      validators.positive()
    ]
  },
  
  grm: {
    purchasePrice: [
      validators.required(),
      validators.number(),
      validators.positive()
    ],
    monthlyRent: [
      validators.required(),
      validators.number(),
      validators.positive()
    ]
  }
};