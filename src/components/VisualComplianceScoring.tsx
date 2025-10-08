"use client";

import { useState, useEffect } from "react";
import React from "react";
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
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Info
} from "lucide-react";

interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
  items: ComplianceItem[];
  trend: 'up' | 'down' | 'stable';
  icon: any;
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

interface ComplianceHistory {
  date: string;
  score: number;
  categoryScores: Record<string, number>;
}

export default function VisualComplianceScoring() {
  const [complianceData, setComplianceData] = useState<ComplianceScore | null>(null);
  const [history, setHistory] = useState<ComplianceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
            name: 'Guard Licenses',
            description: 'PSARA license compliance and validity',
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
              },
              {
                id: 'lic3',
                name: 'License Documentation',
                status: 'compliant',
                score: 20,
                maxScore: 20,
                lastUpdated: '2024-01-12',
                details: 'All license documents properly filed'
              },
              {
                id: 'lic4',
                name: 'Background Checks',
                status: 'compliant',
                score: 15,
                maxScore: 15,
                lastUpdated: '2024-01-08',
                details: 'All background checks completed and verified'
              }
            ]
          },
          {
            id: 'training',
            name: 'Training Records',
            description: 'Guard training and certification compliance',
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
              },
              {
                id: 'train3',
                name: 'Certification Validity',
                status: 'compliant',
                score: 15,
                maxScore: 15,
                lastUpdated: '2024-01-12',
                details: 'All certifications are valid'
              },
              {
                id: 'train4',
                name: 'Training Documentation',
                status: 'partial',
                score: 10,
                maxScore: 15,
                lastUpdated: '2024-01-05',
                details: 'Some training records need updating',
                actionRequired: 'Update training records'
              }
            ]
          },
          {
            id: 'agreements',
            name: 'Client Agreements',
            description: 'Client contract compliance and documentation',
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
              },
              {
                id: 'ag3',
                name: 'Service Level Agreements',
                status: 'compliant',
                score: 20,
                maxScore: 20,
                lastUpdated: '2024-01-12',
                details: 'All SLAs are documented and followed'
              },
              {
                id: 'ag4',
                name: 'Insurance Coverage',
                status: 'compliant',
                score: 17,
                maxScore: 20,
                lastUpdated: '2024-01-08',
                details: 'Insurance coverage adequate and current'
              }
            ]
          },
          {
            id: 'wages',
            name: 'Wage Compliance',
            description: 'Salary payments and statutory compliance',
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
              },
              {
                id: 'wage3',
                name: 'Statutory Deductions',
                status: 'compliant',
                score: 20,
                maxScore: 20,
                lastUpdated: '2024-01-12',
                details: 'All statutory deductions properly calculated'
              },
              {
                id: 'wage4',
                name: 'Payroll Records',
                status: 'partial',
                score: 15,
                maxScore: 20,
                lastUpdated: '2024-01-08',
                details: 'Some payroll records need verification',
                actionRequired: 'Verify payroll records'
              }
            ]
          }
        ]
      };

      const mockHistory: ComplianceHistory[] = [
        { date: '2024-01-01', score: 72, categoryScores: { licenses: 80, training: 68, agreements: 75, wages: 70 } },
        { date: '2024-01-08', score: 74, categoryScores: { licenses: 82, training: 70, agreements: 77, wages: 72 } },
        { date: '2024-01-15', score: 76, categoryScores: { licenses: 84, training: 71, agreements: 79, wages: 74 } },
        { date: '2024-01-22', score: 78, categoryScores: { licenses: 85, training: 72, agreements: 80, wages: 75 } }
      ];

      setComplianceData(mockData);
      setHistory(mockHistory);
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
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2 border-blue-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-6 h-6 text-blue-600" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${overallScoreColor}`}>
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
                <Badge className={`${overallScoreBgColor} ${overallScoreColor} text-sm px-3 py-1 mb-2`}>
                  {overallScoreLevel} Compliance
                </Badge>
                <p className="text-sm text-gray-600 max-w-md">
                  {complianceData.overall >= 90 ? 'Excellent compliance status with minimal issues' :
                   complianceData.overall >= 70 ? 'Good compliance with some areas for improvement' :
                   complianceData.overall >= 50 ? 'Fair compliance requiring attention to several areas' :
                   'Poor compliance requiring immediate action'}
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span className={overallScoreColor}>{complianceData.overall}%</span>
              </div>
              <Progress value={complianceData.overall} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(complianceData.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceData.categories.map((category) => {
          const categoryScoreColor = getScoreColor(category.score);
          const categoryScoreBgColor = getScoreBgColor(category.score);
          
          return (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  {getTrendIcon(category.trend)}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-2xl font-bold ${categoryScoreColor}`}>
                    {category.score}
                  </div>
                  <Badge className={`${categoryScoreBgColor} ${categoryScoreColor} text-xs`}>
                    {getScoreLevel(category.score)}
                  </Badge>
                </div>
                <Progress value={category.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-500">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Zap className="w-5 h-5" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {complianceData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-orange-800">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Category View */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {complianceData.categories.find(c => c.id === selectedCategory)?.icon && (
                <span className="w-5 h-5 text-blue-600">
                  {React.createElement(complianceData.categories.find(c => c.id === selectedCategory)!.icon)}
                </span>
              )}
              {complianceData.categories.find(c => c.id === selectedCategory)?.name} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceData.categories
                .find(c => c.id === selectedCategory)
                ?.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {item.score}/{item.maxScore}
                        </span>
                        <Badge variant={
                          item.status === 'compliant' ? 'default' :
                          item.status === 'partial' ? 'secondary' : 'destructive'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                    {item.actionRequired && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800 text-sm">
                          <strong>Action:</strong> {item.actionRequired}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                      {item.dueDate && (
                        <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Compliance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getScoreBgColor(record.score)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(record.score)}`}>
                          {record.score}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">
                          {Object.entries(record.categoryScores).map(([cat, score]) => (
                            <span key={cat} className="mr-2">
                              {cat}: {score}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < history.length - 1 && (
                      <div className="flex items-center gap-1">
                        {record.score > history[index + 1].score ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : record.score < history[index + 1].score ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <Activity className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-500">
                          {record.score > history[index + 1].score ? '+' : ''}
                          {record.score - history[index + 1].score}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.weight * 100}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(category.score)}`}>
                          {category.score}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <div className="text-sm text-gray-500">
                      Contributes {Math.round(category.score * category.weight)} points to overall score
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Compliance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• License management is well-maintained</li>
                    <li>• Client agreements are properly documented</li>
                    <li>• Basic training compliance is excellent</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• Training refreshers need scheduling</li>
                    <li>• Overtime payment processing is delayed</li>
                    <li>• Contract renewals require attention</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Implement automated renewal reminders</li>
                    <li>• Streamline overtime approval process</li>
                    <li>• Schedule regular training sessions</li>
                    <li>• Consider digital document management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}