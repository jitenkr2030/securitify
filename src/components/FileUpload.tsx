"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface FileUploadProps {
  guardId: string;
  onUploadComplete?: (document: any) => void;
  onUploadError?: (error: string) => void;
}

interface UploadResult {
  message: string;
  document: {
    id: string;
    type: string;
    name: string;
    fileUrl: string;
    status: string;
    expiryDate?: string;
    createdAt: string;
    guard: {
      id: string;
      name: string;
      phone: string;
    };
  };
}

export default function FileUpload({ guardId, onUploadComplete, onUploadError }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadError('Invalid file type. Only PDF, JPEG, and PNG files are allowed.');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setUploadError('File size exceeds 5MB limit.');
        return;
      }

      setFile(selectedFile);
      setUploadError(null);
      
      // Auto-fill document name if not set
      if (!documentName) {
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
        setDocumentName(nameWithoutExtension);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType || !documentName) {
      setUploadError('Please select a file and fill in all required fields.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('guardId', guardId);
      formData.append('documentType', documentType);
      formData.append('documentName', documentName);
      if (expiryDate) {
        formData.append('expiryDate', expiryDate);
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        onUploadComplete?.(result.document);
        
        // Reset form
        setFile(null);
        setDocumentType("");
        setDocumentName("");
        setExpiryDate("");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadError(result.error || 'Upload failed');
        onUploadError?.(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Network error during upload');
      onUploadError?.('Network error during upload');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Upload verification documents for guard profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Type */}
        <div>
          <Label htmlFor="documentType">Document Type *</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
              <SelectItem value="police_verification">Police Verification Certificate</SelectItem>
              <SelectItem value="training_certificate">Training Certificate</SelectItem>
              <SelectItem value="license">License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Document Name */}
        <div>
          <Label htmlFor="documentName">Document Name *</Label>
          <Input
            id="documentName"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name"
          />
        </div>

        {/* File Selection */}
        <div>
          <Label htmlFor="file">Select File *</Label>
          <div className="mt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Click to select a file'}
                </p>
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, JPEG, PNG (Max 5MB)
          </p>
        </div>

        {/* Expiry Date */}
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div>
            <Label>Uploading...</Label>
            <Progress value={uploadProgress} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Upload successful!</p>
                <p className="text-sm">Document: {uploadResult.document.name}</p>
                <p className="text-sm">Status: {uploadResult.document.status}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Error */}
        {uploadError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || !documentType || !documentName || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}