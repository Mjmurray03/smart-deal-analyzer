'use client';

import { jsPDF } from 'jspdf';
import { PropertyData, CalculatedMetrics, MetricFlags, DealAssessment } from '@/lib/calculations/types';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface PDFGeneratorProps {
  propertyData: PropertyData;
  metrics: CalculatedMetrics;
  assessment: DealAssessment & { recommendation: string };
  flags: MetricFlags;
}

export default function PDFGenerator({ propertyData, metrics, assessment, flags }: PDFGeneratorProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date().toISOString().split('T')[0];
    const pageWidth = doc.internal.pageSize.getWidth();
    let yOffset = 20;

    // Helper function to add text with proper spacing
    const addText = (text: string, y: number, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.text(text, 20, y);
      return y + (fontSize * 0.4);
    };

    // Helper function to add section
    const addSection = (title: string, y: number) => {
      y = addText(title, y, 14, true);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y - 5, pageWidth - 20, y - 5);
      return y + 10;
    };

    // Header
    yOffset = addText('Investment Analysis Report', yOffset, 20, true);
    yOffset = addText(`Generated on: ${today}`, yOffset + 5, 12);
    yOffset += 15;

    // Property Overview Section
    if (propertyData.purchasePrice) {
      yOffset = addSection('Property Overview', yOffset);
      if (propertyData.purchasePrice) {
        yOffset = addText(`Purchase Price: $${propertyData.purchasePrice.toLocaleString()}`, yOffset);
      }
      if (propertyData.currentNOI) {
        yOffset = addText(`Current NOI: $${propertyData.currentNOI.toLocaleString()}`, yOffset);
      }
      if (propertyData.projectedNOI) {
        yOffset = addText(`Projected NOI: $${propertyData.projectedNOI.toLocaleString()}`, yOffset);
      }
      yOffset += 10;
    }

    // Active Metrics Section
    yOffset = addSection('Investment Metrics', yOffset);
    const activeMetrics = Object.entries(metrics).filter(([key]) => flags[key as keyof MetricFlags]);
    
    activeMetrics.forEach(([key, value]) => {
      if (value !== null) {
        const metricName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        yOffset = addText(`${metricName}: ${value.toFixed(2)}%`, yOffset);
      }
    });
    yOffset += 10;

    // Deal Assessment Section
    yOffset = addSection('Deal Assessment', yOffset);
    yOffset = addText(`Overall Rating: ${assessment.overall.toUpperCase()}`, yOffset, 14, true);
    yOffset += 5;
    yOffset = addText('Recommendation:', yOffset, 12, true);
    
    // Split recommendation text into multiple lines if needed
    const recommendation = assessment.recommendation;
    const maxWidth = pageWidth - 40;
    const splitText = doc.splitTextToSize(recommendation, maxWidth);
    splitText.forEach((line: string) => {
      yOffset = addText(line, yOffset);
    });

    // Save the PDF
    doc.save(`DealAnalysis_${today}.pdf`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generatePDF}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
      Download Investment Report
    </motion.button>
  );
}