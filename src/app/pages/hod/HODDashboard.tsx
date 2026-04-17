import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

export function HODDashboard() {
  const departmentStats = [
    { label: 'Total Applicants', value: '245', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Seats Available', value: '60', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { label: 'Avg. JEE Rank', value: '15,234', icon: Award, color: 'bg-purple-100 text-purple-600' },
    { label: 'Filled Seats', value: '45/60', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' }
  ];

  const courseAllocation = [
    { name: 'Computer Science & Engineering', applicants: 245, seats: 60, filled: 45 },
    { name: 'Information Technology', applicants: 180, seats: 60, filled: 38 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HOD Dashboard</h1>
        <p className="text-gray-600">Department of Computer Science & Engineering</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departmentStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Course Seat Allocation</CardTitle>
          <CardDescription>Current admission status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {courseAllocation.map((course, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{course.name}</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {course.applicants} applicants
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seats Filled</span>
                  <span className="font-medium">{course.filled} / {course.seats}</span>
                </div>
                <Progress value={(course.filled / course.seats) * 100} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>View All Candidates</CardTitle>
            <CardDescription>Review applications for your department</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              View Candidates
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Update course details and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
