'use client';

import React, { useState } from 'react';
// Note: Using custom Input and Button components instead of imports

// Create a custom Input component that matches our needs
interface CustomInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const Input: React.FC<CustomInputProps> = ({ type = 'text', value, onChange, placeholder, prefix, suffix, className }) => {
  console.log('Input component check:', { type, value, onChange, placeholder, prefix, suffix, className });
  
  return (
    <div className="relative w-full">
      {prefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''} ${className || ''}`}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  );
};

// Create a custom Button component that matches our needs
interface CustomButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({ onClick, variant = 'primary', size = 'md', className, children }) => {
  console.log('Button component check:', { onClick, variant, size, className, children });
  
  const baseStyles = 'font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
    >
      {children}
    </button>
  );
};

interface CalculatorCardProps {
  title: string;
  description: string;
  inputs: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    prefix?: string;
    suffix?: string;
  }[];
  result: {
    label: string;
    value: string;
    suffix?: string;
  };
  onSaveToAnalysis?: () => void;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  inputs,
  result,
  onSaveToAnalysis
}) => {
  console.log('CalculatorCard render:', { title, description, inputs, result, onSaveToAnalysis });
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow max-w-sm w-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      
      <div className="space-y-3">
        {inputs && inputs.map((input, index) => {
          console.log('Rendering input:', { input, index });
          return (
            <div key={index}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {input.label}
              </label>
              <Input
                type="number"
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                placeholder={input.placeholder}
                prefix={input.prefix}
                suffix={input.suffix}
                className=""
              />
            </div>
          );
        })}
        
        <div className="pt-3 border-t border-gray-100">
          <div className="bg-blue-50 rounded-lg p-3">
            <label className="block text-xs font-medium text-blue-900 mb-1">
              {result.label}
            </label>
            <div className="text-xl font-bold text-blue-600">
              {result.value}{result.suffix}
            </div>
          </div>
        </div>
        
        {onSaveToAnalysis && (
          <Button
            onClick={onSaveToAnalysis}
            variant="outline"
            size="sm"
            className="w-full mt-3"
          >
            Save to Full Analysis
          </Button>
        )}
      </div>
    </div>
  );
};

export const FundamentalCalculators: React.FC = () => {
  // Cap Rate Calculator
  const [capRateNOI, setCapRateNOI] = useState('');
  const [capRatePrice, setCapRatePrice] = useState('');
  
  // Cash-on-Cash Calculator
  const [cashFlow, setCashFlow] = useState('');
  const [cashInvested, setCashInvested] = useState('');
  
  // DSCR Calculator
  const [dscrNOI, setDscrNOI] = useState('');
  const [debtService, setDebtService] = useState('');
  
  // GRM Calculator
  const [grmPrice, setGrmPrice] = useState('');
  const [grossRent, setGrossRent] = useState('');
  
  // Price per Unit/SF Calculator
  const [priceTotal, setPriceTotal] = useState('');
  const [units, setUnits] = useState('');
  
  // LTV Calculator
  const [loanAmount, setLoanAmount] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  
  // Breakeven Occupancy Calculator
  const [opEx, setOpEx] = useState('');
  const [debtSvc, setDebtSvc] = useState('');
  const [grossPotential, setGrossPotential] = useState('');
  
  // Expense Ratio Calculator
  const [expenses, setExpenses] = useState('');
  const [grossIncome, setGrossIncome] = useState('');
  
  // Rent PSF Calculator
  const [rent, setRent] = useState('');
  const [sqft, setSqft] = useState('');
  
  // ROI Calculator
  const [netProfit, setNetProfit] = useState('');
  const [totalInvestment, setTotalInvestment] = useState('');

  // Calculation functions
  const calculateCapRate = () => {
    const noi = parseFloat(capRateNOI);
    const price = parseFloat(capRatePrice);
    if (noi && price) {
      return ((noi / price) * 100).toFixed(2);
    }
    return '0.00';
  };

  const calculateCashOnCash = () => {
    const flow = parseFloat(cashFlow);
    const invested = parseFloat(cashInvested);
    if (flow && invested) {
      return ((flow / invested) * 100).toFixed(2);
    }
    return '0.00';
  };

  const calculateDSCR = () => {
    const noi = parseFloat(dscrNOI);
    const debt = parseFloat(debtService);
    if (noi && debt) {
      return (noi / debt).toFixed(2);
    }
    return '0.00';
  };

  const calculateGRM = () => {
    const price = parseFloat(grmPrice);
    const rent = parseFloat(grossRent);
    if (price && rent) {
      return (price / rent).toFixed(1);
    }
    return '0.0';
  };

  const calculatePricePerUnit = () => {
    const price = parseFloat(priceTotal);
    const unitCount = parseFloat(units);
    if (price && unitCount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(price / unitCount);
    }
    return '$0';
  };

  const calculateLTV = () => {
    const loan = parseFloat(loanAmount);
    const value = parseFloat(propertyValue);
    if (loan && value) {
      return ((loan / value) * 100).toFixed(1);
    }
    return '0.0';
  };

  const calculateBreakeven = () => {
    const expenses = parseFloat(opEx);
    const debt = parseFloat(debtSvc);
    const potential = parseFloat(grossPotential);
    if (expenses && debt && potential) {
      return (((expenses + debt) / potential) * 100).toFixed(1);
    }
    return '0.0';
  };

  const calculateExpenseRatio = () => {
    const exp = parseFloat(expenses);
    const income = parseFloat(grossIncome);
    if (exp && income) {
      return ((exp / income) * 100).toFixed(1);
    }
    return '0.0';
  };

  const calculateRentPSF = () => {
    const rentAmount = parseFloat(rent);
    const footage = parseFloat(sqft);
    if (rentAmount && footage) {
      return (rentAmount / footage).toFixed(2);
    }
    return '0.00';
  };

  const calculateROI = () => {
    const profit = parseFloat(netProfit);
    const investment = parseFloat(totalInvestment);
    if (profit && investment) {
      return ((profit / investment) * 100).toFixed(2);
    }
    return '0.00';
  };

  const calculators = [
    {
      title: 'Cap Rate Calculator',
      description: 'Calculate capitalization rate',
      inputs: [
        {
          label: 'Net Operating Income (NOI)',
          value: capRateNOI,
          onChange: setCapRateNOI,
          placeholder: '100000',
          prefix: '$'
        },
        {
          label: 'Purchase Price',
          value: capRatePrice,
          onChange: setCapRatePrice,
          placeholder: '1000000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Cap Rate',
        value: calculateCapRate(),
        suffix: '%'
      }
    },
    {
      title: 'Cash-on-Cash Calculator',
      description: 'Calculate cash-on-cash return',
      inputs: [
        {
          label: 'Annual Cash Flow',
          value: cashFlow,
          onChange: setCashFlow,
          placeholder: '25000',
          prefix: '$'
        },
        {
          label: 'Cash Invested',
          value: cashInvested,
          onChange: setCashInvested,
          placeholder: '250000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Cash-on-Cash Return',
        value: calculateCashOnCash(),
        suffix: '%'
      }
    },
    {
      title: 'DSCR Calculator',
      description: 'Calculate debt service coverage ratio',
      inputs: [
        {
          label: 'Net Operating Income',
          value: dscrNOI,
          onChange: setDscrNOI,
          placeholder: '100000',
          prefix: '$'
        },
        {
          label: 'Annual Debt Service',
          value: debtService,
          onChange: setDebtService,
          placeholder: '75000',
          prefix: '$'
        }
      ],
      result: {
        label: 'DSCR',
        value: calculateDSCR(),
        suffix: 'x'
      }
    },
    {
      title: 'GRM Calculator',
      description: 'Calculate gross rent multiplier',
      inputs: [
        {
          label: 'Purchase Price',
          value: grmPrice,
          onChange: setGrmPrice,
          placeholder: '1000000',
          prefix: '$'
        },
        {
          label: 'Gross Annual Rent',
          value: grossRent,
          onChange: setGrossRent,
          placeholder: '120000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Gross Rent Multiplier',
        value: calculateGRM(),
        suffix: ''
      }
    },
    {
      title: 'Price per Unit/SF',
      description: 'Calculate price per unit or square foot',
      inputs: [
        {
          label: 'Purchase Price',
          value: priceTotal,
          onChange: setPriceTotal,
          placeholder: '1000000',
          prefix: '$'
        },
        {
          label: 'Units or Square Feet',
          value: units,
          onChange: setUnits,
          placeholder: '20'
        }
      ],
      result: {
        label: 'Price per Unit/SF',
        value: calculatePricePerUnit(),
        suffix: ''
      }
    },
    {
      title: 'LTV Calculator',
      description: 'Calculate loan-to-value ratio',
      inputs: [
        {
          label: 'Loan Amount',
          value: loanAmount,
          onChange: setLoanAmount,
          placeholder: '750000',
          prefix: '$'
        },
        {
          label: 'Property Value',
          value: propertyValue,
          onChange: setPropertyValue,
          placeholder: '1000000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Loan-to-Value',
        value: calculateLTV(),
        suffix: '%'
      }
    },
    {
      title: 'Breakeven Occupancy',
      description: 'Calculate breakeven occupancy percentage',
      inputs: [
        {
          label: 'Operating Expenses',
          value: opEx,
          onChange: setOpEx,
          placeholder: '50000',
          prefix: '$'
        },
        {
          label: 'Annual Debt Service',
          value: debtSvc,
          onChange: setDebtSvc,
          placeholder: '75000',
          prefix: '$'
        },
        {
          label: 'Gross Potential Rent',
          value: grossPotential,
          onChange: setGrossPotential,
          placeholder: '150000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Breakeven Occupancy',
        value: calculateBreakeven(),
        suffix: '%'
      }
    },
    {
      title: 'Expense Ratio',
      description: 'Calculate operating expense ratio',
      inputs: [
        {
          label: 'Operating Expenses',
          value: expenses,
          onChange: setExpenses,
          placeholder: '50000',
          prefix: '$'
        },
        {
          label: 'Gross Income',
          value: grossIncome,
          onChange: setGrossIncome,
          placeholder: '150000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Expense Ratio',
        value: calculateExpenseRatio(),
        suffix: '%'
      }
    },
    {
      title: 'Rent PSF Calculator',
      description: 'Calculate rent per square foot',
      inputs: [
        {
          label: 'Annual Rent',
          value: rent,
          onChange: setRent,
          placeholder: '120000',
          prefix: '$'
        },
        {
          label: 'Square Footage',
          value: sqft,
          onChange: setSqft,
          placeholder: '10000'
        }
      ],
      result: {
        label: 'Rent per SF',
        value: calculateRentPSF(),
        suffix: '/SF'
      }
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate return on investment',
      inputs: [
        {
          label: 'Net Profit',
          value: netProfit,
          onChange: setNetProfit,
          placeholder: '25000',
          prefix: '$'
        },
        {
          label: 'Total Investment',
          value: totalInvestment,
          onChange: setTotalInvestment,
          placeholder: '250000',
          prefix: '$'
        }
      ],
      result: {
        label: 'Return on Investment',
        value: calculateROI(),
        suffix: '%'
      }
    }
  ];

  console.log('FundamentalCalculators render:', { calculators });
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Instant CRE Calculators</h2>
        <p className="text-sm md:text-base text-gray-600">Get instant results with 2-3 inputs. No navigation required.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
        {calculators && calculators.map((calculator, index) => {
          console.log('Rendering calculator:', { calculator, index });
          return (
            <CalculatorCard
              key={index}
              title={calculator.title}
              description={calculator.description}
              inputs={calculator.inputs}
              result={calculator.result}
              onSaveToAnalysis={() => {
                // Future implementation: save to full analysis
                console.log(`Saving ${calculator.title} to full analysis`);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};