import { PropertyData, MetricFlags, CalculatedMetrics, DealAssessment } from '@/lib/calculations/types';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface PDFGeneratorProps {
  propertyData: Partial<PropertyData>;
  metrics: CalculatedMetrics;
  assessment: DealAssessment | null;
  flags: MetricFlags;
}

export default function PDFGenerator({
  propertyData,
  metrics,
  assessment,
  flags
}: PDFGeneratorProps) {
  const handleGeneratePDF = async () => {
    // TODO: Implement PDF generation
    console.log('Generating PDF with:', {
      propertyData,
      metrics,
      assessment,
      flags
    });
  };

  return (
    <button
      onClick={handleGeneratePDF}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
      Download Report
    </button>
  );
} 