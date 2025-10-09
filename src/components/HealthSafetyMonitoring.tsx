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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Thermometer,
  Activity,
  Clock,
  Calendar,
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface HealthRecord {
  id: string;
  type: string;
  description: string;
  severity: string;
  status: string;
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string | null;
  actionTaken?: string | null;
  guardId: string;
  healthReports: HealthReport[];
}

interface HealthReport {
  id: string;
  reportType: string;
  content: string;
  attachments?: string;
  reportedBy: string;
  createdAt: string;
}

interface SafetyCheck {
  id: string;
  type: string;
  status: string;
  score?: number | null;
  issues?: string | null;
  recommendations?: string | null;
  checkedAt: string;
  guardId: string;
  postId?: string | null;
}

interface WellnessCheck {
  id: string;
  mood: string;
  energy: string;
  stress: string;
  sleep: string;
  notes?: string | null;
  createdAt: string;
  guardId: string;
}

interface NewHealthRecord {
  type: string;
  description: string;
  severity: string;
  vitals?: string;
  symptoms?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export default function HealthSafetyMonitoring() {
  const { data: session, status } = useSession();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [safetyChecks, setSafetyChecks] = useState<SafetyCheck[]>([]);
  const [wellnessChecks, setWellnessChecks] = useState<WellnessCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [isSafetyDialogOpen, setIsSafetyDialogOpen] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<HealthRecord | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [newHealthRecord, setNewHealthRecord] = useState<NewHealthRecord>({
    type: "",
    description: "",
    severity: "medium",
    vitals: "",
    symptoms: "",
    treatment: "",
    followUpRequired: false,
    followUpDate: ""
  });
  const [newSafetyCheck, setNewSafetyCheck] = useState({
    type: "pre_shift",
    issues: "",
    recommendations: "",
    score: 100
  });
  const [newReport, setNewReport] = useState({
    content: "",
    reportType: "follow_up",
    attachments: ""
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch health records
        const healthRecordsData = await tenantDb.healthRecord({
          orderBy: { reportedAt: 'desc' }
        });

        const formattedHealthRecords = healthRecordsData.map(record => ({
          id: record.id,
          type: record.type,
          description: record.description,
          severity: record.severity,
          status: record.status,
          reportedAt: record.reportedAt.toISOString(),
          resolvedAt: record.resolvedAt ? record.resolvedAt.toISOString() : undefined,
          resolution: record.resolution,
          actionTaken: record.actionTaken,
          guardId: record.guardId,
          healthReports: [] // Will be populated separately if needed
        }));

        // Fetch safety checks
        const safetyChecksData = await tenantDb.safetyCheck({
          orderBy: { checkedAt: 'desc' }
        });

        const formattedSafetyChecks = safetyChecksData.map(check => ({
          id: check.id,
          type: check.type,
          status: check.status,
          score: check.score,
          issues: check.issues,
          recommendations: check.recommendations,
          checkedAt: check.checkedAt.toISOString(),
          guardId: check.guardId,
          postId: check.postId
        }));

        // Fetch wellness checks
        const wellnessChecksData = await tenantDb.wellnessCheck({
          orderBy: { createdAt: 'desc' }
        });

        const formattedWellnessChecks = wellnessChecksData.map(check => ({
          id: check.id,
          mood: check.mood,
          energy: check.energy,
          stress: check.stress,
          sleep: check.sleep,
          notes: check.notes,
          createdAt: check.createdAt.toISOString(),
          guardId: check.guardId
        }));

        setHealthRecords(formattedHealthRecords);
        setSafetyChecks(formattedSafetyChecks);
        setWellnessChecks(formattedWellnessChecks);
      } catch (error) {
        console.error("Error fetching health and safety data:", error);
        // Fallback to mock data
        const mockHealthRecords: HealthRecord[] = [
          {
            id: "1",
            type: "injury",
            description: "Minor cut on hand while handling equipment",
            severity: "low",
            status: "resolved",
            reportedAt: new Date(Date.now() - 86400000).toISOString(),
            resolvedAt: new Date(Date.now() - 72000000).toISOString(),
            resolution: "First aid provided, wound dressed",
            actionTaken: "Cleaned and bandaged wound",
            guardId: "1",
            healthReports: [
              {
                id: "1",
                reportType: "initial",
                content: "Initial injury report filed",
                reportedBy: "Rajesh Kumar",
                createdAt: new Date(Date.now() - 86400000).toISOString()
              }
            ]
          }
        ];

        const mockSafetyChecks: SafetyCheck[] = [
          {
            id: "1",
            type: "pre_shift",
            status: "passed",
            score: 95,
            checkedAt: new Date().toISOString(),
            guardId: "1",
            postId: "1",
          }
        ];

        const mockWellnessChecks: WellnessCheck[] = [
          {
            id: "1",
            mood: "good",
            energy: "medium",
            stress: "low",
            sleep: "good",
            notes: "Feeling well and ready for duty",
            createdAt: new Date().toISOString(),
            guardId: "1",
          }
        ];

        setHealthRecords(mockHealthRecords);
        setSafetyChecks(mockSafetyChecks);
        setWellnessChecks(mockWellnessChecks);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const filteredHealthRecords = healthRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesType = typeFilter === "all" || record.type === typeFilter;
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

  const getSafetyStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "requires_attention": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "excellent": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "good": return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "fair": return <Minus className="w-4 h-4 text-yellow-500" />;
      case "poor": return <TrendingDown className="w-4 h-4 text-orange-500" />;
      case "critical": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateHealthRecord = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      // Get first guard for demo purposes
      const guards = await tenantDb.guard();
      const guard = guards[0];
      if (!guard) return;

      const healthRecord = await tenantDb.createHealthRecord({
        data: {
          type: newHealthRecord.type,
          description: newHealthRecord.description,
          severity: newHealthRecord.severity,
          vitals: newHealthRecord.vitals,
          symptoms: newHealthRecord.symptoms,
          treatment: newHealthRecord.treatment,
          followUpRequired: newHealthRecord.followUpRequired,
          followUpDate: newHealthRecord.followUpDate,
          userId: session.user.id,
          guardId: guard.id
        },
        include: {
          guard: true,
          healthReports: true
        }
      });

      // Add to local state
      setHealthRecords(prev => [{
        id: healthRecord.id,
        type: healthRecord.type,
        description: healthRecord.description,
        severity: healthRecord.severity,
        status: healthRecord.status,
        reportedAt: healthRecord.reportedAt.toISOString(),
        guardId: healthRecord.guardId,
        healthReports: []
      }, ...prev]);

      // Reset form and close dialog
      setNewHealthRecord({
        type: "",
        description: "",
        severity: "medium",
        vitals: "",
        symptoms: "",
        treatment: "",
        followUpRequired: false,
        followUpDate: ""
      });
      setIsHealthDialogOpen(false);
    } catch (error) {
      console.error("Error creating health record:", error);
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
          <h1 className="text-3xl font-bold">Health & Safety Monitoring</h1>
          <p className="text-muted-foreground">Track guard health, safety checks, and wellness</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isHealthDialogOpen} onOpenChange={setIsHealthDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Heart className="w-4 h-4 mr-2" />
                Report Health Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report Health Issue</DialogTitle>
                <DialogDescription>
                  Report a health concern or injury
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Issue Type</Label>
                    <Select value={newHealthRecord.type} onValueChange={(value) => setNewHealthRecord(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vital_signs">Vital Signs</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="illness">Illness</SelectItem>
                        <SelectItem value="fatigue">Fatigue</SelectItem>
                        <SelectItem value="stress">Stress</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={newHealthRecord.severity} onValueChange={(value) => setNewHealthRecord(prev => ({ ...prev, severity: value }))}>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newHealthRecord.description}
                    onChange={(e) => setNewHealthRecord(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the health issue"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vitals">Vital Signs (JSON)</Label>
                    <Input
                      id="vitals"
                      value={newHealthRecord.vitals}
                      onChange={(e) => setNewHealthRecord(prev => ({ ...prev, vitals: e.target.value }))}
                      placeholder='{"bp": "120/80", "hr": 72}'
                    />
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Symptoms (JSON array)</Label>
                    <Input
                      id="symptoms"
                      value={newHealthRecord.symptoms}
                      onChange={(e) => setNewHealthRecord(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder='["headache", "nausea"]'
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsHealthDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateHealthRecord}>
                    Create Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthRecords.length}</div>
            <p className="text-xs text-muted-foreground">
              {healthRecords.filter(r => r.status === "resolved").length} resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetyChecks.length}</div>
            <p className="text-xs text-muted-foreground">
              {safetyChecks.filter(s => s.status === "passed").length} passed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Checks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wellnessChecks.length}</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthRecords.filter(r => r.severity === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="safety">Safety Checks</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search health records..."
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
                <SelectItem value="injury">Injury</SelectItem>
                <SelectItem value="illness">Illness</SelectItem>
                <SelectItem value="fatigue">Fatigue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredHealthRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Heart className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{record.type.replace('_', ' ')}</h3>
                          <Badge variant="secondary" className={`${getSeverityColor(record.severity)} text-white`}>
                            {record.severity}
                          </Badge>
                          <Badge variant="outline" className={`${getStatusColor(record.status)} text-white`}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{record.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Guard ID: {record.guardId}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(record.reportedAt).toLocaleString()}</span>
                          </div>
                        </div>
                        {record.resolution && (
                          <Alert className="mt-2">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Resolution:</strong> {record.resolution}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="grid gap-4">
            {safetyChecks.map((check) => (
              <Card key={check.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Shield className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{check.type.replace('_', ' ')}</h3>
                          <Badge variant="secondary" className={`${getSafetyStatusColor(check.status)} text-white`}>
                            {check.status}
                          </Badge>
                          {check.score && (
                            <Badge variant="outline">
                              Score: {check.score}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Guard ID: {check.guardId}</span>
                          </div>
                          {check.postId && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Post ID: {check.postId}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(check.checkedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <div className="grid gap-4">
            {wellnessChecks.map((check) => (
              <Card key={check.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="" alt={`Guard ${check.guardId}`} />
                        <AvatarFallback>G{check.guardId}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Mood:</span>
                            {getMoodIcon(check.mood)}
                            <span className="text-sm capitalize">{check.mood}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Energy:</span>
                            <span className="text-sm capitalize">{check.energy}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Stress:</span>
                            <span className="text-sm capitalize">{check.stress}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Sleep:</span>
                            <span className="text-sm capitalize">{check.sleep}</span>
                          </div>
                        </div>
                        {check.notes && (
                          <p className="text-sm text-gray-600">{check.notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(check.createdAt).toLocaleString()}
                        </p>
                      </div>
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