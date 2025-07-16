'use client';

// External imports
import React, { useState } from 'react';
import { CheckIcon, PlusIcon, MinusIcon, BeakerIcon } from '@heroicons/react/24/solid';

// Internal imports - Types
import { PropertyData } from '@/lib/calculations/types';
import { FieldDefinition } from '@/lib/calculations/packages/enhanced-package-types';

interface EnhancedDynamicInputFormProps {
  requiredFields: FieldDefinition[] | (keyof PropertyData)[];
  optionalFields?: FieldDefinition[] | (keyof PropertyData)[];
  data: PropertyData;
  onChange: (data: PropertyData) => void;
  packageType?: string;
}

interface ArrayFieldState {
  [fieldName: string]: unknown[];
}

// Sample data for different package types
const sampleData: Record<string, Partial<PropertyData>> = {
  'office-tenant-credit': {
    tenants: [
      { 
        tenantName: 'Tech Corp', 
        creditRating: 'BBB', 
        publicCompany: true, 
        industry: 'Technology', 
        annualRevenue: 50000000, 
        yearsInBusiness: 10, 
        rentableSquareFeet: 15000, 
        baseRentPSF: 65,
        leaseType: 'Modified Gross',
        leaseStartDate: '2023-01-01',
        leaseEndDate: '2028-12-31'
      },
      { 
        tenantName: 'Law Firm LLP', 
        creditRating: 'A', 
        publicCompany: false, 
        industry: 'Legal', 
        annualRevenue: 25000000, 
        yearsInBusiness: 20, 
        rentableSquareFeet: 8000, 
        baseRentPSF: 75,
        leaseType: 'Full Service',
        leaseStartDate: '2022-06-01',
        leaseEndDate: '2027-05-31'
      }
    ],
    totalSquareFeet: 50000,
    occupancyRate: 92
  },
  'office-walt-enhanced': {
    tenants: [
      {
        tenantName: 'Microsoft Corporation',
        creditRating: 'AAA',
        rentableSquareFeet: 25000,
        baseRentPSF: 75,
        leaseStartDate: '2020-01-01',
        leaseExpirationDate: '2029-12-31', // ~5 years from now
        renewalOptions: '2 x 5 years at market',
        publicCompany: true
      },
      {
        tenantName: 'Wells Fargo Bank',
        creditRating: 'A',
        rentableSquareFeet: 15000,
        baseRentPSF: 68,
        leaseStartDate: '2019-06-01',
        leaseExpirationDate: '2028-05-31', // ~3.5 years from now
        renewalOptions: '1 x 5 years at 105% of market',
        publicCompany: true
      },
      {
        tenantName: 'Regional Law Firm',
        creditRating: 'BBB',
        rentableSquareFeet: 8000,
        baseRentPSF: 60,
        leaseStartDate: '2021-01-01',
        leaseExpirationDate: '2027-12-31', // ~3 years from now
        renewalOptions: 'None',
        publicCompany: false
      }
    ],
    includeOptions: true,
    optionProbability: 75,
    totalRentableSF: 48000
  },
  'office-quick-valuation': {
    purchasePrice: 10000000,
    currentNOI: 800000,
    totalSF: 50000
  },
  'office-quick-returns': {
    purchasePrice: 10000000,
    currentNOI: 800000,
    totalInvestment: 12000000,
    annualCashFlow: 500000
  },
  'office-quick-lease': {
    averageRentPSF: 65,
    operatingExpenses: 1200000
  },
  'office-quick-financing': {
    purchasePrice: 10000000,
    loanAmount: 7500000,
    interestRate: 5.5,
    loanTerm: 30,
    currentNOI: 800000
  },
  'retail-quick-valuation': {
    purchasePrice: 15000000,
    currentNOI: 1050000,
    grossLeasableArea: 75000
  },
  'industrial-quick-valuation': {
    purchasePrice: 8000000,
    currentNOI: 640000,
    squareFootage: 100000
  },
  'industrial-quick-efficiency': {
    purchasePrice: 8000000,
    squareFootage: 100000,
    clearHeight: 32,
    numberOfDockDoors: 20
  },
  'multifamily-quick-valuation': {
    purchasePrice: 25000000,
    numberOfUnits: 100,
    averageRent: 2500,
    occupancyRate: 92
  },
  'mixeduse-quick-valuation': {
    purchasePrice: 45000000,
    currentNOI: 2700000,
    totalSF: 150000
  },
  'retail-tenant-analysis': {
    tenants: [
      {
        tenantName: 'Starbucks',
        tenantType: 'National',
        creditRating: 'A',
        category: 'Food & Beverage',
        squareFeet: 2500,
        baseRentPSF: 45,
        percentageRent: true,
        salesBreakpoint: 1500000,
        percentageRate: 6,
        leaseStartDate: '2021-01-01',
        leaseEndDate: '2031-12-31'
      },
      {
        tenantName: 'Target',
        tenantType: 'Anchor',
        creditRating: 'A',
        category: 'Department Store',
        squareFeet: 125000,
        baseRentPSF: 12,
        percentageRent: false,
        leaseStartDate: '2020-01-01',
        leaseEndDate: '2040-12-31'
      }
    ],
    totalGLA: 250000,
    parkingSpaces: 1250
  },
  'industrial-tenant-credit': {
    tenants: [
      {
        tenantName: 'Amazon Logistics',
        creditRating: 'AA',
        businessType: 'Distribution',
        squareFeet: 100000,
        clearHeight: 36,
        dockDoors: 20,
        truckCourts: 185,
        powerRequirements: '480V 3-phase',
        leaseStartDate: '2022-01-01',
        leaseEndDate: '2032-12-31',
        baseRentPSF: 8.50
      },
      {
        tenantName: 'FedEx Ground',
        creditRating: 'BBB',
        businessType: 'Last Mile Delivery',
        squareFeet: 75000,
        clearHeight: 32,
        dockDoors: 15,
        truckCourts: 150,
        powerRequirements: '208V 3-phase',
        leaseStartDate: '2021-06-01',
        leaseEndDate: '2029-05-31',
        baseRentPSF: 9.75
      }
    ],
    totalSF: 200000,
    landSize: 10
  },
  'multifamily-value-add': {
    units: [
      { unitType: 'Studio', count: 20, avgSF: 500, currentRent: 1200, marketRent: 1400 },
      { unitType: '1BR', count: 40, avgSF: 750, currentRent: 1600, marketRent: 1850 },
      { unitType: '2BR', count: 30, avgSF: 1100, currentRent: 2200, marketRent: 2500 },
      { unitType: '3BR', count: 10, avgSF: 1400, currentRent: 2800, marketRent: 3200 }
    ],
    totalUnits: 100,
    currentOccupancy: 88,
    purchasePrice: 25000000,
    renovationCostPerUnit: 15000
  },
  'mixed-use-valuation': {
    components: [
      {
        componentType: 'Retail',
        squareFeet: 25000,
        units: 10,
        avgRentPSF: 35,
        occupancy: 95,
        capRate: 6.5
      },
      {
        componentType: 'Office',
        squareFeet: 50000,
        units: 1,
        avgRentPSF: 45,
        occupancy: 90,
        capRate: 7.0
      },
      {
        componentType: 'Residential',
        squareFeet: 75000,
        units: 60,
        avgRentPSF: 3.50,
        occupancy: 93,
        capRate: 5.5
      }
    ],
    totalSF: 150000,
    purchasePrice: 45000000
  }
};

export default function EnhancedDynamicInputForm({ 
  requiredFields, 
  optionalFields = [], 
  data, 
  onChange,
  packageType 
}: EnhancedDynamicInputFormProps) {
  
  // Initialize array field state from data prop
  const initializeArrayState = () => {
    const initialState: ArrayFieldState = {};
    const allFields = [...requiredFields, ...optionalFields];
    
    allFields.forEach((field) => {
      if (typeof field === 'object' && 'type' in field && field.type === 'array') {
        const fieldDef = field as FieldDefinition;
        const existingData = data[fieldDef.field as keyof PropertyData];
        if (Array.isArray(existingData) && existingData.length > 0) {
          initialState[fieldDef.field] = existingData;
        }
      }
    });
    
    return initialState;
  };
  
  const [arrayFieldState, setArrayFieldState] = useState<ArrayFieldState>(initializeArrayState);
  
  // Check if we're dealing with enhanced fields or legacy fields
  const isEnhancedFields = Array.isArray(requiredFields) && requiredFields.length > 0 && 
                          typeof requiredFields[0] === 'object' && 'field' in requiredFields[0];
  
  console.log('📝 ENHANCED DYNAMIC INPUT FORM: Component mounted/updated');
  console.log('📝 ENHANCED DYNAMIC INPUT FORM: Required Fields:', requiredFields);
  console.log('📝 ENHANCED DYNAMIC INPUT FORM: Optional Fields:', optionalFields);
  console.log('📝 ENHANCED DYNAMIC INPUT FORM: Current Data:', data);
  console.log('📝 ENHANCED DYNAMIC INPUT FORM: Is Enhanced Fields:', isEnhancedFields);
  
  if (isEnhancedFields) {
    const arrayFields = requiredFields.filter(field => 
      typeof field === 'object' && 'type' in field && field.type === 'array'
    );
    console.log('📝 ENHANCED DYNAMIC INPUT FORM: Array Fields Found:', arrayFields.map(f => f.field));
  }
  
  const handleInputChange = (field: string, value: unknown) => {
    console.log(`📝 ENHANCED FORM: Field changed - ${field}:`, value);
    onChange({
      ...data,
      [field]: value,
    });
  };
  
  const handleArrayFieldChange = (fieldName: string, index: number, subField: string, value: unknown) => {
    console.log(`📝 ENHANCED FORM: Array field changed - ${fieldName}[${index}].${subField}:`, value);
    const dataFromProps = data[fieldName as keyof PropertyData];
    const currentArray = Array.isArray(dataFromProps) ? [...dataFromProps] : [...(arrayFieldState[fieldName] || [])];
    
    if (!currentArray[index]) {
      currentArray[index] = {};
    }
    
    currentArray[index] = {
      ...currentArray[index],
      [subField]: value
    };
    
    setArrayFieldState(prev => ({
      ...prev,
      [fieldName]: currentArray
    }));
    
    // Update the main data
    console.log(`📝 ENHANCED FORM: Updated array data for ${fieldName}:`, currentArray);
    onChange({
      ...data,
      [fieldName]: currentArray
    });
  };
  
  const addArrayItem = (fieldName: string) => {
    const dataFromProps = data[fieldName as keyof PropertyData];
    const currentArray = Array.isArray(dataFromProps) ? dataFromProps : (arrayFieldState[fieldName] || []);
    const newArray = [...currentArray, {}];
    
    setArrayFieldState(prev => ({
      ...prev,
      [fieldName]: newArray
    }));
    
    onChange({
      ...data,
      [fieldName]: newArray
    });
  };
  
  const removeArrayItem = (fieldName: string, index: number) => {
    const dataFromProps = data[fieldName as keyof PropertyData];
    const currentArray = Array.isArray(dataFromProps) ? dataFromProps : (arrayFieldState[fieldName] || []);
    const updatedArray = currentArray.filter((_, i) => i !== index);
    
    setArrayFieldState(prev => ({
      ...prev,
      [fieldName]: updatedArray
    }));
    
    onChange({
      ...data,
      [fieldName]: updatedArray
    });
  };
  
  const getFieldValue = (field: string): unknown => {
    return data[field as keyof PropertyData] || '';
  };
  
  const isFieldFilled = (field: string): boolean => {
    const value = data[field as keyof PropertyData];
    
    if (value === undefined || value === null) {
      return false;
    }
    
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    
    if (typeof value === 'number') {
      return value !== 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    
    return false;
  };
  
  const renderEnhancedField = (fieldDef: FieldDefinition, isRequired: boolean = false) => {
    const { field, type, label, description, validation, options, subFields, placeholder, helperText } = fieldDef;
    const isFilled = isFieldFilled(field);
    
    switch (type) {
      case 'string':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <input
              type="text"
              value={getFieldValue(field)}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder={placeholder}
              min={validation?.min}
              max={validation?.max}
            />
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'number':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <input
              type="number"
              step={1}
              value={getFieldValue(field)}
              onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder={placeholder}
              min={validation?.min}
              max={validation?.max}
            />
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'currency':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step={0.01}
                value={getFieldValue(field)}
                onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
                className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={placeholder}
                min={validation?.min}
                max={validation?.max}
              />
            </div>
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'percentage':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                step={0.01}
                value={getFieldValue(field)}
                onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
                className="block w-full pr-8 pl-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={placeholder}
                min={validation?.min}
                max={validation?.max}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'boolean':
        return (
          <div key={field}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={getFieldValue(field) || false}
                onChange={(e) => handleInputChange(field, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {label || field}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </span>
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <select
              value={getFieldValue(field)}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select {label || field}</option>
              {options?.map((option) => (
                <option 
                  key={typeof option === 'string' ? option : option.value}
                  value={typeof option === 'string' ? option : option.value}
                >
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </select>
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'date':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            <input
              type="date"
              value={getFieldValue(field)}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-400">{description}</p>
            )}
          </div>
        );
        
      case 'array':
        console.log(`🔥 ARRAY FIELD RENDERING: ${field}`);
        console.log(`🔥 ARRAY FIELD: subFields:`, subFields);
        if (!subFields) {
          console.log(`🔥 ARRAY FIELD: No subFields found for ${field}`);
          return null;
        }
        
        // Use data from props if available, otherwise use local state
        const dataFromProps = data[field as keyof PropertyData];
        const arrayItems = Array.isArray(dataFromProps) ? dataFromProps : (arrayFieldState[field] || []);
        console.log(`🔥 ARRAY FIELD: ${field} items:`, arrayItems);
        
        return (
          <div key={field} className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 flex items-center mb-2">
              {label || field}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              {arrayItems.length > 0 && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
            </label>
            {description && (
              <p className="text-xs text-gray-400 mb-2">{description}</p>
            )}
            
            <div className="space-y-4">
              {arrayItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {label || field} #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(field, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subFields.map((subField) => (
                      <div key={subField.field}>
                        <label className="block text-xs font-medium text-gray-600">
                          {subField.label || subField.field}
                          {subField.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {subField.type === 'select' ? (
                          <select
                            value={item[subField.field] || ''}
                            onChange={(e) => handleArrayFieldChange(field, index, subField.field, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                          >
                            <option value="">Select...</option>
                            {subField.options?.map((option) => (
                              <option 
                                key={typeof option === 'string' ? option : option.value}
                                value={typeof option === 'string' ? option : option.value}
                              >
                                {typeof option === 'string' ? option : option.label}
                              </option>
                            ))}
                          </select>
                        ) : subField.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={item[subField.field] || false}
                            onChange={(e) => handleArrayFieldChange(field, index, subField.field, e.target.checked)}
                            className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : subField.type === 'date' ? (
                          <input
                            type="date"
                            value={item[subField.field] || ''}
                            onChange={(e) => handleArrayFieldChange(field, index, subField.field, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                          />
                        ) : subField.type === 'currency' ? (
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                              <span className="text-gray-500 text-xs">$</span>
                            </div>
                            <input
                              type="number"
                              step={0.01}
                              value={item[subField.field] || ''}
                              onChange={(e) => handleArrayFieldChange(field, index, subField.field, parseFloat(e.target.value) || 0)}
                              className="block w-full pl-6 pr-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                              placeholder={subField.placeholder}
                            />
                          </div>
                        ) : subField.type === 'percentage' ? (
                          <div className="relative mt-1">
                            <input
                              type="number"
                              step={0.01}
                              value={item[subField.field] || ''}
                              onChange={(e) => handleArrayFieldChange(field, index, subField.field, parseFloat(e.target.value) || 0)}
                              className="block w-full pr-6 pl-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                              placeholder={subField.placeholder}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <span className="text-gray-500 text-xs">%</span>
                            </div>
                          </div>
                        ) : (
                          <input
                            type={subField.type === 'number' ? 'number' : 'text'}
                            step={subField.type === 'number' ? 1 : undefined}
                            value={item[subField.field] || ''}
                            onChange={(e) => handleArrayFieldChange(field, index, subField.field, 
                              subField.type === 'number' ? 
                              parseFloat(e.target.value) || 0 : e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                            placeholder={subField.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem(field)}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add {label || field}
              </button>
            </div>
            
            {helperText && (
              <p className="mt-2 text-xs text-gray-500">{helperText}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const renderLegacyField = (field: keyof PropertyData, isRequired: boolean = false) => {
    // This is a fallback for legacy PropertyData fields
    // We'll use basic input handling for now
    const value = getFieldValue(field);
    const isFilled = isFieldFilled(field);
    
    return (
      <div key={field}>
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          {String(field).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
          {isFilled && <CheckIcon className="h-4 w-4 text-green-600 ml-2" />}
        </label>
        <input
          type="number"
          step={0.01}
          value={value}
          onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    );
  };
  
  // Count filled fields for progress
  const allFields = [...requiredFields, ...optionalFields];
  const filledCount = allFields.filter(field => 
    isEnhancedFields ? isFieldFilled((field as FieldDefinition).field) : isFieldFilled(field as keyof PropertyData)
  ).length;
  const progressPercentage = allFields.length > 0 ? (filledCount / allFields.length) * 100 : 0;
  
  const loadSampleData = () => {
    if (packageType && sampleData[packageType]) {
      const sample = sampleData[packageType];
      onChange({
        ...data,
        ...sample
      });
      
      // Update array field state for any array fields in sample data
      const newArrayState: ArrayFieldState = {};
      Object.entries(sample).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newArrayState[key] = value;
        }
      });
      
      if (Object.keys(newArrayState).length > 0) {
        setArrayFieldState(prev => ({
          ...prev,
          ...newArrayState
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enter Property Information</h2>
          <p className="mt-2 text-gray-600">
            Fill in the required fields to calculate your selected metrics
          </p>
        </div>
        {packageType && sampleData[packageType] && (
          <button
            type="button"
            onClick={loadSampleData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BeakerIcon className="h-4 w-4 mr-2" />
            Load Sample Data
          </button>
        )}
      </div>
      
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {filledCount} of {allFields.length} fields completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Required Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Required Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredFields.map((field) => 
            isEnhancedFields ? 
              renderEnhancedField(field as FieldDefinition, true) : 
              renderLegacyField(field as keyof PropertyData, true)
          )}
        </div>
      </div>
      
      {/* Optional Fields */}
      {optionalFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Optional Fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalFields.map((field) => 
              isEnhancedFields ? 
                renderEnhancedField(field as FieldDefinition, false) : 
                renderLegacyField(field as keyof PropertyData, false)
            )}
          </div>
        </div>
      )}
    </div>
  );
}