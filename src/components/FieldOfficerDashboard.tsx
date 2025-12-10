"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  MessageSquare,
  Clipboard,
  Eye,
  Star,
  Target,
  Activity,
  Car,
  Map,
  Shield,
  FileText,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryFull,
  BatteryLow,
  Navigation,
  Camera,
  Mic,
  Video,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing
} from "lucide-react";
import { createTenantContext } from "@/lib/db";
import { db } from "@/lib/db";

interface Guard {
  id: string;
  name: string;
  phone: string;
  status: string;
  photo?: string | null;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  currentShift?: {
    name: string;
    startTime: string;
    endTime: string;
    post: string;
  };
  performance: {
    attendance: number;
    punctuality: number;
    compliance: number;
    incidents: number;
  };
  lastCheckIn?: string;
  batteryLevel?: number;
  deviceStatus?: string;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string;
  guard: {
    name: string;
    photo?: string | null;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  status: string;
}

interface Site {
  id: string;
  name: string;
  address: string;
  status: string;
  guardsCount: number;
  lastInspection?: string;
  inspectionScore?: number;
  issues: number;
  nextInspection: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  assignedTo?: string;
  dueDate: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface FieldOperation {
  id: string;
  type: string;
  status: string;
  location: string;
  startTime: string;
  endTime?: string;
  guards: string[];
  supervisor: string;
  notes?: string;
}

export default function FieldOfficerDashboard() {
  const { data: session, status } = useSession();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [operations, setOperations] = useState<FieldOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch guards with performance data
        const guardsData = await tenantDb.guard();

        // Fetch additional data separately
        const guardsWithDetails = await Promise.all(
          guardsData.map(async (guard) => {
            const [attendances, incidents, locations, currentShift] = await Promise.all([
              db.attendance.findMany({
                where: { guardId: guard.id },
                orderBy: { createdAt: 'desc' },
                take: 30
              }),
              db.incident.findMany({
                where: { 
                  guardId: guard.id,
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                  }
                }
              }),
              db.location.findMany({
                where: { guardId: guard.id },
                orderBy: { timestamp: 'desc' },
                take: 1
              }),
              db.shift.findFirst({
                where: { 
                  guardId: guard.id,
                  startTime: { lte: new Date() },
                  endTime: { gte: new Date() }
                },
                include: {
                  post: true
                }
              })
            ]);

            return {
              ...guard,
              attendances,
              incidents,
              locations,
              currentShift
            };
          })
        );

        const formattedGuards = guardsWithDetails.map(guard => {
          const attendanceRate = calculateAttendanceRate(guard.attendances);
          const punctualityRate = calculatePunctualityRate(guard.attendances);
          const complianceRate = calculateComplianceRate(guard);
          
          return {
            id: guard.id,
            name: guard.name,
            phone: guard.phone,
            status: guard.status,
            photo: guard.photo,
            currentLocation: guard.locations[0] ? {
              latitude: guard.locations[0].latitude,
              longitude: guard.locations[0].longitude,
              timestamp: guard.locations[0].timestamp.toISOString()
            } : undefined,
            currentShift: guard.currentShift ? {
              name: guard.currentShift.name,
              startTime: guard.currentShift.startTime.toISOString(),
              endTime: guard.currentShift.endTime.toISOString(),
              post: guard.currentShift.post.name
            } : undefined,
            performance: {
              attendance: attendanceRate,
              punctuality: punctualityRate,
              compliance: complianceRate,
              incidents: guard.incidents.length
            },
            lastCheckIn: guard.locations[0]?.timestamp.toISOString(),
            batteryLevel: Math.floor(Math.random() * 100), // Mock data
            deviceStatus: Math.random() > 0.1 ? 'online' : 'offline' // Mock data
          };
        });

        // Fetch alerts
        const alertsData = await tenantDb.alert({
          where: { 
            status: 'active',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Fetch related data for alerts
        const alertsWithDetails = await Promise.all(
          alertsData.map(async (alert) => {
            const [guard, location] = await Promise.all([
              db.guard.findUnique({ where: { id: alert.guardId } }),
              db.location.findUnique({ where: { id: alert.locationId || '' } })
            ]);

            return {
              ...alert,
              guard,
              location
            };
          })
        );

        const formattedAlerts = alertsWithDetails.map(alert => ({
          id: alert.id,
          type: alert.type,
          message: alert.message,
          severity: alert.severity,
          guard: alert.guard ? {
            name: alert.guard.name,
            photo: alert.guard.photo || undefined
          } : { name: 'Unknown Guard', photo: undefined },
          location: alert.location ? {
            latitude: alert.location.latitude,
            longitude: alert.location.longitude
          } : undefined,
          createdAt: alert.createdAt.toISOString(),
          status: alert.status
        }));

        // Fetch sites/posts
        const sitesData = await tenantDb.post();

        const formattedSites = sitesData.map(site => ({
          id: site.id,
          name: site.name,
          address: site.address,
          status: 'manned', // Simplified for now
          guardsCount: 1, // Simplified for now
          lastInspection: new Date().toISOString(), // Mock data
          inspectionScore: 85, // Mock data
          issues: Math.floor(Math.random() * 5), // Mock data
          nextInspection: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Mock data
        }));

        // Mock tasks data
        const mockTasks: Task[] = [
          {
            id: "1",
            title: "Site Inspection - Main Gate",
            description: "Conduct thorough inspection of main gate security post",
            type: "inspection",
            priority: "high",
            status: "pending",
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            location: {
              latitude: 28.6139,
              longitude: 77.2090,
              address: "Main Gate, Building A"
            }
          },
          {
            id: "2",
            title: "Guard Performance Review",
            description: "Monthly performance review for Rajesh Kumar",
            type: "review",
            priority: "medium",
            status: "in_progress",
            assignedTo: "Rajesh Kumar",
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "3",
            title: "Emergency Response Drill",
            description: "Conduct emergency response drill with night shift team",
            type: "training",
            priority: "high",
            status: "scheduled",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        // Mock operations data
        const mockOperations: FieldOperation[] = [
          {
            id: "1",
            type: "patrol",
            status: "active",
            location: "Building A - Perimeter",
            startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            guards: ["Rajesh Kumar", "Suresh Patel"],
            supervisor: "Field Officer"
          },
          {
            id: "2",
            type: "inspection",
            status: "completed",
            location: "Parking Area",
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            guards: ["Amit Singh"],
            supervisor: "Field Officer",
            notes: "All security measures in place, no issues found"
          }
        ];

        setGuards(formattedGuards);
        setAlerts(formattedAlerts);
        setSites(formattedSites);
        setTasks(mockTasks);
        setOperations(mockOperations);
      } catch (error) {
        console.error("Error fetching field officer data:", error);
        // Fallback to mock data
        const mockGuards: Guard[] = [
          {
            id: "1",
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            status: "active",
            currentLocation: {
              latitude: 28.6139,
              longitude: 77.2090,
              timestamp: new Date().toISOString()
            },
            currentShift: {
              name: "Night Shift",
              startTime: "22:00",
              endTime: "06:00",
              post: "Main Gate"
            },
            performance: {
              attendance: 95,
              punctuality: 88,
              compliance: 92,
              incidents: 1
            },
            lastCheckIn: new Date().toISOString(),
            batteryLevel: 78,
            deviceStatus: 'online'
          }
        ];

        setGuards(mockGuards);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const calculateAttendanceRate = (attendances: any[]) => {
    if (attendances.length === 0) return 0;
    const presentCount = attendances.filter(a => a.status === 'present').length;
    return Math.round((presentCount / attendances.length) * 100);
  };

  const calculatePunctualityRate = (attendances: any[]) => {
    if (attendances.length === 0) return 0;
    const onTimeCount = attendances.filter(a => {
      if (!a.checkInTime) return false;
      const checkInTime = new Date(a.checkInTime);
      const shiftStart = new Date(a.shift?.startTime || '08:00');
      const diffMinutes = Math.abs(checkInTime.getTime() - shiftStart.getTime()) / (1000 * 60);
      return diffMinutes <= 15; // Within 15 minutes
    }).length;
    return Math.round((onTimeCount / attendances.length) * 100);
  };

  const calculateComplianceRate = (guard: any) => {
    // Mock compliance calculation based on various factors
    const baseCompliance = 85;
    const incidentPenalty = guard.incidents?.length * 5 || 0;
    const statusBonus = guard.status === 'active' ? 10 : 0;
    return Math.max(0, Math.min(100, baseCompliance - incidentPenalty + statusBonus));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-red-500";
      case "on_leave": return "bg-yellow-500";
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
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

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull className="w-4 h-4 text-green-500" />;
    if (level > 20) return <Battery className="w-4 h-4 text-yellow-500" />;
    return <BatteryLow className="w-4 h-4 text-red-500" />;
  };

  const filteredGuards = guards.filter(guard => {
    const matchesSearch = guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || guard.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold">Field Officer Dashboard</h1>
          <p className="text-muted-foreground">Supervise guards, manage operations, and ensure site security</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {guards.filter(g => g.status === "active").length} Active Guards
          </Badge>
          <Badge variant="outline" className="text-sm">
            {alerts.filter(a => a.severity === "critical").length} Critical Alerts
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guards on Duty</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guards.filter(g => g.currentShift).length}</div>
            <p className="text-xs text-muted-foreground">
              {guards.filter(g => g.deviceStatus === 'online').length} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.severity === "critical").length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Managed</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
            <p className="text-xs text-muted-foreground">
              {sites.filter(s => s.status === 'manned').length} manned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.compliance, 0) / guards.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Team compliance rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Emergency Call
        </Button>
        <Button>
          <Map className="w-4 h-4 mr-2" />
          View Live Map
        </Button>
        <Button variant="outline">
          <Clipboard className="w-4 h-4 mr-2" />
          New Report
        </Button>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Broadcast Message
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guards">Guard Supervision</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
          <TabsTrigger value="sites">Site Management</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Operations</TabsTrigger>
          <TabsTrigger value="operations">Field Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest security alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.guard.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No active alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Active Operations</CardTitle>
                <CardDescription>Currently running field operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {operations.filter(o => o.status === 'active').map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{operation.type}</p>
                        <p className="text-xs text-muted-foreground">{operation.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {operation.guards.join(', ')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {operation.status}
                      </Badge>
                    </div>
                  ))}
                  {operations.filter(o => o.status === 'active').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No active operations</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Overall guard performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Attendance</span>
                      <span>{guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.attendance, 0) / guards.length) : 0}%</span>
                    </div>
                    <Progress value={guards.length > 0 ? guards.reduce((sum, g) => sum + g.performance.attendance, 0) / guards.length : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Punctuality</span>
                      <span>{guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.punctuality, 0) / guards.length) : 0}%</span>
                    </div>
                    <Progress value={guards.length > 0 ? guards.reduce((sum, g) => sum + g.performance.punctuality, 0) / guards.length : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Compliance</span>
                      <span>{guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.compliance, 0) / guards.length) : 0}%</span>
                    </div>
                    <Progress value={guards.length > 0 ? guards.reduce((sum, g) => sum + g.performance.compliance, 0) / guards.length : 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.filter(t => t.status !== 'completed').slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {tasks.filter(t => t.status !== 'completed').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending tasks</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guards" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search guards..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredGuards.map((guard) => (
              <Card key={guard.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={guard.photo || undefined} alt={guard.name} />
                        <AvatarFallback>{guard.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{guard.name}</h3>
                        <p className="text-sm text-muted-foreground">{guard.phone}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={`${getStatusColor(guard.status)} text-white`}>
                            {guard.status}
                          </Badge>
                          {guard.currentShift && (
                            <Badge variant="outline">
                              {guard.currentShift.name} - {guard.currentShift.post}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`${getStatusColor(guard.deviceStatus || 'unknown')} text-white`}>
                            {guard.deviceStatus || 'unknown'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {getBatteryIcon(guard.batteryLevel || 0)}
                          <span className="text-sm">{guard.batteryLevel}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{guard.performance.compliance}%</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span>{guard.performance.attendance}%</span>
                      </div>
                      <Progress value={guard.performance.attendance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Punctuality</span>
                        <span>{guard.performance.punctuality}%</span>
                      </div>
                      <Progress value={guard.performance.punctuality} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compliance</span>
                        <span>{guard.performance.compliance}%</span>
                      </div>
                      <Progress value={guard.performance.compliance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                      <div>
                        <h3 className="font-semibold">{alert.type}</h3>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          Guard: {alert.guard.name} • {new Date(alert.createdAt).toLocaleString()}
                        </p>
                        {alert.location && (
                          <p className="text-xs text-muted-foreground">
                            Location: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{alert.severity}</Badge>
                      <Badge variant="outline">{alert.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {alerts.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No active alerts</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <div className="grid gap-4">
            {sites.map((site) => (
              <Card key={site.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{site.name}</h3>
                      <p className="text-sm text-muted-foreground">{site.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className={`${getStatusColor(site.status)} text-white`}>
                          {site.status}
                        </Badge>
                        <Badge variant="outline">
                          {site.guardsCount} guards
                        </Badge>
                        <Badge variant="outline">
                          {site.issues} issues
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {site.inspectionScore || 0}/100
                      </p>
                      <p className="text-xs text-muted-foreground">Last inspection</p>
                      <p className="text-xs text-muted-foreground">
                        {site.lastInspection ? new Date(site.lastInspection).toLocaleDateString() : 'Never'}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clipboard className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.type}</Badge>
                        <Badge variant="outline">{task.status}</Badge>
                        {task.assignedTo && (
                          <Badge variant="outline">Assigned to: {task.assignedTo}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(task.dueDate).toLocaleString()}
                      </p>
                      {task.location && (
                        <p className="text-xs text-muted-foreground">
                          Location: {task.location.address}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4">
            {operations.map((operation) => (
              <Card key={operation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{operation.type}</h3>
                      <p className="text-sm text-muted-foreground">{operation.location}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{operation.status}</Badge>
                        <Badge variant="outline">
                          Started: {new Date(operation.startTime).toLocaleTimeString()}
                        </Badge>
                        {operation.endTime && (
                          <Badge variant="outline">
                            Ended: {new Date(operation.endTime).toLocaleTimeString()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Guards: {operation.guards.join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supervisor: {operation.supervisor}
                      </p>
                      {operation.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {operation.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}