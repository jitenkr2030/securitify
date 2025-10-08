"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Camera,
  Video,
  Users,
  Calendar,
  Phone
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location?: string | null;
  occurredAt: string;
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string | null;
  actionTaken?: string | null;
  guardId: string;
  incidentReports: IncidentReport[];
}

interface IncidentReport {
  id: string;
  reportType: string;
  content: string;
  attachments?: string;
  reportedBy: string;
  createdAt: string;
}

interface NewIncident {
  title: string;
  description: string;
  type: string;
  severity: string;
  location: string;
  latitude?: number;
  longitude?: number;
  witnesses?: string;
  evidence?: string;
}

export default function IncidentReporting() {
  const { data: session, status } = useSession();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [newIncident, setNewIncident] = useState<NewIncident>({
    title: "",
    description: "",
    type: "",
    severity: "medium",
    location: "",
    witnesses: "",
    evidence: ""
  });
  const [newReport, setNewReport] = useState({
    content: "",
    reportType: "follow_up",
    attachments: ""
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchIncidents = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        const incidentsData = await tenantDb.incident({
          include: {
            guard: true,
            incidentReports: {
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { occurredAt: 'desc' }
        });

        const formattedIncidents = incidentsData.map(incident => ({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          type: incident.type,
          severity: incident.severity,
          status: incident.status,
          location: incident.location,
          occurredAt: incident.occurredAt.toISOString(),
          reportedAt: incident.reportedAt.toISOString(),
          resolvedAt: incident.resolvedAt ? incident.resolvedAt.toISOString() : undefined,
          resolution: incident.resolution,
          actionTaken: incident.actionTaken,
          guardId: incident.guardId,
          incidentReports: [] // Will be populated separately if needed
        }));

        setIncidents(formattedIncidents);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        // Fallback to mock data
        const mockIncidents: Incident[] = [
          {
            id: "1",
            title: "Unauthorized Access Attempt",
            description: "Unknown individual attempted to access restricted area",
            type: "security_breach",
            severity: "high",
            status: "investigating",
            location: "Main Gate",
            occurredAt: new Date(Date.now() - 3600000).toISOString(),
            reportedAt: new Date(Date.now() - 3500000).toISOString(),
            guardId: "1",
            incidentReports: [
              {
                id: "1",
                reportType: "initial",
                content: "Initial report filed with security footage review requested",
                reportedBy: "Rajesh Kumar",
                createdAt: new Date(Date.now() - 3500000).toISOString()
              }
            ]
          },
          {
            id: "2",
            title: "Medical Emergency",
            description: "Visitor fainted in the lobby area",
            type: "medical_emergency",
            severity: "critical",
            status: "resolved",
            location: "Building Lobby",
            occurredAt: new Date(Date.now() - 7200000).toISOString(),
            reportedAt: new Date(Date.now() - 7100000).toISOString(),
            resolvedAt: new Date(Date.now() - 6000000).toISOString(),
            resolution: "Medical assistance provided, visitor transported to hospital",
            actionTaken: "Called emergency services, provided first aid",
            guardId: "2",
            incidentReports: [
              {
                id: "2",
                reportType: "initial",
                content: "Emergency response initiated",
                reportedBy: "Suresh Patel",
                createdAt: new Date(Date.now() - 7100000).toISOString()
              },
              {
                id: "3",
                reportType: "final",
                content: "Incident resolved with medical team assistance",
                reportedBy: "Suresh Patel",
                createdAt: new Date(Date.now() - 6000000).toISOString()
              }
            ]
          }
        ];

        setIncidents(mockIncidents);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [status, session]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesType = typeFilter === "all" || incident.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported": return "bg-blue-500";
      case "investigating": return "bg-yellow-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security_breach": return <AlertTriangle className="w-4 h-4" />;
      case "theft": return <AlertTriangle className="w-4 h-4" />;
      case "medical_emergency": return <AlertTriangle className="w-4 h-4" />;
      case "fire": return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleCreateIncident = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      // Get first guard for demo purposes
      const guards = await tenantDb.guard();
      const guard = guards[0];
      if (!guard) return;

      const incident = await tenantDb.createIncident({
        data: {
          title: newIncident.title,
          description: newIncident.description,
          type: newIncident.type,
          severity: newIncident.severity,
          location: newIncident.location,
          latitude: newIncident.latitude,
          longitude: newIncident.longitude,
          witnesses: newIncident.witnesses,
          evidence: newIncident.evidence,
          userId: session.user.id,
          guardId: guard.id
        },
        include: {
          guard: true,
          incidentReports: true
        }
      });

      // Add to local state
      setIncidents(prev => [{
        id: incident.id,
        title: incident.title,
        description: incident.description,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        location: incident.location,
        occurredAt: incident.occurredAt.toISOString(),
        reportedAt: incident.reportedAt.toISOString(),
        guardId: incident.guardId,
        incidentReports: []
      }, ...prev]);

      // Reset form and close dialog
      setNewIncident({
        title: "",
        description: "",
        type: "",
        severity: "medium",
        location: "",
        witnesses: "",
        evidence: ""
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  const handleAddReport = async () => {
    if (!selectedIncident || !session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      const report = await tenantDb.createIncidentReport({
        data: {
          reportType: newReport.reportType,
          content: newReport.content,
          attachments: newReport.attachments,
          reportedBy: session.user.name || "Unknown",
          incidentId: selectedIncident.id
        }
      });

      // Update local state
      setIncidents(prev => prev.map(incident => {
        if (incident.id === selectedIncident.id) {
          return {
            ...incident,
            incidentReports: [{
              id: report.id,
              reportType: report.reportType,
              content: report.content,
              attachments: report.attachments || undefined,
              reportedBy: report.reportedBy,
              createdAt: report.createdAt.toISOString()
            }, ...incident.incidentReports]
          };
        }
        return incident;
      }));

      // Reset form and close dialog
      setNewReport({
        content: "",
        reportType: "follow_up",
        attachments: ""
      });
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incident Reporting</h1>
          <p className="text-muted-foreground">Track and manage security incidents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
              <DialogDescription>
                Fill in the details of the incident to create a new report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Incident Title</Label>
                <Input
                  id="title"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the incident"
                />
              </div>
              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about the incident"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Incident Type</Label>
                  <Select value={newIncident.type} onValueChange={(value) => setNewIncident(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security_breach">Security Breach</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newIncident.severity} onValueChange={(value) => setNewIncident(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where did the incident occur?"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateIncident}>
                  Create Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="reported">Reported</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="security_breach">Security Breach</SelectItem>
            <SelectItem value="theft">Theft</SelectItem>
            <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
            <SelectItem value="fire">Fire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <div className="grid gap-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(incident.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <Badge variant="secondary" className={`${getSeverityColor(incident.severity)} text-white`}>
                        {incident.severity}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(incident.status)} text-white`}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{incident.location || "Unknown location"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(incident.occurredAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Guard ID: {incident.guardId}</span>
                      </div>
                    </div>
                    {incident.resolution && (
                      <Alert className="mt-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Resolution:</strong> {incident.resolution}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setIsReportDialogOpen(true);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Add Report
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              
              {/* Incident Reports */}
              {incident.incidentReports.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Incident Reports ({incident.incidentReports.length})</h4>
                  <div className="space-y-2">
                    {incident.incidentReports.slice(0, 2).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium text-sm">{report.reportType.replace('_', ' ')}</span>
                          <p className="text-xs text-gray-600">{report.content.substring(0, 100)}...</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {incident.incidentReports.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{incident.incidentReports.length - 2} more reports
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Incident Report</DialogTitle>
            <DialogDescription>
              Add a follow-up report to the incident
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={newReport.reportType} onValueChange={(value) => setNewReport(prev => ({ ...prev, reportType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Report</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="final">Final Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Report Content</Label>
              <Textarea
                id="content"
                value={newReport.content}
                onChange={(e) => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Provide detailed information about the incident follow-up"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="attachments">Attachments (JSON array of URLs)</Label>
              <Input
                id="attachments"
                value={newReport.attachments}
                onChange={(e) => setNewReport(prev => ({ ...prev, attachments: e.target.value }))}
                placeholder="['url1', 'url2']"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReport}>
                Add Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}