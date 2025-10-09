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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Award,
  Target,
  Activity,
  BarChart3,
  Calendar,
  FileText,
  Camera,
  Mic,
  Video,
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
  Navigation,
  Shield,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Heart,
  Brain,
  BookOpen,
  Clipboard,
  AlertCircle,
  CheckCircle2,
  Circle
} from "lucide-react";
import { createTenantContext } from "@/lib/db";
import { db } from "@/lib/db";

interface Guard {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  photo?: string | null;
  status: string;
  joinDate: string;
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
    overall: number;
    attendance: number;
    punctuality: number;
    compliance: number;
    incidentHandling: number;
    communication: number;
    technicalSkills: number;
    teamwork: number;
  };
  metrics: {
    totalShifts: number;
    completedShifts: number;
    incidentsReported: number;
    incidentsResolved: number;
    attendanceRate: number;
    punctualityRate: number;
    averageResponseTime: number;
    customerSatisfaction: number;
  };
  deviceInfo: {
    status: string;
    batteryLevel: number;
    lastUpdate: string;
    appVersion: string;
  };
  certifications: Certification[];
  warnings: Warning[];
  achievements: Achievement[];
}

interface Certification {
  id: string;
  name: string;
  issuedDate: string;
  expiryDate?: string;
  status: string;
  issuingAuthority: string;
}

interface Warning {
  id: string;
  type: string;
  description: string;
  severity: string;
  issuedDate: string;
  status: string;
  issuedBy: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  points: number;
}

interface PerformanceReview {
  id: string;
  guardId: string;
  reviewer: string;
  reviewDate: string;
  period: string;
  overallRating: number;
  categories: {
    attendance: number;
    punctuality: number;
    compliance: number;
    incidentHandling: number;
    communication: number;
    technicalSkills: number;
    teamwork: number;
  };
  strengths: string[];
  improvements: string[];
  goals: string[];
  notes: string;
  status: string;
}

interface TrainingRecord {
  id: string;
  guardId: string;
  trainingName: string;
  type: string;
  completionDate: string;
  score?: number;
  status: string;
  certificateUrl?: string;
  trainer: string;
}

export default function GuardSupervision() {
  const { data: session, status } = useSession();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newReview, setNewReview] = useState({
    period: "",
    overallRating: 5,
    categories: {
      attendance: 5,
      punctuality: 5,
      compliance: 5,
      incidentHandling: 5,
      communication: 5,
      technicalSkills: 5,
      teamwork: 5
    },
    strengths: [] as string[],
    improvements: [] as string[],
    goals: [] as string[],
    notes: ""
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch guards with related data
        const guardsData = await tenantDb.guard();

        // Fetch additional data for guards
        const guardsWithDetails = await Promise.all(
          guardsData.map(async (guard) => {
            const [currentShift, locations, attendances, incidents] = await Promise.all([
              db.shift.findFirst({
                where: { 
                  guardId: guard.id,
                  startTime: { lte: new Date() },
                  endTime: { gte: new Date() }
                },
                include: {
                  post: true
                }
              }),
              db.location.findMany({
                where: { guardId: guard.id },
                orderBy: { timestamp: 'desc' },
                take: 1
              }),
              db.attendance.findMany({
                where: { guardId: guard.id },
                orderBy: { createdAt: 'desc' },
                take: 30
              }),
              db.incident.findMany({
                where: { guardId: guard.id },
                orderBy: { createdAt: 'desc' },
                take: 20
              })
            ]);

            return {
              ...guard,
              currentShift,
              locations,
              attendances,
              incidents
            };
          })
        );

        const formattedGuards = guardsWithDetails.map(guard => {
          const attendanceRate = calculateAttendanceRate(guard.attendances);
          const punctualityRate = calculatePunctualityRate(guard.attendances);
          const incidentResolutionRate = calculateIncidentResolutionRate(guard.incidents);
          
          return {
            id: guard.id,
            name: guard.name,
            phone: guard.phone,
            email: guard.email,
            photo: guard.photo,
            status: guard.status,
            joinDate: guard.createdAt.toISOString(),
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
              overall: calculateOverallPerformance(attendanceRate, punctualityRate, incidentResolutionRate),
              attendance: attendanceRate,
              punctuality: punctualityRate,
              compliance: Math.floor(Math.random() * 20) + 80, // Mock data
              incidentHandling: incidentResolutionRate,
              communication: Math.floor(Math.random() * 15) + 85, // Mock data
              technicalSkills: Math.floor(Math.random() * 25) + 75, // Mock data
              teamwork: Math.floor(Math.random() * 20) + 80 // Mock data
            },
            metrics: {
              totalShifts: guard.attendances.length,
              completedShifts: guard.attendances.filter(a => a.status === 'present').length,
              incidentsReported: guard.incidents.length,
              incidentsResolved: guard.incidents.filter(i => i.status === 'resolved').length,
              attendanceRate: attendanceRate,
              punctualityRate: punctualityRate,
              averageResponseTime: Math.floor(Math.random() * 10) + 5, // Mock data in minutes
              customerSatisfaction: Math.floor(Math.random() * 20) + 80 // Mock data
            },
            deviceInfo: {
              status: Math.random() > 0.1 ? 'online' : 'offline',
              batteryLevel: Math.floor(Math.random() * 100),
              lastUpdate: new Date().toISOString(),
              appVersion: '2.1.0'
            },
            certifications: [], // Simplified for now
            warnings: generateMockWarnings(guard.id),
            achievements: generateMockAchievements(guard.id)
          };
        });

        // Mock performance reviews
        const mockReviews: PerformanceReview[] = [
          {
            id: "1",
            guardId: formattedGuards[0]?.id || "1",
            reviewer: "Field Officer",
            reviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            period: "2024-01",
            overallRating: 85,
            categories: {
              attendance: 90,
              punctuality: 85,
              compliance: 88,
              incidentHandling: 82,
              communication: 87,
              technicalSkills: 84,
              teamwork: 89
            },
            strengths: ["Excellent attendance record", "Good communication skills", "Team player"],
            improvements: ["Improve technical skills", "Better incident documentation"],
            goals: ["Complete advanced training", "Achieve 90%+ punctuality"],
            notes: "Overall good performance with room for improvement in technical areas.",
            status: "completed"
          }
        ];

        // Mock training records
        const mockTrainings: TrainingRecord[] = [
          {
            id: "1",
            guardId: formattedGuards[0]?.id || "1",
            trainingName: "Basic Security Training",
            type: "mandatory",
            completionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            score: 92,
            status: "completed",
            trainer: "Security Trainer",
            certificateUrl: "/certificates/basic_training.pdf"
          },
          {
            id: "2",
            guardId: formattedGuards[0]?.id || "1",
            trainingName: "Emergency Response",
            type: "mandatory",
            completionDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            score: 88,
            status: "completed",
            trainer: "Emergency Coordinator",
            certificateUrl: "/certificates/emergency_response.pdf"
          }
        ];

        setGuards(formattedGuards);
        setReviews(mockReviews);
        setTrainings(mockTrainings);
      } catch (error) {
        console.error("Error fetching guard supervision data:", error);
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
      return diffMinutes <= 15;
    }).length;
    return Math.round((onTimeCount / attendances.length) * 100);
  };

  const calculateIncidentResolutionRate = (incidents: any[]) => {
    if (incidents.length === 0) return 100;
    const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
    return Math.round((resolvedCount / incidents.length) * 100);
  };

  const calculateOverallPerformance = (attendance: number, punctuality: number, incidentResolution: number) => {
    return Math.round((attendance + punctuality + incidentResolution) / 3);
  };

  const generateMockWarnings = (guardId: string): Warning[] => {
    const warnings: Warning[] = [];
    if (Math.random() > 0.7) {
      warnings.push({
        id: `${guardId}-1`,
        type: "attendance",
        description: "Late arrival to shift",
        severity: "low",
        issuedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        issuedBy: "Field Officer"
      });
    }
    return warnings;
  };

  const generateMockAchievements = (guardId: string): Achievement[] => {
    const achievements: Achievement[] = [];
    if (Math.random() > 0.5) {
      achievements.push({
        id: `${guardId}-1`,
        title: "Perfect Attendance",
        description: "30 days perfect attendance record",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: "attendance",
        points: 100
      });
    }
    return achievements;
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

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return <Star className="w-4 h-4 text-green-500" />;
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    if (score >= 70) return <AlertCircle className="w-4 h-4 text-orange-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull className="w-4 h-4 text-green-500" />;
    if (level > 20) return <Battery className="w-4 h-4 text-yellow-500" />;
    return <BatteryLow className="w-4 h-4 text-red-500" />;
  };

  const filteredGuards = guards.filter(guard => {
    const matchesSearch = guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.phone.includes(searchTerm) ||
                         (guard.email && guard.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || guard.status === statusFilter;
    const matchesPerformance = performanceFilter === "all" || 
      (performanceFilter === "excellent" && guard.performance.overall >= 90) ||
      (performanceFilter === "good" && guard.performance.overall >= 80 && guard.performance.overall < 90) ||
      (performanceFilter === "average" && guard.performance.overall >= 70 && guard.performance.overall < 80) ||
      (performanceFilter === "poor" && guard.performance.overall < 70);
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  const handleCreateReview = async () => {
    if (!selectedGuard || !session) return;

    try {
      const review = {
        id: `review-${Date.now()}`,
        ...newReview,
        guardId: selectedGuard.id,
        reviewer: session.user.name || "Field Officer",
        reviewDate: new Date().toISOString(),
        status: "completed"
      };

      // Add to local state
      setReviews(prev => [review, ...prev]);

      // Reset form and close dialog
      setNewReview({
        period: "",
        overallRating: 5,
        categories: {
          attendance: 5,
          punctuality: 5,
          compliance: 5,
          incidentHandling: 5,
          communication: 5,
          technicalSkills: 5,
          teamwork: 5
        },
        strengths: [],
        improvements: [],
        goals: [],
        notes: ""
      });
      setIsReviewDialogOpen(false);
      setSelectedGuard(null);
    } catch (error) {
      console.error("Error creating review:", error);
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
          <h1 className="text-3xl font-bold">Guard Supervision & Performance</h1>
          <p className="text-muted-foreground">Monitor guard performance and manage evaluations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {guards.length} Total Guards
          </Badge>
          <Badge variant="outline" className="text-sm">
            {guards.filter(g => g.performance.overall >= 90).length} Excellent
          </Badge>
          <Badge variant="outline" className="text-sm">
            {guards.filter(g => g.deviceInfo.status === 'online').length} Online
          </Badge>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.overall, 0) / guards.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Team average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.performance.attendance, 0) / guards.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Team average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guards.reduce((sum, g) => sum + (g.metrics.incidentsReported - g.metrics.incidentsResolved), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((trainings.filter(t => t.status === 'completed').length / Math.max(1, trainings.length)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guards">Guard List</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="training">Training & Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Guards with excellent performance ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guards
                    .filter(g => g.performance.overall >= 90)
                    .sort((a, b) => b.performance.overall - a.performance.overall)
                    .slice(0, 5)
                    .map((guard) => (
                      <div key={guard.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={guard.photo || undefined} alt={guard.name} />
                            <AvatarFallback>{guard.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{guard.name}</p>
                            <p className="text-xs text-muted-foreground">{guard.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className={`text-sm font-medium ${getPerformanceColor(guard.performance.overall)}`}>
                              {guard.performance.overall}%
                            </p>
                            <p className="text-xs text-muted-foreground">Overall</p>
                          </div>
                          {getPerformanceIcon(guard.performance.overall)}
                        </div>
                      </div>
                    ))}
                  {guards.filter(g => g.performance.overall >= 90).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No top performers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guards Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle>Guards Needing Attention</CardTitle>
                <CardDescription>Guards requiring intervention or support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guards
                    .filter(g => g.performance.overall < 80 || g.warnings.length > 0)
                    .sort((a, b) => a.performance.overall - b.performance.overall)
                    .slice(0, 5)
                    .map((guard) => (
                      <div key={guard.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={guard.photo || undefined} alt={guard.name} />
                            <AvatarFallback>{guard.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{guard.name}</p>
                            <p className="text-xs text-muted-foreground">{guard.phone}</p>
                            {guard.warnings.length > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {guard.warnings.length} warning(s)
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className={`text-sm font-medium ${getPerformanceColor(guard.performance.overall)}`}>
                              {guard.performance.overall}%
                            </p>
                            <p className="text-xs text-muted-foreground">Overall</p>
                          </div>
                          {getPerformanceIcon(guard.performance.overall)}
                        </div>
                      </div>
                    ))}
                  {guards.filter(g => g.performance.overall < 80 || g.warnings.length > 0).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">All guards performing well</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Breakdown of guard performance levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Excellent (90%+)</span>
                      <span>{guards.filter(g => g.performance.overall >= 90).length} guards</span>
                    </div>
                    <Progress 
                      value={(guards.filter(g => g.performance.overall >= 90).length / Math.max(1, guards.length)) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Good (80-89%)</span>
                      <span>{guards.filter(g => g.performance.overall >= 80 && g.performance.overall < 90).length} guards</span>
                    </div>
                    <Progress 
                      value={(guards.filter(g => g.performance.overall >= 80 && g.performance.overall < 90).length / Math.max(1, guards.length)) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average (70-79%)</span>
                      <span>{guards.filter(g => g.performance.overall >= 70 && g.performance.overall < 80).length} guards</span>
                    </div>
                    <Progress 
                      value={(guards.filter(g => g.performance.overall >= 70 && g.performance.overall < 80).length / Math.max(1, guards.length)) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Poor (&lt;70%)</span>
                      <span>{guards.filter(g => g.performance.overall < 70).length} guards</span>
                    </div>
                    <Progress 
                      value={(guards.filter(g => g.performance.overall < 70).length / Math.max(1, guards.length)) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Latest guard accomplishments and recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guards
                    .flatMap(g => g.achievements)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((achievement) => (
                      <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.points} pts
                        </Badge>
                      </div>
                    ))}
                  {guards.flatMap(g => g.achievements).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No achievements yet</p>
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
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
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
                          <Badge variant="outline" className={`${getStatusColor(guard.deviceInfo.status)} text-white`}>
                            {guard.deviceInfo.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {getBatteryIcon(guard.deviceInfo.batteryLevel)}
                          <span className="text-sm">{guard.deviceInfo.batteryLevel}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getPerformanceColor(guard.performance.overall)}`}>
                          {guard.performance.overall}%
                        </p>
                        <p className="text-xs text-muted-foreground">Overall</p>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedGuard(guard);
                            setIsReviewDialogOpen(true);
                          }}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
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
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Incident Handling</span>
                        <span>{guard.performance.incidentHandling}%</span>
                      </div>
                      <Progress value={guard.performance.incidentHandling} className="h-2" />
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium">{guard.metrics.totalShifts}</p>
                      <p className="text-xs text-muted-foreground">Total Shifts</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{guard.metrics.incidentsReported}</p>
                      <p className="text-xs text-muted-foreground">Incidents</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{guard.metrics.averageResponseTime}m</p>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{guard.achievements.length}</p>
                      <p className="text-xs text-muted-foreground">Achievements</p>
                    </div>
                  </div>

                  {/* Warnings and Certifications */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {guard.warnings.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">
                            {guard.warnings.length} active warning(s)
                          </span>
                        </div>
                      )}
                      {guard.certifications.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600">
                            {guard.certifications.length} certification(s)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {guard.achievements.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">
                            {guard.achievements.length} achievement(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6">
            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Categories */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Performance Categories</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['attendance', 'punctuality', 'compliance', 'incidentHandling'].map((category) => {
                        const avgScore = guards.length > 0 
                          ? Math.round(guards.reduce((sum, g) => sum + g.performance[category as keyof typeof g.performance], 0) / guards.length)
                          : 0;
                        return (
                          <div key={category} className="text-center p-4 border rounded-lg">
                            <p className="text-sm font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className={`text-2xl font-bold ${getPerformanceColor(avgScore)}`}>
                              {avgScore}%
                            </p>
                            <Progress value={avgScore} className="h-2 mt-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm font-medium">Total Shifts</p>
                        <p className="text-2xl font-bold">
                          {guards.reduce((sum, g) => sum + g.metrics.totalShifts, 0)}
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm font-medium">Completed Shifts</p>
                        <p className="text-2xl font-bold">
                          {guards.reduce((sum, g) => sum + g.metrics.completedShifts, 0)}
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm font-medium">Incidents Resolved</p>
                        <p className="text-2xl font-bold">
                          {guards.reduce((sum, g) => sum + g.metrics.incidentsResolved, 0)}
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm font-medium">Avg Response Time</p>
                        <p className="text-2xl font-bold">
                          {guards.length > 0 ? Math.round(guards.reduce((sum, g) => sum + g.metrics.averageResponseTime, 0) / guards.length) : 0}m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Performance Reviews</h3>
              <p className="text-sm text-muted-foreground">Guard performance evaluations and feedback</p>
            </div>
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Star className="w-4 h-4 mr-2" />
                  New Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Performance Review</DialogTitle>
                  <DialogDescription>
                    Evaluate guard performance and provide feedback
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guard">Guard</Label>
                    <Select 
                      value={selectedGuard?.id || ""} 
                      onValueChange={(value) => {
                        const guard = guards.find(g => g.id === value);
                        setSelectedGuard(guard || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a guard" />
                      </SelectTrigger>
                      <SelectContent>
                        {guards.map((guard) => (
                          <SelectItem key={guard.id} value={guard.id}>
                            {guard.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="period">Review Period</Label>
                    <Select value={newReview.period} onValueChange={(value) => setNewReview(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-01">January 2024</SelectItem>
                        <SelectItem value="2024-02">February 2024</SelectItem>
                        <SelectItem value="2024-03">March 2024</SelectItem>
                        <SelectItem value="2024-04">April 2024</SelectItem>
                        <SelectItem value="q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="q2-2024">Q2 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="overallRating">Overall Rating</Label>
                    <Select value={newReview.overallRating.toString()} onValueChange={(value) => setNewReview(prev => ({ ...prev, overallRating: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Poor</SelectItem>
                        <SelectItem value="2">2 - Below Average</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category Ratings</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(newReview.categories).map(([category, rating]) => (
                        <div key={category}>
                          <Label htmlFor={category} className="text-sm capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Select 
                            value={rating.toString()} 
                            onValueChange={(value) => setNewReview(prev => ({ 
                              ...prev, 
                              categories: { 
                                ...prev.categories, 
                                [category]: parseInt(value) 
                              } 
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={newReview.notes}
                      onChange={(e) => setNewReview(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Provide detailed feedback and observations..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateReview}>
                      Create Review
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Performance Review - {review.period}</h3>
                      <p className="text-sm text-muted-foreground">
                        Reviewed by: {review.reviewer} • {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{review.status}</Badge>
                        <Badge variant="outline" className={getPerformanceColor(review.overallRating)}>
                          {review.overallRating}/5
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {review.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{review.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {reviews.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No performance reviews yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4">
            {trainings.map((training) => (
              <Card key={training.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{training.trainingName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Trainer: {training.trainer} • Completed: {new Date(training.completionDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{training.type}</Badge>
                        <Badge variant="outline">{training.status}</Badge>
                        {training.score && (
                          <Badge variant="outline">Score: {training.score}%</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {training.certificateUrl && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {trainings.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No training records found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}