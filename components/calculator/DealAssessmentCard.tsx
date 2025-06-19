import { motion } from 'framer-motion';
import { DealAssessment, AssessmentLevel } from '@/lib/calculations/types';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

interface DealAssessmentCardProps {
  assessment: DealAssessment;
}

export default function DealAssessmentCard({ assessment }: DealAssessmentCardProps) {
  const getAssessmentStyles = () => {
    switch (assessment.overall) {
      case 'Excellent':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-600',
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: CheckCircleIcon,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          status: 'Excellent Investment Opportunity',
          emoji: '🚀'
        };
      case 'Good':
        return {
          gradient: 'from-yellow-400 via-amber-500 to-orange-600',
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: ExclamationTriangleIcon,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          status: 'Proceed with Caution',
          emoji: '⚖️'
        };
      case 'Fair':
        return {
          gradient: 'from-red-400 via-rose-500 to-pink-600',
          bg: 'bg-gradient-to-br from-red-50 to-rose-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: XCircleIcon,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          status: 'High Risk Investment',
          emoji: '⚠️'
        };
      default:
        return {
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: QuestionMarkCircleIcon,
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          status: 'Insufficient Data',
          emoji: '❓'
        };
    }
  };

  const styles = getAssessmentStyles();
  const Icon = styles.icon;

  // Count metrics by status
  const metricCounts = {
    good: 0,
    fair: 0,
    poor: 0,
    total: 0
  };

  const scores = assessment.metricScores;

  if (scores) {
    Object.values(scores).forEach(score => {
      switch (score as AssessmentLevel) {
        case 'Excellent':
          metricCounts.total++;
          metricCounts.good++;
          break;
        case 'Good':
          metricCounts.total++;
          metricCounts.fair++;
          break;
        case 'Fair':
          metricCounts.total++;
          metricCounts.poor++;
          break;
        case 'Poor':
          metricCounts.total++;
          break;
        default:
          break;
      }
    });
  }

  const getScorePercentage = () => {
    if (metricCounts.total === 0) return 0;
    return Math.round((metricCounts.good / metricCounts.total) * 100);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border-2 ${styles.border} ${styles.bg}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-5`} />
      
      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-3 rounded-xl ${styles.iconBg}`}
              >
                <Icon className={`h-8 w-8 ${styles.iconColor}`} />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{styles.status}</span>
                  <span className="text-3xl">{styles.emoji}</span>
                </h2>
                {assessment.activeMetrics > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {assessment.activeMetrics} key metric{assessment.activeMetrics !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Recommendation */}
            <p className={`text-lg leading-relaxed ${styles.text} mb-6`}>
              {assessment.recommendation}
            </p>

            {/* Metrics Breakdown */}
            {metricCounts.total > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Overall Score</span>
                  <span className="text-2xl font-bold text-gray-900">{getScorePercentage()}%</span>
                </div>
                
                {/* Score Bar */}
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getScorePercentage()}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full bg-gradient-to-r ${styles.gradient}`}
                  />
                </div>
                
                {/* Metric Counts */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  {metricCounts.good > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-green-50 rounded-lg p-3"
                    >
                      <div className="text-2xl font-bold text-green-600">{metricCounts.good}</div>
                      <div className="text-xs text-green-800">Strong</div>
                    </motion.div>
                  )}
                  {metricCounts.fair > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-yellow-50 rounded-lg p-3"
                    >
                      <div className="text-2xl font-bold text-yellow-600">{metricCounts.fair}</div>
                      <div className="text-xs text-yellow-800">Moderate</div>
                    </motion.div>
                  )}
                  {metricCounts.poor > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-red-50 rounded-lg p-3"
                    >
                      <div className="text-2xl font-bold text-red-600">{metricCounts.poor}</div>
                      <div className="text-xs text-red-800">Weak</div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}