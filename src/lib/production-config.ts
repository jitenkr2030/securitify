export interface ProductionConfig {
  app: {
    name: string;
    url: string;
    env: 'development' | 'production' | 'staging';
    version: string;
  };
  security: {
    cors: {
      origins: string[];
      credentials: boolean;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
    headers: {
      csp: string;
      permissionsPolicy: string;
    };
  };
  database: {
    pool: {
      min: number;
      max: number;
    };
    logging: boolean;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
  payment: {
    stripe: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
    };
  };
  storage: {
    provider: 'local' | 's3';
    s3?: {
      bucket: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  monitoring: {
    enabled: boolean;
    serviceName: string;
    version: string;
  };
}

export const productionConfig: ProductionConfig = {
  app: {
    name: 'Securitify',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: (process.env.NODE_ENV as 'development' | 'production' | 'staging') || 'development',
    version: '1.0.0',
  },
  security: {
    cors: {
      // Allow multiple origins for production
      origins: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || ['http://localhost:3000'],
      credentials: true,
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
    },
    headers: {
      // More permissive CSP for production
      csp: process.env.NODE_ENV === 'production' 
        ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: *; font-src 'self' data: https:; connect-src 'self' wss: https: https://api.stripe.com;"
        : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;",
      permissionsPolicy: process.env.NODE_ENV === 'production'
        ? 'camera=(), microphone=(), geolocation=()'
        : 'camera=*, microphone=*, geolocation=*',
    },
  },
  database: {
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
    },
    logging: process.env.DB_LOGGING === 'true',
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    from: process.env.EMAIL_FROM || 'noreply@securityguardpro.com',
  },
  payment: {
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },
  storage: {
    provider: (process.env.STORAGE_PROVIDER as 'local' | 's3') || 'local',
    s3: process.env.STORAGE_PROVIDER === 's3' ? {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || '',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    } : undefined,
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    serviceName: 'securityguard-pro',
    version: '1.0.0',
  },
};

export const isProduction = productionConfig.app.env === 'production';
export const isStaging = productionConfig.app.env === 'staging';
export const isDevelopment = productionConfig.app.env === 'development';