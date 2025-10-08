"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { LocationUpdate, MovementAnalytics, AlertUpdate } from "@/lib/socket";

interface UseRealTimeTrackingProps {
  guardId?: string;
  role?: 'admin' | 'field_officer' | 'guard';
  onLocationUpdate?: (location: LocationUpdate) => void;
  onAlertUpdate?: (alert: AlertUpdate) => void;
  onMovementAnalytics?: (analytics: MovementAnalytics) => void;
}

export function useRealTimeTracking({
  guardId,
  role,
  onLocationUpdate,
  onAlertUpdate,
  onMovementAnalytics
}: UseRealTimeTrackingProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocationUpdate | null>(null);
  const [movementAnalytics, setMovementAnalytics] = useState<MovementAnalytics | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<AlertUpdate[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to real-time tracking system');
      
      // Join appropriate room based on role
      if (role) {
        socket.emit('join-room', role);
      }
      if (guardId && role === 'guard') {
        socket.emit('join-room', `guard-${guardId}`);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from real-time tracking system');
    });

    // Location updates
    socket.on('location-update', (data: LocationUpdate) => {
      setLastLocation(data);
      onLocationUpdate?.(data);
    });

    // Alert updates
    socket.on('alert-update', (data: AlertUpdate) => {
      setActiveAlerts(prev => {
        const existing = prev.find(alert => alert.id === data.id);
        if (existing) {
          return prev.map(alert => alert.id === data.id ? data : alert);
        }
        return [...prev, data];
      });
      onAlertUpdate?.(data);
    });

    // Movement analytics
    socket.on('movement-analytics', (data: MovementAnalytics) => {
      setMovementAnalytics(data);
      onMovementAnalytics?.(data);
    });

    // Patrol heatmap updates
    socket.on('patrol-heatmap-update', (data: any) => {
      console.log('Patrol heatmap update:', data);
    });

    // Attendance confirmations
    socket.on('attendance-confirmed', (data: any) => {
      console.log('Attendance confirmed:', data);
    });

    // Admin commands
    socket.on('admin-command', (data: any) => {
      console.log('Admin command received:', data);
    });

    // Notifications
    socket.on('notification', (data: any) => {
      console.log('Notification received:', data);
    });

    // Geofence warnings
    socket.on('geofence-warning', (data: any) => {
      console.log('Geofence warning:', data);
      setActiveAlerts(prev => [...prev, {
        id: `geofence-warning-${Date.now()}`,
        type: 'geofence_warning',
        message: data.message,
        severity: 'medium',
        guardId: guardId || '',
        guardName: 'Current Guard',
        timestamp: new Date().toISOString(),
        metadata: { violationCount: data.violationCount }
      } as AlertUpdate]);
    });

    return () => {
      socket.disconnect();
    };
  }, [guardId, role, onLocationUpdate, onAlertUpdate, onMovementAnalytics]);

  // Methods for guards to send updates
  const sendLocationUpdate = (location: Omit<LocationUpdate, 'guardId'>) => {
    if (socketRef.current && guardId) {
      socketRef.current.emit('location-update', {
        ...location,
        guardId
      });
    }
  };

  const sendSOSAlert = (data: Omit<{
    guardName: string;
    latitude: number;
    longitude: number;
    audioData?: string;
    videoData?: string;
    duration?: number;
  }, 'guardName'>) => {
    if (socketRef.current && guardId) {
      socketRef.current.emit('sos-alert', {
        guardId,
        guardName: 'Current Guard', // This should come from user data
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  };

  const sendAttendanceUpdate = (data: Omit<{
    shiftId: string;
    type: 'check-in' | 'check-out';
    latitude?: number;
    longitude?: number;
    qrCode?: string;
    verificationMethod: 'gps' | 'qr' | 'manual';
  }, 'guardId'>) => {
    if (socketRef.current && guardId) {
      socketRef.current.emit('attendance-update', {
        ...data,
        guardId,
        timestamp: new Date().toISOString()
      });
    }
  };

  const sendGeofenceBreach = (data: Omit<{
    guardName: string;
    geofenceName: string;
    latitude: number;
    longitude: number;
  }, 'guardName'>) => {
    if (socketRef.current && guardId) {
      socketRef.current.emit('geofence-breach', {
        guardId,
        guardName: 'Current Guard',
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  };

  const sendPatrolData = (route: Array<{ latitude: number; longitude: number; timestamp: string }>) => {
    if (socketRef.current && guardId) {
      socketRef.current.emit('patrol-data', {
        guardId,
        route,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Methods for admins
  const sendAdminCommand = (data: {
    command: string;
    guardId: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    if (socketRef.current) {
      socketRef.current.emit('admin-command', data);
    }
  };

  const sendNotification = (data: {
    type: 'alert' | 'reminder' | 'system' | 'attendance' | 'payroll';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    targetRole?: string;
    targetGuardId?: string;
  }) => {
    if (socketRef.current) {
      socketRef.current.emit('send-notification', data);
    }
  };

  return {
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
  };
}