"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  Zap, 
  Image as ImageIcon, 
  BarChart3, 
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import ImageOptimizer, { useImageOptimizer } from "@/components/ImageOptimizer";

interface OptimizationResult {
  success: boolean;
  optimizedUrl?: string;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
  error?: string;
  processingTime?: number;
}

interface BatchResult {
  url: string;
  success: boolean;
  optimizedUrl?: string;
  compressionRatio?: number;
  error?: string;
}

export default function ImageOptimizerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [options, setOptions] = useState({
    quality: 75,
    format: 'webp',
    width: '',
    height: '',
    enableWebP: true,
    enableCompression: true,
  });

  const { optimizeImage, batchOptimize, optimizationStats } = useImageOptimizer();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOptimizationResult(null);
    }
  }, []);

  const optimizeSingleImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsOptimizing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/images/optimize', {
        method: 'POST',
        body: formData,
      });

      const result: OptimizationResult = await response.json();
      setOptimizationResult(result);
    } catch (error) {
      setOptimizationResult({
        success: false,
        error: 'Failed to optimize image',
      });
    } finally {
      setIsOptimizing(false);
    }
  }, [selectedFile, options]);

  const optimizeBatchImages = useCallback(async () => {
    const imageUrls = [
      '/sample1.jpg',
      '/sample2.png',
      '/sample3.jpg',
    ];

    setIsBatchProcessing(true);
    try {
      const response = await fetch('/api/images/optimize', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrls,
          options,
        }),
      });

      const result = await response.json();
      setBatchResults(result.results || []);
    } catch (error) {
      console.error('Batch optimization failed:', error);
    } finally {
      setIsBatchProcessing(false);
    }
  }, [options]);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/images/optimize');
      const result = await response.json();
      setStats(result.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Image Optimization Studio</h1>
          <p className="text-gray-600">
            Optimize images for better performance with WebP conversion and compression
          </p>
        </div>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="single">Single Image</TabsTrigger>
            <TabsTrigger value="batch">Batch Process</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </CardTitle>
                  <CardDescription>
                    Select an image to optimize (JPEG, PNG, WebP, GIF)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Choose Image</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="mt-2"
                    />
                  </div>

                  {selectedFile && (
                    <Alert>
                      <ImageIcon className="h-4 w-4" />
                      <AlertDescription>
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="quality">Quality: {options.quality}%</Label>
                      <Input
                        id="quality"
                        type="range"
                        min="10"
                        max="100"
                        value={options.quality}
                        onChange={(e) => setOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="format">Output Format</Label>
                      <select
                        id="format"
                        value={options.format}
                        onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="webp">WebP</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="Auto"
                          value={options.width}
                          onChange={(e) => setOptions(prev => ({ ...prev, width: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Auto"
                          value={options.height}
                          onChange={(e) => setOptions(prev => ({ ...prev, height: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={optimizeSingleImage}
                    disabled={!selectedFile || isOptimizing}
                    className="w-full"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Optimization Results
                  </CardTitle>
                  <CardDescription>
                    View optimization metrics and download optimized image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {optimizationResult ? (
                    <div className="space-y-4">
                      {optimizationResult.success ? (
                        <>
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Optimization Successful</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Original Size</div>
                              <div className="font-medium">
                                {formatFileSize(optimizationResult.originalSize!)}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Optimized Size</div>
                              <div className="font-medium text-green-600">
                                {formatFileSize(optimizationResult.optimizedSize!)}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Compression</div>
                              <div className="font-medium">
                                {optimizationResult.compressionRatio?.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Processing Time</div>
                              <div className="font-medium">
                                {optimizationResult.processingTime}ms
                              </div>
                            </div>
                          </div>

                          <Progress value={optimizationResult.compressionRatio} className="h-2" />

                          <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Optimized Image
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Optimization Failed</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Upload an image to see optimization results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Batch Optimization
                </CardTitle>
                <CardDescription>
                  Optimize multiple images simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={optimizeBatchImages}
                  disabled={isBatchProcessing}
                  className="w-full"
                >
                  {isBatchProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Batch...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Batch Optimization
                    </>
                  )}
                </Button>

                {batchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Batch Results:</h3>
                    {batchResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <div className="font-medium">{result.url}</div>
                            {result.success && (
                              <div className="text-sm text-green-600">
                                Saved {result.compressionRatio}%
                              </div>
                            )}
                          </div>
                        </div>
                        {result.success && (
                          <Badge variant="outline">Optimized</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Optimization Statistics
                </CardTitle>
                <CardDescription>
                  View comprehensive optimization metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizationStats.totalImages}
                      </div>
                      <div className="text-sm text-gray-600">Images Optimized</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {optimizationStats.optimizedImages}
                      </div>
                      <div className="text-sm text-gray-600">Successfully Processed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {optimizationStats.totalSavings}%
                      </div>
                      <div className="text-sm text-gray-600">Average Savings</div>
                    </div>
                  </div>

                  <Button onClick={loadStats} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Statistics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Live Demo
                </CardTitle>
                <CardDescription>
                  See the ImageOptimizer component in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Standard Image</h3>
                    <div className="border rounded-lg p-4">
                      <ImageOptimizer
                        src="/api/placeholder/400/300"
                        alt="Demo image"
                        width={400}
                        height={300}
                        showStats={true}
                        enableWebP={true}
                        quality={80}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Optimized Image</h3>
                    <div className="border rounded-lg p-4">
                      <ImageOptimizer
                        src="/api/placeholder/400/300"
                        alt="Optimized demo image"
                        width={400}
                        height={300}
                        showStats={true}
                        enableWebP={true}
                        quality={50}
                        priority={true}
                      />
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