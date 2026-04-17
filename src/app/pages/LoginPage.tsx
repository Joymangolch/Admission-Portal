import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { Alert, AlertDescription } from '../components/ui/alert';
import { GraduationCap, Smartphone, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const success = await login(mobile, otp);
    setLoading(false);

    if (success) {
      // Navigate based on role
      // This will be handled by the router protection
      navigate('/dashboard');
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <GraduationCap className="w-10 h-10 text-[#1E3A8A]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MTU Admission Portal</h1>
          <p className="text-blue-100">Login to continue your application</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'mobile' ? 'Enter Mobile Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'mobile'
                ? 'We will send you a one-time password'
                : `OTP sent to +91 ${mobile}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'mobile' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-gray-100 rounded-md border">
                      <span className="text-gray-600">+91</span>
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1"
                      maxLength={10}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>

                {/* Demo credentials hint */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Demo Login Credentials:</p>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><strong>Candidate:</strong> 9876543210</p>
                    <p><strong>Admin:</strong> 9876543211</p>
                    <p><strong>HOD:</strong> 9876543212</p>
                    <p><strong>Exam:</strong> 9876543213</p>
                    <p><strong>Registrar:</strong> 9876543214</p>
                    <p><strong>Accounts:</strong> 9876543215</p>
                    <p className="mt-2"><strong>OTP:</strong> 123456</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep('mobile');
                      setOtp('');
                      setError('');
                    }}
                    className="flex-1"
                  >
                    Change Number
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm"
                  onClick={() => {
                    // Resend OTP logic
                    setError('');
                  }}
                >
                  Didn't receive OTP? Resend
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-sm text-blue-100">
          Need help? Contact{' '}
          <a href="mailto:support@mtu.edu.in" className="text-white underline">
            support@mtu.edu.in
          </a>
        </p>
      </div>
    </div>
  );
}
