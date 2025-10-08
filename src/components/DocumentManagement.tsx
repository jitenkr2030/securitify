"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/FileUpload";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Calendar,
  User,
  Search,
  Filter,
  Trash2,
  Edit,
  RefreshCw,
  Shield,
  Award,
  IdCard,
  FileImage
} from "lucide-react";

interface Document {
  id: string;
  type: 'aadhaar' | 'police_verification' | 'training_certificate' | 'license' | 'other';
  name: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedBy: string;
  uploadedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  expiryDate?: string;
  rejectionReason?: string;
  metadata?: Record<string, any>;
}

interface DocumentManagementProps {
  guardId?: string;
  adminMode?: boolean;
  onDocumentUpdate?: (document: Document) => void;
}

const DOCUMENT_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', icon: IdCard, color: 'bg-blue-500' },
  { value: 'police_verification', label: 'Police Verification', icon: Shield, color: 'bg-red-500' },
  { value: 'training_certificate', label: 'Training Certificate', icon: Award, color: 'bg-green-500' },
  { value: 'license', label: 'License', icon: FileText, color: 'bg-purple-500' },
  { value: 'other', label: 'Other Document', icon: FileImage, color: 'bg-gray-500' }
];

const STATUS_COLORS = {
  pending: 'bg-yellow-500 text-white',
  verified: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white'
};

const STATUS_LABELS = {
  pending: 'Pending Verification',
  verified: 'Verified',
  rejected: 'Rejected'
};

export default function DocumentManagement({ 
  guardId, 
  adminMode = false, 
  onDocumentUpdate 
}: DocumentManagementProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: '',
    name: '',
    expiryDate: '',
    notes: ''
  });
  const [verificationAction, setVerificationAction] = useState<'verify' | 'reject'>('verify');
  const [verificationNotes, setVerificationNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        type: 'aadhaar',
        name: 'Aadhaar Card - Front',
        fileUrl: '/api/placeholder/document1',
        fileSize: 245760,
        mimeType: 'image/jpeg',
        status: 'verified',
        uploadedBy: 'Rajesh Kumar',
        uploadedAt: '2024-01-15T10:30:00Z',
        verifiedBy: 'Admin User',
        verifiedAt: '2024-01-15T11:00:00Z',
        metadata: { documentNumber: '1234-5678-9012' }
      },
      {
        id: '2',
        type: 'police_verification',
        name: 'Police Verification Certificate',
        fileUrl: '/api/placeholder/document2',
        fileSize: 512000,
        mimeType: 'application/pdf',
        status: 'pending',
        uploadedBy: 'Rajesh Kumar',
        uploadedAt: '2024-01-20T14:15:00Z',
        expiryDate: '2025-01-20T00:00:00Z'
      },
      {
        id: '3',
        type: 'training_certificate',
        name: 'Security Training Certificate',
        fileUrl: '/api/placeholder/document3',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        status: 'verified',
        uploadedBy: 'Rajesh Kumar',
        uploadedAt: '2024-01-10T09:00:00Z',
        verifiedBy: 'Admin User',
        verifiedAt: '2024-01-10T09:30:00Z',
        expiryDate: '2026-01-10T00:00:00Z'
      }
    ];

    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(doc => doc.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(doc => doc.status === filterStatus);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, filterType, filterStatus]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!newDocument.type || !newDocument.name) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type: newDocument.type as any,
        name: newDocument.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
        status: 'pending',
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        expiryDate: newDocument.expiryDate || undefined,
        metadata: {
          notes: newDocument.notes,
          originalFileName: file.name
        }
      };

      setDocuments(prev => [newDoc, ...prev]);
      setUploadProgress(0);
      setShowUploadModal(false);
      setNewDocument({ type: '', name: '', expiryDate: '', notes: '' });
      
      onDocumentUpdate?.(newDoc);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document verification/rejection
  const handleDocumentAction = async () => {
    if (!selectedDocument) return;

    try {
      const updatedDocument: Document = {
        ...selectedDocument,
        status: verificationAction === 'verify' ? 'verified' : 'rejected',
        verifiedBy: 'Admin User',
        verifiedAt: new Date().toISOString(),
        rejectionReason: verificationAction === 'reject' ? verificationNotes : undefined
      };

      setDocuments(prev =>
        prev.map(doc => doc.id === selectedDocument.id ? updatedDocument : doc)
      );

      setShowVerifyModal(false);
      setVerificationNotes('');
      setSelectedDocument(null);
      
      onDocumentUpdate?.(updatedDocument);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    }
  };

  // Delete document
  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  // Download document
  const handleDownloadDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  // Get document type info
  const getDocumentTypeInfo = (type: string) => {
    return DOCUMENT_TYPES.find(dt => dt.value === type) || DOCUMENT_TYPES[4];
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if document is expiring soon
  const isExpiringSoon = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Check if document is expired
  const isExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage and verify guard documents" : "Upload and manage your documents"}
          </p>
        </div>
        
        {!adminMode && (
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'verified').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {documents.filter(d => isExpiringSoon(d.expiryDate)).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const typeInfo = getDocumentTypeInfo(document.type);
          const Icon = typeInfo.icon;
          
          return (
            <Card key={document.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg ${typeInfo.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{document.name}</h3>
                        <Badge className={STATUS_COLORS[document.status]}>
                          {STATUS_LABELS[document.status]}
                        </Badge>
                        
                        {isExpiringSoon(document.expiryDate) && (
                          <Badge variant="outline" className="border-orange-500 text-orange-700">
                            Expiring Soon
                          </Badge>
                        )}
                        
                        {isExpired(document.expiryDate) && (
                          <Badge variant="destructive">
                            Expired
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                        <div>
                          <span className="font-medium">Type:</span> {typeInfo.label}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}
                        </div>
                        <div>
                          <span className="font-medium">Uploaded:</span> {new Date(document.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {document.expiryDate && (
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Expiry Date:</span> {new Date(document.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {document.verifiedBy && (
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Verified by:</span> {document.verifiedBy} on {new Date(document.verifiedAt!).toLocaleDateString()}
                        </div>
                      )}
                      
                      {document.rejectionReason && (
                        <Alert className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Rejection Reason:</strong> {document.rejectionReason}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    {adminMode && document.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            setVerificationAction('verify');
                            setShowVerifyModal(true);
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            setVerificationAction('reject');
                            setShowVerifyModal(true);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No documents match your current filters."
                  : "No documents have been uploaded yet."
                }
              </p>
              {!adminMode && (
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a new document for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select 
                  value={newDocument.type} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newDocument.expiryDate}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newDocument.notes}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>File Upload</Label>
                {guardId ? (
                  <FileUpload
                    guardId={guardId}
                    onUploadComplete={(document) => {
                      // Add the uploaded document to the list
                      setDocuments(prev => [...prev, document]);
                      setShowUploadModal(false);
                      setNewDocument({
                        type: '',
                        name: '',
                        expiryDate: '',
                        notes: ''
                      });
                    }}
                  />
                ) : (
                  <Alert>
                    <AlertDescription>
                      Please select a guard first to upload documents.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !newDocument.type || !newDocument.name}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verify/Reject Modal */}
      {showVerifyModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {verificationAction === 'verify' ? 'Verify Document' : 'Reject Document'}
              </CardTitle>
              <CardDescription>
                {verificationAction === 'verify' 
                  ? 'Are you sure you want to verify this document?'
                  : 'Please provide a reason for rejecting this document.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${getDocumentTypeInfo(selectedDocument.type).color} flex items-center justify-center`}>
                    {React.createElement(getDocumentTypeInfo(selectedDocument.type).icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedDocument.name}</h4>
                    <p className="text-sm text-muted-foreground">{getDocumentTypeInfo(selectedDocument.type).label}</p>
                  </div>
                </div>
              </div>
              
              {verificationAction === 'reject' && (
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <Textarea
                    id="rejectionReason"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Please explain why this document is being rejected..."
                    rows={3}
                    required
                  />
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerificationNotes('');
                    setSelectedDocument(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDocumentAction}
                  disabled={verificationAction === 'reject' && !verificationNotes.trim()}
                  variant={verificationAction === 'verify' ? 'default' : 'destructive'}
                  className="flex-1"
                >
                  {verificationAction === 'verify' ? 'Verify' : 'Reject'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}