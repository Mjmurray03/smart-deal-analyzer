'use client'

// External imports
import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, BuildingOfficeIcon, HomeIcon, BuildingStorefrontIcon, TruckIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

// Internal imports - Components
import { FundamentalCalculators } from '../components/calculators/FundamentalCalculators';

export default function Home() {
  console.log('🏠 LANDING PAGE: Component mounted');
  console.log('🏠 LANDING PAGE: Rendering 3-tier access system');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* TIER 1 - INSTANT CALCULATORS (50% viewport) */}
      <section className="min-h-[50vh] bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Instant CRE Calculators
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-2">
              No Sign Up • No Forms • Get Results in 5 Seconds
            </p>
            <p className="text-sm md:text-base text-blue-200">
              Just type two numbers and get your Cap Rate instantly
            </p>
          </div>
          
          {/* Instant Calculators */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl overflow-hidden">
            <FundamentalCalculators />
          </div>
        </div>
      </section>

      {/* TIER 2 - QUICK ANALYSIS (30% viewport) */}
      <section className="min-h-[30vh] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Property Analysis
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Complete analysis in 2-5 minutes
            </p>
            <p className="text-lg text-gray-500">
              Property-specific packages with 4 essential calculations each
            </p>
          </div>

          {/* Property Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            <Link 
              href="/analyzer/quick?type=office"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Office</h3>
              <p className="text-xs text-gray-600">Cap Rate, WALT, Lease Analysis</p>
            </Link>

            <Link 
              href="/analyzer/quick?type=retail"
              className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <BuildingStorefrontIcon className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Retail</h3>
              <p className="text-xs text-gray-600">Sales PSF, Tenant Mix, Traffic</p>
            </Link>

            <Link 
              href="/analyzer/quick?type=industrial"
              className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <TruckIcon className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Industrial</h3>
              <p className="text-xs text-gray-600">Clear Height, Dock Doors, Cubic Ft</p>
            </Link>

            <Link 
              href="/analyzer/quick?type=multifamily"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <HomeIcon className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Multifamily</h3>
              <p className="text-xs text-gray-600">Price/Unit, GRM, Revenue PSF</p>
            </Link>

            <Link 
              href="/analyzer/quick?type=mixed-use"
              className="group bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <BuildingLibraryIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Mixed-Use</h3>
              <p className="text-xs text-gray-600">Component Mix, Blended Returns</p>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Perfect for brokers, quick deal screening, and initial underwriting</p>
            <Link 
              href="/analyzer/quick"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Quick Analysis
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TIER 3 - ADVANCED ANALYSIS (20% viewport) */}
      <section className="min-h-[20vh] bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Institutional-Grade Analysis
            </h2>
            <p className="text-lg text-gray-600 mb-1">
              For Investment Committees & Detailed Underwriting
            </p>
            <p className="text-gray-500">
              28 advanced packages with sophisticated metrics and tenant analytics
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2 text-sm">•</span>
                    <span className="text-gray-700 text-sm">Tenant credit & financial health analysis</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2 text-sm">•</span>
                    <span className="text-gray-700 text-sm">Market positioning & competitive analysis</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2 text-sm">•</span>
                    <span className="text-gray-700 text-sm">Value-add & redevelopment scenarios</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2 text-sm">•</span>
                    <span className="text-gray-700 text-sm">Portfolio-level risk analysis</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <p className="text-gray-600 mb-6 text-sm">
                  Comprehensive analysis for institutional investors, asset managers, and detailed investment committee presentations.
                </p>
                <Link 
                  href="/analyzer/advanced"
                  className="inline-flex items-center justify-center px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Start Advanced Analysis
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-4">
              <span>For Brokers: Quick deal screening</span>
              <span>For Investors: Data-driven decisions</span>
              <span>For Asset Managers: Portfolio optimization</span>
            </div>
            <Link 
              href="/debug"
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              System Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}