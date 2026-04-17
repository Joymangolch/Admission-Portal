import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
  Download,
  Copy,
  Trash2,
  Calendar,
  MapPin,
  Users,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface Exam {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  examCenter: string;
  centerCode: string;
  assignedCandidates: number;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export function ExamManagementPage() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'EXAM001',
      name: 'B.Tech Entrance Exam 2026',
      date: '2026-07-25',
      time: '10:00 AM',
      duration: '3 hours',
      examCenter: 'Center A - Block 1',
      centerCode: 'CNTR-A1',
      assignedCandidates: 500,
      status: 'scheduled'
    },
    {
      id: 'EXAM002',
      name: 'B.Tech Entrance Exam 2026 - Center B',
      date: '2026-07-25',
      time: '02:00 PM',
      duration: '3 hours',
      examCenter: 'Center B - Block 2',
      centerCode: 'CNTR-B1',
      assignedCandidates: 480,
      status: 'scheduled'
    }
  ]);

  const [newExam, setNewExam] = useState({
    name: '',
    date: '',
    time: '',
    duration: '3 hours',
    examCenter: '',
    centerCode: ''
  });

  const handleCreateExam = () => {
    if (!newExam.name || !newExam.date || !newExam.time || !newExam.examCenter) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newExamRecord: Exam = {
      id: `EXAM${String(exams.length + 1).padStart(3, '0')}`,
      name: newExam.name,
      date: newExam.date,
      time: newExam.time,
      duration: newExam.duration,
      examCenter: newExam.examCenter,
      centerCode: newExam.centerCode,
      assignedCandidates: 0,
      status: 'scheduled'
    };

    setExams([...exams, newExamRecord]);
    setNewExam({
      name: '',
      date: '',
      time: '',
      duration: '3 hours',
      examCenter: '',
      centerCode: ''
    });
    setShowCreateDialog(false);
    toast.success('Exam scheduled successfully');
  };

  const handleGenerateAdmitCards = (examId: string) => {
    toast.info('Generating admit cards. This may take a few minutes...');
    setTimeout(() => {
      toast.success('Admit cards generated and sent to candidates');
    }, 2000);
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter(exam => exam.id !== id));
    toast.success('Exam deleted successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Schedule exams and manage exam centers</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Exam</DialogTitle>
              <DialogDescription>
                Add a new exam date and center details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="exam-name">Exam Name</Label>
                <Input
                  id="exam-name"
                  value={newExam.name}
                  onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                  placeholder="e.g., B.Tech Entrance Exam 2026"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exam-date">Exam Date</Label>
                  <Input
                    id="exam-date"
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="exam-time">Exam Time</Label>
                  <Input
                    id="exam-time"
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                  placeholder="e.g., 3 hours"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="center">Exam Center</Label>
                <Input
                  id="center"
                  value={newExam.examCenter}
                  onChange={(e) => setNewExam({ ...newExam, examCenter: e.target.value })}
                  placeholder="e.g., Center A - Block 1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="center-code">Center Code</Label>
                <Input
                  id="center-code"
                  value={newExam.centerCode}
                  onChange={(e) => setNewExam({ ...newExam, centerCode: e.target.value })}
                  placeholder="e.g., CNTR-A1"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExam}>Schedule Exam</Button>
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
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold mt-1">{exams.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold mt-1">
                  {exams.reduce((sum, exam) => sum + exam.assignedCandidates, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Exams</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {exams.filter(e => e.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Exams</CardTitle>
          <CardDescription>All exams and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Exam Center</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{new Date(exam.date).toLocaleDateString()}</p>
                        <p className="text-gray-600">{exam.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{exam.examCenter}</p>
                        <p className="text-gray-600">{exam.centerCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>{exam.assignedCandidates}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateAdmitCards(exam.id)}
                          title="Generate Admit Cards"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Edit functionality coming soon')}
                          title="Edit Exam"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteExam(exam.id)}
                          title="Delete Exam"
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

      {/* Assign Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Candidates to Exams</CardTitle>
          <CardDescription>Distribute candidates among exam centers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>How to assign candidates:</strong> System automatically assigns candidates to exam centers based on their category and preferred center (if available). You can manually reassign candidates from this interface.
            </p>
          </div>
          <Button className="w-full" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Auto-Assign Candidates
          </Button>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
          <CardDescription>Key dates for exam management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Application Deadline</p>
              <p className="font-bold text-lg mt-1">June 30, 2026</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Exam Date</p>
              <p className="font-bold text-lg mt-1">July 25, 2026</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Result Declaration</p>
              <p className="font-bold text-lg mt-1">August 5, 2026</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Counselling</p>
              <p className="font-bold text-lg mt-1">August 10-15, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Centers Info */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Centers</CardTitle>
          <CardDescription>List of all exam centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Center A - Block 1', address: 'Main Campus, Building A', capacity: 500 },
              { name: 'Center B - Block 2', address: 'Main Campus, Building B', capacity: 480 },
              { name: 'Center C - Annex', address: 'Annex Campus', capacity: 300 }
            ].map((center, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{center.name}</p>
                    <p className="text-sm text-gray-600">{center.address}</p>
                    <p className="text-sm text-gray-600 mt-2">Capacity: <strong>{center.capacity}</strong> students</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
