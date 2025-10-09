"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Users, MapPin, AlertTriangle, Clock, Smartphone, Building2, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGlobalSearchShortcut } from "@/hooks/useKeyboardShortcuts";

interface SearchResult {
  id: string;
  type: 'feature' | 'pricing' | 'documentation' | 'page' | 'api' | 'blog' | 'support';
  title: string;
  description: string;
  url: string;
  category?: string;
  priority?: number;
  tags?: string[];
  icon?: React.ComponentType<any>;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
}

export default function GlobalSearch({ placeholder = "Search features, pricing, docs...", className = "" }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Setup keyboard shortcut
  useGlobalSearchShortcut(() => setIsOpen(true));

  // Mock search data - in a real app, this would come from an API
  const searchData: SearchResult[] = [
    // Features
    {
      id: "real-time-tracking",
      type: "feature",
      title: "Real-time GPS Tracking",
      description: "Track security guards in real-time with accurate GPS location data and movement analytics",
      url: "/product#tracking",
      category: "Core Features",
      priority: 1,
      tags: ["gps", "tracking", "real-time", "location"],
      icon: MapPin
    },
    {
      id: "smart-alerts",
      type: "feature",
      title: "Smart Alerts & Notifications",
      description: "Get instant notifications for geofence breaches, SOS alerts, and unusual activities",
      url: "/product#alerts",
      category: "Core Features",
      priority: 1,
      tags: ["alerts", "notifications", "sos", "geofence"],
      icon: AlertTriangle
    },
    {
      id: "attendance-payroll",
      type: "feature",
      title: "Attendance & Payroll Management",
      description: "Automated attendance tracking with QR code verification and comprehensive payroll processing",
      url: "/product#attendance",
      category: "Core Features",
      priority: 1,
      tags: ["attendance", "payroll", "qr-code", "automation"],
      icon: Clock
    },
    {
      id: "mobile-app",
      type: "feature",
      title: "Mobile App for Guards",
      description: "Native mobile app for guards with offline support and real-time communication",
      url: "/mobile",
      category: "Mobile Features",
      priority: 1,
      tags: ["mobile", "app", "offline", "guards"],
      icon: Smartphone
    },
    {
      id: "multi-location",
      type: "feature",
      title: "Multi-location Support",
      description: "Manage multiple posts and locations with centralized monitoring and reporting",
      url: "/product#locations",
      category: "Core Features",
      priority: 2,
      tags: ["locations", "posts", "multi-site", "centralized"],
      icon: Building2
    },
    {
      id: "document-management",
      type: "feature",
      title: "Document Management",
      description: "Complete document verification workflow with expiry tracking and approval system",
      url: "/product#documents",
      category: "Compliance",
      priority: 2,
      tags: ["documents", "verification", "compliance", "expiry"],
      icon: FileText
    },
    {
      id: "guard-management",
      type: "feature",
      title: "Guard Management System",
      description: "Complete guard profile management with document verification and shift scheduling",
      url: "/product#guards",
      category: "Core Features",
      priority: 1,
      tags: ["guards", "profiles", "scheduling", "management"],
      icon: Users
    },

    // Pricing
    {
      id: "pricing-basic",
      type: "pricing",
      title: "Basic Plan - $49/month",
      description: "Perfect for small security teams with up to 10 guards and basic tracking features",
      url: "/pricing#basic",
      category: "Pricing",
      priority: 1,
      tags: ["basic", "small-team", "affordable", "starter"],
      icon: Star
    },
    {
      id: "pricing-professional",
      type: "pricing",
      title: "Professional Plan - $99/month",
      description: "Best for growing security companies with up to 50 guards and advanced features",
      url: "/pricing#professional",
      category: "Pricing",
      priority: 1,
      tags: ["professional", "growing", "popular", "advanced"],
      icon: Star
    },
    {
      id: "pricing-enterprise",
      type: "pricing",
      title: "Enterprise Plan - $299/month",
      description: "For large security operations with unlimited guards and custom features",
      url: "/pricing#enterprise",
      category: "Pricing",
      priority: 1,
      tags: ["enterprise", "unlimited", "custom", "large-scale"],
      icon: Star
    },

    // Documentation
    {
      id: "docs-getting-started",
      type: "documentation",
      title: "Getting Started Guide",
      description: "Learn how to set up your security company account and start managing guards",
      url: "/support/docs#getting-started",
      category: "Documentation",
      priority: 1,
      tags: ["guide", "setup", "tutorial", "beginner"],
      icon: FileText
    },
    {
      id: "docs-api-reference",
      type: "documentation",
      title: "API Reference",
      description: "Complete API documentation for integrating with external systems and custom applications",
      url: "/api-docs",
      category: "Documentation",
      priority: 2,
      tags: ["api", "integration", "reference", "developers"],
      icon: FileText
    },
    {
      id: "docs-mobile-setup",
      type: "documentation",
      title: "Mobile App Setup",
      description: "Configure mobile apps for guards with offline support and real-time synchronization",
      url: "/support/docs#mobile-setup",
      category: "Documentation",
      priority: 2,
      tags: ["mobile", "setup", "configuration", "offline"],
      icon: Smartphone
    },

    // Pages
    {
      id: "page-dashboard",
      type: "page",
      title: "Dashboard",
      description: "Main dashboard with real-time metrics, guard status, and quick actions",
      url: "/dashboard",
      category: "Pages",
      priority: 1,
      tags: ["dashboard", "main", "overview", "metrics"],
      icon: MapPin
    },
    {
      id: "page-reports",
      type: "page",
      title: "Reports & Analytics",
      description: "Generate comprehensive reports and analyze security operations data",
      url: "/reports",
      category: "Pages",
      priority: 2,
      tags: ["reports", "analytics", "data", "insights"],
      icon: FileText
    },
    {
      id: "page-guards",
      type: "page",
      title: "Guard Management",
      description: "Manage guard profiles, assignments, and performance tracking",
      url: "/dashboard?tab=guards",
      category: "Pages",
      priority: 1,
      tags: ["guards", "management", "profiles", "performance"],
      icon: Users
    },

    // Support
    {
      id: "support-help-center",
      type: "support",
      title: "Help Center",
      description: "Find answers to common questions and troubleshooting guides",
      url: "/support/help",
      category: "Support",
      priority: 1,
      tags: ["help", "faq", "troubleshooting", "support"],
      icon: AlertTriangle
    },
    {
      id: "support-contact",
      type: "support",
      title: "Contact Support",
      description: "Get in touch with our support team for personalized assistance",
      url: "/support/help#contact",
      category: "Support",
      priority: 2,
      tags: ["contact", "support", "assistance", "help"],
      icon: Users
    }
  ];

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const lowercaseQuery = query.toLowerCase();

    // Simulate API delay
    setTimeout(() => {
      const filteredResults = searchData
        .filter(item => {
          const searchableText = [
            item.title,
            item.description,
            item.category || "",
            ...(item.tags || [])
          ].join(' ').toLowerCase();

          return searchableText.includes(lowercaseQuery);
        })
        .sort((a, b) => {
          // Priority sorting
          if (a.priority !== b.priority) {
            return (a.priority || 999) - (b.priority || 999);
          }
          
          // Title relevance
          const aTitleMatch = a.title.toLowerCase().includes(lowercaseQuery);
          const bTitleMatch = b.title.toLowerCase().includes(lowercaseQuery);
          
          if (aTitleMatch !== bTitleMatch) {
            return bTitleMatch ? 1 : -1;
          }
          
          // Alphabetical order as tiebreaker
          return a.title.localeCompare(b.title);
        })
        .slice(0, 10); // Limit to top 10 results

      setResults(filteredResults);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 300);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery("");
        setResults([]);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    router.push(result.url);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'feature': return MapPin;
      case 'pricing': return Star;
      case 'documentation': return FileText;
      case 'page': return MapPin;
      case 'support': return AlertTriangle;
      default: return FileText;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'pricing': return 'bg-green-100 text-green-800';
      case 'documentation': return 'bg-purple-100 text-purple-800';
      case 'page': return 'bg-gray-100 text-gray-800';
      case 'support': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="relative h-9 w-full justify-start rounded-lg bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-32 lg:w-48"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              ⌘K
            </kbd>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="text-lg font-semibold">Search</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col">
            {/* Search Input */}
            <div className="relative border-b p-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search features, pricing, documentation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Searching...</p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => {
                    const IconComponent = result.icon || getTypeIcon(result.type);
                    return (
                      <Card
                        key={result.id}
                        className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                          index === selectedIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-sm truncate">{result.title}</h3>
                                <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                                  {result.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {result.description}
                              </p>
                              <div className="flex items-center gap-2">
                                {result.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.category}
                                  </Badge>
                                )}
                                {result.tags && result.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : query ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No results found for "{query}"</p>
                    <p className="text-xs text-gray-500 mt-1">Try different keywords or browse our features</p>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-3">Popular Searches</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["GPS Tracking", "Pricing", "Mobile App", "Getting Started"].map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => setQuery(term)}
                      >
                        <Search className="h-3 w-3 mr-1" />
                        {term}
                      </Button>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-sm mb-3 mt-4">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { title: "View All Features", url: "/product" },
                      { title: "Compare Plans", url: "/pricing" },
                      { title: "Documentation", url: "/support/docs" },
                      { title: "Help Center", url: "/support/help" }
                    ].map((link) => (
                      <Button
                        key={link.title}
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full text-xs"
                        onClick={() => router.push(link.url)}
                      >
                        {link.title}
                        <ArrowRight className="h-3 w-3 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-3 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  Press <kbd className="px-1 py-0.5 bg-white border rounded">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-white border rounded">↓</kbd> to navigate
                </div>
                <div>
                  Press <kbd className="px-1 py-0.5 bg-white border rounded">Enter</kbd> to select
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}