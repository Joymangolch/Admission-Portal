import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../../components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  Flag,
  Download,
  Eye,
  MessageSquare,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock candidate data for all applications
const applicationsData: Record<string, any> = {
  'MTU2026001': {
    id: 'MTU2026001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91-9876543210',
    category: 'OBC',
    status: 'submitted',
    submissionDate: '2026-04-15',
    personalDetails: {
      dob: '2008-01-15',
      gender: 'Male',
      address: '123, Main Street, New Delhi, 110001'
    },
    academicDetails: {
      class10Board: 'CBSE',
      class10Marks: '495/500',
      class10Percentage: '99%',
      class12Board: 'CBSE',
      class12Marks: '495/500',
      class12Percentage: '99%'
    },
    jeeDetails: {
      rank: 2456,
      percentile: '98.5%'
    },
    documents: [
      { name: '10th Certificate', status: 'verified', url: '#' },
      { name: '12th Certificate', status: 'verified', url: '#' },
      { name: 'JEE Scorecard', status: 'verified', url: '#' },
      { name: 'Aadhar Card', status: 'verified', url: '#' },
      { name: 'Caste Certificate', status: 'pending', url: '#' }
    ]
  },
  'MTU2026002': {
    id: 'MTU2026002',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91-9876543211',
    category: 'GEN',
    status: 'submitted',
    submissionDate: '2026-04-15',
    personalDetails: {
      dob: '2008-03-22',
      gender: 'Female',
      address: '456, Summer Avenue, Mumbai, 400001'
    },
    academicDetails: {
      class10Board: 'ICSE',
      class10Marks: '480/500',
      class10Percentage: '96%',
      class12Board: 'ICSE',
      class12Marks: '485/500',
      class12Percentage: '97%'
    },
    jeeDetails: {
      rank: 1245,
      percentile: '99.2%'
    },
    documents: [
      { name: '10th Certificate', status: 'verified', url: '#' },
      { name: '12th Certificate', status: 'verified', url: '#' },
      { name: 'JEE Scorecard', status: 'verified', url: '#' },
      { name: 'Aadhar Card', status: 'verified', url: '#' }
    ]
  },
  'MTU2026003': {
    id: 'MTU2026003',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91-9876543212',
    category: 'SC',
    status: 'submitted',
    submissionDate: '2026-04-14',
    personalDetails: {
      dob: '2008-07-10',
      gender: 'Male',
      address: '789, Tech Park, Bangalore, 560001'
    },
    academicDetails: {
      class10Board: 'CBSE',
      class10Marks: '470/500',
      class10Percentage: '94%',
      class12Board: 'CBSE',
      class12Marks: '465/500',
      class12Percentage: '93%'
    },
    jeeDetails: {
      rank: 3567,
      percentile: '97.8%'
    },
    documents: [
      { name: '10th Certificate', status: 'verified', url: '#' },
      { name: '12th Certificate', status: 'verified', url: '#' },
      { name: 'JEE Scorecard', status: 'verified', url: '#' },
      { name: 'Aadhar Card', status: 'pending', url: '#' },
      { name: 'SC Certificate', status: 'verified', url: '#' }
    ]
  },
  'MTU2026004': {
    id: 'MTU2026004',
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    phone: '+91-9876543213',
    category: 'OBC',
    status: 'submitted',
    submissionDate: '2026-04-14',
    personalDetails: {
      dob: '2008-05-18',
      gender: 'Female',
      address: '321, Riverside Road, Ahmedabad, 380001'
    },
    academicDetails: {
      class10Board: 'CBSE',
      class10Marks: '485/500',
      class10Percentage: '97%',
      class12Board: 'CBSE',
      class12Marks: '490/500',
      class12Percentage: '98%'
    },
    jeeDetails: {
      rank: 1900,
      percentile: '98.9%'
    },
    documents: [
      { name: '10th Certificate', status: 'verified', url: '#' },
      { name: '12th Certificate', status: 'verified', url: '#' },
      { name: 'JEE Scorecard', status: 'verified', url: '#' },
      { name: 'Aadhar Card', status: 'verified', url: '#' },
      { name: 'OBC Certificate', status: 'pending', url: '#' }
    ]
  },
  'MTU2026005': {
    id: 'MTU2026005',
    name: 'Ravi Verma',
    email: 'ravi.verma@example.com',
    phone: '+91-9876543214',
    category: 'GEN',
    status: 'submitted',
    submissionDate: '2026-04-13',
    personalDetails: {
      dob: '2008-02-28',
      gender: 'Male',
      address: '654, Green Valley, Pune, 411001'
    },
    academicDetails: {
      class10Board: 'State Board',
      class10Marks: '475/500',
      class10Percentage: '95%',
      class12Board: 'State Board',
      class12Marks: '480/500',
      class12Percentage: '96%'
    },
    jeeDetails: {
      rank: 2100,
      percentile: '98.7%'
    },
    documents: [
      { name: '10th Certificate', status: 'verified', url: '#' },
      { name: '12th Certificate', status: 'verified', url: '#' },
      { name: 'JEE Scorecard', status: 'verified', url: '#' },
      { name: 'Aadhar Card', status: 'verified', url: '#' }
    ]
  }
};

export function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected' | 'flagged'>('pending');

  // Get candidate data based on URL parameter
  const candidateData = applicationsData[id || 'MTU2026001'] || applicationsData['MTU2026001'];

  const handleApprove = () => {
    setReviewStatus('approved');
    toast.success('Application approved successfully');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setReviewStatus('rejected');
    setShowRejectDialog(false);
    toast.success('Application rejected successfully');
  };

  const handleFlag = () => {
    setReviewStatus('flagged');
    toast.info('Application flagged for further review');
  };

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Review</h1>
          <p className="text-gray-600 mt-1">Review application and documents</p>
        </div>
        <Badge className="text-base px-4 py-2">ID: {candidateData.id}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-bold text-lg mt-1">{candidateData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium mt-1">{candidateData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium mt-1">{candidateData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium mt-1">
                    <Badge variant="outline">{candidateData.category}</Badge>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="font-medium">{candidateData.personalDetails.dob}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="font-medium">{candidateData.personalDetails.gender}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-600">Address</p>
                  <p className="font-medium">{candidateData.personalDetails.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Class 10th</h4>
                <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-gray-600">Board</p>
                    <p className="font-medium">{candidateData.academicDetails.class10Board}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Marks</p>
                    <p className="font-medium">{candidateData.academicDetails.class10Marks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Percentage</p>
                    <p className="font-medium text-green-600">{candidateData.academicDetails.class10Percentage}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Class 12th</h4>
                <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-gray-600">Board</p>
                    <p className="font-medium">{candidateData.academicDetails.class12Board}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Marks</p>
                    <p className="font-medium">{candidateData.academicDetails.class12Marks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Percentage</p>
                    <p className="font-medium text-green-600">{candidateData.academicDetails.class12Percentage}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">JEE Examination</h4>
                <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded">
                  <div>
                    <p className="text-gray-600">Rank</p>
                    <p className="font-bold text-blue-600">#{candidateData.jeeDetails.rank}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Percentile</p>
                    <p className="font-bold text-blue-600">{candidateData.jeeDetails.percentile}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>All documents with verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidateData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      doc.status === 'verified'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className={`text-xs ${
                          doc.status === 'verified'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}>
                          {doc.status === 'verified' ? '✓ Verified' : '⚠ Pending Verification'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Opening document viewer...')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Add remarks and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add your observations and notes about this application..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions Sidebar */}
        <div className="space-y-6">
          {/* Review Status Card */}
          <Card className={reviewStatus !== 'pending' ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle>Review Status</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900">Pending Review</p>
                  <p className="text-xs text-yellow-800 mt-2">Take action to approve, reject, or flag this application</p>
                </div>
              )}
              {reviewStatus === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Approved</p>
                  </div>
                  <p className="text-xs text-green-800">This application has been approved</p>
                </div>
              )}
              {reviewStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-red-900">Rejected</p>
                  </div>
                  <p className="text-xs text-red-800 mt-2">{rejectionReason}</p>
                </div>
              )}
              {reviewStatus === 'flagged' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-5 h-5 text-orange-600" />
                    <p className="text-sm font-medium text-orange-900">Flagged</p>
                  </div>
                  <p className="text-xs text-orange-800">Application flagged for further review</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleApprove}
                disabled={reviewStatus === 'approved'}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    disabled={reviewStatus === 'rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Application</DialogTitle>
                    <DialogDescription>
                      Provide a reason for rejection that will be sent to the candidate
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleFlag}
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                disabled={reviewStatus === 'flagged'}
              >
                <Flag className="w-4 h-4 mr-2" />
                Flag for Review
              </Button>
            </CardContent>
          </Card>

          {/* Review Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Academic Performance</p>
                <Badge className="mt-1 bg-green-100 text-green-800 border-0">Excellent</Badge>
              </div>
              <div>
                <p className="text-gray-600">Documents Status</p>
                <Badge className="mt-1 bg-yellow-100 text-yellow-800 border-0">1 Pending</Badge>
              </div>
              <div>
                <p className="text-gray-600">JEE Rank</p>
                <p className="font-bold text-blue-600">#{candidateData.jeeDetails.rank}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-gray-600">Recommendation</p>
                <p className="font-medium text-green-600 mt-2">✓ Can be Approved</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
