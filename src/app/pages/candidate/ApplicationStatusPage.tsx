import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Check,
  Clock,
  AlertCircle,
  Download,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const statusConfig: { [key: string]: { icon: any; color: string; bgColor: string; title: string; description: string } } = {
  draft: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    title: 'Draft',
    description: 'Your application is incomplete'
  },
  submitted: {
    icon: Check,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    title: 'Submitted',
    description: 'Waiting for review'
  },
  under_review: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    title: 'Under Review',
    description: 'Your application is being reviewed'
  },
  approved: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    title: 'Approved',
    description: 'Your application has been approved'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    title: 'Rejected',
    description: 'Your application has been rejected'
  }
};

export function ApplicationStatusPage() {
  const { user } = useAuth();
  const { application } = useApplication();
  const navigate = useNavigate();

  const currentConfig = statusConfig[application.status];
  const CurrentIcon = currentConfig.icon;

  // Timeline data
  const timeline = [
    {
      status: 'draft',
      title: 'Application Started',
      date: '2026-04-10',
      description: 'You started filling your application form',
      completed: true
    },
    {
      status: 'submitted',
      title: 'Application Submitted',
      date: '2026-04-12',
      description: 'Your application was successfully submitted',
      completed: application.status !== 'draft'
    },
    {
      status: 'under_review',
      title: 'Under Review',
      date: application.status === 'under_review' ? 'In Progress' : '2026-04-15',
      description: 'Our admissions team is reviewing your application',
      completed: ['approved', 'rejected'].includes(application.status)
    },
    {
      status: 'approved',
      title: 'Application Approved',
      date: application.status === 'approved' ? '2026-04-18' : null,
      description: 'You have been shortlisted for admission',
      completed: application.status === 'approved'
    },
    {
      status: 'rejected',
      title: 'Application Result',
      date: application.status === 'rejected' ? '2026-04-18' : null,
      description: 'Your application has been reviewed',
      completed: application.status === 'rejected'
    }
  ];

  const adminRemarks = application.status === 'approved' 
    ? 'Your application has been approved. Please proceed to payment to activate your admission.'
    : application.status === 'rejected'
    ? 'Thank you for your application. We appreciate your interest in our institution.'
    : 'Your application is being reviewed by our admissions team. We will update you soon.';

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
        <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
        <p className="text-gray-600 mt-1">Track the status of your admission application</p>
      </div>

      {/* Current Status Card */}
      <Card className={`border-2 ${currentConfig.bgColor}`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${currentConfig.bgColor}`}>
              <CurrentIcon className={`w-8 h-8 ${currentConfig.color}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{currentConfig.title}</CardTitle>
              <CardDescription>{currentConfig.description}</CardDescription>
            </div>
            <Badge className={`${currentConfig.bgColor} ${currentConfig.color} border-0`}>
              {currentConfig.title}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
          <CardDescription>Your application journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1 w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                    item.completed
                      ? 'bg-green-100 border-green-500'
                      : item.status === application.status
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    {item.completed ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : item.status === application.status ? (
                      <Clock className="w-6 h-6 text-blue-600 animate-spin" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.date && (
                      <p className="text-xs text-gray-500 mt-2">
                        {typeof item.date === 'string' && item.date !== 'In Progress'
                          ? new Date(item.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                          : item.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Remarks</CardTitle>
          <CardDescription>Feedback from admissions committee</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{adminRemarks}</p>
          </div>

          {application.status === 'approved' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                <strong>Next Steps:</strong> Complete the payment to activate your admission and proceed to the next stage.
              </p>
              <Button
                onClick={() => navigate('/dashboard/payment')}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                Proceed to Payment
              </Button>
            </div>
          )}

          {application.status === 'rejected' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                We regret to inform you that your application was not selected. However, we encourage you to apply again in the next admission cycle.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Section */}
      {application.status === 'submitted' && (
        <Card>
          <CardHeader>
            <CardTitle>Application Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Application PDF
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Application Deadline</p>
              <p className="font-bold text-lg mt-1">June 30, 2026</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Result Declaration</p>
              <p className="font-bold text-lg mt-1">July 15, 2026</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Counselling Begins</p>
              <p className="font-bold text-lg mt-1">July 20, 2026</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Classes Start</p>
              <p className="font-bold text-lg mt-1">August 1, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
