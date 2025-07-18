'use client';

import { useRouter, useParams } from 'next/navigation';
import { DynamicInputForm } from '@/components/calculator/DynamicInputForm';
import { PropertyData } from '@/lib/types';

export default function PropertyAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const propertyType = params.propertyType as string;
  const packageType = params.packageType as string;
  
  const handleFormSubmit = (formData: PropertyData) => {
    // Store data in sessionStorage for results page
    sessionStorage.setItem('propertyData', JSON.stringify(formData));
    sessionStorage.setItem('packageType', packageType);
    sessionStorage.setItem('propertyType', propertyType);
    
    // Navigate to results page
    router.push(`/analyzer/${propertyType}/results`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <DynamicInputForm
          propertyType={propertyType}
          packageId={packageType}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}