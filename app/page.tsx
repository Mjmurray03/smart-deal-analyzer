'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Calculator, 
  Zap, 
  Check, 
  TrendingUp, 
  Shield, 
  Award,
  Clock,
  Building,
  Home as HomeIcon,
  Store,
  Truck,
  Building2,
  DollarSign,
  Percent,
  BarChart3,
  PieChart
} from 'lucide-react';

// Import our premium components
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Stat } from '../components/ui/Stat';
import Header from '../components/navigation/Header';

export default function Home() {
  const router = useRouter();

  // Data for instant calculators
  const instantCalculators = [
    {
      name: 'Cap Rate',
      description: 'Quick property yield calculation',
      icon: Percent,
      path: '/calculators/cap-rate'
    },
    {
      name: 'Cash-on-Cash',
      description: 'Return on invested capital',
      icon: DollarSign,
      path: '/calculators/cash-on-cash'
    },
    {
      name: 'Price per SF',
      description: 'Property value per square foot',
      icon: BarChart3,
      path: '/calculators/price-psf'
    },
    {
      name: 'GRM Calculator',
      description: 'Gross rent multiplier analysis',
      icon: PieChart,
      path: '/calculators/grm'
    }
  ];

  // Data for property types
  const propertyTypes = [
    {
      name: 'Office',
      description: 'Class A/B/C office buildings',
      icon: Building,
      keyMetrics: ['WALT', 'Occupancy', 'Rent Roll', 'TI Allowances'],
      path: '/analyzer/quick/office'
    },
    {
      name: 'Retail',
      description: 'Strip centers to regional malls',
      icon: Store,
      keyMetrics: ['Sales PSF', 'Tenant Mix', 'Percentage Rent', 'CAM Recovery'],
      path: '/analyzer/quick/retail'
    },
    {
      name: 'Industrial',
      description: 'Warehouses and distribution',
      icon: Truck,
      keyMetrics: ['Clear Height', 'Dock Doors', 'Ceiling Load', 'Truck Courts'],
      path: '/analyzer/quick/industrial'
    },
    {
      name: 'Multifamily',
      description: 'Apartments and condominiums',
      icon: HomeIcon,
      keyMetrics: ['Price/Unit', 'GRM', 'Revenue PSF', 'Expense Ratio'],
      path: '/analyzer/quick/multifamily'
    },
    {
      name: 'Mixed-Use',
      description: 'Multi-component properties',
      icon: Building2,
      keyMetrics: ['Component Mix', 'Blended Returns', 'Cross-Subsidization'],
      path: '/analyzer/quick/mixed-use'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Transparent header for hero section */}
      <Header transparent />
      
      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        
        {/* Animated gradient orbs for visual interest */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-float-delayed" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              Professional CRE Analysis Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Institutional-Grade Analysis
              <span className="block text-primary-300">Accessible to All</span>
            </h1>
            
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
              The same advanced metrics and methodologies used by leading CRE firms, 
              now available through an elegant, modern interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                gradient 
                pulse
                rightIcon={ArrowRight}
                onClick={() => router.push('/analyzer/quick')}
              >
                Start Analyzing Now
              </Button>
              <Button 
                size="xl" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                leftIcon={Calculator}
                onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try Quick Calculators
              </Button>
            </div>
            
            {/* Value props - understated */}
            <div className="mt-12 flex items-center justify-center gap-8 text-primary-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">Institutional Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Rapid Analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live calculator preview placeholder */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-6 mb-[-50px]">
          <Card variant="glass" className="backdrop-blur-xl">
            <CardBody className="p-8 text-center">
              <div className="bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg p-8">
                <Calculator className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-primary-800 font-medium">Live calculator preview coming soon</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* QUICK START SECTION */}
      <section className="py-24 pt-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Analysis Path
            </h2>
            <p className="text-xl text-gray-600">
              Quick calculations or comprehensive analysis - you decide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Quick Analysis Path */}
            <Card 
              variant="elevated" 
              hover 
              interactive
              onClick={() => router.push('/analyzer/quick')}
            >
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quick Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Get key metrics in 2-5 minutes. Perfect for initial property screening 
                  and back-of-envelope calculations.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Cap Rate & Cash-on-Cash
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Basic Financial Metrics
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    PDF Report Export
                  </li>
                </ul>
                <Button fullWidth size="lg" variant="primary">
                  Start Quick Analysis
                </Button>
              </CardBody>
            </Card>
            
            {/* Advanced Analysis Path */}
            <Card 
              variant="elevated" 
              hover 
              interactive
              onClick={() => router.push('/analyzer/advanced')}
            >
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Advanced Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Institutional-grade analysis with specialized metrics for serious 
                  investment decisions.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    200+ Advanced Metrics
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    WALT, Tenant Analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Sensitivity Analysis
                  </li>
                </ul>
                <Button fullWidth size="lg" variant="success">
                  Start Advanced Analysis
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* INSTANT CALCULATORS GRID */}
      <section id="calculators" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">
              No Setup Required
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Instant CRE Calculators
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools ready to use - just input your numbers and go
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instantCalculators.map((calc, index) => (
              <Card 
                key={calc.name}
                variant="bordered" 
                hover 
                interactive
                className="group motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(calc.path)}
              >
                <CardBody className="p-6">
                  <calc.icon className="w-10 h-10 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">{calc.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{calc.description}</p>
                  <Button variant="ghost" size="sm" fullWidth rightIcon={ArrowRight}>
                    Calculate
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY TYPE SHOWCASE */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Specialized for Every Property Type
            </h2>
            <p className="text-xl text-gray-600">
              Tailored metrics and analysis for your specific asset class
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {propertyTypes.map((type) => (
              <Card 
                key={type.name}
                variant="glass" 
                hover
                interactive
                onClick={() => router.push(type.path)}
              >
                <CardBody className="text-center p-6">
                  <type.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-1">
                    {type.keyMetrics.slice(0, 3).map((metric) => (
                      <Badge key={metric} variant="outline" size="xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY USE THIS TOOL */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Built for CRE Professionals
              </h2>
              <p className="text-xl text-gray-600">
                Why thousands trust our tools for their investment analysis
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">100% Private & Secure</h3>
                    <p className="text-gray-600">
                      Your data never leaves your browser. No servers, no tracking, 
                      complete privacy.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Institutional Accuracy</h3>
                    <p className="text-gray-600">
                      Same calculations used by top CRE firms, available free for everyone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-gray-600">
                      No sign-ups, no downloads. Start analyzing in seconds, get results 
                      in minutes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card variant="glass">
                  <CardBody className="p-6">
                    <Stat
                      label="Calculations Performed"
                      value="200+"
                      variant="minimal"
                      size="sm"
                    />
                  </CardBody>
                </Card>
                
                <Card variant="glass">
                  <CardBody className="p-6">
                    <Stat
                      label="Property Types Supported"
                      value="5"
                      variant="minimal"
                      size="sm"
                    />
                  </CardBody>
                </Card>
                
                <Card variant="glass">
                  <CardBody className="p-6">
                    <Stat
                      label="Time to First Result"
                      value="< 2 min"
                      variant="minimal"
                      size="sm"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Analyze Your Deal?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Professional CRE analysis tools, completely free. 
            No catches, no credit cards, just great tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="secondary" 
              rightIcon={ArrowRight}
              onClick={() => router.push('/analyzer/quick')}
            >
              Start Free Analysis
            </Button>
            <Button 
              size="xl" 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Calculators
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}