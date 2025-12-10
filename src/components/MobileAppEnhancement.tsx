"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryCharging,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Download,
  Upload,
  Settings,
  Bell,
  BellOff,
  Camera,
  Mic,
  Phone,
  MessageSquare,
  Navigation,
  Activity,
  Zap,
  Satellite,
  Signal,
  CloudDownload,
  CloudUpload,
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";

interface MobileDevice {
  id: string;
  guardName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  batteryLevel: number;
  isCharging: boolean;
  lastSync: string;
  isOnline: boolean;
  locationEnabled: boolean;
  gpsAccuracy: number;
  signalStrength: number;
  dataUsage: {
    upload: number;
    download: number;
  };
  storage: {
    used: number;
    total: number;
  };
  features: {
    offlineMode: boolean;
    backgroundTracking: boolean;
    emergencySOS: boolean;
    pushNotifications: boolean;
    biometricAuth: boolean;
  };
}

interface OfflineData {
  id: string;
  guardName: string;
  dataType: "location" | "attendance" | "alert" | "message";
  dataCount: number;
  dataSize: number;
  createdAt: string;
  syncStatus: "pending" | "syncing" | "synced" | "failed";
}

interface MobileAnalytics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  averageBattery: number;
  averageSignal: number;
  dataSynced: number;
  alertsGenerated: number;
  uptime: number;
}

export default function MobileAppEnhancement() {
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    fetchMobileData();
  }, []);

  const fetchMobileData = async () => {
    try {
      // Fetch mobile devices from API
      const devicesResponse = await fetch('/api/mobile/devices');
      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();
        setDevices(devicesData);
      }

      // Fetch offline data from API
      const offlineDataResponse = await fetch('/api/mobile/offline-data');
      if (offlineDataResponse.ok) {
        const offlineDataData = await offlineDataResponse.json();
        setOfflineData(offlineDataData);
      }

      // Fetch mobile analytics from API
      const analyticsResponse = await fetch('/api/mobile/analytics');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching mobile data:", error);
      // Fallback to mock data for demonstration
      const mockDevices: MobileDevice[] = [
        {
          id: "1",
          guardName: "Rajesh Kumar",
          deviceModel: "Samsung Galaxy S23",
          osVersion: "Android 14",
          appVersion: "2.1.0",
          batteryLevel: 78,
          isCharging: false,
          lastSync: "2024-01-20T10:30:00Z",
          isOnline: true,
          locationEnabled: true,
          gpsAccuracy: 5.2,
          signalStrength: -65,
          dataUsage: {
            upload: 145,
            download: 342
          },
          storage: {
            used: 2.1,
            total: 8.0
          },
          features: {
            offlineMode: true,
            backgroundTracking: true,
            emergencySOS: true,
            pushNotifications: true,
            biometricAuth: true
          }
        },
        {
          id: "2",
          guardName: "Suresh Patel",
          deviceModel: "iPhone 14 Pro",
          osVersion: "iOS 17.2",
          appVersion: "2.1.0",
          batteryLevel: 45,
          isCharging: true,
          lastSync: "2024-01-20T11:15:00Z",
          isOnline: true,
          locationEnabled: true,
          gpsAccuracy: 3.8,
          signalStrength: -72,
          dataUsage: {
            upload: 98,
            download: 256
          },
          storage: {
            used: 1.8,
            total: 8.0
          },
          features: {
            offlineMode: true,
            backgroundTracking: true,
            emergencySOS: true,
            pushNotifications: true,
            biometricAuth: true
          }
        },
        {
          id: "3",
          guardName: "Amit Singh",
          deviceModel: "OnePlus 11",
          osVersion: "Android 14",
          appVersion: "2.0.5",
          batteryLevel: 12,
          isCharging: false,
          lastSync: "2024-01-20T09:45:00Z",
          isOnline: false,
          locationEnabled: true,
          gpsAccuracy: 8.1,
          signalStrength: -85,
          dataUsage: {
            upload: 67,
            download: 189
          },
          storage: {
            used: 3.2,
            total: 8.0
          },
          features: {
            offlineMode: true,
            backgroundTracking: false,
            emergencySOS: true,
            pushNotifications: true,
            biometricAuth: false
          }
        },
        {
          id: "4",
          guardName: "Vikram Sharma",
          deviceModel: "Google Pixel 8",
          osVersion: "Android 14",
          appVersion: "2.1.0",
          batteryLevel: 92,
          isCharging: false,
          lastSync: "2024-01-20T12:00:00Z",
          isOnline: true,
          locationEnabled: true,
          gpsAccuracy: 4.5,
          signalStrength: -58,
          dataUsage: {
            upload: 234,
            download: 567
          },
          storage: {
            used: 1.5,
            total: 8.0
          },
          features: {
            offlineMode: true,
            backgroundTracking: true,
            emergencySOS: true,
            pushNotifications: true,
            biometricAuth: true
          }
        }
      ];

      const mockOfflineData: OfflineData[] = [
        {
          id: "1",
          guardName: "Amit Singh",
          dataType: "location",
          dataCount: 45,
          dataSize: 2.3,
          createdAt: "2024-01-20T09:45:00Z",
          syncStatus: "pending"
        },
        {
          id: "2",
          guardName: "Amit Singh",
          dataType: "attendance",
          dataCount: 3,
          dataSize: 0.1,
          createdAt: "2024-01-20T09:45:00Z",
          syncStatus: "pending"
        },
        {
          id: "3",
          guardName: "Rajesh Kumar",
          dataType: "alert",
          dataCount: 1,
          dataSize: 0.05,
          createdAt: "2024-01-20T10:30:00Z",
          syncStatus: "synced"
        }
      ];

      const mockAnalytics: MobileAnalytics = {
        totalDevices: 4,
        onlineDevices: 3,
        offlineDevices: 1,
        averageBattery: 56.75,
        averageSignal: -70,
        dataSynced: 1542,
        alertsGenerated: 23,
        uptime: 98.5
      };

      setDevices(mockDevices);
      setOfflineData(mockOfflineData);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOfflineData = async () => {
    setSyncInProgress(true);
    try {
      const pendingDataIds = offlineData.filter(d => d.syncStatus === "pending").map(d => d.id);
      
      const response = await fetch('/api/mobile/offline-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync',
          dataIds: pendingDataIds,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update offline data status
        setOfflineData(prev => prev.map(data => ({
          ...data,
          syncStatus: "synced" as const
        })));
        
        // Update device sync times
        setDevices(prev => prev.map(device => ({
          ...device,
          lastSync: new Date().toISOString()
        })));
        
        // Refresh data
        fetchMobileData();
      } else {
        console.error("Error syncing offline data:", response.statusText);
      }
    } catch (error) {
      console.error("Error syncing offline data:", error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const handleToggleFeature = async (deviceId: string, feature: keyof MobileDevice['features'], enabled: boolean) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              features: { 
                ...device.features, 
                [feature]: enabled 
              } 
            }
          : device
      ));
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-500";
    if (level > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getSignalStrength = (strength: number) => {
    if (strength > -70) return { color: "text-green-500", bars: 4 };
    if (strength > -80) return { color: "text-yellow-500", bars: 3 };
    if (strength > -90) return { color: "text-orange-500", bars: 2 };
    return { color: "text-red-500", bars: 1 };
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "syncing": return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
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
            <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.onlineDevices || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {analytics?.totalDevices || 0} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Battery</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics?.averageBattery || 0)}%</div>
            <p className="text-xs text-muted-foreground">
              {devices.filter(d => d.batteryLevel < 20).length} low battery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Synced</CardTitle>
            <CloudUpload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.dataSynced || 0}MB</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uptime || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Reliability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleSyncOfflineData}
            disabled={syncInProgress || offlineData.filter(d => d.syncStatus === "pending").length === 0}
          >
            {syncInProgress ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CloudDownload className="w-4 h-4 mr-2" />
            )}
            Sync Offline Data
            {offlineData.filter(d => d.syncStatus === "pending").length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {offlineData.filter(d => d.syncStatus === "pending").length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="offline">Offline Data</TabsTrigger>
          <TabsTrigger value="features">App Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Smartphone className={`w-5 h-5 ${device.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="font-semibold">{device.guardName}</h3>
                          <p className="text-sm text-muted-foreground">{device.deviceModel}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={device.isOnline ? "default" : "secondary"}>
                          {device.isOnline ? "Online" : "Offline"}
                        </Badge>
                        <Badge variant="outline">
                          v{device.appVersion}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
                          <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
                            {device.batteryLevel}%
                          </span>
                          {device.isCharging && <BatteryCharging className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Signal className={`w-4 h-4 ${getSignalStrength(device.signalStrength).color}`} />
                          <span className="text-xs text-muted-foreground">
                            {getSignalStrength(device.signalStrength).bars} bars
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-1">
                          <Upload className="w-3 h-3 text-blue-500" />
                          <span>{device.dataUsage.upload}MB</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3 text-green-500" />
                          <span>{device.dataUsage.download}MB</span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">GPS: ±{device.gpsAccuracy}m</p>
                        <p className="text-muted-foreground">Storage: {device.storage.used}/{device.storage.total}GB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDevice(device)}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-4">
          <div className="grid gap-4">
            {offlineData.map((data) => (
              <Card key={data.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(data.syncStatus)}
                        <div>
                          <h3 className="font-semibold">{data.guardName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{data.dataType} data</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {data.dataCount} records
                        </Badge>
                        <Badge variant="outline">
                          {data.dataSize}MB
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Created</p>
                        <p>{new Date(data.createdAt).toLocaleString()}</p>
                      </div>
                      {data.syncStatus === "pending" && (
                        <Button variant="outline" size="sm">
                          Sync Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{device.guardName}</h3>
                      <p className="text-sm text-muted-foreground">{device.deviceModel}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(device.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {feature === "offlineMode" && <CloudDownload className="w-4 h-4" />}
                            {feature === "backgroundTracking" && <Navigation className="w-4 h-4" />}
                            {feature === "emergencySOS" && <AlertTriangle className="w-4 h-4" />}
                            {feature === "pushNotifications" && <Bell className="w-4 h-4" />}
                            {feature === "biometricAuth" && <Shield className="w-4 h-4" />}
                            <span className="text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => handleToggleFeature(device.id, feature as keyof MobileDevice['features'], checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Device Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Online Devices</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(analytics?.onlineDevices || 0) / (analytics?.totalDevices || 1) * 100} className="w-24" />
                        <span className="text-sm font-medium">{analytics?.onlineDevices || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Offline Devices</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(analytics?.offlineDevices || 0) / (analytics?.totalDevices || 1) * 100} className="w-24" />
                        <span className="text-sm font-medium">{analytics?.offlineDevices || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Battery Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between">
                        <span className="text-sm">{device.guardName}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={device.batteryLevel} className="w-24" />
                          <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
                            {device.batteryLevel}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>App Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {["offlineMode", "backgroundTracking", "emergencySOS", "pushNotifications", "biometricAuth"].map(feature => {
                    const enabledCount = devices.filter(d => d.features[feature as keyof MobileDevice['features']]).length;
                    const percentage = (enabledCount / devices.length) * 100;
                    
                    return (
                      <div key={feature} className="text-center">
                        <div className="mb-2">
                          {feature === "offlineMode" && <CloudDownload className="w-8 h-8 mx-auto mb-2" />}
                          {feature === "backgroundTracking" && <Navigation className="w-8 h-8 mx-auto mb-2" />}
                          {feature === "emergencySOS" && <AlertTriangle className="w-8 h-8 mx-auto mb-2" />}
                          {feature === "pushNotifications" && <Bell className="w-8 h-8 mx-auto mb-2" />}
                          {feature === "biometricAuth" && <Shield className="w-8 h-8 mx-auto mb-2" />}
                        </div>
                        <p className="text-sm font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-2xl font-bold">{enabledCount}/{devices.length}</p>
                        <Progress value={percentage} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">{Math.round(percentage)}% enabled</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}