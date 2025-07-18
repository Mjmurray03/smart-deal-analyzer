'use client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { ArrowRightIcon, BuildingOfficeIcon, BuildingStorefrontIcon, BuildingOffice2Icon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export default function QuickAnalysisPage() {
  const propertyTypes = [
    {
      id: 'office',
      name: 'Office',
      description: 'Commercial office buildings, flex spaces, and professional buildings',
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      id: 'retail',
      name: 'Retail',
      description: 'Shopping centers, strip malls, and standalone retail properties',
      icon: BuildingStorefrontIcon,
      color: 'green'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      description: 'Warehouses, manufacturing facilities, and distribution centers',
      icon: BuildingOffice2Icon,
      color: 'gray'
    },
    {
      id: 'multifamily',
      name: 'Multifamily',
      description: 'Apartment complexes, condos, and residential rental properties',
      icon: BuildingOfficeIcon,
      color: 'purple'
    },
    {
      id: 'mixed-use',
      name: 'Mixed-Use',
      description: 'Properties combining residential and commercial uses',
      icon: BuildingOfficeIcon,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
      green: 'text-green-600 bg-green-50 hover:bg-green-100',
      gray: 'text-gray-600 bg-gray-50 hover:bg-gray-100',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Quick Analysis', href: '/analyzer/quick' }
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
            href="/analyzer/advanced" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Switch to Advanced Analysis
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quick Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your property type to get started with quick back-of-envelope calculations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {propertyTypes.map((type) => (
            <Link 
              key={type.id}
              href={`/analyzer/quick/${type.id}`}
              className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${getColorClasses(type.color)}`}
            >
              <div className="flex items-center mb-3">
                <type.icon className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold">{type.name}</h3>
              </div>
              <p className="text-gray-700 mb-4">{type.description}</p>
              <div className="flex items-center text-sm font-medium">
                Get started
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/analyzer/advanced"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Need more comprehensive analysis?
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}