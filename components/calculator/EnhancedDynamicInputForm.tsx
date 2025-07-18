'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  ChevronDown, 
  Check, 
  Plus, 
  X, 
  Users, 
  ArrowLeft, 
  Save,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Calculator,
  Building,
  Settings
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import InputWithType from '@/components/ui/InputWithType';
import { cn } from '@/lib/design-system/utils';
import { PropertyData } from '@/lib/calculations/types';
import { FieldDefinition } from '@/lib/calculations/packages/enhanced-package-types';

interface EnhancedDynamicInputFormProps {
  requiredFields: FieldDefinition[] | (keyof PropertyData)[];
  optionalFields?: FieldDefinition[] | (keyof PropertyData)[] | undefined;
  data: PropertyData;
  onChange: (data: PropertyData) => void;
  packageType?: string;
}

interface ArrayFieldState {
  [fieldName: string]: unknown[];
}

interface FieldGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: string[];
  description?: string;
}

// Type for field values to replace 'any'
type FieldValue = string | number | boolean | null | undefined;

// Type for validation function value parameter
type ValidationValue = string | number | boolean | Array<unknown> | Record<string, unknown> | null | undefined;

type AutoSaveStatus = 'saving' | 'saved' | null;

// Enhanced field configuration with smart grouping
const getFieldGroups = (allFields: (FieldDefinition | keyof PropertyData)[]): FieldGroup[] => {
  const fieldNames = allFields.map(field => 
    typeof field === 'object' ? field.field : field
  );

  const groups: FieldGroup[] = [
    {
      id: 'basic',
      name: 'Basic Information',
      icon: Building,
      description: 'Essential property details',
      fields: fieldNames.filter(field => 
        ['propertyName', 'propertyAddress', 'totalSquareFootage', 'squareFootage', 'totalSF', 'grossLeasableArea', 'numberOfUnits'].includes(field)
      )
    },
    {
      id: 'financial',
      name: 'Financial Details',
      icon: DollarSign,
      description: 'Purchase price and income information',
      fields: fieldNames.filter(field => 
        ['purchasePrice', 'currentNOI', 'projectedNOI', 'grossIncome', 'annualRent', 'averageRent', 'monthlyRent'].includes(field)
      )
    },
    {
      id: 'loan',
      name: 'Loan Information',
      icon: Calculator,
      description: 'Financing and loan terms',
      fields: fieldNames.filter(field => 
        ['loanAmount', 'interestRate', 'loanTerm', 'ltv', 'dscr'].includes(field)
      )
    },
    {
      id: 'operating',
      name: 'Operating Metrics',
      icon: TrendingUp,
      description: 'Expenses and operational data',
      fields: fieldNames.filter(field => 
        ['operatingExpenses', 'managementFees', 'reserves', 'vacancyRate', 'occupancyRate', 'capRate'].includes(field)
      )
    },
    {
      id: 'advanced',
      name: 'Advanced Fields',
      icon: Settings,
      description: 'Additional parameters and complex data',
      fields: fieldNames.filter(field => 
        !['propertyName', 'propertyAddress', 'totalSquareFootage', 'squareFootage', 'totalSF', 'grossLeasableArea', 'numberOfUnits',
          'purchasePrice', 'currentNOI', 'projectedNOI', 'grossIncome', 'annualRent', 'averageRent', 'monthlyRent',
          'loanAmount', 'interestRate', 'loanTerm', 'ltv', 'dscr',
          'operatingExpenses', 'managementFees', 'reserves', 'vacancyRate', 'occupancyRate', 'capRate'].includes(field)
      )
    }
  ];

  // Filter out empty groups and ensure at least one group exists
  const nonEmptyGroups = groups.filter(group => group.fields.length > 0);
  
  if (nonEmptyGroups.length === 0) {
    // Fallback: put all fields in a single group
    return [{
      id: 'all',
      name: 'Property Information',
      icon: Building,
      description: 'All required fields',
      fields: fieldNames
    }];
  }

  return nonEmptyGroups;
};

// Smart suggestions based on property type and existing data
const getFieldSuggestion = (fieldName: string, formData: PropertyData, propertyType?: string): number | null => {
  switch (fieldName) {
    case 'loanAmount':
      if (formData.purchasePrice) {
        return formData.purchasePrice * 0.75; // 75% LTV suggestion
      }
      break;
    case 'interestRate':
      return 5.5; // Current market rate suggestion
    case 'loanTerm':
      return 30; // Standard term
    case 'vacancyRate':
      if (propertyType === 'multifamily') return 5;
      if (propertyType === 'office') return 8;
      return 7;
    case 'managementFees':
      if (formData.grossIncome) {
        return formData.grossIncome * 0.05; // 5% of gross income
      }
      break;
    case 'reserves':
      if (formData.grossIncome) {
        return formData.grossIncome * 0.03; // 3% of gross income
      }
      break;
  }
  return null;
};

export default function EnhancedDynamicInputForm({ 
  requiredFields, 
  optionalFields = [], 
  data, 
  onChange,
  packageType 
}: EnhancedDynamicInputFormProps) {
  
  // State management
  const [arrayFieldState, setArrayFieldState] = useState<ArrayFieldState>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if we're dealing with enhanced fields or legacy fields
  const isEnhancedFields = Array.isArray(requiredFields) && requiredFields.length > 0 && 
                          typeof requiredFields[0] === 'object' && 'field' in requiredFields[0];

  // Combine all fields for processing
  const allFields = useMemo(() => [...requiredFields, ...optionalFields], [requiredFields, optionalFields]);
  
  // Create field groups with stable reference
  const fieldGroups = useMemo(() => {
    return getFieldGroups(allFields);
  }, [allFields]);

  // Initialize expanded sections (first section open by default)
  // Memoize the first group ID to prevent re-initialization
  const firstGroupId = useMemo(() => {
    return fieldGroups.length > 0 && fieldGroups[0] ? fieldGroups[0].id : null;
  }, [fieldGroups]);
  
  useEffect(() => {
    setExpandedSections(prev => {
      // Only initialize if we don't have any sections set yet
      const hasExistingSections = Object.keys(prev).length > 0;
      
      if (!hasExistingSections && firstGroupId) {
        return { [firstGroupId]: true };
      }
      
      return prev;
    });
  }, [firstGroupId]); // Now depends on stable firstGroupId

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(() => {
      setAutoSaveStatus('saving');
      
      // Save to localStorage
      const draftKey = `smartdeal-draft-${packageType || 'default'}`;
      try {
        localStorage.setItem(draftKey, JSON.stringify(data));
        
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setHasChanges(false);
          
          // Clear saved status after 3 seconds
          setTimeout(() => setAutoSaveStatus(null), 3000);
        }, 500);
      } catch (error) {
        console.error('Failed to save draft:', error);
        setAutoSaveStatus(null);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timeoutId);
  }, [data, hasChanges, packageType]);

  // Field validation
  const validateField = useCallback((fieldName: string, value: ValidationValue): string | null => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number' && value === 0) {
      // Allow zero values for validation
    } else if (!value) {
      return null;
    }
    
    // Helper to determine if field should be numeric
    const isNumericField = allFields.some(field => {
      const currentFieldName = typeof field === 'object' ? field.field : field;
      return currentFieldName === fieldName && (
        (typeof field === 'object' && (field.type === 'number' || field.type === 'currency' || field.type === 'percentage')) ||
        currentFieldName.includes('Price') || currentFieldName.includes('Amount') || currentFieldName.includes('Rate') ||
        currentFieldName.includes('NOI') || currentFieldName.includes('Expenses') || currentFieldName.includes('Income')
      );
    });

    // Get field definition
    const fieldDef = allFields.find(field => 
      typeof field === 'object' ? field.field === fieldName : field === fieldName
    );

    if (typeof fieldDef === 'object' && fieldDef.validation) {
      const { min, max } = fieldDef.validation;
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          return `Value must be at least ${min.toLocaleString()}`;
        }
        if (max !== undefined && numValue > max) {
          return `Value cannot exceed ${max.toLocaleString()}`;
        }
      }
    }

      // Type-specific validation
    if (typeof value === 'number') {
      if (fieldName.includes('Rate') || fieldName.includes('rate')) {
        if (value < 0 || value > 100) {
          return 'Rate must be between 0 and 100';
        }
      }
      if (fieldName.includes('Price') || fieldName.includes('Amount')) {
        if (value < 0) {
          return 'Amount cannot be negative';
        }
      }
    } else if (typeof value === 'string') {
      // String validation for numeric fields
      if (isNumericField && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return 'Please enter a valid number';
        }
      }
    }

    return null;
  }, [allFields]);

  // Handle field changes with proper type conversion and safety
  const handleFieldChange = useCallback((fieldName: string, value: FieldValue) => {
    // Safely handle value conversion
    let processedValue = value;
    
    // Check if this field should be a number
    const fieldDef = allFields.find(field => 
      typeof field === 'object' ? field.field === fieldName : field === fieldName
    );
    
    const isNumericField = (typeof fieldDef === 'object' && 
      (fieldDef.type === 'number' || fieldDef.type === 'currency' || fieldDef.type === 'percentage')) ||
      fieldName.includes('Price') || fieldName.includes('Amount') || fieldName.includes('Rate') ||
      fieldName.includes('NOI') || fieldName.includes('Expenses') || fieldName.includes('Income');
    
    // Safe numeric conversion
    if (isNumericField && value !== '' && value !== null && value !== undefined) {
      const stringValue = String(value);
      const numericValue = parseFloat(stringValue.replace(/[^0-9.-]/g, ''));
      processedValue = isNaN(numericValue) ? 0 : numericValue;
    }
    
    // Validate field
    const error = validateField(fieldName, processedValue);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });

    // Update data
    onChange({
      ...data,
      [fieldName]: processedValue,
    });

    setHasChanges(true);
  }, [data, onChange, validateField, allFields]);

  // Safe onChange handler for Input components
  const createSafeOnChangeHandler = useCallback((fieldName: string) => {
    return (valueOrEvent: string | number | React.ChangeEvent<HTMLInputElement>) => {
      let value: FieldValue;
      
      // Handle both direct values and event objects
      if (valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent) {
        // Event object - safely extract value
        value = valueOrEvent.target?.value ?? '';
      } else {
        // Direct value
        value = valueOrEvent;
      }
      
      handleFieldChange(fieldName, value);
    };
  }, [handleFieldChange]);

  // Get appropriate input type based on field definition
  const getInputType = useCallback((fieldDef: FieldDefinition | keyof PropertyData): 'currency' | 'percentage' | 'number' | 'text' | 'address' => {
    if (typeof fieldDef === 'object') {
      switch (fieldDef.type) {
        case 'currency': return 'currency';
        case 'percentage': return 'percentage';
        case 'number': return 'number';
        default: return 'text';
      }
    }
    
    const fieldName = String(fieldDef);
    if (fieldName.includes('Price') || fieldName.includes('Amount') || fieldName.includes('NOI') || 
        fieldName.includes('Income') || fieldName.includes('Expenses') || fieldName.includes('Fees') ||
        fieldName.includes('Loan') && fieldName.includes('Amount')) {
      return 'currency';
    }
    if (fieldName.includes('Rate') || fieldName.includes('rate') || fieldName.includes('Percentage')) {
      return 'percentage';
    }
    if (fieldName.includes('Address') || fieldName.includes('address')) {
      return 'address';
    }
    if (fieldName.includes('SF') || fieldName.includes('SquareFootage') || fieldName.includes('Units') ||
        fieldName.includes('Term') || fieldName.includes('Year')) {
      return 'number';
    }
    return 'text';
  }, []);

  // Array field operations
  const handleArrayFieldChange = useCallback((fieldName: string, index: number, subField: string, value: unknown) => {
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
    
    onChange({
      ...data,
      [fieldName]: currentArray
    });

    setHasChanges(true);
  }, [data, onChange, arrayFieldState]);

  const addArrayItem = useCallback((fieldName: string) => {
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

    setHasChanges(true);
  }, [data, onChange, arrayFieldState]);

  const removeArrayItem = useCallback((fieldName: string, index: number) => {
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

    setHasChanges(true);
  }, [data, onChange, arrayFieldState]);

  // Utility functions
  const getFieldValue = (field: string): unknown => {
    return data[field as keyof PropertyData] || '';
  };

  const isFieldFilled = (field: string): boolean => {
    const value = data[field as keyof PropertyData];
    
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    
    return false;
  };

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const getSectionCompletion = (fields: string[]): number => {
    const filledFields = fields.filter(isFieldFilled);
    return fields.length > 0 ? Math.round((filledFields.length / fields.length) * 100) : 0;
  };

  // Field rendering functions
  const renderField = (fieldName: string): React.ReactNode => {
    const fieldDef = allFields.find(field => 
      typeof field === 'object' ? field.field === fieldName : field === fieldName
    );

    if (typeof fieldDef === 'object') {
      return renderEnhancedField(fieldDef);
    } else {
      return renderLegacyField(fieldName as keyof PropertyData);
    }
  };

  const renderEnhancedField = (fieldDef: FieldDefinition): React.ReactNode => {
    const { field, type, label, description, placeholder, helperText } = fieldDef;
    const value = getFieldValue(field);
    const error = errors[field];
    const suggestion = getFieldSuggestion(field, data, packageType);
    const inputType = getInputType(fieldDef);

    if (type === 'array') {
      return renderArrayField(fieldDef);
    }

    return (
      <div key={field} className="group">
        <InputWithType
          label={label || field}
          inputType={inputType}
          value={String(value || '')}
          onValueChange={createSafeOnChangeHandler(field)}
          {...(error ? { error } : {})}
          {...(helperText || description ? { helper: helperText || description } : {})}
          required={requiredFields.some(rf => typeof rf === 'object' ? rf.field === field : rf === field)}
          {...(placeholder ? { placeholder } : {})}
          success={Boolean(value) && !error}
          floating
          showTypeIndicator={true}
          {...(suggestion && !value ? { rightIcon: HelpCircle } : {})}
        />
        
        {/* Smart suggestion */}
        {suggestion && !value && (
          <button
            type="button"
            onClick={() => handleFieldChange(field, suggestion)}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
          >
            💡 Suggested: {inputType === 'currency' ? `$${suggestion.toLocaleString()}` : 
                          inputType === 'percentage' ? `${suggestion}%` : suggestion}
          </button>
        )}
      </div>
    );
  };

  const renderLegacyField = (field: keyof PropertyData): React.ReactNode => {
    const value = getFieldValue(field);
    const error = errors[field];
    const suggestion = getFieldSuggestion(field, data, packageType);
    const label = String(field).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    const inputType = getInputType(field);

    return (
      <div key={field} className="group">
        <InputWithType
          label={label}
          inputType={inputType}
          value={String(value || '')}
          onValueChange={createSafeOnChangeHandler(field)}
          {...(error ? { error } : {})}
          required={requiredFields.some(rf => typeof rf === 'object' ? rf.field === field : rf === field)}
          success={Boolean(value) && !error}
          floating
          showTypeIndicator={true}
          {...(suggestion && !value ? { rightIcon: HelpCircle } : {})}
        />
        
        {suggestion && !value && (
          <button
            type="button"
            onClick={() => handleFieldChange(field, suggestion)}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
          >
            💡 Suggested: {inputType === 'currency' ? `$${suggestion.toLocaleString()}` : 
                          inputType === 'percentage' ? `${suggestion}%` : suggestion}
          </button>
        )}
      </div>
    );
  };

  const renderArrayField = (fieldDef: FieldDefinition): React.ReactNode => {
    const { field, label, subFields } = fieldDef;
    if (!subFields) return null;

    const dataFromProps = data[field as keyof PropertyData];
    const arrayItems = Array.isArray(dataFromProps) ? dataFromProps : (arrayFieldState[field] || []);

    return (
      <Card key={field} variant="bordered" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{label || field}</h3>
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              leftIcon={Plus}
              onClick={() => addArrayItem(field)}
            >
              Add {label}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {arrayItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No {label?.toLowerCase()} added yet</p>
              <Button 
                type="button"
                variant="secondary" 
                size="sm" 
                className="mt-3"
                onClick={() => addArrayItem(field)}
              >
                Add First {label}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {arrayItems.map((item, index) => (
                <Card key={index} variant="glass">
                  <CardBody>
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="primary">{label} {index + 1}</Badge>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field, index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {subFields.map((subField) => {
                        const subInputType = getInputType(subField);
                        return (
                          <InputWithType
                            key={subField.field}
                            label={subField.label || subField.field}
                            inputType={subInputType}
                            value={String(item[subField.field] || '')}
                            onValueChange={(val) => handleArrayFieldChange(field, index, subField.field, val)}
                            floating
                            showTypeIndicator={true}
                          />
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    );
  };

  // Progress calculation
  const totalFields = allFields.length;
  const completedFields = allFields.filter(field => 
    isEnhancedFields ? isFieldFilled((field as FieldDefinition).field) : isFieldFilled(field as keyof PropertyData)
  ).length;

  // Form validation - could be used for disabling submit buttons
  // const isFormValid = Object.keys(errors).every(key => !errors[key]) && 
  //                    requiredFields.every(field => 
  //                      isFieldFilled(typeof field === 'object' ? field.field : field)
  //                    );

  const propertyTypeTitle = packageType?.split('-')[0]?.charAt(0).toUpperCase() + 
                           (packageType?.split('-')[0]?.slice(1) || '') || 'Property';

  return (
    <form className="max-w-4xl mx-auto pb-40">
      {/* Progress indicator - fixed position to avoid overlap */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Form Completion
          </span>
          <span className="text-sm text-gray-600">
            {completedFields} of {totalFields} fields
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-300 ease-out"
            style={{ width: `${(completedFields / totalFields) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Header and auto-save indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {propertyTypeTitle} Analysis Details
        </h2>
        {autoSaveStatus && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            {autoSaveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span>Saving...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Saved</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Grouped sections */}
      {fieldGroups.map((group) => {
        const Icon = group.icon;
        const completion = getSectionCompletion(group.fields);
        const isExpanded = expandedSections[group.id];

        return (
          <Card key={group.id} variant="bordered" className="mb-6 transition-all duration-200 ease-in-out">
            <CardHeader 
              className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(group.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    completion === 100
                      ? "bg-green-100"
                      : "bg-gray-100"
                  )}>
                    {completion === 100 ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Icon className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-500">{group.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{completion}%</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </div>
              </div>
            </CardHeader>
            
            <div className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
            )}>
              {isExpanded && (
                <CardBody className="pt-0 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                    {group.fields.map((fieldName) => (
                      <div key={fieldName} className="min-h-[80px]">
                        {renderField(fieldName)}
                      </div>
                    ))}
                  </div>
                </CardBody>
              )}
            </div>
          </Card>
        );
      })}

      {/* Form navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={() => window.history.back()}
                className="shrink-0"
              >
                Back
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                leftIcon={Save}
                onClick={() => {
                  setAutoSaveStatus('saving');
                  const draftKey = `smartdeal-draft-${packageType || 'default'}`;
                  try {
                    localStorage.setItem(draftKey, JSON.stringify(data));
                  } catch (error) {
                    console.error('Failed to save draft:', error);
                  }
                  setTimeout(() => setAutoSaveStatus('saved'), 300);
                }}
                className="shrink-0"
              >
                Save Draft
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {Object.keys(errors).length > 0 && (
                <span className="text-sm text-red-600 text-center">
                  {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
                </span>
              )}
              
              <div className="text-sm text-gray-500">
                Progress: {Math.round((completedFields / totalFields) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}