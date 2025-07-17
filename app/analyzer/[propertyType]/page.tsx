'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Zap, TrendingUp, Check } from 'lucide-react';

export default function PackageSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const propertyType = params.propertyType as string;
  
  const packages = [
    {
      id: 'quick',
      name: 'Quick Analysis',
      description: 'Essential metrics for fast property evaluation',
      icon: Zap,
      color: 'primary',
      features: [
        'Cap Rate & Cash-on-Cash',
        'Basic Financial Metrics',
        'Quick Property Assessment',
        'PDF Report Export'
      ],
      timeEstimate: '2-5 minutes'
    },
    {
      id: 'advanced',
      name: 'Advanced Analysis', 
      description: 'Comprehensive institutional-grade analysis',
      icon: TrendingUp,
      color: 'success',
      features: [
        '200+ Advanced Metrics',
        'WALT & Tenant Analysis',
        'Market Positioning',
        'Sensitivity Analysis',
        'Detailed PDF Report'
      ],
      timeEstimate: '10-20 minutes'
    }
  ];
  
  const handlePackageSelect = (packageId: string) => {
    router.push(`/analyzer/${propertyType}/${packageId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Analysis Package
          </h1>
          <p className="text-xl text-gray-600">
            Select the depth of analysis for your {propertyType} property
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              variant="elevated" 
              hover 
              interactive
              onClick={() => handlePackageSelect(pkg.id)}
              className="cursor-pointer"
            >
              <CardBody className="p-8">
                <div className={`w-16 h-16 bg-${pkg.color}-100 rounded-xl flex items-center justify-center mb-6`}>
                  <pkg.icon className={`w-8 h-8 text-${pkg.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                
                <div className="mb-6">
                  <Badge variant="outline" className="mb-4">
                    {pkg.timeEstimate}
                  </Badge>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  fullWidth 
                  size="lg" 
                  variant={pkg.color === 'primary' ? 'primary' : 'success'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePackageSelect(pkg.id);
                  }}
                >
                  Start {pkg.name}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}