import { MetricFlags, CalculatedMetrics } from '@/lib/calculations/types';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface EnhancedMetricsDisplayProps {
  metrics: CalculatedMetrics;
  flags: MetricFlags;
}

// Enhanced labels for both simple and complex metrics
const metricLabels: Partial<Record<keyof MetricFlags, { label: string; type: 'percentage' | 'currency' | 'ratio' | 'complex' }>> = {
  // Basic metrics
  capRate: { label: 'Cap Rate', type: 'percentage' },
  cashOnCash: { label: 'Cash on Cash', type: 'percentage' },
  dscr: { label: 'DSCR', type: 'ratio' },
  irr: { label: 'IRR', type: 'percentage' },
  roi: { label: 'ROI', type: 'percentage' },
  breakeven: { label: 'Breakeven', type: 'percentage' },
  pricePerSF: { label: 'Price per Square Foot', type: 'currency' },
  ltv: { label: 'Loan-to-Value Ratio', type: 'ratio' },
  grm: { label: 'Gross Rent Multiplier', type: 'ratio' },
  pricePerUnit: { label: 'Price per Unit', type: 'currency' },
  egi: { label: 'Effective Gross Income', type: 'currency' },
  
  // Enhanced package metrics
  walt: { label: 'WALT', type: 'ratio' },
  simpleWalt: { label: 'Simple WALT', type: 'ratio' },
  salesPerSF: { label: 'Sales per Square Foot', type: 'complex' },
  clearHeightAnalysis: { label: 'Clear Height Analysis', type: 'complex' },
  revenuePerUnit: { label: 'Revenue per Unit Analysis', type: 'complex' },
  industrialMetrics: { label: 'Industrial Clear Height Analysis', type: 'complex' },
  multifamilyMetrics: { label: 'Multifamily Revenue Analysis', type: 'complex' }
};

export default function EnhancedMetricsDisplay({ metrics, flags }: EnhancedMetricsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  console.log('📊 ENHANCED METRICS DISPLAY: Received Metrics:', metrics);
  console.log('📊 ENHANCED METRICS DISPLAY: Received Flags:', flags);
  console.log('📊 ENHANCED METRICS DISPLAY: Metrics keys:', Object.keys(metrics));
  console.log('📊 ENHANCED METRICS DISPLAY: Active flags:', Object.entries(flags).filter(([, active]) => active));
  
  const activeMetrics = Object.entries(flags)
    .filter(([, isActive]) => isActive)
    .map(([metric]) => metric as keyof MetricFlags);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  // Helper function to render any complex object
  const renderComplexObject = (obj: unknown, depth: number = 0): JSX.Element => {
    if (obj === null || obj === undefined) {
      return <span className="text-gray-400">N/A</span>;
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return <span className="text-gray-700">{String(obj)}</span>;
    }

    if (Array.isArray(obj)) {
      return (
        <div className="space-y-2">
          {obj.map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-3">
              <div className="text-xs text-gray-500 mb-1">Item {index + 1}</div>
              {renderComplexObject(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        return <span className="text-gray-400">Empty object</span>;
      }

      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-2' : ''}`}>
          {entries.map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="mt-1">
                    {renderComplexObject(value, depth + 1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-400">Unknown type</span>;
  };

  // Helper function to render key metrics from complex objects
  const renderKeyMetrics = (obj: unknown): JSX.Element | null => {
    if (!obj || typeof obj !== 'object') return null;

    // Try to extract key numeric values for display
    const keyValues: Array<{ label: string; value: unknown; type: 'percentage' | 'currency' | 'ratio' }> = [];

    // Common patterns for extracting key metrics
    const patterns = [
      { keys: ['walt', 'creditWeightedWALT'], type: 'ratio' as const, suffix: ' years' },
      { keys: ['portfolioRiskScore', 'riskLevel'], type: 'percentage' as const },
      { keys: ['rolloverRisk'], type: 'percentage' as const },
      { keys: ['buildingEfficiency', 'utilizationScore'], type: 'percentage' as const },
      { keys: ['portfolioNPV', 'npv'], type: 'currency' as const },
      { keys: ['rentPremium', 'occupancyPremium'], type: 'percentage' as const },
      { keys: ['totalPercentageRent', 'recoveryRate'], type: 'currency' as const },
      { keys: ['totalRecovered', 'totalShortfall'], type: 'currency' as const },
      { keys: ['additionalSF', 'investmentYield'], type: 'currency' as const },
      { keys: ['lastMileRentPremium', 'utilization'], type: 'percentage' as const },
      { keys: ['marketShare', 'amenityScore'], type: 'percentage' as const },
      { keys: ['investmentYield', 'paybackPeriod'], type: 'ratio' as const },
      { keys: ['diversificationIndex', 'synergyScore'], type: 'percentage' as const },
      { keys: ['yieldOnCost', 'developmentMargin'], type: 'percentage' as const }
    ];

    patterns.forEach(pattern => {
      pattern.keys.forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null) {
          keyValues.push({
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            value: obj[key],
            type: pattern.type
          });
        }
      });
    });

    // Look for nested objects with key metrics
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        patterns.forEach(pattern => {
          pattern.keys.forEach(patternKey => {
            if ((value as Record<string, unknown>)[patternKey] !== undefined && (value as Record<string, unknown>)[patternKey] !== null) {
              keyValues.push({
                label: `${key.replace(/([A-Z])/g, ' $1')} ${patternKey.replace(/([A-Z])/g, ' $1')}`,
                value: (value as Record<string, unknown>)[patternKey],
                type: pattern.type
              });
            }
          });
        });
      }
    });

    if (keyValues.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {keyValues.slice(0, 6).map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">{item.label}</h4>
            <p className="text-lg font-semibold text-gray-900">
              {item.type === 'currency' && typeof item.value === 'number' ? 
                `$${item.value.toLocaleString()}` :
                item.type === 'percentage' && typeof item.value === 'number' ?
                `${item.value.toFixed(1)}%` :
                item.type === 'ratio' && typeof item.value === 'number' ?
                `${item.value.toFixed(2)}` :
                String(item.value)
              }
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (activeMetrics.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <InformationCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No metrics selected for calculation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeMetrics.map((metric) => {
          const value = (metrics as Record<string, unknown>)[metric];
          const labelInfo = metricLabels[metric];
          if (!labelInfo) return null;
          const { label, type } = labelInfo;
          
          // Skip complex metrics for the simple grid
          if (type === 'complex') return null;
          
          return (
            <div
              key={metric}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatMetricValue(value, type)}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Package Results */}
      {Object.entries(metrics).map(([key, value]) => {
        // Skip basic metrics
        if (metricLabels[key as keyof MetricFlags] && metricLabels[key as keyof MetricFlags]?.type !== 'complex') {
          return null;
        }
        
        // Skip if value is null, undefined, or not an object
        if (!value || typeof value !== 'object') {
          return null;
        }
        
        const isExpanded = expandedSections.has(key);
        const sectionTitle = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        return (
          <div key={key} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(key)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{sectionTitle}</h3>
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
              
              {/* Key Metrics Preview */}
              {!isExpanded && renderKeyMetrics(value, key)}
            </div>
            
            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Key Metrics */}
                {renderKeyMetrics(value, key)}
                
                {/* Detailed Breakdown */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Analysis</h4>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    {renderComplexObject(value)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Asset Analysis Section */}
      {(metrics as Record<string, unknown>).assetAnalysis && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Property Type</h4>
                <p className="text-sm text-blue-700">{((metrics as Record<string, unknown>).assetAnalysis as Record<string, unknown>).propertyType}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Available Functions</h4>
                <p className="text-sm text-green-700">
                  {(((metrics as Record<string, unknown>).assetAnalysis as Record<string, unknown>).availableFunctions as unknown[]).length} analysis functions
                </p>
              </div>
            </div>
            
            {((metrics as Record<string, unknown>).assetAnalysis as Record<string, unknown>).results && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Analysis Results</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {renderComplexObject(((metrics as Record<string, unknown>).assetAnalysis as Record<string, unknown>).results)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}