"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Phone,
  Mail,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  ExternalLink,
  Download,
  FileText,
  PlayCircle,
  Headphones,
  Shield,
  Zap,
  Settings,
  Smartphone,
  MapPin,
  AlertTriangle,
  Calendar,
  User,
  Database,
  Key,
  Globe
} from "lucide-react";

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", count: 48 },
    { id: "getting-started", name: "Getting Started", count: 12 },
    { id: "features", name: "Features", count: 15 },
    { id: "troubleshooting", name: "Troubleshooting", count: 10 },
    { id: "billing", name: "Billing", count: 6 },
    { id: "api", name: "API", count: 5 }
  ];

  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with Securitify",
      category: "getting-started",
      difficulty: "Beginner",
      readTime: "5 min",
      description: "Learn how to set up your account and start using our platform effectively.",
      content: "Welcome to Securitify! This guide will walk you through the initial setup process...",
      tags: ["setup", "onboarding", "basics"],
      popular: true,
      updated: "2024-01-15"
    },
    {
      id: 2,
      title: "Setting Up Your First Security Post",
      category: "features",
      difficulty: "Beginner",
      readTime: "8 min",
      description: "Step-by-step guide to creating and configuring your first security post.",
      content: "Creating a security post is the first step in setting up your security management system...",
      tags: ["posts", "setup", "configuration"],
      popular: true,
      updated: "2024-01-12"
    },
    {
      id: 3,
      title: "Managing Guard Profiles and Information",
      category: "features",
      difficulty: "Intermediate",
      readTime: "10 min",
      description: "Learn how to create and manage guard profiles with all necessary information.",
      content: "Guard profiles are the foundation of your security management system...",
      tags: ["guards", "profiles", "management"],
      popular: false,
      updated: "2024-01-10"
    },
    {
      id: 4,
      title: "GPS Tracking Not Working - Troubleshooting Guide",
      category: "troubleshooting",
      difficulty: "Intermediate",
      readTime: "7 min",
      description: "Common issues with GPS tracking and how to resolve them quickly.",
      content: "GPS tracking issues can be frustrating, but most problems have simple solutions...",
      tags: ["gps", "tracking", "troubleshooting"],
      popular: true,
      updated: "2024-01-08"
    },
    {
      id: 5,
      title: "Understanding Your Subscription and Billing",
      category: "billing",
      difficulty: "Beginner",
      readTime: "6 min",
      description: "Everything you need to know about your subscription plan and billing.",
      content: "Your subscription plan determines the features and limits available to your organization...",
      tags: ["billing", "subscription", "pricing"],
      popular: false,
      updated: "2024-01-05"
    },
    {
      id: 6,
      title: "API Authentication and Getting Started",
      category: "api",
      difficulty: "Advanced",
      readTime: "12 min",
      description: "Learn how to authenticate with our API and make your first requests.",
      content: "Our API provides programmatic access to all Securitify features...",
      tags: ["api", "authentication", "development"],
      popular: false,
      updated: "2024-01-03"
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Complete Platform Overview",
      duration: "15:32",
      views: "12.5K",
      description: "A comprehensive tour of all Securitify features and capabilities.",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 2,
      title: "Mobile App Setup and Usage",
      duration: "8:45",
      views: "8.2K",
      description: "Learn how to set up and use our mobile app for guards and supervisors.",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 3,
      title: "Advanced Reporting and Analytics",
      duration: "12:18",
      views: "6.7K",
      description: "Discover how to generate detailed reports and analyze your security operations.",
      thumbnail: "/api/placeholder/320/180"
    }
  ];

  const quickStarts = [
    {
      title: "Account Setup",
      description: "Get your account up and running in minutes",
      icon: User,
      steps: 5,
      time: "10 min"
    },
    {
      title: "Add Your First Guard",
      description: "Create guard profiles and assign roles",
      icon: Users,
      steps: 4,
      time: "8 min"
    },
    {
      title: "Create Security Posts",
      description: "Set up your first security locations",
      icon: MapPin,
      steps: 3,
      time: "5 min"
    },
    {
      title: "Configure Mobile App",
      description: "Get your team started with the mobile app",
      icon: Smartphone,
      steps: 6,
      time: "12 min"
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Help Center
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Can We
              <span className="block text-blue-300">Help You?</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Find answers, get support, and learn how to make the most of 
              Securitify with our comprehensive help resources.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guides */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start Guides</h2>
            <p className="text-lg text-muted-foreground">
              Get up and running quickly with our step-by-step guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStarts.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <guide.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription className="text-base">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      {guide.steps} steps
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {guide.time}
                    </div>
                  </div>
                  <Button className="w-full">
                    Start Guide
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Help Topics</h2>
            <p className="text-lg text-muted-foreground">
              Most frequently asked questions and common issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Account & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Reset your password</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Manage user permissions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-green-600" />
                  <span>Platform Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Create your first post</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Add guards to your team</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Configure notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span>Mobile App</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Download and install the app</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Troubleshoot app issues</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Enable offline mode</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Help Articles</h2>
                <p className="text-lg text-muted-foreground">
                  Browse our comprehensive library of help articles and guides
                </p>
              </div>

              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {article.popular && (
                              <Badge className="bg-orange-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            <Badge variant="outline" className="capitalize">
                              {article.category.replace("-", " ")}
                            </Badge>
                            <Badge variant="secondary">
                              {article.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                          <CardDescription className="text-base">
                            {article.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Updated {new Date(article.updated).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline">
                          Read Article
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Tutorials</h2>
            <p className="text-lg text-muted-foreground">
              Watch our video guides to learn visually
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {video.views} views
                    </div>
                    <Button variant="outline" size="sm">
                      Watch
                      <PlayCircle className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get detailed help via email within 24 hours
                  </p>
                  <Button variant="outline" className="w-full">Send Email</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Phone Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak directly with our support team
                  </p>
                  <Button variant="outline" className="w-full">Call Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}