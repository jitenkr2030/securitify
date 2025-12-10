"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  Clock, 
  FileText,
  Download,
  Upload,
  Calculator,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";

interface SalaryConfig {
  id: string;
  guardId: string;
  guardName: string;
  baseSalary: number;
  hourlyRate?: number;
  overtimeRate: number; // multiplier for overtime hours
  nightShiftAllowance: number;
  weekendAllowance: number;
  holidayAllowance: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

interface PayrollRecord {
  id: string;
  guardId: string;
  guardName: string;
  month: string; // YYYY-MM format
  year: number;
  baseSalary: number;
  overtimeHours: number;
  overtimeAmount: number;
  nightShiftHours: number;
  nightShiftAmount: number;
  weekendHours: number;
  weekendAmount: number;
  holidayHours: number;
  holidayAmount: number;
  deductions: {
    absentDays: number;
    lateDays: number;
    penaltyAmount: number;
    advanceDeductions: number;
    otherDeductions: number;
  };
  netSalary: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  processedAt?: string;
  paidAt?: string;
  notes?: string;
}

interface AttendanceSummary {
  guardId: string;
  guardName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  overtimeHours: number;
  nightShiftHours: number;
  weekendHours: number;
  holidayHours: number;
}

interface PayrollManagementProps {
  adminMode?: boolean;
  guardId?: string;
  onPayrollUpdate?: (record: PayrollRecord) => void;
}

export default function PayrollManagement({ 
  adminMode = true, 
  guardId, 
  onPayrollUpdate 
}: PayrollManagementProps) {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [salaryConfigs, setSalaryConfigs] = useState<SalaryConfig[]>([]);
  const [attendanceSummaries, setAttendanceSummaries] = useState<AttendanceSummary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedGuard, setSelectedGuard] = useState<string>(guardId || 'all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [newConfig, setNewConfig] = useState({
    guardId: '',
    baseSalary: 0,
    hourlyRate: 0,
    overtimeRate: 1.5,
    nightShiftAllowance: 0,
    weekendAllowance: 0,
    holidayAllowance: 0
  });

  // Mock data initialization
  useEffect(() => {
    const mockSalaryConfigs: SalaryConfig[] = [
      {
        id: 'config1',
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        baseSalary: 25000,
        hourlyRate: 150,
        overtimeRate: 1.5,
        nightShiftAllowance: 200,
        weekendAllowance: 300,
        holidayAllowance: 500,
        effectiveFrom: '2024-01-01'
      },
      {
        id: 'config2',
        guardId: 'guard2',
        guardName: 'Suresh Patel',
        baseSalary: 22000,
        hourlyRate: 130,
        overtimeRate: 1.5,
        nightShiftAllowance: 180,
        weekendAllowance: 250,
        holidayAllowance: 400,
        effectiveFrom: '2024-01-01'
      }
    ];

    const mockAttendanceSummaries: AttendanceSummary[] = [
      {
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        totalDays: 26,
        presentDays: 24,
        absentDays: 2,
        lateDays: 3,
        overtimeHours: 12,
        nightShiftHours: 40,
        weekendHours: 8,
        holidayHours: 4
      },
      {
        guardId: 'guard2',
        guardName: 'Suresh Patel',
        totalDays: 26,
        presentDays: 25,
        absentDays: 1,
        lateDays: 1,
        overtimeHours: 8,
        nightShiftHours: 32,
        weekendHours: 6,
        holidayHours: 2
      }
    ];

    const mockPayrollRecords: PayrollRecord[] = [
      {
        id: 'payroll1',
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        month: '2024-01',
        year: 2024,
        baseSalary: 25000,
        overtimeHours: 12,
        overtimeAmount: 2700,
        nightShiftHours: 40,
        nightShiftAmount: 8000,
        weekendHours: 8,
        weekendAmount: 2400,
        holidayHours: 4,
        holidayAmount: 2000,
        deductions: {
          absentDays: 2,
          lateDays: 3,
          penaltyAmount: 600,
          advanceDeductions: 1000,
          otherDeductions: 500
        },
        netSalary: 38000,
        status: 'paid',
        processedAt: '2024-01-31T10:00:00Z',
        paidAt: '2024-02-01T09:00:00Z'
      },
      {
        id: 'payroll2',
        guardId: 'guard2',
        guardName: 'Suresh Patel',
        month: '2024-01',
        year: 2024,
        baseSalary: 22000,
        overtimeHours: 8,
        overtimeAmount: 1560,
        nightShiftHours: 32,
        nightShiftAmount: 5760,
        weekendHours: 6,
        weekendAmount: 1500,
        holidayHours: 2,
        holidayAmount: 800,
        deductions: {
          absentDays: 1,
          lateDays: 1,
          penaltyAmount: 200,
          advanceDeductions: 500,
          otherDeductions: 300
        },
        netSalary: 30620,
        status: 'processed',
        processedAt: '2024-01-31T10:00:00Z'
      }
    ];

    setSalaryConfigs(mockSalaryConfigs);
    setAttendanceSummaries(mockAttendanceSummaries);
    setPayrollRecords(mockPayrollRecords);
  }, []);

  const filteredRecords = payrollRecords.filter(record => {
    const recordMonth = parseInt(record.month.split('-')[1]);
    const recordYear = record.year;
    
    const monthMatch = recordMonth === selectedMonth;
    const yearMatch = recordYear === selectedYear;
    const guardMatch = selectedGuard === 'all' || record.guardId === selectedGuard;
    
    return monthMatch && yearMatch && guardMatch;
  });

  const calculatePayroll = (guardId: string, month: string, year: number): PayrollRecord => {
    const config = salaryConfigs.find(c => c.guardId === guardId);
    const attendance = attendanceSummaries.find(a => a.guardId === guardId);
    
    if (!config || !attendance) {
      throw new Error('Configuration or attendance data not found');
    }

    const baseSalary = config.baseSalary;
    const dailyRate = baseSalary / 26; // Assuming 26 working days per month
    
    // Calculate earnings
    const overtimeAmount = attendance.overtimeHours * (config.hourlyRate || dailyRate / 8) * config.overtimeRate;
    const nightShiftAmount = attendance.nightShiftHours * (config.nightShiftAllowance / 8); // Per hour rate
    const weekendAmount = attendance.weekendHours * (config.weekendAllowance / 8);
    const holidayAmount = attendance.holidayHours * (config.holidayAllowance / 8);
    
    const totalEarnings = baseSalary + overtimeAmount + nightShiftAmount + weekendAmount + holidayAmount;
    
    // Calculate deductions
    const absentDeduction = attendance.absentDays * dailyRate;
    const latePenalty = attendance.lateDays * 200; // Fixed penalty per late day
    const totalDeductions = absentDeduction + latePenalty + 1000 + 500; // Including advance and other deductions
    
    const netSalary = totalEarnings - totalDeductions;

    return {
      id: `payroll-${Date.now()}`,
      guardId,
      guardName: attendance.guardName,
      month,
      year,
      baseSalary,
      overtimeHours: attendance.overtimeHours,
      overtimeAmount,
      nightShiftHours: attendance.nightShiftHours,
      nightShiftAmount,
      weekendHours: attendance.weekendHours,
      weekendAmount,
      holidayHours: attendance.holidayHours,
      holidayAmount,
      deductions: {
        absentDays: attendance.absentDays,
        lateDays: attendance.lateDays,
        penaltyAmount: latePenalty,
        advanceDeductions: 1000,
        otherDeductions: 500
      },
      netSalary,
      status: 'pending'
    };
  };

  const processPayroll = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const monthStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      const guardsToProcess = selectedGuard === 'all' 
        ? salaryConfigs.map(config => config.guardId)
        : [selectedGuard];
      
      const newRecords = guardsToProcess.map(guardId => {
        const record = calculatePayroll(guardId, monthStr, selectedYear);
        return {
          ...record,
          status: 'processed' as const,
          processedAt: new Date().toISOString()
        };
      });
      
      setPayrollRecords(prev => {
        // Remove existing records for the same month/year
        const filtered = prev.filter(record => 
          !(record.month === monthStr && record.year === selectedYear && guardsToProcess.includes(record.guardId))
        );
        return [...newRecords, ...filtered];
      });
      
      setShowProcessModal(false);
      
      // Show success message
      alert(`Payroll processed for ${newRecords.length} guards`);
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Failed to process payroll');
    } finally {
      setIsProcessing(false);
    }
  };

  const markAsPaid = (recordId: string) => {
    setPayrollRecords(prev =>
      prev.map(record =>
        record.id === recordId
          ? { ...record, status: 'paid' as const, paidAt: new Date().toISOString() }
          : record
      )
    );
  };

  const exportPayroll = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting payroll as ${format.toUpperCase()}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500 text-white';
      case 'processed': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateStats = () => {
    const filtered = filteredRecords;
    const totalPayroll = filtered.reduce((sum, record) => sum + record.netSalary, 0);
    const avgSalary = filtered.length > 0 ? totalPayroll / filtered.length : 0;
    const totalOvertime = filtered.reduce((sum, record) => sum + record.overtimeHours, 0);
    const totalDeductions = filtered.reduce((sum, record) => 
      sum + record.deductions.penaltyAmount + record.deductions.advanceDeductions + record.deductions.otherDeductions, 0
    );

    return {
      totalPayroll,
      avgSalary,
      totalOvertime,
      totalDeductions,
      processedCount: filtered.filter(r => r.status === 'processed' || r.status === 'paid').length,
      pendingCount: filtered.filter(r => r.status === 'pending').length
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage salary processing and payroll records" : "View your salary and payslips"}
          </p>
        </div>
        
        {adminMode && (
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowConfigModal(true)} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Salary Config
            </Button>
            
            <Button onClick={() => setShowProcessModal(true)}>
              <Calculator className="w-4 h-4 mr-2" />
              Process Payroll
            </Button>
            
            <Button onClick={() => exportPayroll('csv')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPayroll)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.avgSalary)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Overtime</p>
                <p className="text-2xl font-bold">{stats.totalOvertime}h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deductions</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDeductions)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold text-green-600">{stats.processedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {adminMode && (
              <div>
                <Label>Guard</Label>
                <Select value={selectedGuard} onValueChange={setSelectedGuard}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Guards</SelectItem>
                    {salaryConfigs.map(config => (
                      <SelectItem key={config.guardId} value={config.guardId}>
                        {config.guardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {record.guardName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{record.guardName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.year, parseInt(record.month.split('-')[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.toUpperCase()}
                  </Badge>
                  
                  {adminMode && record.status === 'processed' && (
                    <Button
                      onClick={() => markAsPaid(record.id)}
                      size="sm"
                      variant="outline"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => exportPayroll('pdf')}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Payslip
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Earnings */}
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Salary:</span>
                      <span>{formatCurrency(record.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime ({record.overtimeHours}h):</span>
                      <span>{formatCurrency(record.overtimeAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Shift ({record.nightShiftHours}h):</span>
                      <span>{formatCurrency(record.nightShiftAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend ({record.weekendHours}h):</span>
                      <span>{formatCurrency(record.weekendAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holiday ({record.holidayHours}h):</span>
                      <span>{formatCurrency(record.holidayAmount)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Earnings:</span>
                        <span>{formatCurrency(
                          record.baseSalary + 
                          record.overtimeAmount + 
                          record.nightShiftAmount + 
                          record.weekendAmount + 
                          record.holidayAmount
                        )}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deductions */}
                <div>
                  <h4 className="font-medium mb-3 text-red-600">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Absent Days ({record.deductions.absentDays}):</span>
                      <span>{formatCurrency(record.deductions.absentDays * (record.baseSalary / 26))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Penalty ({record.deductions.lateDays}):</span>
                      <span>{formatCurrency(record.deductions.penaltyAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance Deductions:</span>
                      <span>{formatCurrency(record.deductions.advanceDeductions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions:</span>
                      <span>{formatCurrency(record.deductions.otherDeductions)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Deductions:</span>
                        <span>{formatCurrency(
                          record.deductions.penaltyAmount + 
                          record.deductions.advanceDeductions + 
                          record.deductions.otherDeductions +
                          (record.deductions.absentDays * (record.baseSalary / 26))
                        )}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Summary */}
                <div>
                  <h4 className="font-medium mb-3">Summary</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(record.netSalary)}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Salary</div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {record.processedAt && (
                        <div>Processed: {new Date(record.processedAt).toLocaleDateString()}</div>
                      )}
                      {record.paidAt && (
                        <div>Paid: {new Date(record.paidAt).toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1 text-center p-2 bg-green-50 rounded">
                        <div className="text-xs text-muted-foreground">Working Days</div>
                        <div className="font-medium">
                          {record.deductions.absentDays > 0 ? 26 - record.deductions.absentDays : 26}/26
                        </div>
                      </div>
                      <div className="flex-1 text-center p-2 bg-blue-50 rounded">
                        <div className="text-xs text-muted-foreground">Overtime</div>
                        <div className="font-medium">{record.overtimeHours}h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Payroll Records Found</h3>
              <p className="text-muted-foreground mb-4">
                No payroll records found for the selected period.
              </p>
              {adminMode && (
                <Button onClick={() => setShowProcessModal(true)}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Process Payroll
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Process Payroll</CardTitle>
              <CardDescription>
                Process payroll for {selectedGuard === 'all' ? 'all guards' : 'selected guard'} 
                for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will calculate salaries based on attendance data and generate payroll records. 
                  Make sure all attendance data is up to date before proceeding.
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processPayroll}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4 mr-2" />
                  )}
                  {isProcessing ? 'Processing...' : 'Process Payroll'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Salary Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Salary Configuration</CardTitle>
              <CardDescription>Configure salary settings for guards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="guardSelect">Guard</Label>
                <Select 
                  value={newConfig.guardId} 
                  onValueChange={(value) => setNewConfig(prev => ({ ...prev, guardId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select guard" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryConfigs.map(config => (
                      <SelectItem key={config.guardId} value={config.guardId}>
                        {config.guardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="baseSalary">Base Salary (₹)</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={newConfig.baseSalary}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, baseSalary: parseFloat(e.target.value) }))}
                  placeholder="Enter base salary"
                />
              </div>
              
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={newConfig.hourlyRate}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
                  placeholder="Enter hourly rate"
                />
              </div>
              
              <div>
                <Label htmlFor="overtimeRate">Overtime Multiplier</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.1"
                  value={newConfig.overtimeRate}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, overtimeRate: parseFloat(e.target.value) }))}
                  placeholder="1.5"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="nightShift">Night Shift</Label>
                  <Input
                    id="nightShift"
                    type="number"
                    value={newConfig.nightShiftAllowance}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, nightShiftAllowance: parseFloat(e.target.value) }))}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="weekend">Weekend</Label>
                  <Input
                    id="weekend"
                    type="number"
                    value={newConfig.weekendAllowance}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, weekendAllowance: parseFloat(e.target.value) }))}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="holiday">Holiday</Label>
                  <Input
                    id="holiday"
                    type="number"
                    value={newConfig.holidayAllowance}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, holidayAllowance: parseFloat(e.target.value) }))}
                    placeholder="500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Save configuration logic here
                    setShowConfigModal(false);
                    setNewConfig({
                      guardId: '',
                      baseSalary: 0,
                      hourlyRate: 0,
                      overtimeRate: 1.5,
                      nightShiftAllowance: 0,
                      weekendAllowance: 0,
                      holidayAllowance: 0
                    });
                  }}
                  className="flex-1"
                >
                  Save Config
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}