'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyData, MetricFlags, PropertyType } from '@/lib/calculations/types';
import { calculateMetrics } from '@/lib/calculations/metrics';
import { assessDeal } from '@/lib/calculations/assessment';
import PropertyTypeSelector from '@/components/calculator/PropertyTypeSelector';
import CalculationSelector from '@/components/calculator/CalculationSelector';
import DynamicInputForm from '@/components/calculator/DynamicInputForm';
import MetricsDisplay from '@/components/calculator/MetricsDisplay';
import DealAssessmentCard from '@/components/calculator/DealAssessmentCard';
import PDFGenerator from '@/components/report/PDFGenerator';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type Step = 'property-type' | 'calculations' | 'inputs' | 'results';

export default function AnalyzerPage() {
  const [currentStep, setCurrentStep] = useState<Step>('property-type');
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<(keyof MetricFlags)[]>([]);
  const [requiredFields, setRequiredFields] = useState<(keyof PropertyData)[]>([]);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: 'office',
    purchasePrice: 0,
    squareFootage: 0,
    numberOfUnits: 0,
    parkingSpaces: 0,
    currentNOI: 0,
    projectedNOI: 0,
    grossIncome: 0,
    operatingExpenses: 0,
    annualCashFlow: 0,
    totalInvestment: 0,
    occupancyRate: 1,
    averageRent: 0,
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0,
    discountRate: 0,
    holdingPeriod: 0
  });
  
  // Create metric flags from selected metrics
  const metricFlags: MetricFlags = {
    // Basic Metrics
    capRate: selectedMetrics.includes('capRate'),
    cashOnCash: selectedMetrics.includes('cashOnCash'),
    
    // Debt Metrics
    dscr: selectedMetrics.includes('dscr'),
    ltv: selectedMetrics.includes('ltv'),
    
    // Advanced Metrics
    irr: selectedMetrics.includes('irr'),
    roi: selectedMetrics.includes('roi'),
    breakeven: selectedMetrics.includes('breakeven'),
    
    // Property-Specific Metrics
    pricePerSF: selectedMetrics.includes('pricePerSF'),
    grm: selectedMetrics.includes('grm'),
    pricePerUnit: selectedMetrics.includes('pricePerUnit'),
    egi: selectedMetrics.includes('egi')
  };
  
  // Calculate metrics and assessment
  const calculatedMetrics = calculateMetrics(propertyData, metricFlags);
  const dealAssessment = assessDeal(calculatedMetrics);
  
  // Handle property type selection
  const handlePropertyTypeSelect = (type: PropertyType) => {
    setPropertyType(type);
    setPropertyData({ ...propertyData, propertyType: type });
    setCurrentStep('calculations');
  };
  
  // Handle calculation selection
  const handleCalculationSelect = (metrics: (keyof MetricFlags)[], fields: (keyof PropertyData)[]) => {
    setSelectedMetrics(metrics);
    setRequiredFields(fields);
    setCurrentStep('inputs');
  };
  
  // Handle form completion - ONLY called by button click
  const handleFormComplete = () => {
    setCurrentStep('results');
  };
  
  // Handle going back
  const handleBack = () => {
    switch (currentStep) {
      case 'calculations':
        setCurrentStep('property-type');
        break;
      case 'inputs':
        setCurrentStep('calculations');
        break;
      case 'results':
        setCurrentStep('inputs');
        break;
    }
  };
  
  // Check if all required fields are filled
  const isFormComplete = requiredFields.every(field => {
    const value = propertyData[field];
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return value !== undefined && value !== null && value !== 0;
  });
  
  const steps = [
    { id: 'property-type', name: 'Property Type', number: 1 },
    { id: 'calculations', name: 'Select Metrics', number: 2 },
    { id: 'inputs', name: 'Enter Data', number: 3 },
    { id: 'results', name: 'View Results', number: 4 }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Smart Deal Analyzer
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Professional commercial real estate investment analysis
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {propertyType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {propertyType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor: 
                        currentStepIndex > index ? '#10b981' : 
                        currentStep === step.id ? '#3b82f6' : 
                        '#e5e7eb'
                    }}
                    className={`
                      h-10 w-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${currentStepIndex > index ? 'text-white' : 
                        currentStep === step.id ? 'text-white' : 
                        'text-gray-500'}
                    `}
                  >
                    {currentStepIndex > index ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </motion.div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-xs ${currentStep === step.id ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          width: currentStepIndex > index ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        {currentStep !== 'property-type' && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back
          </motion.button>
        )}
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {currentStep === 'property-type' && (
              <PropertyTypeSelector
                selected={propertyType}
                onSelect={handlePropertyTypeSelect}
              />
            )}
            
            {currentStep === 'calculations' && propertyType && (
              <CalculationSelector
                propertyType={propertyType}
                onSelect={handleCalculationSelect}
              />
            )}
            
            {currentStep === 'inputs' && (
              <>
                <DynamicInputForm
                  requiredFields={requiredFields}
                  data={propertyData}
                  onChange={setPropertyData}
                />
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Ready to analyze?</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {isFormComplete 
                          ? 'All required fields are complete. You can now calculate your results.'
                          : `Please complete all ${requiredFields.length} required fields before proceeding.`
                        }
                      </p>
                    </div>
                    <motion.button
                      whileHover={isFormComplete ? { scale: 1.05 } : {}}
                      whileTap={isFormComplete ? { scale: 0.95 } : {}}
                      onClick={handleFormComplete}
                      disabled={!isFormComplete}
                      className={`
                        px-8 py-3 rounded-lg font-semibold transition-all duration-200
                        flex items-center space-x-2
                        ${isFormComplete
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <span>Calculate Results</span>
                      <ChevronRightIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
            
            {currentStep === 'results' && (
              <div className="space-y-8">
                <DealAssessmentCard assessment={dealAssessment} />
                <MetricsDisplay metrics={calculatedMetrics} flags={metricFlags} />
                <div className="mt-8">
                  <PDFGenerator
                    propertyData={propertyData}
                    metrics={calculatedMetrics}
                    assessment={dealAssessment}
                    flags={metricFlags}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}