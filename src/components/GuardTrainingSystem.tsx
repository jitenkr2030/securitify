"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  Calendar,
  FileText,
  Video,
  HelpCircle,
  Award,
  TrendingUp,
  Users,
  Target,
  Plus,
  Edit,
  Eye,
  Download,
  Upload
} from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'practical';
  duration: number; // in minutes
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isMandatory: boolean;
  expiryDays?: number; // days after completion when certification expires
  contentUrl?: string;
  prerequisites?: string[];
}

interface TrainingRecord {
  id: string;
  guardId: string;
  moduleId: string;
  moduleName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
  progress: number; // 0-100
  score?: number;
  completedAt?: string;
  expiresAt?: string;
  certificateUrl?: string;
  notes?: string;
}

interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'suspended';
  certificateUrl?: string;
  verificationNumber?: string;
}

interface PerformanceMetric {
  id: string;
  category: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface GuardTrainingSystemProps {
  guardId: string;
  guardName: string;
  adminMode?: boolean;
}

export default function GuardTrainingSystem({ 
  guardId, 
  guardName, 
  adminMode = false 
}: GuardTrainingSystemProps) {
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Mock data initialization
  useEffect(() => {
    const mockModules: TrainingModule[] = [
      {
        id: 'module1',
        title: 'Basic Security Procedures',
        description: 'Fundamental security protocols and procedures',
        type: 'video',
        duration: 45,
        category: 'Basic Training',
        difficulty: 'beginner',
        isMandatory: true,
        expiryDays: 365,
        contentUrl: '/training/basic-security.mp4'
      },
      {
        id: 'module2',
        title: 'Emergency Response',
        description: 'Handling emergency situations and protocols',
        type: 'practical',
        duration: 120,
        category: 'Safety',
        difficulty: 'intermediate',
        isMandatory: true,
        expiryDays: 180,
        prerequisites: ['module1']
      },
      {
        id: 'module3',
        title: 'Advanced Surveillance',
        description: 'Advanced surveillance techniques and equipment',
        type: 'video',
        duration: 60,
        category: 'Advanced Skills',
        difficulty: 'advanced',
        isMandatory: false,
        expiryDays: 365
      },
      {
        id: 'module4',
        title: 'Legal Compliance',
        description: 'Legal aspects of security operations',
        type: 'document',
        duration: 30,
        category: 'Compliance',
        difficulty: 'intermediate',
        isMandatory: true,
        expiryDays: 730
      },
      {
        id: 'module5',
        title: 'First Aid Certification',
        description: 'Basic first aid and emergency medical response',
        type: 'practical',
        duration: 240,
        category: 'Medical',
        difficulty: 'intermediate',
        isMandatory: true,
        expiryDays: 1095
      }
    ];

    const mockRecords: TrainingRecord[] = [
      {
        id: 'record1',
        guardId,
        moduleId: 'module1',
        moduleName: 'Basic Security Procedures',
        status: 'completed',
        progress: 100,
        score: 85,
        completedAt: '2024-01-15T10:00:00Z',
        expiresAt: '2025-01-15T10:00:00Z',
        certificateUrl: '/certificates/basic-security.pdf'
      },
      {
        id: 'record2',
        guardId,
        moduleId: 'module2',
        moduleName: 'Emergency Response',
        status: 'in_progress',
        progress: 65,
        score: undefined
      },
      {
        id: 'record3',
        guardId,
        moduleId: 'module4',
        moduleName: 'Legal Compliance',
        status: 'expired',
        progress: 100,
        score: 92,
        completedAt: '2023-06-01T10:00:00Z',
        expiresAt: '2023-12-01T10:00:00Z'
      }
    ];

    const mockCertifications: Certification[] = [
      {
        id: 'cert1',
        name: 'Security Guard License',
        issuingAuthority: 'State Security Board',
        issuedDate: '2023-01-15',
        expiryDate: '2025-01-15',
        status: 'active',
        certificateUrl: '/certificates/license.pdf',
        verificationNumber: 'LIC-2023-001234'
      },
      {
        id: 'cert2',
        name: 'First Aid Certified',
        issuingAuthority: 'Red Cross',
        issuedDate: '2023-03-20',
        expiryDate: '2024-03-20',
        status: 'active',
        certificateUrl: '/certificates/first-aid.pdf',
        verificationNumber: 'FA-2023-005678'
      },
      {
        id: 'cert3',
        name: 'Fire Safety Training',
        issuingAuthority: 'Fire Department',
        issuedDate: '2022-11-10',
        expiryDate: '2023-11-10',
        status: 'expired',
        certificateUrl: '/certificates/fire-safety.pdf',
        verificationNumber: 'FS-2022-009012'
      }
    ];

    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'metric1',
        category: 'Training',
        metric: 'Completion Rate',
        value: 75,
        target: 90,
        unit: '%',
        trend: 'up',
        period: 'Last 30 days'
      },
      {
        id: 'metric2',
        category: 'Skills',
        metric: 'Average Score',
        value: 82,
        target: 85,
        unit: '%',
        trend: 'stable',
        period: 'Last 30 days'
      },
      {
        id: 'metric3',
        category: 'Compliance',
        metric: 'Mandatory Training',
        value: 3,
        target: 4,
        unit: 'completed',
        trend: 'up',
        period: 'Current'
      }
    ];

    setTrainingModules(mockModules);
    setTrainingRecords(mockRecords);
    setCertifications(mockCertifications);
    setPerformanceMetrics(mockMetrics);
  }, [guardId]);

  const startTraining = (module: TrainingModule) => {
    setSelectedModule(module);
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeTraining(module);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);
  };

  const completeTraining = (module: TrainingModule) => {
    const newRecord: TrainingRecord = {
      id: `record_${Date.now()}`,
      guardId,
      moduleId: module.id,
      moduleName: module.title,
      status: 'completed',
      progress: 100,
      score: Math.floor(Math.random() * 20) + 80, // Random score 80-100
      completedAt: new Date().toISOString(),
      expiresAt: module.expiryDays ? 
        new Date(Date.now() + module.expiryDays * 24 * 60 * 60 * 1000).toISOString() : 
        undefined,
      certificateUrl: `/certificates/${module.id}.pdf`
    };

    setTrainingRecords(prev => [...prev.filter(r => r.moduleId !== module.id), newRecord]);
    setIsTraining(false);
    setSelectedModule(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'expired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModuleStatus = (moduleId: string) => {
    const record = trainingRecords.find(r => r.moduleId === moduleId);
    return record?.status || 'not_started';
  };

  const getModuleProgress = (moduleId: string) => {
    const record = trainingRecords.find(r => r.moduleId === moduleId);
    return record?.progress || 0;
  };

  const completedTrainings = trainingRecords.filter(r => r.status === 'completed').length;
  const mandatoryTrainings = trainingModules.filter(m => m.isMandatory).length;
  const completedMandatory = trainingRecords.filter(r => 
    r.status === 'completed' && trainingModules.find(m => m.id === r.moduleId)?.isMandatory
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training & Certification</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage guard training programs" : "Your training progress and certifications"}
          </p>
        </div>
        
        {adminMode && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Training Module
          </Button>
        )}
      </div>

      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trainings</p>
                <p className="text-2xl font-bold">{trainingModules.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTrainings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mandatory</p>
                <p className="text-2xl font-bold text-orange-600">
                  {completedMandatory}/{mandatoryTrainings}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Certs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {certifications.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training Modules</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          {/* Training Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Available Training Modules</CardTitle>
              <CardDescription>
                Training programs available for {guardName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {trainingModules.map((module) => {
                  const status = getModuleStatus(module.id);
                  const progress = getModuleProgress(module.id);
                  const record = trainingRecords.find(r => r.moduleId === module.id);

                  return (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {module.type === 'video' && <Video className="w-6 h-6 text-blue-600" />}
                            {module.type === 'document' && <FileText className="w-6 h-6 text-blue-600" />}
                            {module.type === 'quiz' && <HelpCircle className="w-6 h-6 text-blue-600" />}
                            {module.type === 'practical' && <Users className="w-6 h-6 text-blue-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                                {module.difficulty}
                              </Badge>
                              <Badge variant={module.isMandatory ? "destructive" : "secondary"}>
                                {module.isMandatory ? "Mandatory" : "Optional"}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {module.duration}m
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={`${getStatusColor(status)} text-white`}>
                            {status.replace('_', ' ')}
                          </Badge>
                          
                          {status === 'not_started' && (
                            <Button onClick={() => startTraining(module)} size="sm">
                              Start Training
                            </Button>
                          )}
                          
                          {status === 'in_progress' && (
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          )}
                          
                          {status === 'completed' && record && (
                            <div className="flex items-center space-x-2">
                              <div className="text-sm">
                                <span className="font-medium">{record.score}%</span>
                                {record.expiresAt && (
                                  <span className="text-muted-foreground ml-2">
                                    Expires: {new Date(record.expiresAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {record.certificateUrl && (
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {status === 'in_progress' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="w-full" />
                        </div>
                      )}
                      
                      {module.prerequisites && module.prerequisites.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Prerequisites:</strong> {module.prerequisites.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          {/* Certifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certifications & Licenses</CardTitle>
                  <CardDescription>
                    Professional certifications and licenses
                  </CardDescription>
                </div>
                {adminMode && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">{cert.issuingAuthority}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm">
                            <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                            {cert.expiryDate && (
                              <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                            )}
                            {cert.verificationNumber && (
                              <span className="text-muted-foreground">ID: {cert.verificationNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`${getStatusColor(cert.status)} text-white`}>
                          {cert.status}
                        </Badge>
                        
                        {cert.certificateUrl && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                        
                        {adminMode && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Training Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for training effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{metric.metric}</h3>
                        <p className="text-sm text-muted-foreground">{metric.category} • {metric.period}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {metric.value}{metric.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {metric.target}{metric.unit}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(metric.trend)}
                          <div className="text-sm">
                            {metric.value >= metric.target ? (
                              <span className="text-green-600">On Target</span>
                            ) : (
                              <span className="text-red-600">Below Target</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Training Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Completion</span>
                    <span>{Math.round((completedTrainings / trainingModules.length) * 100)}%</span>
                  </div>
                  <Progress value={(completedTrainings / trainingModules.length) * 100} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mandatory Training Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mandatory Completion</span>
                    <span>{Math.round((completedMandatory / mandatoryTrainings) * 100)}%</span>
                  </div>
                  <Progress value={(completedMandatory / mandatoryTrainings) * 100} />
                  {completedMandatory < mandatoryTrainings && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {mandatoryTrainings - completedMandatory} mandatory training(s) remaining
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Training Modal */}
      {isTraining && selectedModule && (
        <Dialog open={isTraining} onOpenChange={setIsTraining}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedModule.title}</DialogTitle>
              <DialogDescription>
                {selectedModule.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getDifficultyColor(selectedModule.difficulty)}>
                    {selectedModule.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedModule.duration} minutes
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Progress: {Math.round(trainingProgress)}%
                </div>
              </div>
              
              <Progress value={trainingProgress} className="w-full" />
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  Training in progress... {Math.round(trainingProgress)}% complete
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTraining(false)}>
                  Pause Training
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}