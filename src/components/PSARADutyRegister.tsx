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
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Download,
  FileText,
  Filter
} from "lucide-react";

interface DutyRegister {
  id: string;
  date: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  location: string;
  dutyType: string;
  supervisor?: string;
  remarks?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  guard: {
    id: string;
    name: string;
    phone: string;
  };
  post: {
    id: string;
    name: string;
    address: string;
  };
}

export default function PSARADutyRegister() {
  const [dutyRegisters, setDutyRegisters] = useState<DutyRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    guardId: '',
    postId: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchDutyRegisters();
  }, [filters]);

  const fetchDutyRegisters = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/psara/duty-register?${params}`);
      const data = await response.json();
      if (data.dutyRegisters) {
        setDutyRegisters(data.dutyRegisters);
      }
    } catch (error) {
      console.error('Error fetching duty registers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShiftTypeBadge = (shiftType: string) => {
    switch (shiftType) {
      case 'day':
        return <Badge className="bg-blue-100 text-blue-800">Day</Badge>;
      case 'night':
        return <Badge className="bg-indigo-100 text-indigo-800">Night</Badge>;
      case 'split':
        return <Badge className="bg-purple-100 text-purple-800">Split</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{shiftType}</Badge>;
    }
  };

  const getDutyTypeBadge = (dutyType: string) => {
    switch (dutyType) {
      case 'static':
        return <Badge className="bg-green-100 text-green-800">Static</Badge>;
      case 'patrol':
        return <Badge className="bg-yellow-100 text-yellow-800">Patrol</Badge>;
      case 'escort':
        return <Badge className="bg-orange-100 text-orange-800">Escort</Badge>;
      case 'event':
        return <Badge className="bg-red-100 text-red-800">Event</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{dutyType}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getDutyStats = () => {
    const total = dutyRegisters.length;
    const completed = dutyRegisters.filter(r => r.status === 'completed').length;
    const scheduled = dutyRegisters.filter(r => r.status === 'scheduled').length;
    const absent = dutyRegisters.filter(r => r.status === 'absent').length;

    return { total, completed, scheduled, absent };
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    alert('PDF export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getDutyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Duty Register</h1>
          <p className="text-gray-600 mt-2">
            Digital register for shifts/duty with PDF export capability
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Duty Register
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Duty Register</DialogTitle>
                <DialogDescription>
                  Create a new duty register entry
                </DialogDescription>
              </DialogHeader>
              <DutyRegisterForm onSuccess={() => setIsDialogOpen(false)} />
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
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold">{stats.absent}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duty Registers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Duty Registers</CardTitle>
          <CardDescription>
            All duty register entries with shift details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dutyRegisters.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No duty register entries found. Add your first entry.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Duty Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dutyRegisters.map((register) => (
                  <TableRow key={register.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(register.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{register.guard.name}</TableCell>
                    <TableCell>{register.post.name}</TableCell>
                    <TableCell>{getShiftTypeBadge(register.shiftType)}</TableCell>
                    <TableCell>{getDutyTypeBadge(register.dutyType)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(register.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-gray-500">to {new Date(register.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{register.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(register.status)}</TableCell>
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
    </div>
  );
}

// Duty Register Form Component
function DutyRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    guardId: '',
    postId: '',
    date: '',
    shiftType: '',
    startTime: '',
    endTime: '',
    location: '',
    dutyType: '',
    supervisor: '',
    remarks: '',
  });
  const [guards, setGuards] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchGuards();
    fetchPosts();
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

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      if (data.locations) {
        setPosts(data.locations);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/duty-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating duty register:', error);
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
          <Label htmlFor="postId">Post *</Label>
          <Select value={formData.postId} onValueChange={(value) => setFormData({ ...formData, postId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select post" />
            </SelectTrigger>
            <SelectContent>
              {posts.map((post) => (
                <SelectItem key={post.id} value={post.id}>
                  {post.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="shiftType">Shift Type *</Label>
          <Select value={formData.shiftType} onValueChange={(value) => setFormData({ ...formData, shiftType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select shift type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="night">Night</SelectItem>
              <SelectItem value="split">Split</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="dutyType">Duty Type *</Label>
          <Select value={formData.dutyType} onValueChange={(value) => setFormData({ ...formData, dutyType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select duty type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="patrol">Patrol</SelectItem>
              <SelectItem value="escort">Escort</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supervisor">Supervisor</Label>
          <Input
            id="supervisor"
            value={formData.supervisor}
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            id="remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Create Duty Register</Button>
      </div>
    </form>
  );
}