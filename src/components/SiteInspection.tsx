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
import { Progress } from "@/components/ui/progress";
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
  Camera,
  FileText,
  Star,
  Target,
  Activity,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Share,
  Copy,
  QrCode,
  Clipboard,
  CheckSquare,
  Square,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Building,
  Car,
  User,
  Phone,
  Mail,
  MessageSquare,
  Wifi,
  WifiOff,
  Battery,
  BatteryFull,
  BatteryLow,
  Navigation,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Circle
} from "lucide-react";
import { createTenantContext, db } from "@/lib/db";

interface Site {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  guardsCount: number;
  lastInspection?: string;
  nextInspection: string;
  inspectionScore?: number;
  issues: number;
  criticalIssues: number;
  compliance: number;
  manager: string;
  contact: string;
  emergencyContact: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface Inspection {
  id: string;
  siteId: string;
  siteName: string;
  type: string;
  status: string;
  inspector: string;
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  totalItems: number;
  completedItems: number;
  passedItems: number;
  failedItems: number;
  findings: InspectionFinding[];
  photos: string[];
  documents: string[];
  notes?: string;
  recommendations?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface InspectionFinding {
  id: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  photo?: string;
  recommendation: string;
  status: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  items: InspectionItem[];
  frequency: string;
  estimatedDuration: number;
}

interface InspectionItem {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  weight: number;
  criteria: string[];
  photosRequired: boolean;
  notesRequired: boolean;
}

interface QualityMetric {
  id: string;
  name: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface ComplianceReport {
  id: string;
  siteId: string;
  period: string;
  overallScore: number;
  categories: {
    safety: number;
    security: number;
    operational: number;
    documentation: number;
  };
  violations: ComplianceViolation[];
  recommendations: string[];
  generatedAt: string;
  status: string;
}

interface ComplianceViolation {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: string;
  dueDate: string;
  status: string;
  assignedTo: string;
}

export default function SiteInspection() {
  const { data: session, status } = useSession();
  const [sites, setSites] = useState<Site[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [metrics, setMetrics] = useState<QualityMetric[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isInspectionDialogOpen, setIsInspectionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newInspection, setNewInspection] = useState({
    siteId: "",
    type: "routine",
    scheduledDate: "",
    templateId: "",
    notes: ""
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch sites/posts using direct Prisma query with includes
        const sitesData = await db.post.findMany({
          where: {
            user: {
              tenantId: tenantId
            }
          },
          include: {
            guard: {
              where: {
                status: 'active'
              }
            },
            safetyChecks: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        });

        const formattedSites = sitesData.map(site => ({
          id: site.id,
          name: site.name,
          address: site.address,
          type: "building",
          status: site.guard ? 'manned' : 'unmanned',
          guardsCount: site.guard ? 1 : 0,
          lastInspection: site.safetyChecks[0]?.createdAt?.toISOString() || undefined,
          nextInspection: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          inspectionScore: site.safetyChecks[0]?.score || 0,
          issues: Math.floor(Math.random() * 5),
          criticalIssues: Math.floor(Math.random() * 2),
          compliance: Math.floor(Math.random() * 30) + 70,
          manager: "Site Manager",
          contact: "manager@site.com",
          emergencyContact: "+91 98765 43210",
          coordinates: {
            latitude: site.latitude,
            longitude: site.longitude
          }
        }));

        // Mock inspections data
        const mockInspections: Inspection[] = [
          {
            id: "1",
            siteId: formattedSites[0]?.id || "1",
            siteName: formattedSites[0]?.name || "Main Building",
            type: "routine",
            status: "completed",
            inspector: "Field Officer",
            scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            score: 85,
            totalItems: 25,
            completedItems: 25,
            passedItems: 22,
            failedItems: 3,
            findings: [
              {
                id: "1",
                category: "Safety",
                severity: "medium",
                description: "Fire extinguisher expired",
                location: "Main entrance",
                recommendation: "Replace fire extinguisher immediately",
                status: "pending"
              },
              {
                id: "2",
                category: "Security",
                severity: "low",
                description: "Minor damage to perimeter fence",
                location: "East boundary",
                recommendation: "Schedule repair work",
                status: "pending"
              }
            ],
            photos: ["photo1.jpg", "photo2.jpg"],
            documents: ["inspection_report.pdf"],
            notes: "Overall good condition with minor issues requiring attention",
            recommendations: "Address expired safety equipment and schedule fence repairs",
            followUpRequired: true,
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            siteId: formattedSites[1]?.id || "2",
            siteName: formattedSites[1]?.name || "Parking Area",
            type: "safety",
            status: "in_progress",
            inspector: "Field Officer",
            scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            totalItems: 20,
            completedItems: 15,
            passedItems: 14,
            failedItems: 1,
            findings: [
              {
                id: "3",
                category: "Safety",
                severity: "high",
                description: "Poor lighting in section B",
                location: "Parking section B",
                recommendation: "Install additional lighting fixtures",
                status: "pending"
              }
            ],
            photos: [],
            documents: [],
            followUpRequired: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        // Mock templates
        const mockTemplates: InspectionTemplate[] = [
          {
            id: "1",
            name: "Routine Security Inspection",
            description: "Comprehensive security inspection for all sites",
            category: "security",
            items: [
              {
                id: "1",
                name: "Perimeter Security",
                description: "Check perimeter fencing, gates, and barriers",
                type: "checklist",
                required: true,
                weight: 10,
                criteria: ["Fencing intact", "Gates functional", "No breaches"],
                photosRequired: true,
                notesRequired: true
              },
              {
                id: "2",
                name: "Access Control",
                description: "Verify access control systems and procedures",
                type: "checklist",
                required: true,
                weight: 15,
                criteria: ["Systems operational", "Procedures followed", "Logs maintained"],
                photosRequired: false,
                notesRequired: true
              }
            ],
            frequency: "monthly",
            estimatedDuration: 120
          },
          {
            id: "2",
            name: "Safety Compliance Check",
            description: "Safety equipment and compliance verification",
            category: "safety",
            items: [
              {
                id: "3",
                name: "Fire Safety Equipment",
                description: "Inspect fire extinguishers, alarms, and exits",
                type: "checklist",
                required: true,
                weight: 20,
                criteria: ["Equipment present", "Not expired", "Accessible", "Functional"],
                photosRequired: true,
                notesRequired: true
              }
            ],
            frequency: "quarterly",
            estimatedDuration: 90
          }
        ];

        // Mock quality metrics
        const mockMetrics: QualityMetric[] = [
          {
            id: "1",
            name: "Inspection Completion Rate",
            category: "efficiency",
            target: 95,
            current: 87,
            unit: "%",
            trend: "up",
            status: "good"
          },
          {
            id: "2",
            name: "Average Inspection Score",
            category: "quality",
            target: 90,
            current: 85,
            unit: "%",
            trend: "stable",
            status: "warning"
          },
          {
            id: "3",
            name: "Critical Issues Resolution",
            category: "compliance",
            target: 100,
            current: 92,
            unit: "%",
            trend: "up",
            status: "good"
          },
          {
            id: "4",
            name: "Follow-up Completion",
            category: "compliance",
            target: 90,
            current: 78,
            unit: "%",
            trend: "down",
            status: "warning"
          }
        ];

        // Mock compliance reports
        const mockReports: ComplianceReport[] = [
          {
            id: "1",
            siteId: formattedSites[0]?.id || "1",
            period: "2024-Q1",
            overallScore: 85,
            categories: {
              safety: 88,
              security: 82,
              operational: 87,
              documentation: 83
            },
            violations: [
              {
                id: "1",
                type: "safety",
                severity: "medium",
                description: "Expired fire extinguisher",
                location: "Main building",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: "pending",
                assignedTo: "Site Manager"
              }
            ],
            recommendations: [
              "Replace expired safety equipment",
              "Improve documentation procedures",
              "Schedule regular training sessions"
            ],
            generatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "approved"
          }
        ];

        setSites(formattedSites);
        setInspections(mockInspections);
        setTemplates(mockTemplates);
        setMetrics(mockMetrics);
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching site inspection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "scheduled": return "bg-yellow-500";
      case "overdue": return "bg-red-500";
      case "cancelled": return "bg-gray-500";
      case "manned": return "bg-green-500";
      case "unmanned": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-blue-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      case "critical": return "text-red-800";
      default: return "text-gray-600";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "stable": return <BarChart3 className="w-4 h-4 text-blue-500" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    const matchesType = typeFilter === "all" || site.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter;
    const matchesType = typeFilter === "all" || inspection.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateInspection = async () => {
    if (!session) return;

    try {
      const selectedSite = sites.find(site => site.id === newInspection.siteId);
      const inspection = {
        id: `inspection-${Date.now()}`,
        siteName: selectedSite?.name || "Unknown Site",
        ...newInspection,
        inspector: session.user.name || "Field Officer",
        status: "scheduled",
        totalItems: 0,
        completedItems: 0,
        passedItems: 0,
        failedItems: 0,
        findings: [],
        photos: [],
        documents: [],
        followUpRequired: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to local state
      setInspections(prev => [inspection, ...prev]);

      // Reset form and close dialog
      setNewInspection({
        siteId: "",
        type: "routine",
        scheduledDate: "",
        templateId: "",
        notes: ""
      });
      setIsInspectionDialogOpen(false);
    } catch (error) {
      console.error("Error creating inspection:", error);
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
          <h1 className="text-3xl font-bold">Site Inspection & Quality Control</h1>
          <p className="text-muted-foreground">Manage site inspections, quality metrics, and compliance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {sites.length} Sites
          </Badge>
          <Badge variant="outline" className="text-sm">
            {inspections.filter(i => i.status === 'in_progress').length} Active Inspections
          </Badge>
          <Badge variant="outline" className="text-sm">
            {inspections.filter(i => i.findings.some(f => f.severity === 'critical')).length} Critical Issues
          </Badge>
          <Dialog open={isInspectionDialogOpen} onOpenChange={setIsInspectionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Inspection</DialogTitle>
                <DialogDescription>
                  Create a new site inspection
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site">Site</Label>
                  <Select 
                    value={newInspection.siteId} 
                    onValueChange={(value) => setNewInspection(prev => ({ ...prev, siteId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Inspection Type</Label>
                  <Select value={newInspection.type} onValueChange={(value) => setNewInspection(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={newInspection.scheduledDate}
                    onChange={(e) => setNewInspection(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="template">Template (Optional)</Label>
                  <Select 
                    value={newInspection.templateId} 
                    onValueChange={(value) => setNewInspection(prev => ({ ...prev, templateId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newInspection.notes}
                    onChange={(e) => setNewInspection(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or instructions..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsInspectionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInspection}>
                    Schedule Inspection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Avg Inspection Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.filter(i => i.score).length > 0 
                ? Math.round(inspections.filter(i => i.score).reduce((sum, i) => sum + (i.score || 0), 0) / inspections.filter(i => i.score).length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall quality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.reduce((sum, i) => sum + i.findings.filter(f => f.status === 'pending').length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sites.length > 0 ? Math.round(sites.reduce((sum, s) => sum + s.compliance, 0) / sites.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Key performance indicators for site quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.id}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-sm font-medium">{metric.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{metric.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${getMetricStatusColor(metric.status)}`}>
                            {metric.current}{metric.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Target: {metric.target}{metric.unit}</span>
                        <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Inspections */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Inspections</CardTitle>
                <CardDescription>Latest completed and ongoing inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspections
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((inspection) => (
                      <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(inspection.status)}`}></div>
                          <div>
                            <p className="text-sm font-medium">{inspection.siteName}</p>
                            <p className="text-xs text-muted-foreground">
                              {inspection.inspector} • {new Date(inspection.scheduledDate).toLocaleDateString()}
                            </p>
                            {inspection.score && (
                              <p className="text-xs text-muted-foreground">
                                Score: {inspection.score}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{inspection.type}</Badge>
                          <Badge variant="outline">{inspection.status}</Badge>
                        </div>
                      </div>
                    ))}
                  {inspections.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No inspections yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>High-priority issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspections
                    .flatMap(i => i.findings)
                    .filter(f => f.severity === 'critical' || f.severity === 'high')
                    .slice(0, 5)
                    .map((finding) => (
                      <div key={finding.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">{finding.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {finding.location} • {finding.category}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {finding.severity}
                        </Badge>
                      </div>
                    ))}
                  {inspections.flatMap(i => i.findings).filter(f => f.severity === 'critical' || f.severity === 'high').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No critical issues</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Inspections */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Inspections</CardTitle>
                <CardDescription>Scheduled inspections for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspections
                    .filter(i => i.status === 'scheduled')
                    .filter(i => new Date(i.scheduledDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .slice(0, 5)
                    .map((inspection) => (
                      <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{inspection.siteName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(inspection.scheduledDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{inspection.type}</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {inspections.filter(i => i.status === 'scheduled').length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No upcoming inspections</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
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
                <SelectItem value="manned">Manned</SelectItem>
                <SelectItem value="unmanned">Unmanned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="parking">Parking</SelectItem>
                <SelectItem value="perimeter">Perimeter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredSites.map((site) => (
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
                        <Badge variant="outline">{site.type}</Badge>
                        <Badge variant="outline">{site.guardsCount} guards</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Manager: {site.manager} • Contact: {site.contact}
                      </p>
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
                  
                  {/* Site Metrics */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{site.issues}</p>
                      <p className="text-xs text-muted-foreground">Issues</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{site.criticalIssues}</p>
                      <p className="text-xs text-muted-foreground">Critical</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{site.compliance}%</p>
                      <p className="text-xs text-muted-foreground">Compliance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {site.nextInspection ? new Date(site.nextInspection).toLocaleDateString() : 'Not scheduled'}
                      </p>
                      <p className="text-xs text-muted-foreground">Next inspection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search inspections..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredInspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(inspection.status)}`}></div>
                      <div>
                        <h3 className="font-semibold">{inspection.siteName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Inspector: {inspection.inspector} • Type: {inspection.type}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{inspection.status}</Badge>
                          {inspection.score && (
                            <Badge variant="outline">Score: {inspection.score}%</Badge>
                          )}
                          <Badge variant="outline">
                            {inspection.completedItems}/{inspection.totalItems} items
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Scheduled: {new Date(inspection.scheduledDate).toLocaleString()}
                          {inspection.completedDate && ` • Completed: ${new Date(inspection.completedDate).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round((inspection.completedItems / inspection.totalItems) * 100)}%</span>
                    </div>
                    <Progress value={(inspection.completedItems / inspection.totalItems) * 100} className="h-2" />
                  </div>

                  {/* Findings Summary */}
                  {inspection.findings.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Findings:</p>
                      <div className="flex flex-wrap gap-2">
                        {inspection.findings.slice(0, 3).map((finding) => (
                          <Badge 
                            key={finding.id} 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(finding.severity)}`}
                          >
                            {finding.category}: {finding.severity}
                          </Badge>
                        ))}
                        {inspection.findings.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{inspection.findings.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Status */}
                  {inspection.followUpRequired && (
                    <div className="mt-4 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600">
                        Follow-up required by {inspection.followUpDate ? new Date(inspection.followUpDate).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics Dashboard</CardTitle>
              <CardDescription>Detailed quality metrics and trends analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{metric.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getTrendIcon(metric.trend)}
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                            {metric.current}{metric.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Target: {metric.target}{metric.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Progress value={(metric.current / metric.target) * 100} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>0%</span>
                      <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Compliance Report - {report.period}</h3>
                      <p className="text-sm text-muted-foreground">
                        Generated: {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{report.status}</Badge>
                        <Badge variant="outline">Score: {report.overallScore}%</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Category Scores */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{report.categories.safety}%</p>
                      <p className="text-xs text-muted-foreground">Safety</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{report.categories.security}%</p>
                      <p className="text-xs text-muted-foreground">Security</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{report.categories.operational}%</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{report.categories.documentation}%</p>
                      <p className="text-xs text-muted-foreground">Documentation</p>
                    </div>
                  </div>

                  {/* Violations */}
                  {report.violations.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Violations:</p>
                      <div className="space-y-2">
                        {report.violations.map((violation) => (
                          <div key={violation.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="text-sm">{violation.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {violation.location} • Due: {new Date(violation.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                              {violation.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {reports.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No compliance reports available</p>
                </CardContent>
              </Card>
            )}
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
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant="outline">{template.frequency}</Badge>
                        <Badge variant="outline">{template.estimatedDuration} min</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.items.length} items
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
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