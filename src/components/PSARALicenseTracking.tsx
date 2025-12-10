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
  Shield, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Download,
  Eye,
  Bell
} from "lucide-react";

interface License {
  id: string;
  licenseNumber: string;
  state: string;
  licenseType: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
  renewalReminder: number;
  documentUrl?: string;
  authority: string;
  createdAt: string;
  updatedAt: string;
}

export default function PSARALicenseTracking() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    status: '',
  });

  useEffect(() => {
    fetchLicenses();
  }, [filters]);

  const fetchLicenses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/psara/licenses?${params}`);
      const data = await response.json();
      if (data.licenses) {
        setLicenses(data.licenses);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
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
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string, renewalReminder: number) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= renewalReminder;
  };

  const isLicenseExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getExpiringLicenses = () => {
    return licenses.filter(license => 
      license.status === 'active' && isLicenseExpiringSoon(license.expiryDate, license.renewalReminder)
    );
  };

  const getExpiredLicenses = () => {
    return licenses.filter(license => 
      license.status === 'active' && isLicenseExpired(license.expiryDate)
    );
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const expiringLicenses = getExpiringLicenses();
  const expiredLicenses = getExpiredLicenses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PSARA License Tracking</h1>
          <p className="text-gray-600 mt-2">
            Manage company license renewal reminders per state
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add License
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New License</DialogTitle>
              <DialogDescription>
                Register a new PSARA license with renewal tracking
              </DialogDescription>
            </DialogHeader>
            <LicenseForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                <p className="text-2xl font-bold">{licenses.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Licenses</p>
                <p className="text-2xl font-bold">
                  {licenses.filter(l => l.status === 'active').length}
                </p>
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
                <p className="text-2xl font-bold">{expiringLicenses.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">{expiredLicenses.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(expiringLicenses.length > 0 || expiredLicenses.length > 0) && (
        <div className="space-y-4">
          {expiredLicenses.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Attention:</strong> {expiredLicenses.length} license(s) have expired and need immediate renewal.
              </AlertDescription>
            </Alert>
          )}

          {expiringLicenses.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Bell className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Reminder:</strong> {expiringLicenses.length} license(s) are expiring soon and require renewal.
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
              <Label htmlFor="state">State</Label>
              <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Licenses</CardTitle>
          <CardDescription>
            All PSARA licenses with renewal tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {licenses.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No licenses found. Add your first PSARA license.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Number</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell className="font-medium">{license.licenseNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {license.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {license.licenseType === 'agency' ? 'Agency' : 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell>{license.authority}</TableCell>
                    <TableCell>{new Date(license.issuedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(license.expiryDate).toLocaleDateString()}</span>
                        {isLicenseExpiringSoon(license.expiryDate, license.renewalReminder) && (
                          <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
                        )}
                        {isLicenseExpired(license.expiryDate) && (
                          <Badge className="bg-red-100 text-red-800">Expired</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(license.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {license.documentUrl && (
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

// License Form Component
function LicenseForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    licenseNumber: '',
    state: '',
    licenseType: '',
    issuedDate: '',
    expiryDate: '',
    renewalReminder: '30',
    authority: '',
  });
  const [documentUrl, setDocumentUrl] = useState('');

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/psara/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          renewalReminder: parseInt(formData.renewalReminder),
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating license:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licenseNumber">License Number *</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="licenseType">License Type *</Label>
          <Select value={formData.licenseType} onValueChange={(value) => setFormData({ ...formData, licenseType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agency">Agency License</SelectItem>
              <SelectItem value="individual">Individual License</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="authority">Issuing Authority *</Label>
          <Input
            id="authority"
            value={formData.authority}
            onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="issuedDate">Issued Date *</Label>
          <Input
            id="issuedDate"
            type="date"
            value={formData.issuedDate}
            onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
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
      </div>
      <div>
        <Label>License Document</Label>
        <FileUpload guardId="license-tracking" onUploadComplete={(document) => setDocumentUrl(document.fileUrl)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">Create License</Button>
      </div>
    </form>
  );
}