"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Shield, 
  Clock,
  Users,
  Activity,
  Settings,
  Bell,
  BellOff,
  Radio,
  Wifi,
  WifiOff,
  Zap,
  Battery
} from "lucide-react";
import LiveMapWrapper from "@/components/LiveMapWrapper";

interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  postId: string;
  postName: string;
  isActive: boolean;
  alertTypes: string[];
  schedule: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface GeofenceAlert {
  id: string;
  type: string;
  message: string;
  severity: string;
  guardName: string;
  guardPhoto?: string;
  geofenceName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface GeofenceAnalytics {
  geofenceId: string;
  geofenceName: string;
  totalBreaches: number;
  activeBreaches: number;
  averageResponseTime: number;
  mostActiveGuard: string;
  breachTrend: 'increasing' | 'decreasing' | 'stable';
  lastBreach: string;
}

export default function AdvancedGeofencing() {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [analytics, setAnalytics] = useState<GeofenceAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);
  const [alertFilter, setAlertFilter] = useState("all");
  const [geofenceFilter, setGeofenceFilter] = useState("all");
  
  const [newGeofence, setNewGeofence] = useState({
    name: "",
    latitude: 28.6139,
    longitude: 77.2090,
    radius: 100,
    postId: "",
    alertTypes: ["entry", "exit"],
    schedule: {
      enabled: false,
      startTime: "09:00",
      endTime: "18:00",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  });

  useEffect(() => {
    fetchGeofenceData();
  }, []);

  const fetchGeofenceData = async () => {
    try {
      // Fetch geofences from API
      const geofencesResponse = await fetch('/api/geofences');
      if (geofencesResponse.ok) {
        const geofencesData = await geofencesResponse.json();
        setGeofences(geofencesData);
      }

      // Fetch geofence alerts from API
      const alertsResponse = await fetch('/api/geofences/alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      }

      // Fetch geofence analytics from API
      const analyticsResponse = await fetch('/api/geofences/analytics');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching geofence data:", error);
      // Fallback to mock data for demonstration
      const mockGeofences: Geofence[] = [
        {
          id: "1",
          name: "Main Gate Perimeter",
          latitude: 28.6139,
          longitude: 77.2090,
          radius: 150,
          postId: "1",
          postName: "Main Gate",
          isActive: true,
          alertTypes: ["entry", "exit", "loitering"],
          schedule: {
            enabled: true,
            startTime: "00:00",
            endTime: "23:59",
            days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
          },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z"
        },
        {
          id: "2",
          name: "Parking Area Zone",
          latitude: 28.6140,
          longitude: 77.2091,
          radius: 200,
          postId: "2",
          postName: "Parking Area",
          isActive: true,
          alertTypes: ["entry", "exit"],
          schedule: {
            enabled: true,
            startTime: "08:00",
            endTime: "20:00",
            days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
          },
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-10T14:00:00Z"
        },
        {
          id: "3",
          name: "Building A Restricted",
          latitude: 28.6141,
          longitude: 77.2092,
          radius: 50,
          postId: "3",
          postName: "Building A",
          isActive: true,
          alertTypes: ["entry", "loitering"],
          schedule: {
            enabled: true,
            startTime: "09:00",
            endTime: "17:00",
            days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
          },
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-12T09:00:00Z"
        }
      ];

      const mockAlerts: GeofenceAlert[] = [
        {
          id: "1",
          type: "exit",
          message: "Guard Rajesh Kumar exited Main Gate Perimeter",
          severity: "high",
          guardName: "Rajesh Kumar",
          guardPhoto: "/api/placeholder/40/40",
          geofenceName: "Main Gate Perimeter",
          latitude: 28.6139,
          longitude: 77.2090,
          timestamp: "2024-01-20T10:30:00Z",
          isResolved: false
        },
        {
          id: "2",
          type: "loitering",
          message: "Guard Suresh Patel loitering in Parking Area Zone",
          severity: "medium",
          guardName: "Suresh Patel",
          guardPhoto: "/api/placeholder/40/40",
          geofenceName: "Parking Area Zone",
          latitude: 28.6140,
          longitude: 77.2091,
          timestamp: "2024-01-20T11:15:00Z",
          isResolved: true,
          resolvedAt: "2024-01-20T11:30:00Z",
          resolvedBy: "Admin"
        },
        {
          id: "3",
          type: "entry",
          message: "Unauthorized entry detected in Building A Restricted",
          severity: "critical",
          guardName: "Unknown",
          geofenceName: "Building A Restricted",
          latitude: 28.6141,
          longitude: 77.2092,
          timestamp: "2024-01-20T12:00:00Z",
          isResolved: false
        }
      ];

      const mockAnalytics: GeofenceAnalytics[] = [
        {
          geofenceId: "1",
          geofenceName: "Main Gate Perimeter",
          totalBreaches: 45,
          activeBreaches: 3,
          averageResponseTime: 5.2,
          mostActiveGuard: "Rajesh Kumar",
          breachTrend: "decreasing",
          lastBreach: "2024-01-20T10:30:00Z"
        },
        {
          geofenceId: "2",
          geofenceName: "Parking Area Zone",
          totalBreaches: 23,
          activeBreaches: 1,
          averageResponseTime: 3.8,
          mostActiveGuard: "Suresh Patel",
          breachTrend: "stable",
          lastBreach: "2024-01-20T11:15:00Z"
        },
        {
          geofenceId: "3",
          geofenceName: "Building A Restricted",
          totalBreaches: 12,
          activeBreaches: 1,
          averageResponseTime: 2.1,
          mostActiveGuard: "Unknown",
          breachTrend: "increasing",
          lastBreach: "2024-01-20T12:00:00Z"
        }
      ];

      setGeofences(mockGeofences);
      setAlerts(mockAlerts);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = alertFilter === "all" || alert.type === alertFilter;
    const matchesGeofence = geofenceFilter === "all" || alert.geofenceName === geofenceFilter;
    return matchesType && matchesGeofence;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "entry": return <MapPin className="w-4 h-4" />;
      case "exit": return <Radio className="w-4 h-4" />;
      case "loitering": return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <span className="text-red-500">↑</span>;
      case "decreasing": return <span className="text-green-500">↓</span>;
      case "stable": return <span className="text-gray-500">→</span>;
      default: return <span className="text-gray-500">→</span>;
    }
  };

  const handleCreateGeofence = async () => {
    try {
      const response = await fetch('/api/geofences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGeofence.name,
          latitude: newGeofence.latitude,
          longitude: newGeofence.longitude,
          radius: newGeofence.radius,
          postId: newGeofence.postId,
          alertTypes: newGeofence.alertTypes,
          schedule: newGeofence.schedule,
        }),
      });

      if (response.ok) {
        const newGeofenceData = await response.json();
        setGeofences(prev => [...prev, newGeofenceData]);
        setIsCreateDialogOpen(false);
        setNewGeofence({
          name: "",
          latitude: 28.6139,
          longitude: 77.2090,
          radius: 100,
          postId: "",
          alertTypes: ["entry", "exit"],
          schedule: {
            enabled: false,
            startTime: "09:00",
            endTime: "18:00",
            days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
          }
        });
        // Refresh data
        fetchGeofenceData();
      } else {
        const error = await response.json();
        console.error("Error creating geofence:", error.error);
      }
    } catch (error) {
      console.error("Error creating geofence:", error);
    }
  };

  const handleToggleGeofence = async (geofenceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/geofences/${geofenceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setGeofences(prev => prev.map(geofence => 
          geofence.id === geofenceId 
            ? { ...geofence, isActive, updatedAt: new Date().toISOString() }
            : geofence
        ));
      } else {
        console.error("Error toggling geofence:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling geofence:", error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // Note: We need to create an API endpoint for resolving alerts
      // For now, we'll update the local state
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              isResolved: true, 
              resolvedAt: new Date().toISOString(),
              resolvedBy: "Admin"
            }
          : alert
      ));
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Geofences</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {geofences.filter(g => g.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {geofences.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => !a.isResolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.severity === "critical").length} critical
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Breaches</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, a) => sum + a.totalBreaches, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.reduce((sum, a) => sum + a.averageResponseTime, 0) / analytics.length)}s
            </div>
            <p className="text-xs text-muted-foreground">
              Response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Geofence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Geofence</DialogTitle>
                <DialogDescription>Define a new geofence zone with custom alert rules</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Geofence Name</Label>
                    <Input
                      id="name"
                      value={newGeofence.name}
                      onChange={(e) => setNewGeofence(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter geofence name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="post">Post</Label>
                    <Select 
                      value={newGeofence.postId} 
                      onValueChange={(value) => setNewGeofence(prev => ({ ...prev, postId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select post" />
                      </SelectTrigger>
                      <SelectContent>
                        {geofences.map(geofence => (
                          <SelectItem key={geofence.postId} value={geofence.postId}>
                            {geofence.postName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={newGeofence.latitude}
                      onChange={(e) => setNewGeofence(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      value={newGeofence.longitude}
                      onChange={(e) => setNewGeofence(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={newGeofence.radius}
                      onChange={(e) => setNewGeofence(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Radius: {newGeofence.radius}m</Label>
                  <Slider
                    value={[newGeofence.radius]}
                    onValueChange={(value) => setNewGeofence(prev => ({ ...prev, radius: value[0] }))}
                    max={1000}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Alert Types</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["entry", "exit", "loitering"].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={type}
                          checked={newGeofence.alertTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewGeofence(prev => ({ 
                                ...prev, 
                                alertTypes: [...prev.alertTypes, type] 
                              }));
                            } else {
                              setNewGeofence(prev => ({ 
                                ...prev, 
                                alertTypes: prev.alertTypes.filter(t => t !== type) 
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={type} className="text-sm capitalize">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="schedule"
                      checked={newGeofence.schedule.enabled}
                      onCheckedChange={(checked) => setNewGeofence(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, enabled: checked }
                      }))}
                    />
                    <Label htmlFor="schedule">Enable Schedule</Label>
                  </div>
                  
                  {newGeofence.schedule.enabled && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newGeofence.schedule.startTime}
                          onChange={(e) => setNewGeofence(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, startTime: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newGeofence.schedule.endTime}
                          onChange={(e) => setNewGeofence(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, endTime: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGeofence}>
                    Create Geofence
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={alertFilter} onValueChange={setAlertFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="entry">Entry</SelectItem>
              <SelectItem value="exit">Exit</SelectItem>
              <SelectItem value="loitering">Loitering</SelectItem>
            </SelectContent>
          </Select>
          <Select value={geofenceFilter} onValueChange={setGeofenceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geofences</SelectItem>
              {geofences.map(geofence => (
                <SelectItem key={geofence.id} value={geofence.name}>
                  {geofence.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="geofences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geofences">Geofences</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
        </TabsList>

        <TabsContent value="geofences" className="space-y-4">
          <div className="grid gap-4">
            {geofences.map((geofence) => (
              <Card key={geofence.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Shield className={`w-5 h-5 ${geofence.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-semibold">{geofence.name}</h3>
                          <p className="text-sm text-muted-foreground">{geofence.postName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={geofence.isActive ? "default" : "secondary"}>
                          {geofence.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {geofence.radius}m radius
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {geofence.latitude.toFixed(4)}, {geofence.longitude.toFixed(4)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-1">
                          {geofence.alertTypes.map(type => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        {geofence.schedule.enabled && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {geofence.schedule.startTime} - {geofence.schedule.endTime}
                          </p>
                        )}
                      </div>
                      <Switch
                        checked={geofence.isActive}
                        onCheckedChange={(checked) => handleToggleGeofence(geofence.id, checked)}
                      />
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.isResolved ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getAlertTypeIcon(alert.type)}
                        <div>
                          <h3 className="font-semibold">{alert.message}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">
                              {alert.geofenceName}
                            </Badge>
                            {alert.isResolved ? (
                              <Badge variant="secondary" className="bg-green-500 text-white">
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-red-500 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.guardName} • {new Date(alert.timestamp).toLocaleString()}
                          </p>
                          {alert.resolvedAt && (
                            <p className="text-xs text-muted-foreground">
                              Resolved by {alert.resolvedBy} at {new Date(alert.resolvedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.isResolved && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            {analytics.map((analytic) => (
              <Card key={analytic.geofenceId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{analytic.geofenceName}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Breaches</p>
                          <p className="text-lg font-semibold">{analytic.totalBreaches}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Breaches</p>
                          <p className="text-lg font-semibold text-red-600">{analytic.activeBreaches}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                          <p className="text-lg font-semibold">{analytic.averageResponseTime}s</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Trend</p>
                          <p className="text-lg font-semibold flex items-center">
                            {getTrendIcon(analytic.breachTrend)}
                            <span className="ml-1 capitalize">{analytic.breachTrend}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Most Active: {analytic.mostActiveGuard}</p>
                        <p>Last Breach: {new Date(analytic.lastBreach).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Geofence Live Map</CardTitle>
              <CardDescription>Real-time geofence monitoring and alerts</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-16rem)] p-0">
              <LiveMapWrapper
                guards={[]}
                geofences={geofences.map(geofence => ({
                  id: geofence.id,
                  name: geofence.name,
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                  radius: geofence.radius,
                  postId: geofence.postId
                }))}
                alerts={alerts.map(alert => ({
                  id: alert.id,
                  type: alert.type,
                  message: alert.message,
                  severity: alert.severity,
                  guard: {
                    name: alert.guardName,
                    photo: alert.guardPhoto
                  },
                  createdAt: alert.timestamp
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}