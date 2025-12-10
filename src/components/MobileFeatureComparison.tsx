"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, ChevronRight } from "lucide-react";

interface FeatureCategory {
  category: string;
  items: Array<{
    name: string;
    description: string;
  }>;
}

interface PlanFeatures {
  name: string;
  color: string;
  features: {
    core: boolean;
    advanced: boolean;
    enterprise: boolean;
  };
}

interface MobileFeatureComparisonProps {
  features: FeatureCategory[];
  plans: PlanFeatures[];
}

export default function MobileFeatureComparison({
  features,
  plans
}: MobileFeatureComparisonProps) {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const togglePlan = (planName: string) => {
    setExpandedPlan(expandedPlan === planName ? null : planName);
    setExpandedCategory(null);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const isFeatureIncluded = (categoryIndex: number, plan: PlanFeatures) => {
    if (categoryIndex === 0) return plan.features.core;
    if (categoryIndex === 1) return plan.features.advanced;
    if (categoryIndex === 2) return plan.features.enterprise;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Plan Selector */}
      <div className="flex flex-col gap-2">
        {plans.map((plan) => (
          <Button
            key={plan.name}
            variant={expandedPlan === plan.name ? "default" : "outline"}
            className={`w-full justify-between touch-target h-12 ${expandedPlan === plan.name ? plan.color : ''}`}
            onClick={() => togglePlan(plan.name)}
          >
            <span>{plan.name}</span>
            {expandedPlan === plan.name ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        ))}
      </div>

      {/* Feature Details for Selected Plan */}
      {expandedPlan && (
        <div className="space-y-4">
          {features.map((category, categoryIndex) => {
            const isCategoryExpanded = expandedCategory === category.category;
            const selectedPlan = plans.find(p => p.name === expandedPlan);
            const isCategoryIncluded = selectedPlan ? isFeatureIncluded(categoryIndex, selectedPlan) : false;

            return (
              <Card key={category.category} className="overflow-hidden">
                <CardHeader 
                  className="pb-3 cursor-pointer touch-target"
                  onClick={() => toggleCategory(category.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                      {isCategoryIncluded && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Included
                        </Badge>
                      )}
                      {!isCategoryIncluded && (
                        <Badge variant="secondary" className="text-xs">
                          Not Available
                        </Badge>
                      )}
                    </div>
                    {isCategoryExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {isCategoryExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex} 
                          className="p-3 rounded-lg border touch-target hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-900 flex-1 pr-2">
                              {item.name}
                            </h4>
                            {isCategoryIncluded ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}