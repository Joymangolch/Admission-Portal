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
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Result {
  rollNumber: string;
  candidateName: string;
  mathematics: number;
  physics: number;
  chemistry: number;
  english: number;
  totalScore: number;
  status: 'draft' | 'published';
}

export function ResultManagementPage() {
  const navigate = useNavigate();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [resultPublished, setResultPublished] = useState(false);

  const [results, setResults] = useState<Result[]>([
    {
      rollNumber: 'MTU2026001',
      candidateName: 'Rahul Sharma',
      mathematics: 92,
      physics: 88,
      chemistry: 85,
      english: 78,
      totalScore: 343,
      status: 'draft'
    },
    {
      rollNumber: 'MTU2026002',
      candidateName: 'Priya Singh',
      mathematics: 95,
      physics: 91,
      chemistry: 89,
      english: 85,
      totalScore: 360,
      status: 'draft'
    },
    {
      rollNumber: 'MTU2026003',
      candidateName: 'Amit Kumar',
      mathematics: 78,
      physics: 82,
      chemistry: 79,
      english: 75,
      totalScore: 314,
      status: 'draft'
    }
  ]);

  const [newResult, setNewResult] = useState({
    rollNumber: '',
    candidateName: '',
    mathematics: 0,
    physics: 0,
    chemistry: 0,
    english: 0
  });

  const handleAddResult = () => {
    if (!newResult.rollNumber || !newResult.candidateName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result: Result = {
      ...newResult,
      totalScore: newResult.mathematics + newResult.physics + newResult.chemistry + newResult.english,
      status: 'draft'
    };

    setResults([...results, result]);
    setNewResult({
      rollNumber: '',
      candidateName: '',
      mathematics: 0,
      physics: 0,
      chemistry: 0,
      english: 0
    });
    setShowManualEntry(false);
    toast.success('Result added successfully');
  };

  const handlePublishResults = () => {
    setResultPublished(true);
    toast.success('Results published! Candidates have been notified');
  };

  const handleDeleteResult = (rollNumber: string) => {
    setResults(results.filter(r => r.rollNumber !== rollNumber));
    toast.success('Result deleted');
  };

  const handleUploadCSV = () => {
    toast.success('CSV file uploaded. Processing 50 records...');
    setTimeout(() => {
      toast.success('All results imported successfully');
      setShowUploadDialog(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast.success('CSV template downloaded');
  };

  const totalResults = results.length;
  const processedResults = results.filter(r => r.status !== 'draft').length;
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.totalScore, 0) / totalResults
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Result Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage exam results</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Results CSV</DialogTitle>
                <DialogDescription>
                  Import results in bulk using a CSV file
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-3">
                    <strong>CSV Format:</strong> Roll Number, Name, Math, Physics, Chemistry, English
                  </p>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Drag and drop your CSV file here</p>
                  <p className="text-gray-500 text-xs mt-1">or click to select file</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadCSV}>Upload File</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Result
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Result Manually</DialogTitle>
                <DialogDescription>
                  Enter results for a single candidate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roll-number">Roll Number</Label>
                  <Input
                    id="roll-number"
                    value={newResult.rollNumber}
                    onChange={(e) => setNewResult({ ...newResult, rollNumber: e.target.value })}
                    placeholder="e.g., MTU2026001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="candidate-name">Candidate Name</Label>
                  <Input
                    id="candidate-name"
                    value={newResult.candidateName}
                    onChange={(e) => setNewResult({ ...newResult, candidateName: e.target.value })}
                    placeholder="Enter candidate name"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="math">Mathematics (100)</Label>
                    <Input
                      id="math"
                      type="number"
                      min="0"
                      max="100"
                      value={newResult.mathematics}
                      onChange={(e) => setNewResult({ ...newResult, mathematics: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="physics">Physics (100)</Label>
                    <Input
                      id="physics"
                      type="number"
                      min="0"
                      max="100"
                      value={newResult.physics}
                      onChange={(e) => setNewResult({ ...newResult, physics: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chemistry">Chemistry (100)</Label>
                    <Input
                      id="chemistry"
                      type="number"
                      min="0"
                      max="100"
                      value={newResult.chemistry}
                      onChange={(e) => setNewResult({ ...newResult, chemistry: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">English (100)</Label>
                    <Input
                      id="english"
                      type="number"
                      min="0"
                      max="100"
                      value={newResult.english}
                      onChange={(e) => setNewResult({ ...newResult, english: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Score</p>
                  <p className="text-2xl font-bold mt-1">
                    {newResult.mathematics + newResult.physics + newResult.chemistry + newResult.english}/400
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowManualEntry(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResult}>Add Result</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Results</p>
              <p className="text-2xl font-bold mt-1">{totalResults}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{processedResults}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{totalResults - processedResults}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold mt-1">{averageScore}/400</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Status Alert */}
      {!resultPublished && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <CardTitle className="text-yellow-900">Results Not Published</CardTitle>
                  <CardDescription className="text-yellow-800">
                    Results are in draft status. Publish to notify candidates.
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={handlePublishResults}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Results
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {resultPublished && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle className="text-green-900">Results Published</CardTitle>
                <CardDescription className="text-green-800">
                  All candidates have been notified of their results
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>All candidate results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead className="text-right">Math</TableHead>
                  <TableHead className="text-right">Physics</TableHead>
                  <TableHead className="text-right">Chemistry</TableHead>
                  <TableHead className="text-right">English</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.rollNumber}>
                    <TableCell className="font-medium">{result.rollNumber}</TableCell>
                    <TableCell>{result.candidateName}</TableCell>
                    <TableCell className="text-right">{result.mathematics}</TableCell>
                    <TableCell className="text-right">{result.physics}</TableCell>
                    <TableCell className="text-right">{result.chemistry}</TableCell>
                    <TableCell className="text-right">{result.english}</TableCell>
                    <TableCell className="text-right font-bold">{result.totalScore}/400</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          result.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {result.status}
                      </Badge>
                    </TableCell>
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
                          onClick={() => handleDeleteResult(result.rollNumber)}
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

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Score range analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { range: '350-400', count: 2, percentage: 67, color: 'bg-green-500' },
              { range: '300-349', count: 1, percentage: 33, color: 'bg-yellow-500' },
              { range: '250-299', count: 0, percentage: 0, color: 'bg-orange-500' },
              { range: '< 250', count: 0, percentage: 0, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.range}</span>
                  <span className="text-sm text-gray-600">{item.count} candidates</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
