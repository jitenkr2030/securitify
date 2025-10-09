"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Wifi,
  WifiOff,
  Smartphone
} from "lucide-react";

interface QRCodeData {
  guardId: string;
  postId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  shiftId: string;
  action: 'check-in' | 'check-out';
}

interface QRCodeScannerProps {
  onScanSuccess?: (data: QRCodeData) => void;
  onScanError?: (error: string) => void;
  guardId?: string;
  postId?: string;
  shiftId?: string;
  action?: 'check-in' | 'check-out';
}

export default function QRCodeScanner({ 
  onScanSuccess, 
  onScanError, 
  guardId,
  postId,
  shiftId,
  action = 'check-in'
}: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [cameraActive, setCameraActive] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permissions.state as 'granted' | 'denied' | 'pending');
      
      permissions.onchange = () => {
        setCameraPermission(permissions.state as 'granted' | 'denied' | 'pending');
      };
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setCameraPermission('pending');
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationAccuracy(position.coords.accuracy);
        },
        (error) => {
          console.error("Error getting location:", error);
          setScanError("Location access denied. Please enable location services.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setScanError("Geolocation is not supported by this browser.");
    }
  };

  // Check connection status
  const checkConnectionStatus = () => {
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanError('Camera access denied. Please allow camera permissions.');
      setCameraPermission('denied');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Scan QR code from video
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = scanQRCodeFromImageData(imageData);

    if (code) {
      try {
        const qrData: QRCodeData = JSON.parse(code);
        
        // Validate QR code data
        if (!qrData.guardId || !qrData.postId || !qrData.timestamp || !qrData.location) {
          throw new Error('Invalid QR code format');
        }

        // Add current location and other data
        const enrichedData: QRCodeData = {
          ...qrData,
          guardId: guardId || qrData.guardId,
          postId: postId || qrData.postId,
          shiftId: shiftId || qrData.shiftId,
          action: action,
          location: location || qrData.location
        };

        setScanResult(enrichedData);
        setScanError(null);
        onScanSuccess?.(enrichedData);
        stopScanning();
      } catch (error) {
        setScanError('Invalid QR code data');
        onScanError?.('Invalid QR code data');
      }
    }
  };

  // Simple QR code scanning (placeholder - in real implementation, use a library like jsQR)
  const scanQRCodeFromImageData = (imageData: ImageData): string | null => {
    // This is a simplified placeholder
    // In a real implementation, you would use a library like jsQR
    // For demo purposes, we'll simulate a successful scan
    if (Math.random() > 0.95) { // 5% chance to "find" a QR code
      return JSON.stringify({
        guardId: guardId || 'demo-guard',
        postId: postId || 'demo-post',
        timestamp: new Date().toISOString(),
        location: location || { latitude: 28.6139, longitude: 77.2090 },
        shiftId: shiftId || 'demo-shift',
        action: action
      });
    }
    return null;
  };

  // Start scanning
  const startScanning = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError(null);
    
    await checkCameraPermission();
    getCurrentLocation();
    checkConnectionStatus();
    
    if (cameraPermission === 'granted') {
      await startCamera();
      scanIntervalRef.current = setInterval(scanQRCode, 500);
    } else {
      setScanError('Camera permission denied. Please allow camera access to scan QR codes.');
    }
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
    stopCamera();
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setScanResult(null);
    setScanError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Scanner Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>QR Code Scanner</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={cameraPermission === 'granted' ? 'default' : 'destructive'}>
                Camera: {cameraPermission}
              </Badge>
              <Badge variant={connectionStatus === 'online' ? 'default' : 'destructive'}>
                {connectionStatus === 'online' ? (
                  <Wifi className="w-3 h-3 mr-1" />
                ) : (
                  <WifiOff className="w-3 h-3 mr-1" />
                )}
                {connectionStatus}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Scan QR code for {action === 'check-in' ? 'check-in' : 'check-out'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Location Status */}
          {location && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                {locationAccuracy && ` (±${locationAccuracy.toFixed(0)}m)`}
              </span>
            </div>
          )}

          {/* Camera View */}
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg object-cover"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            
            {!cameraActive && (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Camera inactive</p>
                </div>
              </div>
            )}
            
            {/* Scanning overlay */}
            {isScanning && cameraActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-4 border-blue-500 rounded-lg"></div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={isScanning ? stopScanning : startScanning}
                  variant={isScanning ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isScanning ? (
                    <>
                      <CameraOff className="w-4 h-4 mr-2" />
                      Stop Scanning
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Scanning
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>QR Code Scanner</DialogTitle>
                  <DialogDescription>
                    Point your camera at the QR code to scan for {action === 'check-in' ? 'check-in' : 'check-out'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">
                      Hold your device steady and ensure the QR code is clearly visible
                    </p>
                  </div>
                  <Button 
                    onClick={isScanning ? stopScanning : startScanning}
                    variant={isScanning ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isScanning ? "Stop Scanning" : "Start Scanning"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={resetScanner}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Scan Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Guard ID:</span>
                <p className="text-muted-foreground">{scanResult.guardId}</p>
              </div>
              <div>
                <span className="font-medium">Post ID:</span>
                <p className="text-muted-foreground">{scanResult.postId}</p>
              </div>
              <div>
                <span className="font-medium">Shift ID:</span>
                <p className="text-muted-foreground">{scanResult.shiftId}</p>
              </div>
              <div>
                <span className="font-medium">Action:</span>
                <p className="text-muted-foreground">{scanResult.action}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Location:</span>
                <p className="text-muted-foreground">
                  {scanResult.location.latitude.toFixed(4)}, {scanResult.location.longitude.toFixed(4)}
                </p>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Time:</span>
                <p className="text-muted-foreground">{formatTime(scanResult.timestamp)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Error */}
      {scanError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{scanError}</span>
              <Button variant="outline" size="sm" onClick={resetScanner}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Ensure you have camera permissions enabled</span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Location services must be enabled for accurate tracking</span>
          </div>
          <div className="flex items-start space-x-2">
            <Wifi className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Stable internet connection required for real-time sync</span>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Hold device steady and ensure QR code is clearly visible</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}