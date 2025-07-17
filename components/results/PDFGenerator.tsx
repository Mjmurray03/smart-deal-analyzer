'use client';
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
    try {
      // Generate PDF report with property analysis
      const reportData = {
        propertyData,
        metrics,
        assessment,
        flags,
        generatedAt: new Date().toISOString()
      };
      
      // Create downloadable content
      const reportContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Download the report
      const link = document.createElement('a');
      link.href = url;
      link.download = `property-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF report:', error);
    }
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