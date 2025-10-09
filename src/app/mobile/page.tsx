"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Download, 
  QrCode, 
  MapPin, 
  MessageSquare, 
  Bell,
  Shield,
  Clock,
  Users,
  Wifi,
  WifiOff,
  CheckCircle,
  Star,
  ArrowRight,
  Camera,
  Navigation,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Apple,
  Smartphone as AndroidIcon,
  Monitor,
  User,
  Map,
  Activity,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import GuardAuthWrapper from "@/components/GuardAuthWrapper";
import QRCodeScanner from "@/components/QRCodeScanner";
import EnhancedSOS from "@/components/EnhancedSOS";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MobileAppPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const handleQRScanSuccess = (data: any) => {
    console.log('QR Scan Success:', data);
    setLastCheckIn(new Date().toLocaleTimeString());
    setShowQRScanner(false);
  };

  const handleQRScanError = (error: string) => {
    console.error('QR Scan Error:', error);
  };

  const handleSOSActivated = (data: any) => {
    console.log('SOS Activated:', data);
  };

  const handleSOSDeactivated = () => {
    console.log('SOS Deactivated');
  };

  return (
    <GuardAuthWrapper>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Guard Mobile App</h1>
                <p className="text-blue-100 text-sm">Welcome, {session?.user?.name || 'Guard'}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
              <DialogTrigger asChild>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <QrCode className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium text-sm">Check In/Out</h3>
                  <p className="text-xs text-muted-foreground">QR Code Scan</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>QR Code Scanner</DialogTitle>
                  <DialogDescription>
                    Scan QR code for check-in or check-out
                  </DialogDescription>
                </DialogHeader>
                <QRCodeScanner
                  onScanSuccess={handleQRScanSuccess}
                  onScanError={handleQRScanError}
                  guardId={session?.user?.id}
                  action="check-in"
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={showSOS} onOpenChange={setShowSOS}>
              <DialogTrigger asChild>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-medium text-sm">SOS Alert</h3>
                  <p className="text-xs text-muted-foreground">Emergency</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Emergency SOS</DialogTitle>
                  <DialogDescription>
                    Activate emergency alert system
                  </DialogDescription>
                </DialogHeader>
                <EnhancedSOS
                  guardId={session?.user?.id || ''}
                  guardName={session?.user?.name || 'Guard'}
                  onSOSActivated={handleSOSActivated}
                  onSOSDeactivated={handleSOSDeactivated}
                />
              </DialogContent>
            </Dialog>
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium text-sm">My Location</h3>
              <p className="text-xs text-muted-foreground">GPS Tracking</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium text-sm">Messages</h3>
              <p className="text-xs text-muted-foreground">Communicate</p>
            </Card>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Shift Status</span>
                <Badge className="bg-green-100 text-green-800">On Duty</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Post</span>
                <span className="text-sm text-muted-foreground">Main Gate</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Shift Time</span>
                <span className="text-sm text-muted-foreground">22:00 - 06:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Check-in</span>
                <span className="text-sm text-muted-foreground">
                  {lastCheckIn || "2 hours ago"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Report Incident
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Documents
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                My Performance
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Checked in at Main Gate</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Location updated</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Message from supervisor</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="grid grid-cols-4 py-2">
            <button className="flex flex-col items-center py-2 text-blue-600">
              <Smartphone className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-500">
              <Map className="w-5 h-5" />
              <span className="text-xs mt-1">Map</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-500">
              <Bell className="w-5 h-5" />
              <span className="text-xs mt-1">Alerts</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-500">
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </GuardAuthWrapper>
  );
}