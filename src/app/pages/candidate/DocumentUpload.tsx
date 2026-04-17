import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  required: boolean;
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Passport Size Photograph', required: true, file: null, status: 'pending' },
    { id: '2', name: 'Signature', required: true, file: null, status: 'pending' },
    { id: '3', name: 'Class 10 Marksheet', required: true, file: null, status: 'pending' },
    { id: '4', name: 'Class 12 Marksheet', required: true, file: null, status: 'pending' },
    { id: '5', name: 'JEE Main Scorecard', required: false, file: null, status: 'pending' },
    { id: '6', name: 'Category Certificate', required: false, file: null, status: 'pending' },
    { id: '7', name: 'Domicile Certificate', required: false, file: null, status: 'pending' }
  ]);

  const handleFileSelect = (docId: string, file: File | null) => {
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, or PDF');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId
            ? { ...doc, file, status: 'uploaded' as const }
            : doc
        )
      );
      toast.success('File uploaded successfully');
    }
  };

  const handleRemove = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, file: null, status: 'pending' as const }
          : doc
      )
    );
    toast.success('File removed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(docId, file);
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>;
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const allRequiredUploaded = documents
    .filter(doc => doc.required)
    .every(doc => doc.file !== null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
        <p className="text-gray-600">Upload all required documents to complete your application</p>
      </div>

      {/* Instructions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>• Accepted formats: JPG, PNG, PDF</p>
          <p>• Maximum file size: 5 MB</p>
          <p>• Documents should be clear and readable</p>
          <p>• All required documents must be uploaded before final submission</p>
          <p>• Ensure your name matches across all documents</p>
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    {doc.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                    {getStatusIcon(doc.status)}
                  </div>
                  {getStatusBadge(doc.status)}
                  {doc.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2">Reason: {doc.rejectionReason}</p>
                  )}
                </div>
              </div>

              {doc.file ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{doc.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(doc.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(doc.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, doc.id)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.jpg,.jpeg,.png,.pdf';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileSelect(doc.id, file);
                    };
                    input.click();
                  }}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG or PDF (max. 5MB)</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Ready to submit?</h3>
              <p className="text-sm text-gray-600">
                {allRequiredUploaded
                  ? 'All required documents uploaded'
                  : 'Upload all required documents to continue'}
              </p>
            </div>
            <Button
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              disabled={!allRequiredUploaded}
            >
              Submit Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
