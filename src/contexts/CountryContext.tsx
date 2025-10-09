'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { countryDetection, COUNTRIES, CountryInfo } from '@/lib/countryDetection';

interface CountryContextType {
  country: string;
  countryInfo: CountryInfo | null;
  setCountry: (country: string) => void;
  loading: boolean;
  supportedCountries: CountryInfo[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: ReactNode;
}

export function CountryProvider({ children }: CountryProviderProps) {
  const [country, setCountryState] = useState<string>('US');
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCountry = async () => {
      try {
        setLoading(true);
        const detectedCountry = await countryDetection.detectCountry();
        setCountryState(detectedCountry);
        setCountryInfo(COUNTRIES[detectedCountry] || null);
      } catch (error) {
        console.error('Failed to detect country:', error);
        setCountryState('US');
        setCountryInfo(COUNTRIES['US'] || null);
      } finally {
        setLoading(false);
      }
    };

    initializeCountry();
  }, []);

  const setCountry = (newCountry: string) => {
    if (COUNTRIES[newCountry]) {
      setCountryState(newCountry);
      setCountryInfo(COUNTRIES[newCountry]);
      countryDetection.setPreferredCountry(newCountry);
    }
  };

  const value: CountryContextType = {
    country,
    countryInfo,
    setCountry,
    loading,
    supportedCountries: Object.values(COUNTRIES)
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

export function useCountryInfo(): CountryInfo | null {
  const { countryInfo } = useCountry();
  return countryInfo;
}

export function useCountryCode(): string {
  const { country } = useCountry();
  return country;
}