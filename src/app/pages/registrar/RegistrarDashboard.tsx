import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { UserCheck, FileCheck, Award, Settings } from 'lucide-react';

export function RegistrarDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Dashboard</h1>
        <p className="text-gray-600">Enrollment and record management</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900">756</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Verification</p>
                <p className="text-3xl font-bold text-gray-900">42</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Certificates Issued</p>
                <p className="text-3xl font-bold text-gray-900">698</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Settings className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>Student Enrollments</CardTitle>
            <CardDescription>Manage student records and enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              View Enrollments
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>Academic Records</CardTitle>
            <CardDescription>Access student academic history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Records
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
