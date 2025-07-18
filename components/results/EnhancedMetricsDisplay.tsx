'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricFlags, CalculatedMetrics, PropertyData, DealAssessment } from '@/lib/types';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { 
  InformationCircleIcon,
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  HomeIcon,
  BanknotesIcon,
  CalculatorIcon,
  BuildingStorefrontIcon,
  BeakerIcon,
  ChartPieIcon,
  CubeIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid } from '@heroicons/react/24/solid';

interface EnhancedMetricsDisplayProps {
  metrics: CalculatedMetrics;
  flags: MetricFlags;
  propertyData?: PropertyData;
  assessment?: DealAssessment | null;
}

// Enhanced metric info with icons and categories
interface MetricInfo {
  label: string;
  description?: string;
  type: 'percentage' | 'currency' | 'ratio' | 'complex';
  format?: 'percentage' | 'currency' | 'ratio';
  goodThreshold?: number;
  fairThreshold?: number;
  inverse?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  category?: 'returns' | 'debt' | 'valuation' | 'operations' | 'advanced';
}

// Complete metric labels including all basic and complex metrics
const metricLabels: Partial<Record<keyof MetricFlags | string, MetricInfo>> = {
  // Basic metrics with full details
  capRate: { 
    label: 'Cap Rate', 
    description: 'Net Operating Income / Purchase Price',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 8,
    fairThreshold: 6,
    icon: ChartBarIcon,
    category: 'returns'
  },
  cashOnCash: { 
    label: 'Cash on Cash Return', 
    description: 'Annual Cash Flow / Total Cash Investment',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 8,
    fairThreshold: 6,
    icon: CurrencyDollarIcon,
    category: 'returns'
  },
  dscr: { 
    label: 'Debt Service Coverage', 
    description: 'Net Operating Income / Annual Debt Service',
    type: 'ratio',
    format: 'ratio',
    goodThreshold: 1.25,
    fairThreshold: 1.1,
    icon: ShieldCheckIcon,
    category: 'debt'
  },
  irr: { 
    label: 'Internal Rate of Return', 
    description: 'Annualized return including appreciation',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 12,
    fairThreshold: 8,
    icon: ArrowTrendingUpIcon,
    category: 'returns'
  },
  roi: { 
    label: 'Return on Investment', 
    description: 'Total return on invested capital',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 15,
    fairThreshold: 10,
    icon: ChartBarIconSolid,
    category: 'returns'
  },
  breakeven: { 
    label: 'Breakeven Occupancy', 
    description: 'Minimum occupancy to cover expenses',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 75,
    fairThreshold: 85,
    inverse: true,
    icon: BuildingOfficeIcon,
    category: 'operations'
  },
  pricePerSF: { 
    label: 'Price per Square Foot', 
    description: 'Purchase price per square foot',
    type: 'currency',
    format: 'currency',
    icon: BuildingStorefrontIcon,
    category: 'valuation'
  },
  ltv: { 
    label: 'Loan-to-Value Ratio', 
    description: 'Loan amount relative to property value',
    type: 'percentage',
    format: 'percentage',
    goodThreshold: 65,
    fairThreshold: 75,
    inverse: true,
    icon: BanknotesIcon,
    category: 'debt'
  },
  grm: { 
    label: 'Gross Rent Multiplier', 
    description: 'Purchase Price / Annual Gross Rent',
    type: 'ratio',
    format: 'ratio',
    goodThreshold: 8,
    fairThreshold: 10,
    inverse: true,
    icon: CalculatorIcon,
    category: 'valuation'
  },
  pricePerUnit: { 
    label: 'Price per Unit', 
    description: 'Purchase price per residential unit',
    type: 'currency',
    format: 'currency',
    icon: HomeIcon,
    category: 'valuation'
  },
  egi: { 
    label: 'Effective Gross Income', 
    description: 'Gross income adjusted for vacancy',
    type: 'currency',
    format: 'currency',
    icon: CurrencyDollarIcon,
    category: 'operations'
  },
  
  // Enhanced package metrics
  walt: { 
    label: 'Weighted Average Lease Term', 
    type: 'ratio',
    format: 'ratio',
    icon: ChartPieIcon,
    category: 'advanced'
  },
  simpleWalt: { 
    label: 'Simple WALT', 
    type: 'ratio',
    format: 'ratio',
    icon: ChartPieIcon,
    category: 'advanced'
  },
  salesPerSF: { 
    label: 'Sales per Square Foot', 
    type: 'complex',
    icon: CurrencyDollarIcon,
    category: 'advanced'
  },
  clearHeightAnalysis: { 
    label: 'Clear Height Analysis', 
    type: 'complex',
    icon: CubeIcon,
    category: 'advanced'
  },
  revenuePerUnit: { 
    label: 'Revenue per Unit Analysis', 
    type: 'complex',
    icon: Square3Stack3DIcon,
    category: 'advanced'
  },
  industrialMetrics: { 
    label: 'Industrial Clear Height Analysis', 
    type: 'complex',
    icon: CubeIcon,
    category: 'advanced'
  },
  multifamilyMetrics: { 
    label: 'Multifamily Revenue Analysis', 
    type: 'complex',
    icon: HomeIcon,
    category: 'advanced'
  }
};

// Metric categories for organization
const metricCategories = {
  returns: { label: 'Returns', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-900' },
  debt: { label: 'Debt & Financing', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-900' },
  valuation: { label: 'Valuation', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-900' },
  operations: { label: 'Operations', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-900' },
  advanced: { label: 'Advanced Analysis', color: 'indigo', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-900' }
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

// Safe rendering utilities for complex metrics
const renderComplexObject = (obj: unknown, depth: number = 0): React.ReactNode => {
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
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-l-2 border-gray-200 pl-3"
            >
              <div className="text-xs text-gray-500 mb-1">Item {index + 1}</div>
              {renderComplexObject(item, depth + 1)}
            </motion.div>
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
          {entries.slice(0, 3).map(([key, value], index) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 pb-2 last:border-b-0"
            >
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
            </motion.div>
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
    return <span className="text-red-400">Error rendering data</span>;
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

export default function EnhancedMetricsDisplay({ 
  metrics, 
  flags, 
  propertyData, 
  assessment 
}: EnhancedMetricsDisplayProps): React.ReactElement {
  // Get active metrics from flags
  const activeMetrics = Object.entries(flags)
    .filter(([key, isActive]) => isActive && (key in metricLabels || key in metrics))
    .map(([key]) => key as keyof MetricFlags);

  // Group metrics by category
  const metricsByCategory = activeMetrics.reduce((acc, metricKey) => {
    const info = metricLabels[metricKey];
    if (info && info.category && typeof info.category === 'string') {
      const category = info.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(metricKey);
    }
    return acc;
  }, {} as Record<string, (keyof MetricFlags)[]>);

  const getMetricStatus = (value: number | null | undefined, info: MetricInfo): string => {
    if (value === null || value === undefined || !isValidMetricValue(value)) return 'na';
    
    if (!info.goodThreshold || !info.fairThreshold) return 'neutral';
    
    if (info.inverse) {
      if (value <= info.goodThreshold) return 'good';
      if (value <= info.fairThreshold) return 'fair';
      return 'poor';
    } else {
      if (value >= info.goodThreshold) return 'good';
      if (value >= info.fairThreshold) return 'fair';
      return 'poor';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'good': return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case 'poor': return <ArrowTrendingDownIcon className="h-4 w-4" />;
      default: return <MinusIcon className="h-4 w-4" />;
    }
  };

  if (activeMetrics.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-500 py-8"
      >
        <InformationCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No metrics selected for calculation</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Executive Summary Card */}
      {assessment && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Deal Assessment Summary
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessment.overall} Deal
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {assessment.recommendation}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Active Metrics</p>
              <p className="text-2xl font-bold text-gray-900">
                {assessment.activeMetrics || activeMetrics.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metrics by Category */}
      <AnimatePresence>
        {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => {
          const categoryInfo = metricCategories[category as keyof typeof metricCategories];
          if (!categoryInfo) return null;
          
          // Separate simple and complex metrics
          const simpleMetrics = categoryMetrics.filter(m => metricLabels[m]?.type !== 'complex');
          const complexMetrics = categoryMetrics.filter(m => metricLabels[m]?.type === 'complex');
          
          return (
            <motion.div
              key={category}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className={`px-6 py-3 ${categoryInfo.bgColor} border-b ${categoryInfo.borderColor}`}>
                <h3 className={`text-sm font-semibold ${categoryInfo.textColor}`}>
                  {categoryInfo.label}
                </h3>
              </div>
              
              <div className="p-6">
                {/* Simple Metrics Grid */}
                {simpleMetrics.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {simpleMetrics.map((metricKey, index) => {
                      const value = metrics[metricKey as keyof CalculatedMetrics];
                      const info = metricLabels[metricKey];
                      if (!info || !info.format) return null;
                      
                      const status = getMetricStatus(value as number, info);
                      const Icon = info.icon || ChartBarIcon;
                      
                      return (
                        <motion.div
                          key={metricKey}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${getStatusColor(status)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-5 w-5" />
                                <h4 className="text-sm font-medium">{info.label}</h4>
                              </div>
                              <p className="text-2xl font-bold">
                                {renderMetricValue(value, info.format)}
                              </p>
                              {info.description && (
                                <p className="text-xs mt-1 opacity-75">
                                  {info.description}
                                </p>
                              )}
                            </div>
                            <div className="ml-2">
                              {getTrendIcon(status)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                
                {/* Complex Metrics */}
                {complexMetrics.length > 0 && (
                  <div className="space-y-4">
                    {complexMetrics.map((metricKey, index) => {
                      const value = metrics[metricKey as keyof CalculatedMetrics];
                      const info = metricLabels[metricKey];
                      if (!info || !value) return null;
                      
                      const Icon = info.icon || BeakerIcon;
                      
                      return (
                        <motion.div
                          key={metricKey}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <h4 className="font-medium text-gray-900">{info.label}</h4>
                          </div>
                          <div className="bg-white rounded p-3 border border-gray-100">
                            {renderComplexObject(value)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Asset Analysis Section */}
      {metrics.assetAnalysis && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BeakerIcon className="h-6 w-6" />
            Asset Analysis
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-blue-50 p-4 rounded-lg border border-blue-200"
              >
                <h4 className="font-medium text-blue-800 mb-2">Property Type</h4>
                <p className="text-sm text-blue-700">
                  {typeof metrics.assetAnalysis === 'object' && metrics.assetAnalysis !== null && 'propertyType' in metrics.assetAnalysis 
                    ? String((metrics.assetAnalysis as Record<string, unknown>).propertyType) 
                    : 'Unknown'}
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <h4 className="font-medium text-green-800 mb-2">Available Functions</h4>
                <p className="text-sm text-green-700">
                  {typeof metrics.assetAnalysis === 'object' && metrics.assetAnalysis !== null && 'availableFunctions' in metrics.assetAnalysis && Array.isArray((metrics.assetAnalysis as Record<string, unknown>).availableFunctions)
                    ? `${((metrics.assetAnalysis as Record<string, unknown>).availableFunctions as unknown[]).length} analysis functions`
                    : '0 analysis functions'}
                </p>
              </motion.div>
            </div>
            
            {(() => {
              const hasResults = typeof metrics.assetAnalysis === 'object' && 
                                metrics.assetAnalysis !== null && 
                                'results' in metrics.assetAnalysis && 
                                (metrics.assetAnalysis as Record<string, unknown>).results;
              
              if (!hasResults) return null;
              
              return (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Analysis Results</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {renderComplexObject((metrics.assetAnalysis as Record<string, unknown>).results)}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* Property Details Footer */}
      {propertyData && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 rounded-lg border border-gray-200 p-4"
        >
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {propertyData.propertyType && (
              <div>
                <span className="font-medium">Property Type:</span>{' '}
                <span className="capitalize">{propertyData.propertyType}</span>
              </div>
            )}
            {propertyData.purchasePrice && propertyData.purchasePrice > 0 && (
              <div>
                <span className="font-medium">Purchase Price:</span>{' '}
                {formatMetricValue(propertyData.purchasePrice, 'currency')}
              </div>
            )}
            {propertyData.squareFootage && propertyData.squareFootage > 0 && (
              <div>
                <span className="font-medium">Square Footage:</span>{' '}
                {propertyData.squareFootage.toLocaleString()} SF
              </div>
            )}
            {propertyData.numberOfUnits && propertyData.numberOfUnits > 0 && (
              <div>
                <span className="font-medium">Units:</span>{' '}
                {propertyData.numberOfUnits}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}