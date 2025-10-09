export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  phoneCode: string;
  regulations: {
    authority: string;
    licensingRequired: boolean;
    trainingRequired: boolean;
    backgroundChecks: boolean;
  };
}

export const COUNTRIES: Record<string, CountryInfo> = {
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+91',
    regulations: {
      authority: 'PSARA',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',
    phoneCode: '+1',
    regulations: {
      authority: 'State Licensing Boards',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+44',
    regulations: {
      authority: 'SIA',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+1',
    regulations: {
      authority: 'Provincial Licensing',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+61',
    regulations: {
      authority: 'State Licensing Authorities',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  // Middle Eastern Countries
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'SAR',
    currencySymbol: '﷼',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+966',
    regulations: {
      authority: 'Ministry of Interior',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'د.إ',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+971',
    regulations: {
      authority: 'PSBD Dubai & SIRA',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  IL: {
    code: 'IL',
    name: 'Israel',
    currency: 'ILS',
    currencySymbol: '₪',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+972',
    regulations: {
      authority: 'Ministry of Public Security',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  TR: {
    code: 'TR',
    name: 'Turkey',
    currency: 'TRY',
    currencySymbol: '₺',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+90',
    regulations: {
      authority: 'General Directorate of Security',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'ج.م',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+20',
    regulations: {
      authority: 'Ministry of Interior',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  // East Asian Countries
  JP: {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    dateFormat: 'YYYY/MM/DD',
    phoneCode: '+81',
    regulations: {
      authority: 'National Police Agency',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  KR: {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    dateFormat: 'YYYY/MM/DD',
    phoneCode: '+82',
    regulations: {
      authority: 'National Police Agency',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  CN: {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    dateFormat: 'YYYY/MM/DD',
    phoneCode: '+86',
    regulations: {
      authority: 'Ministry of Public Security',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+65',
    regulations: {
      authority: 'Police Licensing & Regulatory Department',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    currencySymbol: 'RM',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+60',
    regulations: {
      authority: 'Ministry of Home Affairs',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  // African Countries
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    dateFormat: 'YYYY/MM/DD',
    phoneCode: '+27',
    regulations: {
      authority: 'PSIRA',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+234',
    regulations: {
      authority: 'NSCDC',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+254',
    regulations: {
      authority: 'Private Security Regulatory Authority',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    currencySymbol: '₵',
    dateFormat: 'DD/MM/YYYY',
    phoneCode: '+233',
    regulations: {
      authority: 'Ministry of Interior',
      licensingRequired: true,
      trainingRequired: true,
      backgroundChecks: true
    }
  }
};

export class CountryDetectionService {
  private static instance: CountryDetectionService;
  private detectedCountry: string | null = null;

  static getInstance(): CountryDetectionService {
    if (!CountryDetectionService.instance) {
      CountryDetectionService.instance = new CountryDetectionService();
    }
    return CountryDetectionService.instance;
  }

  async detectCountry(): Promise<string> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      // Server-side or no localStorage, return default
      this.detectedCountry = 'US';
      return 'US';
    }

    // First check localStorage for user preference
    const savedCountry = localStorage.getItem('preferredCountry');
    if (savedCountry && COUNTRIES[savedCountry]) {
      this.detectedCountry = savedCountry;
      return savedCountry;
    }

    // Then try browser geolocation
    try {
      const geoCountry = await this.getCountryFromGeolocation();
      if (geoCountry && COUNTRIES[geoCountry]) {
        this.detectedCountry = geoCountry;
        localStorage.setItem('detectedCountry', geoCountry);
        return geoCountry;
      }
    } catch (error) {
      console.log('Geolocation failed, falling back to IP detection');
    }

    // Fallback to IP-based detection
    try {
      const ipCountry = await this.getCountryFromIP();
      if (ipCountry && COUNTRIES[ipCountry]) {
        this.detectedCountry = ipCountry;
        localStorage.setItem('detectedCountry', ipCountry);
        return ipCountry;
      }
    } catch (error) {
      console.log('IP detection failed, using default');
    }

    // Default to US
    this.detectedCountry = 'US';
    localStorage.setItem('detectedCountry', 'US');
    return 'US';
  }

  private async getCountryFromGeolocation(): Promise<string | null> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding service
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            resolve(data.countryCode);
          } catch (error) {
            resolve(null);
          }
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  private async getCountryFromIP(): Promise<string | null> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country;
    } catch (error) {
      try {
        // Fallback IP service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.country;
      } catch (error2) {
        return null;
      }
    }
  }

  setPreferredCountry(country: string): void {
    if (COUNTRIES[country]) {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('preferredCountry', country);
      }
      this.detectedCountry = country;
    }
  }

  getCountryInfo(country: string): CountryInfo | null {
    return COUNTRIES[country] || null;
  }

  getCurrentCountry(): string | null {
    return this.detectedCountry;
  }

  getSupportedCountries(): CountryInfo[] {
    return Object.values(COUNTRIES);
  }
}

export const countryDetection = CountryDetectionService.getInstance();