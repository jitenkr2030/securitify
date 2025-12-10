"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUpload from "@/components/FileUpload";
import { 
  User, 
  Shield, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  Edit,
  Download,
  Eye
} from "lucide-react";

interface Guard {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: string;
  status: string;
  salary: number;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  type: string;
  name: string;
  fileUrl: string;
  status: string;
  expiryDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrainingRecord {
  id: string;
  completionDate: string;
  expiryDate: string;
  score?: number;
  certificateUrl?: string;
  status: string;
  instructor?: string;
  notes?: string;
  training: {
    id: string;
    title: string;
    trainingType: string;
    duration: number;
  };
}

export default function PSARAGuardRegistration() {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);

  useEffect(() => {
    fetchGuards();
  }, []);

  useEffect(() => {
    if (selectedGuard) {
      fetchGuardDetails(selectedGuard.id);
    }
  }, [selectedGuard]);

  const fetchGuards = async () => {
    try {
      const response = await fetch('/api/guards');
      const data = await response.json();
      if (data.guards) {
        setGuards(data.guards);
      }
    } catch (error) {
      console.error('Error fetching guards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuardDetails = async (guardId: string) => {
    try {
      const [documentsResponse, trainingResponse] = await Promise.all([
        fetch(`/api/documents?guardId=${guardId}`),
        fetch(`/api/psara/training-records?guardId=${guardId}`)
      ]);

      const documentsData = await documentsResponse.json();
      const trainingData = await trainingResponse.json();

      if (documentsData.documents) {
        setDocuments(documentsData.documents);
      }

      if (trainingData.trainingRecords) {
        setTrainingRecords(trainingData.trainingRecords);
      }
    } catch (error) {
      console.error('Error fetching guard details:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTrainingStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const isDocumentExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const isTrainingExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Guard Registration</h1>
          <p className="text-gray-600 mt-2">
            Manage guard registration, training records, and police verification
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Guard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Guard</DialogTitle>
              <DialogDescription>
                Register a new guard with PSARA compliance requirements
              </DialogDescription>
            </DialogHeader>
            <GuardRegistrationForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guards List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Guards
            </CardTitle>
            <CardDescription>Select a guard to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {guards.map((guard) => (
                <div
                  key={guard.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedGuard?.id === guard.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedGuard(guard)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{guard.name}</h3>
                      <p className="text-sm text-gray-600">{guard.phone}</p>
                    </div>
                    {getStatusBadge(guard.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guard Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Guard Details
            </CardTitle>
            <CardDescription>
              {selectedGuard ? selectedGuard.name : 'Select a guard to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedGuard ? (
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="training">Training Records</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-gray-600">{selectedGuard.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-600">{selectedGuard.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{selectedGuard.email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-gray-600">{selectedGuard.address || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Salary</Label>
                      <p className="text-sm text-gray-600">₹{selectedGuard.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div>{getStatusBadge(selectedGuard.status)}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Required Documents</h3>
                    <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Upload Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Document</DialogTitle>
                          <DialogDescription>
                            Upload required PSARA compliance documents
                          </DialogDescription>
                        </DialogHeader>
                        <DocumentUploadForm 
                          guardId={selectedGuard.id} 
                          onSuccess={() => {
                            setIsDocumentDialogOpen(false);
                            fetchGuardDetails(selectedGuard.id);
                          }} 
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3">
                    {documents.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          No documents uploaded yet. Upload required PSARA compliance documents.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      documents.map((document) => (
                        <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium">{document.name}</h4>
                              <p className="text-sm text-gray-600">{document.type}</p>
                              {document.expiryDate && (
                                <p className="text-xs text-gray-500">
                                  Expires: {new Date(document.expiryDate).toLocaleDateString()}
                                  {isDocumentExpiringSoon(document.expiryDate) && (
                                    <Badge className="ml-2 bg-orange-100 text-orange-800">Expiring Soon</Badge>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getDocumentStatusBadge(document.status)}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Training Records</h3>
                    <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Training Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Training Record</DialogTitle>
                          <DialogDescription>
                            Record guard training completion and certification
                          </DialogDescription>
                        </DialogHeader>
                        <TrainingRecordForm 
                          guardId={selectedGuard.id} 
                          onSuccess={() => {
                            setIsTrainingDialogOpen(false);
                            fetchGuardDetails(selectedGuard.id);
                          }} 
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3">
                    {trainingRecords.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          No training records found. Add PSARA-mandated training records.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      trainingRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium">{record.training.title}</h4>
                              <p className="text-sm text-gray-600">{record.training.trainingType}</p>
                              <p className="text-xs text-gray-500">
                                Completed: {new Date(record.completionDate).toLocaleDateString()}
                                <br />
                                Expires: {new Date(record.expiryDate).toLocaleDateString()}
                                {isTrainingExpiringSoon(record.expiryDate) && (
                                  <Badge className="ml-2 bg-orange-100 text-orange-800">Expiring Soon</Badge>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrainingStatusBadge(record.status)}
                            {record.score && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Score: {record.score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a guard to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Guard Registration Form Component
function GuardRegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    salary: '',
    hourlyRate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/guards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating guard:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="salary">Salary *</Label>
          <Input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Create Guard</Button>
      </div>
    </form>
  );
}

// Document Upload Form Component
function DocumentUploadForm({ guardId, onSuccess }: { guardId: string; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    expiryDate: '',
  });
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guardId,
          fileUrl,
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Document Type *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
            <SelectItem value="police_verification">Police Verification</SelectItem>
            <SelectItem value="training_certificate">Training Certificate</SelectItem>
            <SelectItem value="license">License</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="name">Document Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
      </div>
      <div>
        <Label>Document File *</Label>
        <FileUpload guardId={guardId} onUploadComplete={(document) => setFileUrl(document.fileUrl)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={!fileUrl}>
          Upload Document
        </Button>
      </div>
    </form>
  );
}

// Training Record Form Component
function TrainingRecordForm({ guardId, onSuccess }: { guardId: string; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    trainingId: '',
    completionDate: '',
    expiryDate: '',
    score: '',
    instructor: '',
    notes: '',
  });
  const [trainings, setTrainings] = useState<any[]>([]);
  const [certificateUrl, setCertificateUrl] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/psara/trainings');
      const data = await response.json();
      if (data.trainings) {
        setTrainings(data.trainings);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/training-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guardId,
          score: formData.score ? parseFloat(formData.score) : null,
          certificateUrl,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating training record:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="trainingId">Training *</Label>
        <Select value={formData.trainingId} onValueChange={(value) => setFormData({ ...formData, trainingId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select training" />
          </SelectTrigger>
          <SelectContent>
            {trainings.map((training) => (
              <SelectItem key={training.id} value={training.id}>
                {training.title} ({training.trainingType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="completionDate">Completion Date *</Label>
          <Input
            id="completionDate"
            type="date"
            value={formData.completionDate}
            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="score">Score (%)</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div>
        <Label>Certificate</Label>
        <FileUpload guardId={guardId} onUploadComplete={(document) => setCertificateUrl(document.fileUrl)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Add Training Record</Button>
      </div>
    </form>
  );
}