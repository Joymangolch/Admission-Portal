import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  Lock,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export function PaymentPage() {
  const { user } = useAuth();
  const { application } = useApplication();
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fee calculation based on category
  const getFeeStructure = () => {
    const baseStructure: { [key: string]: number } = {
      'General': 2500,
      'OBC': 1500,
      'SC': 500,
      'ST': 500
    };
    return baseStructure[application.personalDetails.category] || 2500;
  };

  const fees = {
    applicationFee: getFeeStructure(),
    processingFee: 100,
    gst: Math.round((getFeeStructure() + 100) * 0.18),
  };

  const totalAmount = fees.applicationFee + fees.processingFee + fees.gst;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate payment success (80% success rate)
      const success = Math.random() > 0.2;
      if (success) {
        setPaymentStatus('success');
        toast.success('Payment successful! Your application is now active.');
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
      }
      setIsProcessing(false);
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully');
  };

  if (paymentStatus === 'success') {
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

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription className="text-green-600">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-medium">TXN12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Razorpay</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Return to Dashboard
              </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Your application is now active</li>
                <li>✓ You will receive a confirmation email shortly</li>
                <li>✓ Track your application status in the dashboard</li>
                <li>✓ Download your admit card when available</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
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

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
            <CardDescription className="text-red-600">
              Unfortunately, your payment could not be processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Please check your card details and try again, or use a different payment method.
              </p>
            </div>
            <Button
              onClick={() => setPaymentStatus('pending')}
              className="w-full"
            >
              Retry Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
        <p className="text-gray-600 mt-1">Complete your payment to activate your application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm">Candidate Name</Label>
                  <p className="font-medium mt-1">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Category</Label>
                  <p className="font-medium mt-1">{application.personalDetails.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                    <div className="font-medium">Razorpay</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Netbanking</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 cursor-pointer">
                    <div className="font-medium">Direct Bank Transfer</div>
                    <div className="text-sm text-gray-600">Bank account details provided after selection</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Fee ({application.personalDetails.category}):</span>
                  <span>₹{fees.applicationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span>₹{fees.processingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%):</span>
                  <span>₹{fees.gst}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span className="text-lg text-[#1E3A8A]">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-800 mt-1">
                Your payment information is encrypted and secure. We use industry-standard SSL technology.
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-base"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ₹{totalAmount}
              </>
            )}
          </Button>
        </div>

        {/* Fee Summary Sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Fee Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fee:</span>
                  <span className="font-medium">₹{fees.applicationFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing:</span>
                  <span className="font-medium">₹{fees.processingFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST:</span>
                  <span className="font-medium">₹{fees.gst}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-[#1E3A8A]">₹{totalAmount}</span>
                </div>
              </div>

              <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                No Hidden Charges
              </Badge>

              {/* Category Info */}
              <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 space-y-1">
                <p className="font-medium">Fee Category: {application.personalDetails.category}</p>
                <p>Fee is determined by your selected category as per university guidelines.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
