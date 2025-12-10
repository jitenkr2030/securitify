"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Download,
  Eye,
  TrendingUp
} from "lucide-react";

interface Training {
  id: string;
  title: string;
  description?: string;
  trainingType: string;
  duration: number;
  validFor: number;
  provider: string;
  certificate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  trainingRecords: TrainingRecord[];
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
  guard: {
    id: string;
    name: string;
    phone: string;
  };
  training: {
    id: string;
    title: string;
    trainingType: string;
  };
}

export default function PSARATrainingRecords() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    trainingType: '',
    status: '',
  });

  useEffect(() => {
    fetchTrainings();
    fetchTrainingRecords();
  }, [filters]);

  const fetchTrainings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.trainingType) params.append('trainingType', filters.trainingType);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/psara/trainings?${params}`);
      const data = await response.json();
      if (data.trainings) {
        setTrainings(data.trainings);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingRecords = async () => {
    try {
      const response = await fetch('/api/psara/training-records');
      const data = await response.json();
      if (data.trainingRecords) {
        setTrainingRecords(data.trainingRecords);
      }
    } catch (error) {
      console.error('Error fetching training records:', error);
    }
  };

  const getTrainingTypeBadge = (trainingType: string) => {
    switch (trainingType) {
      case 'basic':
        return <Badge className="bg-blue-100 text-blue-800">Basic</Badge>;
      case 'refresher':
        return <Badge className="bg-green-100 text-green-800">Refresher</Badge>;
      case 'specialized':
        return <Badge className="bg-purple-100 text-purple-800">Specialized</Badge>;
      case 'weapons':
        return <Badge className="bg-red-100 text-red-800">Weapons</Badge>;
      case 'first_aid':
        return <Badge className="bg-yellow-100 text-yellow-800">First Aid</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{trainingType}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getRecordStatusBadge = (status: string) => {
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

  const isTrainingExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const isTrainingExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getExpiringRecords = () => {
    return trainingRecords.filter(record => 
      record.status === 'completed' && isTrainingExpiringSoon(record.expiryDate)
    );
  };

  const getExpiredRecords = () => {
    return trainingRecords.filter(record => 
      record.status === 'completed' && isTrainingExpired(record.expiryDate)
    );
  };

  const getTrainingStats = () => {
    const totalGuards = new Set(trainingRecords.map(r => r.guard.id)).size;
    const completedRecords = trainingRecords.filter(r => r.status === 'completed').length;
    const expiringRecords = getExpiringRecords().length;
    const expiredRecords = getExpiredRecords().length;

    return {
      totalGuards,
      completedRecords,
      expiringRecords,
      expiredRecords,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getTrainingStats();
  const expiringRecords = getExpiringRecords();
  const expiredRecords = getExpiredRecords();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Training Records</h1>
          <p className="text-gray-600 mt-2">
            Maintain training schedules and attendance with auto expiry alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Training</DialogTitle>
                <DialogDescription>
                  Create a new training program for guards
                </DialogDescription>
              </DialogHeader>
              <TrainingForm onSuccess={() => setIsTrainingDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Training Record</DialogTitle>
                <DialogDescription>
                  Record guard training completion
                </DialogDescription>
              </DialogHeader>
              <TrainingRecordForm onSuccess={() => setIsRecordDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guards</p>
                <p className="text-2xl font-bold">{stats.totalGuards}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Trainings</p>
                <p className="text-2xl font-bold">{stats.completedRecords}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringRecords}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">{stats.expiredRecords}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(expiringRecords.length > 0 || expiredRecords.length > 0) && (
        <div className="space-y-4">
          {expiredRecords.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Attention:</strong> {expiredRecords.length} training certification(s) have expired and need renewal.
              </AlertDescription>
            </Alert>
          )}

          {expiringRecords.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Clock className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Reminder:</strong> {expiringRecords.length} training certification(s) are expiring soon.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trainingType">Training Type</Label>
              <Select value={filters.trainingType} onValueChange={(value) => setFilters({ ...filters, trainingType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="refresher">Refresher</SelectItem>
                  <SelectItem value="specialized">Specialized</SelectItem>
                  <SelectItem value="weapons">Weapons</SelectItem>
                  <SelectItem value="first_aid">First Aid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="trainings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trainings">Training Programs</TabsTrigger>
          <TabsTrigger value="records">Training Records</TabsTrigger>
        </TabsList>

        <TabsContent value="trainings">
          <Card>
            <CardHeader>
              <CardTitle>Training Programs</CardTitle>
              <CardDescription>
                Manage training programs and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No training programs found. Create your first training program.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell className="font-medium">{training.title}</TableCell>
                        <TableCell>{getTrainingTypeBadge(training.trainingType)}</TableCell>
                        <TableCell>{training.duration} hours</TableCell>
                        <TableCell>{training.validFor} months</TableCell>
                        <TableCell>{training.provider}</TableCell>
                        <TableCell>{getStatusBadge(training.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {training.trainingRecords.length} records
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Training Records</CardTitle>
              <CardDescription>
                Individual guard training completion records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainingRecords.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No training records found. Add your first training record.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guard</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.guard.name}</TableCell>
                        <TableCell>{record.training.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(record.completionDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(record.expiryDate).toLocaleDateString()}</span>
                            {isTrainingExpiringSoon(record.expiryDate) && (
                              <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
                            )}
                            {isTrainingExpired(record.expiryDate) && (
                              <Badge className="bg-red-100 text-red-800">Expired</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.score ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              {record.score}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getRecordStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {record.certificateUrl && (
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Training Form Component
function TrainingForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainingType: '',
    duration: '',
    validFor: '',
    provider: '',
    certificate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          validFor: parseInt(formData.validFor),
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating training:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Training Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trainingType">Training Type *</Label>
          <Select value={formData.trainingType} onValueChange={(value) => setFormData({ ...formData, trainingType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select training type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="refresher">Refresher</SelectItem>
              <SelectItem value="specialized">Specialized</SelectItem>
              <SelectItem value="weapons">Weapons</SelectItem>
              <SelectItem value="first_aid">First Aid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="provider">Provider *</Label>
          <Input
            id="provider"
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (hours) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="validFor">Validity (months) *</Label>
          <Input
            id="validFor"
            type="number"
            min="1"
            value={formData.validFor}
            onChange={(e) => setFormData({ ...formData, validFor: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="certificate">Certificate Template</Label>
        <Input
          id="certificate"
          value={formData.certificate}
          onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Create Training</Button>
      </div>
    </form>
  );
}

// Training Record Form Component
function TrainingRecordForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    guardId: '',
    trainingId: '',
    completionDate: '',
    expiryDate: '',
    score: '',
    instructor: '',
    notes: '',
  });
  const [guards, setGuards] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);

  useEffect(() => {
    fetchGuards();
    fetchTrainings();
  }, []);

  const fetchGuards = async () => {
    try {
      const response = await fetch('/api/guards');
      const data = await response.json();
      if (data.guards) {
        setGuards(data.guards);
      }
    } catch (error) {
      console.error('Error fetching guards:', error);
    }
  };

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
          score: formData.score ? parseFloat(formData.score) : null,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guardId">Guard *</Label>
          <Select value={formData.guardId} onValueChange={(value) => setFormData({ ...formData, guardId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select guard" />
            </SelectTrigger>
            <SelectContent>
              {guards.map((guard) => (
                <SelectItem key={guard.id} value={guard.id}>
                  {guard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="trainingId">Training *</Label>
          <Select value={formData.trainingId} onValueChange={(value) => setFormData({ ...formData, trainingId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select training" />
            </SelectTrigger>
            <SelectContent>
              {trainings.map((training) => (
                <SelectItem key={training.id} value={training.id}>
                  {training.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Add Record</Button>
      </div>
    </form>
  );
}