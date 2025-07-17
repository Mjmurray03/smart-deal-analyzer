'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PropertyData } from '@/lib/types';
import { quickPackages, propertyPackages as allPropertyPackages } from '@/lib/calculations/packages';
import { ArrowRight, Save } from 'lucide-react';

interface DynamicInputFormProps {
  propertyType: string;
  packageId: string;
  onSubmit: (data: PropertyData) => void;
}

export function DynamicInputForm({ propertyType, packageId, onSubmit }: DynamicInputFormProps) {
  const [formData, setFormData] = useState<Partial<PropertyData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get fields for this package based on property type and package
  const getFieldsForPackage = () => {
    const packages = packageId === 'quick' ? quickPackages : allPropertyPackages;
    const propertyPackageList = packages[propertyType];
    
    if (!propertyPackageList || propertyPackageList.length === 0) {
      // Fallback to basic fields for all property types
      return ['purchasePrice', 'currentNOI', 'totalSquareFootage', 'numberOfUnits', 'grossIncome', 'operatingExpenses', 'loanAmount', 'interestRate', 'loanTerm'] as (keyof PropertyData)[];
    }
    
    // Get the first package that matches or use the basic one
    const selectedPackage = propertyPackageList.find(pkg => pkg.id.includes(packageId)) || propertyPackageList[0];
    return selectedPackage ? selectedPackage.requiredFields : ['purchasePrice', 'currentNOI'] as (keyof PropertyData)[];
  };
  
  const requiredFields = getFieldsForPackage();
  
  // Initialize form data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem(`smartdeal-draft-${packageId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, [packageId]);
  
  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(`smartdeal-draft-${packageId}`, JSON.stringify(formData));
    }
  }, [formData, packageId]);
  
  const handleInputChange = (field: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Check required fields
    const requiredFields = ['purchasePrice', 'currentNOI'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof PropertyData]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Validate specific fields
    if (formData.purchasePrice && formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }
    
    if (formData.currentNOI && formData.currentNOI < 0) {
      newErrors.currentNOI = 'NOI cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(formData as PropertyData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      purchasePrice: 'Purchase Price',
      currentNOI: 'Current NOI',
      loanAmount: 'Loan Amount',
      interestRate: 'Interest Rate (%)',
      loanTerm: 'Loan Term (Years)',
      operatingExpenses: 'Operating Expenses',
      grossIncome: 'Gross Income',
      vacancyRate: 'Vacancy Rate (%)',
      capRate: 'Cap Rate (%)',
      totalSquareFootage: 'Total Square Footage',
      numberOfUnits: 'Number of Units'
    };
    
    return labels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };
  
  const isFieldCurrency = (field: string): boolean => {
    return ['purchasePrice', 'currentNOI', 'loanAmount', 'operatingExpenses', 'grossIncome'].includes(field);
  };
  
  const isFieldPercentage = (field: string): boolean => {
    return ['interestRate', 'vacancyRate', 'capRate'].includes(field);
  };
  
  const renderField = (field: string) => {
    const value = formData[field as keyof PropertyData] || '';
    const error = errors[field];
    const label = getFieldLabel(field);
    
    return (
      <div key={field} className="space-y-2">
        <Input
          label={label}
          type="number"
          value={String(value)}
          onChange={(val) => handleInputChange(field, val)}
          {...(error ? { error } : {})}
          {...(isFieldCurrency(field) ? { formatAs: 'currency' as const } : 
              isFieldPercentage(field) ? { formatAs: 'percentage' as const } : {})}
          floating
          step={isFieldCurrency(field) ? "0.01" : 
                isFieldPercentage(field) ? "0.01" : "1"}
        />
      </div>
    );
  };
  
  // Group fields logically based on actual required fields
  const groupFields = (fields: (keyof PropertyData)[]) => {
    const basicFields = ['purchasePrice', 'currentNOI', 'totalSquareFootage', 'numberOfUnits', 'squareFootage', 'grossLeasableArea'];
    const financialFields = ['grossIncome', 'operatingExpenses', 'vacancyRate', 'capRate', 'occupancyRate', 'totalInvestment', 'annualCashFlow'];
    const loanFields = ['loanAmount', 'interestRate', 'loanTerm'];
    
    const groups: Record<string, string[]> = {
      'Basic Information': [],
      'Financial Details': [],
      'Loan Information': []
    };
    
    fields.forEach(field => {
      const fieldStr = String(field);
      if (basicFields.includes(fieldStr)) {
        groups['Basic Information']?.push(fieldStr);
      } else if (financialFields.includes(fieldStr)) {
        groups['Financial Details']?.push(fieldStr);
      } else if (loanFields.includes(fieldStr)) {
        groups['Loan Information']?.push(fieldStr);
      } else {
        // Put unknown fields in Basic Information
        groups['Basic Information']?.push(fieldStr);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key] && groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };
  
  const fieldGroups = groupFields(requiredFields);
  
  const completedFields = Object.values(formData).filter(value => value && value !== 0).length;
  const totalFields = Object.values(fieldGroups).flat().length;
  const progressPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Analysis
        </h1>
        <p className="text-gray-600">
          {packageId === 'quick' ? 'Quick analysis with essential metrics' : 'Comprehensive analysis with advanced metrics'}
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
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
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields grouped by category */}
        {Object.entries(fieldGroups).map(([groupName, fields]) => (
          <Card key={groupName} variant="bordered" className="overflow-visible">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
            </CardHeader>
            
            <CardBody className="pt-2">
              <div className="grid md:grid-cols-2 gap-6">
                {fields.map((field) => renderField(field))}
              </div>
            </CardBody>
          </Card>
        ))}
        
        {/* Submit button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                leftIcon={Save}
                onClick={() => {
                  localStorage.setItem(`smartdeal-draft-${packageId}`, JSON.stringify(formData));
                }}
              >
                Save Draft
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              {Object.keys(errors).length > 0 && (
                <span className="text-sm text-red-600">
                  {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
                </span>
              )}
              
              <Button
                type="submit"
                size="lg"
                rightIcon={ArrowRight}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Analyzing...' : 'Analyze Property'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}