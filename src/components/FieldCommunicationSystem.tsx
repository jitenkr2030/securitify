"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  Users, 
  Bell,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Shield,
  Radio,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Camera,
  Calendar,
  Pin,
  Archive,
  Trash2,
  Reply,
  Forward,
  PhoneIncoming,
  PhoneOutgoing,
  Monitor,
  Smartphone,
  Headphones,
  Megaphone,
  Users2,
  UserCheck,
  UserPlus,
  UserMinus,
  Settings,
  Info,
  Share
} from "lucide-react";
import { createTenantContext } from "@/lib/db";

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId?: string;
  groupId?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

interface MessageAttachment {
  id: string;
  filename: string;
  type: string;
  size: number;
  url: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  type: 'team' | 'site' | 'incident' | 'general';
  members: string[];
  admins: string[];
  createdAt: string;
  lastActivity: string;
  unreadCount: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  avatar?: string;
  phone?: string;
  email?: string;
}

interface CallLog {
  id: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing';
  callerId: string;
  callerName: string;
  receiverId: string;
  receiverName: string;
  timestamp: string;
  duration: number;
  status: 'completed' | 'missed' | 'failed';
}

interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'announcement' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  senderId: string;
  senderName: string;
  targetGroups: string[];
  targetUsers: string[];
  timestamp: string;
  readBy: string[];
  acknowledgedBy: string[];
}

export default function FieldCommunicationSystem() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchData = async () => {
      try {
        // Mock messages
        const mockMessages: Message[] = [
          {
            id: "1",
            content: "All clear at Site A. Patrol completed successfully.",
            type: "text",
            senderId: "1",
            senderName: "Rajesh Kumar",
            senderAvatar: "/api/placeholder/40/40",
            groupId: "1",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: "read"
          },
          {
            id: "2",
            content: "Need backup at Site B parking area. Suspicious activity reported.",
            type: "text",
            senderId: "2",
            senderName: "Suresh Patel",
            senderAvatar: "/api/placeholder/40/40",
            groupId: "1",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            status: "read"
          },
          {
            id: "3",
            content: "Backup unit dispatched. ETA 5 minutes.",
            type: "text",
            senderId: "3",
            senderName: "Field Officer Johnson",
            senderAvatar: "/api/placeholder/40/40",
            groupId: "1",
            timestamp: new Date(Date.now() - 550000).toISOString(),
            status: "read"
          },
          {
            id: "4",
            content: "Weather conditions worsening. All units advised to exercise caution.",
            type: "text",
            senderId: "4",
            senderName: "Control Room",
            senderAvatar: "/api/placeholder/40/40",
            groupId: "2",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: "delivered"
          }
        ];

        // Mock groups
        const mockGroups: Group[] = [
          {
            id: "1",
            name: "Field Operations Team",
            description: "Main field operations coordination group",
            type: "team",
            members: ["1", "2", "3", "4", "5"],
            admins: ["3", "4"],
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            lastActivity: new Date(Date.now() - 300000).toISOString(),
            unreadCount: 0
          },
          {
            id: "2",
            name: "Site A Security",
            description: "Security team for Site A operations",
            type: "site",
            members: ["1", "5", "6"],
            admins: ["1"],
            createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
            lastActivity: new Date(Date.now() - 900000).toISOString(),
            unreadCount: 1
          },
          {
            id: "3",
            name: "Emergency Response",
            description: "Emergency response coordination",
            type: "incident",
            members: ["2", "3", "4", "7", "8"],
            admins: ["4"],
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            lastActivity: new Date(Date.now() - 1800000).toISOString(),
            unreadCount: 0
          }
        ];

        // Mock team members
        const mockTeamMembers: TeamMember[] = [
          {
            id: "1",
            name: "Rajesh Kumar",
            role: "Field Officer",
            status: "online",
            lastSeen: new Date().toISOString(),
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              accuracy: 5
            },
            avatar: "/api/placeholder/40/40",
            phone: "+91 98765 43210",
            email: "rajesh@securitify.app"
          },
          {
            id: "2",
            name: "Suresh Patel",
            role: "Security Guard",
            status: "online",
            lastSeen: new Date().toISOString(),
            location: {
              latitude: 40.7589,
              longitude: -73.9851,
              accuracy: 8
            },
            avatar: "/api/placeholder/40/40",
            phone: "+91 87654 32109",
            email: "suresh@securitify.app"
          },
          {
            id: "3",
            name: "Field Officer Johnson",
            role: "Field Supervisor",
            status: "busy",
            lastSeen: new Date(Date.now() - 300000).toISOString(),
            location: {
              latitude: 40.7505,
              longitude: -73.9934,
              accuracy: 10
            },
            avatar: "/api/placeholder/40/40",
            phone: "+91 76543 21098",
            email: "johnson@securitify.app"
          },
          {
            id: "4",
            name: "Control Room",
            role: "Operator",
            status: "online",
            lastSeen: new Date().toISOString(),
            avatar: "/api/placeholder/40/40",
            phone: "+91 65432 10987",
            email: "control@securitify.app"
          }
        ];

        // Mock call logs
        const mockCallLogs: CallLog[] = [
          {
            id: "1",
            type: "voice",
            direction: "outgoing",
            callerId: "1",
            callerName: "Rajesh Kumar",
            receiverId: "2",
            receiverName: "Suresh Patel",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            duration: 320,
            status: "completed"
          },
          {
            id: "2",
            type: "video",
            direction: "incoming",
            callerId: "3",
            callerName: "Field Officer Johnson",
            receiverId: "1",
            receiverName: "Rajesh Kumar",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            duration: 180,
            status: "completed"
          },
          {
            id: "3",
            type: "voice",
            direction: "incoming",
            callerId: "4",
            callerName: "Control Room",
            receiverId: "1",
            receiverName: "Rajesh Kumar",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            duration: 0,
            status: "missed"
          }
        ];

        // Mock broadcasts
        const mockBroadcasts: Broadcast[] = [
          {
            id: "1",
            title: "Weather Alert",
            message: "Severe weather warning issued for all sites. Take necessary precautions.",
            type: "alert",
            priority: "high",
            senderId: "4",
            senderName: "Control Room",
            targetGroups: ["1", "2", "3"],
            targetUsers: [],
            timestamp: new Date(Date.now() - 900000).toISOString(),
            readBy: ["1", "2", "3"],
            acknowledgedBy: ["1", "3"]
          },
          {
            id: "2",
            title: "Shift Change Reminder",
            message: "Reminder: Shift change in 30 minutes. Please prepare for handover.",
            type: "announcement",
            priority: "medium",
            senderId: "4",
            senderName: "Control Room",
            targetGroups: ["1", "2"],
            targetUsers: [],
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            readBy: ["1", "2", "3", "5"],
            acknowledgedBy: ["1", "2"]
          }
        ];

        setMessages(mockMessages);
        setGroups(mockGroups);
        setTeamMembers(mockTeamMembers);
        setCallLogs(mockCallLogs);
        setBroadcasts(mockBroadcasts);
        setSelectedGroup(mockGroups[0]);
      } catch (error) {
        console.error("Error fetching communication data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      type: "text",
      senderId: session?.user?.id || "1",
      senderName: session?.user?.name || "Current User",
      senderAvatar: "/api/placeholder/40/40",
      groupId: selectedGroup.id,
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-red-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCallIcon = (type: string, direction: string) => {
    if (type === 'video') {
      return direction === 'incoming' ? <Camera className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
    }
    return direction === 'incoming' ? <PhoneIncoming className="w-4 h-4" /> : <PhoneOutgoing className="w-4 h-4" />;
  };

  const filteredMessages = selectedGroup 
    ? messages.filter(msg => msg.groupId === selectedGroup.id)
    : messages;

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Field Communication System</h1>
          <p className="text-muted-foreground">Real-time communication and coordination for field teams</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Make Call
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Initiate Call</DialogTitle>
                <DialogDescription>Choose call type and recipient</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Call Type</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={callType === 'voice' ? 'default' : 'outline'}
                      onClick={() => setCallType('voice')}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Voice Call
                    </Button>
                    <Button
                      variant={callType === 'video' ? 'default' : 'outline'}
                      onClick={() => setCallType('video')}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Select Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCallDialogOpen(false)}>
                    Start Call
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Megaphone className="w-4 h-4 mr-2" />
                Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Broadcast</DialogTitle>
                <DialogDescription>Send message to multiple teams or users</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="broadcast-title">Title</Label>
                  <Input id="broadcast-title" placeholder="Broadcast title" />
                </div>
                <div>
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea id="broadcast-message" placeholder="Broadcast message" rows={3} />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsBroadcastDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsBroadcastDialogOpen(false)}>
                    Send Broadcast
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>Create a new communication group</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" placeholder="Enter group name" />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea id="group-description" placeholder="Group description" rows={2} />
                </div>
                <div>
                  <Label>Group Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsGroupDialogOpen(false)}>
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'online').length} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">
              {groups.reduce((sum, g) => sum + g.unreadCount, 0)} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callLogs.length}</div>
            <p className="text-xs text-muted-foreground">last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broadcasts</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{broadcasts.length}</div>
            <p className="text-xs text-muted-foreground">
              {broadcasts.filter(b => b.priority === 'critical').length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Groups List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Groups</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1">
                    {groups.map(group => (
                      <div
                        key={group.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedGroup?.id === group.id ? 'bg-primary/5 border-r-2 border-primary' : ''
                        }`}
                        onClick={() => setSelectedGroup(group)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1">{group.description}</p>
                          </div>
                          {group.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {group.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(group.lastActivity).toLocaleTimeString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {group.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages Area */}
            <Card className="lg:col-span-3 flex flex-col">
              {selectedGroup ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedGroup.name}</CardTitle>
                        <CardDescription>{selectedGroup.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {filteredMessages.map(message => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.senderName === session?.user?.name ? 'flex-row-reverse' : ''
                            }`}
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>
                                {message.senderName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderName === session?.user?.name
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {message.senderName}
                                </span>
                                <span className="text-xs opacity-70">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                              {message.location && (
                                <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                                  <MapPin className="w-3 h-3" />
                                  <span>Location shared</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a group to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage team members and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeamMembers.map(member => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <CardDescription>{member.role}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant="outline" className="capitalize">
                          {member.status}
                        </Badge>
                      </div>
                      {member.phone && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Phone:</span>
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-xs">{member.email}</span>
                        </div>
                      )}
                      {member.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs">
                            {member.location.latitude.toFixed(4)}, {member.location.longitude.toFixed(4)}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>Recent voice and video calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callLogs.map(call => (
                  <Card key={call.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            call.status === 'completed' ? 'bg-green-100 text-green-600' :
                            call.status === 'missed' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getCallIcon(call.type, call.direction)}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {call.direction === 'incoming' ? call.callerName : call.receiverName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="capitalize">{call.direction}</span>
                              <span>•</span>
                              <span className="capitalize">{call.type}</span>
                              <span>•</span>
                              <span>{new Date(call.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={call.status === 'completed' ? 'default' : 'destructive'}>
                            {call.status}
                          </Badge>
                          {call.duration > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {Math.floor(call.duration / 60)}m {call.duration % 60}s
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Messages</CardTitle>
              <CardDescription>System-wide announcements and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcasts.map(broadcast => (
                  <Card key={broadcast.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{broadcast.title}</CardTitle>
                            <Badge variant="outline" className={getPriorityColor(broadcast.priority)}>
                              {broadcast.priority}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {broadcast.type}
                            </Badge>
                          </div>
                          <CardDescription>
                            By {broadcast.senderName} • {new Date(broadcast.timestamp).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{broadcast.message}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>Read by: {broadcast.readBy.length}</span>
                          <span>Acknowledged by: {broadcast.acknowledgedBy.length}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Acknowledge
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}