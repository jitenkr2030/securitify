"use client";

import MobileResponsivenessTester from "@/components/MobileResponsivenessTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Tablet, Monitor, Zap, Shield, Users } from "lucide-react";

export default function MobileTestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Mobile Experience Test</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive testing and optimization tools for mobile responsiveness, 
              touch interactions, and performance across all device sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mobile Optimization Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform includes comprehensive mobile optimization features 
              to ensure the best user experience across all devices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Responsive Design</CardTitle>
                <CardDescription>
                  Fluid layouts that adapt perfectly to any screen size from mobile to desktop
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Touch Optimized</CardTitle>
                <CardDescription>
                  Large touch targets, gesture support, and haptic feedback for better interactions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">PWA Ready</CardTitle>
                <CardDescription>
                  Offline functionality, app-like experience, and installable on home screens
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Accessibility</CardTitle>
                <CardDescription>
                  WCAG compliant with proper contrast ratios and screen reader support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Cross-Platform</CardTitle>
                <CardDescription>
                  Consistent experience across iOS, Android, and all modern browsers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Tablet className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Performance</CardTitle>
                <CardDescription>
                  Optimized loading times and smooth animations on all devices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile Responsiveness Tester */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <MobileResponsivenessTester />
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Device Compatibility</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tested and optimized for a wide range of devices and screen sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Smartphone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <CardTitle className="text-lg">Mobile Phones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">iPhone</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Samsung Galaxy</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Google Pixel</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Tablet className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <CardTitle className="text-lg">Tablets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">iPad</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Android Tablets</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Surface</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Monitor className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <CardTitle className="text-lg">Desktop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chrome</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Safari</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Firefox</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Edge</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Touch Gestures</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Offline Mode</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dark Mode</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">PWA Install</span>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Test Your Mobile Experience?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Use our comprehensive testing tools to ensure your app provides 
            the best mobile experience for all users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
              Start Testing
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}