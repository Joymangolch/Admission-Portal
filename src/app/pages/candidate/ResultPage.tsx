import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  Download,
  ArrowLeft,
  TrendingUp,
  Trophy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ResultPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock result data
  const resultData = {
    status: 'selected', // 'selected' | 'not-selected'
    rank: 145,
    totalCandidates: 1200,
    marks: {
      mathematics: 92,
      physics: 88,
      chemistry: 85,
      english: 78
    },
    totalScore: 343,
    maxScore: 400,
    percentile: 87.2
  };

  const marksBreakdown = [
    { subject: 'Mathematics', marks: resultData.marks.mathematics, maxMarks: 100, percentage: 92 },
    { subject: 'Physics', marks: resultData.marks.physics, maxMarks: 100, percentage: 88 },
    { subject: 'Chemistry', marks: resultData.marks.chemistry, maxMarks: 100, percentage: 85 },
    { subject: 'English', marks: resultData.marks.english, maxMarks: 100, percentage: 78 }
  ];

  const handleDownloadResult = () => {
    toast.success('Result PDF downloaded successfully');
  };

  const isSelected = resultData.status === 'selected';

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Examination Results</h1>
        <p className="text-gray-600 mt-1">Your B.Tech admission examination results</p>
      </div>

      {/* Result Status Card */}
      <Card className={`border-2 ${isSelected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${isSelected ? 'bg-green-100' : 'bg-red-100'}`}>
              {isSelected ? (
                <CheckCircle2 className={`w-8 h-8 ${isSelected ? 'text-green-600' : 'text-red-600'}`} />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className={isSelected ? 'text-green-700' : 'text-red-700'}>
                {isSelected ? 'Congratulations! You are Selected' : 'Application Status'}
              </CardTitle>
              <CardDescription className={isSelected ? 'text-green-600' : 'text-red-600'}>
                {isSelected
                  ? 'You have been selected for admission to B.Tech program'
                  : 'You were not selected for this admission cycle'}
              </CardDescription>
            </div>
            <Badge className={isSelected ? 'bg-green-100 text-green-800 border-0 text-base px-4 py-2' : 'bg-red-100 text-red-800 border-0 text-base px-4 py-2'}>
              {isSelected ? 'SELECTED' : 'NOT SELECTED'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
          <CardDescription>Your total performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Score */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 uppercase">Total Score</p>
              <div className="text-4xl font-bold text-blue-600 mt-2">
                {resultData.totalScore}
              </div>
              <p className="text-xs text-gray-500 mt-1">out of {resultData.maxScore}</p>
            </div>

            {/* Percentage */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 uppercase">Percentage</p>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {((resultData.totalScore / resultData.maxScore) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Success Rate</p>
            </div>

            {/* Percentile */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 uppercase">Percentile</p>
              <div className="text-4xl font-bold text-purple-600 mt-2">
                {resultData.percentile}
              </div>
              <p className="text-xs text-gray-500 mt-1">National Percentile</p>
            </div>

            {/* Rank */}
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 uppercase">Rank</p>
              <div className="text-4xl font-bold text-amber-600 mt-2">
                #{resultData.rank}
              </div>
              <p className="text-xs text-gray-500 mt-1">out of {resultData.totalCandidates}</p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Performance</span>
              <span className="text-sm font-bold">{Math.round((resultData.totalScore / resultData.maxScore) * 100)}%</span>
            </div>
            <Progress 
              value={(resultData.totalScore / resultData.maxScore) * 100}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Marks Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Marks Breakdown by Subject</CardTitle>
          <CardDescription>Detailed performance in each subject</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {marksBreakdown.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.subject}</p>
                  <p className="text-sm text-gray-600">
                    {item.marks} / {item.maxMarks}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#1E3A8A]">{item.percentage}%</p>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category-wise Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>How you performed against averages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-700">Your Average</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {(resultData.totalScore / 4).toFixed(1)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-700">Category Average</p>
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">86.5</p>
            </div>
          </div>

          {resultData.percentile > 75 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-2">⭐ Excellent Performance</p>
              <p className="text-sm text-green-800">
                Your performance is above average in your category. You are likely eligible for multiple courses based on your score.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      {isSelected && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Review your rank and expected courses</p>
                <p className="text-sm text-gray-600">Based on your score, you are eligible for admission to Computer Science, Electronics, and Mechanical Engineering programs.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fill your course preferences</p>
                <p className="text-sm text-gray-600">You will be able to fill your course preferences from July 20, 2026.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Participate in counselling</p>
                <p className="text-sm text-gray-600">Attend your allocated counselling slot as per the schedule to confirm your seat.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Result */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadResult}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Result PDF
        </Button>
        <Button
          variant="outline"
          className="flex-1"
        >
          Share Score
        </Button>
      </div>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Counselling Schedule</h4>
            <p className="text-sm text-blue-800">Counselling for selected candidates will begin from July 20, 2026. Keep checking the admission portal for the exact schedule.</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Score Card Validity</h4>
            <p className="text-sm text-yellow-800">This score card is valid for one year from the date of declaration. Always keep a copy for future reference and admissions.</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Grievance Redressal</h4>
            <p className="text-sm text-purple-800">If you have any concerns regarding your result, you can file a grievance within 7 days of result declaration at admission@university.ac.in</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
