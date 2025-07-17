import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { Card, CardBody } from '@/components/ui/Card';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon?: ReactNode;
  iconColor?: string;
  children: ReactNode;
  infoSection?: {
    title: string;
    content: ReactNode;
  };
}

export default function CalculatorLayout({
  title,
  description,
  icon,
  iconColor = 'blue',
  children,
  infoSection
}: CalculatorLayoutProps) {
  const getIconColorClasses = () => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[iconColor as keyof typeof colors] || colors.blue;
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
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getIconColorClasses()}`}>
            {icon || <CalculatorIcon className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-lg text-gray-600">
            {description}
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardBody>
            {children}

            {/* Info Section */}
            {infoSection && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{infoSection.title}</h4>
                <div className="text-sm text-gray-600">
                  {infoSection.content}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}