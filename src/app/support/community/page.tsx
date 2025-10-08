"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  Search, 
  Calendar, 
  Eye, 
  ThumbsUp,
  Share2,
  BookmarkPlus,
  Filter,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Hash,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Lightbulb,
  HelpCircle,
  Bell,
  Settings,
  Plus,
  ExternalLink,
  Clock,
  User,
  CheckCircle,
  Zap,
  Pin,
  BookOpen
} from "lucide-react";

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", count: 156 },
    { id: "general", name: "General Discussion", count: 45 },
    { id: "technical", name: "Technical Support", count: 38 },
    { id: "features", name: "Feature Requests", count: 32 },
    { id: "showcase", name: "Show & Tell", count: 21 },
    { id: "announcements", name: "Announcements", count: 20 }
  ];

  const forumPosts = [
    {
      id: 1,
      title: "How to implement custom geofencing rules?",
      author: "Rajesh Kumar",
      authorRole: "Security Manager",
      category: "technical",
      tags: ["geofencing", "custom-rules", "api"],
      content: "I'm trying to implement custom geofencing rules for our security posts. Has anyone done this before? I need to create irregular shaped boundaries...",
      likes: 23,
      replies: 12,
      views: 156,
      timestamp: "2 hours ago",
      isSolved: false,
      isPinned: false,
      authorAvatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      title: "Success story: Reduced response time by 40% using real-time tracking",
      author: "Priya Sharma",
      authorRole: "Operations Director",
      category: "showcase",
      tags: ["success-story", "real-time", "tracking"],
      content: "I wanted to share our success story. After implementing Securitify, we've reduced our emergency response time by 40%. Here's how we did it...",
      likes: 67,
      replies: 28,
      views: 423,
      timestamp: "5 hours ago",
      isSolved: false,
      isPinned: true,
      authorAvatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      title: "Feature request: Bulk guard import from Excel",
      author: "Amit Patel",
      authorRole: "System Administrator",
      category: "features",
      tags: ["feature-request", "bulk-import", "excel"],
      content: "It would be great to have a feature to import guard data from Excel files in bulk. Currently, we have to add each guard manually...",
      likes: 45,
      replies: 15,
      views: 289,
      timestamp: "1 day ago",
      isSolved: false,
      isPinned: false,
      authorAvatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      title: "Mobile app offline mode not syncing properly",
      author: "Sneha Reddy",
      authorRole: "Field Supervisor",
      category: "technical",
      tags: ["mobile-app", "offline-mode", "sync"],
      content: "We're having issues with the mobile app's offline mode. Guards can check in offline, but the data doesn't sync when they come back online...",
      likes: 18,
      replies: 8,
      views: 134,
      timestamp: "1 day ago",
      isSolved: true,
      isPinned: false,
      authorAvatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      title: "Welcome to the Securitify Community!",
      author: "Securitify Team",
      authorRole: "Official",
      category: "announcements",
      tags: ["welcome", "community", "announcement"],
      content: "Welcome to our official community forum! This is the place to connect with other users, share experiences, and get help from both the community and our team...",
      likes: 89,
      replies: 34,
      views: 567,
      timestamp: "3 days ago",
      isSolved: false,
      isPinned: true,
      authorAvatar: "/api/placeholder/40/40"
    }
  ];

  const upcomingEvents = [
    {
      title: "Monthly Product Demo",
      date: "2024-01-25",
      time: "14:00 UTC",
      description: "Live demo of new features and Q&A session with the product team",
      attendees: 234,
      maxAttendees: 500,
      type: "webinar"
    },
    {
      title: "Security Management Best Practices",
      date: "2024-02-01",
      time: "10:00 UTC",
      description: "Industry experts share best practices for modern security management",
      attendees: 156,
      maxAttendees: 300,
      type: "workshop"
    },
    {
      title: "API Integration Workshop",
      date: "2024-02-08",
      time: "15:00 UTC",
      description: "Hands-on workshop for integrating with our API",
      attendees: 89,
      maxAttendees: 100,
      type: "workshop"
    }
  ];

  const topContributors = [
    {
      name: "Rajesh Kumar",
      role: "Security Manager",
      posts: 156,
      helpfulAnswers: 89,
      joined: "2023-06-15",
      badges: ["Expert", "Helper", "Community Leader"],
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Priya Sharma",
      role: "Operations Director",
      posts: 134,
      helpfulAnswers: 76,
      joined: "2023-07-20",
      badges: ["Expert", "Mentor"],
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Amit Patel",
      role: "System Administrator",
      posts: 98,
      helpfulAnswers: 65,
      joined: "2023-08-10",
      badges: ["Helper", "Tech Expert"],
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Sneha Reddy",
      role: "Field Supervisor",
      posts: 87,
      helpfulAnswers: 54,
      joined: "2023-09-05",
      badges: ["Helper", "Rising Star"],
      avatar: "/api/placeholder/60/60"
    }
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Community
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our Security
              <span className="block text-purple-300">Management Community</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Connect with security professionals, share experiences, and learn from experts 
              in our vibrant community forum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg">
                Join the Community
                <Users className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg">
                Browse Discussions
                <MessageSquare className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-600 mb-2">2,847</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
                <div className="text-sm text-muted-foreground">Discussion Topics</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <ThumbsUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-600 mb-2">5,678</div>
                <div className="text-sm text-muted-foreground">Helpful Answers</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
                <div className="text-sm text-muted-foreground">Questions Solved</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Upcoming Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.attendees}/{event.maxAttendees} attendees
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Register
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Contributors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Top Contributors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{contributor.name}</div>
                          <div className="text-xs text-muted-foreground">{contributor.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">{contributor.helpfulAnswers}</div>
                          <div className="text-xs text-muted-foreground">helpful</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Forum Area */}
            <div className="lg:col-span-3">
              {/* Search and Create Post */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {/* Forum Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-purple-600" />
                            )}
                            {post.isSolved && (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Solved
                              </Badge>
                            )}
                            <Badge variant="outline" className="capitalize">
                              {post.category}
                            </Badge>
                            {post.authorRole === "Official" && (
                              <Badge className="bg-blue-500 text-white">Official</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl mb-2 hover:text-purple-600 cursor-pointer">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-base line-clamp-2">
                            {post.content}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div>
                              <div className="font-medium text-sm">{post.author}</div>
                              <div className="text-xs text-muted-foreground">{post.authorRole}</div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.timestamp}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.replies}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">
                          Read More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Guidelines</h2>
            <p className="text-lg text-muted-foreground">
              Help us maintain a positive and productive community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Be Respectful</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Treat everyone with respect and courtesy. We're all here to learn and help each other.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Share Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share your experiences and help others learn from your successes and challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Stay On Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep discussions relevant to security management and our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Connect with thousands of security professionals, share your experiences, 
            and get help from experts in the field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg">
              Sign Up Now
              <Users className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg">
              Learn More
              <BookOpen className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}