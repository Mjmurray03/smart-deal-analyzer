import { CalculatedMetrics, DealAssessment, AssessmentLevel } from './types';

// Thresholds for each metric
const THRESHOLDS = {
  capRate: {
    good: 8,    // 8% or higher
    fair: 6,    // 6-8%
    poor: 0     // Below 6%
  },
  cashOnCash: {
    good: 8,    // 8% or higher
    fair: 6,    // 6-8%
    poor: 0     // Below 6%
  },
  dscr: {
    good: 1.25, // 1.25 or higher
    fair: 1.1,  // 1.1-1.25
    poor: 0     // Below 1.1
  },
  roi: {
    good: 12,   // 12% or higher
    fair: 8,    // 8-12%
    poor: 0     // Below 8%
  },
  breakeven: {
    good: 85,   // Below 85%
    fair: 90,   // 85-90%
    poor: 100   // Above 90%
  }
};

/**
 * Assesses the quality of a deal based on calculated metrics
 * @param metrics - Object containing calculated metrics
 * @returns DealAssessment object with overall rating and individual scores
 */
export function assessDeal(metrics: CalculatedMetrics): DealAssessment {
  // Initialize scores object
  const scores: { [key: string]: AssessmentLevel } = {};
  let strongCount = 0;
  let moderateCount = 0;
  let weakCount = 0;

  // Assess Cap Rate
  if (metrics.capRate) {
    if (metrics.capRate >= 8) {
      scores.capRate = 'Excellent';
      strongCount++;
    } else if (metrics.capRate >= 6) {
      scores.capRate = 'Good';
      moderateCount++;
    } else {
      scores.capRate = 'Fair';
      weakCount++;
    }
  }

  // Assess Cash on Cash Return
  if (metrics.cashOnCash) {
    if (metrics.cashOnCash >= 8) {
      scores.cashOnCash = 'Excellent';
      strongCount++;
    } else if (metrics.cashOnCash >= 6) {
      scores.cashOnCash = 'Good';
      moderateCount++;
    } else {
      scores.cashOnCash = 'Fair';
      weakCount++;
    }
  }

  // Assess DSCR
  if (metrics.dscr) {
    if (metrics.dscr >= 1.25) {
      scores.dscr = 'Excellent';
      strongCount++;
    } else if (metrics.dscr >= 1.1) {
      scores.dscr = 'Good';
      moderateCount++;
    } else {
      scores.dscr = 'Fair';
      weakCount++;
    }
  }

  // Assess IRR
  if (metrics.irr) {
    if (metrics.irr >= 12) {
      scores.irr = 'Excellent';
      strongCount++;
    } else if (metrics.irr >= 8) {
      scores.irr = 'Good';
      moderateCount++;
    } else {
      scores.irr = 'Fair';
      weakCount++;
    }
  }

  // Assess ROI
  if (metrics.roi) {
    if (metrics.roi >= 12) {
      scores.roi = 'Excellent';
      strongCount++;
    } else if (metrics.roi >= 8) {
      scores.roi = 'Good';
      moderateCount++;
    } else {
      scores.roi = 'Fair';
      weakCount++;
    }
  }

  // Assess Breakeven
  if (metrics.breakeven) {
    if (metrics.breakeven <= 85) {
      scores.breakeven = 'Excellent';
      strongCount++;
    } else if (metrics.breakeven <= 90) {
      scores.breakeven = 'Good';
      moderateCount++;
    } else {
      scores.breakeven = 'Fair';
      weakCount++;
    }
  }

  // Determine overall assessment
  let overall: AssessmentLevel;
  if (strongCount > moderateCount && strongCount > weakCount) {
    overall = 'Excellent';
  } else if (moderateCount >= strongCount && moderateCount >= weakCount) {
    overall = 'Good';
  } else if (weakCount > strongCount && weakCount > moderateCount) {
    overall = 'Fair';
  } else {
    overall = 'Poor';
  }

  return {
    overall,
    recommendation: getRecommendation(overall),
    metricScores: scores,
    activeMetrics: Object.keys(scores).length
  };
}

/**
 * Returns Tailwind CSS classes for assessment colors
 * @param assessment - The assessment level ('Excellent', 'Good', 'Fair', or 'Poor')
 * @returns Tailwind classes for text and background colors
 */
export function getAssessmentColor(assessment: 'Excellent' | 'Good' | 'Fair' | 'Poor'): string {
  switch (assessment) {
    case 'Excellent':
      return 'text-green-600';
    case 'Good':
      return 'text-yellow-600';
    case 'Fair':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Returns Heroicon name for assessment level
 * @param assessment - The assessment level ('Excellent', 'Good', 'Fair', or 'Poor')
 * @returns Heroicon name
 */
export function getAssessmentIcon(assessment: 'Excellent' | 'Good' | 'Fair' | 'Poor'): string {
  switch (assessment) {
    case 'Excellent':
      return 'CheckCircleIcon';
    case 'Good':
      return 'ExclamationCircleIcon';
    case 'Fair':
      return 'XCircleIcon';
    default:
      return 'QuestionMarkCircleIcon';
  }
}

// Helper function to get recommendation text
function getRecommendation(assessment: AssessmentLevel): string {
  switch (assessment) {
    case 'Excellent':
      return 'This deal shows excellent potential with multiple positive metrics.';
    case 'Good':
      return 'This deal shows good potential. Consider negotiating better terms.';
    case 'Fair':
      return 'This deal shows moderate potential with some areas of concern.';
    default:
      return 'This deal shows several areas of concern. Consider passing or renegotiating.';
  }
} 