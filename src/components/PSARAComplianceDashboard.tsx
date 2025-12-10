"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Plus,
  Eye,
  BarChart3,
  Target,
  Award
} from "lucide-react";

interface ComplianceReport {
  id: string;
  reportType: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  status: string;
  submissionDate?: string;
  approvalDate?: string;
  remarks?: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplianceStats {
  totalGuards: number;
  activeLicenses: number;
  expiringLicenses: number;
  completedTrainings: number;
  expiringTrainings: number;
  activeAgreements: number;
  expiringAgreements: number;
  totalWagesPaid: number;
  pendingWages: number;
  complianceScore: number;
}

export default function PSARAComplianceDashboard() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [stats, setStats] = useState<ComplianceStats>({
    totalGuards: 0,
    activeLicenses: 0,
    expiringLicenses: 0,
    completedTrainings: 0,
    expiringTrainings: 0,
    activeAgreements: 0,
    expiringAgreements: 0,
    totalWagesPaid: 0,
    pendingWages: 0,
    complianceScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsResponse, guardsResponse, licensesResponse, trainingsResponse, agreementsResponse, wagesResponse] = await Promise.all([
        fetch('/api/psara/compliance-reports'),
        fetch('/api/guards'),
        fetch('/api/psara/licenses'),
        fetch('/api/psara/training-records'),
        fetch('/api/psara/client-agreements'),
        fetch('/api/psara/wage-register'),
      ]);

      const reportsData = await reportsResponse.json();
      const guardsData = await guardsResponse.json();
      const licensesData = await licensesResponse.json();
      const trainingsData = await trainingsResponse.json();
      const agreementsData = await agreementsResponse.json();
      const wagesData = await wagesResponse.json();

      if (reportsData.reports) setReports(reportsData.reports);
      if (guardsData.guards) {
        const totalGuards = guardsData.guards.length;
        const activeGuards = guardsData.guards.filter(g => g.status === 'active').length;
        
        setStats(prev => ({
          ...prev,
          totalGuards,
          activeGuards: activeGuards
        }));
      }

      if (licensesData.licenses) {
        const licenses = licensesData.licenses;
        const activeLicenses = licenses.filter(l => l.status === 'active').length;
        const now = new Date();
        const expiringLicenses = licenses.filter(l => {
          const expiry = new Date(l.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return l.status === 'active' && daysUntilExpiry <= 30;
        }).length;

        setStats(prev => ({
          ...prev,
          activeLicenses,
          expiringLicenses
        }));
      }

      if (trainingsData.trainingRecords) {
        const records = trainingsData.trainingRecords;
        const completedTrainings = records.filter(r => r.status === 'completed').length;
        const now = new Date();
        const expiringTrainings = records.filter(r => {
          const expiry = new Date(r.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return r.status === 'completed' && daysUntilExpiry <= 30;
        }).length;

        setStats(prev => ({
          ...prev,
          completedTrainings,
          expiringTrainings
        }));
      }

      if (agreementsData.agreements) {
        const agreements = agreementsData.agreements;
        const activeAgreements = agreements.filter(a => a.status === 'active').length;
        const now = new Date();
        const expiringAgreements = agreements.filter(a => {
          const expiry = new Date(a.endDate);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return a.status === 'active' && daysUntilExpiry <= 30;
        }).length;

        setStats(prev => ({
          ...prev,
          activeAgreements,
          expiringAgreements
        }));
      }

      if (wagesData.wageRegisters) {
        const wages = wagesData.wageRegisters;
        const totalWagesPaid = wages.filter(w => w.status === 'paid').reduce((sum, w) => sum + w.netWages, 0);
        const pendingWages = wages.filter(w => w.status === 'pending').length;

        setStats(prev => ({
          ...prev,
          totalWagesPaid,
          pendingWages
        }));
      }

      // Calculate compliance score
      const complianceScore = calculateComplianceScore({
        totalGuards: stats.totalGuards,
        activeLicenses: stats.activeLicenses,
        expiringLicenses: stats.expiringLicenses,
        completedTrainings: stats.completedTrainings,
        expiringTrainings: stats.expiringTrainings,
        activeAgreements: stats.activeAgreements,
        expiringAgreements: stats.expiringAgreements,
        pendingWages: stats.pendingWages,
      });

      setStats(prev => ({
        ...prev,
        complianceScore
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateComplianceScore = (data: any) => {
    let score = 100;
    
    // Deduct points for expiring items
    score -= (data.expiringLicenses * 5);
    score -= (data.expiringTrainings * 3);
    score -= (data.expiringAgreements * 5);
    score -= (data.pendingWages * 2);
    
    // Ensure score doesn't go below 0
    return Math.max(0, Math.min(100, score));
  };

  const getReportTypeBadge = (reportType: string) => {
    switch (reportType) {
      case 'monthly':
        return <Badge className="bg-blue-100 text-blue-800">Monthly</Badge>;
      case 'quarterly':
        return <Badge className="bg-purple-100 text-purple-800">Quarterly</Badge>;
      case 'annual':
        return <Badge className="bg-green-100 text-green-800">Annual</Badge>;
      case 'audit':
        return <Badge className="bg-red-100 text-red-800">Audit</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{reportType}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'generated':
        return <Badge className="bg-yellow-100 text-yellow-800">Generated</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const generateReport = async (reportType: string, period: string) => {
    try {
      const response = await fetch('/api/psara/compliance-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          period,
          data: {
            stats,
            generatedAt: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const complianceLevel = getComplianceLevel(stats.complianceScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Generate audit-ready reports and monitor compliance status
          </p>
        </div>
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Compliance Report</DialogTitle>
              <DialogDescription>
                Create a new PSARA compliance report
              </DialogDescription>
            </DialogHeader>
            <ReportForm onSuccess={() => setIsReportDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Compliance Score Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{stats.complianceScore}%</div>
              <div>
                <Badge className={`${complianceLevel.bgColor} ${complianceLevel.color}`}>
                  {complianceLevel.level}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.complianceScore >= 90 ? 'Excellent compliance status' :
                   stats.complianceScore >= 70 ? 'Good compliance with minor issues' :
                   stats.complianceScore >= 50 ? 'Fair compliance needs attention' :
                   'Poor compliance requires immediate action'}
                </p>
              </div>
            </div>
            <div className="w-32">
              <Progress value={stats.complianceScore} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Licenses</p>
                <p className="text-2xl font-bold">{stats.activeLicenses}</p>
                {stats.expiringLicenses > 0 && (
                  <p className="text-xs text-red-600">{stats.expiringLicenses} expiring</p>
                )}
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Records</p>
                <p className="text-2xl font-bold">{stats.completedTrainings}</p>
                {stats.expiringTrainings > 0 && (
                  <p className="text-xs text-red-600">{stats.expiringTrainings} expiring</p>
                )}
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agreements</p>
                <p className="text-2xl font-bold">{stats.activeAgreements}</p>
                {stats.expiringAgreements > 0 && (
                  <p className="text-xs text-red-600">{stats.expiringAgreements} expiring</p>
                )}
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wages Paid</p>
                <p className="text-2xl font-bold">₹{(stats.totalWagesPaid / 1000000).toFixed(1)}M</p>
                {stats.pendingWages > 0 && (
                  <p className="text-xs text-red-600">{stats.pendingWages} pending</p>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.expiringLicenses > 0 || stats.expiringTrainings > 0 || stats.expiringAgreements > 0 || stats.pendingWages > 0) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Action Required:</strong> You have {stats.expiringLicenses} expiring licenses, {stats.expiringTrainings} expiring training certifications, {stats.expiringAgreements} expiring agreements, and {stats.pendingWages} pending wage payments that need attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                All PSARA compliance reports with submission status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports generated yet. Create your first compliance report.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{getReportTypeBadge(report.reportType)}</TableCell>
                        <TableCell className="font-medium">{report.period}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {report.submissionDate ? (
                            new Date(report.submissionDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-400">Not submitted</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {report.filePath && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>License Compliance</span>
                  <Badge className={stats.activeLicenses > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {stats.activeLicenses > 0 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Training Compliance</span>
                  <Badge className={stats.completedTrainings > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {stats.completedTrainings > 0 ? 'Compliant' : 'Non-compliant'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Agreement Compliance</span>
                  <Badge className={stats.activeAgreements > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {stats.activeAgreements > 0 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wage Compliance</span>
                  <Badge className={stats.pendingWages === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {stats.pendingWages === 0 ? 'Compliant' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => generateReport('monthly', new Date().toISOString().slice(0, 7))}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Monthly Report
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => generateReport('quarterly', `Q${Math.floor((new Date().getMonth() + 2) / 3)}-${new Date().getFullYear()}`)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Quarterly Report
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => generateReport('annual', new Date().getFullYear().toString())}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Annual Report
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => generateReport('audit', new Date().toISOString().slice(0, 7))}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Audit Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and trends for PSARA compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Analytics dashboard would be implemented here with charts and graphs showing compliance trends over time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Report Form Component
function ReportForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    reportType: '',
    period: '',
    remarks: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/compliance-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getCurrentPeriod = (reportType: string) => {
    const now = new Date();
    switch (reportType) {
      case 'monthly':
        return now.toISOString().slice(0, 7); // YYYY-MM
      case 'quarterly':
        const quarter = Math.floor((now.getMonth() + 2) / 3);
        return `Q${quarter}-${now.getFullYear()}`;
      case 'annual':
        return now.getFullYear().toString();
      case 'audit':
        return now.toISOString().slice(0, 7);
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="reportType">Report Type *</Label>
        <Select 
          value={formData.reportType} 
          onValueChange={(value) => {
            setFormData({ 
              ...formData, 
              reportType: value,
              period: getCurrentPeriod(value)
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly Report</SelectItem>
            <SelectItem value="quarterly">Quarterly Report</SelectItem>
            <SelectItem value="annual">Annual Report</SelectItem>
            <SelectItem value="audit">Audit Report</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="period">Period *</Label>
        <Input
          id="period"
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          placeholder="Auto-filled based on report type"
          required
        />
      </div>
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Input
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Generate Report</Button>
      </div>
    </form>
  );
}