import React from 'react';
import { MetricFlags, CalculatedMetrics } from '@/lib/calculations/types';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface EnhancedMetricsDisplayProps {
  metrics: CalculatedMetrics;
  flags: MetricFlags;
}

// TypeScript interfaces for safe metric rendering
type SafeReactNode = React.ReactNode;

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

// Safe rendering utilities for complex metrics
const renderComplexObject = (obj: unknown, depth: number = 0): SafeReactNode => {
  try {
    if (obj === null || obj === undefined) {
      return <span className="text-gray-400">N/A</span>;
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return <span className="text-gray-700">{String(obj)}</span>;
    }

    if (Array.isArray(obj)) {
      return (
        <div className="space-y-2">
          {obj.slice(0, 5).map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-3">
              <div className="text-xs text-gray-500 mb-1">Item {index + 1}</div>
              {renderComplexObject(item, depth + 1)}
            </div>
          ))}
          {obj.length > 5 && (
            <div className="text-xs text-gray-500 italic">
              ... and {obj.length - 5} more items
            </div>
          )}
        </div>
      );
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) {
        return <span className="text-gray-400">Empty object</span>;
      }

      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-2' : ''}`}>
          {entries.slice(0, 3).map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="mt-1">
                    {depth < 2 ? renderComplexObject(value, depth + 1) : <span className="text-gray-500">...</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {entries.length > 3 && (
            <div className="text-xs text-gray-500 italic">
              ... and {entries.length - 3} more properties
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-400">Unknown type</span>;
  } catch (error) {
    console.error('Error rendering complex object:', error);
    return <span className="text-red-400">Error rendering data</span>;
  }
};

// Type guard for checking if a value is a valid metric value
const isValidMetricValue = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Safe metric rendering function
const renderMetricValue = (value: unknown, type: 'percentage' | 'currency' | 'ratio'): string => {
  if (isValidMetricValue(value)) {
    return formatMetricValue(value, type);
  }
  return 'N/A';
};

// Helper function to render complex metrics section
const renderComplexMetricsSection = (activeMetrics: (keyof MetricFlags)[], metrics: CalculatedMetrics): React.ReactNode => {
  const complexMetrics = activeMetrics.filter(metric => metricLabels[metric]?.type === 'complex');
  
  if (complexMetrics.length === 0) {
    return null;
  }

  const complexElements: React.ReactElement[] = [];
  
  complexMetrics.forEach((metric) => {
    const value = (metrics as Record<string, unknown>)[metric as string];
    const labelInfo = metricLabels[metric];
    if (labelInfo && value) {
      complexElements.push(
        <div key={metric as string} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{labelInfo.label}</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {renderComplexObject(value)}
          </div>
        </div>
      );
    }
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Advanced Analysis</h3>
      <div className="space-y-4">
        {complexElements}
      </div>
    </div>
  ) as React.ReactNode;
};

export default function EnhancedMetricsDisplay({ metrics, flags }: EnhancedMetricsDisplayProps): React.ReactElement {
  const activeMetrics = Object.entries(flags)
    .filter(([, isActive]) => isActive)
    .map(([metric]) => metric as keyof MetricFlags);

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
        {activeMetrics
          .map((metric) => {
            const value = (metrics as Record<string, unknown>)[metric as string];
            const labelInfo = metricLabels[metric];
            if (!labelInfo) return null;
            const { label, type } = labelInfo;
            
            // Skip complex metrics for the simple grid
            if (type === 'complex') return null;
            
            return (
              <div
                key={metric as string}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {renderMetricValue(value, type)}
                </p>
              </div>
            );
          })
          .filter(Boolean)}
      </div>
      
      {/* @ts-ignore */}
      {renderComplexMetricsSection(activeMetrics, metrics)}
      
      {/* Asset Analysis Section */}
      {(metrics as Record<string, unknown>).assetAnalysis && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Property Type</h4>
                <p className="text-sm text-blue-700">
                  {String(((metrics as Record<string, unknown>).assetAnalysis as Record<string, unknown>).propertyType || 'Unknown')}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Available Functions</h4>
                <p className="text-sm text-green-700">
                  {((metrics.assetAnalysis as Record<string, unknown>)?.availableFunctions as unknown[])?.length || 0} analysis functions
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