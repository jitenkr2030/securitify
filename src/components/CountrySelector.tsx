'use client';

import React, { useState } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { CountryContentService } from '@/lib/countryContent';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  US: '🇺🇸',
  UK: '🇬🇧',
  CA: '🇨🇦',
  AU: '🇦🇺',
  // Middle Eastern Countries
  SA: '🇸🇦',
  AE: '🇦🇪',
  IL: '🇮🇱',
  TR: '🇹🇷',
  EG: '🇪🇬',
  // East Asian Countries
  JP: '🇯🇵',
  KR: '🇰🇷',
  CN: '🇨🇳',
  SG: '🇸🇬',
  MY: '🇲🇾',
  // African Countries
  ZA: '🇿🇦',
  NG: '🇳🇬',
  KE: '🇰🇪',
  GH: '🇬🇭',
};

export function CountrySelector() {
  const { country, setCountry, supportedCountries } = useCountry();
  const [isOpen, setIsOpen] = useState(false);

  const currentCountry = supportedCountries.find(c => c.code === country);
  const currentFlag = COUNTRY_FLAGS[country] || '🌍';

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setIsOpen(false);
    // Reload the page to apply new country content (only on client side)
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <span className="text-lg">{currentFlag}</span>
          <span className="hidden lg:inline">
            {currentCountry?.name || 'Country'}
          </span>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedCountries.map((countryInfo) => {
          const flag = COUNTRY_FLAGS[countryInfo.code] || '🌍';
          return (
            <DropdownMenuItem
              key={countryInfo.code}
              onClick={() => handleCountryChange(countryInfo.code)}
              className={`gap-3 ${country === countryInfo.code ? 'bg-blue-50' : ''}`}
            >
              <span className="text-lg">{flag}</span>
              <div className="flex-1">
                <div className="font-medium">{countryInfo.name}</div>
                <div className="text-xs text-gray-500">
                  {CountryContentService.getCurrencySymbol(countryInfo.code)}{' '}
                  {countryInfo.currency}
                </div>
              </div>
              {country === countryInfo.code && (
                <span className="text-blue-600">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CountryFlag({ countryCode, className = "" }: { countryCode: string; className?: string }) {
  const flag = COUNTRY_FLAGS[countryCode] || '🌍';
  return <span className={`text-lg ${className}`}>{flag}</span>;
}