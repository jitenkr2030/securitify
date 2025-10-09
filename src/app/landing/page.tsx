"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Smartphone,
  CheckCircle,
  Star,
  Building2,
  ArrowRight
} from "lucide-react";
import MobileOptimizedPricing from "@/components/MobileOptimizedPricing";
import LazySection from "@/components/LazySection";

export default function LandingPage() {
  const router = useRouter();

  const handlePlanSelect = (planId: string) => {
    if (planId === "enterprise") {
      router.push('/contact');
    } else {
      router.push('/register?plan=' + planId);
    }
  };

  const features = [
    {
      icon: MapPin,
      title: "Real-time GPS Tracking",
      description: "Track security guards in real-time with accurate GPS location data"
    },
    {
      icon: AlertTriangle,
      title: "Smart Alerts",
      description: "Get instant notifications for geofence breaches, SOS alerts, and unusual activities"
    },
    {
      icon: Clock,
      title: "Attendance & Payroll",
      description: "Automated attendance tracking with QR code verification and payroll processing"
    },
    {
      icon: Users,
      title: "Guard Management",
      description: "Complete guard profile management with document verification and shift scheduling"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Native mobile app for guards with offline support and real-time communication"
    },
    {
      icon: Building2,
      title: "Multi-location Support",
      description: "Manage multiple posts and locations with centralized monitoring"
    }
  ];

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$49",
      period: "/month",
      description: "Perfect for small security teams",
      features: [
        "Up to 10 guards",
        "Basic GPS tracking",
        "Email support",
        "Mobile app access",
        "Basic reporting",
        "Real-time notifications",
        "Document management",
        "Attendance tracking"
      ],
      popular: false,
      cta: "Get Started",
      guardLimit: 10,
      postLimit: 5,
      highlight: "Start Free"
    },
    {
      id: "professional",
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Best for growing security companies",
      features: [
        "Up to 50 guards",
        "Advanced tracking",
        "Priority support",
        "API access",
        "Advanced analytics",
        "Custom reports",
        "White-label options",
        "Geofencing",
        "SOS alerts",
        "Payroll management"
      ],
      popular: true,
      cta: "Most Popular",
      guardLimit: 50,
      postLimit: 20,
      highlight: "Best Value"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For large security operations",
      features: [
        "Unlimited guards",
        "White-label platform",
        "Dedicated support",
        "Custom integrations",
        "Advanced features",
        "Priority SLA",
        "Custom development",
        "Training included",
        "Advanced compliance",
        "Multi-location management"
      ],
      popular: false,
      cta: "Contact Sales",
      guardLimit: -1,
      postLimit: -1,
      highlight: "Premium"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Security Manager",
      company: "SecureGuard Pvt Ltd",
      content: "This platform has transformed how we manage our security team. Real-time tracking and automated attendance have saved us countless hours.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Operations Director",
      company: "Shield Security Services",
      content: "The mobile app is fantastic. Our guards love how easy it is to use, and we've seen a 40% improvement in response times.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "CEO",
      company: "Fortress Security",
      content: "The scalability and reliability of this platform is unmatched. We've grown from 10 to 200 guards without any issues.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Professional Security Management
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Security Guard Management
              <span className="block text-blue-300">Reimagined</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Complete SaaS platform for security companies to manage guards, track locations, 
              handle attendance, and streamline operations with real-time monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                onClick={() => router.push('/register')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Lazy Loaded */}
      <LazySection id="features" className="py-20 bg-gray-50" minHeight="600px">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Manage Your Security Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed specifically for security companies and guard management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Pricing Section - Lazy Loaded */}
      <LazySection id="pricing" className="py-20 bg-white" minHeight="800px">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your security company. Scale up or down anytime.
            </p>
          </div>
          
          <MobileOptimizedPricing 
            plans={plans} 
            onPlanSelect={handlePlanSelect}
          />
        </div>
      </LazySection>

      {/* Testimonials Section - Lazy Loaded */}
      <LazySection id="testimonials" className="py-20 bg-gray-50" minHeight="600px">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Security Companies Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </LazySection>

      {/* CTA Section - Lazy Loaded */}
      <LazySection id="cta" className="py-20 bg-blue-600 text-white" minHeight="400px">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of security companies already using our platform to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              onClick={() => router.push('/register')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              onClick={() => router.push('/auth/signin')}
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </LazySection>

      {/* Footer - Lazy Loaded */}
      <LazySection id="footer" className="bg-gray-900 text-white py-12" minHeight="300px">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">Securitify</span>
              </div>
              <p className="text-gray-400">
                Professional security management platform for modern security companies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/product" className="hover:text-white">Features</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/mobile" className="hover:text-white">Mobile App</a></li>
                <li><a href="/api-docs" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/company/about" className="hover:text-white">About</a></li>
                <li><a href="/company/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/company/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/company/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/support/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/support/docs" className="hover:text-white">Documentation</a></li>
                <li><a href="/support/community" className="hover:text-white">Community</a></li>
                <li><a href="/support/status" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Securitify. All rights reserved.</p>
          </div>
        </div>
      </LazySection>
    </div>
  );
}