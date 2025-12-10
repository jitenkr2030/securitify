"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Code, 
  Download, 
  ExternalLink, 
  FileText,
  Users,
  Settings,
  Shield,
  Zap,
  Smartphone,
  MapPin,
  Database,
  Key,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Calendar,
  Filter,
  ChevronRight,
  Github,
  File,
  Video,
  Image,
  AlertCircle,
  Info,
  Headphones
} from "lucide-react";

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("v2.1");

  const versions = ["v2.1", "v2.0", "v1.9"];

  const documentationSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Quick start guides and basic setup instructions",
      icon: BookOpen,
      articles: [
        { title: "Installation Guide", level: "Beginner", time: "10 min" },
        { title: "Account Setup", level: "Beginner", time: "5 min" },
        { title: "First Security Post", level: "Beginner", time: "8 min" },
        { title: "Adding Guards", level: "Beginner", time: "6 min" },
        { title: "Mobile App Setup", level: "Beginner", time: "12 min" }
      ]
    },
    {
      id: "core-features",
      title: "Core Features",
      description: "In-depth guides for all platform features",
      icon: Settings,
      articles: [
        { title: "Guard Management", level: "Intermediate", time: "15 min" },
        { title: "Real-time GPS Tracking", level: "Intermediate", time: "12 min" },
        { title: "Attendance System", level: "Intermediate", time: "10 min" },
        { title: "Shift Scheduling", level: "Intermediate", time: "8 min" },
        { title: "Document Management", level: "Intermediate", time: "6 min" }
      ]
    },
    {
      id: "mobile-apps",
      title: "Mobile Applications",
      description: "Mobile app guides and troubleshooting",
      icon: Smartphone,
      articles: [
        { title: "iOS App Guide", level: "Beginner", time: "8 min" },
        { title: "Android App Guide", level: "Beginner", time: "8 min" },
        { title: "Offline Mode", level: "Intermediate", time: "6 min" },
        { title: "Push Notifications", level: "Intermediate", time: "5 min" },
        { title: "App Troubleshooting", level: "Advanced", time: "10 min" }
      ]
    },
    {
      id: "api-reference",
      title: "API Reference",
      description: "Complete API documentation and examples",
      icon: Code,
      articles: [
        { title: "Authentication", level: "Intermediate", time: "8 min" },
        { title: "Guards API", level: "Intermediate", time: "12 min" },
        { title: "Locations API", level: "Intermediate", time: "10 min" },
        { title: "Attendance API", level: "Intermediate", time: "8 min" },
        { title: "Webhooks", level: "Advanced", time: "15 min" }
      ]
    },
    {
      id: "administration",
      title: "Administration",
      description: "System administration and configuration",
      icon: Shield,
      articles: [
        { title: "User Management", level: "Intermediate", time: "10 min" },
        { title: "Role-based Access", level: "Intermediate", time: "8 min" },
        { title: "Tenant Settings", level: "Advanced", time: "12 min" },
        { title: "Security Configuration", level: "Advanced", time: "15 min" },
        { title: "Data Export", level: "Advanced", time: "8 min" }
      ]
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Third-party integrations and connectors",
      icon: Zap,
      articles: [
        { title: "Biometric Systems", level: "Advanced", time: "12 min" },
        { title: "HR Systems", level: "Intermediate", time: "10 min" },
        { title: "Communication Tools", level: "Intermediate", time: "8 min" },
        { title: "Analytics Platforms", level: "Advanced", time: "15 min" },
        { title: "Custom Integrations", level: "Advanced", time: "20 min" }
      ]
    }
  ];

  const quickStarts = [
    {
      title: "5-Minute Quick Start",
      description: "Get up and running in minutes",
      steps: ["Create account", "Add first guard", "Create security post", "Download mobile app"],
      time: "5 min",
      difficulty: "Beginner"
    },
    {
      title: "Complete Setup Guide",
      description: "Full platform configuration",
      steps: ["Account setup", "Team configuration", "Posts setup", "Mobile deployment", "Testing"],
      time: "30 min",
      difficulty: "Intermediate"
    },
    {
      title: "API Integration",
      description: "Connect your systems",
      steps: ["Get API key", "Authentication", "First API call", "Webhook setup", "Testing"],
      time: "45 min",
      difficulty: "Advanced"
    }
  ];

  const releaseNotes = [
    {
      version: "v2.1.0",
      date: "2024-01-15",
      type: "Major Release",
      changes: [
        "New: Enhanced offline mode for mobile apps",
        "New: Advanced reporting dashboard",
        "Improved: GPS tracking accuracy",
        "Fixed: Attendance sync issues",
        "Security: Enhanced data encryption"
      ]
    },
    {
      version: "v2.0.5",
      date: "2024-01-08",
      type: "Patch Release",
      changes: [
        "Fixed: Mobile app crash on older devices",
        "Improved: Load times for large datasets",
        "Fixed: Notification delivery issues"
      ]
    },
    {
      version: "v2.0.0",
      date: "2024-01-01",
      type: "Major Release",
      changes: [
        "New: Complete UI redesign",
        "New: Multi-tenant architecture",
        "New: Advanced analytics features",
        "Improved: Performance optimizations",
        "Security: Enhanced authentication system"
      ]
    }
  ];

  const filteredSections = documentationSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Documentation
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Complete Documentation
              <span className="block text-green-300">for Developers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Everything you need to integrate, customize, and extend Securitify.
              From quick start guides to advanced API references.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Version Selector */}
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm">Version:</span>
              <div className="flex space-x-2">
                {versions.map((version) => (
                  <Button
                    key={version}
                    variant={selectedVersion === version ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVersion(version)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {version}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start Guides</h2>
            <p className="text-lg text-muted-foreground">
              Choose your path and get started quickly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {quickStarts.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                    <Badge variant={guide.difficulty === "Beginner" ? "default" : "secondary"}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{guide.time}</span>
                      </div>
                      <div className="font-medium">Steps:</div>
                      <ul className="space-y-1">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-600">{stepIndex + 1}</span>
                            </div>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">
                      Start Guide
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Documentation Sections</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive guides for all aspects of the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{article.title}</div>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs">
                              {article.level}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.time}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Articles
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">API Reference</h2>
            <p className="text-lg text-muted-foreground">
              Complete API documentation with examples and SDKs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>REST API</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive RESTful API for all platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Full CRUD operations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">JSON/XML responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Rate limiting & authentication</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  View API Docs
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-green-600" />
                  <span>SDKs & Libraries</span>
                </CardTitle>
                <CardDescription>
                  Official SDKs for popular programming languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">JavaScript/TypeScript</span>
                    <Badge variant="outline">v2.1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Python</span>
                    <Badge variant="outline">v2.1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">cURL</span>
                    <Badge variant="outline">v2.1</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Download SDKs
                  <Github className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Release Notes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Release Notes</h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest features and improvements
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {releaseNotes.map((release, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{release.version}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{new Date(release.date).toLocaleDateString()}</span>
                        <Badge variant={release.type === "Major Release" ? "default" : "secondary"}>
                          {release.type}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {release.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start space-x-2">
                        {change.startsWith("New:") ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : change.startsWith("Improved:") ? (
                          <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        ) : change.startsWith("Fixed:") ? (
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{change}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-lg text-muted-foreground">
              More resources to help you succeed
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Video className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step video guides for visual learners
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Github className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <CardTitle>GitHub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Open source projects and code examples
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View on GitHub
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our developer community forum
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  SDKs, tools, and documentation downloads
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Download Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Need More Help?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
              Contact Support
              <Headphones className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
              Join Community
              <Users className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}