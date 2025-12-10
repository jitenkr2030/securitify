"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Users, 
  Smartphone,
  Building2,
  FileText,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  QrCode,
  Camera,
  MessageSquare,
  Settings,
  Database,
  Zap,
  Lock,
  Globe,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("features");

  const coreFeatures = [
    {
      icon: MapPin,
      title: "Real-time GPS Tracking",
      description: "Track security guards in real-time with accurate GPS location data and movement patterns",
      benefits: [
        "Live location monitoring",
        "Historical route tracking",
        "Geofence boundary alerts",
        "Speed and direction monitoring"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      icon: AlertTriangle,
      title: "Smart Alert System",
      description: "Comprehensive alert management with instant notifications for security incidents",
      benefits: [
        "Geofence breach alerts",
        "SOS emergency notifications",
        "Late arrival/early departure",
        "Custom alert rules and severity levels"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      icon: Clock,
      title: "Attendance & Payroll",
      description: "Automated attendance tracking with QR code verification and integrated payroll processing",
      benefits: [
        "QR code check-in/out",
        "GPS location verification",
        "Automated salary calculations",
        "Monthly payroll reports"
      ],
      image: "/api/placeholder/600/400"
    },
    {
      icon: Users,
      title: "Guard Management",
      description: "Complete guard profile management with document verification and shift scheduling",
      benefits: [
        "Digital guard profiles",
        "Document verification system",
        "Shift scheduling and management",
        "Performance tracking and analytics"
      ],
      image: "/api/placeholder/600/400"
    }
  ];

  const advancedFeatures = [
    {
      icon: Smartphone,
      title: "Mobile App Integration",
      description: "Native mobile applications for iOS and Android with offline support",
      benefits: [
        "Real-time communication",
        "Offline data synchronization",
        "Push notifications",
        "Intuitive guard interface"
      ]
    },
    {
      icon: Building2,
      title: "Multi-location Support",
      description: "Manage multiple posts and locations with centralized monitoring",
      benefits: [
        "Unlimited post locations",
        "Centralized dashboard",
        "Location-specific settings",
        "Cross-location reporting"
      ]
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Secure document storage and verification for compliance and training",
      benefits: [
        "Aadhaar verification",
        "Police clearance certificates",
        "Training documentation",
        "License management"
      ]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics for operational insights",
      benefits: [
        "Guard performance metrics",
        "Location coverage analysis",
        "Incident trend reports",
        "Custom report builder"
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: Database,
      title: "Multi-tenant Architecture",
      description: "Enterprise-grade multi-tenant SaaS architecture with complete data isolation",
      benefits: [
        "Complete data isolation",
        "Tenant-specific settings",
        "Scalable infrastructure",
        "Custom branding options"
      ]
    },
    {
      icon: Lock,
      title: "Security & Compliance",
      description: "Bank-level security with GDPR compliance and data protection",
      benefits: [
        "End-to-end encryption",
        "GDPR compliant",
        "Regular security audits",
        "Data backup and recovery"
      ]
    },
    {
      icon: Zap,
      title: "Real-time Communication",
      description: "WebSocket-based real-time communication for instant updates",
      benefits: [
        "Live location updates",
        "Instant alert notifications",
        "Real-time messaging",
        "Offline synchronization"
      ]
    },
    {
      icon: Globe,
      title: "API & Integrations",
      description: "Comprehensive API for third-party integrations and custom development",
      benefits: [
        "RESTful API endpoints",
        "Webhook support",
        "Third-party integrations",
        "Custom development tools"
      ]
    }
  ];

  const integrations = [
    { name: "Biometric Devices", icon: Camera, description: "Integration with fingerprint and facial recognition systems" },
    { name: "HR Systems", icon: Users, description: "Seamless integration with existing HR and payroll systems" },
    { name: "Communication Tools", icon: MessageSquare, description: "Integration with Slack, Teams, and other communication platforms" },
    { name: "Analytics Platforms", icon: TrendingUp, description: "Connect with Power BI, Tableau, and other analytics tools" },
    { name: "IoT Devices", icon: Settings, description: "Integration with IoT sensors and security devices" },
    { name: "Payment Systems", icon: Database, description: "Integration with payment gateways and billing systems" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Comprehensive Security Management
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Complete Security Guard
              <span className="block text-blue-300">Management Solution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Professional-grade security management platform with real-time tracking, 
              automated attendance, and comprehensive monitoring capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for Modern Security Operations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage your security team efficiently and effectively
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {coreFeatures.map((feature, index) => (
                  <div key={index} className={`space-y-6 ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                {advancedFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                {technicalFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with your existing tools and systems for a complete security management solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <integration.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription className="text-base">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of security companies already using our platform to streamline their operations and improve efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}