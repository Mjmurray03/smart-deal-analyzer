import { PropertyData } from '@/lib/calculations/types';
import { fieldMetadata } from '@/lib/calculations/packages';
import { CheckIcon } from '@heroicons/react/24/solid';

interface DynamicInputFormProps {
  requiredFields: (keyof PropertyData)[];
  optionalFields?: (keyof PropertyData)[];
  data: PropertyData;
  onChange: (data: PropertyData) => void;
}

export default function DynamicInputForm({ 
  requiredFields, 
  optionalFields = [], 
  data, 
  onChange 
}: DynamicInputFormProps) {
  
  const handleInputChange = (field: keyof PropertyData, value: string) => {
    // Convert to number or undefined (not 0)
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({
      ...data,
      [field]: numValue,
    });
  };
  
  const getInputValue = (value: number | undefined): string => {
    return value !== undefined && value !== null ? value.toString() : '';
  };
  
  // Check if a field is filled
  const isFieldFilled = (field: keyof PropertyData): boolean => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '' && value !== 0;
  };
  
  // Count filled fields for progress
  const filledCount = requiredFields.filter(field => isFieldFilled(field)).length;
  const progressPercentage = requiredFields.length > 0 
    ? (filledCount / requiredFields.length) * 100 
    : 0;
  
  // Group fields by category
  const groupedFields = {
    basic: [] as (keyof PropertyData)[],
    financial: [] as (keyof PropertyData)[],
    loan: [] as (keyof PropertyData)[],
    property: [] as (keyof PropertyData)[],
    projection: [] as (keyof PropertyData)[]
  };
  
  // Group required fields
  requiredFields.forEach(field => {
    const metadata = fieldMetadata[field];
    if (metadata && groupedFields[metadata.category]) {
      groupedFields[metadata.category].push(field);
    }
  });
  
  const renderFieldGroup = (category: keyof typeof groupedFields, title: string) => {
    const fields = groupedFields[category];
    if (fields.length === 0) return null;
    
    // Count filled fields in this section
    const sectionFilledCount = fields.filter(field => isFieldFilled(field)).length;
    
    return (
      <div key={category} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {fields.length > 0 && (
            <p className="text-sm text-gray-500">
              {sectionFilledCount} of {fields.length} fields completed
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => {
            const metadata = fieldMetadata[field];
            if (!metadata) return null;
            
            const isRequired = requiredFields.includes(field);
            const isFilled = isFieldFilled(field);
            
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  {metadata.label}
                  {isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                  {isFilled && (
                    <CheckIcon className="h-4 w-4 text-green-600 ml-2" />
                  )}
                </label>
                <input
                  type="number"
                  step={metadata.step || 0.01}
                  value={getInputValue(data[field] as number | undefined)}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={metadata.placeholder}
                />
                {metadata.helperText && (
                  <p className="mt-1 text-xs text-gray-500">{metadata.helperText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Property Information</h2>
        <p className="mt-2 text-gray-600">
          Fill in the required fields to calculate your selected metrics
        </p>
      </div>
      
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {filledCount} of {requiredFields.length} fields completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Field Groups */}
      <div className="space-y-8">
        {renderFieldGroup('basic', 'Basic Information')}
        {renderFieldGroup('financial', 'Financial Information')}
        {renderFieldGroup('property', 'Property Details')}
        {renderFieldGroup('loan', 'Loan Information')}
        {renderFieldGroup('projection', 'Projections & Analysis')}
      </div>
      
      {/* Optional Fields (if any) */}
      {optionalFields.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Optional Fields
            <span className="text-sm font-normal text-gray-500 ml-2">
              (enhance your analysis)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalFields.map(field => {
              const metadata = fieldMetadata[field];
              if (!metadata) return null;
              const isFilled = isFieldFilled(field);
              
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    {metadata.label}
                    {isFilled && (
                      <CheckIcon className="h-4 w-4 text-green-600 ml-2" />
                    )}
                  </label>
                  <input
                    type="number"
                    step={metadata.step || 0.01}
                    value={getInputValue(data[field] as number | undefined)}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={metadata.placeholder}
                  />
                  {metadata.helperText && (
                    <p className="mt-1 text-xs text-gray-500">{metadata.helperText}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}