interface CountryFeatures {
  title: string;
  description: string;
  icon: string;
}

interface CountryPricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface CountryContent {
  country: string;
  currency: string;
  currencySymbol: string;
  features: CountryFeatures[];
  pricing: CountryPricingPlan[];
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  compliance: {
    authority: string;
    requirements: string[];
    documents: string[];
  };
}

export const COUNTRY_CONTENT: Record<string, CountryContent> = {
  IN: {
    country: "IN",
    currency: "INR",
    currencySymbol: "₹",
    features: [
      {
        title: "Complete PSARA Compliance",
        description: "Automated compliance tracking with audit-ready reports and real-time status monitoring",
        icon: "shield"
      },
      {
        title: "Digital Guard Registration",
        description: "Comprehensive guard profiles with training records, police verification, and document management",
        icon: "users"
      },
      {
        title: "Multi-State License Tracking",
        description: "Monitor license renewals across all Indian states with automated expiry alerts",
        icon: "map-pin"
      },
      {
        title: "Training & Certification",
        description: "Training program management, attendance tracking, and certificate expiration monitoring",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "QR-based shift registration with PDF export and real-time attendance monitoring",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile access for guards and managers with offline capabilities",
        icon: "smartphone"
      },
      {
        title: "PSARA Wage Register",
        description: "Automated payroll management compliant with PSARA wage regulations",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts, MOUs, and agreements with automated renewal reminders",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance scoring with detailed analytics and reporting",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with PSARA compliance",
        features: [
          "Up to 10 guards",
          "Complete PSARA compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "₹3,999",
        period: "/month",
        description: "Best for growing security operations with advanced PSARA features",
        features: [
          "Up to 50 guards",
          "Advanced PSARA compliance automation",
          "Complete training management",
          "Digital attendance system with QR codes",
          "PSARA wage register maintenance",
          "Client agreement tracking",
          "Multi-state license management",
          "Advanced analytics dashboard",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "₹7,999",
        period: "/month",
        description: "For established security agencies with comprehensive needs",
        features: [
          "Up to 199 guards",
          "Full PSARA automation suite",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "₹24,999",
        period: "/month",
        description: "For large security operations with unlimited scaling",
        features: [
          "Unlimited guards",
          "Complete PSARA enterprise suite",
          "Multi-state multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete PSARA Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our PSARA-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "PSARA (Private Security Agencies Regulation Act)",
      requirements: [
        "Agency license from state government",
        "Guard training certification",
        "Police verification for all guards",
        "Maintain duty registers",
        "Wage register maintenance",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Agency license",
        "Guard training certificates",
        "Police clearance certificates",
        "Identity proof (Aadhaar/PAN)",
        "Address proof",
        "Photographs",
        "Character certificates"
      ]
    }
  },
  US: {
    country: "US",
    currency: "USD",
    currencySymbol: "$",
    features: [
      {
        title: "State Licensing Compliance",
        description: "Automated state security license tracking with renewal reminders and compliance monitoring",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with background checks, certifications, and training records",
        icon: "users"
      },
      {
        title: "Multi-State Operations",
        description: "Manage security operations across different states with varying regulatory requirements",
        icon: "map-pin"
      },
      {
        title: "Training & Certification",
        description: "OSHA compliance training, certification tracking, and mandatory training management",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "GPS-enabled time tracking with geofencing and detailed attendance reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution for guards and supervisors with real-time communication",
        icon: "smartphone"
      },
      {
        title: "Payroll & Tax Compliance",
        description: "Automated payroll processing with tax compliance and labor law adherence",
        icon: "building-2"
      },
      {
        title: "Client Contract Management",
        description: "Track service agreements, insurance requirements, and compliance documentation",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with audit trails and regulatory reporting",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security companies getting started with compliance management",
        features: [
          "Up to 10 guards",
          "Basic compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "$49",
        period: "/month",
        description: "Best for growing security operations with advanced compliance features",
        features: [
          "Up to 50 guards",
          "Advanced compliance automation",
          "Complete training management",
          "GPS attendance system",
          "Payroll processing",
          "Client contract tracking",
          "Multi-state support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "$99",
        period: "/month",
        description: "For established security companies with comprehensive needs",
        features: [
          "Up to 199 guards",
          "Full compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "$299",
        period: "/month",
        description: "For large security operations with unlimited scaling",
        features: [
          "Unlimited guards",
          "Complete enterprise suite",
          "Multi-state multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security company with our comprehensive compliance platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "State Licensing Boards & OSHA",
      requirements: [
        "State security license",
        "Guard training certification",
        "Background checks",
        "OSHA compliance",
        "Insurance requirements",
        "Payroll tax compliance",
        "Labor law adherence"
      ],
      documents: [
        "State business license",
        "Security agency license",
        "Guard training certificates",
        "Background check reports",
        "Insurance certificates",
        "OSHA compliance documents",
        "Tax ID numbers",
        "Incorporation documents"
      ]
    }
  },
  UK: {
    country: "UK",
    currency: "GBP",
    currencySymbol: "£",
    features: [
      {
        title: "SIA License Compliance",
        description: "Automated SIA license tracking with renewal reminders and compliance monitoring",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with DBS checks, SIA licenses, and training records",
        icon: "users"
      },
      {
        title: "UK-Wide Operations",
        description: "Manage security operations across England, Scotland, Wales, and Northern Ireland",
        icon: "map-pin"
      },
      {
        title: "Training & Certification",
        description: "SIA-approved training management, certification tracking, and mandatory refresher courses",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "GPS-enabled time tracking with geofencing and detailed attendance reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution for security officers and supervisors with real-time communication",
        icon: "smartphone"
      },
      {
        title: "Payroll & Tax Compliance",
        description: "Automated payroll processing with UK tax compliance and National Insurance handling",
        icon: "building-2"
      },
      {
        title: "Client Contract Management",
        description: "Track service agreements, insurance requirements, and SIA compliance documentation",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time SIA compliance monitoring with audit trails and regulatory reporting",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security companies getting started with SIA compliance",
        features: [
          "Up to 10 guards",
          "Basic SIA compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "£39",
        period: "/month",
        description: "Best for growing security operations with advanced SIA compliance features",
        features: [
          "Up to 50 guards",
          "Advanced SIA compliance automation",
          "Complete training management",
          "GPS attendance system",
          "Payroll processing",
          "Client contract tracking",
          "UK-wide support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "£79",
        period: "/month",
        description: "For established security companies with comprehensive needs",
        features: [
          "Up to 199 guards",
          "Full SIA automation suite",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "£239",
        period: "/month",
        description: "For large security operations with unlimited scaling",
        features: [
          "Unlimited guards",
          "Complete enterprise suite",
          "UK-wide multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete SIA Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security company with our SIA-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "SIA (Security Industry Authority)",
      requirements: [
        "SIA license for all operatives",
        "Approved training certification",
        "DBS background checks",
        "Identity verification",
        "Right to work verification",
        "First aid certification",
        "Health & safety compliance"
      ],
      documents: [
        "SIA licenses",
        "Training certificates",
        "DBS certificates",
        "Proof of identity",
        "Right to work documents",
        "First aid certificates",
        "Public liability insurance",
        "Employer's liability insurance"
      ]
    }
  },
  // Middle Eastern Countries
  SA: {
    country: "SA",
    currency: "SAR",
    currencySymbol: "﷼",
    features: [
      {
        title: "Ministry of Interior Compliance",
        description: "Complete compliance tracking with Saudi security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Saudi national ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Region Operations",
        description: "Manage security operations across all Saudi regions with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Saudi Training Certification",
        description: "Training program management compliant with Saudi security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and RFID-based attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Arabic language support and offline capabilities",
        icon: "smartphone"
      },
      {
        title: "Saudi Payroll Compliance",
        description: "Automated payroll with Saudi labor law compliance and Saudization requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Saudi business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Saudi regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Saudi compliance",
        features: [
          "Up to 10 guards",
          "Basic Saudi compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "﷼599",
        period: "/month",
        description: "Best for growing security operations with advanced Saudi compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Saudi compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Saudi payroll processing",
          "Client contract tracking",
          "Multi-region support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "﷼1,199",
        period: "/month",
        description: "For established security agencies with comprehensive Saudi compliance needs",
        features: [
          "Up to 199 guards",
          "Full Saudi compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "﷼3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across Saudi Arabia",
        features: [
          "Unlimited guards",
          "Complete Saudi enterprise suite",
          "Multi-region multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Saudi Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Saudi-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "Ministry of Interior - Saudi Arabia",
      requirements: [
        "Security agency license from Ministry of Interior",
        "Guard training certification",
        "Saudi national ID verification",
        "Saudization quota compliance",
        "Maintain duty registers",
        "Payroll compliance with Saudi labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Ministry of Interior license",
        "Guard training certificates",
        "Saudi national ID copies",
        "Residence permits (Iqama)",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  AE: {
    country: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    features: [
      {
        title: "PSBD & SIRA Compliance",
        description: "Complete compliance tracking with Dubai PSBD and SIRA regulations",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Emirates ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Emirate Operations",
        description: "Manage security operations across all UAE emirates with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "UAE Training Certification",
        description: "Training program management compliant with UAE security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Arabic and English language support",
        icon: "smartphone"
      },
      {
        title: "UAE Payroll Compliance",
        description: "Automated payroll with UAE labor law compliance and Emiratization requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with UAE business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with UAE regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with UAE compliance",
        features: [
          "Up to 10 guards",
          "Basic UAE compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "د.إ599",
        period: "/month",
        description: "Best for growing security operations with advanced UAE compliance features",
        features: [
          "Up to 50 guards",
          "Advanced UAE compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "UAE payroll processing",
          "Client contract tracking",
          "Multi-emirate support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "د.إ1,199",
        period: "/month",
        description: "For established security agencies with comprehensive UAE compliance needs",
        features: [
          "Up to 199 guards",
          "Full UAE compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "د.إ3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across UAE",
        features: [
          "Unlimited guards",
          "Complete UAE enterprise suite",
          "Multi-emirate multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete UAE Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our UAE-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "PSBD Dubai & SIRA - UAE",
      requirements: [
        "Security agency license from PSBD/SIRA",
        "Guard training certification",
        "Emirates ID verification",
        "Emiratization quota compliance",
        "Maintain duty registers",
        "Payroll compliance with UAE labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "PSBD/SIRA license",
        "Guard training certificates",
        "Emirates ID copies",
        "Residence visas",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  IL: {
    country: "IL",
    currency: "ILS",
    currencySymbol: "₪",
    features: [
      {
        title: "Ministry of Public Security Compliance",
        description: "Complete compliance tracking with Israeli security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Israeli ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-District Operations",
        description: "Manage security operations across all Israeli districts with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Israeli Training Certification",
        description: "Training program management compliant with Israeli security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Hebrew and English language support",
        icon: "smartphone"
      },
      {
        title: "Israeli Payroll Compliance",
        description: "Automated payroll with Israeli labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Israeli business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Israeli regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Israeli compliance",
        features: [
          "Up to 10 guards",
          "Basic Israeli compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "₪599",
        period: "/month",
        description: "Best for growing security operations with advanced Israeli compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Israeli compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Israeli payroll processing",
          "Client contract tracking",
          "Multi-district support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "₪1,199",
        period: "/month",
        description: "For established security agencies with comprehensive Israeli compliance needs",
        features: [
          "Up to 199 guards",
          "Full Israeli compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "₪3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across Israel",
        features: [
          "Unlimited guards",
          "Complete Israeli enterprise suite",
          "Multi-district multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Israeli Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Israeli-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "Ministry of Public Security - Israel",
      requirements: [
        "Security agency license from Ministry of Public Security",
        "Guard training certification",
        "Israeli ID verification",
        "Military service verification",
        "Maintain duty registers",
        "Payroll compliance with Israeli labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Ministry of Public Security license",
        "Guard training certificates",
        "Israeli ID copies",
        "Military discharge certificates",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  TR: {
    country: "TR",
    currency: "TRY",
    currencySymbol: "₺",
    features: [
      {
        title: "General Directorate of Security Compliance",
        description: "Complete compliance tracking with Turkish security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Turkish ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Province Operations",
        description: "Manage security operations across all Turkish provinces with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Turkish Training Certification",
        description: "Training program management compliant with Turkish security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Turkish language support",
        icon: "smartphone"
      },
      {
        title: "Turkish Payroll Compliance",
        description: "Automated payroll with Turkish labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Turkish business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Turkish regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Turkish compliance",
        features: [
          "Up to 10 guards",
          "Basic Turkish compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "₺599",
        period: "/month",
        description: "Best for growing security operations with advanced Turkish compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Turkish compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Turkish payroll processing",
          "Client contract tracking",
          "Multi-province support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "₺1,199",
        period: "/month",
        description: "For established security agencies with comprehensive Turkish compliance needs",
        features: [
          "Up to 199 guards",
          "Full Turkish compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "₺3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across Turkey",
        features: [
          "Unlimited guards",
          "Complete Turkish enterprise suite",
          "Multi-province multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Turkish Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Turkish-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "General Directorate of Security - Turkey",
      requirements: [
        "Security agency license from General Directorate of Security",
        "Guard training certification",
        "Turkish ID verification",
        "Military service verification",
        "Maintain duty registers",
        "Payroll compliance with Turkish labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "General Directorate of Security license",
        "Guard training certificates",
        "Turkish ID copies",
        "Military discharge certificates",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  EG: {
    country: "EG",
    currency: "EGP",
    currencySymbol: "ج.م",
    features: [
      {
        title: "Ministry of Interior Compliance",
        description: "Complete compliance tracking with Egyptian security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Egyptian National ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Governorate Operations",
        description: "Manage security operations across all Egyptian governorates with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Egyptian Training Certification",
        description: "Training program management compliant with Egyptian security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Arabic language support",
        icon: "smartphone"
      },
      {
        title: "Egyptian Payroll Compliance",
        description: "Automated payroll with Egyptian labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Egyptian business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Egyptian regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Egyptian compliance",
        features: [
          "Up to 10 guards",
          "Basic Egyptian compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "ج.م599",
        period: "/month",
        description: "Best for growing security operations with advanced Egyptian compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Egyptian compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Egyptian payroll processing",
          "Client contract tracking",
          "Multi-governorate support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "ج.م1,199",
        period: "/month",
        description: "For established security agencies with comprehensive Egyptian compliance needs",
        features: [
          "Up to 199 guards",
          "Full Egyptian compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "ج.م3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across Egypt",
        features: [
          "Unlimited guards",
          "Complete Egyptian enterprise suite",
          "Multi-governorate multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Egyptian Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Egyptian-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "Ministry of Interior - Egypt",
      requirements: [
        "Security agency license from Ministry of Interior",
        "Guard training certification",
        "Egyptian National ID verification",
        "Military service verification",
        "Maintain duty registers",
        "Payroll compliance with Egyptian labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Ministry of Interior license",
        "Guard training certificates",
        "Egyptian National ID copies",
        "Military discharge certificates",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  JP: {
    country: "JP",
    currency: "JPY",
    currencySymbol: "¥",
    features: [
      {
        title: "National Police Agency Compliance",
        description: "Complete compliance tracking with Japanese security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Japanese My Number verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Prefecture Operations",
        description: "Manage security operations across all Japanese prefectures with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Japanese Training Certification",
        description: "Training program management compliant with Japanese security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with Japanese language support",
        icon: "smartphone"
      },
      {
        title: "Japanese Payroll Compliance",
        description: "Automated payroll with Japanese labor law compliance and social insurance requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Japanese business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Japanese regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Japanese compliance",
        features: [
          "Up to 10 guards",
          "Basic Japanese compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "¥5,999",
        period: "/month",
        description: "Best for growing security operations with advanced Japanese compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Japanese compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Japanese payroll processing",
          "Client contract tracking",
          "Multi-prefecture support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "¥11,999",
        period: "/month",
        description: "For established security agencies with comprehensive Japanese compliance needs",
        features: [
          "Up to 199 guards",
          "Full Japanese compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "¥35,999",
        period: "/month",
        description: "For large security operations with unlimited scaling across Japan",
        features: [
          "Unlimited guards",
          "Complete Japanese enterprise suite",
          "Multi-prefecture multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Japanese Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Japanese-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "National Police Agency - Japan",
      requirements: [
        "Security agency license from National Police Agency",
        "Guard training certification",
        "Japanese My Number verification",
        "Background checks",
        "Maintain duty registers",
        "Payroll compliance with Japanese labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "National Police Agency license",
        "Guard training certificates",
        "My Number cards",
        "Residence certificates",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents"
      ]
    }
  },
  ZA: {
    country: "ZA",
    currency: "ZAR",
    currencySymbol: "R",
    features: [
      {
        title: "PSIRA Compliance",
        description: "Complete compliance tracking with South African security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with South African ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Province Operations",
        description: "Manage security operations across all South African provinces with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "South African Training Certification",
        description: "Training program management compliant with PSIRA and security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with multiple South African language support",
        icon: "smartphone"
      },
      {
        title: "South African Payroll Compliance",
        description: "Automated payroll with South African labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with South African business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with PSIRA regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with South African compliance",
        features: [
          "Up to 10 guards",
          "Basic PSIRA compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "R599",
        period: "/month",
        description: "Best for growing security operations with advanced PSIRA compliance features",
        features: [
          "Up to 50 guards",
          "Advanced PSIRA compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "South African payroll processing",
          "Client contract tracking",
          "Multi-province support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "R1,199",
        period: "/month",
        description: "For established security agencies with comprehensive PSIRA compliance needs",
        features: [
          "Up to 199 guards",
          "Full PSIRA compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "R3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across South Africa",
        features: [
          "Unlimited guards",
          "Complete PSIRA enterprise suite",
          "Multi-province multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete PSIRA Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our PSIRA-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "PSIRA - Private Security Industry Regulatory Authority",
      requirements: [
        "PSIRA registration and licensing",
        "Guard training certification",
        "South African ID verification",
        "Background checks",
        "Maintain duty registers",
        "Payroll compliance with South African labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "PSIRA registration certificate",
        "Guard training certificates",
        "South African ID copies",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents",
        "Tax clearance certificates"
      ]
    }
  },
  NG: {
    country: "NG",
    currency: "NGN",
    currencySymbol: "₦",
    features: [
      {
        title: "NSCDC Compliance",
        description: "Complete compliance tracking with Nigerian security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Nigerian ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-State Operations",
        description: "Manage security operations across all Nigerian states with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Nigerian Training Certification",
        description: "Training program management compliant with NSCDC and security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with multiple Nigerian language support",
        icon: "smartphone"
      },
      {
        title: "Nigerian Payroll Compliance",
        description: "Automated payroll with Nigerian labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Nigerian business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with NSCDC regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Nigerian compliance",
        features: [
          "Up to 10 guards",
          "Basic NSCDC compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "₦59,999",
        period: "/month",
        description: "Best for growing security operations with advanced NSCDC compliance features",
        features: [
          "Up to 50 guards",
          "Advanced NSCDC compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Nigerian payroll processing",
          "Client contract tracking",
          "Multi-state support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "₦119,999",
        period: "/month",
        description: "For established security agencies with comprehensive NSCDC compliance needs",
        features: [
          "Up to 199 guards",
          "Full NSCDC compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "₦359,999",
        period: "/month",
        description: "For large security operations with unlimited scaling across Nigeria",
        features: [
          "Unlimited guards",
          "Complete NSCDC enterprise suite",
          "Multi-state multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete NSCDC Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our NSCDC-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "NSCDC - Nigeria Security and Civil Defence Corps",
      requirements: [
        "NSCDC registration and licensing",
        "Guard training certification",
        "Nigerian ID verification",
        "Background checks",
        "Maintain duty registers",
        "Payroll compliance with Nigerian labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "NSCDC registration certificate",
        "Guard training certificates",
        "Nigerian ID copies",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents",
        "Tax clearance certificates"
      ]
    }
  },
  KE: {
    country: "KE",
    currency: "KES",
    currencySymbol: "KSh",
    features: [
      {
        title: "Private Security Regulatory Authority Compliance",
        description: "Complete compliance tracking with Kenyan security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Kenyan ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-County Operations",
        description: "Manage security operations across all Kenyan counties with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Kenyan Training Certification",
        description: "Training program management compliant with Kenyan security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with multiple Kenyan language support",
        icon: "smartphone"
      },
      {
        title: "Kenyan Payroll Compliance",
        description: "Automated payroll with Kenyan labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Kenyan business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Kenyan regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Kenyan compliance",
        features: [
          "Up to 10 guards",
          "Basic Kenyan compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "KSh5,999",
        period: "/month",
        description: "Best for growing security operations with advanced Kenyan compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Kenyan compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Kenyan payroll processing",
          "Client contract tracking",
          "Multi-county support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "KSh11,999",
        period: "/month",
        description: "For established security agencies with comprehensive Kenyan compliance needs",
        features: [
          "Up to 199 guards",
          "Full Kenyan compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "KSh35,999",
        period: "/month",
        description: "For large security operations with unlimited scaling across Kenya",
        features: [
          "Unlimited guards",
          "Complete Kenyan enterprise suite",
          "Multi-county multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Kenyan Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Kenyan-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "Private Security Regulatory Authority - Kenya",
      requirements: [
        "Private Security Regulatory Authority registration and licensing",
        "Guard training certification",
        "Kenyan ID verification",
        "Background checks",
        "Maintain duty registers",
        "Payroll compliance with Kenyan labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Private Security Regulatory Authority certificate",
        "Guard training certificates",
        "Kenyan ID copies",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents",
        "Tax clearance certificates"
      ]
    }
  },
  GH: {
    country: "GH",
    currency: "GHS",
    currencySymbol: "₵",
    features: [
      {
        title: "Ministry of Interior Compliance",
        description: "Complete compliance tracking with Ghanaian security regulations and automated reporting",
        icon: "shield"
      },
      {
        title: "Digital Guard Management",
        description: "Comprehensive guard profiles with Ghanaian ID verification and training records",
        icon: "users"
      },
      {
        title: "Multi-Region Operations",
        description: "Manage security operations across all Ghanaian regions with local regulation compliance",
        icon: "map-pin"
      },
      {
        title: "Ghanaian Training Certification",
        description: "Training program management compliant with Ghanaian security authority requirements",
        icon: "alert-triangle"
      },
      {
        title: "Digital Attendance System",
        description: "Biometric and GPS-enabled attendance with real-time monitoring and reporting",
        icon: "clock"
      },
      {
        title: "Mobile-First Platform",
        description: "Complete mobile solution with multiple Ghanaian language support",
        icon: "smartphone"
      },
      {
        title: "Ghanaian Payroll Compliance",
        description: "Automated payroll with Ghanaian labor law compliance and tax requirements",
        icon: "building-2"
      },
      {
        title: "Client Agreement Management",
        description: "Track contracts and agreements with Ghanaian business law compliance",
        icon: "check-circle"
      },
      {
        title: "Compliance Dashboard",
        description: "Real-time compliance monitoring with Ghanaian regulatory reporting requirements",
        icon: "star"
      }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for small security agencies getting started with Ghanaian compliance",
        features: [
          "Up to 10 guards",
          "Basic Ghanaian compliance tracking",
          "Digital guard registration",
          "License renewal reminders",
          "Training management",
          "Mobile app access",
          "Basic reporting",
          "Email support"
        ],
        popular: false,
        cta: "Get Started Free"
      },
      {
        name: "Professional",
        price: "₵599",
        period: "/month",
        description: "Best for growing security operations with advanced Ghanaian compliance features",
        features: [
          "Up to 50 guards",
          "Advanced Ghanaian compliance automation",
          "Complete training management",
          "Biometric attendance system",
          "Ghanaian payroll processing",
          "Client contract tracking",
          "Multi-region support",
          "Advanced analytics",
          "Priority support",
          "Custom reports"
        ],
        popular: true,
        cta: "Most Popular"
      },
      {
        name: "Business",
        price: "₵1,199",
        period: "/month",
        description: "For established security agencies with comprehensive Ghanaian compliance needs",
        features: [
          "Up to 199 guards",
          "Full Ghanaian compliance automation",
          "Multi-location support",
          "Advanced compliance analytics",
          "API access for integrations",
          "White-label options",
          "Dedicated account manager",
          "Custom training modules",
          "Audit-ready reports",
          "24/7 priority support"
        ],
        popular: false,
        cta: "Upgrade Now"
      },
      {
        name: "Enterprise",
        price: "₵3,599",
        period: "/month",
        description: "For large security operations with unlimited scaling across Ghana",
        features: [
          "Unlimited guards",
          "Complete Ghanaian enterprise suite",
          "Multi-region multi-location support",
          "Custom development and integrations",
          "Enterprise-grade security",
          "Priority SLA guarantee",
          "On-site training included",
          "Comprehensive audit support",
          "Dedicated success manager",
          "24/7 enterprise support"
        ],
        popular: false,
        cta: "Contact Sales"
      }
    ],
    hero: {
      title: "Complete Ghanaian Security Compliance",
      subtitle: "Starting at FREE",
      description: "Transform your security agency with our Ghanaian-compliant platform. Start free with up to 10 guards and scale as you grow.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    compliance: {
      authority: "Ministry of Interior - Ghana",
      requirements: [
        "Ministry of Interior registration and licensing",
        "Guard training certification",
        "Ghanaian ID verification",
        "Background checks",
        "Maintain duty registers",
        "Payroll compliance with Ghanaian labor law",
        "Training records management",
        "Client agreement tracking"
      ],
      documents: [
        "Ministry of Interior certificate",
        "Guard training certificates",
        "Ghanaian ID copies",
        "Police clearance certificates",
        "Character certificates",
        "Insurance certificates",
        "Business registration documents",
        "Tax clearance certificates"
      ]
    }
  }
};

export class CountryContentService {
  static getContent(country: string): CountryContent | null {
    return COUNTRY_CONTENT[country] || COUNTRY_CONTENT.US; // Default to US content
  }

  static getFeatures(country: string) {
    const content = this.getContent(country);
    return content?.features || [];
  }

  static getPricing(country: string) {
    const content = this.getContent(country);
    return content?.pricing || [];
  }

  static getHeroContent(country: string) {
    const content = this.getContent(country);
    return content?.hero || COUNTRY_CONTENT.US.hero;
  }

  static getComplianceInfo(country: string) {
    const content = this.getContent(country);
    return content?.compliance || COUNTRY_CONTENT.US.compliance;
  }

  static getCurrencySymbol(country: string): string {
    const content = this.getContent(country);
    return content?.currencySymbol || '$';
  }

  static getSupportedCountries(): string[] {
    return Object.keys(COUNTRY_CONTENT);
  }

  static getCountryName(country: string): string {
    const names: Record<string, string> = {
      IN: 'India',
      US: 'United States',
      UK: 'United Kingdom'
    };
    return names[country] || 'Unknown';
  }
}