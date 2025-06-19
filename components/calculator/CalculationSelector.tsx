import { useState } from 'react';
import { MetricFlags, PropertyData } from '@/lib/calculations/types';
import { propertyPackages, getRequiredFields, fieldMetadata } from '@/lib/calculations/packages';
import { CalculatorIcon, CogIcon } from '@heroicons/react/24/outline';

interface CalculationSelectorProps {
  propertyType: string;
  onSelect: (metrics: (keyof MetricFlags)[], fields: (keyof PropertyData)[]) => void;
}

export default function CalculationSelector({ propertyType, onSelect }: CalculationSelectorProps) {
  const [mode, setMode] = useState<'packages' | 'custom'>('packages');
  const [customMetrics, setCustomMetrics] = useState<Set<keyof MetricFlags>>(new Set());
  
  const packages = propertyPackages[propertyType] || propertyPackages['mixed-use'] || [];
  
  // All available metrics
  const allMetrics: { key: keyof MetricFlags; name: string; description: string }[] = [
    { key: 'capRate', name: 'Cap Rate', description: 'Net Operating Income / Purchase Price' },
    { key: 'cashOnCash', name: 'Cash-on-Cash Return', description: 'Annual Cash Flow / Total Investment' },
    { key: 'dscr', name: 'Debt Service Coverage Ratio', description: 'NOI / Annual Debt Service' },
    { key: 'irr', name: 'Internal Rate of Return', description: 'Annualized return including appreciation' },
    { key: 'roi', name: 'Return on Investment', description: 'Total return on invested capital' },
    { key: 'breakeven', name: 'Breakeven Occupancy', description: 'Required occupancy to cover expenses' }
  ];
  
  const handlePackageSelect = (packageId: string) => {
    const selectedPackage = packages.find(p => p.id === packageId);
    if (selectedPackage) {
      onSelect(selectedPackage.includedMetrics, selectedPackage.requiredFields);
    }
  };
  
  const handleCustomSelect = () => {
    const metricsArray = Array.from(customMetrics);
    const requiredFields = getRequiredFields(metricsArray, {});
    onSelect(metricsArray, requiredFields);
  };
  
  const toggleCustomMetric = (metric: keyof MetricFlags) => {
    const newSet = new Set(customMetrics);
    if (newSet.has(metric)) {
      newSet.delete(metric);
    } else {
      newSet.add(metric);
    }
    setCustomMetrics(newSet);
  };
  
  const getFieldCount = (fields: (keyof PropertyData)[]) => {
    return fields.filter(field => fieldMetadata[field]).length;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select Calculations</h2>
        <p className="mt-2 text-gray-600">
          Choose a pre-configured package or customize your analysis
        </p>
      </div>
      
      {/* Mode Selector */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setMode('packages')}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            mode === 'packages'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <CalculatorIcon className="h-5 w-5 inline-block mr-2" />
          Recommended Packages
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
            mode === 'custom'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <CogIcon className="h-5 w-5 inline-block mr-2" />
          Custom Selection
        </button>
      </div>
      
      {/* Package Selection */}
      {mode === 'packages' && (
        <div className="grid gap-4">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="border rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="mt-1 text-gray-600">{pkg.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Metrics included:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {pkg.includedMetrics.map(metric => (
                          <span
                            key={metric}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {allMetrics.find(m => m.key === metric)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Required inputs:</span>{' '}
                      {getFieldCount(pkg.requiredFields)} fields
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Custom Selection */}
      {mode === 'custom' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {allMetrics.map(metric => (
              <div
                key={metric.key}
                className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                onClick={(e) => {
                  // Prevent navigation when clicking the checkbox
                  if ((e.target as HTMLElement).tagName !== 'INPUT') {
                    e.preventDefault();
                    toggleCustomMetric(metric.key);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={customMetrics.has(metric.key)}
                  onChange={() => toggleCustomMetric(metric.key)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1 cursor-pointer">
                  <div className="font-medium text-gray-900">{metric.name}</div>
                  <div className="text-sm text-gray-500">{metric.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          {customMetrics.size > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Selected metrics:</span> {customMetrics.size}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <span className="font-medium">Required inputs:</span>{' '}
                {getFieldCount(getRequiredFields(Array.from(customMetrics), {}))} fields
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleCustomSelect}
              disabled={customMetrics.size === 0}
              className={`
                px-6 py-3 rounded-md font-medium
                ${customMetrics.size > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Continue with {customMetrics.size} Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}