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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Search, 
  Users, 
  Bell,
  CheckCircle,
  Clock,
  Paperclip,
  Image,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { createTenantContext } from "@/lib/db";
import { db } from "@/lib/db";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    photo?: string;
  };
  receiver: {
    id: string;
    name: string;
    photo?: string;
  };
  attachments?: MessageAttachment[];
}

interface MessageAttachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  scheduledAt?: string;
  expiresAt?: string;
  createdAt: string;
  user: {
    name: string;
    photo?: string;
  };
  readBy?: string[];
}

interface Guard {
  id: string;
  name: string;
  phone: string;
  photo?: string | null;
  status: string;
  lastSeen?: string;
}

export default function GuardCommunication() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general",
    priority: "medium"
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(newSocket);

    // Join tenant room
    newSocket.emit('join-tenant', session.user.tenantId);

    // Listen for new messages
    newSocket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for new announcements
    newSocket.on('new-announcement', (announcement: Announcement) => {
      setAnnouncements(prev => [announcement, ...prev]);
    });

    const fetchData = async () => {
      try {
        const tenantId = session.user.tenantId;
        const tenantDb = createTenantContext(tenantId);

        // Fetch guards
        const guardsData = await tenantDb.guard();

        // Fetch locations for guards
        const guardsWithLocations = await Promise.all(
          guardsData.map(async (guard) => {
            const locations = await db.location.findMany({
              where: { guardId: guard.id },
              orderBy: { timestamp: 'desc' },
              take: 1
            });

            return {
              ...guard,
              locations
            };
          })
        );

        const formattedGuards = guardsWithLocations.map(guard => ({
          id: guard.id,
          name: guard.name,
          phone: guard.phone,
          photo: guard.photo,
          status: guard.status,
          lastSeen: guard.locations[0]?.timestamp.toISOString()
        }));

        // Fetch announcements
        const announcementsData = await tenantDb.announcement();

        const formattedAnnouncements = announcementsData.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          priority: announcement.priority,
          status: announcement.status,
          scheduledAt: announcement.scheduledAt?.toISOString(),
          expiresAt: announcement.expiresAt?.toISOString(),
          createdAt: announcement.createdAt.toISOString(),
          user: {
            name: 'System Admin', // Simplified for now
            photo: undefined
          },
          readBy: [] // Simplified for now
        }));

        setGuards(formattedGuards);
        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error("Error fetching communication data:", error);
        // Fallback to mock data
        const mockGuards: Guard[] = [
          {
            id: "1",
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            photo: "/api/placeholder/40/40",
            status: "active",
            lastSeen: new Date().toISOString()
          },
          {
            id: "2",
            name: "Suresh Patel",
            phone: "+91 87654 32109",
            photo: "/api/placeholder/40/40",
            status: "active",
            lastSeen: new Date(Date.now() - 300000).toISOString()
          }
        ];

        const mockAnnouncements: Announcement[] = [
          {
            id: "1",
            title: "Training Schedule Update",
            content: "New training sessions scheduled for next week. Please check your emails for details.",
            type: "training",
            priority: "medium",
            status: "active",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: {
              name: "Admin User",
              photo: "/api/placeholder/40/40"
            },
            readBy: ["1"]
          },
          {
            id: "2",
            title: "Emergency Protocol Update",
            content: "Updated emergency response protocols are now in effect. All guards must review the new procedures.",
            type: "urgent",
            priority: "high",
            status: "active",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            user: {
              name: "Security Manager",
              photo: "/api/placeholder/40/40"
            },
            readBy: []
          }
        ];

        setGuards(mockGuards);
        setAnnouncements(mockAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      newSocket.disconnect();
    };
  }, [status, session]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (guardId: string) => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      // For demo purposes, we'll create mock messages
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hello, how is the situation at your post?",
          type: "text",
          status: "read",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          sender: {
            id: session.user.id,
            name: session.user.name || "Admin",
            photo: "/api/placeholder/40/40"
          },
          receiver: {
            id: guardId,
            name: guards.find(g => g.id === guardId)?.name || "Guard",
            photo: "/api/placeholder/40/40"
          }
        },
        {
          id: "2",
          content: "Everything is normal here. No issues to report.",
          type: "text",
          status: "read",
          createdAt: new Date(Date.now() - 3000000).toISOString(),
          sender: {
            id: guardId,
            name: guards.find(g => g.id === guardId)?.name || "Guard",
            photo: "/api/placeholder/40/40"
          },
          receiver: {
            id: session.user.id,
            name: session.user.name || "Admin",
            photo: "/api/placeholder/40/40"
          }
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGuard || !session) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        type: "text",
        status: "sent",
        createdAt: new Date().toISOString(),
        sender: {
          id: session.user.id,
          name: session.user.name || "Admin",
          photo: "/api/placeholder/40/40"
        },
        receiver: {
          id: selectedGuard.id,
          name: selectedGuard.name,
          photo: selectedGuard.photo || undefined
        }
      };

      // Add to local state
      setMessages(prev => [...prev, message]);

      // Emit via socket
      if (socket) {
        socket.emit('send-message', {
          receiverId: selectedGuard.id,
          content: newMessage,
          type: 'text'
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!session) return;

    try {
      const tenantId = session.user.tenantId;
      const tenantDb = createTenantContext(tenantId);

      const announcement = await tenantDb.createAnnouncement({
        data: {
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          type: newAnnouncement.type,
          priority: newAnnouncement.priority,
          userId: session.user.id
        },
        include: {
          user: true,
          announcementReads: true
        }
      });

      const formattedAnnouncement = {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        status: announcement.status,
        createdAt: announcement.createdAt.toISOString(),
        user: {
          name: session.user.name || "Admin",
          photo: undefined
        },
        readBy: []
      };

      setAnnouncements(prev => [formattedAnnouncement, ...prev]);

      // Emit via socket
      if (socket) {
        socket.emit('new-announcement', formattedAnnouncement);
      }

      setNewAnnouncement({
        title: "",
        content: "",
        type: "general",
        priority: "medium"
      });
      setIsAnnouncementDialogOpen(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleGuardSelect = (guard: Guard) => {
    setSelectedGuard(guard);
    fetchMessages(guard.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "general": return "bg-gray-500";
      case "urgent": return "bg-red-500";
      case "training": return "bg-blue-500";
      case "policy": return "bg-purple-500";
      case "maintenance": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

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
          <h1 className="text-3xl font-bold">Guard Communication</h1>
          <p className="text-muted-foreground">Real-time messaging and announcements</p>
        </div>
        <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Bell className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Send an announcement to all guards
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Announcement content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAnnouncement}>
                  Send Announcement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guards List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Guards</span>
            </CardTitle>
            <CardDescription>Select a guard to start messaging</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {guards.map((guard) => (
                  <div
                    key={guard.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGuard?.id === guard.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleGuardSelect(guard)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={guard.photo || undefined} alt={guard.name} />
                        <AvatarFallback>{guard.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{guard.name}</h4>
                          <Badge variant="secondary" className={`${guard.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs`}>
                            {guard.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{guard.phone}</p>
                        {guard.lastSeen && (
                          <p className="text-xs text-muted-foreground">
                            Last seen: {new Date(guard.lastSeen).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{selectedGuard ? `Chat with ${selectedGuard.name}` : 'Select a guard to chat'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100vh-20rem)]">
            {selectedGuard ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender.id === session?.user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a guard to start chatting</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Announcements</span>
          </CardTitle>
          <CardDescription>Recent announcements and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`${getTypeColor(announcement.type)} text-white`}>
                      {announcement.type}
                    </Badge>
                    <Badge variant="outline" className={`${getPriorityColor(announcement.priority)} text-white`}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-2">{announcement.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={announcement.user.photo || undefined} alt={announcement.user.name} />
                      <AvatarFallback className="text-xs">{announcement.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{announcement.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{announcement.readBy?.length || 0} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}