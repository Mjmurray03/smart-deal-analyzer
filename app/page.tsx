import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Deal Analyzer
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Make informed real estate investment decisions with our comprehensive deal analysis tool. 
          Calculate key metrics, assess deal quality, and get actionable insights to evaluate your 
          investment opportunities.
        </p>

        <Link 
          href="/analyzer"
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Start Analyzing
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Metrics</h3>
            <p className="text-gray-600">
              Calculate cap rate, cash-on-cash return, DSCR, IRR, ROI, and more to evaluate your investment.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Assessment</h3>
            <p className="text-gray-600">
              Get an overall deal rating and detailed recommendations based on industry standards.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple interface with real-time calculations and clear visual indicators of deal quality.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
