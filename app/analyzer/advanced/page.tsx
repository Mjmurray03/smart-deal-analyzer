'use client';
import Link from 'next/link';
import { ArrowRightIcon, BuildingOfficeIcon, BuildingStorefrontIcon, BuildingOffice2Icon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export default function AdvancedAnalysisPage() {
  console.log('🎯 ADVANCED PATH: Advanced Analysis property selection page mounted');
  console.log('🎯 ADVANCED PATH: Analysis level = ADVANCED');
  
  const propertyTypes = [
    {
      id: 'office',
      name: 'Office',
      description: 'Comprehensive office analysis with tenant creditworthiness, lease economics, and market positioning',
      features: ['WALT Analysis', 'Tenant Credit Scoring', 'Lease Economics', 'Market Positioning'],
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      id: 'retail',
      name: 'Retail',
      description: 'Advanced retail analytics with sales performance, co-tenancy analysis, and trade area studies',
      features: ['Sales Analytics', 'Co-Tenancy Risk', 'Trade Area Analysis', 'Anchor Dependency'],
      icon: BuildingStorefrontIcon,
      color: 'green'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      description: 'Sophisticated industrial metrics including building functionality and logistics optimization',
      features: ['Building Functionality', 'Logistics Scoring', 'Clear Height Analysis', 'Location Intelligence'],
      icon: BuildingOffice2Icon,
      color: 'gray'
    },
    {
      id: 'multifamily',
      name: 'Multifamily',
      description: 'Complete multifamily analysis with revenue optimization and value-add potential',
      features: ['Revenue Optimization', 'Market Positioning', 'Value-Add Analysis', 'Resident Analytics'],
      icon: BuildingOfficeIcon,
      color: 'purple'
    },
    {
      id: 'mixed-use',
      name: 'Mixed-Use',
      description: 'Complex mixed-use analysis with component synergies and integrated performance metrics',
      features: ['Component Analysis', 'Synergy Metrics', 'Operational Integration', 'Development Potential'],
      icon: ChartBarIcon,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-300 bg-blue-50',
      green: 'border-green-200 hover:border-green-300 bg-green-50',
      gray: 'border-gray-200 hover:border-gray-300 bg-gray-50',
      purple: 'border-purple-200 hover:border-purple-300 bg-purple-50',
      indigo: 'border-indigo-200 hover:border-indigo-300 bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      gray: 'text-gray-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Advanced Analysis', href: '/analyzer/advanced' }
          ]} 
        />
        
        {/* Quick Access Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Instant Calculators
          </Link>
          <Link 
            href="/analyzer/quick" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Switch to Quick Analysis
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your property type for comprehensive institutional-grade analysis with sophisticated metrics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {propertyTypes.map((type) => (
            <div key={type.id} className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${getColorClasses(type.color)}`}>
              <div className="flex items-center mb-4">
                <type.icon className={`h-10 w-10 mr-4 ${getIconColor(type.color)}`} />
                <h3 className="text-2xl font-semibold text-gray-900">{type.name}</h3>
              </div>
              
              <p className="text-gray-700 mb-6">{type.description}</p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Advanced Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {type.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <Link 
                href={`/analyzer/advanced/${type.id}`}
                className="inline-flex items-center w-full justify-center px-6 py-3 text-lg font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                onClick={() => {
                  console.log(`🎯 ADVANCED PATH: User selected property type: ${type.id}`);
                  console.log(`🎯 ADVANCED PATH: Navigating to /analyzer/advanced/${type.id}`);
                }}
              >
                Start {type.name} Analysis
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/analyzer/quick"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Need a simpler quick analysis instead?
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}