"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency, currencies } from "@/lib/currency-context";
import { DollarSign, ChevronDown } from "lucide-react";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-auto px-3">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="font-medium hidden sm:inline">{currency.code}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr)}
            className={`flex items-center justify-between ${
              currency.code === curr.code ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-2">{curr.symbol}</span>
              <span>{curr.code}</span>
            </div>
            <span className="text-sm text-muted-foreground">{curr.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}