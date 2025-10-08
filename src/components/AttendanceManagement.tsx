"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useRealTimeTracking } from "@/hooks/useRealTimeTracking";
import { 
  Clock, 
  MapPin, 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  TrendingDown,
  LogIn,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  Shield,
  Timer,
  Map,
  Navigation
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  guardId: string;
  guardName: string;
  shiftId: string;
  shiftName: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  status: 'pending' | 'present' | 'absent' | 'late' | 'early_departure';
  verificationMethod: 'gps' | 'qr' | 'manual';
  qrCode?: string;
  notes?: string;
  duration?: number; // in minutes
  overtime?: number; // in minutes
}

interface Shift {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  post: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    qrCode: string;
  };
  guardId: string;
  guardName: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  date: string; // YYYY-MM-DD format
}

interface AttendanceManagementProps {
  guardId?: string;
  adminMode?: boolean;
  onAttendanceUpdate?: (record: AttendanceRecord) => void;
}

export default function AttendanceManagement({ 
  guardId, 
  adminMode = false, 
  onAttendanceUpdate 
}: AttendanceManagementProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalShifts: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    averageDuration: 0,
    totalOvertime: 0
  });

  const { isConnected, sendAttendanceUpdate } = useRealTimeTracking({
    guardId,
    role: adminMode ? 'admin' : 'guard'
  });

  // Mock data initialization
  useEffect(() => {
    const mockShifts: Shift[] = [
      {
        id: 'shift1',
        name: 'Day Shift',
        startTime: '08:00',
        endTime: '16:00',
        post: {
          id: 'post1',
          name: 'Main Gate',
          address: '123 Security Street, Delhi',
          latitude: 28.6139,
          longitude: 77.2090,
          qrCode: 'QR-MAIN-GATE-001'
        },
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        status: 'scheduled',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'shift2',
        name: 'Night Shift',
        startTime: '22:00',
        endTime: '06:00',
        post: {
          id: 'post2',
          name: 'Parking Area',
          address: '456 Parking Lane, Delhi',
          latitude: 28.6140,
          longitude: 77.2091,
          qrCode: 'QR-PARKING-002'
        },
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        status: 'in_progress',
        date: new Date().toISOString().split('T')[0]
      }
    ];

    const mockAttendance: AttendanceRecord[] = [
      {
        id: 'att1',
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        shiftId: 'shift1',
        shiftName: 'Day Shift',
        checkInTime: '2024-01-15T08:05:00Z',
        checkOutTime: '2024-01-15T16:10:00Z',
        checkInLat: 28.6139,
        checkInLng: 77.2090,
        checkOutLat: 28.6139,
        checkOutLng: 77.2090,
        status: 'late',
        verificationMethod: 'qr',
        qrCode: 'QR-MAIN-GATE-001',
        duration: 485, // 8 hours 5 minutes
        overtime: 10
      },
      {
        id: 'att2',
        guardId: 'guard1',
        guardName: 'Rajesh Kumar',
        shiftId: 'shift2',
        shiftName: 'Night Shift',
        checkInTime: '2024-01-14T22:00:00Z',
        checkOutTime: '2024-01-15T06:00:00Z',
        checkInLat: 28.6140,
        checkInLng: 77.2091,
        checkOutLat: 28.6140,
        checkOutLng: 77.2091,
        status: 'present',
        verificationMethod: 'gps',
        duration: 480,
        overtime: 0
      }
    ];

    setShifts(mockShifts);
    setAttendanceRecords(mockAttendance);
    
    // Find current shift
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const todayShift = mockShifts.find(shift => {
      if (shift.date !== now.toISOString().split('T')[0]) return false;
      
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      // Handle overnight shifts
      if (endTime < startTime) {
        return currentTime >= startTime || currentTime <= endTime;
      }
      
      return currentTime >= startTime && currentTime <= endTime;
    });
    
    setCurrentShift(todayShift || null);
    
    // Find current attendance record
    const todayAttendance = mockAttendance.find(att => {
      const attDate = new Date(att.checkInTime || '').toISOString().split('T')[0];
      return attDate === now.toISOString().split('T')[0];
    });
    
    setCurrentAttendance(todayAttendance || null);
    
    // Calculate stats
    calculateStats(mockAttendance);
  }, []);

  const calculateStats = (records: AttendanceRecord[]) => {
    const totalShifts = records.length;
    const presentDays = records.filter(r => r.status === 'present').length;
    const absentDays = records.filter(r => r.status === 'absent').length;
    const lateDays = records.filter(r => r.status === 'late').length;
    const totalDuration = records.reduce((sum, r) => sum + (r.duration || 0), 0);
    const totalOvertime = records.reduce((sum, r) => sum + (r.overtime || 0), 0);
    
    setStats({
      totalShifts,
      presentDays,
      absentDays,
      lateDays,
      averageDuration: totalShifts > 0 ? Math.round(totalDuration / totalShifts) : 0,
      totalOvertime
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  const handleCheckIn = async (verificationMethod: 'gps' | 'qr' | 'manual' = 'gps', qrCode?: string) => {
    if (!currentShift) {
      alert('No active shift found');
      return;
    }

    if (!location && verificationMethod === 'gps') {
      getCurrentLocation();
      return;
    }

    try {
      const newAttendance: AttendanceRecord = {
        id: `att-${Date.now()}`,
        guardId: guardId || 'guard1',
        guardName: 'Current Guard',
        shiftId: currentShift.id,
        shiftName: currentShift.name,
        checkInTime: new Date().toISOString(),
        checkInLat: location?.latitude,
        checkInLng: location?.longitude,
        status: 'pending',
        verificationMethod,
        qrCode
      };

      // Send real-time update
      sendAttendanceUpdate({
        shiftId: currentShift.id,
        type: 'check-in',
        latitude: location?.latitude,
        longitude: location?.longitude,
        qrCode,
        verificationMethod
      });

      setCurrentAttendance(newAttendance);
      setAttendanceRecords(prev => [newAttendance, ...prev]);
      
      // Update shift status
      setShifts(prev => 
        prev.map(shift => 
          shift.id === currentShift.id 
            ? { ...shift, status: 'in_progress' as const }
            : shift
        )
      );
      
      onAttendanceUpdate?.(newAttendance);
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!currentAttendance || !currentAttendance.checkInTime) {
      alert('No active check-in found');
      return;
    }

    if (!location) {
      getCurrentLocation();
      return;
    }

    try {
      const checkInTime = new Date(currentAttendance.checkInTime);
      const checkOutTime = new Date();
      const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)); // minutes
      
      // Calculate overtime (assuming 8 hours is standard)
      const standardDuration = 8 * 60; // 8 hours in minutes
      const overtime = Math.max(0, duration - standardDuration);
      
      // Determine status based on timing
      const shift = shifts.find(s => s.id === currentAttendance.shiftId);
      let status: AttendanceRecord['status'] = 'present';
      
      if (shift) {
        const [endHour, endMin] = shift.endTime.split(':').map(Number);
        const endTime = endHour * 60 + endMin;
        const checkOutMinutes = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
        
        if (checkOutMinutes < endTime - 15) { // Early departure if more than 15 minutes early
          status = 'early_departure';
        }
      }

      const updatedAttendance: AttendanceRecord = {
        ...currentAttendance,
        checkOutTime: checkOutTime.toISOString(),
        checkOutLat: location.latitude,
        checkOutLng: location.longitude,
        status,
        duration,
        overtime
      };

      // Send real-time update
      sendAttendanceUpdate({
        shiftId: currentAttendance.shiftId,
        type: 'check-out',
        latitude: location.latitude,
        longitude: location.longitude,
        verificationMethod: currentAttendance.verificationMethod
      });

      setCurrentAttendance(updatedAttendance);
      setAttendanceRecords(prev => 
        prev.map(att => att.id === currentAttendance.id ? updatedAttendance : att)
      );
      
      // Update shift status
      setShifts(prev => 
        prev.map(shift => 
          shift.id === currentAttendance.shiftId 
            ? { ...shift, status: 'completed' as const }
            : shift
        )
      );
      
      calculateStats([...attendanceRecords.filter(att => att.id !== currentAttendance.id), updatedAttendance]);
      onAttendanceUpdate?.(updatedAttendance);
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out');
    }
  };

  const simulateQRScan = () => {
    setIsScanningQR(true);
    
    // Simulate QR scanning process
    setTimeout(() => {
      const mockQRCode = 'QR-MAIN-GATE-001';
      setIsScanningQR(false);
      handleCheckIn('qr', mockQRCode);
    }, 2000);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500 text-white';
      case 'late': return 'bg-yellow-500 text-white';
      case 'absent': return 'bg-red-500 text-white';
      case 'early_departure': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'early_departure': return <AlertTriangle className="w-4 h-4" />;
      default: return <Timer className="w-4 h-4" />;
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.checkInTime || record.shiftId).toISOString().split('T')[0];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return recordDate === selectedDateStr;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-muted-foreground">
            {adminMode ? "Manage guard attendance and shifts" : "Track your attendance and shifts"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          
          {!adminMode && (
            <Button onClick={getCurrentLocation} variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Update Location
            </Button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shifts</p>
                <p className="text-2xl font-bold">{stats.totalShifts}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lateDays}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{formatDuration(stats.averageDuration)}</p>
              </div>
              <Timer className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Overtime</p>
                <p className="text-2xl font-bold text-orange-600">{formatDuration(stats.totalOvertime)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Shift & Attendance */}
      {!adminMode && currentShift && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Shift</span>
              <Badge variant={currentShift.status === 'in_progress' ? 'default' : 'secondary'}>
                {currentShift.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>
              {currentShift.name} at {currentShift.post.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shift Time:</span>
                  <span className="font-medium">{currentShift.startTime} - {currentShift.endTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-medium">{currentShift.post.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span className="font-medium text-sm">{currentShift.post.address}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Post QR Code:</span>
                  <Badge variant="outline">{currentShift.post.qrCode}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-mono text-xs">
                    {currentShift.post.latitude.toFixed(4)}, {currentShift.post.longitude.toFixed(4)}
                  </span>
                </div>
                {location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Location:</span>
                    <span className="font-mono text-xs">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Actions */}
            <div className="space-y-3">
              {!currentAttendance?.checkInTime ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Check In Options:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleCheckIn('gps')}
                      disabled={!location}
                      className="w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      GPS Check-in
                    </Button>
                    
                    <Button
                      onClick={simulateQRScan}
                      disabled={isScanningQR}
                      variant="outline"
                      className="w-full"
                    >
                      {isScanningQR ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <QrCode className="w-4 h-4 mr-2" />
                      )}
                      QR Scan
                    </Button>
                    
                    <Button
                      onClick={() => handleCheckIn('manual')}
                      variant="outline"
                      className="w-full"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Manual
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Checked In</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(currentAttendance.checkInTime).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {!currentAttendance.checkOutTime && (
                    <Button
                      onClick={handleCheckOut}
                      variant="destructive"
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Check Out
                    </Button>
                  )}
                </div>
              )}
            </div>

            {currentAttendance?.checkOutTime && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Checked Out</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(currentAttendance.checkOutTime).toLocaleTimeString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>View and manage attendance history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Date Selector */}
            <div className="flex items-center space-x-4">
              <div>
                <Label>Select Date:</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">
                  Records for {selectedDate.toLocaleDateString()}
                </div>
                
                {filteredRecords.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No attendance records found for selected date.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {record.guardName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{record.guardName}</h4>
                              <p className="text-sm text-muted-foreground">{record.shiftName}</p>
                            </div>
                          </div>
                          
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1">{record.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Check-in:</span>
                            <div className="font-medium">
                              {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}
                            </div>
                            {record.checkInLat && (
                              <div className="text-xs text-muted-foreground">
                                {record.checkInLat.toFixed(4)}, {record.checkInLng?.toFixed(4)}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Check-out:</span>
                            <div className="font-medium">
                              {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}
                            </div>
                            {record.checkOutLat && (
                              <div className="text-xs text-muted-foreground">
                                {record.checkOutLat.toFixed(4)}, {record.checkOutLng?.toFixed(4)}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium">
                              {record.duration ? formatDuration(record.duration) : 'N/A'}
                            </div>
                            {record.overtime && record.overtime > 0 && (
                              <div className="text-xs text-orange-600">
                                Overtime: {formatDuration(record.overtime)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>Verification: {record.verificationMethod.toUpperCase()}</span>
                          {record.qrCode && <span>QR: {record.qrCode}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}