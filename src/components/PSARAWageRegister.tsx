"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Download,
  FileText,
  Filter
} from "lucide-react";

interface WageRegister {
  id: string;
  month: string;
  year: number;
  basicWages: number;
  overtimeHours: number;
  overtimeWages: number;
  deductions: number;
  netWages: number;
  paymentDate?: string;
  paymentMode?: string;
  utrNumber?: string;
  status: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  guard: {
    id: string;
    name: string;
    phone: string;
    salary: number;
  };
}

export default function PSARAWageRegister() {
  const [wageRegisters, setWageRegisters] = useState<WageRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    guardId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    status: '',
  });

  useEffect(() => {
    fetchWageRegisters();
  }, [filters]);

  const fetchWageRegisters = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/psara/wage-register?${params}`);
      const data = await response.json();
      if (data.wageRegisters) {
        setWageRegisters(data.wageRegisters);
      }
    } catch (error) {
      console.error('Error fetching wage registers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPaymentModeBadge = (paymentMode?: string) => {
    if (!paymentMode) return <span className="text-gray-400">-</span>;
    
    switch (paymentMode) {
      case 'cash':
        return <Badge className="bg-green-100 text-green-800">Cash</Badge>;
      case 'bank_transfer':
        return <Badge className="bg-blue-100 text-blue-800">Bank Transfer</Badge>;
      case 'cheque':
        return <Badge className="bg-purple-100 text-purple-800">Cheque</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{paymentMode}</Badge>;
    }
  };

  const getWageStats = () => {
    const total = wageRegisters.length;
    const paid = wageRegisters.filter(r => r.status === 'paid').length;
    const pending = wageRegisters.filter(r => r.status === 'pending').length;
    const totalWages = wageRegisters.reduce((sum, r) => sum + r.netWages, 0);

    return { total, paid, pending, totalWages };
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    alert('PDF export functionality would be implemented here');
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getWageStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Wage Register</h1>
          <p className="text-gray-600 mt-2">
            Maintain payroll as per PSARA requirements with inspection-ready reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Wage Register
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Wage Register</DialogTitle>
                <DialogDescription>
                  Create a new wage register entry as per PSARA requirements
                </DialogDescription>
              </DialogHeader>
              <WageRegisterForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wages</p>
                <p className="text-2xl font-bold">₹{stats.totalWages.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Select value={filters.month} onValueChange={(value) => setFilters({ ...filters, month: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString().padStart(2, '0')}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wage Registers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Wage Registers</CardTitle>
          <CardDescription>
            PSARA-compliant wage register entries ready for inspection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wageRegisters.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No wage register entries found. Add your first entry.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guard</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Basic Wages</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Wages</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wageRegisters.map((register) => (
                  <TableRow key={register.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{register.guard.name}</div>
                        <div className="text-sm text-gray-500">{register.guard.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{months[parseInt(register.month) - 1]} {register.year}</span>
                      </div>
                    </TableCell>
                    <TableCell>₹{register.basicWages.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{register.overtimeHours} hours</div>
                        <div className="text-green-600">₹{register.overtimeWages.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">-₹{register.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{register.netWages.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{getPaymentModeBadge(register.paymentMode)}</div>
                        {register.paymentDate && (
                          <div className="text-gray-500">
                            {new Date(register.paymentDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(register.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
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
    </div>
  );
}

// Wage Register Form Component
function WageRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    guardId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    basicWages: '',
    overtimeHours: '',
    overtimeWages: '',
    deductions: '',
    netWages: '',
    paymentDate: '',
    paymentMode: '',
    utrNumber: '',
    remarks: '',
  });
  const [guards, setGuards] = useState<any[]>([]);

  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    try {
      const response = await fetch('/api/guards');
      const data = await response.json();
      if (data.guards) {
        setGuards(data.guards);
      }
    } catch (error) {
      console.error('Error fetching guards:', error);
    }
  };

  const calculateNetWages = () => {
    const basic = parseFloat(formData.basicWages) || 0;
    const overtime = parseFloat(formData.overtimeWages) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return (basic + overtime - deductions).toFixed(2);
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      netWages: calculateNetWages()
    }));
  }, [formData.basicWages, formData.overtimeWages, formData.deductions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/wage-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basicWages: parseFloat(formData.basicWages),
          overtimeHours: parseInt(formData.overtimeHours) || 0,
          overtimeWages: parseFloat(formData.overtimeWages) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          netWages: parseFloat(formData.netWages),
          year: parseInt(formData.year),
          paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating wage register:', error);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guardId">Guard *</Label>
          <Select value={formData.guardId} onValueChange={(value) => setFormData({ ...formData, guardId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select guard" />
            </SelectTrigger>
            <SelectContent>
              {guards.map((guard) => (
                <SelectItem key={guard.id} value={guard.id}>
                  {guard.name} (₹{guard.salary.toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="month">Month *</Label>
          <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString().padStart(2, '0')}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            type="number"
            min="2020"
            max="2030"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="basicWages">Basic Wages *</Label>
          <Input
            id="basicWages"
            type="number"
            min="0"
            step="0.01"
            value={formData.basicWages}
            onChange={(e) => setFormData({ ...formData, basicWages: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="overtimeHours">Overtime Hours</Label>
          <Input
            id="overtimeHours"
            type="number"
            min="0"
            value={formData.overtimeHours}
            onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="overtimeWages">Overtime Wages</Label>
          <Input
            id="overtimeWages"
            type="number"
            min="0"
            step="0.01"
            value={formData.overtimeWages}
            onChange={(e) => setFormData({ ...formData, overtimeWages: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="deductions">Deductions</Label>
          <Input
            id="deductions"
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions}
            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="netWages">Net Wages</Label>
          <Input
            id="netWages"
            type="number"
            min="0"
            step="0.01"
            value={formData.netWages}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="paymentMode">Payment Mode</Label>
          <Select value={formData.paymentMode} onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="utrNumber">UTR Number</Label>
          <Input
            id="utrNumber"
            value={formData.utrNumber}
            onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
          />
        </div>
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
        <Button type="submit">Create Wage Register</Button>
      </div>
    </form>
  );
}