"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Zap, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Clock,
  HardDrive,
  Activity,
  BarChart3,
  Settings
} from "lucide-react";
import { cacheStrategyManager, cacheHelpers } from "@/lib/cache-strategies";

interface CacheStats {
  strategy: string;
  hits: number;
  misses: number;
  size: number;
  entries: number;
  hitRate: number;
  evictions: number;
  compressionRatio: number;
}

interface StrategyInfo {
  name: string;
  description: string;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo';
  useCompression: boolean;
  persistToStorage: boolean;
}

export default function CacheMonitorPage() {
  const [stats, setStats] = useState<Record<string, CacheStats>>({});
  const [strategies, setStrategies] = useState<Record<string, StrategyInfo>>({});
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('api');

  useEffect(() => {
    loadCacheData();
    const interval = setInterval(loadCacheData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadCacheData = async () => {
    try {
      const cacheStats = cacheStrategyManager.getStats();
      const allStrategies = cacheStrategyManager.getAllStrategies();
      
      setStats(cacheStats);
      setStrategies(allStrategies);
    } catch (error) {
      console.error('Failed to load cache data:', error);
    }
  };

  const clearCache = async (strategyName: string) => {
    setLoading(true);
    try {
      cacheStrategyManager.invalidateStrategy(strategyName);
      await loadCacheData();
    } catch (error) {
      console.error(`Failed to clear cache for ${strategyName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllCaches = async () => {
    setLoading(true);
    try {
      Object.keys(strategies).forEach(strategy => {
        cacheStrategyManager.invalidateStrategy(strategy);
      });
      await loadCacheData();
    } catch (error) {
      console.error('Failed to clear all caches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const getHitRateColor = (hitRate: number): string => {
    if (hitRate >= 80) return 'text-green-600';
    if (hitRate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrategyColor = (strategy: string): string => {
    switch (strategy) {
      case 'lru': return 'bg-blue-100 text-blue-800';
      case 'lfu': return 'bg-green-100 text-green-800';
      case 'fifo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedStats = stats[selectedStrategy];
  const selectedStrategyInfo = strategies[selectedStrategy];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cache Monitor Dashboard</h1>
          <p className="text-gray-600">
            Monitor and manage cache performance across different strategies
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cache Entries</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(stats).reduce((sum, s) => sum + s.entries, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all strategies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Memory Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(Object.values(stats).reduce((sum, s) => sum + s.size, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total cache size
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Hit Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(stats).length > 0 
                      ? (Object.values(stats).reduce((sum, s) => sum + s.hitRate, 0) / Object.values(stats).length).toFixed(1)
                      : '0'}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Overall cache efficiency
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(strategies).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Cache strategies running
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cache Strategies Overview</CardTitle>
                  <CardDescription>
                    Performance metrics for each cache strategy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(strategies).map(([key, strategy]) => {
                      const stat = stats[key];
                      return (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              stat?.hitRate && stat.hitRate > 70 ? 'bg-green-500' : 
                              stat?.hitRate && stat.hitRate > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <div className="font-medium">{strategy.name}</div>
                              <div className="text-sm text-gray-500">{strategy.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${getHitRateColor(stat?.hitRate || 0)}`}>
                              {stat?.hitRate?.toFixed(1) || 0}%
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatBytes(stat?.size || 0)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage Distribution</CardTitle>
                  <CardDescription>
                    Memory usage across different cache strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(strategies).map(([key, strategy]) => {
                      const stat = stats[key];
                      const totalSize = Object.values(stats).reduce((sum, s) => sum + s.size, 0);
                      const percentage = totalSize > 0 ? (stat?.size || 0) / totalSize * 100 : 0;
                      
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{strategy.name}</span>
                            <span>{formatBytes(stat?.size || 0)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Selection</CardTitle>
                  <CardDescription>
                    Select a cache strategy to view details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(strategies).map(([key, strategy]) => (
                      <Button
                        key={key}
                        variant={selectedStrategy === key ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedStrategy(key)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {strategy.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedStrategyInfo && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {selectedStrategyInfo.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedStrategyInfo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Strategy Type</label>
                          <div className="mt-1">
                            <Badge className={getStrategyColor(selectedStrategyInfo.strategy)}>
                              {selectedStrategyInfo.strategy.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Time To Live</label>
                          <div className="mt-1 text-lg font-medium">
                            {formatDuration(selectedStrategyInfo.ttl)}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Max Size</label>
                          <div className="mt-1 text-lg font-medium">
                            {formatBytes(selectedStrategyInfo.maxSize)}
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Compression</label>
                            <div className="mt-1">
                              <Badge variant={selectedStrategyInfo.useCompression ? "default" : "secondary"}>
                                {selectedStrategyInfo.useCompression ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Persistence</label>
                            <div className="mt-1">
                              <Badge variant={selectedStrategyInfo.persistToStorage ? "default" : "secondary"}>
                                {selectedStrategyInfo.persistToStorage ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedStats && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Current Entries</label>
                            <div className="mt-1 text-lg font-medium">
                              {selectedStats.entries.toLocaleString()}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Current Size</label>
                            <div className="mt-1 text-lg font-medium">
                              {formatBytes(selectedStats.size)}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Hit Rate</label>
                            <div className="mt-1">
                              <div className={`text-lg font-medium ${getHitRateColor(selectedStats.hitRate)}`}>
                                {selectedStats.hitRate.toFixed(1)}%
                              </div>
                              <Progress value={selectedStats.hitRate} className="mt-2 h-2" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Hits</label>
                              <div className="mt-1 text-lg font-medium text-green-600">
                                {selectedStats.hits.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Misses</label>
                              <div className="mt-1 text-lg font-medium text-red-600">
                                {selectedStats.misses.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        onClick={() => clearCache(selectedStrategy)}
                        disabled={loading}
                        variant="outline"
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear {selectedStrategyInfo.name} Cache
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hit Rate Analysis</CardTitle>
                  <CardDescription>
                    Cache hit rates across all strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats)
                      .sort(([,a], [,b]) => b.hitRate - a.hitRate)
                      .map(([key, stat]) => {
                        const strategy = strategies[key];
                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{strategy?.name}</span>
                              <span className={`font-medium ${getHitRateColor(stat.hitRate)}`}>
                                {stat.hitRate.toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={stat.hitRate} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>{stat.hits} hits</span>
                              <span>{stat.misses} misses</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Metrics</CardTitle>
                  <CardDescription>
                    Performance and efficiency indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats).map(([key, stat]) => {
                      const strategy = strategies[key];
                      const efficiency = stat.entries > 0 ? (stat.hits / stat.entries) * 100 : 0;
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              efficiency > 70 ? 'bg-green-500' : 
                              efficiency > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <div className="font-medium">{strategy?.name}</div>
                              <div className="text-sm text-gray-500">
                                {stat.entries} entries
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {efficiency.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">
                              Efficiency
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>
                  Manage cache strategies and perform maintenance operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Clearing cache will temporarily degrade performance as data needs to be refetched. 
                    Use this operation carefully during maintenance windows.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Individual Strategy Management</h3>
                    <div className="space-y-2">
                      {Object.entries(strategies).map(([key, strategy]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="text-sm text-gray-500">
                              {stats[key]?.entries || 0} entries
                            </div>
                          </div>
                          <Button
                            onClick={() => clearCache(key)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Bulk Operations</h3>
                    <div className="space-y-3">
                      <Button
                        onClick={clearAllCaches}
                        disabled={loading}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Caches
                      </Button>
                      
                      <Button
                        onClick={loadCacheData}
                        disabled={loading}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Quick Stats</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Strategies:</span>
                          <span>{Object.keys(strategies).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Entries:</span>
                          <span>{Object.values(stats).reduce((sum, s) => sum + s.entries, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Size:</span>
                          <span>{formatBytes(Object.values(stats).reduce((sum, s) => sum + s.size, 0))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}