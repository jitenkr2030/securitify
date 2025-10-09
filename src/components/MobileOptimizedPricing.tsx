"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ArrowRight, Info } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
  guardLimit: number;
  postLimit: number;
  highlight?: string;
}

interface MobileOptimizedPricingProps {
  plans: PricingPlan[];
  onPlanSelect: (planId: string) => void;
}

export default function MobileOptimizedPricing({ plans, onPlanSelect }: MobileOptimizedPricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onPlanSelect(planId);
  };

  return (
    <div className="space-y-6">
      {/* Mobile-optimized toggle for comparison view */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComparison(!showComparison)}
          className="touch-target"
        >
          <Info className="w-4 h-4 mr-2" />
          {showComparison ? "Hide" : "Show"} Comparison
        </Button>
      </div>

      {/* Comparison View */}
      {showComparison && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Plan Comparison</CardTitle>
            <CardDescription>Compare features side by side</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-2 text-sm font-semibold mb-2">
                  <div>Feature</div>
                  {plans.map(plan => (
                    <div key={plan.id} className="text-center">
                      {plan.name}
                      {plan.popular && (
                        <Badge className="ml-1 text-xs" variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Guards */}
                <div className="grid grid-cols-4 gap-2 py-2 border-t">
                  <div className="text-sm">Guards</div>
                  {plans.map(plan => (
                    <div key={plan.id} className="text-center text-sm">
                      {plan.guardLimit === -1 ? "Unlimited" : plan.guardLimit}
                    </div>
                  ))}
                </div>
                
                {/* Posts/Locations */}
                <div className="grid grid-cols-4 gap-2 py-2 border-t">
                  <div className="text-sm">Posts</div>
                  {plans.map(plan => (
                    <div key={plan.id} className="text-center text-sm">
                      {plan.postLimit === -1 ? "Unlimited" : plan.postLimit}
                    </div>
                  ))}
                </div>
                
                {/* Features */}
                {Math.max(...plans.map(p => p.features.length)) > 0 && (
                  Array.from({ length: Math.max(...plans.map(p => p.features.length)) }).map((_, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 py-2 border-t">
                      <div className="text-sm">
                        {plans[0]?.features[index] || plans[1]?.features[index] || plans[2]?.features[index] || ""}
                      </div>
                      {plans.map(plan => (
                        <div key={plan.id} className="text-center">
                          {plan.features[index] ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile-optimized pricing cards */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]' 
                : plan.popular 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200'
            } ${selectedPlan && selectedPlan !== plan.id ? 'opacity-75' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1 text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            {plan.highlight && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                  {plan.highlight}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    {plan.guardLimit === -1 ? "Unlimited" : plan.guardLimit} guards
                  </div>
                  <div className="text-xs text-gray-500">
                    {plan.postLimit === -1 ? "Unlimited" : plan.postLimit} posts
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Features list with better mobile spacing */}
              <div className="space-y-3 mb-6">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <div className="text-xs text-blue-600 font-medium">
                    +{plan.features.length - 4} more features
                  </div>
                )}
              </div>

              {/* Mobile-optimized CTA button */}
              <Button
                className={`w-full touch-target text-base font-medium py-3 ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : selectedPlan === plan.id
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
                variant={plan.popular || selectedPlan === plan.id ? "default" : "outline"}
              >
                {selectedPlan === plan.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Selected
                  </>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile-optimized feature highlights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">All Plans Include:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Real-time tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Mobile app access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Data export</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized FAQ toggle */}
      <details className="bg-gray-50 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-900 mb-2">
          Need help choosing a plan?
        </summary>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Basic:</strong> Perfect for small teams just getting started</p>
          <p><strong>Professional:</strong> Best for growing companies with advanced needs</p>
          <p><strong>Enterprise:</strong> For large operations requiring custom solutions</p>
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600"
            onClick={() => {
              // Open chat or contact form
              console.log("Open support chat");
            }}
          >
            Chat with our team →
          </Button>
        </div>
      </details>
    </div>
  );
}