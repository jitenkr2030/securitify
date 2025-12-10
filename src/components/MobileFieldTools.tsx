"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Battery,
  Signal,
  Camera,
  QrCode,
  FileText,
  MessageSquare,
  Phone,
  Navigation,
  Shield,
  User,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  Database,
  Activity,
  Map,
  Compass,
  Zap,
  Satellite,
  Radio,
  Bluetooth,
  Fingerprint,
  Lock,
  Bell,
  Calendar,
  Users,
  Car,
  Building,
  AlertCircle,
  Info
} from "lucide-react";

interface MobileDevice {
  id: string;
  name: string;
  model: string;
  osVersion: string;
  batteryLevel: number;
  lastRefreshCw: string;
  isOnline: boolean;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  features: string[];
}

interface OfflineData {
  id: string;
  type: 'incident' | 'report' | 'checkpoint' | 'message';
  title: string;
  content: string;
  createdAt: string;
  size: number;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

interface Geofence {
  id: string;
  name: string;
  type: 'inclusion' | 'exclusion';
  coordinates: Array<{ latitude: number; longitude: number }>;
  radius: number;
  status: 'active' | 'inactive';
}

interface MobileTool {
  id: string;
  name: string;
  description: string;
  category: 'navigation' | 'communication' | 'documentation' | 'safety' | 'productivity';
  icon: React.ReactNode;
  isEnabled: boolean;
  isOfflineCapable: boolean;
  lastUsed: string;
}

export default function MobileFieldTools() {
  const { data: session, status } = useSession();
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [mobileTools, setMobileTools] = useState<MobileTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoRefreshCw, setAutoRefreshCw] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        // Mock mobile devices
        const mockDevices: MobileDevice[] = [
          {
            id: "1",
            name: "Field Tablet - Main",
            model: "iPad Pro 12.9",
            osVersion: "iOS 17.2",
            batteryLevel: 85,
            lastRefreshCw: new Date(Date.now() - 300000).toISOString(),
            isOnline: true,
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              accuracy: 5
            },
            features: ["GPS", "Camera", "Biometric", "NFC", "Cellular"]
          },
          {
            id: "2",
            name: "Guard Phone - Alpha",
            model: "iPhone 14",
            osVersion: "iOS 17.2",
            batteryLevel: 42,
            lastRefreshCw: new Date(Date.now() - 1800000).toISOString(),
            isOnline: true,
            location: {
              latitude: 40.7589,
              longitude: -73.9851,
              accuracy: 8
            },
            features: ["GPS", "Camera", "Biometric", "NFC", "Cellular", "Bluetooth"]
          },
          {
            id: "3",
            name: "Backup Device",
            model: "Samsung Galaxy Tab",
            osVersion: "Android 13",
            batteryLevel: 67,
            lastRefreshCw: new Date(Date.now() - 7200000).toISOString(),
            isOnline: false,
            location: {
              latitude: 40.7505,
              longitude: -73.9934,
              accuracy: 15
            },
            features: ["GPS", "Camera", "NFC", "Cellular", "Bluetooth"]
          }
        ];

        // Mock offline data
        const mockOfflineData: OfflineData[] = [
          {
            id: "1",
            type: "incident",
            title: "Security Checkpoint Report",
            content: "Routine checkpoint completed at main entrance. All clear.",
            createdAt: new Date(Date.now() - 900000).toISOString(),
            size: 256000,
            syncStatus: "synced"
          },
          {
            id: "2",
            type: "report",
            title: "Visitor Log - Site B",
            content: "15 visitors logged during morning shift. No issues reported.",
            createdAt: new Date(Date.now() - 600000).toISOString(),
            size: 128000,
            syncStatus: "pending"
          },
          {
            id: "3",
            type: "checkpoint",
            title: "Patrol Route Alpha",
            content: "Patrol route completed. All checkpoints verified.",
            createdAt: new Date(Date.now() - 300000).toISOString(),
            size: 512000,
            syncStatus: "syncing"
          }
        ];

        // Mock geofences
        const mockGeofences: Geofence[] = [
          {
            id: "1",
            name: "Site A - Main Building",
            type: "inclusion",
            coordinates: [{ latitude: 40.7128, longitude: -74.0060 }],
            radius: 500,
            status: "active"
          },
          {
            id: "2",
            name: "Restricted Area - Zone 3",
            type: "exclusion",
            coordinates: [{ latitude: 40.7589, longitude: -73.9851 }],
            radius: 100,
            status: "active"
          },
          {
            id: "3",
            name: "Parking Lot B",
            type: "inclusion",
            coordinates: [{ latitude: 40.7505, longitude: -73.9934 }],
            radius: 300,
            status: "inactive"
          }
        ];

        // Mock mobile tools
        const mockMobileTools: MobileTool[] = [
          {
            id: "1",
            name: "GPS Navigation",
            description: "Real-time GPS navigation with offline maps",
            category: "navigation",
            icon: <Navigation className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: true,
            lastUsed: new Date(Date.now() - 300000).toISOString()
          },
          {
            id: "2",
            name: "QR Scanner",
            description: "Scan QR codes for checkpoints and verification",
            category: "documentation",
            icon: <QrCode className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: true,
            lastUsed: new Date(Date.now() - 600000).toISOString()
          },
          {
            id: "3",
            name: "Incident Reporting",
            description: "Report incidents with photos and evidence",
            category: "documentation",
            icon: <AlertTriangle className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: true,
            lastUsed: new Date(Date.now() - 900000).toISOString()
          },
          {
            id: "4",
            name: "Team Communication",
            description: "Real-time messaging with team members",
            category: "communication",
            icon: <MessageSquare className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: false,
            lastUsed: new Date(Date.now() - 1200000).toISOString()
          },
          {
            id: "5",
            name: "Emergency SOS",
            description: "One-touch emergency alert system",
            category: "safety",
            icon: <Phone className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: true,
            lastUsed: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "6",
            name: "Biometric Auth",
            description: "Fingerprint and face recognition login",
            category: "safety",
            icon: <Fingerprint className="w-5 h-5" />,
            isEnabled: true,
            isOfflineCapable: true,
            lastUsed: new Date(Date.now() - 1800000).toISOString()
          }
        ];

        setDevices(mockDevices);
        setOfflineData(mockOfflineData);
        setGeofences(mockGeofences);
        setMobileTools(mockMobileTools);
        setSelectedDevice(mockDevices[0]);
      } catch (error) {
        console.error("Error fetching mobile tools data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const handleRefreshCw = () => {
    // Mock sync process
    setOfflineData(prev => prev.map(item => 
      item.syncStatus === 'pending' ? { ...item, syncStatus: 'syncing' } : item
    ));

    setTimeout(() => {
      setOfflineData(prev => prev.map(item => 
        item.syncStatus === 'syncing' ? { ...item, syncStatus: 'synced' } : item
      ));
    }, 3000);
  };

  const toggleTool = (toolId: string) => {
    setMobileTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, isEnabled: !tool.isEnabled } : tool
    ));
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-600";
    if (level > 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getRefreshCwStatusColor = (status: string) => {
    switch (status) {
      case "synced": return "text-green-600";
      case "syncing": return "text-blue-600";
      case "pending": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "navigation": return <Compass className="w-4 h-4" />;
      case "communication": return <MessageSquare className="w-4 h-4" />;
      case "documentation": return <FileText className="w-4 h-4" />;
      case "safety": return <Shield className="w-4 h-4" />;
      case "productivity": return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile Field Tools</h1>
          <p className="text-muted-foreground">Manage mobile devices and offline field operations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Mobile Settings</DialogTitle>
                <DialogDescription>
                  Configure mobile field tools and offline capabilities
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="offline-mode">Offline Mode</Label>
                  <Switch
                    id="offline-mode"
                    checked={offlineMode}
                    onCheckedChange={setOfflineMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Auto RefreshCw</Label>
                  <Switch
                    id="auto-sync"
                    checked={autoRefreshCw}
                    onCheckedChange={setAutoRefreshCw}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="location-tracking">Location Tracking</Label>
                  <Switch
                    id="location-tracking"
                    checked={locationTracking}
                    onCheckedChange={setLocationTracking}
                  />
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={handleRefreshCw} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    RefreshCw All Data
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.filter(d => d.isOnline).length}</div>
            <p className="text-xs text-muted-foreground">of {devices.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Data</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offlineData.filter(d => d.syncStatus !== 'synced').length}</div>
            <p className="text-xs text-muted-foreground">pending sync</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mobileTools.filter(t => t.isEnabled).length}</div>
            <p className="text-xs text-muted-foreground">enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geofences</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geofences.filter(g => g.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">active zones</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="offline">Offline Data</TabsTrigger>
          <TabsTrigger value="geofences">Geofences</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Devices</CardTitle>
              <CardDescription>Manage and monitor mobile field devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                  <Card key={device.id} className={`cursor-pointer transition-colors ${
                    selectedDevice?.id === device.id ? 'border-primary' : ''
                  }`} onClick={() => setSelectedDevice(device)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          {device.isOnline ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {device.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <CardDescription>{device.model}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Battery:</span>
                        <div className="flex items-center gap-2">
                          <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
                          <span className={getBatteryColor(device.batteryLevel)}>{device.batteryLevel}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last RefreshCw:</span>
                        <span>{new Date(device.lastRefreshCw).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="text-xs">
                          {device.location.latitude.toFixed(4)}, {device.location.longitude.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {device.features.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {device.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{device.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedDevice && (
            <Card>
              <CardHeader>
                <CardTitle>Device Details - {selectedDevice.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Device Information</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Model:</span>
                          <span>{selectedDevice.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">OS Version:</span>
                          <span>{selectedDevice.osVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <Badge variant={selectedDevice.isOnline ? "default" : "secondary"}>
                            {selectedDevice.isOnline ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Battery Status</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{selectedDevice.batteryLevel}%</span>
                          <Battery className={`w-4 h-4 ${getBatteryColor(selectedDevice.batteryLevel)}`} />
                        </div>
                        <Progress value={selectedDevice.batteryLevel} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Latitude:</span>
                          <span>{selectedDevice.location.latitude.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Longitude:</span>
                          <span>{selectedDevice.location.longitude.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Accuracy:</span>
                          <span>{selectedDevice.location.accuracy}m</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Available Features</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedDevice.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Tools</CardTitle>
              <CardDescription>Configure and manage mobile field tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mobileTools.map(tool => (
                  <Card key={tool.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            tool.isEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {tool.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(tool.category)}
                              <span className="text-xs text-gray-500 capitalize">{tool.category}</span>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={tool.isEnabled}
                          onCheckedChange={() => toggleTool(tool.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          {tool.isOfflineCapable ? (
                            <>
                              <Database className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">Offline Capable</span>
                            </>
                          ) : (
                            <>
                              <Wifi className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-400">Online Only</span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-500">
                          Used {new Date(tool.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Offline Data Management</CardTitle>
                  <CardDescription>Manage data stored locally on devices</CardDescription>
                </div>
                <Button onClick={handleRefreshCw}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  RefreshCw All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offlineData.map(data => (
                  <Card key={data.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${
                              data.type === 'incident' ? 'bg-red-100 text-red-600' :
                              data.type === 'report' ? 'bg-blue-100 text-blue-600' :
                              data.type === 'checkpoint' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {data.type === 'incident' ? <AlertTriangle className="w-4 h-4" /> :
                               data.type === 'report' ? <FileText className="w-4 h-4" /> :
                               data.type === 'checkpoint' ? <CheckCircle className="w-4 h-4" /> :
                               <Database className="w-4 h-4" />}
                            </div>
                            <h3 className="font-medium">{data.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{data.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{(data.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>{new Date(data.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRefreshCwStatusColor(data.syncStatus)}>
                            {data.syncStatus}
                          </Badge>
                          {data.syncStatus === 'pending' && (
                            <Button variant="outline" size="sm">
                              <Upload className="w-3 h-3 mr-1" />
                              RefreshCw
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geofences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geofence Management</CardTitle>
              <CardDescription>Manage location-based zones and boundaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {geofences.map(geofence => (
                  <Card key={geofence.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{geofence.name}</CardTitle>
                        <Badge variant={geofence.status === 'active' ? 'default' : 'secondary'}>
                          {geofence.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {geofence.type === 'inclusion' ? 'Inclusion Zone' : 'Exclusion Zone'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Radius:</span>
                        <span>{geofence.radius}m</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Coordinates:</span>
                        <span className="text-xs">
                          {geofence.coordinates[0].latitude.toFixed(4)}, {geofence.coordinates[0].longitude.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Map className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}