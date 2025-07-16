'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PropertyData, MetricFlags } from '@/lib/calculations/types';
import { quickPackages } from '@/lib/calculations/packages';
import { calculateMetrics } from '@/lib/calculations/metrics';
import EnhancedDynamicInputForm from '@/components/calculator/EnhancedDynamicInputForm';
import EnhancedMetricsDisplay from '@/components/results/EnhancedMetricsDisplay';

interface FieldObject {
  field: string;
  [key: string]: unknown;
}

export default function QuickAnalysisPropertyPage() {
  const params = useParams();
  // const router = useRouter();
  const propertyType = params.propertyType as string;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState<Record<string, unknown>>({});
  const [metricFlags, setMetricFlags] = useState<MetricFlags>({});
  
  console.log('📊 QUICK CALCULATOR: Component mounted');
  console.log('📊 QUICK CALCULATOR: Analysis level = QUICK');
  console.log('📊 QUICK CALCULATOR: Property type =', propertyType);
  const [propertyData, setPropertyData] = useState<Partial<PropertyData>>({
    propertyType: propertyType
  });

  const packages = quickPackages[propertyType] || [];
  const capitalizedType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace('-', ' ');
  
  console.log('📊 QUICK CALCULATOR: Available packages:', packages.map(p => ({ id: p.id, name: p.name })));
  console.log('📊 QUICK CALCULATOR: Total packages for', propertyType, ':', packages.length);

  const handlePackageSelect = (packageId: string) => {
    console.log('📊 QUICK CALCULATOR: User selected package:', packageId);
    const selectedPkg = packages.find(p => p.id === packageId);
    if (selectedPkg) {
      console.log('📊 QUICK CALCULATOR: Package metrics:', selectedPkg.includedMetrics);
      console.log('📊 QUICK CALCULATOR: Package required fields:', selectedPkg.requiredFields);
      
      // Auto-select package metrics
      const packageFlags: MetricFlags = {};
      selectedPkg.includedMetrics.forEach(metric => {
        packageFlags[metric] = true;
      });
      setMetricFlags(packageFlags);
      console.log('📊 QUICK CALCULATOR: Auto-selected metric flags:', packageFlags);
    }
    setSelectedPackage(packageId);
    setPropertyData(prev => ({ ...prev, propertyType: propertyType as PropertyType }));
  };

  const handleDataChange = (data: Partial<PropertyData>) => {
    setPropertyData(prev => ({ ...prev, ...data }));
  };

  const handleCalculate = () => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

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
      alert(`Please fill in the following required fields: ${fieldNames.join(', ')}`);
      return;
    }

    // Calculate metrics with package ID for enhanced package support
    const enhancedPropertyData = {
      ...propertyData,
      selectedPackageId: selectedPackage
    } as PropertyData;
    
    const metrics = calculateMetrics(enhancedPropertyData, metricFlags);
    setCalculatedMetrics(metrics);
    
    console.log('📊 QUICK CALCULATOR: Calculated metrics:', metrics);
    console.log('📊 QUICK CALCULATOR: Using flags:', metricFlags);
    console.log('📊 QUICK CALCULATOR: Package ID:', selectedPackage);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
            <EnhancedDynamicInputForm
              requiredFields={selectedPackageData.requiredFields}
              optionalFields={selectedPackageData.optionalFields}
              data={propertyData as PropertyData}
              onChange={handleDataChange}
              packageType={selectedPackage}
            />
            
            {/* Calculate Button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleCalculate}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Calculate {selectedPackageData.name}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
            <EnhancedMetricsDisplay 
              metrics={calculatedMetrics}
              flags={metricFlags}
            />
            
            {Object.keys(calculatedMetrics).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Click &quot;Calculate&quot; to see your results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}