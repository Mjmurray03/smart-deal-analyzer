'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/design-system/utils';

interface Step {
  name: string;
  active: boolean;
  completed: boolean;
}

interface AnalyzerNavProps {
  propertyType?: string;
  analysisType?: 'quick' | 'advanced';
  currentStep?: number;
  totalSteps?: number;
  steps?: Step[];
}

const AnalyzerNav: FC<AnalyzerNavProps> = ({
  propertyType = 'Property',
  analysisType = 'quick',
  currentStep = 1,
  totalSteps = 3,
  steps
}) => {
  // Default steps if none provided
  const defaultSteps: Step[] = [
    { name: 'Input', active: currentStep === 1, completed: currentStep > 1 },
    { name: 'Review', active: currentStep === 2, completed: currentStep > 2 },
    { name: 'Results', active: currentStep === 3, completed: false }
  ];

  const activeSteps = steps || defaultSteps;

  // Format property type for display
  const formatPropertyType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Breadcrumb style navigation */}
          <div className="flex items-center gap-2 text-sm">
            <Link 
              href="/analyzer" 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              Analysis
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link 
              href={`/analyzer/${analysisType}`}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium capitalize"
            >
              {analysisType}
            </Link>
            {propertyType && propertyType !== 'Property' && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-semibold">
                  {formatPropertyType(propertyType)}
                </span>
              </>
            )}
          </div>
          
          {/* Step indicators - refined design */}
          <div className="hidden md:flex items-center gap-6">
            {activeSteps.map((step, index) => (
              <div key={step.name} className="flex items-center gap-3">
                {/* Step circle */}
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                  step.active 
                    ? "bg-primary-600 text-white shadow-sm" 
                    : step.completed 
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                )}>
                  {step.completed ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step label */}
                <span className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  step.active 
                    ? "text-gray-900" 
                    : step.completed 
                      ? "text-gray-600"
                      : "text-gray-500"
                )}>
                  {step.name}
                </span>
                
                {/* Connector line */}
                {index < activeSteps.length - 1 && (
                  <div className="hidden lg:block w-8 h-px bg-gray-300 ml-2" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile step indicator - simplified */}
          <div className="flex md:hidden items-center gap-2 text-sm">
            <span className="text-gray-500">Step</span>
            <span className="font-semibold text-gray-900">
              {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AnalyzerNav;