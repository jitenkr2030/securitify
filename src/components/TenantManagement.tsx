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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Settings,
  Users,
  Activity,
  Database,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface Tenant {
  id: string;
  name: string;
  domain?: string;
  subdomain?: string;
  status: string;
  plan: string;
  stripeCustomerId?: string;
  createdAt: string;
  users: User[];
  guards: Guard[];
  settings: TenantSetting[];
}

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
}

interface Guard {
  id: string;
  name: string;
  status: string;
}

interface TenantSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
}

interface NewTenant {
  name: string;
  domain?: string;
  subdomain?: string;
  plan: string;
}

interface SystemMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalGuards: number;
  systemHealth: string;
}

export default function TenantManagement() {
  const { data: session, status } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    totalGuards: 0,
    systemHealth: "healthy"
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState<NewTenant>({
    name: "",
    domain: "",
    subdomain: "",
    plan: "basic"
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        // Only super admin can access tenant management
        if (session.user.role !== 'super_admin') {
          return;
        }

        // For demo purposes, we'll use mock data
        const mockTenants: Tenant[] = [
          {
            id: "1",
            name: "SecureGuard Solutions",
            domain: "secureguard.example.com",
            subdomain: "secureguard",
            status: "active",
            plan: "professional",
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            users: [
              { id: "1", email: "admin@secureguard.com", name: "John Doe", role: "admin", status: "active" }
            ],
            guards: [
              { id: "1", name: "Rajesh Kumar", status: "active" }
            ],
            settings: []
          },
          {
            id: "2",
            name: "Shield Security Services",
            domain: "shieldsecurity.example.com",
            subdomain: "shield",
            status: "active",
            plan: "enterprise",
            createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
            users: [
              { id: "2", email: "admin@shieldsecurity.com", name: "Jane Smith", role: "admin", status: "active" }
            ],
            guards: [
              { id: "2", name: "Suresh Patel", status: "active" }
            ],
            settings: []
          }
        ];

        const mockSystemMetrics: SystemMetrics = {
          totalTenants: mockTenants.length,
          activeTenants: mockTenants.filter(t => t.status === 'active').length,
          totalUsers: mockTenants.reduce((acc, tenant) => acc + tenant.users.length, 0),
          totalGuards: mockTenants.reduce((acc, tenant) => acc + tenant.guards.length, 0),
          systemHealth: "healthy"
        };

        setTenants(mockTenants);
        setSystemMetrics(mockSystemMetrics);
      } catch (error) {
        console.error("Error fetching tenant management data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tenant.domain && tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (tenant.subdomain && tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "suspended": return "bg-red-500";
      case "cancelled": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic": return "bg-blue-500";
      case "professional": return "bg-purple-500";
      case "enterprise": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const handleCreateTenant = async () => {
    if (!session) return;

    try {
      // For demo purposes, we'll just add to local state
      const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        domain: newTenant.domain,
        subdomain: newTenant.subdomain,
        status: "active",
        plan: newTenant.plan,
        createdAt: new Date().toISOString(),
        users: [],
        guards: [],
        settings: []
      };

      setTenants(prev => [tenant, ...prev]);
      setSystemMetrics(prev => ({
        ...prev,
        totalTenants: prev.totalTenants + 1,
        activeTenants: prev.activeTenants + 1
      }));

      // Reset form and close dialog
      setNewTenant({
        name: "",
        domain: "",
        subdomain: "",
        plan: "basic"
      });
      setIsTenantDialogOpen(false);
    } catch (error) {
      console.error("Error creating tenant:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only show for super admin
  if (session?.user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access tenant management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage multi-tenant instances and system-wide settings</p>
        </div>
        <Dialog open={isTenantDialogOpen} onOpenChange={setIsTenantDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Add a new tenant to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input
                  id="tenantName"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={newTenant.domain}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="company.example.com"
                />
              </div>
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  value={newTenant.subdomain}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="company"
                />
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select value={newTenant.plan} onValueChange={(value) => setNewTenant(prev => ({ ...prev, plan: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTenantDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTenant}>
                  Create Tenant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics.activeTenants} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guards</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalGuards}</div>
            <p className="text-xs text-muted-foreground">
              Across all tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemMetrics.systemHealth}</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tenants Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tenant Instances</CardTitle>
              <CardDescription>Manage all tenant accounts and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Guards</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {tenant.domain && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Globe className="w-3 h-3" />
                              <span>{tenant.domain}</span>
                            </div>
                          )}
                          {tenant.subdomain && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <span>{tenant.subdomain}.app.com</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(tenant.status)} text-white`}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getPlanColor(tenant.plan)} text-white`}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{tenant.users.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4" />
                          <span>{tenant.guards.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Global system settings and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Registration Enabled</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Verification</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Default Language</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Session Timeout</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Password Policy</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Auth</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Tenant Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Tenants (This Month)</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Tenants</span>
                    <span className="font-medium">{systemMetrics.activeTenants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-medium">$398</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Resource Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Size</span>
                    <span className="font-medium">2.3 GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Connections</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Requests Today</span>
                    <span className="font-medium">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}