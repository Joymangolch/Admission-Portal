import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function AdmissionPathwayPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Admission Pathway
            </h1>
            <p className="text-lg text-blue-100">
              Select the path that matches your qualifications
            </p>
          </div>
        </div>
      </section>

      {/* Admission Pathways */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* JEE Main Route */}
            <Card className="border-2 border-[#1E3A8A] hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">JEE Main Route</CardTitle>
                <CardDescription>For JEE Main qualified candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Valid JEE Main score required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Merit-based seat allocation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">All branches available</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-6 bg-[#1E3A8A] hover:bg-[#1a2d5c] text-white">
                  <Link to="/login?pathway=jee">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Direct Admission */}
            <Card className="border-2 border-[#1E3A8A] hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Direct Admission</CardTitle>
                <CardDescription>For non-JEE candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Based on 10+2 marks (PCM)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Minimum 60% aggregate required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Subject to seat availability</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-6 bg-[#1E3A8A] hover:bg-[#1a2d5c] text-white">
                  <Link to="/login?pathway=non-jee">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-4">
              Choose the pathway that matches your qualification. You'll provide detailed information during the registration process.
            </p>
            <p className="text-sm text-gray-500">
              For any queries, please contact our admissions office.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
