"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Key,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Heart,
  MessageSquare
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface SystemMetrics {
  totalGuards: number;
  activeGuards: number;
  totalUsers: number;
  activeUsers: number;
  totalIncidents: number;
  activeIncidents: number;
  totalSafetyChecks: number;
  passedSafetyChecks: number;
  totalHealthRecords: number;
  activeHealthIssues: number;
  totalMessages: number;
  unreadMessages: number;
  totalAnnouncements: number;
  recentAnnouncements: number;
}

interface RecentActivity {
  id: string;
  type: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  severity?: string;
}

interface SystemHealth {
  status: string;
  uptime: string;
  responseTime: number;
  databaseSize: string;
  activeConnections: number;
  lastBackup: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalGuards: 0,
    activeGuards: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalIncidents: 0,
    activeIncidents: 0,
    totalSafetyChecks: 0,
    passedSafetyChecks: 0,
    totalHealthRecords: 0,
    activeHealthIssues: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalAnnouncements: 0,
    recentAnnouncements: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: "healthy",
    uptime: "99.9%",
    responseTime: 45,
    databaseSize: "2.3 GB",
    activeConnections: 24,
    lastBackup: "2 hours ago"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchMetrics = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch guards count
        const guardsCount = await tenantDb.guardCount({
          where: { status: "active" }
        });
        const totalGuards = await tenantDb.guardCount();

        // Fetch users count
        const usersCount = await tenantDb.userCount({
          where: { status: "active" }
        });
        const totalUsers = await tenantDb.userCount();

        // Fetch incidents count
        const activeIncidents = await tenantDb.incidentCount({
          where: { status: { in: ["reported", "investigating"] } }
        });
        const totalIncidents = await tenantDb.incidentCount();

        // Fetch safety checks
        const passedSafetyChecks = await tenantDb.safetyCheckCount({
          where: { status: "passed" }
        });
        const totalSafetyChecks = await tenantDb.safetyCheckCount();

        // Fetch health records
        const activeHealthIssues = await tenantDb.healthRecordCount({
          where: { status: { in: ["reported", "investigating"] } }
        });
        const totalHealthRecords = await tenantDb.healthRecordCount();

        setMetrics({
          totalGuards,
          activeGuards: guardsCount,
          totalUsers,
          activeUsers: usersCount,
          totalIncidents,
          activeIncidents,
          totalSafetyChecks,
          passedSafetyChecks,
          totalHealthRecords,
          activeHealthIssues,
          totalMessages: 0, // Mock data
          unreadMessages: 0, // Mock data
          totalAnnouncements: 0, // Mock data
          recentAnnouncements: 0 // Mock data
        });

        // Mock recent activity
        const mockActivity: RecentActivity[] = [
          {
            id: "1",
            type: "user",
            action: "login",
            description: "Admin user logged in",
            user: "John Doe",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            severity: "info"
          },
          {
            id: "2",
            type: "incident",
            action: "create",
            description: "New incident reported",
            user: "Rajesh Kumar",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            severity: "medium"
          },
          {
            id: "3",
            type: "guard",
            action: "status_change",
            description: "Guard status updated to active",
            user: "System",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            severity: "info"
          },
          {
            id: "4",
            type: "safety",
            action: "check_failed",
            description: "Safety check failed at Main Gate",
            user: "Suresh Patel",
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            severity: "high"
          }
        ];

        setRecentActivity(mockActivity);
      } catch (error) {
        console.error("Error fetching admin metrics:", error);
        // Fallback to mock data
        setMetrics({
          totalGuards: 25,
          activeGuards: 22,
          totalUsers: 8,
          activeUsers: 6,
          totalIncidents: 15,
          activeIncidents: 3,
          totalSafetyChecks: 150,
          passedSafetyChecks: 145,
          totalHealthRecords: 8,
          activeHealthIssues: 2,
          totalMessages: 234,
          unreadMessages: 12,
          totalAnnouncements: 5,
          recentAnnouncements: 2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [status, session]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      case "info": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="w-4 h-4" />;
      case "incident": return <AlertTriangle className="w-4 h-4" />;
      case "guard": return <Shield className="w-4 h-4" />;
      case "safety": return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and administration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            System Healthy
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guards</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalGuards}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeGuards} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalIncidents} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Checks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.passedSafetyChecks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.passedSafetyChecks / metrics.totalSafetyChecks) * 100)}% pass rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.uptime}</div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.responseTime}ms response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>System Overview</span>
            </CardTitle>
            <CardDescription>Key system metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">User Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{metrics.activeUsers}/{metrics.totalUsers}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(metrics.activeUsers / metrics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Guard Coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{metrics.activeGuards}/{metrics.totalGuards}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(metrics.activeGuards / metrics.totalGuards) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Safety Compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{metrics.passedSafetyChecks}/{metrics.totalSafetyChecks}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${(metrics.passedSafetyChecks / metrics.totalSafetyChecks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Health Issues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{metrics.activeHealthIssues}</span>
                  <Badge variant="outline" className={`${metrics.activeHealthIssues > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {metrics.activeHealthIssues > 0 ? 'Attention Needed' : 'All Clear'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{activity.description}</p>
                      <Badge variant="secondary" className={`${getSeverityColor(activity.severity || 'info')} text-white text-xs`}>
                        {activity.severity || 'info'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {systemHealth.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">{systemHealth.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium">{systemHealth.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Size</span>
                <span className="text-sm font-medium">{systemHealth.databaseSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Connections</span>
                <span className="text-sm font-medium">{systemHealth.activeConnections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm font-medium">{systemHealth.lastBackup}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Shield className="w-6 h-6 mb-2" />
                <span className="text-xs">Guard Management</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Key className="w-6 h-6 mb-2" />
                <span className="text-xs">Permissions</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-xs">Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span className="text-xs">Communications</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                <span className="text-xs">Scheduling</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Database className="w-6 h-6 mb-2" />
                <span className="text-xs">Data Export</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}