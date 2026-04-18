import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import {
  Users,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Download,
  TrendingUp
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const stats = [
    { label: 'Total Applications', value: '1,234', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Review', value: '342', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Approved', value: '756', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Rejected', value: '136', icon: XCircle, color: 'bg-red-100 text-red-600' }
  ];

  const recentApplications = [
    {
      id: 'MTU2026001',
      name: 'Rahul Sharma',
      course: 'Computer Science',
      date: '2026-04-15',
      status: 'pending'
    },
    {
      id: 'MTU2026002',
      name: 'Priya Singh',
      course: 'Electronics & Comm.',
      date: '2026-04-15',
      status: 'approved'
    },
    {
      id: 'MTU2026003',
      name: 'Amit Kumar',
      course: 'Mechanical Engg.',
      date: '2026-04-14',
      status: 'under_review'
    },
    {
      id: 'MTU2026004',
      name: 'Sneha Patel',
      course: 'Civil Engineering',
      date: '2026-04-14',
      status: 'pending'
    },
    {
      id: 'MTU2026005',
      name: 'Ravi Verma',
      course: 'IT',
      date: '2026-04-13',
      status: 'approved'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage B.Tech admissions 2026</p>
        </div>
        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest admission applications</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.course}</TableCell>
                  <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/review/${app.id}`)}>View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div>
                <CardTitle className="text-lg">Verify Documents</CardTitle>
                <CardDescription>342 pending verification</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>View admission trends</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Manage Users</CardTitle>
                <CardDescription>Staff & candidates</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
