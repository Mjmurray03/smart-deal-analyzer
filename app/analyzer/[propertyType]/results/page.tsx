'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Save, 
  Share2, 
  Download, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  FileSpreadsheet,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { PropertyData, MetricFlags } from '@/lib/calculations/types';
import { calculateMetrics } from '@/lib/calculations/metrics';
import { quickPackages, propertyPackages } from '@/lib/calculations/packages';
import { 
  CalculationLoader, 
  ContentTransition,
  ProgressiveLoader
} from '@/components/ui/LoadingStates';
import { 
  ExecutiveSummarySkeleton, 
  MetricsGridSkeleton 
} from '@/components/ui/Skeleton';

interface AssessmentData {
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  score: string;
  summary: string;
}

interface KeyMetric {
  key: string;
  label: string;
  value: string;
  benchmark?: string;
  performance?: 'above' | 'below';
}

interface MetricCategory {
  id: string;
  name: string;
  count: number;
}

interface DetailedMetric {
  key: string;
  label: string;
  value: string | null;
  description: string;
  methodology: string;
  components?: Array<{ label: string; value: string }>;
  visualization?: boolean;
  visualValue?: number;
}

export default function ResultsPage() {
  const params = useParams();
  const propertyType = params.propertyType as string;
  
  const [calculatedMetrics, setCalculatedMetrics] = useState<Record<string, unknown>>({});
  const [activeCategory, setActiveCategory] = useState('returns');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStages, setLoadingStages] = useState([
    { label: 'Loading property data...', completed: false, active: true },
    { label: 'Calculating basic metrics...', completed: false, active: false },
    { label: 'Analyzing cash flow...', completed: false, active: false },
    { label: 'Computing returns...', completed: false, active: false },
    { label: 'Generating insights...', completed: false, active: false }
  ]);

  // Parse property data and flags from sessionStorage with progressive loading
  useEffect(() => {
    const propertyDataParam = sessionStorage.getItem('propertyData');
    const packageTypeParam = sessionStorage.getItem('packageType');
    
    if (propertyDataParam && packageTypeParam) {
      // Simulate progressive calculation stages
      const stages = [
        { message: 'Loading property data...', progress: 20, duration: 800 },
        { message: 'Calculating basic metrics...', progress: 40, duration: 600 },
        { message: 'Analyzing cash flow...', progress: 60, duration: 700 },
        { message: 'Computing returns...', progress: 80, duration: 500 },
        { message: 'Generating insights...', progress: 95, duration: 400 }
      ];
      
      let currentStage = 0;
      let timeoutId: NodeJS.Timeout;
      
      const processStage = () => {
        if (currentStage < stages.length) {
          const stage = stages[currentStage];
          if (stage) {
            setLoadingStage(stage.message);
            setLoadingProgress(stage.progress);
          
            // Update stage status
            setLoadingStages(prev => prev.map((s, index) => ({
              ...s,
              completed: index < currentStage,
              active: index === currentStage
            })));
            
            currentStage++;
            timeoutId = setTimeout(processStage, stage.duration);
          }
        } else {
          // All stages complete, now calculate metrics
          try {
            const propertyData = JSON.parse(propertyDataParam) as PropertyData;
            
            // Create metric flags based on actual package configuration
            const getMetricFlags = (packageType: string, propertyType: string): MetricFlags => {
              const packages = packageType === 'quick' ? quickPackages : propertyPackages;
              const propertyPackageList = packages[propertyType];
              
              if (!propertyPackageList || propertyPackageList.length === 0) {
                // Default flags for any property type
                return {
                  capRate: true,
                  cashOnCash: true,
                  irr: packageType === 'advanced',
                  roi: true,
                  dscr: true,
                  breakeven: packageType === 'advanced',
                  ltv: true,
                  grm: true,
                  pricePerUnit: propertyData.numberOfUnits ? true : false,
                  pricePerSF: propertyData.totalSquareFootage ? true : false,
                  egi: false
                };
              }
              
              // Get the first package or basic package
              const selectedPackage = propertyPackageList.find(pkg => pkg.id.includes(packageType)) || propertyPackageList[0];
              
              // Convert included metrics to MetricFlags
              const flags: MetricFlags = {
                capRate: false,
                cashOnCash: false,
                irr: false,
                roi: false,
                dscr: false,
                breakeven: false,
                ltv: false,
                grm: false,
                pricePerUnit: false,
                pricePerSF: false,
                egi: false
              };
              
              // Set flags based on package metrics
              if (selectedPackage) {
                selectedPackage.includedMetrics.forEach(metric => {
                  if (metric in flags) {
                    flags[metric as keyof MetricFlags] = true;
                  }
                });
              }
              
              return flags;
            };
            
            const metricFlags = getMetricFlags(packageTypeParam, propertyType);
            
            const metrics = calculateMetrics(propertyData, metricFlags);
            setCalculatedMetrics(metrics as Record<string, unknown>);
            
            // Final stage completion
            setLoadingProgress(100);
            setLoadingStages(prev => prev.map(s => ({ ...s, completed: true, active: false })));
            
            // Small delay before showing results
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          } catch (error) {
            console.error('Error parsing parameters:', error);
            setIsLoading(false);
          }
        }
      };
      
      // Start the progressive loading
      processStage();
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
    
    // Return empty cleanup function if no data
    return () => {};
  }, []);

  // Calculate assessment based on metrics
  const getAssessment = (): AssessmentData => {
    const cashOnCashReturn = calculatedMetrics.cashOnCashReturn as number;
    const irr = calculatedMetrics.irr as number;
    const capRate = calculatedMetrics.capRate as number;
    const dscr = calculatedMetrics.dscr as number;

    let score = 0;
    let count = 0;

    if (cashOnCashReturn !== undefined) {
      count++;
      if (cashOnCashReturn >= 12) score += 100;
      else if (cashOnCashReturn >= 10) score += 80;
      else if (cashOnCashReturn >= 8) score += 60;
      else if (cashOnCashReturn >= 6) score += 40;
      else score += 20;
    }

    if (irr !== undefined) {
      count++;
      if (irr >= 18) score += 100;
      else if (irr >= 15) score += 80;
      else if (irr >= 12) score += 60;
      else if (irr >= 10) score += 40;
      else score += 20;
    }

    if (capRate !== undefined) {
      count++;
      if (capRate >= 8) score += 100;
      else if (capRate >= 7) score += 80;
      else if (capRate >= 6) score += 60;
      else if (capRate >= 5) score += 40;
      else score += 20;
    }

    if (dscr !== undefined) {
      count++;
      if (dscr >= 1.5) score += 100;
      else if (dscr >= 1.3) score += 80;
      else if (dscr >= 1.2) score += 60;
      else if (dscr >= 1.1) score += 40;
      else score += 20;
    }

    const avgScore = count > 0 ? score / count : 0;
    
    let rating: AssessmentData['rating'];
    let summary: string;

    if (avgScore >= 80) {
      rating = 'Excellent';
      summary = 'This property presents a strong investment opportunity with impressive returns and solid fundamentals.';
    } else if (avgScore >= 60) {
      rating = 'Good';
      summary = 'This property shows good potential with favorable metrics that meet most investment criteria.';
    } else if (avgScore >= 40) {
      rating = 'Fair';
      summary = 'This property has moderate potential but requires careful consideration of risk factors.';
    } else {
      rating = 'Poor';
      summary = 'This property shows limited investment potential based on current metrics and market conditions.';
    }

    return {
      rating,
      score: `${Math.round(avgScore)}`,
      summary
    };
  };

  // Get key metrics for executive summary
  const getKeyMetrics = (): KeyMetric[] => {
    const metrics: KeyMetric[] = [];

    if (calculatedMetrics.cashOnCashReturn !== undefined) {
      metrics.push({
        key: 'cashOnCashReturn',
        label: 'Cash-on-Cash Return',
        value: `${(calculatedMetrics.cashOnCashReturn as number).toFixed(2)}%`,
        benchmark: '10%',
        performance: (calculatedMetrics.cashOnCashReturn as number) >= 10 ? 'above' : 'below'
      });
    }

    if (calculatedMetrics.irr !== undefined) {
      metrics.push({
        key: 'irr',
        label: 'IRR (5-Year)',
        value: `${(calculatedMetrics.irr as number).toFixed(2)}%`,
        benchmark: '15%',
        performance: (calculatedMetrics.irr as number) >= 15 ? 'above' : 'below'
      });
    }

    if (calculatedMetrics.capRate !== undefined) {
      metrics.push({
        key: 'capRate',
        label: 'Cap Rate',
        value: `${(calculatedMetrics.capRate as number).toFixed(2)}%`,
        benchmark: '7%',
        performance: (calculatedMetrics.capRate as number) >= 7 ? 'above' : 'below'
      });
    }

    if (calculatedMetrics.dscr !== undefined) {
      metrics.push({
        key: 'dscr',
        label: 'DSCR',
        value: (calculatedMetrics.dscr as number).toFixed(2),
        benchmark: '1.25',
        performance: (calculatedMetrics.dscr as number) >= 1.25 ? 'above' : 'below'
      });
    }

    if (calculatedMetrics.totalInvestment !== undefined) {
      metrics.push({
        key: 'totalInvestment',
        label: 'Total Investment',
        value: `$${((calculatedMetrics.totalInvestment as number) || 0).toLocaleString()}`
      });
    }

    if (calculatedMetrics.monthlyProfit !== undefined) {
      metrics.push({
        key: 'monthlyProfit',
        label: 'Monthly Cash Flow',
        value: `$${((calculatedMetrics.monthlyProfit as number) || 0).toLocaleString()}`
      });
    }

    return metrics.slice(0, 6); // Return top 6 metrics
  };

  // Get metric categories
  const getMetricCategories = (): MetricCategory[] => {
    const categories: MetricCategory[] = [
      { id: 'returns', name: 'Returns & Profitability', count: 0 },
      { id: 'cashflow', name: 'Cash Flow Analysis', count: 0 },
      { id: 'financing', name: 'Financing & Leverage', count: 0 },
      { id: 'valuation', name: 'Valuation Metrics', count: 0 },
      { id: 'operating', name: 'Operating Performance', count: 0 }
    ];

    // Count metrics per category
    const returnMetrics = ['cashOnCashReturn', 'irr', 'roi', 'annualizedReturn', 'totalReturn'];
    const cashflowMetrics = ['monthlyProfit', 'annualCashFlow', 'netCashFlow', 'beforeTaxCashFlow'];
    const financingMetrics = ['dscr', 'ltv', 'loanConstant', 'debtYield'];
    const valuationMetrics = ['capRate', 'grm', 'pricePerUnit', 'pricePerSqft'];
    const operatingMetrics = ['breakEvenRatio', 'operatingExpenseRatio', 'vacancyRate', 'managementEfficiency'];

    Object.keys(calculatedMetrics).forEach(key => {
      const value = calculatedMetrics[key];
      if (returnMetrics.includes(key) && value !== undefined && value !== null) categories[0]!.count++;
      else if (cashflowMetrics.includes(key) && value !== undefined && value !== null) categories[1]!.count++;
      else if (financingMetrics.includes(key) && value !== undefined && value !== null) categories[2]!.count++;
      else if (valuationMetrics.includes(key) && value !== undefined && value !== null) categories[3]!.count++;
      else if (operatingMetrics.includes(key) && value !== undefined && value !== null) categories[4]!.count++;
    });

    return categories.filter(cat => cat.count > 0);
  };

  // Get detailed metrics for active category
  const getDetailedMetrics = (): DetailedMetric[] => {
    const metrics: DetailedMetric[] = [];
    
    const formatValue = (value: unknown, type: 'percentage' | 'currency' | 'number' = 'number'): string | null => {
      if (value === undefined || value === null) return null;
      
      switch (type) {
        case 'percentage':
          return `${(value as number).toFixed(2)}%`;
        case 'currency':
          return `$${(value as number).toLocaleString()}`;
        default:
          return (value as number).toFixed(2);
      }
    };

    // Add metrics based on category
    if (activeCategory === 'returns') {
      if (calculatedMetrics.cashOnCashReturn !== undefined) {
        metrics.push({
          key: 'cashOnCashReturn',
          label: 'Cash-on-Cash Return',
          value: formatValue(calculatedMetrics.cashOnCashReturn, 'percentage'),
          description: 'Annual cash return on invested capital',
          methodology: 'Annual Cash Flow / Total Cash Invested × 100',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.cashOnCashReturn as number) / 20 * 100, 100)
        });
      }

      if (calculatedMetrics.irr !== undefined) {
        metrics.push({
          key: 'irr',
          label: 'Internal Rate of Return',
          value: formatValue(calculatedMetrics.irr, 'percentage'),
          description: 'Annualized rate of return over investment period',
          methodology: 'NPV of all cash flows = 0',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.irr as number) / 25 * 100, 100)
        });
      }

      if (calculatedMetrics.roi !== undefined) {
        metrics.push({
          key: 'roi',
          label: 'Return on Investment',
          value: formatValue(calculatedMetrics.roi, 'percentage'),
          description: 'Total return on initial investment',
          methodology: '(Total Return - Total Investment) / Total Investment × 100',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.roi as number) / 100 * 100, 100)
        });
      }
    }

    if (activeCategory === 'cashflow') {
      if (calculatedMetrics.monthlyProfit !== undefined) {
        metrics.push({
          key: 'monthlyProfit',
          label: 'Monthly Cash Flow',
          value: formatValue(calculatedMetrics.monthlyProfit, 'currency'),
          description: 'Net monthly cash flow after all expenses',
          methodology: 'Gross Income - Operating Expenses - Debt Service',
          components: [
            { label: 'Gross Income', value: formatValue(calculatedMetrics.monthlyRent || 0, 'currency') || '0' },
            { label: 'Operating Expenses', value: formatValue(calculatedMetrics.monthlyExpenses || 0, 'currency') || '0' },
            { label: 'Debt Service', value: formatValue(calculatedMetrics.monthlyPayment || 0, 'currency') || '0' }
          ]
        });
      }

      if (calculatedMetrics.annualCashFlow !== undefined) {
        metrics.push({
          key: 'annualCashFlow',
          label: 'Annual Cash Flow',
          value: formatValue(calculatedMetrics.annualCashFlow, 'currency'),
          description: 'Total annual cash flow from operations',
          methodology: 'Monthly Cash Flow × 12',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.annualCashFlow as number) / 50000 * 100, 100)
        });
      }
    }

    if (activeCategory === 'financing') {
      if (calculatedMetrics.dscr !== undefined) {
        metrics.push({
          key: 'dscr',
          label: 'Debt Service Coverage Ratio',
          value: formatValue(calculatedMetrics.dscr, 'number'),
          description: 'Ability to cover debt payments',
          methodology: 'Net Operating Income / Annual Debt Service',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.dscr as number) / 2 * 100, 100)
        });
      }

      if (calculatedMetrics.ltv !== undefined) {
        metrics.push({
          key: 'ltv',
          label: 'Loan-to-Value Ratio',
          value: formatValue(calculatedMetrics.ltv, 'percentage'),
          description: 'Loan amount as percentage of property value',
          methodology: 'Loan Amount / Property Value × 100',
          visualization: true,
          visualValue: (calculatedMetrics.ltv as number)
        });
      }
    }

    if (activeCategory === 'valuation') {
      if (calculatedMetrics.capRate !== undefined) {
        metrics.push({
          key: 'capRate',
          label: 'Capitalization Rate',
          value: formatValue(calculatedMetrics.capRate, 'percentage'),
          description: 'Return on property value',
          methodology: 'Net Operating Income / Property Value × 100',
          visualization: true,
          visualValue: Math.min((calculatedMetrics.capRate as number) / 10 * 100, 100)
        });
      }

      if (calculatedMetrics.grm !== undefined) {
        metrics.push({
          key: 'grm',
          label: 'Gross Rent Multiplier',
          value: formatValue(calculatedMetrics.grm, 'number'),
          description: 'Years of gross rent to equal property value',
          methodology: 'Property Value / Annual Gross Rent',
          visualization: true,
          visualValue: Math.min((10 - (calculatedMetrics.grm as number)) / 10 * 100, 100)
        });
      }
    }

    return metrics;
  };

  // Get insights
  const getStrengths = (): string[] => {
    const strengths: string[] = [];
    
    if ((calculatedMetrics.cashOnCashReturn as number) >= 10) {
      strengths.push('Strong cash-on-cash return exceeding market average');
    }
    if ((calculatedMetrics.dscr as number) >= 1.3) {
      strengths.push('Excellent debt coverage providing financial stability');
    }
    if ((calculatedMetrics.capRate as number) >= 7) {
      strengths.push('Attractive cap rate indicating good value');
    }
    if ((calculatedMetrics.monthlyProfit as number) > 1000) {
      strengths.push('Solid positive monthly cash flow');
    }
    
    return strengths.length > 0 ? strengths : ['Property shows balanced metrics across key indicators'];
  };

  const getConsiderations = (): string[] => {
    const considerations: string[] = [];
    
    if ((calculatedMetrics.cashOnCashReturn as number) < 8) {
      considerations.push('Cash-on-cash return below typical investor targets');
    }
    if ((calculatedMetrics.dscr as number) < 1.2) {
      considerations.push('Debt coverage ratio may limit refinancing options');
    }
    if ((calculatedMetrics.ltv as number) > 80) {
      considerations.push('High leverage increases risk exposure');
    }
    if ((calculatedMetrics.monthlyProfit as number) < 500) {
      considerations.push('Limited cash flow buffer for unexpected expenses');
    }
    
    return considerations.length > 0 ? considerations : ['Consider market conditions and exit strategy timing'];
  };

  const getNextSteps = (): string[] => {
    return [
      'Verify all income and expense assumptions with actual data',
      'Obtain professional property inspection and appraisal',
      'Review comparable sales and rental rates in the area',
      'Consult with lender for financing pre-approval',
      'Analyze tax implications with a CPA'
    ];
  };

  if (isLoading) {
    return (
      <>
        <CalculationLoader 
          stage={loadingStage} 
          progress={loadingProgress}
        />
        
        {/* Alternative skeleton view for users who prefer it */}
        <div className="min-h-screen bg-gray-50 opacity-50 pointer-events-none">
          {/* Header skeleton */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded w-28 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <ExecutiveSummarySkeleton className="mb-8" />
            <MetricsGridSkeleton className="mb-8" />
            
            {/* Progressive loading indicator */}
            <div className="max-w-md mx-auto">
              <ProgressiveLoader stages={loadingStages} />
            </div>
          </div>
        </div>
      </>
    );
  }

  const assessment = getAssessment();
  const keyMetrics = getKeyMetrics();
  const metricCategories = getMetricCategories();
  const detailedMetrics = getDetailedMetrics();
  const strengths = getStrengths();
  const considerations = getConsiderations();
  const nextSteps = getNextSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Link href="/analyzer" className="hover:text-gray-900">Analysis</Link>
                <ChevronRight className="w-4 h-4" />
                <span>{propertyType}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Results</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Investment Analysis Results
              </h1>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" leftIcon={Save}>
                Save Analysis
              </Button>
              <Button variant="ghost" size="sm" leftIcon={Share2}>
                Share
              </Button>
              <Button variant="primary" size="sm" leftIcon={Download}>
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="container mx-auto px-6 py-8">
        <ContentTransition
          isLoading={false}
          loadingComponent={<ExecutiveSummarySkeleton />}
        >
          <Card variant="elevated" className="mb-8">
            <CardBody className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Deal Rating */}
              <div className="text-center lg:text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Overall Assessment
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold",
                    assessment.rating === 'Excellent' && "bg-green-100 text-green-700",
                    assessment.rating === 'Good' && "bg-blue-100 text-blue-700",
                    assessment.rating === 'Fair' && "bg-amber-100 text-amber-700",
                    assessment.rating === 'Poor' && "bg-red-100 text-red-700"
                  )}>
                    {assessment.score}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {assessment.rating}
                    </div>
                    <div className="text-sm text-gray-600">
                      Investment Opportunity
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {assessment.summary}
                </p>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Performance Indicators
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {keyMetrics.map((metric) => (
                    <div key={metric.key} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{metric.label}</span>
                        {metric.benchmark && (
                          <Badge 
                            variant={metric.performance === 'above' ? 'success' : 'warning'} 
                            size="xs"
                          >
                            {metric.performance === 'above' ? 'Above' : 'Below'} Market
                          </Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </div>
                      {metric.benchmark && (
                        <div className="text-xs text-gray-500 mt-1">
                          Market: {metric.benchmark}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        </ContentTransition>

        {/* Detailed Metrics */}
        <ContentTransition
          isLoading={false}
          loadingComponent={<MetricsGridSkeleton />}
        >
        <div className="mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              {metricCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeCategory === category.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Metric cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedMetrics.map((metric) => (
              <Card key={metric.key} variant="bordered" hover>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                    </div>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400" />
                      <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {metric.methodology}
                        <div className="absolute top-0 right-2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {metric.value || 'N/A'}
                    </div>
                    
                    {metric.components && (
                      <div className="mt-3 space-y-1 text-sm">
                        {metric.components.map((comp) => (
                          <div key={comp.label} className="flex justify-between text-gray-600">
                            <span>{comp.label}:</span>
                            <span className="font-medium">{comp.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {metric.visualization && (
                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600 transition-all duration-500"
                            style={{ width: `${metric.visualValue}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        </ContentTransition>

        {/* Insights & Recommendations */}
        <ContentTransition
          isLoading={false}
          loadingComponent={
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        >
        <section className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Strengths */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Strengths</h3>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          
          {/* Considerations */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">Considerations</h3>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {considerations.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          
          {/* Next Steps */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Recommended Actions</h3>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {nextSteps.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>
        </ContentTransition>
      </section>

      {/* Export Options Footer */}
      <section className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Export Options</h3>
              <p className="text-sm text-gray-600">Download or share your analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" leftIcon={FileSpreadsheet}>
                Export to Excel
              </Button>
              <Button variant="ghost" leftIcon={FileText}>
                Export to PDF
              </Button>
              <Button variant="ghost" leftIcon={LinkIcon}>
                Get Shareable Link
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}