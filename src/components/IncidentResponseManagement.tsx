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
import { Progress } from "@/components/ui/progress";
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
  Phone,
  Shield,
  Ambulance,
  Flame,
  UserCheck,
  MessageSquare,
  Send,
  Timer,
  Target,
  Activity,
  CheckSquare
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location?: string;
  occurredAt: string;
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string;
  actionTaken?: string;
  guard: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
  incidentReports: IncidentReport[];
  responses: IncidentResponse[];
}

interface IncidentReport {
  id: string;
  reportType: string;
  content: string;
  attachments?: string;
  reportedBy: string;
  createdAt: string;
}

interface IncidentResponse {
  id: string;
  action: string;
  responderName: string;
  responseTime: number;
  createdAt: string;
}

interface ResponseTeam {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'responding' | 'on-site' | 'unavailable';
  location: string;
  estimatedArrival: number; // in minutes
}

export default function IncidentResponseManagement() {
  const { data: session, status } = useSession();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [newResponse, setNewResponse] = useState({
    action: "",
    responseTime: 0
  });
  const [responseTeams, setResponseTeams] = useState<ResponseTeam[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchIncidents = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        const incidentsData = await tenantDb.incident({
          where: {
            status: {
              in: ['reported', 'investigating']
            }
          },
          include: {
            guard: true,
            incidentReports: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });

        const formattedIncidents = incidentsData.map(incident => {
          const incidentWithGuard = incident as any;
          return {
            id: incident.id,
            title: incident.title,
            description: incident.description,
            type: incident.type,
            severity: incident.severity,
            status: incident.status,
            location: incident.location || undefined,
            occurredAt: incident.occurredAt.toISOString(),
            reportedAt: incident.reportedAt.toISOString(),
            resolvedAt: incident.resolvedAt ? incident.resolvedAt.toISOString() : undefined,
            resolution: incident.resolution || undefined,
            actionTaken: incident.actionTaken || undefined,
            guard: {
              id: incidentWithGuard.guard.id,
              name: incidentWithGuard.guard.name,
              phone: incidentWithGuard.guard.phone,
              photo: incidentWithGuard.guard.photo || undefined
            },
            incidentReports: incidentWithGuard.incidentReports.map((report: any) => ({
              id: report.id,
              reportType: report.reportType,
              content: report.content,
              attachments: report.attachments || undefined,
              reportedBy: report.reportedBy,
              createdAt: report.createdAt.toISOString()
            })),
            responses: []
          };
        });

        setIncidents(formattedIncidents);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        // Fallback to mock data
        const mockIncidents: Incident[] = [
          {
            id: "1",
            title: "Unauthorized Access Attempt",
            description: "Unknown individual attempted to access restricted area at Site A",
            type: "security_breach",
            severity: "high",
            status: "investigating",
            location: "Main Gate - Site A",
            occurredAt: new Date(Date.now() - 3600000).toISOString(),
            reportedAt: new Date(Date.now() - 3500000).toISOString(),
            guard: {
              id: "1",
              name: "Rajesh Kumar",
              phone: "+91 98765 43210",
              photo: "/api/placeholder/40/40"
            },
            incidentReports: [
              {
                id: "1",
                reportType: "initial",
                content: "Initial report filed with security footage review requested",
                reportedBy: "Rajesh Kumar",
                createdAt: new Date(Date.now() - 3500000).toISOString()
              }
            ],
            responses: [
              {
                id: "1",
                action: "Dispatched security team to main gate",
                responderName: "Field Officer Smith",
                responseTime: 5,
                createdAt: new Date(Date.now() - 3400000).toISOString()
              }
            ]
          },
          {
            id: "2",
            title: "Medical Emergency",
            description: "Visitor collapsed in the lobby area requiring immediate medical attention",
            type: "medical_emergency",
            severity: "critical",
            status: "reported",
            location: "Building Lobby - Site B",
            occurredAt: new Date(Date.now() - 1800000).toISOString(),
            reportedAt: new Date(Date.now() - 1700000).toISOString(),
            guard: {
              id: "2",
              name: "Suresh Patel",
              phone: "+91 87654 32109",
              photo: "/api/placeholder/40/40"
            },
            incidentReports: [
              {
                id: "2",
                reportType: "initial",
                content: "Visitor collapsed, first aid being administered",
                reportedBy: "Suresh Patel",
                createdAt: new Date(Date.now() - 1700000).toISOString()
              }
            ],
            responses: []
          }
        ];

        setIncidents(mockIncidents);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [status, session]);

  useEffect(() => {
    // Mock response teams
    setResponseTeams([
      {
        id: "1",
        name: "Emergency Response Team",
        role: "Medical Emergency",
        status: "available",
        location: "Central Station",
        estimatedArrival: 8
      },
      {
        id: "2",
        name: "Security Patrol",
        role: "Security Response",
        status: "responding",
        location: "En Route to Site A",
        estimatedArrival: 3
      },
      {
        id: "3",
        name: "Fire Safety Team",
        role: "Fire Emergency",
        status: "available",
        location: "Station 3",
        estimatedArrival: 12
      },
      {
        id: "4",
        name: "Field Officer Johnson",
        role: "Field Supervisor",
        status: "on-site",
        location: "Site A",
        estimatedArrival: 0
      }
    ]);
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.guard.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
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
      case "security_breach": return <Shield className="w-4 h-4" />;
      case "theft": return <AlertTriangle className="w-4 h-4" />;
      case "medical_emergency": return <Ambulance className="w-4 h-4" />;
      case "fire": return <Flame className="w-4 h-4" />;
      case "assault": return <UserCheck className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "responding": return "bg-yellow-500";
      case "on-site": return "bg-blue-500";
      case "unavailable": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleAddResponse = async () => {
    if (!selectedIncident || !session) return;

    try {
      // Mock response creation
      const response: IncidentResponse = {
        id: Date.now().toString(),
        action: newResponse.action,
        responderName: session.user.name || "Field Officer",
        responseTime: newResponse.responseTime,
        createdAt: new Date().toISOString()
      };

      // Update local state
      setIncidents(prev => prev.map(incident => {
        if (incident.id === selectedIncident.id) {
          return {
            ...incident,
            responses: [...incident.responses, response]
          };
        }
        return incident;
      }));

      // Reset form and close dialog
      setNewResponse({
        action: "",
        responseTime: 0
      });
      setIsResponseDialogOpen(false);
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  const dispatchTeam = (team: ResponseTeam) => {
    // Mock team dispatch
    setResponseTeams(prev => prev.map(t => 
      t.id === team.id ? { ...t, status: 'responding' as const } : t
    ));
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
          <h1 className="text-3xl font-bold">Incident Response Management</h1>
          <p className="text-muted-foreground">Coordinate emergency response and manage incident resolution</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Response Teams
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Response Teams</DialogTitle>
                <DialogDescription>
                  Available response teams and their current status
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {responseTeams.map(team => (
                  <Card key={team.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTeamStatusColor(team.status)}`}></div>
                          <Badge variant="outline">{team.status}</Badge>
                        </div>
                      </div>
                      <CardDescription>{team.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Location:</span>
                        <span>{team.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>ETA:</span>
                        <span>{team.estimatedArrival} min</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => dispatchTeam(team)}
                        disabled={team.status !== 'available'}
                      >
                        Dispatch Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter(i => i.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Highest priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams Available</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {responseTeams.filter(t => t.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to respond</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2 min</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
          <CardDescription>Incidents requiring response and resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map(incident => (
              <Card key={incident.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(incident.type)}
                        <CardTitle className="text-xl">{incident.title}</CardTitle>
                        <Badge variant="outline" className={`text-white ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline" className={`text-white ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </Badge>
                      </div>
                      <CardDescription>{incident.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedIncident(incident);
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Add Response
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="responses">Responses ({incident.responses.length})</TabsTrigger>
                      <TabsTrigger value="reports">Reports ({incident.incidentReports.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Location</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{incident.location}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Reported By</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={incident.guard.photo} />
                              <AvatarFallback>{incident.guard.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{incident.guard.name}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Occurred</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {new Date(incident.occurredAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Reported</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {new Date(incident.reportedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="responses" className="space-y-4">
                      {incident.responses.length > 0 ? (
                        <div className="space-y-3">
                          {incident.responses.map(response => (
                            <div key={response.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{response.responderName}</span>
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-500">
                                    {response.responseTime} min response
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{response.action}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(response.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No responses yet</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="reports" className="space-y-4">
                      {incident.incidentReports.length > 0 ? (
                        <div className="space-y-3">
                          {incident.incidentReports.map(report => (
                            <div key={report.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{report.reportType}</Badge>
                                <span className="text-sm text-gray-500">by {report.reportedBy}</span>
                              </div>
                              <p className="text-sm text-gray-600">{report.content}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(report.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No reports yet</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Response Action</DialogTitle>
            <DialogDescription>
              Record response actions taken for this incident
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="action">Action Taken</Label>
              <Textarea
                id="action"
                value={newResponse.action}
                onChange={(e) => setNewResponse(prev => ({ ...prev, action: e.target.value }))}
                placeholder="Describe the action taken to respond to this incident"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="responseTime">Response Time (minutes)</Label>
              <Input
                id="responseTime"
                type="number"
                value={newResponse.responseTime}
                onChange={(e) => setNewResponse(prev => ({ ...prev, responseTime: parseInt(e.target.value) || 0 }))}
                placeholder="Time taken to respond"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResponse}>
                Add Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}