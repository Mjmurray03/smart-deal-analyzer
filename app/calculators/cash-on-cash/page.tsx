'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { formatMetricValue } from '@/lib/calculations/metrics';
import { Card, CardBody } from '@/components/ui/Card';
import InputWithType from '@/components/ui/InputWithType';
import { Button } from '@/components/ui/Button';

export default function CashOnCashCalculatorPage() {
  const [annualCashFlow, setAnnualCashFlow] = useState<string>('');
  const [cashInvested, setCashInvested] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ annualCashFlow?: string; cashInvested?: string }>({});

  const validateInputs = () => {
    const newErrors: { annualCashFlow?: string; cashInvested?: string } = {};
    
    if (!annualCashFlow || isNaN(Number(annualCashFlow))) {
      newErrors.annualCashFlow = 'Please enter a valid number for annual cash flow';
    }
    
    if (!cashInvested || isNaN(Number(cashInvested)) || Number(cashInvested) <= 0) {
      newErrors.cashInvested = 'Please enter a valid positive number for cash invested';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCashOnCash = () => {
    if (validateInputs()) {
      const cashFlowValue = Number(annualCashFlow);
      const investedValue = Number(cashInvested);
      const cashOnCashReturn = (cashFlowValue / investedValue) * 100;
      setResult(cashOnCashReturn);
    }
  };

  const reset = () => {
    setAnnualCashFlow('');
    setCashInvested('');
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CalculatorIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cash-on-Cash Return Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the cash-on-cash return for your investment
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardBody>
            <div className="space-y-6">
              {/* Annual Cash Flow Input */}
              <InputWithType
                id="annualCashFlow"
                inputType="currency"
                label="Annual Pre-Tax Cash Flow"
                value={annualCashFlow}
                onValueChange={(value) => setAnnualCashFlow(String(value))}
                placeholder="Enter annual cash flow"
                helper="NOI minus debt service"
                {...(errors.annualCashFlow && { error: errors.annualCashFlow })}
                showTypeIndicator={true}
                floating
              />

              {/* Cash Invested Input */}
              <InputWithType
                id="cashInvested"
                inputType="currency"
                label="Total Cash Invested"
                value={cashInvested}
                onValueChange={(value) => setCashInvested(String(value))}
                placeholder="Enter total cash invested"
                helper="Down payment + closing costs + initial repairs"
                {...(errors.cashInvested && { error: errors.cashInvested })}
                showTypeIndicator={true}
                floating
              />

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculateCashOnCash}
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
                <div className="mt-6 p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Result</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {formatMetricValue(result, 'percentage')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Cash-on-Cash Return
                  </p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">What is Cash-on-Cash Return?</h4>
              <p className="text-sm text-gray-600">
                Cash-on-cash return measures the annual pre-tax cash flow earned on the actual cash invested. 
                It&apos;s a quick way to evaluate the cash income on a property relative to the cash invested.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Formula:</strong> Cash-on-Cash = (Annual Cash Flow / Total Cash Invested) × 100
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}