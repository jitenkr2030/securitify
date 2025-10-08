"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Clock, 
  Users, 
  FileText, 
  MapPin, 
  AlertTriangle,
  Shield,
  Calendar,
  TrendingUp,
  Loader2,
  ExternalLink,
  Grid,
  List
} from "lucide-react";

interface SearchResult {
  id: string;
  type: 'guard' | 'incident' | 'document' | 'location' | 'compliance' | 'user';
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  relevance: number;
  lastModified: string;
  highlights?: string[];
}

interface SearchFilters {
  type: string;
  category: string;
  dateRange: string;
  sortBy: string;
  sortOrder: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    category: 'all',
    dateRange: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${filters.type}&category=${filters.category}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => 
        new Date(item.lastModified) >= cutoffDate
      );
    }
    
    return filtered;
  }, [results, filters]);

  const resultsByType = useMemo(() => {
    const grouped = filteredResults.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);
    
    return grouped;
  }, [filteredResults]);

  const typeStats = useMemo(() => {
    const stats = {
      guard: 0,
      incident: 0,
      document: 0,
      location: 0,
      compliance: 0,
      user: 0,
    };
    
    filteredResults.forEach(result => {
      stats[result.type]++;
    });
    
    return stats;
  }, [filteredResults]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guard': return <Users className="w-4 h-4" />;
      case 'incident': return <AlertTriangle className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guard': return 'bg-blue-100 text-blue-800';
      case 'incident': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'location': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const ResultCard = ({ result }: { result: SearchResult }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
            {getTypeIcon(result.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-lg truncate">{result.title}</h3>
              <Badge variant="outline">{result.category}</Badge>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(result.lastModified)}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {Math.round(result.relevance * 100)}% match
              </span>
            </div>
            {result.tags && result.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {result.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Searching...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  defaultValue={query}
                  placeholder="Search guards, incidents, documents, locations..."
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-gray-600">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="guard">Guards</SelectItem>
                    <SelectItem value="incident">Incidents</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="location">Locations</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">
                      <SortDesc className="w-4 h-4 mr-2 inline" />
                      Descending
                    </SelectItem>
                    <SelectItem value="asc">
                      <SortAsc className="w-4 h-4 mr-2 inline" />
                      Ascending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3">Results by Type</h3>
                <div className="space-y-2">
                  {Object.entries(typeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Results ({filteredResults.length})</TabsTrigger>
                <TabsTrigger value="guard">Guards ({typeStats.guard})</TabsTrigger>
                <TabsTrigger value="incident">Incidents ({typeStats.incident})</TabsTrigger>
                <TabsTrigger value="document">Documents ({typeStats.document})</TabsTrigger>
                <TabsTrigger value="location">Locations ({typeStats.location})</TabsTrigger>
                <TabsTrigger value="compliance">Compliance ({typeStats.compliance})</TabsTrigger>
                <TabsTrigger value="user">Users ({typeStats.user})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {filteredResults.map((result) => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredResults.map((result) => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {Object.entries(resultsByType).map(([type, typeResults]) => (
                <TabsContent key={type} value={type}>
                  {viewMode === 'list' ? (
                    <div className="space-y-4">
                      {typeResults.map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {typeResults.map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {filteredResults.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={() => setFilters({
                    type: 'all',
                    category: 'all',
                    dateRange: 'all',
                    sortBy: 'relevance',
                    sortOrder: 'desc',
                  })}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <span>Loading search results...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}