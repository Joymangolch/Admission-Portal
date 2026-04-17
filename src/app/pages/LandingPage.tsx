import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  GraduationCap,
  Calendar,
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
              Start your application journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-blue-50 text-lg px-8 py-6">
                <Link to="/apply">Apply Now</Link>
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
                <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
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
      {/* Section removed - now shown after Apply Now click */}

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
            <Link to="/apply">Start Your Application</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
