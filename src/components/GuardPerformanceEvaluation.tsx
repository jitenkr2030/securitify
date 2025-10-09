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
  Star, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Medal,
  Zap
} from "lucide-react";

interface PerformanceMetric {
  id: string;
  category: string;
  name: string;
  description: string;
  weight: number; // 1-100
  target: number;
  unit: string;
  type: 'numeric' | 'boolean' | 'rating';
}

interface PerformanceReview {
  id: string;
  guardId: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string; // "2024-Q1", "2024-01", etc.
  overallScore: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  notes?: string;
}

interface PerformanceRating {
  id: string;
  reviewId: string;
  metricId: string;
  metricName: string;
  score: number;
  maxScore: number;
  comments?: string;
  evidence?: string;
}

interface ImprovementPlan {
  id: string;
  guardId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  targetDate: string;
  completedAt?: string;
  createdById: string;
  createdByName: string;
  notes?: string;
}

interface Feedback {
  id: string;
  guardId: string;
  fromUserId: string;
  fromUserName: string;
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
  readAt?: string;
}

interface GuardPerformanceEvaluationProps {
  guardId: string;
  guardName: string;
  adminMode?: boolean;
}

export default function GuardPerformanceEvaluation({ 
  guardId, 
  guardName, 
  adminMode = false 
}: GuardPerformanceEvaluationProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [performanceRatings, setPerformanceRatings] = useState<PerformanceRating[]>([]);
  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'metric1',
        category: 'Attendance',
        name: 'Punctuality',
        description: 'Arrives on time for shifts',
        weight: 20,
        target: 95,
        unit: '%',
        type: 'numeric'
      },
      {
        id: 'metric2',
        category: 'Attendance',
        name: 'Attendance Rate',
        description: 'Percentage of shifts attended',
        weight: 15,
        target: 98,
        unit: '%',
        type: 'numeric'
      },
      {
        id: 'metric3',
        category: 'Performance',
        name: 'Job Knowledge',
        description: 'Understanding of security procedures',
        weight: 25,
        target: 85,
        unit: '%',
        type: 'rating'
      },
      {
        id: 'metric4',
        category: 'Performance',
        name: 'Incident Response',
        description: 'Effectiveness in handling incidents',
        weight: 20,
        target: 90,
        unit: '%',
        type: 'rating'
      },
      {
        id: 'metric5',
        category: 'Behavior',
        name: 'Professional Conduct',
        description: 'Maintains professional behavior',
        weight: 10,
        target: 100,
        unit: '%',
        type: 'boolean'
      },
      {
        id: 'metric6',
        category: 'Behavior',
        name: 'Teamwork',
        description: 'Works well with other guards',
        weight: 10,
        target: 85,
        unit: '%',
        type: 'rating'
      }
    ];

    const mockReviews: PerformanceReview[] = [
      {
        id: 'review1',
        guardId,
        reviewerId: 'admin1',
        reviewerName: 'Security Manager',
        reviewPeriod: '2024-Q1',
        overallScore: 87,
        status: 'approved',
        createdAt: '2024-04-01T10:00:00Z',
        submittedAt: '2024-04-01T10:00:00Z',
        approvedAt: '2024-04-02T10:00:00Z',
        notes: 'Good performance overall, room for improvement in incident response'
      },
      {
        id: 'review2',
        guardId,
        reviewerId: 'admin1',
        reviewerName: 'Security Manager',
        reviewPeriod: '2024-Q2',
        overallScore: 92,
        status: 'submitted',
        createdAt: '2024-07-01T10:00:00Z',
        submittedAt: '2024-07-01T10:00:00Z',
        notes: 'Excellent improvement in all areas'
      }
    ];

    const mockRatings: PerformanceRating[] = [
      {
        id: 'rating1',
        reviewId: 'review1',
        metricId: 'metric1',
        metricName: 'Punctuality',
        score: 90,
        maxScore: 100,
        comments: 'Generally punctual, occasional delays'
      },
      {
        id: 'rating2',
        reviewId: 'review1',
        metricId: 'metric2',
        metricName: 'Attendance Rate',
        score: 95,
        maxScore: 100,
        comments: 'Good attendance record'
      },
      {
        id: 'rating3',
        reviewId: 'review1',
        metricId: 'metric3',
        metricName: 'Job Knowledge',
        score: 85,
        maxScore: 100,
        comments: 'Good knowledge of procedures'
      }
    ];

    const mockPlans: ImprovementPlan[] = [
      {
        id: 'plan1',
        guardId,
        title: 'Improve Incident Response',
        description: 'Complete advanced incident response training',
        category: 'Training',
        priority: 'high',
        status: 'completed',
        targetDate: '2024-06-01',
        completedAt: '2024-05-28T10:00:00Z',
        createdById: 'admin1',
        createdByName: 'Security Manager',
        notes: 'Successfully completed training'
      },
      {
        id: 'plan2',
        guardId,
        title: 'Enhance Communication Skills',
        description: 'Attend communication workshop',
        category: 'Skills Development',
        priority: 'medium',
        status: 'in_progress',
        targetDate: '2024-08-15',
        createdById: 'admin1',
        createdByName: 'Security Manager'
      }
    ];

    const mockFeedback: Feedback[] = [
      {
        id: 'feedback1',
        guardId,
        fromUserId: 'user1',
        fromUserName: 'Site Supervisor',
        type: 'positive',
        category: 'Performance',
        message: 'Excellent handling of security incident last week',
        isAnonymous: false,
        createdAt: '2024-07-10T10:00:00Z'
      },
      {
        id: 'feedback2',
        guardId,
        fromUserId: 'user2',
        fromUserName: 'Team Lead',
        type: 'neutral',
        category: 'Teamwork',
        message: 'Good team player, could be more proactive in shift handovers',
        isAnonymous: false,
        createdAt: '2024-07-08T10:00:00Z',
        readAt: '2024-07-08T11:00:00Z'
      }
    ];

    setPerformanceMetrics(mockMetrics);
    setPerformanceReviews(mockReviews);
    setPerformanceRatings(mockRatings);
    setImprovementPlans(mockPlans);
    setFeedback(mockFeedback);
  }, [guardId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getReviewRatings = (reviewId: string) => {
    return performanceRatings.filter(rating => rating.reviewId === reviewId);
  };

  const calculateOverallScore = (reviewId: string) => {
    const ratings = getReviewRatings(reviewId);
    if (ratings.length === 0) return 0;
    
    const weightedScore = ratings.reduce((sum, rating) => {
      const metric = performanceMetrics.find(m => m.id === rating.metricId);
      const weight = metric?.weight || 1;
      return sum + (rating.score / rating.maxScore) * weight;
    }, 0);
    
    const totalWeight = ratings.reduce((sum, rating) => {
      const metric = performanceMetrics.find(m => m.id === rating.metricId);
      return sum + (metric?.weight || 1);
    }, 0);
    
    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
  };

  const getLatestReviewScore = () => {
    const latestReview = performanceReviews[0];
    return latestReview?.overallScore || 0;
  };

  const getScoreTrend = () => {
    if (performanceReviews.length < 2) return 'stable';
    const latest = performanceReviews[0]?.overallScore || 0;
    const previous = performanceReviews[1]?.overallScore || 0;
    return latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
  };

  const completedPlans = improvementPlans.filter(p => p.status === 'completed').length;
  const activePlans = improvementPlans.filter(p => p.status === 'in_progress').length;
  const positiveFeedback = feedback.filter(f => f.type === 'positive').length;
  const unreadFeedback = feedback.filter(f => !f.readAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Evaluation</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage guard performance reviews" : "Your performance reviews and feedback"}
          </p>
        </div>
        
        {adminMode && (
          <Button onClick={() => setIsCreatingReview(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Review
          </Button>
        )}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Latest Score</p>
                <p className="text-2xl font-bold">{getLatestReviewScore()}%</p>
              </div>
              <div className="flex items-center">
                {getScoreTrend() === 'up' && <TrendingUp className="w-8 h-8 text-green-500" />}
                {getScoreTrend() === 'down' && <TrendingDown className="w-8 h-8 text-red-500" />}
                {getScoreTrend() === 'stable' && <Target className="w-8 h-8 text-gray-500" />}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews</p>
                <p className="text-2xl font-bold">{performanceReviews.length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement Plans</p>
                <p className="text-2xl font-bold">{activePlans}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Feedback</p>
                <p className="text-2xl font-bold text-green-600">{positiveFeedback}</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & KPIs</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Plans</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {/* Performance Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>
                Historical performance evaluations for {guardName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceReviews.map((review) => {
                  const ratings = getReviewRatings(review.id);
                  const scoreTrend = review.id === performanceReviews[0]?.id ? getScoreTrend() : 'stable';

                  return (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{review.reviewPeriod} Review</h3>
                            <p className="text-sm text-muted-foreground">
                              Reviewer: {review.reviewerName} • {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-2xl font-bold">{review.overallScore}%</span>
                            {scoreTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {scoreTrend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                          </div>
                          
                          <Badge variant="secondary" className={`${getStatusColor(review.status)} text-white`}>
                            {review.status}
                          </Badge>
                          
                          <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {review.notes && (
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-sm"><strong>Notes:</strong> {review.notes}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {ratings.slice(0, 3).map((rating) => (
                          <div key={rating.id} className="text-sm">
                            <span className="font-medium">{rating.metricName}:</span>
                            <span className="ml-2">{rating.score}/{rating.maxScore}</span>
                          </div>
                        ))}
                        {ratings.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{ratings.length - 3} more metrics
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics & KPIs</CardTitle>
              <CardDescription>
                Key performance indicators and evaluation criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => {
                  const latestRating = performanceRatings
                    .filter(r => r.metricId === metric.id)
                    .sort((a, b) => new Date(b.reviewId).getTime() - new Date(a.reviewId).getTime())[0];
                  
                  const currentScore = latestRating?.score || 0;
                  const progress = (currentScore / metric.target) * 100;

                  return (
                    <div key={metric.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{metric.name}</h3>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{metric.category}</Badge>
                            <Badge variant="outline">Weight: {metric.weight}%</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {currentScore}{metric.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {metric.target}{metric.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} />
                      </div>
                      
                      {latestRating?.comments && (
                        <div className="bg-blue-50 rounded p-2">
                          <p className="text-sm"><strong>Latest Comment:</strong> {latestRating.comments}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          {/* Improvement Plans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Improvement Plans</CardTitle>
                  <CardDescription>
                    Development plans and action items
                  </CardDescription>
                </div>
                {adminMode && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Plan
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{plan.category}</Badge>
                            <Badge variant="secondary" className={`${getPriorityColor(plan.priority)} text-white`}>
                              {plan.priority}
                            </Badge>
                            <Badge variant="outline" className={`${getStatusColor(plan.status)} text-white`}>
                              {plan.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">
                          Target: {new Date(plan.targetDate).toLocaleDateString()}
                        </div>
                        
                        {adminMode && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {plan.notes && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm"><strong>Notes:</strong> {plan.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Comments</CardTitle>
              <CardDescription>
                Feedback from supervisors and team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {item.isAnonymous ? 'Anonymous' : item.fromUserName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getFeedbackIcon(item.type)}
                        <Badge variant="outline" className={`${getStatusColor(item.type)} text-white`}>
                          {item.type}
                        </Badge>
                        {!item.readAt && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceReviews.slice(0, 4).map((review, index) => (
                    <div key={review.id} className="flex items-center justify-between">
                      <span className="text-sm">{review.reviewPeriod}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.overallScore}%</span>
                        {index === 0 && getScoreTrend() === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {index === 0 && getScoreTrend() === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Improvement Plan Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{completedPlans} plans</span>
                  </div>
                  <Progress value={(completedPlans / improvementPlans.length) * 100} />
                  
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span>{activePlans} plans</span>
                  </div>
                  <Progress value={(activePlans / improvementPlans.length) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{positiveFeedback}</div>
                  <div className="text-sm text-muted-foreground">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {feedback.filter(f => f.type === 'negative').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Negative</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{unreadFeedback}</div>
                  <div className="text-sm text-muted-foreground">Unread</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}