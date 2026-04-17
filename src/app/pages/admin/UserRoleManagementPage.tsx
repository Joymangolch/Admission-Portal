import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  Users,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

type AdminRole = 'admin' | 'hod' | 'registrar' | 'examiner' | 'accounts';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export function UserRoleManagementPage() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'ADM001',
      name: 'Admin User',
      email: 'admin@university.ac.in',
      role: 'admin',
      joinDate: '2025-01-15',
      status: 'active',
      lastActive: '2 min ago'
    },
    {
      id: 'HOD001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@university.ac.in',
      role: 'hod',
      department: 'Computer Science',
      joinDate: '2025-02-10',
      status: 'active',
      lastActive: '30 min ago'
    },
    {
      id: 'REG001',
      name: 'Ms. Priya Singh',
      email: 'priya@university.ac.in',
      role: 'registrar',
      joinDate: '2025-01-20',
      status: 'active',
      lastActive: '1 hour ago'
    }
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin' as AdminRole,
    department: ''
  });

  const roleConfig: { [key in AdminRole]: { label: string; color: string; description: string } } = {
    admin: { label: 'Administrator', color: 'bg-red-100 text-red-800', description: 'Full system access' },
    hod: { label: 'Head of Department', color: 'bg-blue-100 text-blue-800', description: 'Department-level access' },
    registrar: { label: 'Registrar', color: 'bg-purple-100 text-purple-800', description: 'Registrar access' },
    examiner: { label: 'Examiner', color: 'bg-green-100 text-green-800', description: 'Exam related access' },
    accounts: { label: 'Accounts Officer', color: 'bg-yellow-100 text-yellow-800', description: 'Accounts access' }
  };

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser: AdminUser = {
      id: `ADM${String(adminUsers.length + 1).padStart(3, '0')}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      department: newAdmin.department,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastActive: 'just now'
    };

    setAdminUsers([...adminUsers, newUser]);
    setNewAdmin({ name: '', email: '', role: 'admin', department: '' });
    setShowCreateDialog(false);
    toast.success('Admin user created successfully');
  };

  const handleDeleteUser = (id: string) => {
    setAdminUsers(adminUsers.filter(user => user.id !== id));
    toast.success('User removed successfully');
  };

  const activityLog = [
    { time: '2026-04-17 14:30', user: 'Admin User', action: 'Approved 5 applications', type: 'approval' },
    { time: '2026-04-17 13:15', user: 'Dr. Rajesh Kumar', action: 'Viewed department reports', type: 'view' },
    { time: '2026-04-17 12:00', user: 'Ms. Priya Singh', action: 'Updated exam schedule', type: 'edit' },
    { time: '2026-04-17 11:45', user: 'Admin User', action: 'Rejected 2 applications', type: 'rejection' },
    { time: '2026-04-17 10:30', user: 'Dr. Rajesh Kumar', action: 'Exported candidate list', type: 'export' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
          <p className="text-gray-600 mt-1">Manage admin users and their roles</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Add a new administrator to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newAdmin.role} onValueChange={(value: AdminRole) => setNewAdmin({ ...newAdmin, role: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        {val.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newAdmin.role === 'hod' && (
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                    placeholder="Enter department name"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold mt-1">{adminUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {adminUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {adminUsers.filter(u => u.status === 'inactive').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>All system administrators and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleConfig[user.role].color}>
                        {roleConfig[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Edit functionality coming soon')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Permissions assigned to each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(roleConfig).map(([roleKey, roleInfo]) => (
              <div key={roleKey} className={`p-4 rounded-lg border-2 ${roleInfo.color}`}>
                <h4 className="font-semibold mb-2">{roleInfo.label}</h4>
                <p className="text-sm mb-3 opacity-75">{roleInfo.description}</p>
                <div className="text-xs space-y-1">
                  <div>✓ View Applications</div>
                  <div>✓ Generate Reports</div>
                  {(roleKey === 'admin' || roleKey === 'hod') && <div>✓ Approve/Reject Apps</div>}
                  {roleKey === 'admin' && (
                    <>
                      <div>✓ Manage Users</div>
                      <div>✓ System Settings</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest admin actions in the system</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActivityLog(!showActivityLog)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showActivityLog ? 'Hide' : 'View'} Log
            </Button>
          </div>
        </CardHeader>
        {showActivityLog && (
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((log, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      log.type === 'approval' ? 'bg-green-500' :
                      log.type === 'rejection' ? 'bg-red-500' :
                      log.type === 'edit' ? 'bg-blue-500' :
                      log.type === 'export' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {log.type === 'approval' ? '✓' : log.type === 'rejection' ? '✕' : '⚙'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{log.action}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-600">by {log.user}</p>
                      <p className="text-xs text-gray-600">{log.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
