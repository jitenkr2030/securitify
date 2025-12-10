"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/lib/currency-context";
import { CountryProvider } from "@/contexts/CountryContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CountryProvider>
          {children}
        </CountryProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}