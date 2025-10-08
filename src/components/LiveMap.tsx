"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRealTimeTracking } from "@/hooks/useRealTimeTracking";
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  Clock,
  Filter,
  ZoomIn,
  ZoomOut,
  Activity,
  Zap,
  Battery,
  Wifi,
  WifiOff
} from "lucide-react";

// Dynamically import Leaflet components only on client side
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Type definition for LatLngExpression
type LatLngExpression = [number, number] | { lat: number; lng: number };

// Import CSS only on client side
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet/dist/leaflet.css");
}

interface GuardLocation {
  id: string;
  name: string;
  phone: string;
  status: string;
  photo?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  direction?: number;
  accuracy?: number;
  altitude?: number;
  battery?: number;
  currentShift?: {
    name: string;
    post: string;
    startTime: string;
    endTime: string;
  };
  movementAnalytics?: {
    avgSpeed: number;
    maxSpeed: number;
    routeEfficiency: number;
    timeMoving: number;
    timeStationary: number;
  };
}

interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  postId: string;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string;
  guardId: string;
  guardName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface LiveMapProps {
  guards: GuardLocation[];
  geofences: Geofence[];
  alerts: Alert[];
  center?: LatLngExpression;
  zoom?: number;
}

export default function LiveMap({ guards: initialGuards, geofences, alerts: initialAlerts, center = [28.6139, 77.2090], zoom = 13 }: LiveMapProps) {
  const [map, setMap] = useState<any>(null);
  const [selectedGuard, setSelectedGuard] = useState<GuardLocation | null>(null);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [guardIcons, setGuardIcons] = useState<Record<string, any>>({});
  const [alertIconState, setAlertIconState] = useState<any>(null);
  
  // State for guards and alerts
  const [guards, setGuards] = useState<GuardLocation[]>(initialGuards);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  
  // Real-time tracking
  const {
    isConnected,
    lastLocation,
    movementAnalytics,
    activeAlerts,
    sendLocationUpdate,
    sendSOSAlert,
    sendAttendanceUpdate,
    sendGeofenceBreach,
    sendPatrolData,
    sendAdminCommand,
    sendNotification
  } = useRealTimeTracking({
    role: "admin",
    onLocationUpdate: (location) => {
      // Update guard location in real-time
      setGuards(prevGuards => {
        return prevGuards.map(guard => {
          if (guard.id === location.guardId) {
            return {
              ...guard,
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: location.timestamp,
              speed: location.speed,
              direction: location.direction,
              accuracy: location.accuracy,
              altitude: location.altitude,
              battery: location.battery
            };
          }
          return guard;
        });
      });
    },
    onAlertUpdate: (alert) => {
      // Add new alerts to the list
      setAlerts(prev => {
        const newAlert = {
          id: alert.id,
          type: alert.type,
          message: alert.message,
          severity: alert.severity,
          guardId: alert.guardId,
          guardName: alert.guardName,
          latitude: alert.latitude || 28.6139,
          longitude: alert.longitude || 77.2090,
          timestamp: alert.timestamp
        };
        const existing = prev.find(a => a.id === alert.id);
        if (existing) {
          return prev.map(a => a.id === alert.id ? newAlert : a);
        }
        return [newAlert, ...prev].slice(0, 50); // Keep last 50 alerts
      });
    },
    onMovementAnalytics: (analytics) => {
      // Update movement analytics for the guard
      setGuards(prevGuards => {
        return prevGuards.map(guard => {
          if (guard.id === analytics.guardId) {
            return {
              ...guard,
              movementAnalytics: {
                avgSpeed: analytics.avgSpeed,
                maxSpeed: analytics.maxSpeed,
                routeEfficiency: analytics.routeEfficiency,
                timeMoving: analytics.timeMoving,
                timeStationary: analytics.timeStationary
              }
            };
          }
          return guard;
        });
      });
    }
  });

  useEffect(() => {
    // Add pulse animation for alerts
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Load icons dynamically on client side
    const loadIcons = async () => {
      if (typeof window !== 'undefined') {
        const L = await import("leaflet");
        
        // Create guard icons
        const newGuardIcons: Record<string, any> = {};
        const statuses = ['active', 'inactive', 'on_leave'];
        const colors = {
          active: '#22c55e',
          inactive: '#ef4444',
          on_leave: '#f59e0b'
        };
        
        for (const status of statuses) {
          newGuardIcons[status] = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${colors[status as keyof typeof colors]};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">👤</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
        }
        
        // Create alert icon
        const alertIcon = L.divIcon({
          className: 'alert-marker',
          html: `<div style="
            background-color: #ef4444;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            animation: pulse 2s infinite;
          ">⚠️</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        setGuardIcons(newGuardIcons);
        setAlertIconState(alertIcon);
        setIconsLoaded(true);
      }
    };
    
    loadIcons();
  }, []);

  const filteredGuards = guards.filter(guard => {
    if (filterStatus === "all") return true;
    return guard.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#22c55e";
      case "inactive": return "#ef4444";
      case "on_leave": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "#3b82f6";
      case "medium": return "#f59e0b";
      case "high": return "#f97316";
      case "critical": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const centerMapOnGuard = (guard: GuardLocation) => {
    if (map) {
      map.setView([guard.latitude, guard.longitude], 16);
      setSelectedGuard(guard);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="h-full w-full">
      {/* Connection Status */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Card className="w-48">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <div>
                <div className="text-sm font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {lastLocation 
                    ? `Last update: ${new Date(lastLocation.timestamp).toLocaleTimeString()}`
                    : "No data"
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-52 z-[1000] space-y-2">
        <Card className="w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showGeofences"
                checked={showGeofences}
                onChange={(e) => setShowGeofences(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showGeofences" className="text-sm">Show Geofences</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showAlerts"
                checked={showAlerts}
                onChange={(e) => setShowAlerts(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showAlerts" className="text-sm">Show Alerts</label>
            </div>
            <div>
              <label className="text-sm">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-1 p-1 border rounded text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Actions */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white"
        >
          <ZoomOut className="w-4 h-4 mr-2" />
          Zoom Out
        </Button>
      </div>

      {/* Selected Guard Info */}
      {selectedGuard && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Card className="w-96">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={selectedGuard.photo} alt={selectedGuard.name} />
                  <AvatarFallback className="text-xs">
                    {selectedGuard.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedGuard.name}
                {selectedGuard.battery && (
                  <Battery className={`w-4 h-4 ml-2 ${
                    selectedGuard.battery > 20 ? 'text-green-500' : 'text-red-500'
                  }`} />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary" style={{ backgroundColor: getStatusColor(selectedGuard.status) }}>
                  {selectedGuard.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span>{selectedGuard.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Update:</span>
                <span>{new Date(selectedGuard.timestamp).toLocaleTimeString()}</span>
              </div>
              
              {/* Real-time metrics */}
              {selectedGuard.speed !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-blue-500" />
                    {selectedGuard.speed.toFixed(1)} km/h
                  </span>
                </div>
              )}
              
              {selectedGuard.accuracy !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GPS Accuracy:</span>
                  <span>±{selectedGuard.accuracy.toFixed(0)}m</span>
                </div>
              )}
              
              {selectedGuard.battery !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Battery:</span>
                  <span className={`flex items-center ${
                    selectedGuard.battery > 20 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Battery className="w-3 h-3 mr-1" />
                    {selectedGuard.battery}%
                  </span>
                </div>
              )}

              {selectedGuard.currentShift && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-sm font-medium mb-1">Current Shift</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shift:</span>
                    <span>{selectedGuard.currentShift.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Post:</span>
                    <span>{selectedGuard.currentShift.post}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{selectedGuard.currentShift.startTime} - {selectedGuard.currentShift.endTime}</span>
                  </div>
                </div>
              )}

              {/* Movement Analytics */}
              {selectedGuard.movementAnalytics && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-sm font-medium mb-1 flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Movement Analytics
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Speed:</span>
                      <span>{selectedGuard.movementAnalytics.avgSpeed.toFixed(1)} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Speed:</span>
                      <span>{selectedGuard.movementAnalytics.maxSpeed.toFixed(1)} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Moving:</span>
                      <span>{formatDuration(selectedGuard.movementAnalytics.timeMoving)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stationary:</span>
                      <span>{formatDuration(selectedGuard.movementAnalytics.timeStationary)}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-muted-foreground">Route Efficiency:</span>
                      <span className={`font-medium ${
                        selectedGuard.movementAnalytics.routeEfficiency > 70 ? 'text-green-600' :
                        selectedGuard.movementAnalytics.routeEfficiency > 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedGuard.movementAnalytics.routeEfficiency.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Card className="w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Active Guard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Inactive Guard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">On Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-500"></div>
              <span className="text-sm">Geofence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">⚠️</div>
              <span className="text-sm">Alert</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      {MapContainer && TileLayer && (
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Geofences */}
          {showGeofences && Circle && geofences.map((geofence) => (
            <Circle
              key={geofence.id}
              center={[geofence.latitude, geofence.longitude]}
              radius={geofence.radius}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          ))}

          {/* Guard Markers */}
          {Marker && Popup && iconsLoaded && filteredGuards.map((guard) => (
            <Marker
              key={guard.id}
              position={[guard.latitude, guard.longitude]}
              icon={guardIcons[guard.status]}
              eventHandlers={{
                click: () => setSelectedGuard(guard),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={guard.photo} alt={guard.name} />
                      <AvatarFallback className="text-xs">
                        {guard.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{guard.name}</div>
                      <div className="text-sm text-muted-foreground">{guard.phone}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant="secondary" style={{ backgroundColor: getStatusColor(guard.status) }}>
                        {guard.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Update:</span>
                      <span>{new Date(guard.timestamp).toLocaleTimeString()}</span>
                    </div>
                    {guard.currentShift && (
                      <div className="border-t pt-1 mt-1">
                        <div className="text-sm font-medium">Current Shift</div>
                        <div className="text-xs">{guard.currentShift.name}</div>
                        <div className="text-xs">{guard.currentShift.post}</div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => centerMapOnGuard(guard)}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Focus
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Alert Markers */}
          {showAlerts && Marker && Popup && iconsLoaded && alerts.map((alert) => (
            <Marker
              key={alert.id}
              position={[alert.latitude, alert.longitude]}
              icon={alertIconState}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div className="font-medium">Alert</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Guard:</span> {alert.guardName}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Type:</span> {alert.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Message:</span> {alert.message}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Severity:</span>
                      <Badge variant="secondary" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}