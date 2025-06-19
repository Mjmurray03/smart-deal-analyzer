import { DealAssessment, AssessmentLevel } from '@/lib/calculations/types';

interface DealAssessmentCardProps {
  assessment: DealAssessment | null;
}

export default function DealAssessmentCard({ assessment }: DealAssessmentCardProps) {
  if (!assessment) return null;

  const getLevelColor = (level: AssessmentLevel) => {
    switch (level) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Deal Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Assessment</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(assessment.overall)}`}>
            {assessment.overall}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recommendation</h3>
          <p className="text-gray-700">{assessment.recommendation}</p>
        </div>
      </div>

      {Object.entries(assessment.metricScores).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Metric Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(assessment.metricScores).map(([metric, level]) => (
              <div key={metric} className="flex items-center justify-between">
                <span className="text-gray-700">{metric}</span>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
                  {level}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 