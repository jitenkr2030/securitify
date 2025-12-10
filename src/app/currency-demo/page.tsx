"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency, currencies } from "@/lib/currency-context";
import { convertCurrency } from "@/lib/currency-utils";
import { DollarSign, TrendingUp, Globe, CheckCircle } from "lucide-react";

export default function CurrencyDemoPage() {
  const { currency, formatCurrency, setCurrency } = useCurrency();

  const samplePrices = [
    { amount: 49.99, description: "Basic Plan - Monthly" },
    { amount: 99.99, description: "Professional Plan - Monthly" },
    { amount: 299.99, description: "Enterprise Plan - Monthly" },
    { amount: 499.99, description: "Annual Subscription" },
    { amount: 19.99, description: "Add-on Service" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold">Currency Selector Demo</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of multi-currency support in Securitify. 
            Select your preferred currency and see prices update in real-time.
          </p>
        </div>

        {/* Current Currency Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Current Currency Selection
            </CardTitle>
            <CardDescription>
              Your currently selected currency with formatting examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Currency Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code:</span>
                    <span className="font-medium">{currency.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="font-medium">{currency.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{currency.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Locale:</span>
                    <span className="font-medium">{currency.locale}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Formatting Examples</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$99.99:</span>
                    <span className="font-medium">{formatCurrency(convertCurrency(99.99, "USD", currency.code))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$1,000.00:</span>
                    <span className="font-medium">{formatCurrency(convertCurrency(1000, "USD", currency.code))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">$2,499.99:</span>
                    <span className="font-medium">{formatCurrency(convertCurrency(2499.99, "USD", currency.code))}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Prices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Sample Prices in {currency.name}
            </CardTitle>
            <CardDescription>
              See how different prices look in your selected currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {samplePrices.map((price, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {formatCurrency(convertCurrency(price.amount, "USD", currency.code))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {price.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Original: ${price.amount} USD
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Currencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Quick Currency Selection
            </CardTitle>
            <CardDescription>
              Try different currencies to see the formatting in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { code: 'USD', name: 'US Dollar' },
                { code: 'EUR', name: 'Euro' },
                { code: 'GBP', name: 'British Pound' },
                { code: 'INR', name: 'Indian Rupee' },
                { code: 'JPY', name: 'Japanese Yen' },
                { code: 'CAD', name: 'Canadian Dollar' },
              ].map((curr) => (
                <Button
                  key={curr.code}
                  variant={currency.code === curr.code ? "default" : "outline"}
                  onClick={() => {
                    const foundCurrency = currencies.find(c => c.code === curr.code);
                    if (foundCurrency) {
                      setCurrency(foundCurrency);
                    }
                  }}
                  className="w-full"
                >
                  {curr.code}
                  <span className="text-xs ml-1">{curr.name.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            The currency selector is integrated into the header navigation and works across all pages.
            Your selection is saved and persists between sessions.
          </p>
        </div>
      </div>
    </div>
  );
}