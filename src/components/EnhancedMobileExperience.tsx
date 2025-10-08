"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Star,
  ChevronDown,
  ChevronRight,
  BarChart3,
  PieChart,
  Users,
  FileText,
  Info
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

interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  items: ComplianceItem[];
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

interface ComplianceScore {
  overall: number;
  categories: ComplianceCategory[];
  lastUpdated: string;
  trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

export default function EnhancedMobileExperience() {
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null);
  const [complianceData, setComplianceData] = useState<ComplianceScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchMobileData();
  }, []);

  const fetchMobileData = async () => {
    try {
      // Mock devices data
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
        }
      ];

      const mockAnalytics: MobileAnalytics = {
        totalDevices: 3,
        onlineDevices: 2,
        offlineDevices: 1,
        averageBattery: 45,
        averageSignal: -74,
        dataSynced: 1542,
        alertsGenerated: 23,
        uptime: 98.5
      };

      const mockComplianceData: ComplianceScore = {
        overall: 78,
        lastUpdated: new Date().toISOString(),
        trend: 'improving',
        recommendations: [
          "Renew 3 expiring guard licenses within 30 days",
          "Complete pending training certifications for 5 guards"
        ],
        categories: [
          {
            id: 'licenses',
            name: 'Licenses',
            description: 'PSARA license compliance',
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
              }
            ]
          },
          {
            id: 'training',
            name: 'Training',
            description: 'Guard training compliance',
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
              }
            ]
          }
        ]
      };

      setDevices(mockDevices);
      setAnalytics(mockAnalytics);
      setComplianceData(mockComplianceData);
    } catch (error) {
      console.error('Error fetching mobile data:', error);
    } finally {
      setLoading(false);
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

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Mobile Command Center</h1>
            <p className="text-blue-100 text-sm">Real-time operations & compliance</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{analytics?.onlineDevices || 0}</div>
            <div className="text-xs text-blue-100">Active Devices</div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{analytics?.uptime || 0}%</div>
            <div className="text-xs">Uptime</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{Math.round(analytics?.averageBattery || 0)}%</div>
            <div className="text-xs">Avg Battery</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{complianceData?.overall || 0}</div>
            <div className="text-xs">Compliance</div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="devices" className="text-xs">Devices</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">Compliance</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            {/* System Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">GPS Tracking</div>
                      <div className="text-xs text-green-600">Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <CloudUpload className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Data Sync</div>
                      <div className="text-xs text-blue-600">Real-time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium">Alerts</div>
                      <div className="text-xs text-purple-600">{analytics?.alertsGenerated || 0} today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-sm font-medium">Performance</div>
                      <div className="text-xs text-orange-600">Optimal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Location Update</div>
                      <div className="text-xs text-gray-500">Rajesh Kumar - 2 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Check-in Complete</div>
                      <div className="text-xs text-gray-500">Suresh Patel - 5 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Low Battery Alert</div>
                      <div className="text-xs text-gray-500">Amit Singh - 12 min ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="touch-target h-12 text-sm" variant="default">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Alert
              </Button>
              <Button className="touch-target h-12 text-sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="devices">
          <div className="space-y-4">
            {devices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <CardContent 
                  className="p-4 cursor-pointer touch-target"
                  onClick={() => toggleSection(device.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className={`w-5 h-5 ${device.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                          <div className="font-medium text-sm">{device.guardName}</div>
                          <div className="text-xs text-gray-500">{device.deviceModel}</div>
                        </div>
                      </div>
                      <Badge variant={device.isOnline ? "default" : "secondary"} className="text-xs">
                        {device.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    {expandedSection === device.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getBatteryColor(device.batteryLevel)}`}>
                        {device.batteryLevel}%
                      </div>
                      <div className="text-xs text-gray-500">Battery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {getSignalStrength(device.signalStrength).bars}/4
                      </div>
                      <div className="text-xs text-gray-500">Signal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {device.storage.used.toFixed(1)}GB
                      </div>
                      <div className="text-xs text-gray-500">Storage</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {device.features.offlineMode && (
                        <Badge variant="outline" className="text-xs">Offline</Badge>
                      )}
                      {device.features.emergencySOS && (
                        <Badge variant="outline" className="text-xs">SOS</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(device.lastSync).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>

                {expandedSection === device.id && (
                  <div className="border-t bg-gray-50 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">OS Version:</span>
                        <div className="font-medium">{device.osVersion}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">App Version:</span>
                        <div className="font-medium">{device.appVersion}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">GPS Accuracy:</span>
                        <div className="font-medium">{device.gpsAccuracy}m</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Data Usage:</span>
                        <div className="font-medium">{device.dataUsage.upload}↑/{device.dataUsage.download}↓ MB</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Features Status:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${device.features.backgroundTracking ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Background Tracking
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${device.features.pushNotifications ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Push Notifications
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${device.features.biometricAuth ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Biometric Auth
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${device.locationEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                          Location Enabled
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {/* Compliance Score */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getScoreColor(complianceData?.overall || 0)}`}>
                            {complianceData?.overall || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Badge className={`${getScoreBgColor(complianceData?.overall || 0)} ${getScoreColor(complianceData?.overall || 0)} text-xs`}>
                        {getScoreLevel(complianceData?.overall || 0)}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">Overall Score</p>
                    </div>
                  </div>
                </div>
                <Progress value={complianceData?.overall || 0} className="h-2" />
              </CardContent>
            </Card>

            {/* Compliance Categories */}
            {complianceData?.categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                        {category.score}
                      </span>
                      {getTrendIcon(category.trend)}
                    </div>
                  </div>
                  <Progress value={category.score} className="h-2 mb-2" />
                  <p className="text-xs text-gray-500">{category.description}</p>
                </CardContent>
              </Card>
            ))}

            {/* Action Required */}
            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                  <Zap className="w-4 h-4" />
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {complianceData?.recommendations.slice(0, 2).map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-orange-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Broadcast Message
                </Button>
                <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Live Locations
                </Button>
                <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Alert
                </Button>
                <Button className="w-full touch-target h-10 justify-start text-sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All Devices
                </Button>
              </CardContent>
            </Card>

            {/* Device Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Device Controls</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Push Notifications</span>
                  </div>
                  <div className="text-xs text-green-600">Enabled</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location Tracking</span>
                  </div>
                  <div className="text-xs text-green-600">Active</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Offline Mode</span>
                  </div>
                  <div className="text-xs text-blue-600">Available</div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button className="w-full touch-target h-10 text-sm" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  function getTrendIcon(trend: string) {
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
  }
}