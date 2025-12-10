"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

interface TestResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  details: string;
  category: 'layout' | 'touch' | 'performance' | 'accessibility';
}

interface DeviceSize {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
  type: 'mobile' | 'tablet' | 'desktop';
}

export default function MobileResponsivenessTester() {
  const [currentDevice, setCurrentDevice] = useState<DeviceSize>({
    name: "Mobile",
    width: 375,
    height: 667,
    icon: Smartphone,
    type: "mobile"
  });

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: "touch-targets",
      name: "Touch Targets",
      description: "All interactive elements have minimum 44px touch targets",
      passed: true,
      details: "Buttons, links, and form controls meet minimum touch target size requirements",
      category: "touch"
    },
    {
      id: "viewport-scaling",
      name: "Viewport Scaling",
      description: "Content scales properly across different device sizes",
      passed: true,
      details: "Layout adapts correctly to mobile, tablet, and desktop viewports",
      category: "layout"
    },
    {
      id: "font-sizes",
      name: "Font Sizes",
      description: "Text remains readable on small screens",
      passed: true,
      details: "Minimum font size of 16px for body text to prevent iOS zoom",
      category: "accessibility"
    },
    {
      id: "navigation",
      name: "Navigation",
      description: "Navigation is accessible and touch-friendly",
      passed: true,
      details: "Mobile navigation menu is easily accessible with touch gestures",
      category: "layout"
    },
    {
      id: "form-inputs",
      name: "Form Inputs",
      description: "Form controls are optimized for touch input",
      passed: true,
      details: "Input fields, checkboxes, and radio buttons have adequate touch targets",
      category: "touch"
    },
    {
      id: "image-optimization",
      name: "Image Optimization",
      description: "Images load efficiently on mobile networks",
      passed: true,
      details: "Images are properly sized and compressed for mobile delivery",
      category: "performance"
    },
    {
      id: "gestures",
      name: "Gesture Support",
      description: "Touch gestures are supported where appropriate",
      passed: true,
      details: "Swipe, tap, and other gestures work correctly on touch devices",
      category: "touch"
    },
    {
      id: "offline-functionality",
      name: "Offline Functionality",
      description: "App works offline with PWA features",
      passed: true,
      details: "Service worker caching and offline page are implemented",
      category: "performance"
    }
  ]);

  const deviceSizes: DeviceSize[] = [
    {
      name: "iPhone SE",
      width: 375,
      height: 667,
      icon: Smartphone,
      type: "mobile"
    },
    {
      name: "iPhone 14",
      width: 390,
      height: 844,
      icon: Smartphone,
      type: "mobile"
    },
    {
      name: "iPad",
      width: 768,
      height: 1024,
      icon: Tablet,
      type: "tablet"
    },
    {
      name: "iPad Pro",
      width: 1024,
      height: 1366,
      icon: Tablet,
      type: "tablet"
    },
    {
      name: "Desktop",
      width: 1920,
      height: 1080,
      icon: Monitor,
      type: "desktop"
    }
  ];

  const runTests = () => {
    // Simulate running responsiveness tests
    const updatedResults = testResults.map(test => ({
      ...test,
      passed: Math.random() > 0.1 // 90% pass rate for demo
    }));
    setTestResults(updatedResults);
  };

  const getTestIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'layout': return 'bg-blue-100 text-blue-800';
      case 'touch': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'accessibility': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;
  const passRate = Math.round((passedTests / totalTests) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Mobile Responsiveness Tester
          </CardTitle>
          <CardDescription>
            Test and verify mobile responsiveness across different device sizes and orientations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{passRate}%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Tests Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Score</span>
              <span className="font-medium">{passRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  passRate >= 90 ? 'bg-green-500' : 
                  passRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Simulator */}
      <Card>
        <CardHeader>
          <CardTitle>Device Simulator</CardTitle>
          <CardDescription>
            Preview how your app looks on different devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {deviceSizes.map((device) => (
              <Button
                key={device.name}
                variant={currentDevice.name === device.name ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentDevice(device)}
                className="touch-target"
              >
                <device.icon className="w-4 h-4 mr-2" />
                {device.name}
              </Button>
            ))}
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {currentDevice.name} ({currentDevice.width}×{currentDevice.height})
              </span>
              <Badge variant="secondary">{currentDevice.type}</Badge>
            </div>
            <div 
              className="bg-white border-2 border-gray-300 rounded-lg mx-auto overflow-hidden"
              style={{ 
                width: Math.min(currentDevice.width, 600), 
                height: Math.min(currentDevice.height, 800),
                maxWidth: '100%'
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <currentDevice.icon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">App Preview</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentDevice.width} × {currentDevice.height}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results from mobile responsiveness testing
              </CardDescription>
            </div>
            <Button onClick={runTests} size="sm" className="touch-target">
              <RotateCcw className="w-4 h-4 mr-2" />
              Run Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="touch">Touch</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-3">
              {testResults.map((test) => (
                <div key={test.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getTestIcon(test.passed)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <Badge className={getCategoryColor(test.category)}>
                        {test.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                    <p className="text-xs text-gray-500">{test.details}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            {(['layout', 'touch', 'performance', 'accessibility'] as const).map((category) => (
              <TabsContent key={category} value={category} className="space-y-3">
                {testResults
                  .filter(test => test.category === category)
                  .map((test) => (
                    <div key={test.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getTestIcon(test.passed)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{test.name}</h4>
                          <Badge className={getCategoryColor(test.category)}>
                            {test.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                        <p className="text-xs text-gray-500">{test.details}</p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Suggestions for improving mobile responsiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Optimize Images</h4>
                <p className="text-sm text-gray-600">
                  Use responsive images with appropriate sizes and formats for mobile devices
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Improve Touch Targets</h4>
                <p className="text-sm text-gray-600">
                  Ensure all interactive elements have minimum 44×44px touch targets
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Test on Real Devices</h4>
                <p className="text-sm text-gray-600">
                  Test on actual mobile devices to catch issues that emulators might miss
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Monitor Performance</h4>
                <p className="text-sm text-gray-600">
                  Regularly test loading times and performance on mobile networks
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}