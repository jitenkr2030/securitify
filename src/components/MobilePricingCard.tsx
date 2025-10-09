"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MobilePricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  free: boolean;
  features: Array<{ name: string; included: boolean }>;
  cta: string;
  highlight: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MobilePricingCard({
  name,
  price,
  period,
  description,
  popular,
  free,
  features,
  cta,
  highlight,
  icon: Icon
}: MobilePricingCardProps) {
  return (
    <Card className={`relative transition-all duration-300 hover:shadow-lg ${highlight ? 'border-blue-500 shadow-xl' : ''}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-medium shadow-lg touch-target">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      {/* Free Badge */}
      {free && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-medium shadow-lg touch-target">
            🚀 START FREE
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4 px-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 touch-target">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <div className="mt-3">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600 text-base">{period}</span>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-6">
        {/* Features List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start touch-target p-2 rounded-lg hover:bg-gray-50 transition-colors">
              {feature.included ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-300 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <span className={`text-sm leading-relaxed ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link href={name === "Enterprise" ? "/contact" : "/register"}>
          <Button 
            className={`w-full mt-4 py-4 text-base font-medium transition-all duration-200 touch-target h-14 ${highlight ? 'bg-blue-600 hover:bg-blue-700' : free ? 'bg-green-600 hover:bg-green-700' : ''}`}
            variant={highlight || free ? 'default' : 'outline'}
            size="lg"
          >
            {cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}