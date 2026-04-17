import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Building
} from 'lucide-react';

export function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              B.Tech Admissions 2026
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Shape Your Future at Manipur Technical University
            </p>
            <p className="text-lg mb-10 text-blue-50">
              Applications are now open for JEE & Non-JEE candidates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-blue-50 text-lg px-8 py-6">
                <Link to="/login">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-[#1E3A8A] hover:bg-blue-50 text-lg px-8 py-6">
                <Link to="/courses">View Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5000+</h3>
              <p className="text-gray-600">Students Enrolled</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">B.Tech Specializations</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">AICTE</h3>
              <p className="text-gray-600">Approved Programs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Building className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Placement Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Pathways */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Admission Pathways
            </h2>
            <p className="text-lg text-gray-600">Choose your path to MTU</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-[#1E3A8A] transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">JEE Main Route</CardTitle>
                <CardDescription>For JEE Main qualified candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Valid JEE Main score required</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Merit-based seat allocation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>All branches available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#1E3A8A] transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Direct Admission</CardTitle>
                <CardDescription>For non-JEE candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Based on 10+2 marks (PCM)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Minimum 60% aggregate required</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Subject to seat availability</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Offered */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              B.Tech Programs Offered
            </h2>
            <p className="text-lg text-gray-600">Choose from our industry-aligned specializations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Computer Science & Engineering',
              'Electronics & Communication',
              'Mechanical Engineering',
              'Civil Engineering',
              'Electrical Engineering',
              'Information Technology',
              'Chemical Engineering',
              'Biotechnology',
              'Artificial Intelligence & ML'
            ].map((course) => (
              <Card key={course} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-[#1E3A8A]" />
                    </div>
                    <CardTitle className="text-lg">{course}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">4 Years • 60 Seats</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/courses">
                      View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fee Structure 2026
            </h2>
            <p className="text-lg text-gray-600">Transparent and affordable education</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Tuition Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1E3A8A]">₹65,000</p>
                <p className="text-gray-600 mt-2">Per Year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Hostel Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1E3A8A]">₹25,000</p>
                <p className="text-gray-600 mt-2">Per Year (Optional)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Other Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1E3A8A]">₹10,000</p>
                <p className="text-gray-600 mt-2">One-time (Admission)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Important Dates
            </h2>
            <p className="text-lg text-gray-600">Mark your calendar</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { event: 'Application Start Date', date: 'May 1, 2026' },
              { event: 'Last Date to Apply', date: 'June 30, 2026' },
              { event: 'Document Verification', date: 'July 1-15, 2026' },
              { event: 'Merit List Publication', date: 'July 20, 2026' },
              { event: 'Counseling Rounds', date: 'July 25 - Aug 5, 2026' },
              { event: 'Classes Commence', date: 'August 15, 2026' }
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-[#1E3A8A]" />
                    </div>
                    <span className="font-medium text-gray-900">{item.event}</span>
                  </div>
                  <span className="text-[#1E3A8A] font-semibold">{item.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students building their careers at MTU
          </p>
          <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-blue-50 text-lg px-8 py-6">
            <Link to="/login">Start Your Application</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
