import { Server } from 'socket.io';

export interface LocationUpdate {
  guardId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  direction?: number;
  accuracy?: number;
  altitude?: number;
  battery?: number;
  timestamp: string;
}

export interface MovementAnalytics {
  guardId: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  timeMoving: number;
  timeStationary: number;
  routeEfficiency: number;
  timestamp: string;
}

export interface AlertUpdate {
  id: string;
  type: string;
  message: string;
  severity: string;
  guardId: string;
  guardName: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AudioVideoSOS {
  guardId: string;
  guardName: string;
  latitude: number;
  longitude: number;
  audioData?: string; // base64 encoded
  videoData?: string; // base64 encoded
  duration?: number;
  timestamp: string;
}

export interface AttendanceUpdate {
  guardId: string;
  shiftId: string;
  type: 'check-in' | 'check-out';
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export const setupSocket = (io: Server) => {
  // Store for movement analytics
  const movementData: Map<string, {
    lastLocation: LocationUpdate;
    totalDistance: number;
    speeds: number[];
    movingTime: number;
    stationaryTime: number;
    startTime: number;
  }> = new Map();

  // Store for geofence violations
  const geofenceViolations: Map<string, number> = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join room based on user role
    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room: ${room}`);
    });

    // Enhanced location updates with movement analytics
    socket.on('location-update', (data: LocationUpdate) => {
      // Broadcast to admin room
      io.to('admin').emit('location-update', data);
      
      // Calculate movement analytics
      const guardId = data.guardId;
      const now = Date.now();
      
      if (!movementData.has(guardId)) {
        movementData.set(guardId, {
          lastLocation: data,
          totalDistance: 0,
          speeds: [],
          movingTime: 0,
          stationaryTime: 0,
          startTime: now
        });
      }

      const guardMovement = movementData.get(guardId)!;
      const lastLocation = guardMovement.lastLocation;
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        lastLocation.latitude, lastLocation.longitude,
        data.latitude, data.longitude
      );
      
      // Calculate speed if we have time difference
      const timeDiff = (new Date(data.timestamp).getTime() - new Date(lastLocation.timestamp).getTime()) / 1000;
      const speed = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0; // km/h
      
      // Update movement data
      guardMovement.totalDistance += distance;
      guardMovement.speeds.push(speed);
      guardMovement.lastLocation = data;
      
      // Track moving vs stationary time
      if (speed > 1) { // Moving threshold: 1 km/h
        guardMovement.movingTime += timeDiff;
      } else {
        guardMovement.stationaryTime += timeDiff;
      }
      
      // Keep only recent speed data (last 100 readings)
      if (guardMovement.speeds.length > 100) {
        guardMovement.speeds = guardMovement.speeds.slice(-100);
      }
      
      // Send analytics every 30 seconds
      if (now - guardMovement.startTime > 30000) {
        const analytics: MovementAnalytics = {
          guardId,
          distance: guardMovement.totalDistance,
          avgSpeed: guardMovement.speeds.reduce((a, b) => a + b, 0) / guardMovement.speeds.length,
          maxSpeed: Math.max(...guardMovement.speeds),
          timeMoving: guardMovement.movingTime,
          timeStationary: guardMovement.stationaryTime,
          routeEfficiency: calculateRouteEfficiency(guardMovement.totalDistance, guardMovement.movingTime),
          timestamp: new Date().toISOString()
        };
        
        io.to('admin').emit('movement-analytics', analytics);
        
        // Reset counters
        guardMovement.totalDistance = 0;
        guardMovement.speeds = [];
        guardMovement.movingTime = 0;
        guardMovement.stationaryTime = 0;
        guardMovement.startTime = now;
      }
      
      console.log('Enhanced location update from guard:', guardId, 'Speed:', speed.toFixed(2) + ' km/h');
    });

    // Enhanced SOS with audio/video support
    socket.on('sos-alert', (data: AudioVideoSOS) => {
      const alert: AlertUpdate = {
        id: `sos-${Date.now()}`,
        type: 'sos',
        message: `SOS Alert from ${data.guardName}`,
        severity: 'critical',
        guardId: data.guardId,
        guardName: data.guardName,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        metadata: {
          hasAudio: !!data.audioData,
          hasVideo: !!data.videoData,
          duration: data.duration
        }
      };
      
      // Broadcast to admin room with high priority
      io.to('admin').emit('alert-update', alert);
      io.to('field-officers').emit('alert-update', alert);
      
      console.log('Enhanced SOS alert from guard:', data.guardId, 'Audio:', !!data.audioData, 'Video:', !!data.videoData);
    });

    // Handle geofence breach with violation tracking
    socket.on('geofence-breach', (data: {
      guardId: string;
      guardName: string;
      geofenceName: string;
      latitude: number;
      longitude: number;
      timestamp: string;
    }) => {
      const guardId = data.guardId;
      
      // Track violation count
      const currentCount = geofenceViolations.get(guardId) || 0;
      geofenceViolations.set(guardId, currentCount + 1);
      
      const alert: AlertUpdate = {
        id: `geofence-${Date.now()}`,
        type: 'geofence_breach',
        message: `Guard ${data.guardName} has left the designated area: ${data.geofenceName}`,
        severity: currentCount > 2 ? 'critical' : 'high', // Escalate if repeated violations
        guardId: data.guardId,
        guardName: data.guardName,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        metadata: {
          geofenceName: data.geofenceName,
          violationCount: currentCount + 1
        }
      };
      
      // Broadcast to admin room
      io.to('admin').emit('alert-update', alert);
      io.to(`guard-${guardId}`).emit('geofence-warning', {
        message: `You have left the designated area: ${data.geofenceName}`,
        violationCount: currentCount + 1
      });
      
      console.log('Geofence breach from guard:', guardId, 'Violation count:', currentCount + 1);
    });

    // Handle patrol heatmap data
    socket.on('patrol-data', (data: {
      guardId: string;
      route: Array<{ latitude: number; longitude: number; timestamp: string }>;
      timestamp: string;
    }) => {
      // Process and broadcast patrol data for heatmap
      io.to('admin').emit('patrol-heatmap-update', {
        guardId: data.guardId,
        route: data.route,
        timestamp: data.timestamp
      });
      
      console.log('Patrol data received from guard:', data.guardId);
    });

    // Handle attendance updates with QR verification
    socket.on('attendance-update', (data: AttendanceUpdate & {
      qrCode?: string;
      verificationMethod: 'gps' | 'qr' | 'manual';
    }) => {
      // Broadcast to admin room
      io.to('admin').emit('attendance-update', data);
      
      // Send confirmation back to guard
      io.to(`guard-${data.guardId}`).emit('attendance-confirmed', {
        type: data.type,
        timestamp: data.timestamp,
        verificationMethod: data.verificationMethod
      });
      
      console.log('Enhanced attendance update from guard:', data.guardId, data.type, data.verificationMethod);
    });

    // Handle admin commands with delivery confirmation
    socket.on('admin-command', (data: {
      command: string;
      guardId: string;
      message: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }) => {
      // Send command to specific guard
      io.to(`guard-${data.guardId}`).emit('admin-command', data);
      
      // Send delivery confirmation to admin
      socket.emit('command-delivered', {
        guardId: data.guardId,
        command: data.command,
        timestamp: new Date().toISOString()
      });
      
      console.log('Admin command to guard:', data.guardId, data.command, 'Priority:', data.priority);
    });

    // Handle real-time notifications
    socket.on('send-notification', (data: {
      type: 'alert' | 'reminder' | 'system' | 'attendance' | 'payroll';
      title: string;
      message: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      targetRole?: string;
      targetGuardId?: string;
    }) => {
      const notification = {
        id: `notification-${Date.now()}`,
        ...data,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Send to specific targets
      if (data.targetGuardId) {
        io.to(`guard-${data.targetGuardId}`).emit('notification', notification);
      } else if (data.targetRole) {
        io.to(data.targetRole).emit('notification', notification);
      } else {
        io.emit('notification', notification);
      }
      
      console.log('Notification sent:', data.type, 'to:', data.targetRole || data.targetGuardId || 'all');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Security Guard Management System',
      timestamp: new Date().toISOString(),
      features: [
        'Real-time location tracking',
        'Movement analytics',
        'Audio/Video SOS',
        'Geofence monitoring',
        'QR code attendance',
        'Real-time notifications'
      ]
    });
  });
};

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
}

function calculateRouteEfficiency(distance: number, timeMoving: number): number {
  if (timeMoving === 0) return 0;
  const avgSpeed = (distance / timeMoving) * 3.6; // km/h
  // Normalize efficiency (0-100) based on expected patrol speed (3-5 km/h)
  return Math.min(100, Math.max(0, (avgSpeed / 4) * 100));
}