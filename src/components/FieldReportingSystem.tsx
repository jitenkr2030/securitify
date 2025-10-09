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
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Download,
  Upload,
  Camera,
  Video,
  Mic,
  Image as ImageIcon,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSignature,
  Stamp,
  Eye,
  Edit,
  Trash2,
  Share2,
  Printer,
  Mail,
  MessageSquare
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface FieldReport {
  id: string;
  title: string;
  content: string;
  type: ReportType;
  status: ReportStatus;
  location?: string;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  attachments?: ReportAttachment[];
  tags?: string[];
  priority: ReportPriority;
}

interface ReportAttachment {
  id: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  fields: TemplateField[];
  isDefault: boolean;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'time' | 'number' | 'file';
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

type ReportType = 'incident' | 'daily' | 'weekly' | 'monthly' | 'inspection' | 'maintenance' | 'safety' | 'compliance';
type ReportStatus = 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

export default function FieldReportingSystem() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [newReport, setNewReport] = useState({
    title: "",
    content: "",
    type: 'daily' as ReportType,
    location: "",
    priority: 'medium' as ReportPriority,
    tags: [] as string[]
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchReports = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Mock data for now
        const mockReports: FieldReport[] = [
          {
            id: "1",
            title: "Daily Security Report - Site A",
            content: "Routine patrol completed. All areas secure. No incidents reported during shift.",
            type: "daily",
            status: "approved",
            location: "Site A - Main Building",
            submittedBy: "Rajesh Kumar",
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            reviewedBy: "Field Officer Smith",
            reviewedAt: new Date(Date.now() - 72000000).toISOString(),
            priority: "medium",
            tags: ["routine", "patrol", "site-a"],
            attachments: [
              {
                id: "1",
                filename: "patrol_log.pdf",
                type: "application/pdf",
                size: 2048000,
                url: "/api/placeholder/file.pdf",
                uploadedAt: new Date(Date.now() - 86400000).toISOString()
              }
            ]
          },
          {
            id: "2",
            title: "Incident Follow-up Report",
            content: "Follow-up on yesterday's security breach incident. Additional measures implemented.",
            type: "incident",
            status: "submitted",
            location: "Site B - Parking Area",
            submittedBy: "Suresh Patel",
            submittedAt: new Date(Date.now() - 43200000).toISOString(),
            priority: "high",
            tags: ["incident", "follow-up", "security"],
            attachments: [
              {
                id: "2",
                filename: "incident_photos.zip",
                type: "application/zip",
                size: 5120000,
                url: "/api/placeholder/file.zip",
                uploadedAt: new Date(Date.now() - 43200000).toISOString()
              },
              {
                id: "3",
                filename: "witness_statements.pdf",
                type: "application/pdf",
                size: 1024000,
                url: "/api/placeholder/file.pdf",
                uploadedAt: new Date(Date.now() - 43200000).toISOString()
              }
            ]
          },
          {
            id: "3",
            title: "Weekly Safety Inspection",
            content: "Weekly safety inspection completed. All safety equipment in good condition.",
            type: "inspection",
            status: "draft",
            location: "All Sites",
            submittedBy: "Field Officer Johnson",
            submittedAt: new Date(Date.now() - 3600000).toISOString(),
            priority: "medium",
            tags: ["safety", "inspection", "weekly"]
          }
        ];

        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTemplates = async () => {
      // Mock templates
      const mockTemplates: ReportTemplate[] = [
        {
          id: "1",
          name: "Daily Security Report",
          description: "Standard daily security patrol and activity report",
          type: "daily",
          isDefault: true,
          fields: [
            { id: "1", name: "Shift Summary", type: "textarea", required: true },
            { id: "2", name: "Incidents", type: "textarea", required: false },
            { id: "3", name: "Weather Conditions", type: "select", required: true, options: ["Clear", "Rain", "Fog", "Snow"] },
            { id: "4", name: "Patrol Routes Completed", type: "multiselect", required: true, options: ["Route A", "Route B", "Route C"] }
          ]
        },
        {
          id: "2",
          name: "Incident Report",
          description: "Detailed incident reporting template",
          type: "incident",
          isDefault: true,
          fields: [
            { id: "1", name: "Incident Type", type: "select", required: true, options: ["Security Breach", "Theft", "Medical", "Fire"] },
            { id: "2", name: "Description", type: "textarea", required: true },
            { id: "3", name: "Time of Incident", type: "date", required: true },
            { id: "4", name: "Witnesses", type: "text", required: false },
            { id: "5", name: "Evidence Collected", type: "file", required: false }
          ]
        },
        {
          id: "3",
          name: "Safety Inspection",
          description: "Comprehensive safety inspection checklist",
          type: "inspection",
          isDefault: false,
          fields: [
            { id: "1", name: "Equipment Check", type: "multiselect", required: true, options: ["Fire Extinguisher", "First Aid", "Emergency Lights"] },
            { id: "2", name: "Hazards Identified", type: "textarea", required: false },
            { id: "3", name: "Overall Safety Score", type: "number", required: true },
            { id: "4", name: "Recommendations", type: "textarea", required: false }
          ]
        }
      ];

      setTemplates(mockTemplates);
    };

    fetchReports();
    fetchTemplates();
  }, [status, session]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "draft": return "bg-gray-500";
      case "submitted": return "bg-blue-500";
      case "reviewed": return "bg-yellow-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case "incident": return <AlertTriangle className="w-4 h-4" />;
      case "daily": return <FileText className="w-4 h-4" />;
      case "weekly": return <Calendar className="w-4 h-4" />;
      case "monthly": return <BarChart3 className="w-4 h-4" />;
      case "inspection": return <CheckCircle className="w-4 h-4" />;
      case "safety": return <Stamp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: ReportPriority) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateReport = () => {
    if (!selectedTemplate) return;

    const report: FieldReport = {
      id: Date.now().toString(),
      title: newReport.title,
      content: newReport.content,
      type: selectedTemplate.type,
      status: 'draft',
      location: newReport.location,
      submittedBy: session?.user?.name || "Unknown",
      submittedAt: new Date().toISOString(),
      priority: newReport.priority,
      tags: newReport.tags
    };

    setReports(prev => [report, ...prev]);
    setNewReport({
      title: "",
      content: "",
      type: 'daily',
      location: "",
      priority: 'medium',
      tags: []
    });
    setSelectedTemplate(null);
    setIsCreateDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mock file upload
    console.log("File upload:", event.target.files);
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
          <h1 className="text-3xl font-bold">Field Reporting & Documentation</h1>
          <p className="text-muted-foreground">Create, manage, and track field reports and documentation</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Choose a template and fill in the required information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {!selectedTemplate ? (
                <div className="space-y-4">
                  <Label>Select Report Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(template => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-colors hover:border-primary ${
                          template.isDefault ? 'border-primary/50' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {template.isDefault && <Badge variant="default">Default</Badge>}
                          </div>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span>{template.fields.length} fields</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Change Template
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Report Title</Label>
                      <Input
                        id="title"
                        value={newReport.title}
                        onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter report title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newReport.location}
                        onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newReport.content}
                      onChange={(e) => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter report content"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newReport.priority} onValueChange={(value: ReportPriority) => setNewReport(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="attachments">Attachments</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateReport}>
                      Create Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'submitted').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Stamp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Field Reports</CardTitle>
          <CardDescription>Manage and track all field reports and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredReports.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <CardTitle className="text-xl">{report.title}</CardTitle>
                        <Badge variant="outline" className={`text-white ${getStatusColor(report.status)}`}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{report.content}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium capitalize">{report.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted By:</span>
                      <div className="font-medium">{report.submittedBy}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <div className="font-medium">
                        {new Date(report.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Attachments:</span>
                      <div className="font-medium">
                        {report.attachments?.length || 0} files
                      </div>
                    </div>
                  </div>

                  {report.location && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{report.location}</span>
                    </div>
                  )}

                  {report.tags && report.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {report.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {report.attachments && report.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">Attachments:</Label>
                      <div className="flex flex-wrap gap-2">
                        {report.attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span>{attachment.filename}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}