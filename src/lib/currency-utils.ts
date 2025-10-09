import { Currency } from './currency-context';
import { currencies } from './currency-context';

export interface ExchangeRates {
  [key: string]: number;
}

// Mock exchange rates - in a real app, these would come from an API
const mockExchangeRates: ExchangeRates = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  INR: 82.5,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  SGD: 1.35,
  AED: 3.67,
  SAR: 3.75,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = mockExchangeRates[fromCurrency] || 1;
  const toRate = mockExchangeRates[toCurrency] || 1;
  
  return (amount / fromRate) * toRate;
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

export function formatCurrencyByCode(
  amount: number,
  currencyCode: string,
  showCode: boolean = false
): string {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return amount.toString();

  const formatted = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showCode ? `${formatted} ${currency.code}` : formatted;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  return currency?.symbol || currencyCode;
}

export function getCurrencyName(currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  return currency?.name || currencyCode;
}

export function getAllCurrencies(): Currency[] {
  return currencies;
}

export function getPopularCurrencies(): Currency[] {
  return currencies.filter(c => 
    ['USD', 'EUR', 'GBP', 'INR', 'JPY'].includes(c.code)
  );
}