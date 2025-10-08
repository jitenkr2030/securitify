"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign } from "lucide-react";

interface HeaderSelectorsProps {
  className?: string;
}

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "CAD", label: "CAD ($)", symbol: "C$" },
  { value: "AUD", label: "AUD ($)", symbol: "A$" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
];

const countries = [
  { value: "US", label: "🇺🇸 United States", code: "US" },
  { value: "GB", label: "🇬🇧 United Kingdom", code: "GB" },
  { value: "IN", label: "🇮🇳 India", code: "IN" },
  { value: "CA", label: "🇨🇦 Canada", code: "CA" },
  { value: "AU", label: "🇦🇺 Australia", code: "AU" },
  { value: "DE", label: "🇩🇪 Germany", code: "DE" },
  { value: "FR", label: "🇫🇷 France", code: "FR" },
  { value: "JP", label: "🇯🇵 Japan", code: "JP" },
  { value: "SG", label: "🇸🇬 Singapore", code: "SG" },
  { value: "AE", label: "🇦🇪 UAE", code: "AE" },
];

export default function HeaderSelectors({ className }: HeaderSelectorsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [isClient, setIsClient] = useState(false);

  // Load saved preferences only on client side
  useEffect(() => {
    setIsClient(true);
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCurrency) setSelectedCurrency(savedCurrency);
    if (savedCountry) setSelectedCountry(savedCountry);
  }, []);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    // Save to localStorage only on client side
    if (isClient) {
      localStorage.setItem('selectedCurrency', value);
    }
    // You can also update a global context or state management here
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    // Save to localStorage only on client side
    if (isClient) {
      localStorage.setItem('selectedCountry', value);
    }
    // You can also update a global context or state management here
  };

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-14 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      {/* Currency Selector */}
      <div className="relative group">
        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-24 h-8 text-xs border-gray-300 dark:border-gray-600">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{currency.symbol}</span>
                  <span className="text-xs">{currency.value}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country Selector */}
      <div className="relative group">
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-20 h-8 text-xs border-gray-300 dark:border-gray-600">
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{country.label.split(' ')[0]}</span>
                  <span className="text-xs">{country.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}