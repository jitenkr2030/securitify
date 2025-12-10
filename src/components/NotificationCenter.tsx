"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRealTimeTracking } from "@/hooks/useRealTimeTracking";
import { 
  Bell, 
  BellOff, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Info,
  UserCheck,
  Calendar,
  DollarSign,
  Settings,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'system' | 'attendance' | 'payroll';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetRole?: string;
  targetGuardId?: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  role?: 'admin' | 'field_officer' | 'guard';
  guardId?: string;
  maxNotifications?: number;
}

export default function NotificationCenter({ 
  role = 'admin', 
  guardId, 
  maxNotifications = 50 
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const { sendNotification, isConnected } = useRealTimeTracking({
    role,
    guardId,
    onAlertUpdate: (alert) => {
      // Convert alert to notification
      const newNotification: Notification = {
        id: `alert-${alert.id}`,
        type: 'alert',
        title: `${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Alert`,
        message: alert.message,
        priority: alert.severity as any,
        timestamp: alert.timestamp,
        read: false,
        metadata: {
          guardId: alert.guardId,
          guardName: alert.guardName,
          alertType: alert.type
        }
      };
      
      addNotification(newNotification);
    }
  });

  // Add new notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const existing = prev.find(n => n.id === notification.id);
      if (existing) {
        return prev.map(n => n.id === notification.id ? notification : n);
      }
      return [notification, ...prev].slice(0, maxNotifications);
    });
  };

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(n => n.priority === filterPriority);
    }

    // Read status filter
    if (filterRead === "read") {
      filtered = filtered.filter(n => n.read);
    } else if (filterRead === "unread") {
      filtered = filtered.filter(n => !n.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterType, filterPriority, filterRead]);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get notification icon
  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'alert':
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case 'reminder':
        return <Clock {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'system':
        return <Settings {...iconProps} className={`${iconProps.className} text-gray-500`} />;
      case 'attendance':
        return <UserCheck {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'payroll':
        return <DollarSign {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      default:
        return <Info {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Send test notification
  const sendTestNotification = () => {
    sendNotification({
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      priority: 'medium',
      targetRole: role
    });
  };

  // Group notifications by date
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return groups;
  };

  const notificationGroups = groupNotificationsByDate(filteredNotifications);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Real-time updates active" : "Disconnected"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          
          {role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
            >
              Send Test
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterRead} onValueChange={setFilterRead}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(notificationGroups).map(([date, dayNotifications]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="space-y-2">
              {dayNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all duration-200 ${
                    notification.read ? 'opacity-60' : 'border-l-4 border-l-blue-500'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-blue-500 text-white">New</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          {notification.metadata && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {notification.metadata.guardName && (
                                <div>Guard: {notification.metadata.guardName}</div>
                              )}
                              {notification.metadata.alertType && (
                                <div>Type: {notification.metadata.alertType}</div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BellOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" || filterPriority !== "all" || filterRead !== "all"
                  ? "No notifications match your current filters."
                  : "You're all caught up! No new notifications."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}