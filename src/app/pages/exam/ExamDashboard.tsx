import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Upload, Download, CheckSquare } from 'lucide-react';

export function ExamDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Examination Section</h1>
        <p className="text-gray-600">Manage entrance exams and results</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div>
                <CardTitle className="text-lg">Admit Cards</CardTitle>
                <CardDescription>Generate & distribute</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              <Download className="w-4 h-4 mr-2" />
              Generate All
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Upload Results</CardTitle>
                <CardDescription>Merit list publication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Upload Results
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Reports</CardTitle>
                <CardDescription>Exam analytics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
