"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRealTimeTracking } from "@/hooks/useRealTimeTracking";
import { 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MapPin, 
  Clock, 
  Send,
  StopCircle,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Battery,
  Wifi,
  WifiOff,
  Shield,
  Activity,
  Users
} from "lucide-react";

interface SOSData {
  guardId: string;
  guardName: string;
  latitude: number;
  longitude: number;
  audioData?: string;
  videoData?: string;
  duration?: number;
  battery?: number;
  accuracy?: number;
  timestamp: string;
}

interface EnhancedSOSProps {
  guardId: string;
  guardName: string;
  onSOSActivated?: (data: SOSData) => void;
  onSOSDeactivated?: () => void;
  showControls?: boolean;
}

export default function EnhancedSOS({ 
  guardId, 
  guardName, 
  onSOSActivated, 
  onSOSDeactivated,
  showControls = true 
}: EnhancedSOSProps) {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [audioLevel, setAudioLevel] = useState(0);
  const [nearbyGuards, setNearbyGuards] = useState<Array<{ id: string; name: string; distance: number }>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  
  const { isConnected, sendSOSAlert } = useRealTimeTracking({
    guardId,
    role: 'guard'
  });

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setAccuracy(position.coords.accuracy);
          
          // Get battery level if available
          if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
              setBattery(Math.round(battery.level * 100));
            });
          }
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

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Setup audio analyzer for level monitoring
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      audioAnalyserRef.current = analyser;
      
      // Monitor audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (audioAnalyserRef.current) {
          audioAnalyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          if (isRecording) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      updateAudioLevel();
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  // Start video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      videoStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      videoRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsVideoRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  // Stop video recording
  const stopVideoRecording = () => {
    if (videoRecorderRef.current && videoStreamRef.current) {
      videoRecorderRef.current.stop();
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      setIsVideoRecording(false);
    }
  };

  // Activate SOS
  const activateSOS = async () => {
    if (!location) {
      getCurrentLocation();
      return;
    }

    setIsActive(true);
    setDuration(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    // Start audio recording by default
    await startAudioRecording();
    
    // Get battery level
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setBattery(Math.round(battery.level * 100));
      } catch (error) {
        console.error("Error getting battery level:", error);
      }
    }
    
    // Send initial SOS alert
    const sosData: SOSData = {
      guardId,
      guardName,
      latitude: location.latitude,
      longitude: location.longitude,
      duration: 0,
      battery: battery || undefined,
      accuracy: accuracy || undefined,
      timestamp: new Date().toISOString()
    };
    
    sendSOSAlert(sosData);
    onSOSActivated?.(sosData);
    
    // Find nearby guards (mock data for now)
    setNearbyGuards([
      { id: "guard2", name: "Suresh Patel", distance: 0.5 },
      { id: "guard3", name: "Amit Singh", distance: 1.2 },
      { id: "guard4", name: "Vikram Sharma", distance: 2.1 }
    ]);
  };

  // Deactivate SOS
  const deactivateSOS = () => {
    setIsActive(false);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop recordings
    if (isRecording) {
      stopAudioRecording();
    }
    if (isVideoRecording) {
      stopVideoRecording();
    }
    
    // Send final SOS data with recordings
    const finalSOSData: SOSData = {
      guardId,
      guardName,
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      duration,
      battery: battery || undefined,
      accuracy: accuracy || undefined,
      timestamp: new Date().toISOString()
    };
    
    // Add audio data if recorded
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        finalSOSData.audioData = reader.result as string;
        sendSOSAlert(finalSOSData);
      };
      reader.readAsDataURL(audioBlob);
    } else {
      sendSOSAlert(finalSOSData);
    }
    
    onSOSDeactivated?.();
    setNearbyGuards([]);
  };

  // Toggle audio recording
  const toggleAudioRecording = () => {
    if (isRecording) {
      stopAudioRecording();
    } else {
      startAudioRecording();
    }
  };

  // Toggle video recording
  const toggleVideoRecording = () => {
    if (isVideoRecording) {
      stopVideoRecording();
    } else {
      startVideoRecording();
    }
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!showControls) {
    return (
      <Button
        onClick={isActive ? deactivateSOS : activateSOS}
        variant={isActive ? "destructive" : "outline"}
        size="lg"
        className={`w-full h-16 ${isActive ? 'animate-pulse' : ''}`}
      >
        <AlertTriangle className="w-6 h-6 mr-2" />
        {isActive ? `STOP SOS (${formatDuration(duration)})` : "ACTIVATE SOS"}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {/* SOS Status Card */}
      <Card className={`${isActive ? 'border-red-500 bg-red-50' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-6 h-6 ${isActive ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
              <span>Emergency SOS System</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isActive ? "destructive" : "secondary"}>
                {isActive ? "ACTIVE" : "STANDBY"}
              </Badge>
              {connectionStatus === 'connected' ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {isActive 
              ? "Emergency alert is active. Help is being notified."
              : "Press SOS button in case of emergency."
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Location and Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="text-sm font-medium">
                  {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Unknown"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="text-sm font-medium">{formatDuration(duration)}</div>
              </div>
            </div>
            
            {battery !== null && (
              <div className="flex items-center space-x-2">
                <Battery className={`w-4 h-4 ${battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <div className="text-xs text-muted-foreground">Battery</div>
                  <div className="text-sm font-medium">{battery}%</div>
                </div>
              </div>
            )}
            
            {accuracy !== null && (
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">GPS Accuracy</div>
                  <div className="text-sm font-medium">±{accuracy.toFixed(0)}m</div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audio Recording</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <Mic className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(audioLevel / 255) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Nearby Guards */}
          {nearbyGuards.length > 0 && (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">Nearby Guards Notified:</div>
                  {nearbyGuards.map(guard => (
                    <div key={guard.id} className="flex items-center justify-between text-sm">
                      <span>{guard.name}</span>
                      <span className="text-muted-foreground">{guard.distance}km away</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Control Buttons */}
          <div className="space-y-3">
            {/* Main SOS Button */}
            <Button
              onClick={isActive ? deactivateSOS : activateSOS}
              variant={isActive ? "destructive" : "outline"}
              size="lg"
              className={`w-full h-16 ${isActive ? 'animate-pulse' : ''}`}
            >
              <AlertTriangle className="w-6 h-6 mr-2" />
              {isActive ? `STOP SOS (${formatDuration(duration)})` : "ACTIVATE SOS"}
            </Button>

            {/* Recording Controls */}
            {isActive && (
              <div className="flex space-x-2">
                <Button
                  onClick={toggleAudioRecording}
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? "Stop Audio" : "Start Audio"}
                </Button>
                
                <Button
                  onClick={toggleVideoRecording}
                  variant={isVideoRecording ? "destructive" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {isVideoRecording ? <VideoOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                  {isVideoRecording ? "Stop Video" : "Start Video"}
                </Button>
              </div>
            )}

            {/* Location Update Button */}
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={isActive}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Update Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      {!isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SOS Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Press SOS button only in genuine emergencies</div>
              <div>• Audio recording starts automatically when SOS is activated</div>
              <div>• Video recording can be started manually if needed</div>
              <div>• Your location and battery status will be shared</div>
              <div>• Nearby guards will be notified of your emergency</div>
              <div>• Press STOP SOS when the emergency is resolved</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}