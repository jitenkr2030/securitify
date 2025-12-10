"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  User, 
  Search, 
  Clock, 
  ArrowRight, 
  Filter,
  TrendingUp,
  Lightbulb,
  Shield,
  Users,
  Zap,
  FileText,
  MessageSquare,
  Star,
  Share2,
  BookmarkPlus
} from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "product", name: "Product Updates", count: 8 },
    { id: "security", name: "Security", count: 6 },
    { id: "technology", name: "Technology", count: 5 },
    { id: "business", name: "Business", count: 3 },
    { id: "tutorials", name: "Tutorials", count: 2 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Revolutionizing Security Management: The Future is Here",
      excerpt: "Discover how modern technology is transforming security operations and what the future holds for the industry.",
      content: "The security industry is undergoing a massive transformation driven by technological advancements...",
      author: "Rajesh Kumar",
      authorRole: "CEO & Founder",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "business",
      tags: ["Security", "Technology", "Innovation"],
      featured: true,
      image: "/api/placeholder/800/400",
      likes: 234,
      comments: 45,
      views: 1523
    },
    {
      id: 2,
      title: "New Mobile App Features: Offline Mode Enhanced",
      excerpt: "We're excited to announce major improvements to our mobile app's offline capabilities and performance.",
      content: "Our latest mobile app update brings significant improvements to offline functionality...",
      author: "Priya Sharma",
      authorRole: "CTO",
      date: "2024-01-12",
      readTime: "3 min read",
      category: "product",
      tags: ["Mobile", "Features", "Updates"],
      featured: false,
      image: "/api/placeholder/800/400",
      likes: 189,
      comments: 23,
      views: 892
    },
    {
      id: 3,
      title: "Best Practices for Security Guard Training in 2024",
      excerpt: "Essential training methodologies and best practices for modern security guard programs.",
      content: "Effective security guard training is crucial for maintaining high standards...",
      author: "Amit Patel",
      authorRole: "Head of Product",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "security",
      tags: ["Training", "Best Practices", "Security"],
      featured: false,
      image: "/api/placeholder/800/400",
      likes: 156,
      comments: 34,
      views: 745
    },
    {
      id: 4,
      title: "Understanding Multi-tenant SaaS Architecture",
      excerpt: "Deep dive into the technical architecture behind our multi-tenant SaaS platform.",
      content: "Building a scalable multi-tenant SaaS platform requires careful architectural decisions...",
      author: "Sneha Reddy",
      authorRole: "VP of Engineering",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "technology",
      tags: ["Architecture", "SaaS", "Technical"],
      featured: false,
      image: "/api/placeholder/800/400",
      likes: 298,
      comments: 67,
      views: 2103
    },
    {
      id: 5,
      title: "How to Choose the Right Security Management Software",
      excerpt: "A comprehensive guide to selecting the best security management solution for your organization.",
      content: "Choosing the right security management software is a critical decision...",
      author: "Priya Sharma",
      authorRole: "CTO",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "business",
      tags: ["Guide", "Selection", "Software"],
      featured: false,
      image: "/api/placeholder/800/400",
      likes: 145,
      comments: 28,
      views: 634
    },
    {
      id: 6,
      title: "API Integration Guide: Connecting Your Systems",
      excerpt: "Step-by-step tutorial on integrating our API with your existing systems.",
      content: "Our comprehensive API makes it easy to connect Securitify with your existing systems...",
      author: "Sneha Reddy",
      authorRole: "VP of Engineering",
      date: "2024-01-03",
      readTime: "8 min read",
      category: "tutorials",
      tags: ["API", "Integration", "Tutorial"],
      featured: false,
      image: "/api/placeholder/800/400",
      likes: 267,
      comments: 52,
      views: 1876
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Blog & Insights
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Security Management
              <span className="block text-purple-300">Blog & Resources</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Expert insights, product updates, and industry trends from the Securitify team.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Article</h2>
            </div>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gray-300 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className="bg-purple-600">Featured</Badge>
                    <Badge variant="outline">{featuredPost.category}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/company/blog/${featuredPost.id}`}>
                    <Button>
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest in security management technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/company/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 text-blue-100">
              Subscribe to our newsletter for the latest articles, product updates, and industry insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Topics</h2>
            <p className="text-lg text-muted-foreground">
              Explore our most popular content categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Security Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Latest security protocols and industry standards
                </p>
                <Badge variant="outline">12 Articles</Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Technology Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Emerging technologies in security management
                </p>
                <Badge variant="outline">8 Articles</Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Effective strategies for managing security teams
                </p>
                <Badge variant="outline">6 Articles</Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Cutting-edge innovations in security technology
                </p>
                <Badge variant="outline">9 Articles</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}