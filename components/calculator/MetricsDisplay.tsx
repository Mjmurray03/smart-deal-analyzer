import { motion } from 'framer-motion';
import { CalculatedMetrics, MetricFlags } from '@/lib/calculations/types';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/solid';

interface MetricsDisplayProps {
  metrics: CalculatedMetrics;
  flags: MetricFlags;
}

interface MetricInfo {
  label: string;
  description: string;
  format: 'percentage' | 'currency' | 'ratio';
  goodThreshold?: number;
  fairThreshold?: number;
  inverse?: boolean;
  icon?: string;
}

const metricInfo: Record<keyof CalculatedMetrics, MetricInfo> = {
  capRate: {
    label: 'Cap Rate',
    description: 'Net Operating Income / Purchase Price',
    format: 'percentage',
    goodThreshold: 8,
    fairThreshold: 6,
    icon: '📊'
  },
  cashOnCash: {
    label: 'Cash on Cash Return',
    description: 'Annual Cash Flow / Total Investment',
    format: 'percentage',
    goodThreshold: 8,
    fairThreshold: 6,
    icon: '💰'
  },
  dscr: {
    label: 'Debt Service Coverage',
    description: 'NOI / Annual Debt Service',
    format: 'ratio',
    goodThreshold: 1.25,
    fairThreshold: 1.1,
    icon: '🛡️'
  },
  irr: {
    label: 'Internal Rate of Return',
    description: 'Annualized return including appreciation',
    format: 'percentage',
    goodThreshold: 12,
    fairThreshold: 8,
    icon: '📈'
  },
  roi: {
    label: 'Return on Investment',
    description: 'Total return on invested capital',
    format: 'percentage',
    goodThreshold: 12,
    fairThreshold: 8,
    icon: '🎯'
  },
  breakeven: {
    label: 'Breakeven Occupancy',
    description: 'Required occupancy to cover expenses',
    format: 'percentage',
    goodThreshold: 85,
    fairThreshold: 90,
    inverse: true,
    icon: '🏢'
  },
  pricePerSF: {
    label: 'Price per Square Foot',
    description: 'Property value per square foot',
    format: 'currency',
    goodThreshold: 200,
    fairThreshold: 300,
    icon: '📏'
  },
  ltv: {
    label: 'Loan to Value',
    description: 'Loan amount relative to property value',
    format: 'percentage',
    goodThreshold: 65,
    fairThreshold: 75,
    inverse: true,
    icon: '🏦'
  },
  grm: {
    label: 'Gross Rent Multiplier',
    description: 'Property price to gross rental income ratio',
    format: 'ratio',
    goodThreshold: 8,
    fairThreshold: 10,
    inverse: true,
    icon: '📊'
  },
  pricePerUnit: {
    label: 'Price per Unit',
    description: 'Property value per residential unit',
    format: 'currency',
    goodThreshold: 150000,
    fairThreshold: 200000,
    icon: '🏠'
  },
  egi: {
    label: 'Effective Gross Income',
    description: 'Gross income adjusted for vacancy and collection losses',
    format: 'currency',
    goodThreshold: 0,
    fairThreshold: 0,
    icon: '💵'
  }
};

export default function MetricsDisplay({ metrics, flags }: MetricsDisplayProps) {
  const getMetricStatus = (value: number | null | undefined, info: MetricInfo) => {
    if (value === null || value === undefined) return 'na';
    
    if (info.inverse) {
      if (value <= info.goodThreshold!) return 'good';
      if (value <= info.fairThreshold!) return 'fair';
      return 'poor';
    } else {
      if (value >= info.goodThreshold!) return 'good';
      if (value >= info.fairThreshold!) return 'fair';
      return 'poor';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-700',
          valueBg: 'bg-green-100',
          valueText: 'text-green-800',
          icon: ArrowTrendingUpIcon,
          iconColor: 'text-green-600'
        };
      case 'fair':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          valueBg: 'bg-yellow-100',
          valueText: 'text-yellow-800',
          icon: MinusIcon,
          iconColor: 'text-yellow-600'
        };
      case 'poor':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-50',
          border: 'border-red-200',
          text: 'text-red-700',
          valueBg: 'bg-red-100',
          valueText: 'text-red-800',
          icon: ArrowTrendingDownIcon,
          iconColor: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-500',
          valueBg: 'bg-gray-100',
          valueText: 'text-gray-500',
          icon: MinusIcon,
          iconColor: 'text-gray-400'
        };
    }
  };

  const renderMetric = (key: keyof CalculatedMetrics, index: number) => {
    if (!flags[key as keyof MetricFlags]) return null;
    
    const info = metricInfo[key];
    const value = metrics[key];
    const status = getMetricStatus(value, info);
    const styles = getStatusStyles(status);
    const formattedValue = formatMetricValue(value, info.format);
    const StatusIcon = styles.icon;

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className={`
          relative overflow-hidden rounded-xl border-2 p-6
          transition-all duration-300 hover:shadow-lg
          ${styles.bg} ${styles.border}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-5">
          <div className="text-8xl">{info.icon}</div>
        </div>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{info.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{info.description}</p>
          </div>
          <StatusIcon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
        
        {/* Value */}
        <div className={`
          inline-flex items-baseline px-4 py-2 rounded-lg
          ${styles.valueBg}
        `}>
          <span className={`text-3xl font-bold ${styles.valueText}`}>
            {formattedValue}
          </span>
        </div>
        
        {/* Thresholds Guide */}
        {value !== null && value !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-600">
                    Good: {info.inverse ? '≤' : '≥'} {info.goodThreshold}{info.format === 'percentage' ? '%' : ''}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <span className="text-gray-600">
                    Fair: {info.inverse 
                      ? `${info.goodThreshold}-${info.fairThreshold}` 
                      : `${info.fairThreshold}-${info.goodThreshold}`
                    }{info.format === 'percentage' ? '%' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Count active metrics
  const activeMetrics = Object.keys(flags).filter(key => flags[key as keyof MetricFlags]).length;

  if (activeMetrics === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500">No metrics selected. Enable metrics in the form to see calculations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(Object.keys(metricInfo) as Array<keyof CalculatedMetrics>).map((key, index) => 
        renderMetric(key, index)
      )}
    </div>
  );
}