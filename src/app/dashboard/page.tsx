"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Search, 
  Filter,
  LogOut,
  Shield,
  Settings,
  Calendar,
  Map,
  Smartphone,
  Building2
} from "lucide-react";
import LiveMapWrapper from "@/components/LiveMapWrapper";
import LeaveManagement from "@/components/LeaveManagement";
import AdvancedGeofencing from "@/components/AdvancedGeofencing";
import MobileAppEnhancement from "@/components/MobileAppEnhancement";
import IncidentReporting from "@/components/IncidentReporting";
import GuardCommunication from "@/components/GuardCommunication";
import HealthSafetyMonitoring from "@/components/HealthSafetyMonitoring";
import AdminDashboard from "@/components/AdminDashboard";
import UserManagement from "@/components/UserManagement";
import TenantManagement from "@/components/TenantManagement";
import FieldOfficerDashboard from "@/components/FieldOfficerDashboard";
import FieldOperationsManagement from "@/components/FieldOperationsManagement";
import GuardSupervision from "@/components/GuardSupervision";
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
  createdAt: string;
}

export default function SecuritifyDashboard() {
  const { data: session, status } = useSession();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  useEffect(() => {
    // Only fetch data if session is available
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        // Get tenant context
        const tenantId = session.user.tenantId;

        // Fetch guards using direct db access with tenant filtering
        const guardsData = await db.guard.findMany({
          where: {
            user: {
              tenantId: tenantId
            }
          },
          include: {
            user: true,
            shifts: {
              where: { status: 'in_progress' },
              include: {
                post: true
              },
              take: 1
            },
            locations: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        });

        // Format guards data
        const formattedGuards = guardsData.map(guard => ({
          id: guard.id,
          name: guard.name,
          phone: guard.phone,
          status: guard.status,
          photo: guard.photo || undefined,
          currentLocation: guard.locations[0] ? {
            latitude: guard.locations[0].latitude,
            longitude: guard.locations[0].longitude,
            timestamp: guard.locations[0].timestamp.toISOString()
          } : undefined,
          currentShift: guard.shifts[0] ? {
            name: guard.shifts[0].name,
            startTime: guard.shifts[0].startTime.toISOString(),
            endTime: guard.shifts[0].endTime.toISOString(),
            post: guard.shifts[0].post.name
          } : undefined
        }));

        // Fetch alerts using direct db access with tenant filtering
        const alertsData = await db.alert.findMany({
          where: { 
            status: 'active',
            user: {
              tenantId: tenantId
            }
          },
          include: {
            guard: true
          },
          orderBy: { createdAt: 'desc' }
        });

        const formattedAlerts = alertsData.map(alert => ({
          id: alert.id,
          type: alert.type,
          message: alert.message,
          severity: alert.severity,
          guard: {
            name: alert.guard.name,
            photo: alert.guard.photo || undefined
          },
          createdAt: alert.createdAt.toISOString()
        }));

        setGuards(formattedGuards);
        setAlerts(formattedAlerts);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data for development
        const mockGuards: Guard[] = [
          {
            id: "1",
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            status: "active",
            photo: "/api/placeholder/40/40",
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
            }
          },
          {
            id: "2",
            name: "Suresh Patel",
            phone: "+91 87654 32109",
            status: "active",
            photo: "/api/placeholder/40/40",
            currentLocation: {
              latitude: 28.6140,
              longitude: 77.2091,
              timestamp: new Date().toISOString()
            },
            currentShift: {
              name: "Day Shift",
              startTime: "08:00",
              endTime: "16:00",
              post: "Parking Area"
            }
          }
        ];

        const mockAlerts: Alert[] = [
          {
            id: "1",
            type: "geofence_breach",
            message: "Guard Rajesh Kumar has left the designated area",
            severity: "high",
            guard: {
              name: "Rajesh Kumar",
              photo: "/api/placeholder/40/40"
            },
            createdAt: new Date(Date.now() - 300000).toISOString()
          }
        ];

        setGuards(mockGuards);
        setAlerts(mockAlerts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  // Show loading state while session is loading
  if (status === "loading") {
    console.log('📊 Dashboard: Session loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!session) {
    console.log('📊 Dashboard: No session found, redirecting to sign in');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
          <Button onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/signin';
            }
          }}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  console.log('📊 Dashboard: Session found for user:', session.user?.email, 'Role:', session.user?.role);

  const filteredGuards = guards.filter(guard => {
    const matchesSearch = guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || guard.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-red-500";
      case "on_leave": return "bg-yellow-500";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-sm font-medium text-blue-600">{session.user.tenantName}</h1>
            <Badge variant="outline" className="text-xs">
              {session.user.tenantPlan}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">Security Guard Management</h1>
          <p className="text-muted-foreground">Real-time tracking and workforce management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{session?.user?.role || 'guest'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guards</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guards.length}</div>
            <p className="text-xs text-muted-foreground">
              {guards.filter(g => g.status === "active").length} on duty
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
            <CardTitle className="text-sm font-medium">On Shift</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.filter(g => g.currentShift).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.filter(g => g.status === "on_leave").length}
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <MapPin className="w-4 h-4 mr-2" />
          View Map
        </Button>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Guard
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="guards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="guards">Guards</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="health">Health & Safety</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="geofencing">Geofencing</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          {session?.user?.role === 'field_officer' && (
            <>
              <TabsTrigger value="field_officer">Field Officer</TabsTrigger>
              <TabsTrigger value="field_operations">Field Operations</TabsTrigger>
              <TabsTrigger value="guard_supervision">Guard Supervision</TabsTrigger>
            </>
          )}
          {(session?.user?.role === 'admin' || session?.user?.role === 'super_admin') && (
            <>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </>
          )}
          {session?.user?.role === 'super_admin' && (
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
          )}
        </TabsList>

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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {guard.currentLocation && (
                        <div className="text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Last seen: {new Date(guard.currentLocation.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                      <Button variant="outline" size="sm">View Details</Button>
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
              <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                          {alert.severity}
                        </Badge>
                        <span className="font-medium">{alert.guard.name}</span>
                      </div>
                      <p>{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Resolve</Button>
                      <Button variant="outline" size="sm">Dismiss</Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <IncidentReporting />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <GuardCommunication />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <HealthSafetyMonitoring />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Live Guard Tracking</CardTitle>
              <CardDescription>Real-time location tracking of all security guards</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <LiveMapWrapper guards={guards} geofences={[]} alerts={alerts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <LeaveManagement />
        </TabsContent>

        <TabsContent value="geofencing" className="space-y-4">
          <AdvancedGeofencing />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <MobileAppEnhancement />
        </TabsContent>

        {session?.user?.role === 'field_officer' && (
          <>
            <TabsContent value="field_officer" className="space-y-4">
              <FieldOfficerDashboard />
            </TabsContent>
            <TabsContent value="field_operations" className="space-y-4">
              <FieldOperationsManagement />
            </TabsContent>
            <TabsContent value="guard_supervision" className="space-y-4">
              <GuardSupervision />
            </TabsContent>
          </>
        )}

        {(session?.user?.role === 'admin' || session?.user?.role === 'super_admin') && (
          <>
            <TabsContent value="admin" className="space-y-4">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
          </>
        )}
        {session?.user?.role === 'super_admin' && (
          <TabsContent value="tenants" className="space-y-4">
            <TenantManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}