import { MetricFlags, CalculatedMetrics } from '@/lib/calculations/types';
import { formatMetricValue } from '@/lib/calculations/metrics';

interface MetricsDisplayProps {
  metrics: CalculatedMetrics;
  flags: MetricFlags;
}

const metricLabels: Partial<Record<keyof MetricFlags, { label: string; type: 'percentage' | 'currency' | 'ratio' }>> = {
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
  egi: { label: 'Effective Gross Income', type: 'currency' }
};

export default function MetricsDisplay({ metrics, flags }: MetricsDisplayProps) {
  const activeMetrics = Object.entries(flags)
    .filter(([_, isActive]) => isActive)
    .map(([metric]) => metric as keyof MetricFlags);

  if (activeMetrics.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No metrics selected for calculation
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activeMetrics.map((metric) => {
        const value = (metrics as any)[metric];
        const labelInfo = metricLabels[metric];
        if (!labelInfo) return null;
        const { label, type } = labelInfo;
        if (!type) return null;
        return (
          <div
            key={metric}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatMetricValue(value, type)}
            </p>
          </div>
        );
      })}
    </div>
  );
} 