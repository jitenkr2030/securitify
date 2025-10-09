"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCountry, useCountryInfo } from "@/contexts/CountryContext";
import { CountryContentService } from "@/lib/countryContent";
import LazyLoad from "@/components/LazyLoad";
import MobileComplianceScoring from "@/components/MobileComplianceScoring";
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
  ArrowRight,
  Target
} from "lucide-react";

const ICON_COMPONENTS = {
  shield: Shield,
  users: Users,
  "map-pin": MapPin,
  "alert-triangle": AlertTriangle,
  clock: Clock,
  smartphone: Smartphone,
  "building-2": Building2,
  "check-circle": CheckCircle,
  star: Star,
};

export default function Home() {
  const router = useRouter();
  const { country, loading } = useCountry();
  const countryInfo = useCountryInfo();
  
  // Get country-specific content
  const heroContent = CountryContentService.getHeroContent(country);
  const features = CountryContentService.getFeatures(country);
  const plans = CountryContentService.getPricing(country);
  const complianceInfo = CountryContentService.getComplianceInfo(country);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your region...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              🎉 SPECIAL OFFER - LIMITED TIME
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {heroContent.title}
              <span className="block text-blue-300">{heroContent.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {heroContent.description}
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-lg font-semibold mb-2">🚀 Launch Offer:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {plans.slice(0, 4).map((plan, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-300">{plan.price}</div>
                    <div>{plan.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                onClick={() => router.push('/auth/signin')}
              >
                {heroContent.ctaPrimary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                onClick={() => router.push('/auth/signin')}
              >
                {heroContent.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
        <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600">
              {complianceInfo.authority.toUpperCase()} COMPLIANCE FEATURES
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for {complianceInfo.authority} Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform covers all {complianceInfo.authority} requirements - from guard registration to audit-ready reports. 
              Stay compliant and focus on growing your security business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = ICON_COMPONENTS[feature.icon as keyof typeof ICON_COMPONENTS] || Shield;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      </LazyLoad>

      {/* Compliance Requirements - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {complianceInfo.authority} Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help you meet all regulatory requirements with automated tracking and compliance management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">Key Requirements</h3>
              <ul className="space-y-3">
                {complianceInfo.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">Required Documents</h3>
              <ul className="space-y-3">
                {complianceInfo.documents.map((document, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{document}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </LazyLoad>

      {/* Mobile Compliance Scoring - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600">
              <Target className="w-4 h-4 mr-1" />
              MOBILE COMPLIANCE SCORING
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Real-Time Compliance Monitoring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your compliance score in real-time with our mobile-first dashboard. 
              Get instant insights and action items to maintain perfect compliance.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <MobileComplianceScoring />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-blue-100 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-blue-900">📱 Mobile-First Design</h3>
              <p className="text-blue-800">
                Our compliance scoring system is optimized for mobile devices, 
                allowing you to monitor compliance on-the-go with touch-friendly interfaces 
                and responsive design that works perfectly on any device.
              </p>
            </div>
          </div>
        </div>
      </section>
      </LazyLoad>

      {/* Pricing Section - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-green-500 text-green-600">
              🎉 LIMITED TIME OFFER
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Affordable {complianceInfo.authority} Compliance Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start completely free and scale as your security agency grows. 
              No hidden fees, cancel anytime. Perfect plans for every security agency size.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-green-500 shadow-xl ring-2 ring-green-200' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      BEST VALUE
                    </Badge>
                  </div>
                )}
                {plan.price === "Free" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-2">
                      🚀 START FREE
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-green-600 hover:bg-green-700' : plan.price === "Free" ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular || plan.price === "Free" ? 'default' : 'outline'}
                    onClick={() => router.push('/auth/signin')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">💡 Why Choose Our Platform?</h3>
              <p className="text-gray-600">
                All plans include complete {complianceInfo.authority} compliance features, mobile app access, and email support. 
                Upgrade or downgrade anytime based on your security agency's needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      </LazyLoad>

      {/* Testimonials Section - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Security Operations Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "This platform has transformed how we manage our security team. Real-time tracking and automated attendance have saved us countless hours."
                </p>
                <div>
                  <p className="font-semibold">Rajesh Sharma</p>
                  <p className="text-sm text-gray-500">Security Manager</p>
                  <p className="text-sm text-gray-500">SecureGuard Pvt Ltd</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The mobile app is fantastic. Our guards love how easy it is to use, and we've seen a 40% improvement in response times."
                </p>
                <div>
                  <p className="font-semibold">Priya Patel</p>
                  <p className="text-sm text-gray-500">Operations Director</p>
                  <p className="text-sm text-gray-500">Shield Security Services</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The scalability and reliability of this platform is unmatched. We've grown from 10 to 200 guards without any issues."
                </p>
                <div>
                  <p className="font-semibold">Amit Kumar</p>
                  <p className="text-sm text-gray-500">CEO</p>
                  <p className="text-sm text-gray-500">Fortress Security</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </LazyLoad>

      {/* CTA Section - Lazy Loaded */}
      <LazyLoad threshold={0.1}>
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            🎯 LIMITED TIME OFFER
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Start Your {complianceInfo.authority} Compliance Journey Today
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join hundreds of security agencies already using our platform. 
            Start completely free with up to 10 guards - no credit card required!
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">🚀</div>
                <div className="font-semibold">Start Free</div>
                <div className="text-sm text-white/80">No credit card needed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">⚡</div>
                <div className="font-semibold">Quick Setup</div>
                <div className="text-sm text-white/80">Get started in minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">🛡️</div>
                <div className="font-semibold">{complianceInfo.authority} Ready</div>
                <div className="text-sm text-white/80">Compliance from day one</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
              onClick={() => router.push('/auth/signin')}
            >
              Start Free Trial Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
              onClick={() => router.push('/auth/signin')}
            >
              Schedule Personal Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Offer valid for limited time only. No credit card required for free plan.
          </p>
        </div>
      </section>
      </LazyLoad>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">Securitify</span>
              </div>
              <p className="text-gray-400">
                Professional {complianceInfo.authority} compliance platform for private security agencies to maintain regulatory requirements and streamline operations.
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
            <p>&copy; 2024 Securitify. All rights reserved. | Serving {countryInfo?.name || 'Global'} Security Agencies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}