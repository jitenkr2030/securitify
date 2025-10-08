"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Clock,
  FileText,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Info,
  ChevronDown,
  ChevronRight,
  Download
} from "lucide-react";

interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  items: ComplianceItem[];
}

interface ComplianceItem {
  id: string;
  name: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
  score: number;
  maxScore: number;
  dueDate?: string;
  lastUpdated: string;
  details?: string;
  actionRequired?: string;
}

interface ComplianceScore {
  overall: number;
  categories: ComplianceCategory[];
  lastUpdated: string;
  trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

export default function MobileComplianceScoring() {
  const [complianceData, setComplianceData] = useState<ComplianceScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      // Mock data for demonstration
      const mockData: ComplianceScore = {
        overall: 78,
        lastUpdated: new Date().toISOString(),
        trend: 'improving',
        recommendations: [
          "Renew 3 expiring guard licenses within 30 days",
          "Complete pending training certifications for 5 guards",
          "Update client agreements for 2 contracts",
          "Process pending wage payments for current month"
        ],
        categories: [
          {
            id: 'licenses',
            name: 'Licenses',
            description: 'PSARA license compliance',
            score: 85,
            maxScore: 100,
            weight: 0.3,
            trend: 'stable',
            icon: Shield,
            items: [
              {
                id: 'lic1',
                name: 'Active Licenses',
                status: 'compliant',
                score: 25,
                maxScore: 25,
                lastUpdated: '2024-01-15',
                details: '45 out of 45 guards have active licenses'
              },
              {
                id: 'lic2',
                name: 'License Renewals',
                status: 'partial',
                score: 15,
                maxScore: 25,
                dueDate: '2024-02-15',
                lastUpdated: '2024-01-10',
                details: '3 licenses expiring within 30 days',
                actionRequired: 'Submit renewal applications'
              }
            ]
          },
          {
            id: 'training',
            name: 'Training',
            description: 'Guard training compliance',
            score: 72,
            maxScore: 100,
            weight: 0.25,
            trend: 'up',
            icon: Award,
            items: [
              {
                id: 'train1',
                name: 'Basic Training',
                status: 'compliant',
                score: 20,
                maxScore: 20,
                lastUpdated: '2024-01-14',
                details: 'All guards completed basic training'
              },
              {
                id: 'train2',
                name: 'Advanced Training',
                status: 'partial',
                score: 12,
                maxScore: 20,
                dueDate: '2024-02-01',
                lastUpdated: '2024-01-10',
                details: '5 guards need advanced training refreshers',
                actionRequired: 'Schedule training sessions'
              }
            ]
          },
          {
            id: 'agreements',
            name: 'Agreements',
            description: 'Client contract compliance',
            score: 80,
            maxScore: 100,
            weight: 0.2,
            trend: 'stable',
            icon: FileText,
            items: [
              {
                id: 'ag1',
                name: 'Active Contracts',
                status: 'compliant',
                score: 25,
                maxScore: 25,
                lastUpdated: '2024-01-16',
                details: 'All client contracts are active and valid'
              },
              {
                id: 'ag2',
                name: 'Contract Renewals',
                status: 'partial',
                score: 18,
                maxScore: 25,
                dueDate: '2024-01-30',
                lastUpdated: '2024-01-10',
                details: '2 contracts need renewal',
                actionRequired: 'Send renewal notices'
              }
            ]
          },
          {
            id: 'wages',
            name: 'Wages',
            description: 'Salary and wage compliance',
            score: 75,
            maxScore: 100,
            weight: 0.25,
            trend: 'down',
            icon: Users,
            items: [
              {
                id: 'wage1',
                name: 'Salary Payments',
                status: 'compliant',
                score: 25,
                maxScore: 25,
                lastUpdated: '2024-01-15',
                details: 'All salaries paid on time'
              },
              {
                id: 'wage2',
                name: 'Overtime Payments',
                status: 'partial',
                score: 15,
                maxScore: 20,
                lastUpdated: '2024-01-10',
                details: 'Some overtime payments pending processing',
                actionRequired: 'Process pending overtime payments'
              }
            ]
          }
        ]
      };

      setComplianceData(mockData);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    if (expandedCategory !== categoryId) {
      setExpandedItem(null);
    }
  };

  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!complianceData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load compliance data</p>
      </div>
    );
  }

  const overallScoreColor = getScoreColor(complianceData.overall);
  const overallScoreBgColor = getScoreBgColor(complianceData.overall);
  const overallScoreLevel = getScoreLevel(complianceData.overall);

  return (
    <div className="space-y-4 pb-20">
      {/* Overall Score Card - Mobile Optimized */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-blue-600" />
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-6 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${overallScoreColor}`}>
                      {complianceData.overall}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1">
                  {getTrendIcon(complianceData.trend)}
                </div>
              </div>
              <div>
                <Badge className={`${overallScoreBgColor} ${overallScoreColor} text-xs px-2 py-1 mb-1`}>
                  {overallScoreLevel}
                </Badge>
                <p className="text-xs text-gray-600 max-w-[200px]">
                  {complianceData.overall >= 90 ? 'Excellent compliance' :
                   complianceData.overall >= 70 ? 'Good compliance' :
                   complianceData.overall >= 50 ? 'Fair compliance' :
                   'Poor compliance'}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span className={overallScoreColor}>{complianceData.overall}%</span>
            </div>
            <Progress value={complianceData.overall} className="h-2" />
          </div>
          <p className="text-xs text-gray-500">
            Updated: {new Date(complianceData.lastUpdated).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="touch-target h-12 text-sm" variant="default">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Report
        </Button>
        <Button className="touch-target h-12 text-sm" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Category Scores - Mobile Cards */}
      <div className="space-y-3">
        {complianceData.categories.map((category) => {
          const categoryScoreColor = getScoreColor(category.score);
          const categoryScoreBgColor = getScoreBgColor(category.score);
          const isExpanded = expandedCategory === category.id;
          
          return (
            <Card key={category.id} className="overflow-hidden">
              <CardContent 
                className="p-4 cursor-pointer touch-target"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-lg font-bold ${categoryScoreColor}`}>
                      {category.score}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Progress value={category.score} className="h-2 mb-2" />
                <div className="flex justify-between items-center">
                  <Badge className={`${categoryScoreBgColor} ${categoryScoreColor} text-xs`}>
                    {getScoreLevel(category.score)}
                  </Badge>
                  {getTrendIcon(category.trend)}
                </div>
              </CardContent>

              {/* Expanded Category Items */}
              {isExpanded && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                  {category.items.map((item) => {
                    const isItemExpanded = expandedItem === item.id;
                    
                    return (
                      <div key={item.id} className="bg-white rounded-lg border">
                        <div 
                          className="p-3 cursor-pointer touch-target"
                          onClick={() => toggleItem(item.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {item.score}/{item.maxScore}
                              </span>
                              {isItemExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isItemExpanded && (
                          <div className="px-3 pb-3 space-y-2">
                            <p className="text-sm text-gray-600">{item.details}</p>
                            {item.actionRequired && (
                              <Alert className="border-yellow-200 bg-yellow-50">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800 text-xs">
                                  <strong>Action:</strong> {item.actionRequired}
                                </AlertDescription>
                              </Alert>
                            )}
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                              {item.dueDate && (
                                <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Action Required - Mobile Optimized */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-700 text-base">
            <Zap className="w-4 h-4" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {complianceData.recommendations.slice(0, 3).map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-orange-800">{recommendation}</span>
              </div>
            ))}
            {complianceData.recommendations.length > 3 && (
              <Button variant="link" className="p-0 h-auto text-xs text-orange-600">
                View all actions →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Compliant</p>
                <p className="text-lg font-bold text-green-600">
                  {complianceData.categories.reduce((acc, cat) => 
                    acc + cat.items.filter(item => item.status === 'compliant').length, 0
                  )}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Attention</p>
                <p className="text-lg font-bold text-yellow-600">
                  {complianceData.categories.reduce((acc, cat) => 
                    acc + cat.items.filter(item => item.status === 'partial').length, 0
                  )}
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 text-sm mb-1">Strengths</h4>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• License management is excellent</li>
                  <li>• Client agreements are well-maintained</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-yellow-900 text-sm mb-1">To Improve</h4>
                <ul className="space-y-1 text-xs text-yellow-800">
                  <li>• Training refreshers needed</li>
                  <li>• Overtime processing delayed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Training compliance improved</span>
                  </div>
                  <span className="text-xs text-green-600">+4%</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Wage processing delayed</span>
                  </div>
                  <span className="text-xs text-red-600">-3%</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">License compliance stable</span>
                  </div>
                  <span className="text-xs text-blue-600">0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Renew Licenses
              </Button>
              <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Schedule Training
              </Button>
              <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Update Contracts
              </Button>
              <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Process Wages
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}