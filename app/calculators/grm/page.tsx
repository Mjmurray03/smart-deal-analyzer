'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function GRMCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [annualRent, setAnnualRent] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ purchasePrice?: string; monthlyRent?: string }>({});

  const validateInputs = () => {
    const newErrors: { purchasePrice?: string; monthlyRent?: string } = {};
    
    if (!purchasePrice || isNaN(Number(purchasePrice)) || Number(purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Please enter a valid positive number for purchase price';
    }
    
    if (!monthlyRent || isNaN(Number(monthlyRent)) || Number(monthlyRent) <= 0) {
      newErrors.monthlyRent = 'Please enter a valid positive number for monthly rent';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateGRM = () => {
    if (validateInputs()) {
      const priceValue = Number(purchasePrice);
      const monthlyRentValue = Number(monthlyRent);
      const annualRentValue = monthlyRentValue * 12;
      const grm = priceValue / annualRentValue;
      setResult(grm);
      setAnnualRent(annualRentValue);
    }
  };

  const reset = () => {
    setPurchasePrice('');
    setMonthlyRent('');
    setResult(null);
    setAnnualRent(null);
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Calculators
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <CalculatorIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gross Rent Multiplier Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the GRM to evaluate rental property investments
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardBody>
            <div className="space-y-6">
              {/* Purchase Price Input */}
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="Enter purchase price"
                    className="pl-8"
                    {...(errors.purchasePrice && { error: errors.purchasePrice })}
                  />
                </div>
                {errors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>
                )}
              </div>

              {/* Monthly Rent Input */}
              <div>
                <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Monthly Rent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="Enter total monthly rent"
                    className="pl-8"
                    {...(errors.monthlyRent && { error: errors.monthlyRent })}
                  />
                </div>
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Combined rent from all units
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculateGRM}
                  className="flex-1"
                >
                  Calculate
                </Button>
                <Button
                  onClick={reset}
                  variant="secondary"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>

              {/* Result */}
              {result !== null && (
                <div className="mt-6 p-6 bg-orange-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Result</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatMetricValue(result, 'ratio')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Gross Rent Multiplier
                  </p>
                  
                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Annual Rent:</p>
                        <p className="font-semibold">{formatMetricValue(annualRent || 0, 'currency')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Years to Pay Off:</p>
                        <p className="font-semibold">{result.toFixed(1)} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">What is Gross Rent Multiplier?</h4>
              <p className="text-sm text-gray-600">
                The Gross Rent Multiplier (GRM) is a simple metric that compares a property\'s price to its gross rental income. 
                Lower GRM values generally indicate better investment opportunities.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Formula:</strong> GRM = Purchase Price / Annual Gross Rent
              </p>
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-semibold mb-1">Typical GRM Ranges:</p>
                <ul className="space-y-1">
                  <li>• 4-7: Excellent investment opportunity</li>
                  <li>• 8-10: Average market conditions</li>
                  <li>• 11-15: Premium properties or hot markets</li>
                  <li>• 15+: May indicate overpricing</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}