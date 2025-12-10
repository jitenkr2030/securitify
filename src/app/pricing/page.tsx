"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/lib/currency-context";
import { convertCurrency, formatCurrencyByCode } from "@/lib/currency-utils";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Building2, 
  Zap, 
  Shield,
  Smartphone,
  Headphones,
  Code,
  BarChart3,
  Crown,
  ArrowRight,
  HelpCircle,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import MobilePricingCard from "@/components/MobilePricingCard";
import MobileFeatureComparison from "@/components/MobileFeatureComparison";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { currency, formatCurrency } = useCurrency();

  const plans = [
    {
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      period: "",
      description: "Perfect for small security teams getting started",
      popular: false,
      icon: Users,
      features: [
        { name: "Up to 10 guards", included: true },
        { name: "Up to 5 posts", included: true },
        { name: "Basic GPS tracking", included: true },
        { name: "Email support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Basic reporting", included: true },
        { name: "Compliance tracking", included: true },
        { name: "License renewal reminders", included: true },
        { name: "Training management", included: true },
        { name: "Priority support", included: false },
        { name: "API access", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Custom reports", included: false },
        { name: "White-label options", included: false },
        { name: "Custom integrations", included: false },
        { name: "Dedicated support", included: false }
      ],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Professional",
      price: { monthly: 99, yearly: 990 },
      period: "/month",
      description: "Best for growing security companies",
      popular: true,
      icon: Building2,
      features: [
        { name: "Up to 50 guards", included: true },
        { name: "Up to 20 posts", included: true },
        { name: "Advanced tracking", included: true },
        { name: "Priority support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Compliance automation", included: true },
        { name: "Training management", included: true },
        { name: "Digital attendance system", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom reports", included: true },
        { name: "White-label options", included: true },
        { name: "Custom integrations", included: false },
        { name: "Dedicated support", included: false }
      ],
      cta: "Most Popular",
      highlight: true
    },
    {
      name: "Business",
      price: { monthly: 199, yearly: 1990 },
      period: "/month",
      description: "For established security agencies with comprehensive needs",
      popular: false,
      icon: Shield,
      features: [
        { name: "Up to 199 guards", included: true },
        { name: "Up to 100 posts", included: true },
        { name: "Advanced tracking", included: true },
        { name: "Priority support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Full compliance automation", included: true },
        { name: "Multi-location support", included: true },
        { name: "Advanced compliance analytics", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom reports", included: true },
        { name: "White-label options", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true }
      ],
      cta: "Upgrade Now",
      highlight: false
    },
    {
      name: "Enterprise",
      price: { monthly: 399, yearly: 3990 },
      period: "/month",
      description: "For large security operations with unlimited scaling",
      popular: false,
      icon: Crown,
      features: [
        { name: "Unlimited guards", included: true },
        { name: "Unlimited posts", included: true },
        { name: "Enterprise tracking", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Mobile app access", included: true },
        { name: "Enterprise analytics", included: true },
        { name: "Complete enterprise suite", included: true },
        { name: "Multi-state multi-location support", included: true },
        { name: "Custom development and integrations", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "API access", included: true },
        { name: "Enterprise analytics", included: true },
        { name: "Custom reports", included: true },
        { name: "White-label platform", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true }
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Real-time GPS Tracking", description: "Track guards in real-time with accurate location data" },
        { name: "Geofencing & Alerts", description: "Set virtual boundaries and receive instant alerts" },
        { name: "Attendance Management", description: "QR code-based check-in/out with location verification" },
        { name: "Guard Management", description: "Complete guard profiles with document verification" }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        { name: "Mobile App", description: "Native iOS and Android apps for guards and managers" },
        { name: "Advanced Analytics", description: "Comprehensive reporting and performance insights" },
        { name: "Document Management", description: "Secure storage for compliance documents" },
        { name: "Shift Scheduling", description: "Automated shift planning and management" }
      ]
    },
    {
      category: "Enterprise Features",
      items: [
        { name: "White-label Platform", description: "Custom branding and domain options" },
        { name: "API Access", description: "Full REST API for custom integrations" },
        { name: "Custom Integrations", description: "Connect with your existing systems" },
        { name: "Dedicated Support", description: "24/7 priority support with account manager" }
      ]
    }
  ];

  const faqs = [
    {
      question: "What is included in the free trial?",
      answer: "Our 14-day free trial includes access to all Professional plan features with no credit card required. You can explore all features and invite up to 5 guards to test the platform."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle, and we'll prorate any differences."
    },
    {
      question: "How does billing work?",
      answer: "We offer both monthly and annual billing. Annual plans include 2 months free. You can pay by credit card, bank transfer, or invoice (for Enterprise customers)."
    },
    {
      question: "What kind of support do you offer?",
      answer: "Basic plan includes email support, Professional plan adds priority email and chat support, while Enterprise plan includes 24/7 phone support with a dedicated account manager."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security with end-to-end encryption, GDPR compliance, regular security audits, and automated backups. Your data is always safe and secure."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period, and we'll help you export your data if needed."
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    const basePrice = billingCycle === "yearly" ? plan.price.yearly / 12 : plan.price.monthly;
    if (basePrice === 0) {
      return "Free";
    }
    const convertedPrice = convertCurrency(basePrice, "USD", currency.code);
    return formatCurrencyByCode(convertedPrice, currency.code);
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) {
      return "";
    }
    return billingCycle === "yearly" ? "/month (billed annually)" : "/month";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose the Perfect Plan
              <span className="block text-blue-300">for Your Security Company</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Flexible pricing plans designed to grow with your business. 
              No hidden fees, no long-term contracts.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg ${billingCycle === "monthly" ? "font-semibold" : "text-blue-200"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="sr-only">Toggle billing cycle</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-lg ${billingCycle === "yearly" ? "font-semibold" : "text-blue-200"}`}>
                Yearly <Badge className="ml-2 bg-green-500 text-white">Save 20%</Badge>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Mobile Cards Layout */}
          <div className="md:hidden space-y-6">
            {plans.map((plan, index) => (
              <MobilePricingCard
                key={index}
                name={plan.name}
                price={getPrice(plan)}
                period={getPeriod(plan)}
                description={plan.description}
                popular={plan.popular}
                free={plan.price.monthly === 0}
                features={plan.features}
                cta={plan.cta}
                highlight={plan.highlight}
                icon={plan.icon}
              />
            ))}
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid lg:grid-cols-4 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.highlight ? 'border-blue-500 shadow-xl' : ''} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-medium shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.price.monthly === 0 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-medium shadow-lg">
                    🚀 START FREE
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-6 px-4 sm:px-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{getPrice(plan)}</span>
                  <span className="text-gray-600 text-sm sm:text-base">{getPeriod(plan)}</span>
                </div>
                <CardDescription className="mt-2 text-sm sm:text-base leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm leading-relaxed ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                  <Button 
                    className={`w-full mt-4 sm:mt-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : plan.price.monthly === 0 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    variant={plan.highlight || plan.price.monthly === 0 ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Detailed comparison of features across all plans
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Mobile Comparison Component */}
            <div className="md:hidden p-4">
              <MobileFeatureComparison
                features={features}
                plans={[
                  {
                    name: "Starter",
                    color: "bg-gray-600 hover:bg-gray-700",
                    features: {
                      core: true,
                      advanced: false,
                      enterprise: false
                    }
                  },
                  {
                    name: "Professional",
                    color: "bg-blue-600 hover:bg-blue-700",
                    features: {
                      core: true,
                      advanced: true,
                      enterprise: false
                    }
                  },
                  {
                    name: "Business",
                    color: "bg-purple-600 hover:bg-purple-700",
                    features: {
                      core: true,
                      advanced: true,
                      enterprise: true
                    }
                  },
                  {
                    name: "Enterprise",
                    color: "bg-orange-600 hover:bg-orange-700",
                    features: {
                      core: true,
                      advanced: true,
                      enterprise: true
                    }
                  }
                ]}
              />
            </div>

            {/* Desktop Comparison Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {features.map((category, categoryIndex) => (
                    <tr key={categoryIndex} className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-100">
                        {category.category}
                      </td>
                    </tr>
                  ))}
                  {features.map((category, categoryIndex) =>
                    category.items.map((item, itemIndex) => (
                      <tr key={`${categoryIndex}-${itemIndex}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {categoryIndex === 0 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : categoryIndex === 1 ? (
                            <div className="w-5 h-5 rounded-full border border-gray-300 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {categoryIndex === 0 || categoryIndex === 1 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {categoryIndex === 0 || categoryIndex === 1 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Choose the plan that fits your needs and start transforming your security operations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}