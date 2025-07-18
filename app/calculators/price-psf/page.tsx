'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { Card, CardBody } from '@/components/ui/Card';
import InputWithType from '@/components/ui/InputWithType';
import { Button } from '@/components/ui/Button';

export default function PricePSFCalculatorPage() {
  const [price, setPrice] = useState<string>('');
  const [squareFeet, setSquareFeet] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ price?: string; squareFeet?: string }>({});

  const validateInputs = () => {
    const newErrors: { price?: string; squareFeet?: string } = {};
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid positive number for price';
    }
    
    if (!squareFeet || isNaN(Number(squareFeet)) || Number(squareFeet) <= 0) {
      newErrors.squareFeet = 'Please enter a valid positive number for square feet';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePricePSF = () => {
    if (validateInputs()) {
      const priceValue = Number(price);
      const sqftValue = Number(squareFeet);
      const pricePerSF = priceValue / sqftValue;
      setResult(pricePerSF);
    }
  };

  const reset = () => {
    setPrice('');
    setSquareFeet('');
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <CalculatorIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Price Per Square Foot Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the price per square foot of a property
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardBody>
            <div className="space-y-6">
              {/* Price Input */}
              <InputWithType
                id="price"
                inputType="currency"
                label="Total Price"
                value={price}
                onValueChange={(value) => setPrice(String(value))}
                placeholder="Enter total price"
                helper="Total purchase or sale price of the property"
                {...(errors.price && { error: errors.price })}
                showTypeIndicator={true}
                floating
              />

              {/* Square Feet Input */}
              <InputWithType
                id="squareFeet"
                inputType="number"
                label="Total Square Feet"
                value={squareFeet}
                onValueChange={(value) => setSquareFeet(String(value))}
                placeholder="Enter total square feet"
                helper="Total square footage of the property"
                {...(errors.squareFeet && { error: errors.squareFeet })}
                showTypeIndicator={true}
                floating
              />

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculatePricePSF}
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
                <div className="mt-6 p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Result</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatMetricValue(result, 'currency')}/SF
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Price per Square Foot
                  </p>
                  
                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Price:</p>
                        <p className="font-semibold">{formatMetricValue(Number(price), 'currency')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total SF:</p>
                        <p className="font-semibold">{Number(squareFeet).toLocaleString()} SF</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">What is Price per Square Foot?</h4>
              <p className="text-sm text-gray-600">
                Price per square foot (PSF) is a common metric used to compare property values. 
                It&apos;s calculated by dividing the total price by the total square footage of the property.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Formula:</strong> Price PSF = Total Price / Total Square Feet
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}