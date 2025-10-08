"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Edit,
  Camera,
  Shield,
  Clock,
  MapPinned,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface GuardProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  location: string;
  joinDate: string;
  salary: number;
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadDate: string;
}

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
}

interface SalaryRecord {
  id: string;
  month: string;
  amount: number;
  status: string;
  paymentDate: string;
}

export default function GuardProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [guard, setGuard] = useState<GuardProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockGuard: GuardProfile = {
      id,
      name: "John Doe",
      email: "john.doe@securitify.com",
      phone: "+1 (555) 123-4567",
      status: "Active",
      location: "Site A - Main Entrance",
      joinDate: "2023-01-15",
      salary: 45000,
      avatar: "/placeholder-avatar.jpg",
    };

    const mockDocuments: Document[] = [
      { id: "1", name: "ID Card", type: "Identification", status: "Verified", uploadDate: "2023-01-15" },
      { id: "2", name: "Training Certificate", type: "Certification", status: "Verified", uploadDate: "2023-02-20" },
      { id: "3", name: "Background Check", type: "Clearance", status: "Pending", uploadDate: "2023-03-10" },
    ];

    const mockShifts: Shift[] = [
      { id: "1", date: "2024-01-15", startTime: "08:00", endTime: "16:00", location: "Site A", status: "Completed" },
      { id: "2", date: "2024-01-16", startTime: "08:00", endTime: "16:00", location: "Site A", status: "Completed" },
      { id: "3", date: "2024-01-17", startTime: "08:00", endTime: "16:00", location: "Site A", status: "Scheduled" },
    ];

    const mockSalaries: SalaryRecord[] = [
      { id: "1", month: "January 2024", amount: 3750, status: "Paid", paymentDate: "2024-01-31" },
      { id: "2", month: "December 2023", amount: 3750, status: "Paid", paymentDate: "2023-12-31" },
      { id: "3", month: "November 2023", amount: 3750, status: "Paid", paymentDate: "2023-11-30" },
    ];

    setGuard(mockGuard);
    setDocuments(mockDocuments);
    setShifts(mockShifts);
    setSalaries(mockSalaries);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!guard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Guard not found</h2>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={guard.avatar} alt={guard.name} />
              <AvatarFallback>{guard.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{guard.name}</h1>
              <p className="text-muted-foreground">{guard.email}</p>
              <Badge variant={guard.status === 'Active' ? 'default' : 'secondary'}>
                {guard.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{guard.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{guard.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{guard.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{guard.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined: {guard.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>${guard.salary.toLocaleString()}/year</span>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={doc.status === 'Verified' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shifts and Salary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Shifts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shifts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{shift.date}</p>
                          <p className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinned className="w-4 h-4 text-muted-foreground" />
                        <span>{shift.location}</span>
                        <Badge variant={shift.status === 'Completed' ? 'default' : 'secondary'}>
                          {shift.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary History */}
            <Card>
              <CardHeader>
                <CardTitle>Salary History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salaries.map((salary) => (
                    <div key={salary.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{salary.month}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid: {salary.paymentDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${salary.amount.toLocaleString()}</span>
                        <Badge variant={salary.status === 'Paid' ? 'default' : 'secondary'}>
                          {salary.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
