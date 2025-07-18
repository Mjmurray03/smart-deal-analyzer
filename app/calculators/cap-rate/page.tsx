'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { Card, CardBody } from '@/components/ui/Card';
import InputWithType from '@/components/ui/InputWithType';
import { Button } from '@/components/ui/Button';

export default function CapRateCalculatorPage() {
  const [noi, setNoi] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ noi?: string; purchasePrice?: string }>({});

  const validateInputs = () => {
    const newErrors: { noi?: string; purchasePrice?: string } = {};
    
    if (!noi || isNaN(Number(noi)) || Number(noi) <= 0) {
      newErrors.noi = 'Please enter a valid positive number for NOI';
    }
    
    if (!purchasePrice || isNaN(Number(purchasePrice)) || Number(purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Please enter a valid positive number for purchase price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCapRate = () => {
    if (validateInputs()) {
      const noiValue = Number(noi);
      const priceValue = Number(purchasePrice);
      const capRate = (noiValue / priceValue) * 100;
      setResult(capRate);
    }
  };

  const reset = () => {
    setNoi('');
    setPurchasePrice('');
    setResult(null);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CalculatorIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cap Rate Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the capitalization rate for your property investment
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardBody>
            <div className="space-y-6">
              {/* NOI Input */}
              <InputWithType
                id="noi"
                inputType="currency"
                label="Net Operating Income (NOI)"
                value={noi}
                onValueChange={(value) => setNoi(String(value))}
                placeholder="Enter annual NOI"
                helper="Enter the annual net operating income for the property"
                {...(errors.noi && { error: errors.noi })}
                showTypeIndicator={true}
                floating
              />

              {/* Purchase Price Input */}
              <InputWithType
                id="purchasePrice"
                inputType="currency"
                label="Purchase Price"
                value={purchasePrice}
                onValueChange={(value) => setPurchasePrice(String(value))}
                placeholder="Enter purchase price"
                helper="Enter the total purchase price of the property"
                {...(errors.purchasePrice && { error: errors.purchasePrice })}
                showTypeIndicator={true}
                floating
              />

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculateCapRate}
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
                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Result</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatMetricValue(result, 'percentage')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Capitalization Rate
                  </p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">What is Cap Rate?</h4>
              <p className="text-sm text-gray-600">
                The capitalization rate (cap rate) is the ratio of Net Operating Income (NOI) to property asset value. 
                It represents the expected rate of return on a real estate investment property.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Formula:</strong> Cap Rate = (NOI / Purchase Price) × 100
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}