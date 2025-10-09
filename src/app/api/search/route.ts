import { NextRequest, NextResponse } from 'next/server';

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

interface SearchQuery {
  q: string;
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions: string[];
  categories: string[];
  took: number;
}

// Mock data for demonstration
const mockData: SearchResult[] = [
  // Guards
  {
    id: 'guard-1',
    type: 'guard',
    title: 'John Smith - Performance Report',
    description: 'Security guard with excellent performance metrics and high compliance scores',
    url: '/guards/john-smith',
    category: 'Guards',
    tags: ['performance', 'compliance', 'security'],
    relevance: 0.95,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'guard-2',
    type: 'guard',
    title: 'Sarah Johnson - Training Records',
    description: 'Complete training records and certification status for security guard',
    url: '/guards/sarah-johnson',
    category: 'Guards',
    tags: ['training', 'certification', 'records'],
    relevance: 0.88,
    lastModified: new Date(Date.now() - 86400000).toISOString(),
  },
  
  // Incidents
  {
    id: 'incident-1',
    type: 'incident',
    title: 'Security Breach - Building A',
    description: 'Detailed report of security breach incident with investigation findings',
    url: '/incidents/breach-building-a',
    category: 'Incidents',
    tags: ['breach', 'investigation', 'security'],
    relevance: 0.92,
    lastModified: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'incident-2',
    type: 'incident',
    title: 'Access Control Violation',
    description: 'Unauthorized access attempt and violation of access control protocols',
    url: '/incidents/access-violation',
    category: 'Incidents',
    tags: ['access', 'violation', 'control'],
    relevance: 0.85,
    lastModified: new Date(Date.now() - 7200000).toISOString(),
  },
  
  // Documents
  {
    id: 'doc-1',
    type: 'document',
    title: 'Security Protocol Manual',
    description: 'Comprehensive security protocols and standard operating procedures',
    url: '/documents/security-protocols',
    category: 'Documents',
    tags: ['protocol', 'procedure', 'manual'],
    relevance: 0.90,
    lastModified: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'doc-2',
    type: 'document',
    title: 'Emergency Response Plan',
    description: 'Emergency response procedures and contingency planning',
    url: '/documents/emergency-plan',
    category: 'Documents',
    tags: ['emergency', 'response', 'plan'],
    relevance: 0.87,
    lastModified: new Date(Date.now() - 259200000).toISOString(),
  },
  
  // Locations
  {
    id: 'location-1',
    type: 'location',
    title: 'Main Building - Monitoring Status',
    description: 'Real-time monitoring status and security coverage for main building',
    url: '/locations/main-building',
    category: 'Locations',
    tags: ['monitoring', 'building', 'coverage'],
    relevance: 0.93,
    lastModified: new Date().toISOString(),
  },
  {
    id: 'location-2',
    type: 'location',
    title: 'Parking Lot A - Security Assessment',
    description: 'Security assessment and risk analysis for parking facility',
    url: '/locations/parking-lot-a',
    category: 'Locations',
    tags: ['assessment', 'parking', 'risk'],
    relevance: 0.80,
    lastModified: new Date(Date.now() - 432000000).toISOString(),
  },
  
  // Compliance
  {
    id: 'compliance-1',
    type: 'compliance',
    title: 'PSARA Compliance Status',
    description: 'Current PSARA compliance status and regulatory requirements tracking',
    url: '/compliance/psara-status',
    category: 'Compliance',
    tags: ['psara', 'compliance', 'regulatory'],
    relevance: 0.94,
    lastModified: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'compliance-2',
    type: 'compliance',
    title: 'License Verification Report',
    description: 'Security guard license verification and compliance report',
    url: '/compliance/license-verification',
    category: 'Compliance',
    tags: ['license', 'verification', 'report'],
    relevance: 0.86,
    lastModified: new Date(Date.now() - 28800000).toISOString(),
  },
  
  // Users
  {
    id: 'user-1',
    type: 'user',
    title: 'Admin User Management',
    description: 'System administration and user management controls',
    url: '/users/admin-management',
    category: 'Users',
    tags: ['admin', 'management', 'users'],
    relevance: 0.78,
    lastModified: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'user-2',
    type: 'user',
    title: 'Role Permissions Configuration',
    description: 'User role configuration and permission management',
    url: '/users/role-permissions',
    category: 'Users',
    tags: ['roles', 'permissions', 'configuration'],
    relevance: 0.82,
    lastModified: new Date(Date.now() - 172800000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (!query.trim()) {
      return NextResponse.json<SearchResponse>({
        results: [],
        total: 0,
        query,
        suggestions: [],
        categories: [],
        took: Date.now() - startTime,
      });
    }

    // Filter results based on query
    let filteredResults = mockData.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesType = !type || item.type === type;
      const matchesCategory = !category || item.category === category;
      
      return matchesQuery && matchesType && matchesCategory;
    });

    // Calculate relevance scores
    filteredResults = filteredResults.map(item => {
      let relevance = 0.5; // Base relevance
      
      // Title matches are more relevant
      if (item.title.toLowerCase().includes(query.toLowerCase())) {
        relevance += 0.3;
      }
      
      // Description matches
      if (item.description.toLowerCase().includes(query.toLowerCase())) {
        relevance += 0.2;
      }
      
      // Tag matches
      const tagMatches = item.tags.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      ).length;
      relevance += tagMatches * 0.1;
      
      // Boost recent items
      const ageInHours = (Date.now() - new Date(item.lastModified).getTime()) / (1000 * 60 * 60);
      if (ageInHours < 24) relevance += 0.1;
      
      return {
        ...item,
        relevance: Math.min(relevance, 1.0),
        highlights: generateHighlights(item, query),
      };
    });

    // Sort results
    filteredResults.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = a.relevance - b.relevance;
          break;
        case 'date':
          comparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    // Apply pagination
    const total = filteredResults.length;
    const paginatedResults = filteredResults.slice(offset, offset + limit);

    // Generate suggestions
    const suggestions = generateSuggestions(query, mockData);
    
    // Get available categories
    const categories = [...new Set(mockData.map(item => item.category))];

    const response: SearchResponse = {
      results: paginatedResults,
      total,
      query,
      suggestions,
      categories,
      took: Date.now() - startTime,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateHighlights(item: SearchResult, query: string): string[] {
  const highlights: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Highlight title matches
  if (item.title.toLowerCase().includes(queryLower)) {
    const regex = new RegExp(`(${query})`, 'gi');
    highlights.push(item.title.replace(regex, '<mark>$1</mark>'));
  }
  
  // Highlight description matches
  if (item.description.toLowerCase().includes(queryLower)) {
    const regex = new RegExp(`(${query})`, 'gi');
    const highlighted = item.description.replace(regex, '<mark>$1</mark>');
    // Truncate if too long
    if (highlighted.length > 150) {
      const index = highlighted.indexOf('<mark>');
      const start = Math.max(0, index - 50);
      const end = Math.min(highlighted.length, index + 100);
      highlights.push('...' + highlighted.substring(start, end) + '...');
    } else {
      highlights.push(highlighted);
    }
  }
  
  return highlights;
}

function generateSuggestions(query: string, data: SearchResult[]): string[] {
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  // Extract words from titles and descriptions
  data.forEach(item => {
    const words = [
      ...item.title.toLowerCase().split(' '),
      ...item.description.toLowerCase().split(' '),
      ...item.tags,
    ];
    
    words.forEach(word => {
      if (word.includes(queryLower) && word.length > query.length) {
        suggestions.add(word);
      }
    });
  });
  
  // Add common search patterns
  const commonPatterns = [
    `${query} report`,
    `${query} status`,
    `${query} management`,
    `${query} analysis`,
    `${query} monitoring`,
  ];
  
  commonPatterns.forEach(pattern => {
    if (pattern.toLowerCase().includes(queryLower)) {
      suggestions.add(pattern);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// Search analytics endpoint
export async function POST(request: NextRequest) {
  try {
    const { query, resultsCount, selectedResult, searchDuration } = await request.json();
    
    // In a real implementation, this would store search analytics
    console.log('Search analytics:', {
      query,
      resultsCount,
      selectedResult,
      searchDuration,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Search analytics recorded',
    });
    
  } catch (error) {
    console.error('Failed to record search analytics:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}