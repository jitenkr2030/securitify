"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  Navigation,
  Radio,
  Clipboard,
  Camera,
  Mic,
  Video,
  FileText,
  Send,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  Wifi,
  WifiOff,
  Battery,
  BatteryFull,
  BatteryLow,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Star,
  Flag,
  Shield
} from "lucide-react";
import { createTenantContext } from "@/lib/db";
import { db } from "@/lib/db";

interface Operation {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  assignedGuards: string[];
  supervisor: string;
  startTime: string;
  endTime?: string;
  estimatedDuration: number;
  actualDuration?: number;
  notes?: string;
  equipment: string[];
  risks: string[];
  createdAt: string;
  updatedAt: string;
}

interface OperationTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  standardDuration: number;
  requiredEquipment: string[];
  standardProcedures: string[];
  riskFactors: string[];
}

interface OperationReport {
  id: string;
  operationId: string;
  type: string;
  content: string;
  attachments: string[];
  reportedBy: string;
  reportedAt: string;
  status: string;
}

interface Guard {
  id: string;
  name: string;
  phone: string;
  status: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  availability: string;
}

export default function FieldOperationsManagement() {
  const { data: session, status } = useSession();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [templates, setTemplates] = useState<OperationTemplate[]>([]);
  const [reports, setReports] = useState<OperationReport[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [activeTab, setActiveTab] = useState("operations");

  const [newOperation, setNewOperation] = useState({
    title: "",
    description: "",
    type: "patrol",
    priority: "medium",
    location: {
      address: "",
      latitude: 0,
      longitude: 0
    },
    assignedGuards: [] as string[],
    startTime: "",
    estimatedDuration: 60,
    equipment: [] as string[],
    risks: [] as string[],
    notes: ""
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch guards
        const guardsData = await tenantDb.guard({
          where: {
            status: 'active'
          }
        });

        // Fetch locations for guards
        const guardsWithLocations = await Promise.all(
          guardsData.map(async (guard) => {
            const locations = await db.location.findMany({
              where: { guardId: guard.id },
              orderBy: { timestamp: 'desc' },
              take: 1
            });

            return {
              ...guard,
              locations
            };
          })
        );

        const formattedGuards = guardsWithLocations.map(guard => ({
          id: guard.id,
          name: guard.name,
          phone: guard.phone,
          status: guard.status,
          currentLocation: guard.locations[0] ? {
            latitude: guard.locations[0].latitude,
            longitude: guard.locations[0].longitude,
            timestamp: guard.locations[0].timestamp.toISOString()
          } : undefined,
          availability: Math.random() > 0.3 ? 'available' : 'unavailable' // Mock data
        }));

        // Mock operations data
        const mockOperations: Operation[] = [
          {
            id: "1",
            title: "Night Patrol - Building A",
            description: "Comprehensive night patrol of Building A perimeter and common areas",
            type: "patrol",
            status: "active",
            priority: "high",
            location: {
              address: "Building A, Sector 15",
              latitude: 28.6139,
              longitude: 77.2090
            },
            assignedGuards: ["Rajesh Kumar", "Suresh Patel"],
            supervisor: "Field Officer",
            startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            estimatedDuration: 120,
            equipment: ["Flashlight", "Radio", "Batton", "First Aid Kit"],
            risks: ["Low visibility", "Restricted access areas"],
            notes: "Focus on basement and parking areas",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "2",
            title: "Emergency Response Drill",
            description: "Monthly emergency response drill for all guards",
            type: "training",
            status: "scheduled",
            priority: "medium",
            location: {
              address: "Training Ground, Main Campus",
              latitude: 28.6140,
              longitude: 77.2091
            },
            assignedGuards: ["All Guards"],
            supervisor: "Field Officer",
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            estimatedDuration: 90,
            equipment: ["Training materials", "First Aid Kits", "Communication devices"],
            risks: ["Weather dependent", "Equipment failure"],
            notes: "Coordinate with all shift supervisors",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "3",
            title: "VIP Security Detail",
            description: "Security detail for VIP visit to Building B",
            type: "security",
            status: "completed",
            priority: "high",
            location: {
              address: "Building B, Executive Wing",
              latitude: 28.6141,
              longitude: 77.2092
            },
            assignedGuards: ["Amit Singh", "Vikram Sharma"],
            supervisor: "Field Officer",
            startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            estimatedDuration: 120,
            actualDuration: 120,
            equipment: ["Communication devices", "Metal detector", "Access control systems"],
            risks: ["Crowd control", "Access point security"],
            notes: "Operation completed successfully, no incidents reported",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          }
        ];

        // Mock templates
        const mockTemplates: OperationTemplate[] = [
          {
            id: "1",
            name: "Standard Patrol",
            description: "Routine security patrol of designated area",
            type: "patrol",
            standardDuration: 60,
            requiredEquipment: ["Flashlight", "Radio", "Batton", "First Aid Kit"],
            standardProcedures: [
              "Check all access points",
              "Verify security systems",
              "Report suspicious activities",
              "Document patrol findings"
            ],
            riskFactors: ["Weather conditions", "Low visibility", "Equipment failure"]
          },
          {
            id: "2",
            name: "Emergency Response",
            description: "Response to emergency situations",
            type: "emergency",
            standardDuration: 30,
            requiredEquipment: ["First Aid Kit", "Radio", "Flashlight", "Emergency contacts"],
            standardProcedures: [
              "Assess situation",
              "Secure the area",
              "Provide first aid if needed",
              "Contact emergency services",
              "Document incident"
            ],
            riskFactors: ["Personal safety", "Additional threats", "Communication failure"]
          },
          {
            id: "3",
            name: "Site Inspection",
            description: "Detailed inspection of security measures",
            type: "inspection",
            standardDuration: 90,
            requiredEquipment: ["Inspection checklist", "Camera", "Measuring tools", "Safety equipment"],
            standardProcedures: [
              "Review security procedures",
              "Check equipment functionality",
              "Test communication systems",
              "Verify access controls",
              "Document findings"
            ],
            riskFactors: ["Equipment malfunction", "Procedural gaps", "Human error"]
          }
        ];

        // Mock reports
        const mockReports: OperationReport[] = [
          {
            id: "1",
            operationId: "1",
            type: "progress",
            content: "Patrol proceeding normally. All access points secure. No suspicious activities reported.",
            attachments: [],
            reportedBy: "Rajesh Kumar",
            reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: "reviewed"
          },
          {
            id: "2",
            operationId: "3",
            type: "final",
            content: "VIP security detail completed successfully. All security measures followed. No incidents occurred.",
            attachments: ["incident_report.pdf", "security_log.pdf"],
            reportedBy: "Field Officer",
            reportedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            status: "approved"
          }
        ];

        setGuards(formattedGuards);
        setOperations(mockOperations);
        setTemplates(mockTemplates);
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching field operations data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "scheduled": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      case "paused": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "text-blue-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "patrol": return <Navigation className="w-4 h-4" />;
      case "training": return <Clipboard className="w-4 h-4" />;
      case "inspection": return <Eye className="w-4 h-4" />;
      case "emergency": return <AlertTriangle className="w-4 h-4" />;
      case "security": return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || operation.status === statusFilter;
    const matchesType = typeFilter === "all" || operation.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateOperation = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      const operation = {
        ...newOperation,
        supervisor: session.user.name || "Field Officer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to local state
      setOperations(prev => [{
        id: Date.now().toString(),
        ...operation,
        status: "scheduled"
      }, ...prev]);

      // Reset form and close dialog
      setNewOperation({
        title: "",
        description: "",
        type: "patrol",
        priority: "medium",
        location: {
          address: "",
          latitude: 0,
          longitude: 0
        },
        assignedGuards: [],
        startTime: "",
        estimatedDuration: 60,
        equipment: [],
        risks: [],
        notes: ""
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating operation:", error);
    }
  };

  const handleUpdateOperationStatus = (operationId: string, newStatus: string) => {
    setOperations(prev => prev.map(op => 
      op.id === operationId 
        ? { ...op, status: newStatus, updatedAt: new Date().toISOString() }
        : op
    ));
  };

  const handleUseTemplate = (template: OperationTemplate) => {
    setNewOperation(prev => ({
      ...prev,
      type: template.type,
      description: template.description,
      estimatedDuration: template.standardDuration,
      equipment: template.requiredEquipment,
      risks: template.riskFactors
    }));
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
          <h1 className="text-3xl font-bold">Field Operations Management</h1>
          <p className="text-muted-foreground">Plan, execute, and monitor field operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {operations.filter(o => o.status === 'active').length} Active
          </Badge>
          <Badge variant="outline" className="text-sm">
            {operations.filter(o => o.status === 'scheduled').length} Scheduled
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Operation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Operation</DialogTitle>
                <DialogDescription>
                  Plan and schedule a new field operation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Operation Title</Label>
                  <Input
                    id="title"
                    value={newOperation.title}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter operation title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOperation.description}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the operation objectives and scope"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Operation Type</Label>
                    <Select value={newOperation.type} onValueChange={(value) => setNewOperation(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patrol">Patrol</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newOperation.priority} onValueChange={(value) => setNewOperation(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newOperation.location.address}
                    onChange={(e) => setNewOperation(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    placeholder="Enter operation location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newOperation.startTime}
                      onChange={(e) => setNewOperation(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newOperation.estimatedDuration}
                      onChange={(e) => setNewOperation(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="equipment">Equipment (comma-separated)</Label>
                  <Input
                    id="equipment"
                    value={newOperation.equipment.join(', ')}
                    onChange={(e) => setNewOperation(prev => ({ 
                      ...prev, 
                      equipment: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    placeholder="Flashlight, Radio, First Aid Kit"
                  />
                </div>

                <div>
                  <Label htmlFor="risks">Risk Factors (comma-separated)</Label>
                  <Input
                    id="risks"
                    value={newOperation.risks.join(', ')}
                    onChange={(e) => setNewOperation(prev => ({ 
                      ...prev, 
                      risks: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    placeholder="Weather, Low visibility, Equipment failure"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOperation.notes}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional instructions or notes"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOperation}>
                    Create Operation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operations.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operations.filter(o => o.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations.length > 0 ? Math.round((operations.filter(o => o.status === 'completed').length / operations.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guards Deployed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations.reduce((sum, op) => sum + op.assignedGuards.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search operations..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="patrol">Patrol</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredOperations.map((operation) => (
              <Card key={operation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(operation.type)}
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(operation.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{operation.title}</h3>
                        <p className="text-sm text-muted-foreground">{operation.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(operation.priority)}`}>
                            {operation.priority}
                          </Badge>
                          <Badge variant="outline">{operation.type}</Badge>
                          <Badge variant="outline">{operation.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Location: {operation.location.address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Guards: {operation.assignedGuards.join(', ')} • Supervisor: {operation.supervisor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started: {new Date(operation.startTime).toLocaleString()}
                          {operation.endTime && ` • Ended: ${new Date(operation.endTime).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {operation.status === 'scheduled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateOperationStatus(operation.id, 'active')}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {operation.status === 'active' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateOperationStatus(operation.id, 'paused')}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateOperationStatus(operation.id, 'completed')}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {operation.equipment.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Equipment:</p>
                      <div className="flex flex-wrap gap-2">
                        {operation.equipment.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {operation.risks.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Risk Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {operation.risks.map((risk, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {operation.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{operation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="outline">{template.standardDuration} min</Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Required Equipment:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.requiredEquipment.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{report.type} Report</h3>
                      <p className="text-sm text-muted-foreground">{report.content}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge variant="outline">{report.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reported by: {report.reportedBy} • {new Date(report.reportedAt).toLocaleString()}
                      </p>
                      {report.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Attachments:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {report.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operations Schedule</CardTitle>
              <CardDescription>View and manage operation schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations
                  .filter(op => op.status === 'scheduled' || op.status === 'active')
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(operation.status)}`}></div>
                        <div>
                          <h4 className="font-medium">{operation.title}</h4>
                          <p className="text-sm text-muted-foreground">{operation.location.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(operation.startTime).toLocaleString()} • {operation.estimatedDuration} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{operation.type}</Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(operation.priority)}`}>
                          {operation.priority}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}