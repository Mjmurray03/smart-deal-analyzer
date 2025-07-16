'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, ChartBarIcon, UserGroupIcon, BuildingOfficeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PropertyData, MetricFlags, PropertyType } from '@/lib/calculations/types';
import { advancedPackages } from '@/lib/calculations/packages';
import { calculateMetrics } from '@/lib/calculations/metrics';
import EnhancedDynamicInputForm from '@/components/calculator/EnhancedDynamicInputForm';
import EnhancedMetricsDisplay from '@/components/results/EnhancedMetricsDisplay';

interface FieldObject {
  field: string;
  [key: string]: unknown;
}

export default function AdvancedAnalysisPropertyPage() {
  const params = useParams();
  // const router = useRouter();
  const propertyType = params.propertyType as string;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState<Record<string, unknown>>({});
  const [metricFlags, setMetricFlags] = useState<MetricFlags>({} as MetricFlags);
  
  console.log('🎯 ADVANCED CALCULATOR: Component mounted');
  console.log('🎯 ADVANCED CALCULATOR: Analysis level = ADVANCED');
  console.log('🎯 ADVANCED CALCULATOR: Property type =', propertyType);
  const [propertyData, setPropertyData] = useState<Partial<PropertyData>>({
    propertyType: propertyType as PropertyType
  });

  const packages = advancedPackages[propertyType] || [];
  const capitalizedType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace('-', ' ');
  
  console.log('🎯 ADVANCED ANALYZER: Property type:', propertyType);
  console.log('🎯 ADVANCED ANALYZER: Available packages:', packages.map(p => ({ id: p.id, name: p.name, hasRequiredFields: !!p.requiredFields })));
  console.log('🎯 ADVANCED ANALYZER: First package field structure:', packages[0]?.requiredFields);
  
  console.log('🎯 ADVANCED CALCULATOR: Available packages:', packages.map(p => ({ id: p.id, name: p.name })));
  console.log('🎯 ADVANCED CALCULATOR: Total packages for', propertyType, ':', packages.length);

  const handlePackageSelect = (packageId: string) => {
    console.log('🎯 ADVANCED CALCULATOR: User selected package:', packageId);
    const selectedPkg = packages.find(p => p.id === packageId);
    if (selectedPkg) {
      console.log('🎯 ADVANCED CALCULATOR: Package metrics:', selectedPkg.includedMetrics);
      console.log('🎯 ADVANCED CALCULATOR: Package required fields:', selectedPkg.requiredFields);
      
      // Auto-select package metrics
      const packageFlags: MetricFlags = {} as MetricFlags;
      selectedPkg.includedMetrics.forEach((metric: keyof MetricFlags) => {
        packageFlags[metric] = true;
      });
      setMetricFlags(packageFlags);
      console.log('🎯 ADVANCED CALCULATOR: Auto-selected metric flags:', packageFlags);
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
    
    console.log('🔥 CALCULATE: Starting calculation');
    console.log('🔥 CALCULATE: Property data being submitted:', enhancedPropertyData);
    console.log('🔥 CALCULATE: Tenants array:', enhancedPropertyData.tenants);
    console.log('🔥 CALCULATE: Package ID:', selectedPackage);
    console.log('🔥 CALCULATE: Metric flags:', metricFlags);
    
    const metrics = calculateMetrics(enhancedPropertyData, metricFlags);
    setCalculatedMetrics(metrics);
    
    console.log('🔥 CALCULATE: Final results received:', metrics);
    console.log('🔥 CALCULATE: WALT value:', metrics.walt);
    console.log('🔥 CALCULATE: Enhanced WALT value:', metrics.enhancedWALT);
  };

  const getPackageIcon = (packageName: string) => {
    if (packageName.includes('Tenant') || packageName.includes('Mix')) {
      return UserGroupIcon;
    } else if (packageName.includes('Analysis') || packageName.includes('Analytics')) {
      return ChartBarIcon;
    } else {
      return BuildingOfficeIcon;
    }
  };

  if (!selectedPackage) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Advanced Analysis', href: '/analyzer/advanced' },
              { label: capitalizedType, href: `/analyzer/advanced/${propertyType}` }
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
              href="/analyzer/advanced" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Property Types
            </Link>
            <Link 
              href="/analyzer/quick" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Switch to Quick Analysis
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {capitalizedType} Advanced Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select your comprehensive analysis package for institutional-grade insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const IconComponent = getPackageIcon(pkg.name);
              return (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-300"
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Advanced Features:</span>
                    <ul className="mt-2 space-y-1">
                      {pkg.includedMetrics.slice(0, 4).map((metric) => (
                        <li key={metric} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </li>
                      ))}
                      {pkg.includedMetrics.length > 4 && (
                        <li className="text-gray-400">
                          + {pkg.includedMetrics.length - 4} more metrics
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need simpler analysis? Try our quick analysis instead.
            </p>
            <Link 
              href={`/analyzer/quick/${propertyType}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Quick Analysis
              <ArrowLeftIcon className="ml-1 h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);
  if (!selectedPackageData) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Advanced Analysis', href: '/analyzer/advanced' },
            { label: capitalizedType, href: `/analyzer/advanced/${propertyType}` },
            { label: selectedPackageData.name, href: `/analyzer/advanced/${propertyType}` }
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
            href="/analyzer/quick" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Switch to Quick Analysis
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedPackageData.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Data</h2>
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
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold"
                >
                  Calculate {selectedPackageData.name}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analysis Results</h2>
              <EnhancedMetricsDisplay 
                metrics={calculatedMetrics}
                flags={metricFlags}
              />
              
              {Object.keys(calculatedMetrics).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Click &quot;Calculate&quot; to see your advanced analysis results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}