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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Video,
  Monitor,
  Smartphone,
  Headphones,
  Star,
  Flag,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Heart,
  Zap,
  MapPin,
  Radio,
  Car,
  Building,
  UserCheck,
  Clipboard,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  MoreHorizontal,
  Eye,
  CheckSquare,
  Square
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  category: TrainingCategory;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'archived';
  isMandatory: boolean;
  validityPeriod?: number; // in days
  prerequisites?: string[];
  modules: TrainingModule[];
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'practical' | 'interactive';
  duration: number;
  order: number;
  content?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  isRequired: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface UserTraining {
  id: string;
  userId: string;
  courseId: string;
  status: TrainingStatus;
  progress: number; // 0-100
  currentModuleId?: string;
  completedModules: string[];
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  certificateId?: string;
  lastAccessedAt: string;
}

interface TrainingCertificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  expiresAt?: string;
  downloadUrl: string;
  verificationUrl: string;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  frequency: 'one_time' | 'annual' | 'quarterly' | 'monthly';
  dueDate?: string;
  isMandatory: boolean;
  targetUsers: string[]; // user roles or specific user IDs
  completedBy: string[];
  status: 'pending' | 'completed' | 'overdue';
}

type TrainingType = 'safety' | 'emergency_response' | 'first_aid' | 'communication' | 'technical' | 'compliance' | 'leadership';
type TrainingCategory = 'mandatory' | 'optional' | 'certification' | 'refresher';
type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
type ComplianceCategory = 'legal' | 'safety' | 'operational' | 'quality' | 'environmental';

export default function TrainingComplianceSystem() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [userTrainings, setUserTrainings] = useState<UserTraining[]>([]);
  const [certificates, setCertificates] = useState<TrainingCertificate[]>([]);
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        // Mock training courses
        const mockCourses: TrainingCourse[] = [
          {
            id: "1",
            title: "Emergency Response Protocol",
            description: "Comprehensive training on emergency response procedures and protocols",
            type: "emergency_response",
            category: "mandatory",
            duration: 120,
            difficulty: "intermediate",
            status: "active",
            isMandatory: true,
            validityPeriod: 365,
            prerequisites: [],
            modules: [
              {
                id: "1-1",
                title: "Introduction to Emergency Response",
                description: "Overview of emergency response fundamentals",
                type: "video",
                duration: 15,
                order: 1,
                videoUrl: "/api/placeholder/video",
                isRequired: true
              },
              {
                id: "1-2",
                title: "Emergency Types and Procedures",
                description: "Different types of emergencies and response procedures",
                type: "text",
                duration: 20,
                order: 2,
                isRequired: true
              },
              {
                id: "1-3",
                title: "Emergency Response Quiz",
                description: "Test your knowledge of emergency response",
                type: "quiz",
                duration: 10,
                order: 3,
                isRequired: true,
                quizQuestions: [
                  {
                    id: "q1",
                    question: "What is the first step in any emergency response?",
                    type: "multiple_choice",
                    options: ["Assess the situation", "Call for help", "Evacuate", "Provide first aid"],
                    correctAnswer: "Assess the situation",
                    points: 10
                  }
                ]
              }
            ],
            totalEnrollments: 45,
            completionRate: 78,
            averageRating: 4.5,
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          {
            id: "2",
            title: "First Aid and CPR Certification",
            description: "Official first aid and CPR certification course",
            type: "first_aid",
            category: "certification",
            duration: 240,
            difficulty: "intermediate",
            status: "active",
            isMandatory: true,
            validityPeriod: 730,
            prerequisites: [],
            modules: [
              {
                id: "2-1",
                title: "Basic First Aid Principles",
                description: "Fundamental first aid concepts and techniques",
                type: "video",
                duration: 45,
                order: 1,
                videoUrl: "/api/placeholder/video",
                isRequired: true
              },
              {
                id: "2-2",
                title: "CPR Techniques",
                description: "Cardiopulmonary resuscitation techniques",
                type: "practical",
                duration: 60,
                order: 2,
                isRequired: true
              }
            ],
            totalEnrollments: 32,
            completionRate: 85,
            averageRating: 4.8,
            createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
          },
          {
            id: "3",
            title: "Advanced Communication Skills",
            description: "Enhance communication skills for field operations",
            type: "communication",
            category: "optional",
            duration: 90,
            difficulty: "beginner",
            status: "active",
            isMandatory: false,
            modules: [
              {
                id: "3-1",
                title: "Effective Communication",
                description: "Learn effective communication techniques",
                type: "interactive",
                duration: 45,
                order: 1,
                isRequired: true
              }
            ],
            totalEnrollments: 18,
            completionRate: 92,
            averageRating: 4.2,
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ];

        // Mock user trainings
        const mockUserTrainings: UserTraining[] = [
          {
            id: "1",
            userId: "1",
            courseId: "1",
            status: "in_progress",
            progress: 65,
            currentModuleId: "1-2",
            completedModules: ["1-1"],
            startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            lastAccessedAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: "2",
            userId: "1",
            courseId: "2",
            status: "completed",
            progress: 100,
            completedModules: ["2-1", "2-2"],
            startedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            completedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            score: 92,
            certificateId: "cert-2",
            expiresAt: new Date(Date.now() + 86400000 * 700).toISOString(),
            lastAccessedAt: new Date(Date.now() - 86400000 * 15).toISOString()
          }
        ];

        // Mock certificates
        const mockCertificates: TrainingCertificate[] = [
          {
            id: "cert-2",
            userId: "1",
            courseId: "2",
            certificateNumber: "FA-2024-001",
            issuedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            expiresAt: new Date(Date.now() + 86400000 * 700).toISOString(),
            downloadUrl: "/api/placeholder/certificate.pdf",
            verificationUrl: "/verify/FA-2024-001"
          }
        ];

        // Mock compliance requirements
        const mockComplianceRequirements: ComplianceRequirement[] = [
          {
            id: "1",
            title: "Annual Safety Training",
            description: "Mandatory annual safety training for all field officers",
            category: "safety",
            frequency: "annual",
            dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
            isMandatory: true,
            targetUsers: ["field_officer", "guard"],
            completedBy: ["1"],
            status: "completed"
          },
          {
            id: "2",
            title: "Emergency Drill Participation",
            description: "Quarterly emergency drill participation",
            category: "operational",
            frequency: "quarterly",
            dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
            isMandatory: true,
            targetUsers: ["field_officer", "guard", "supervisor"],
            completedBy: [],
            status: "pending"
          },
          {
            id: "3",
            title: "Legal Compliance Update",
            description: "Monthly legal compliance updates",
            category: "legal",
            frequency: "monthly",
            dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            isMandatory: true,
            targetUsers: ["field_officer", "supervisor"],
            completedBy: [],
            status: "overdue"
          }
        ];

        setCourses(mockCourses);
        setUserTrainings(mockUserTrainings);
        setCertificates(mockCertificates);
        setComplianceRequirements(mockComplianceRequirements);
      } catch (error) {
        console.error("Error fetching training data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || course.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getUserTrainingStatus = (courseId: string) => {
    const userTraining = userTrainings.find(ut => ut.courseId === courseId);
    return userTraining || null;
  };

  const getTypeIcon = (type: TrainingType) => {
    switch (type) {
      case "safety": return <Shield className="w-4 h-4" />;
      case "emergency_response": return <AlertTriangle className="w-4 h-4" />;
      case "first_aid": return <Heart className="w-4 h-4" />;
      case "communication": return <MessageSquare className="w-4 h-4" />;
      case "technical": return <Settings className="w-4 h-4" />;
      case "compliance": return <Clipboard className="w-4 h-4" />;
      case "leadership": return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case "not_started": return "bg-gray-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "expired": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "overdue": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const handleEnrollCourse = (courseId: string) => {
    const userTraining: UserTraining = {
      id: Date.now().toString(),
      userId: session?.user?.id || "1",
      courseId,
      status: "not_started",
      progress: 0,
      completedModules: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    setUserTrainings(prev => [...prev, userTraining]);
    setIsEnrollDialogOpen(false);
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
          <h1 className="text-3xl font-bold">Training & Compliance</h1>
          <p className="text-muted-foreground">Manage training programs and compliance requirements</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Training Course</DialogTitle>
                <DialogDescription>
                  Set up a new training course with modules and content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input id="course-title" placeholder="Enter course title" />
                </div>
                <div>
                  <Label htmlFor="course-description">Description</Label>
                  <Textarea id="course-description" placeholder="Course description" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Training Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="emergency_response">Emergency Response</SelectItem>
                        <SelectItem value="first_aid">First Aid</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mandatory">Mandatory</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="certification">Certification</SelectItem>
                        <SelectItem value="refresher">Refresher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCourseDialogOpen(false)}>
                    Create Course
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.isMandatory).length} mandatory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTrainings.filter(ut => ut.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">currently training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userTrainings.filter(ut => ut.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">courses finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((userTrainings.filter(ut => ut.status === 'completed').length / userTrainings.length) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">overall compliance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="my-training">My Training</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Courses</CardTitle>
              <CardDescription>Available training courses and programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
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
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="emergency_response">Emergency Response</SelectItem>
                    <SelectItem value="first_aid">First Aid</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => {
                  const userTraining = getUserTrainingStatus(course.id);
                  return (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${
                              course.category === 'mandatory' ? 'bg-red-100 text-red-600' :
                              course.category === 'certification' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getTypeIcon(course.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {course.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                                  {course.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {course.isMandatory && (
                            <Badge variant="destructive" className="text-xs">
                              Mandatory
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.totalEnrollments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{course.averageRating}</span>
                          </div>
                        </div>

                        {userTraining ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-gray-500">{userTraining.progress}%</span>
                            </div>
                            <Progress value={userTraining.progress} className="h-2" />
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-white ${getStatusColor(userTraining.status)}`}>
                                {userTraining.status.replace('_', ' ')}
                              </Badge>
                              {userTraining.status === 'in_progress' && (
                                <Button variant="outline" size="sm">
                                  Continue
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full" onClick={() => setSelectedCourse(course)}>
                                Enroll Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Enroll in Course</DialogTitle>
                                <DialogDescription>
                                  You are about to enroll in "{course.title}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <div className="font-medium">{course.duration} minutes</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Difficulty:</span>
                                    <div className="font-medium capitalize">{course.difficulty}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Category:</span>
                                    <div className="font-medium capitalize">{course.category}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Modules:</span>
                                    <div className="font-medium">{course.modules.length}</div>
                                  </div>
                                </div>
                                {course.validityPeriod && (
                                  <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                      This certification is valid for {course.validityPeriod} days
                                    </AlertDescription>
                                  </Alert>
                                )}
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleEnrollCourse(course.id)}>
                                    Enroll Now
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Training Progress</CardTitle>
              <CardDescription>Your current training enrollments and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTrainings.map(userTraining => {
                  const course = courses.find(c => c.id === userTraining.courseId);
                  if (!course) return null;

                  return (
                    <Card key={userTraining.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                course.category === 'mandatory' ? 'bg-red-100 text-red-600' :
                                course.category === 'certification' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {getTypeIcon(course.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{course.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>Started: {new Date(userTraining.startedAt).toLocaleDateString()}</span>
                                  {userTraining.completedAt && (
                                    <>
                                      <span>•</span>
                                      <span>Completed: {new Date(userTraining.completedAt).toLocaleDateString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge variant="outline" className={`text-white ${getStatusColor(userTraining.status)}`}>
                              {userTraining.status.replace('_', ' ')}
                            </Badge>
                            {userTraining.score && (
                              <div className="text-sm">
                                Score: <span className="font-medium">{userTraining.score}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-500">{userTraining.progress}%</span>
                          </div>
                          <Progress value={userTraining.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {userTraining.completedModules.length} of {course.modules.length} modules completed
                            </span>
                            <div className="flex gap-2">
                              {userTraining.status === 'in_progress' && (
                                <Button variant="outline" size="sm">
                                  Continue
                                </Button>
                              )}
                              {userTraining.status === 'completed' && userTraining.certificateId && (
                                <Button variant="outline" size="sm">
                                  <Download className="w-3 h-3 mr-1" />
                                  Certificate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>Track and manage compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceRequirements.map(requirement => (
                  <Card key={requirement.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              requirement.category === 'safety' ? 'bg-red-100 text-red-600' :
                              requirement.category === 'legal' ? 'bg-blue-100 text-blue-600' :
                              requirement.category === 'operational' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <Clipboard className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{requirement.title}</h3>
                              <p className="text-sm text-gray-600">{requirement.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="capitalize">{requirement.frequency}</span>
                            {requirement.dueDate && (
                              <>
                                <span>•</span>
                                <span>Due: {new Date(requirement.dueDate).toLocaleDateString()}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className={getComplianceStatusColor(requirement.status)}>
                              {requirement.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {requirement.isMandatory && (
                            <Badge variant="destructive" className="text-xs mb-2">
                              Mandatory
                            </Badge>
                          )}
                          <div className="text-sm text-gray-500 mb-2">
                            {requirement.completedBy.length} completed
                          </div>
                          {requirement.status !== 'completed' && (
                            <Button variant="outline" size="sm">
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Certificates</CardTitle>
              <CardDescription>Your earned training certificates and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map(certificate => {
                  const course = courses.find(c => c.id === certificate.courseId);
                  if (!course) return null;

                  return (
                    <Card key={certificate.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              <CardDescription>Certificate</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Certificate #:</span>
                            <span className="font-medium">{certificate.certificateNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issued:</span>
                            <span>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
                          </div>
                          {certificate.expiresAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expires:</span>
                              <span>{new Date(certificate.expiresAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}