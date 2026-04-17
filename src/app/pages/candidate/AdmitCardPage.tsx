import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Download, ArrowLeft, Printer, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function AdmitCardPage() {
  const { user } = useAuth();
  const { application } = useApplication();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
        toast.success('Admit card sent to printer');
      }
    }
  };

  const handleDownload = () => {
    toast.success('Admit card downloaded as PDF');
  };

  // Mock admit card data
  const admitCardData = {
    rollNumber: 'MTU2026001',
    examDate: '2026-07-25',
    examTime: '10:00 AM - 1:00 PM',
    examCenter: 'Center A - Block 1, Main Campus',
    centerCode: 'CNTR-A1',
    course: 'B.Tech - Computer Science & Engineering',
    reportingTime: '9:30 AM',
    instructions: [
      'Report 30 minutes before exam time',
      'Carry this admit card (printed or digital)',
      'Original ID proof is mandatory',
      'No electronic devices allowed in exam hall',
      'Arrive at your designated center on time'
    ]
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

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admit Card</h1>
        <p className="text-gray-600 mt-1">Your examination admit card</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleDownload}
          className="flex-1 min-w-fit"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1 min-w-fit"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button
          variant="outline"
          className="flex-1 min-w-fit"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Admit Card Preview */}
      <div
        ref={printRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-600 text-white p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">ADMIT CARD</h1>
            <p className="text-blue-100 mt-1">B.Tech Admission 2026</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Candidate Photo and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-40 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl text-gray-400">📷</div>
                  <p className="text-xs text-gray-600 mt-2">Candidate Photo</p>
                </div>
              </div>
              <div className="w-32 h-20 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center mt-4">
                <div className="text-center">
                  <div className="text-4xl text-gray-400">✍️</div>
                  <p className="text-xs text-gray-600 mt-1">Signature</p>
                </div>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase">Name</p>
                  <p className="font-bold text-lg mt-1">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase">Roll Number</p>
                  <p className="font-bold text-lg mt-1">{admitCardData.rollNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase">Course</p>
                  <p className="font-medium mt-1">{admitCardData.course}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase">Date of Birth</p>
                  <p className="font-medium mt-1">{application.personalDetails.dob}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Email</p>
                <p className="font-medium mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Exam Details */}
          <div className="border-t-2 border-b-2 border-gray-300 py-6">
            <h3 className="font-bold text-gray-900 mb-4">EXAMINATION DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-600 uppercase">Exam Date</p>
                <p className="font-bold text-lg mt-2">
                  {new Date(admitCardData.examDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Exam Time</p>
                <p className="font-bold text-lg mt-2">{admitCardData.examTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Reporting Time</p>
                <p className="font-bold text-lg mt-2">{admitCardData.reportingTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Center Code</p>
                <p className="font-bold text-lg mt-2">{admitCardData.centerCode}</p>
              </div>
            </div>
          </div>

          {/* Exam Center Details */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-4">EXAM CENTER</h3>
            <p className="font-medium text-lg">{admitCardData.examCenter}</p>
            <div className="mt-4 text-sm space-y-2 text-gray-700">
              <p><strong>Directions:</strong> Exam center is located near main entrance. Follow signage for your exam hall.</p>
              <p><strong>Parking:</strong> Free parking available at designated areas.</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">IMPORTANT INSTRUCTIONS</h3>
            <ul className="space-y-2 text-sm">
              {admitCardData.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-yellow-700 flex-shrink-0">{index + 1}.</span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xs text-gray-600 mb-2">Candidate's Signature</p>
                <div className="h-12 border-t border-gray-400"></div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Invigilator's Signature</p>
                <div className="h-12 border-t border-gray-400"></div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Authority Stamp</p>
                <div className="h-12 border border-gray-400 flex items-center justify-center">
                  <p className="text-xs text-gray-400">STAMP</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-6">
              This admit card is valid only with a valid identity proof. Lost admit card cannot be replaced.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What to Bring?</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Printed/Digital Admit Card</li>
              <li>Original Identity Proof (Aadhar/Passport/Driving License)</li>
              <li>Black & Blue Ball Point Pens</li>
              <li>Calculator (if applicable for your course)</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Prohibited Items</h4>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>Mobile phones and electronic devices</li>
              <li>Bags and wallets</li>
              <li>Pencils and erasers</li>
              <li>Any unauthorized materials</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">If You Have Any Issues</h4>
            <p className="text-sm text-green-800">
              Contact the exam center help desk or call our admission office at +91-9876543210 (available 24/7).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
