import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Bell
} from 'lucide-react';

export function CandidateDashboard() {
  const { user } = useAuth();
  const { application } = useApplication();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    const steps = ['draft', 'submitted', 'under_review', 'approved'];
    const currentIndex = steps.indexOf(application.status);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const notifications = [
    { id: 1, message: 'Complete your application form', time: '2 hours ago', unread: true },
    { id: 2, message: 'Upload required documents', time: '1 day ago', unread: true },
    { id: 3, message: 'Application deadline: June 30, 2026', time: '2 days ago', unread: false }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Track your application and complete remaining steps</p>
      </div>

      {/* Application Status Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>B.Tech Admission 2026</CardDescription>
            </div>
            <Badge className={getStatusColor(application.status)}>
              {application.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Status Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                application.status === 'draft' ? 'bg-[#1E3A8A] text-white' : 'bg-green-100 text-green-600'
              }`}>
                {application.status === 'draft' ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <p className="text-sm font-medium">Draft</p>
              <p className="text-xs text-gray-500">Fill application</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                application.status === 'submitted' ? 'bg-[#1E3A8A] text-white' :
                ['under_review', 'approved'].includes(application.status) ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {['under_review', 'approved'].includes(application.status) ? 
                  <CheckCircle className="w-6 h-6" /> : 
                  <FileText className="w-6 h-6" />
                }
              </div>
              <p className="text-sm font-medium">Submitted</p>
              <p className="text-xs text-gray-500">Application sent</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                application.status === 'under_review' ? 'bg-[#1E3A8A] text-white' :
                application.status === 'approved' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {application.status === 'approved' ? 
                  <CheckCircle className="w-6 h-6" /> : 
                  <Eye className="w-6 h-6" />
                }
              </div>
              <p className="text-sm font-medium">Under Review</p>
              <p className="text-xs text-gray-500">Verification</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                application.status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Approved</p>
              <p className="text-xs text-gray-500">Result declared</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div>
                <CardTitle className="text-lg">Application Form</CardTitle>
                <CardDescription>Complete your details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              <Link to="/dashboard/application">
                {application.status === 'draft' ? 'Continue Application' : 'View Application'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Upload Documents</CardTitle>
                <CardDescription>Required certificates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/documents">
                Manage Documents
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Download</CardTitle>
                <CardDescription>Admit card & receipt</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled={application.status === 'draft'}>
              Download Admit Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
            <Button variant="link" asChild>
              <Link to="/dashboard/notifications">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  notification.unread ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  notification.unread ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {notification.unread ? (
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bell className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>• Last date to apply: <strong>June 30, 2026</strong></p>
          <p>• Ensure all documents are uploaded before submission</p>
          <p>• Document verification will be conducted from July 1-15, 2026</p>
          <p>• Keep checking your dashboard for updates</p>
        </CardContent>
      </Card>
    </div>
  );
}
