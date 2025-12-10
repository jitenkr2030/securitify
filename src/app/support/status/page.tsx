"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Wifi,
  Server,
  Database,
  Smartphone,
  Globe,
  MapPin,
  Calendar,
  RefreshCw,
  Bell,
  Mail,
  MessageSquare,
  ExternalLink,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  AlertCircle,
  Info,
  Filter,
  Search
} from "lucide-react";

export default function StatusPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  const systemStatus = {
    overall: "operational",
    lastUpdated: "2024-01-15T14:30:00Z",
    uptime: "99.9%"
  };

  const services = [
    {
      name: "Web Application",
      status: "operational",
      description: "Main web application and dashboard",
      uptime: "99.95%",
      responseTime: "145ms",
      lastIncident: null
    },
    {
      name: "Mobile API",
      status: "operational",
      description: "API endpoints for mobile applications",
      uptime: "99.98%",
      responseTime: "89ms",
      lastIncident: null
    },
    {
      name: "Database",
      status: "operational",
      description: "Primary database cluster",
      uptime: "99.99%",
      responseTime: "12ms",
      lastIncident: null
    },
    {
      name: "Real-time Tracking",
      status: "degraded",
      description: "GPS tracking and location services",
      uptime: "98.5%",
      responseTime: "234ms",
      lastIncident: {
        date: "2024-01-15T10:15:00Z",
        description: "Increased latency in location updates",
        resolved: false
      }
    },
    {
      name: "Notification System",
      status: "operational",
      description: "Email, SMS, and push notifications",
      uptime: "99.92%",
      responseTime: "156ms",
      lastIncident: null
    },
    {
      name: "File Storage",
      status: "operational",
      description: "Document and media file storage",
      uptime: "99.97%",
      responseTime: "78ms",
      lastIncident: null
    }
  ];

  const incidents = [
    {
      id: 1,
      title: "Increased latency in real-time tracking",
      description: "Users are experiencing increased latency in GPS location updates. Our team is investigating the issue.",
      status: "investigating",
      severity: "medium",
      affectedServices: ["Real-time Tracking"],
      startedAt: "2024-01-15T10:15:00Z",
      updates: [
        {
          timestamp: "2024-01-15T10:15:00Z",
          message: "Investigating reports of increased latency in GPS tracking services.",
          author: "System Monitor"
        },
        {
          timestamp: "2024-01-15T10:30:00Z",
          message: "Identified potential cause in location processing pipeline. Working on fix.",
          author: "Engineering Team"
        }
      ]
    },
    {
      id: 2,
      title: "Brief database connectivity issues",
      description: "Users experienced brief connectivity issues with the primary database.",
      status: "resolved",
      severity: "low",
      affectedServices: ["Database"],
      startedAt: "2024-01-14T14:20:00Z",
      resolvedAt: "2024-01-14T14:35:00Z",
      updates: [
        {
          timestamp: "2024-01-14T14:20:00Z",
          message: "Investigating database connectivity issues.",
          author: "System Monitor"
        },
        {
          timestamp: "2024-01-14T14:25:00Z",
          message: "Issue identified. Working on resolution.",
          author: "Database Team"
        },
        {
          timestamp: "2024-01-14T14:35:00Z",
          message: "Issue resolved. All systems back to normal.",
          author: "Database Team"
        }
      ]
    },
    {
      id: 3,
      title: "Mobile app deployment completed",
      description: "Successfully deployed new version of mobile applications with enhanced features.",
      status: "resolved",
      severity: "maintenance",
      affectedServices: ["Mobile API"],
      startedAt: "2024-01-13T02:00:00Z",
      resolvedAt: "2024-01-13T03:30:00Z",
      updates: [
        {
          timestamp: "2024-01-13T02:00:00Z",
          message: "Starting scheduled maintenance for mobile API deployment.",
          author: "DevOps Team"
        },
        {
          timestamp: "2024-01-13T03:15:00Z",
          message: "Deployment proceeding as planned.",
          author: "DevOps Team"
        },
        {
          timestamp: "2024-01-13T03:30:00Z",
          message: "Maintenance completed successfully. All services operational.",
          author: "DevOps Team"
        }
      ]
    }
  ];

  const maintenanceWindows = [
    {
      id: 1,
      title: "Database maintenance and optimization",
      description: "Scheduled database maintenance to improve performance and apply security patches.",
      scheduledStart: "2024-01-20T02:00:00Z",
      scheduledEnd: "2024-01-20T04:00:00Z",
      affectedServices: ["Database", "Web Application"],
      impact: "Brief interruptions expected"
    },
    {
      id: 2,
      title: "API infrastructure upgrade",
      description: "Upgrading API infrastructure to improve scalability and reliability.",
      scheduledStart: "2024-01-25T01:00:00Z",
      scheduledEnd: "2024-01-25T03:00:00Z",
      affectedServices: ["Mobile API", "Real-time Tracking"],
      impact: "Minimal impact expected"
    }
  ];

  const metrics = [
    {
      name: "Response Time",
      current: 145,
      average: 132,
      unit: "ms",
      trend: "up",
      status: "normal"
    },
    {
      name: "Uptime",
      current: 99.9,
      average: 99.8,
      unit: "%",
      trend: "up",
      status: "good"
    },
    {
      name: "Error Rate",
      current: 0.1,
      average: 0.2,
      unit: "%",
      trend: "down",
      status: "good"
    },
    {
      name: "Active Users",
      current: 2847,
      average: 2654,
      unit: "",
      trend: "up",
      status: "normal"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "outage":
        return "text-red-600";
      case "maintenance":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              System Status
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              System Status &
              <span className="block text-green-300">Performance</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Real-time monitoring of our platform's performance and availability. 
              Stay informed about system status and incidents.
            </p>
            
            {/* Overall Status */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {getStatusIcon(systemStatus.overall)}
              <div>
                <div className="text-2xl font-bold capitalize">{systemStatus.overall}</div>
                <div className="text-sm text-green-100">
                  Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Subscribe to Updates
                <Bell className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                View Historical Data
                <Activity className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current System Status</h2>
            <p className="text-lg text-muted-foreground">
              Real-time status of all our services and components
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    {getStatusIcon(service.status)}
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`font-medium ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Response Time:</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                    
                    {service.lastIncident && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Active Incident
                          </span>
                        </div>
                        <div className="text-xs text-yellow-700 mt-1">
                          {service.lastIncident.description}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Performance Metrics</h2>
            <p className="text-lg text-muted-foreground">
              Key performance indicators and system health metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold">
                      {metric.current}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg: {metric.average}{metric.unit}
                  </div>
                  <div className="mt-2">
                    <Badge 
                      variant={metric.status === "good" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Active Incidents */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Active Incidents</h2>
            <p className="text-lg text-muted-foreground">
              Current and recent system incidents and their status
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {incidents.filter(incident => incident.status !== "resolved").map((incident) => (
              <Card key={incident.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span>{incident.title}</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {incident.description}
                      </CardDescription>
                    </div>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Started: {new Date(incident.startedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Status: {incident.status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2">Affected Services:</div>
                      <div className="flex flex-wrap gap-2">
                        {incident.affectedServices.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2">Updates:</div>
                      <div className="space-y-2">
                        {incident.updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="text-sm">{update.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {update.author} • {new Date(update.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {incidents.filter(incident => incident.status !== "resolved").length === 0 && (
            <div className="text-center py-12 max-w-4xl mx-auto">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Systems Operational</h3>
              <p className="text-gray-600">There are currently no active incidents affecting our services.</p>
            </div>
          )}
        </div>
      </section>

      {/* Maintenance Schedule */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Scheduled Maintenance</h2>
            <p className="text-lg text-muted-foreground">
              Upcoming maintenance windows and planned system updates
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {maintenanceWindows.map((maintenance) => (
              <Card key={maintenance.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>{maintenance.title}</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {maintenance.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-500 text-white">SCHEDULED</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="font-medium text-sm mb-2">Schedule:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Start: {new Date(maintenance.scheduledStart).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>End: {new Date(maintenance.scheduledEnd).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-2">Impact:</div>
                      <div className="space-y-2">
                        <div className="text-sm">{maintenance.impact}</div>
                        <div className="flex flex-wrap gap-1">
                          {maintenance.affectedServices.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to status updates and get notified about incidents and maintenance
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <Bell className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get email alerts for critical incidents
                  </p>
                  <Button variant="outline" className="w-full">Subscribe</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">SMS Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Receive SMS notifications for urgent issues
                  </p>
                  <Button variant="outline" className="w-full">Subscribe</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Wifi className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Webhook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integrate status updates with your systems
                  </p>
                  <Button variant="outline" className="w-full">Configure</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}