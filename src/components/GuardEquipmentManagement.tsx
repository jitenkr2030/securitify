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
  Shield, 
  Smartphone, 
  Radio, 
  Flashlight, 
  Watch,
  Camera,
  Key,
  Badge as BadgeIcon,
  Clipboard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Settings,
  Wrench,
  Battery,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: 'uniform' | 'device' | 'weapon' | 'vehicle' | 'tool' | 'accessory';
  category: string;
  description: string;
  serialNumber?: string;
  brand: string;
  model: string;
  purchaseDate: string;
  purchasePrice: number;
  expectedLifespan: number; // in months
  status: 'available' | 'assigned' | 'maintenance' | 'retired' | 'lost' | 'damaged';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance?: string;
  nextMaintenance?: string;
  location?: string;
  notes?: string;
}

interface EquipmentAssignment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  guardId: string;
  guardName: string;
  assignedAt: string;
  expectedReturn?: string;
  returnedAt?: string;
  conditionAssigned: string;
  conditionReturned?: string;
  notes?: string;
  status: 'active' | 'returned' | 'overdue' | 'damaged';
}

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'scheduled' | 'repair' | 'inspection' | 'cleaning';
  description: string;
  performedBy: string;
  performedAt: string;
  cost: number;
  status: 'completed' | 'pending' | 'in_progress' | 'cancelled';
  nextMaintenance?: string;
  notes?: string;
}

interface EquipmentUsage {
  id: string;
  equipmentId: string;
  equipmentName: string;
  guardId: string;
  guardName: string;
  usageDate: string;
  duration: number; // in hours
  purpose: string;
  conditionBefore: string;
  conditionAfter: string;
  issues?: string;
  fuelConsumed?: number; // for vehicles
  mileage?: number; // for vehicles
}

interface GuardEquipmentManagementProps {
  guardId: string;
  guardName: string;
  adminMode?: boolean;
}

export default function GuardEquipmentManagement({ 
  guardId, 
  guardName, 
  adminMode = false 
}: GuardEquipmentManagementProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [assignments, setAssignments] = useState<EquipmentAssignment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [usageRecords, setUsageRecords] = useState<EquipmentUsage[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockEquipment: Equipment[] = [
      {
        id: 'eq1',
        name: 'Security Uniform',
        type: 'uniform',
        category: 'Clothing',
        description: 'Standard security guard uniform',
        brand: 'SecurityWear',
        model: 'Standard Issue',
        purchaseDate: '2024-01-01',
        purchasePrice: 2500,
        expectedLifespan: 12,
        status: 'assigned',
        condition: 'good',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15'
      },
      {
        id: 'eq2',
        name: 'Radio Communication',
        type: 'device',
        category: 'Communication',
        description: 'Two-way radio for communication',
        brand: 'Motorola',
        model: 'CP200d',
        purchaseDate: '2023-06-01',
        purchasePrice: 15000,
        expectedLifespan: 36,
        status: 'assigned',
        condition: 'excellent',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-04-10'
      },
      {
        id: 'eq3',
        name: 'Flashlight',
        type: 'tool',
        category: 'Equipment',
        description: 'High-powered LED flashlight',
        brand: 'Maglite',
        model: 'ML300L',
        purchaseDate: '2023-09-01',
        purchasePrice: 2500,
        expectedLifespan: 24,
        status: 'assigned',
        condition: 'good',
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-07-05'
      },
      {
        id: 'eq4',
        name: 'Security Badge',
        type: 'accessory',
        category: 'Identification',
        description: 'Official security identification badge',
        brand: 'IDCorp',
        model: 'Standard',
        purchaseDate: '2024-01-01',
        purchasePrice: 500,
        expectedLifespan: 12,
        status: 'assigned',
        condition: 'excellent'
      },
      {
        id: 'eq5',
        name: 'Patrol Vehicle',
        type: 'vehicle',
        category: 'Transportation',
        description: 'Security patrol vehicle',
        brand: 'Maruti',
        model: 'Swift',
        purchaseDate: '2023-03-01',
        purchasePrice: 500000,
        expectedLifespan: 60,
        status: 'available',
        condition: 'good',
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-04-20'
      }
    ];

    const mockAssignments: EquipmentAssignment[] = [
      {
        id: 'assign1',
        equipmentId: 'eq1',
        equipmentName: 'Security Uniform',
        guardId,
        guardName,
        assignedAt: '2024-01-01',
        expectedReturn: '2024-12-31',
        conditionAssigned: 'excellent',
        status: 'active'
      },
      {
        id: 'assign2',
        equipmentId: 'eq2',
        equipmentName: 'Radio Communication',
        guardId,
        guardName,
        assignedAt: '2024-01-01',
        expectedReturn: '2024-12-31',
        conditionAssigned: 'excellent',
        status: 'active'
      },
      {
        id: 'assign3',
        equipmentId: 'eq3',
        equipmentName: 'Flashlight',
        guardId,
        guardName,
        assignedAt: '2024-01-01',
        expectedReturn: '2024-12-31',
        conditionAssigned: 'good',
        status: 'active'
      },
      {
        id: 'assign4',
        equipmentId: 'eq4',
        equipmentName: 'Security Badge',
        guardId,
        guardName,
        assignedAt: '2024-01-01',
        expectedReturn: '2024-12-31',
        conditionAssigned: 'excellent',
        status: 'active'
      }
    ];

    const mockMaintenance: MaintenanceRecord[] = [
      {
        id: 'maint1',
        equipmentId: 'eq2',
        equipmentName: 'Radio Communication',
        type: 'scheduled',
        description: 'Routine maintenance and battery check',
        performedBy: 'Tech Support',
        performedAt: '2024-01-10',
        cost: 500,
        status: 'completed',
        nextMaintenance: '2024-04-10',
        notes: 'Battery replaced, all functions working'
      },
      {
        id: 'maint2',
        equipmentId: 'eq5',
        equipmentName: 'Patrol Vehicle',
        type: 'scheduled',
        description: 'Vehicle service and oil change',
        performedBy: 'Auto Garage',
        performedAt: '2024-01-20',
        cost: 3000,
        status: 'completed',
        nextMaintenance: '2024-04-20',
        notes: 'Oil changed, tires rotated, brakes checked'
      }
    ];

    const mockUsage: EquipmentUsage[] = [
      {
        id: 'usage1',
        equipmentId: 'eq5',
        equipmentName: 'Patrol Vehicle',
        guardId,
        guardName,
        usageDate: '2024-01-25',
        duration: 8,
        purpose: 'Night patrol duty',
        conditionBefore: 'good',
        conditionAfter: 'good',
        fuelConsumed: 5.2,
        mileage: 80
      },
      {
        id: 'usage2',
        equipmentId: 'eq2',
        equipmentName: 'Radio Communication',
        guardId,
        guardName,
        usageDate: '2024-01-25',
        duration: 8,
        purpose: 'Shift communication',
        conditionBefore: 'excellent',
        conditionAfter: 'excellent'
      }
    ];

    setEquipment(mockEquipment);
    setAssignments(mockAssignments);
    setMaintenanceRecords(mockMaintenance);
    setUsageRecords(mockUsage);
  }, [guardId, guardName]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'retired': return 'bg-gray-500';
      case 'lost': return 'bg-red-500';
      case 'damaged': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'returned': return 'bg-gray-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'uniform': return <Shield className="w-5 h-5" />;
      case 'device': return <Smartphone className="w-5 h-5" />;
      case 'weapon': return <Radio className="w-5 h-5" />;
      case 'vehicle': return <Key className="w-5 h-5" />;
      case 'tool': return <Wrench className="w-5 h-5" />;
      case 'accessory': return <BadgeIcon className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getEquipmentAge = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - purchase.getFullYear()) * 12 + (now.getMonth() - purchase.getMonth());
    return monthsDiff;
  };

  const getEquipmentHealth = (equip: Equipment) => {
    const age = getEquipmentAge(equip.purchaseDate);
    const agePercentage = (age / equip.expectedLifespan) * 100;
    
    let conditionScore = 0;
    switch (equip.condition) {
      case 'excellent': conditionScore = 100; break;
      case 'good': conditionScore = 80; break;
      case 'fair': conditionScore = 60; break;
      case 'poor': conditionScore = 40; break;
    }
    
    const healthScore = conditionScore - (agePercentage * 0.5);
    return Math.max(0, Math.min(100, healthScore));
  };

  const assignedEquipment = assignments.filter(a => a.status === 'active').length;
  const totalEquipmentValue = equipment.reduce((sum, eq) => sum + eq.purchasePrice, 0);
  const assignedValue = assignments
    .filter(a => a.status === 'active')
    .reduce((sum, a) => {
      const eq = equipment.find(e => e.id === a.equipmentId);
      return sum + (eq?.purchasePrice || 0);
    }, 0);
  const maintenanceDue = equipment.filter(eq => 
    eq.nextMaintenance && new Date(eq.nextMaintenance) <= new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Equipment Management</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage guard equipment assignments" : "Your assigned equipment"}
          </p>
        </div>
        
        {adminMode && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        )}
      </div>

      {/* Equipment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned Items</p>
                <p className="text-2xl font-bold">{assignedEquipment}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₹{(assignedValue / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Due</p>
                <p className="text-2xl font-bold text-orange-600">{maintenanceDue}</p>
              </div>
              <Wrench className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Equipment Health</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned Equipment</TabsTrigger>
          <TabsTrigger value="available">Available Equipment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {/* Assigned Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Currently Assigned Equipment</CardTitle>
              <CardDescription>
                Equipment currently assigned to {guardName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {assignments
                  .filter(a => a.status === 'active')
                  .map((assignment) => {
                    const equip = equipment.find(e => e.id === assignment.equipmentId);
                    if (!equip) return null;
                    
                    const health = getEquipmentHealth(equip);
                    
                    return (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getTypeIcon(equip.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{equip.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {equip.brand} {equip.model} • {equip.category}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{equip.type}</Badge>
                                <Badge variant="secondary" className={`${getConditionColor(equip.condition)} text-white`}>
                                  {equip.condition}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Health</div>
                              <div className="font-medium">{Math.round(health)}%</div>
                            </div>
                            
                            <Button variant="outline" size="sm" onClick={() => setSelectedEquipment(equip)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Assigned:</span>
                            <div>{new Date(assignment.assignedAt).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Return:</span>
                            <div>{assignment.expectedReturn ? new Date(assignment.expectedReturn).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Value:</span>
                            <div>₹{equip.purchasePrice.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <div>{getEquipmentAge(equip.purchaseDate)} months</div>
                          </div>
                        </div>
                        
                        {assignment.notes && (
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-sm"><strong>Notes:</strong> {assignment.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {/* Available Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Available Equipment</CardTitle>
              <CardDescription>
                Equipment available for assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {equipment
                  .filter(eq => eq.status === 'available')
                  .map((equip) => {
                    const health = getEquipmentHealth(equip);
                    
                    return (
                      <div key={equip.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              {getTypeIcon(equip.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{equip.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {equip.brand} {equip.model} • {equip.category}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{equip.type}</Badge>
                                <Badge variant="secondary" className={`${getConditionColor(equip.condition)} text-white`}>
                                  {equip.condition}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Health</div>
                              <div className="font-medium">{Math.round(health)}%</div>
                            </div>
                            
                            {adminMode && (
                              <Button size="sm">
                                Assign
                              </Button>
                            )}
                            
                            <Button variant="outline" size="sm" onClick={() => setSelectedEquipment(equip)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div>{equip.location || 'Storage'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Value:</span>
                            <div>₹{equip.purchasePrice.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <div>{getEquipmentAge(equip.purchaseDate)} months</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Next Maintenance:</span>
                            <div>{equip.nextMaintenance ? new Date(equip.nextMaintenance).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Records */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Records</CardTitle>
                  <CardDescription>
                    Equipment maintenance history and upcoming schedules
                  </CardDescription>
                </div>
                {adminMode && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.equipmentName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {record.type} • {record.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{record.type}</Badge>
                            <Badge variant="secondary" className={`${getStatusColor(record.status)} text-white`}>
                              {record.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Cost</div>
                          <div className="font-medium">₹{record.cost.toLocaleString()}</div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Performed By:</span>
                        <div>{record.performedBy}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <div>{new Date(record.performedAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Maintenance:</span>
                        <div>{record.nextMaintenance ? new Date(record.nextMaintenance).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div>{record.type === 'scheduled' ? 'Routine' : 'As needed'}</div>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <div className="bg-yellow-50 rounded p-2">
                        <p className="text-sm"><strong>Notes:</strong> {record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          {/* Usage History */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Usage History</CardTitle>
              <CardDescription>
                Historical usage of equipment by {guardName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageRecords.map((usage) => (
                  <div key={usage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(equipment.find(eq => eq.id === usage.equipmentId)?.type || 'tool')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{usage.equipmentName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {usage.purpose} • {usage.duration} hours
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{new Date(usage.usageDate).toLocaleDateString()}</Badge>
                            <Badge variant="secondary" className={`${getConditionColor(usage.conditionAfter)} text-white`}>
                              After: {usage.conditionAfter}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Condition Change</div>
                          <div className="font-medium">{usage.conditionBefore} → {usage.conditionAfter}</div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div>{usage.duration} hours</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Purpose:</span>
                        <div>{usage.purpose}</div>
                      </div>
                      {usage.fuelConsumed && (
                        <div>
                          <span className="text-muted-foreground">Fuel:</span>
                          <div>{usage.fuelConsumed}L</div>
                        </div>
                      )}
                      {usage.mileage && (
                        <div>
                          <span className="text-muted-foreground">Mileage:</span>
                          <div>{usage.mileage} km</div>
                        </div>
                      )}
                    </div>
                    
                    {usage.issues && (
                      <div className="bg-red-50 rounded p-2">
                        <p className="text-sm"><strong>Issues Reported:</strong> {usage.issues}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Equipment Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['uniform', 'device', 'tool', 'accessory'].map(type => {
                    const count = equipment.filter(eq => eq.type === type).length;
                    const assigned = assignments.filter(a => 
                      a.status === 'active' && equipment.find(eq => eq.id === a.equipmentId)?.type === type
                    ).length;
                    
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{assigned}/{count}</span>
                          <Progress value={(assigned / count) * 100} className="w-20" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipment Health Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['excellent', 'good', 'fair', 'poor'].map(condition => {
                    const count = equipment.filter(eq => eq.condition === condition).length;
                    const percentage = (count / equipment.length) * 100;
                    
                    return (
                      <div key={condition} className="flex justify-between items-center">
                        <span className="capitalize">{condition}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{count}</span>
                          <Progress value={percentage} className="w-20" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {equipment
                  .filter(eq => eq.nextMaintenance)
                  .sort((a, b) => new Date(a.nextMaintenance!).getTime() - new Date(b.nextMaintenance!).getTime())
                  .slice(0, 5)
                  .map(eq => (
                    <div key={eq.id} className="flex justify-between items-center">
                      <span>{eq.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(eq.nextMaintenance!).toLocaleDateString()}
                        </span>
                        {new Date(eq.nextMaintenance!) <= new Date() && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}