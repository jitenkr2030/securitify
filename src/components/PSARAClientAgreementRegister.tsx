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
import FileUpload from "@/components/FileUpload";
import { 
  FileText, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Download,
  Eye,
  AlertTriangle,
  Bell
} from "lucide-react";

interface ClientAgreement {
  id: string;
  agreementNumber: string;
  clientName: string;
  clientAddress?: string;
  clientContact?: string;
  startDate: string;
  endDate: string;
  agreementType: string;
  services: string[];
  terms?: string;
  value?: number;
  renewalReminder: number;
  status: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PSARAClientAgreementRegister() {
  const [agreements, setAgreements] = useState<ClientAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    agreementType: '',
  });

  useEffect(() => {
    fetchAgreements();
  }, [filters]);

  const fetchAgreements = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.agreementType) params.append('agreementType', filters.agreementType);

      const response = await fetch(`/api/psara/client-agreements?${params}`);
      const data = await response.json();
      if (data.agreements) {
        setAgreements(data.agreements.map(agreement => ({
          ...agreement,
          services: JSON.parse(agreement.services || '[]')
        })));
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-100 text-gray-800">Terminated</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getAgreementTypeBadge = (agreementType: string) => {
    switch (agreementType) {
      case 'service':
        return <Badge className="bg-blue-100 text-blue-800">Service</Badge>;
      case 'manpower':
        return <Badge className="bg-purple-100 text-purple-800">Manpower</Badge>;
      case 'equipment':
        return <Badge className="bg-orange-100 text-orange-800">Equipment</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{agreementType}</Badge>;
    }
  };

  const isAgreementExpiringSoon = (endDate: string, renewalReminder: number) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= renewalReminder;
  };

  const isAgreementExpired = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  };

  const getExpiringAgreements = () => {
    return agreements.filter(agreement => 
      agreement.status === 'active' && isAgreementExpiringSoon(agreement.endDate, agreement.renewalReminder)
    );
  };

  const getExpiredAgreements = () => {
    return agreements.filter(agreement => 
      agreement.status === 'active' && isAgreementExpired(agreement.endDate)
    );
  };

  const getAgreementStats = () => {
    const total = agreements.length;
    const active = agreements.filter(a => a.status === 'active').length;
    const expiring = getExpiringAgreements().length;
    const expired = getExpiredAgreements().length;
    const totalValue = agreements.reduce((sum, a) => sum + (a.value || 0), 0);

    return { total, active, expiring, expired, totalValue };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getAgreementStats();
  const expiringAgreements = getExpiringAgreements();
  const expiredAgreements = getExpiredAgreements();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA Client Agreement Register</h1>
          <p className="text-gray-600 mt-2">
            Track MoUs and agreements with expiry alerts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Agreement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Agreement</DialogTitle>
              <DialogDescription>
                Create a new client agreement with PSARA compliance tracking
              </DialogDescription>
            </DialogHeader>
            <AgreementForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agreements</p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiring}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(expiringAgreements.length > 0 || expiredAgreements.length > 0) && (
        <div className="space-y-4">
          {expiredAgreements.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Attention:</strong> {expiredAgreements.length} agreement(s) have expired and need renewal.
              </AlertDescription>
            </Alert>
          )}

          {expiringAgreements.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Bell className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Reminder:</strong> {expiringAgreements.length} agreement(s) are expiring soon and require attention.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agreementType">Agreement Type</Label>
              <Select value={filters.agreementType} onValueChange={(value) => setFilters({ ...filters, agreementType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="manpower">Manpower</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Agreements</CardTitle>
          <CardDescription>
            All client agreements with expiry tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agreements.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No agreements found. Add your first client agreement.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agreement #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium">{agreement.agreementNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agreement.clientName}</div>
                        {agreement.clientContact && (
                          <div className="text-sm text-gray-500">{agreement.clientContact}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getAgreementTypeBadge(agreement.agreementType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div>{new Date(agreement.startDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            to {new Date(agreement.endDate).toLocaleDateString()}
                            {isAgreementExpiringSoon(agreement.endDate, agreement.renewalReminder) && (
                              <Badge className="ml-2 bg-orange-100 text-orange-800">Expiring Soon</Badge>
                            )}
                            {isAgreementExpired(agreement.endDate) && (
                              <Badge className="ml-2 bg-red-100 text-red-800">Expired</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {agreement.value ? (
                        <span className="font-medium">₹{agreement.value.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {agreement.services.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {agreement.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {agreement.services.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{agreement.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No services</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {agreement.documentUrl && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
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

// Agreement Form Component
function AgreementForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    agreementNumber: '',
    clientName: '',
    clientAddress: '',
    clientContact: '',
    startDate: '',
    endDate: '',
    agreementType: '',
    services: [] as string[],
    terms: '',
    value: '',
    renewalReminder: '30',
  });
  const [documentUrl, setDocumentUrl] = useState('');
  const [customService, setCustomService] = useState('');

  const serviceOptions = [
    'Security Guard Services',
    'Armed Guard Services',
    'Event Security',
    'VIP Protection',
    'CCTV Monitoring',
    'Access Control',
    'Patrol Services',
    'Fire Safety',
    'First Aid Services',
    'Crowd Control',
    'Traffic Management',
    'Emergency Response'
  ];

  const addService = () => {
    if (customService && !formData.services.includes(customService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, customService]
      }));
      setCustomService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/client-agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: formData.value ? parseFloat(formData.value) : null,
          renewalReminder: parseInt(formData.renewalReminder),
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating agreement:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="agreementNumber">Agreement Number *</Label>
          <Input
            id="agreementNumber"
            value={formData.agreementNumber}
            onChange={(e) => setFormData({ ...formData, agreementNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientAddress">Client Address</Label>
          <Input
            id="clientAddress"
            value={formData.clientAddress}
            onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="clientContact">Client Contact</Label>
          <Input
            id="clientContact"
            value={formData.clientContact}
            onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="agreementType">Agreement Type *</Label>
          <Select value={formData.agreementType} onValueChange={(value) => setFormData({ ...formData, agreementType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select agreement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Service Agreement</SelectItem>
              <SelectItem value="manpower">Manpower Supply</SelectItem>
              <SelectItem value="equipment">Equipment Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Contract Value</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="renewalReminder">Renewal Reminder (days) *</Label>
        <Input
          id="renewalReminder"
          type="number"
          min="1"
          max="365"
          value={formData.renewalReminder}
          onChange={(e) => setFormData({ ...formData, renewalReminder: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Services *</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={customService} onValueChange={setCustomService}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addService} disabled={!customService}>
              Add
            </Button>
          </div>
          {formData.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeService(service)}>
                  {service} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="terms">Terms and Conditions</Label>
        <Input
          id="terms"
          value={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
        />
      </div>
      <div>
        <Label>Agreement Document</Label>
        <FileUpload guardId="client-agreement" onUploadComplete={(document) => setDocumentUrl(document.fileUrl)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={formData.services.length === 0}>
          Create Agreement
        </Button>
      </div>
    </form>
  );
}