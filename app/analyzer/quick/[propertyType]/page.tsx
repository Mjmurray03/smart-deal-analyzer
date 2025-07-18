'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PropertyData, MetricFlags, PropertyType } from '@/lib/calculations/types';
import { quickPackages } from '@/lib/calculations/packages';
import EnhancedDynamicInputForm from '@/components/calculator/EnhancedDynamicInputForm';
import { InlineLoader, ContentTransition } from '@/components/ui/LoadingStates';
import { FormSectionSkeleton } from '@/components/ui/Skeleton';
import { useLoadingState } from '@/lib/hooks/useLoadingState';
import { useNavigationGuard } from '@/lib/hooks/useNavigationGuard';

interface FieldObject {
  field: string;
  [key: string]: unknown;
}

export default function QuickAnalysisPropertyPage() {
  const params = useParams();
  const { navigate } = useNavigationGuard({
    debounceMs: 300,
    maxRetries: 3,
    onNavigationError: (error) => {
      console.error('Navigation failed:', error);
    }
  });
  
  const propertyType = params.propertyType as string;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [metricFlags, setMetricFlags] = useState<MetricFlags>({} as MetricFlags);
  const { isLoading, execute } = useLoadingState();
  
  const [propertyData, setPropertyData] = useState<Partial<PropertyData>>({
    propertyType: propertyType as PropertyType
  });

  // Memoize packages to prevent unnecessary re-calculations
  const packages = useMemo(() => quickPackages[propertyType] || [], [propertyType]);
  const capitalizedType = useMemo(() => 
    propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace('-', ' '), 
    [propertyType]
  );

  // Memoized package selection handler to prevent unnecessary re-renders
  const handlePackageSelect = useCallback((packageId: string) => {
    const selectedPkg = packages.find(p => p.id === packageId);
    if (selectedPkg) {
      // Auto-select package metrics
      const packageFlags: MetricFlags = {} as MetricFlags;
      selectedPkg.includedMetrics.forEach(metric => {
        packageFlags[metric] = true;
      });
      setMetricFlags(packageFlags);
    }
    setSelectedPackage(packageId);
    setPropertyData(prev => ({ ...prev, propertyType: propertyType as PropertyType }));
  }, [packages, propertyType]);

  // Memoized data change handler to prevent unnecessary re-renders
  const handleDataChange = useCallback((data: Partial<PropertyData>) => {
    setPropertyData(prev => ({ ...prev, ...data }));
  }, []);

  // Memoized calculation handler to prevent unnecessary re-renders
  const handleCalculate = useCallback(async () => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    await execute(async () => {
      // Validate required fields (support both enhanced and legacy formats)
      const missingFields = selectedPkg.requiredFields.filter((field: unknown) => {
        let fieldName: string;
        let value: unknown;
        
        // Check if this is an enhanced field definition or legacy field name
        if (typeof field === 'object' && field !== null && 'field' in field) {
          fieldName = (field as FieldObject).field;
          value = propertyData[fieldName as keyof PropertyData];
        } else {
          fieldName = field as string;
          value = propertyData[fieldName as keyof PropertyData];
        }
        
        return value === undefined || value === null || value === '' || 
               (Array.isArray(value) && value.length === 0);
      });

      if (missingFields.length > 0) {
        const fieldNames = missingFields.map((field: unknown) => 
          typeof field === 'object' && field !== null && 'field' in field ? (field as FieldObject).field : field as string
        );
        throw new Error(`Please fill in the following required fields: ${fieldNames.join(', ')}`);
      }

      // Calculate metrics with package ID for enhanced package support
      const enhancedPropertyData = {
        ...propertyData,
        selectedPackageId: selectedPackage
      } as PropertyData;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use navigation guard to prevent infinite loops
      const dataParam = encodeURIComponent(JSON.stringify(enhancedPropertyData));
      const flagsParam = encodeURIComponent(JSON.stringify(metricFlags));
      navigate(`/analyzer/${propertyType}/results?data=${dataParam}&flags=${flagsParam}`);
    });
  }, [packages, selectedPackage, execute, propertyData, metricFlags, navigate, propertyType]);

  // Effect to update property data when property type changes
  useEffect(() => {
    setPropertyData(prev => ({ ...prev, propertyType: propertyType as PropertyType }));
  }, [propertyType]);

  // Effect to reset state when packages change
  useEffect(() => {
    if (packages.length === 0) {
      setSelectedPackage(null);
      setMetricFlags({} as MetricFlags);
    }
  }, [packages]);

  if (!selectedPackage) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Quick Analysis', href: '/analyzer/quick' },
              { label: capitalizedType, href: `/analyzer/quick/${propertyType}` }
            ]} 
          />
          
          {/* Quick Access Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Instant Calculators
            </Link>
            <Link 
              href="/analyzer/quick" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Property Types
            </Link>
            <Link 
              href="/analyzer/advanced" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Switch to Advanced Analysis
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {capitalizedType} Quick Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your analysis package to get started with quick calculations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Includes:</span>
                  <ul className="mt-2 space-y-1">
                    {pkg.includedMetrics.map((metric) => (
                      <li key={metric} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);
  if (!selectedPackageData) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Quick Analysis', href: '/analyzer/quick' },
            { label: capitalizedType, href: `/analyzer/quick/${propertyType}` },
            { label: selectedPackageData.name, href: `/analyzer/quick/${propertyType}` }
          ]} 
        />
        
        {/* Quick Access Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Instant Calculators
          </Link>
          <button 
            onClick={() => setSelectedPackage(null)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Packages
          </button>
          <Link 
            href="/analyzer/advanced" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Switch to Advanced Analysis
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedPackageData.name}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Input Form */}
          <ContentTransition
            isLoading={false}
            loadingComponent={<FormSectionSkeleton />}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
              <EnhancedDynamicInputForm
                requiredFields={selectedPackageData.requiredFields as (keyof PropertyData)[]}
                optionalFields={selectedPackageData.optionalFields as (keyof PropertyData)[]}
                data={propertyData as PropertyData}
                onChange={handleDataChange}
                packageType={selectedPackage}
              />
              
              {/* Calculate Button */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleCalculate}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <InlineLoader size="sm" />}
                  {isLoading ? 'Calculating...' : `Calculate ${selectedPackageData.name}`}
                </button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  {isLoading ? 'Processing your data...' : "You'll be redirected to a comprehensive results dashboard"}
                </p>
              </div>
            </div>
          </ContentTransition>
        </div>
      </div>
    </main>
  );
}