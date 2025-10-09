"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Activity,
  Filter,
  Download,
  RefreshCw
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
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface PatrolPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  guardId: string;
  guardName: string;
  speed?: number;
  duration?: number;
}

interface PatrolHeatmapProps {
  patrolData: PatrolPoint[];
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  guards?: string[];
  center?: [number, number];
  zoom?: number;
}

interface HeatmapIntensity {
  latitude: number;
  longitude: number;
  intensity: number;
  count: number;
  avgSpeed: number;
  avgDuration: number;
}

export default function PatrolHeatmap({ 
  patrolData, 
  timeRange = '24h',
  guards = [],
  center = [28.6139, 77.2090],
  zoom = 13 
}: PatrolHeatmapProps) {
  const [map, setMap] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapIntensity[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedGuards, setSelectedGuards] = useState<string[]>(guards);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatrols: 0,
    totalDistance: 0,
    avgSpeed: 0,
    hotspots: 0,
    coverage: 0
  });

  // Filter patrol data based on time range and guards
  const filterPatrolData = (data: PatrolPoint[]): PatrolPoint[] => {
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = new Date(now.getTime() - timeRangeMs[selectedTimeRange]);

    return data.filter(point => {
      const pointTime = new Date(point.timestamp);
      const timeMatch = pointTime >= cutoffTime;
      const guardMatch = selectedGuards.length === 0 || selectedGuards.includes(point.guardId);
      return timeMatch && guardMatch;
    });
  };

  // Generate heatmap data from patrol points
  const generateHeatmapData = (filteredData: PatrolPoint[]): HeatmapIntensity[] => {
    const gridSize = 0.001; // ~100m grid
    const gridMap = new Map<string, {
      points: PatrolPoint[];
      totalSpeed: number;
      totalDuration: number;
    }>();

    // Group points into grid cells
    filteredData.forEach(point => {
      const latGrid = Math.floor(point.latitude / gridSize) * gridSize;
      const lngGrid = Math.floor(point.longitude / gridSize) * gridSize;
      const key = `${latGrid},${lngGrid}`;

      if (!gridMap.has(key)) {
        gridMap.set(key, {
          points: [],
          totalSpeed: 0,
          totalDuration: 0
        });
      }

      const cell = gridMap.get(key)!;
      cell.points.push(point);
      cell.totalSpeed += point.speed || 0;
      cell.totalDuration += point.duration || 0;
    });

    // Convert to heatmap intensity data
    const heatmapData: HeatmapIntensity[] = [];
    let maxIntensity = 0;

    gridMap.forEach((cell, key) => {
      const [latGrid, lngGrid] = key.split(',').map(Number);
      const intensity = cell.points.length;
      maxIntensity = Math.max(maxIntensity, intensity);

      heatmapData.push({
        latitude: latGrid + gridSize / 2,
        longitude: lngGrid + gridSize / 2,
        intensity,
        count: cell.points.length,
        avgSpeed: cell.points.length > 0 ? cell.totalSpeed / cell.points.length : 0,
        avgDuration: cell.points.length > 0 ? cell.totalDuration / cell.points.length : 0
      });
    });

    // Normalize intensity values
    return heatmapData.map(point => ({
      ...point,
      intensity: point.intensity / maxIntensity
    }));
  };

  // Calculate statistics
  const calculateStats = (filteredData: PatrolPoint[]) => {
    if (filteredData.length === 0) {
      return {
        totalPatrols: 0,
        totalDistance: 0,
        avgSpeed: 0,
        hotspots: 0,
        coverage: 0
      };
    }

    const totalDistance = calculateTotalDistance(filteredData);
    const avgSpeed = filteredData.reduce((sum, point) => sum + (point.speed || 0), 0) / filteredData.length;
    const hotspots = heatmapData.filter(point => point.intensity > 0.7).length;
    
    // Calculate coverage area (simplified)
    const bounds = getBounds(filteredData);
    const coverage = calculateArea(bounds);

    return {
      totalPatrols: filteredData.length,
      totalDistance: Math.round(totalDistance),
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      hotspots,
      coverage: Math.round(coverage)
    };
  };

  // Helper functions
  const calculateTotalDistance = (points: PatrolPoint[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      totalDistance += calculateDistance(
        prev.latitude, prev.longitude,
        curr.latitude, curr.longitude
      );
    }
    return totalDistance;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Return distance in meters
  };

  const getBounds = (points: PatrolPoint[]): { minLat: number; maxLat: number; minLng: number; maxLng: number } => {
    const lats = points.map(p => p.latitude);
    const lngs = points.map(p => p.longitude);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  };

  const calculateArea = (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }): number => {
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    // Simplified area calculation in square kilometers
    return (latDiff * lngDiff * 111 * 111); // 111km per degree approximation
  };

  // Update heatmap when filters change
  useEffect(() => {
    setIsLoading(true);
    const filteredData = filterPatrolData(patrolData);
    const newHeatmapData = generateHeatmapData(filteredData);
    const newStats = calculateStats(filteredData);
    
    setHeatmapData(newHeatmapData);
    setStats(newStats);
    setIsLoading(false);
  }, [patrolData, selectedTimeRange, selectedGuards]);

  const getHeatmapColor = (intensity: number): string => {
    if (intensity < 0.2) return '#4ade80'; // Green - low activity
    if (intensity < 0.4) return '#facc15'; // Yellow - medium activity
    if (intensity < 0.6) return '#fb923c'; // Orange - high activity
    if (intensity < 0.8) return '#f87171'; // Red - very high activity
    return '#dc2626'; // Dark red - extreme activity
  };

  const getHeatmapRadius = (intensity: number): number => {
    return 50 + (intensity * 100); // 50-150m radius based on intensity
  };

  const exportHeatmapData = () => {
    const dataStr = JSON.stringify(heatmapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patrol-heatmap-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <Card className="w-80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Patrol Heatmap Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Guards</label>
              <Select 
                value={selectedGuards.join(',')} 
                onValueChange={(value) => setSelectedGuards(value ? value.split(',') : [])}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All guards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Guards</SelectItem>
                  {/* This should be populated with actual guard data */}
                  <SelectItem value="guard1">Guard 1</SelectItem>
                  <SelectItem value="guard2">Guard 2</SelectItem>
                  <SelectItem value="guard3">Guard 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={exportHeatmapData}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Panel */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="w-72">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Patrol Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Patrols:</span>
              <Badge variant="secondary">{stats.totalPatrols}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Distance:</span>
              <Badge variant="secondary">{stats.totalDistance}m</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Speed:</span>
              <Badge variant="secondary">{stats.avgSpeed} km/h</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hotspots:</span>
              <Badge variant="destructive">{stats.hotspots}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coverage:</span>
              <Badge variant="outline">{stats.coverage} km²</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Activity Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <span className="text-sm">Low Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm">Medium Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-400"></div>
              <span className="text-sm">High Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
              <span className="text-sm">Very High Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-sm">Extreme Activity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Generating heatmap...</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      {MapContainer && TileLayer && Circle && (
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

          {/* Heatmap Circles */}
          {heatmapData.map((point, index) => (
            <Circle
              key={index}
              center={[point.latitude, point.longitude]}
              radius={getHeatmapRadius(point.intensity)}
              pathOptions={{
                color: getHeatmapColor(point.intensity),
                fillColor: getHeatmapColor(point.intensity),
                fillOpacity: 0.6,
                weight: 1,
              }}
            />
          ))}
        </MapContainer>
      )}
    </div>
  );
}