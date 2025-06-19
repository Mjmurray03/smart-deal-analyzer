import { PropertyData, MetricFlags } from '@/lib/calculations/types';
import { hasRequiredData } from '@/lib/calculations/metrics';

interface DealInputFormProps {
  data: PropertyData;
  onChange: (data: PropertyData) => void;
  metricFlags: MetricFlags;
  onFlagsChange: (flags: MetricFlags) => void;
}

export default function DealInputForm({
  data,
  onChange,
  metricFlags,
  onFlagsChange,
}: DealInputFormProps) {
  const handleInputChange = (field: keyof PropertyData, value: string) => {
    // Convert to number or undefined (not 0)
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({
      ...data,
      [field]: numValue,
    });
  };

  const handleFlagChange = (metric: keyof MetricFlags) => {
    onFlagsChange({
      ...metricFlags,
      [metric]: !metricFlags[metric],
    });
  };

  // Helper to display input value
  const getInputValue = (value: number | undefined): string => {
    return value !== undefined ? value.toString() : '';
  };

  return (
    <div className="space-y-6">
      {/* Basic Property Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Purchase & Investment</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <input
            type="number"
            value={getInputValue(data.purchasePrice)}
            onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Investment
          </label>
          <input
            type="number"
            value={getInputValue(data.totalInvestment)}
            onChange={(e) => handleInputChange('totalInvestment', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">Down payment + closing costs</p>
        </div>
      </div>

      {/* Income */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Income</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current NOI (Annual)
          </label>
          <input
            type="number"
            value={getInputValue(data.currentNOI)}
            onChange={(e) => handleInputChange('currentNOI', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projected NOI (Year 5)
          </label>
          <input
            type="number"
            value={getInputValue(data.projectedNOI)}
            onChange={(e) => handleInputChange('projectedNOI', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Annual Cash Flow
          </label>
          <input
            type="number"
            value={getInputValue(data.annualCashFlow)}
            onChange={(e) => handleInputChange('annualCashFlow', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">After debt service</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gross Income
          </label>
          <input
            type="number"
            value={getInputValue(data.grossIncome)}
            onChange={(e) => handleInputChange('grossIncome', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>
      </div>

      {/* Expenses */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Expenses</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Operating Expenses
          </label>
          <input
            type="number"
            value={getInputValue(data.operatingExpenses)}
            onChange={(e) => handleInputChange('operatingExpenses', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">Annual total</p>
        </div>
      </div>

      {/* Financing */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Financing</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <input
            type="number"
            value={getInputValue(data.loanAmount)}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={getInputValue(data.interestRate)}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Term (Years)
          </label>
          <input
            type="number"
            value={getInputValue(data.loanTerm)}
            onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0"
          />
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Active Metrics</h3>
        <div className="space-y-2">
          {Object.entries(metricFlags).map(([metric, enabled]) => {
            const key = metric as keyof MetricFlags;
            const hasData = hasRequiredData(key, data);
            const labels: Partial<Record<keyof MetricFlags, string>> = {
              capRate: 'Cap Rate',
              cashOnCash: 'Cash on Cash',
              dscr: 'DSCR',
              irr: 'IRR',
              roi: 'ROI',
              breakeven: 'Breakeven',
              // ... add more as needed ...
            };
            
            return (
              <label key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleFlagChange(key)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {labels[key]}
                  {enabled && !hasData && (
                    <span className="text-red-500 ml-2 text-xs">(needs data)</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}