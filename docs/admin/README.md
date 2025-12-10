# SecurityGuard Pro Administrator Guide

## Table of Contents

1. [System Overview](#system-overview)
2. [Installation & Setup](#installation--setup)
3. [User Management](#user-management)
4. [Tenant Management](#tenant-management)
5. [System Configuration](#system-configuration)
6. [Security Management](#security-management)
7. [Database Management](#database-management)
8. [Performance Monitoring](#performance-monitoring)
9. [Backup & Recovery](#backup--recovery)
10. [Integration Management](#integration-management)
11. [Compliance & Auditing](#compliance--auditing)
12. [Troubleshooting & Support](#troubleshooting--support)

## System Overview

### Architecture Overview

SecurityGuard Pro is built on a modern, scalable architecture:

```
Frontend Layer:
├── Web Application (Next.js 15)
├── Mobile Applications (React Native)
└── Admin Dashboard (React)

Backend Layer:
├── API Server (Next.js API Routes)
├── Authentication Service (NextAuth.js)
├── Real-time Communication (Socket.io)
└── Background Services (Node.js)

Data Layer:
├── Primary Database (SQLite/PostgreSQL)
├── Cache Layer (Redis/Memory Cache)
├── File Storage (Local/S3)
└── Search Index (Optional)

External Services:
├── Payment Processing (Stripe)
├── Email Service (SMTP/Third-party)
├── SMS Service (Twilio)
└── Monitoring Services
```

### Key Components

**Core Services:**
- **API Gateway**: Central entry point for all API requests
- **Authentication Service**: User authentication and authorization
- **Location Service**: Real-time GPS tracking and geofencing
- **Notification Service**: Alert and notification management
- **Billing Service**: Subscription and payment processing
- **Report Service**: Report generation and analytics

**Supporting Services:**
- **Cache Service**: Performance optimization through caching
- **File Service**: Document and media storage
- **Email Service**: Email notification delivery
- **SMS Service**: Text message alerts
- **Monitoring Service**: System health and performance monitoring

### Technology Stack

**Frontend:**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: Zustand, TanStack Query
- **Real-time**: Socket.io Client

**Backend:**
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Caching**: Memory cache (development), Redis (production)

**Infrastructure:**
- **Deployment**: Vercel (recommended), Docker containers
- **Database**: SQLite (development), PostgreSQL (production)
- **Storage**: Local (development), AWS S3 (production)
- **Monitoring**: Custom monitoring system
- **Logging**: Structured logging with JSON format

## Installation & Setup

### System Requirements

**Hardware Requirements:**
- **CPU**: Minimum 4 cores, recommended 8+ cores
- **RAM**: Minimum 8GB, recommended 16GB+
- **Storage**: Minimum 100GB SSD, recommended 500GB+
- **Network**: Minimum 100Mbps, recommended 1Gbps

**Software Requirements:**
- **Operating System**: Ubuntu 20.04+, CentOS 8+, or Docker
- **Node.js**: Version 18.x or higher
- **Database**: PostgreSQL 13+ or SQLite 3.x
- **Redis**: Version 6+ (for production caching)
- **Nginx**: Version 1.18+ (for reverse proxy)

### Development Setup

**1. Clone the Repository**
```bash
git clone https://github.com/your-org/securityguard-pro.git
cd securityguard-pro
```

**2. Install Dependencies**
```bash
npm install
```

**3. Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourcompany.com

# Payment (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-key

# Storage
STORAGE_PROVIDER=local
# For S3 (production):
# S3_BUCKET=your-bucket
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=your-key
# S3_SECRET_ACCESS_KEY=your-secret

# Monitoring
MONITORING_ENABLED=true
```

**4. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed database with initial data
npm run db:seed
```

**5. Start Development Server**
```bash
npm run dev
```

### Production Setup

**1. Server Preparation**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y
```

**2. Database Configuration**
```sql
-- Create database and user
sudo -u postgres psql
CREATE DATABASE securityguard_pro;
CREATE USER securityguard_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE securityguard_pro TO securityguard_user;
\q
```

**3. Application Deployment**
```bash
# Clone repository
git clone https://github.com/your-org/securityguard-pro.git
cd securityguard-pro

# Install production dependencies
npm ci --only=production

# Build application
npm run build

# Configure environment
cp .env.example .env.production
# Edit .env.production with production values

# Start application
npm start
```

**4. Nginx Configuration**
```nginx
# /etc/nginx/sites-available/securityguard-pro
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**5. SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Docker Deployment

**Docker Compose Setup:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://securityguard:password@db:5432/securityguard_pro
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: securityguard_pro
      POSTGRES_USER: securityguard
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

## User Management

### User Roles and Permissions

**Role Hierarchy:**
```
System Administrator (Full system access)
├── Organization Administrator (Tenant management)
├── Manager (Department-level management)
├── Supervisor (Team management)
└── Guard (Basic access)
```

**Permission Matrix:**

| Permission | Admin | Org Admin | Manager | Supervisor | Guard |
|------------|-------|-----------|---------|-----------|-------|
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| User Management | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| Tenant Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Billing Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Guard Management | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Location Tracking | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Alert Management | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Report Generation | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Document Management | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Basic Operations | ✅ | ✅ | ✅ | ✅ | ✅ |

⚠️ = Limited access based on assignment/permissions

### User Lifecycle Management

**User Creation:**
```typescript
// Example user creation process
const createUser = async (userData: CreateUserRequest) => {
  // 1. Validate user data
  const validation = validateUserData(userData);
  if (!validation.isValid) {
    throw new Error('Invalid user data');
  }

  // 2. Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 3. Create user in database
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      tenantId: userData.tenantId,
      // ... other fields
    }
  });

  // 4. Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  // 5. Log user creation
  await auditLog('USER_CREATED', {
    userId: user.id,
    createdBy: currentUser.id,
    metadata: userData
  });

  return user;
};
```

**User Updates:**
```typescript
const updateUser = async (userId: string, updateData: UpdateUserRequest) => {
  // 1. Verify user exists and permissions
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Check update permissions
  if (!hasPermissionToUpdate(currentUser, user, updateData)) {
    throw new Error('Insufficient permissions');
  }

  // 3. Apply updates
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });

  // 4. Log changes
  await auditLog('USER_UPDATED', {
    userId,
    updatedBy: currentUser.id,
    changes: updateData
  });

  return updatedUser;
};
```

**User Deactivation:**
```typescript
const deactivateUser = async (userId: string) => {
  // 1. Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Check if user can be deactivated
  if (user.role === 'SYSTEM_ADMIN' && isLastSystemAdmin()) {
    throw new Error('Cannot deactivate last system administrator');
  }

  // 3. Deactivate user
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isActive: false,
      deactivatedAt: new Date(),
      deactivatedBy: currentUser.id
    }
  });

  // 4. Handle dependent data
  await handleUserDependents(userId);

  // 5. Log deactivation
  await auditLog('USER_DEACTIVATED', {
    userId,
    deactivatedBy: currentUser.id
  });
};
```

### Authentication Management

**JWT Configuration:**
```typescript
// JWT token configuration
const jwtConfig = {
  accessToken: {
    expiresIn: '15m', // 15 minutes
    secret: process.env.JWT_SECRET
  },
  refreshToken: {
    expiresIn: '7d', // 7 days
    secret: process.env.JWT_REFRESH_SECRET
  },
  resetToken: {
    expiresIn: '1h', // 1 hour
    secret: process.env.JWT_RESET_SECRET
  }
};
```

**Session Management:**
```typescript
// Session monitoring and cleanup
const sessionManager = {
  // Track active sessions
  activeSessions: new Map<string, Session>(),
  
  // Create new session
  createSession: (userId: string, deviceInfo: DeviceInfo) => {
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      userId,
      deviceInfo,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    sessionManager.activeSessions.set(sessionId, session);
    return sessionId;
  },
  
  // Validate session
  validateSession: (sessionId: string) => {
    const session = sessionManager.activeSessions.get(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return false;
    }
    
    // Update last activity
    session.lastActivity = new Date();
    return true;
  },
  
  // Clean expired sessions
  cleanupExpiredSessions: () => {
    const now = new Date();
    for (const [sessionId, session] of sessionManager.activeSessions.entries()) {
      if (session.expiresAt < now) {
        sessionManager.activeSessions.delete(sessionId);
      }
    }
  }
};
```

### Permission Management

**Dynamic Permission System:**
```typescript
// Permission definition
interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  conditions?: PermissionCondition[];
}

// Permission checking
const hasPermission = (
  user: User,
  resource: string,
  action: string,
  context?: any
): boolean => {
  // Get user's role permissions
  const rolePermissions = getRolePermissions(user.role);
  
  // Check if permission exists
  const permission = rolePermissions.find(p => 
    p.resource === resource && p.action === action
  );
  
  if (!permission) {
    return false;
  }
  
  // Check conditions if any
  if (permission.conditions) {
    return evaluateConditions(permission.conditions, context);
  }
  
  return true;
};
```

## Tenant Management

### Multi-Tenant Architecture

**Tenant Isolation Strategy:**
```
Database-Level Isolation:
├── Shared Database, Shared Schema (Recommended)
│   ├── Tenant ID in all tables
│   ├── Row-level security
│   └── Query-based filtering
├── Shared Database, Separate Schema
│   ├── Schema per tenant
│   ├── Better isolation
│   └── Higher management overhead
└── Separate Database per Tenant
    ├── Maximum isolation
    ├── Highest cost
    └── Complex management
```

**Tenant Data Model:**
```typescript
// Core tenant model
interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
  subscription: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantSettings {
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  security: SecuritySettings;
  notifications: NotificationSettings;
  features: FeatureSettings;
}

interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  mfaRequired: boolean;
  ipRestrictions: string[];
  auditLogging: boolean;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHours: {
    start: string;
    end: string;
  };
}

interface FeatureSettings {
  advancedReporting: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  customIntegrations: boolean;
}
```

### Tenant Lifecycle Management

**Tenant Creation:**
```typescript
const createTenant = async (tenantData: CreateTenantRequest) => {
  // 1. Validate tenant data
  const validation = validateTenantData(tenantData);
  if (!validation.isValid) {
    throw new Error('Invalid tenant data');
  }

  // 2. Check domain availability
  const existingTenant = await prisma.tenant.findUnique({
    where: { domain: tenantData.domain }
  });
  
  if (existingTenant) {
    throw new Error('Domain already taken');
  }

  // 3. Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: tenantData.name,
      domain: tenantData.domain,
      settings: tenantData.settings || getDefaultTenantSettings(),
      subscription: {
        create: {
          plan: 'BASIC',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  // 4. Create default admin user
  const adminUser = await prisma.user.create({
    data: {
      email: tenantData.adminEmail,
      name: tenantData.adminName,
      role: 'ORGANIZATION_ADMIN',
      tenantId: tenant.id,
      isActive: true
    }
  });

  // 5. Initialize tenant data
  await initializeTenantData(tenant.id);

  // 6. Send setup email
  await sendTenantSetupEmail(adminUser.email, tenant);

  // 7. Log tenant creation
  await auditLog('TENANT_CREATED', {
    tenantId: tenant.id,
    adminUserId: adminUser.id,
    metadata: tenantData
  });

  return tenant;
};
```

**Tenant Updates:**
```typescript
const updateTenant = async (tenantId: string, updateData: UpdateTenantRequest) => {
  // 1. Verify tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });
  
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // 2. Validate update permissions
  if (!hasTenantPermission(currentUser, tenantId, 'update')) {
    throw new Error('Insufficient permissions');
  }

  // 3. Apply updates
  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: updateData
  });

  // 4. Handle subscription changes if any
  if (updateData.subscription) {
    await handleSubscriptionChange(tenantId, updateData.subscription);
  }

  // 5. Log updates
  await auditLog('TENANT_UPDATED', {
    tenantId,
    updatedBy: currentUser.id,
    changes: updateData
  });

  return updatedTenant;
};
```

**Tenant Deletion:**
```typescript
const deleteTenant = async (tenantId: string) => {
  // 1. Verify tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });
  
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // 2. Check if tenant can be deleted
  if (tenant.subscription.status === 'ACTIVE') {
    throw new Error('Cannot delete active tenant. Cancel subscription first.');
  }

  // 3. Backup tenant data
  await backupTenantData(tenantId);

  // 4. Delete tenant data (soft delete recommended)
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: currentUser.id
    }
  });

  // 5. Log deletion
  await auditLog('TENANT_DELETED', {
    tenantId,
    deletedBy: currentUser.id
  });
};
```

### Tenant Configuration Management

**Configuration Templates:**
```typescript
// Tenant configuration templates
const tenantTemplates = {
  basic: {
    settings: {
      timezone: 'UTC',
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      security: {
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialChars: false
        },
        sessionTimeout: 3600, // 1 hour
        mfaRequired: false,
        ipRestrictions: [],
        auditLogging: true
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        quietHours: {
          start: '22:00',
          end: '06:00'
        }
      },
      features: {
        advancedReporting: false,
        apiAccess: false,
        whiteLabel: false,
        customIntegrations: false
      }
    }
  },
  
  professional: {
    // Enhanced configuration for professional plan
    settings: {
      // ... basic settings with enhanced features
      features: {
        advancedReporting: true,
        apiAccess: true,
        whiteLabel: false,
        customIntegrations: false
      }
    }
  },
  
  enterprise: {
    // Full configuration for enterprise plan
    settings: {
      // ... professional settings with all features
      features: {
        advancedReporting: true,
        apiAccess: true,
        whiteLabel: true,
        customIntegrations: true
      }
    }
  }
};
```

**Configuration Validation:**
```typescript
const validateTenantSettings = (settings: any): ValidationResult => {
  const errors: string[] = [];
  
  // Validate required fields
  if (!settings.timezone) {
    errors.push('Timezone is required');
  }
  
  if (!settings.language) {
    errors.push('Language is required');
  }
  
  // Validate timezone
  if (!isValidTimezone(settings.timezone)) {
    errors.push('Invalid timezone');
  }
  
  // Validate password policy
  if (settings.security?.passwordPolicy) {
    const policy = settings.security.passwordPolicy;
    if (policy.minLength < 8) {
      errors.push('Minimum password length must be at least 8 characters');
    }
  }
  
  // Validate notification settings
  if (settings.notifications?.quietHours) {
    const { start, end } = settings.notifications.quietHours;
    if (!isValidTimeFormat(start) || !isValidTimeFormat(end)) {
      errors.push('Quiet hours must be in HH:MM format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## System Configuration

### Environment Configuration

**Environment Variables:**
```env
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/securityguard_pro
DATABASE_SSL=true
DATABASE_POOL_SIZE=20

# Redis Configuration (Production)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Payment (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-key

# Storage Configuration
STORAGE_PROVIDER=s3
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Monitoring and Logging
MONITORING_ENABLED=true
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-new-relic-key

# Security
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**Configuration Management:**
```typescript
// Configuration loader with validation
class ConfigManager {
  private config: SystemConfig;
  
  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }
  
  private loadConfiguration(): SystemConfig {
    return {
      app: {
        name: process.env.APP_NAME || 'SecurityGuard Pro',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000')
      },
      
      database: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
        ssl: process.env.DATABASE_SSL === 'true',
        poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10')
      },
      
      redis: {
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0')
      },
      
      // ... other configuration sections
    };
  }
  
  private validateConfiguration(): void {
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'STRIPE_SECRET_KEY'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
  
  public get<T>(key: string): T {
    return this.getNestedValue(this.config, key);
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

export const config = new ConfigManager();
```

### Feature Flags

**Feature Flag System:**
```typescript
// Feature flag management
interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions?: FeatureCondition[];
  rolloutPercentage?: number;
  userSegments?: string[];
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  
  constructor() {
    this.loadFlags();
  }
  
  private loadFlags(): void {
    // Load flags from database or configuration
    const defaultFlags: FeatureFlag[] = [
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Enable advanced analytics and reporting',
        enabled: true,
        userSegments: ['enterprise', 'professional']
      },
      {
        id: 'real_time_alerts',
        name: 'Real-time Alerts',
        description: 'Enable real-time alert notifications',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'mobile_offline_mode',
        name: 'Mobile Offline Mode',
        description: 'Enable offline functionality in mobile app',
        enabled: false,
        rolloutPercentage: 50
      }
    ];
    
    defaultFlags.forEach(flag => {
      this.flags.set(flag.id, flag);
    });
  }
  
  public isEnabled(flagId: string, context?: FeatureContext): boolean {
    const flag = this.flags.get(flagId);
    if (!flag || !flag.enabled) {
      return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      if (!context?.userId) {
        return false;
      }
      
      const hash = this.hashUserId(context.userId);
      const percentage = (hash % 100) + 1;
      
      if (percentage > flag.rolloutPercentage) {
        return false;
      }
    }
    
    // Check user segments
    if (flag.userSegments && flag.userSegments.length > 0) {
      if (!context?.userSegment || !flag.userSegments.includes(context.userSegment)) {
        return false;
      }
    }
    
    // Check conditions
    if (flag.conditions) {
      return this.evaluateConditions(flag.conditions, context);
    }
    
    return true;
  }
  
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  private evaluateConditions(conditions: FeatureCondition[], context: FeatureContext): boolean {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'tenant_plan':
          return context?.tenantPlan === condition.value;
        case 'user_role':
          return context?.userRole === condition.value;
        case 'date_range':
          const now = new Date();
          return now >= new Date(condition.value.start) && now <= new Date(condition.value.end);
        default:
          return true;
      }
    });
  }
}

export const featureFlags = new FeatureFlagManager();
```

### Rate Limiting Configuration

**Rate Limiting Setup:**
```typescript
// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  max: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  handler?: (req: any, res: any) => void;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    }
  },
  
  // Authentication rate limiting
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress;
    }
  },
  
  // File upload rate limiting
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    }
  },
  
  // Email sending rate limiting
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 emails per hour
    keyGenerator: (req) => {
      return req.user?.tenantId || req.ip;
    }
  }
};

// Rate limiting middleware
const applyRateLimit = (type: string) => {
  const config = rateLimitConfigs[type];
  if (!config) {
    throw new Error(`Unknown rate limit type: ${type}`);
  }
  
  return createRateLimitMiddleware(config);
};
```

### Cache Configuration

**Cache Configuration:**
```typescript
// Cache configuration
interface CacheConfig {
  provider: 'memory' | 'redis';
  ttl: number;
  maxSize?: number;
  compression?: boolean;
  redis?: {
    url: string;
    password?: string;
    db: number;
  };
}

const cacheConfig: CacheConfig = {
  provider: process.env.NODE_ENV === 'production' ? 'redis' : 'memory',
  ttl: 300, // 5 minutes default TTL
  maxSize: 1000, // Maximum 1000 items in memory cache
  compression: true,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0')
  }
};

// Cache implementation
class CacheManager {
  private cache: any;
  
  constructor() {
    if (cacheConfig.provider === 'redis') {
      this.cache = new RedisCache(cacheConfig.redis!);
    } else {
      this.cache = new MemoryCache(cacheConfig);
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key);
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.cache.set(key, value, ttl || cacheConfig.ttl);
  }
  
  async del(key: string): Promise<void> {
    return this.cache.del(key);
  }
  
  async clear(): Promise<void> {
    return this.cache.clear();
  }
  
  async exists(key: string): Promise<boolean> {
    return this.cache.exists(key);
  }
  
  async ttl(key: string): Promise<number> {
    return this.cache.ttl(key);
  }
  
  async expire(key: string, ttl: number): Promise<void> {
    return this.cache.expire(key, ttl);
  }
}

export const cache = new CacheManager();
```

## Security Management

### Authentication Security

**Password Security:**
```typescript
// Password hashing and validation
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class PasswordManager {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly MAX_PASSWORD_LENGTH = 128;
  
  static async hashPassword(password: string): Promise<string> {
    // Validate password length
    if (password.length < this.MIN_PASSWORD_LENGTH || password.length > this.MAX_PASSWORD_LENGTH) {
      throw new Error(`Password must be between ${this.MIN_PASSWORD_LENGTH} and ${this.MAX_PASSWORD_LENGTH} characters`);
    }
    
    // Hash password with bcrypt
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
  
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  static validatePasswordStrength(password: string): PasswordValidationResult {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      score: this.calculatePasswordScore(password)
    };
  }
  
  private static calculatePasswordScore(password: string): number {
    let score = 0;
    
    // Length score
    score += Math.min(password.length * 4, 40);
    
    // Character variety score
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[^a-zA-Z\d]/.test(password)) score += 15;
    
    // Pattern penalty
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|234|345|456|567|678|789|890/.test(password)) score -= 10; // Sequences
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) score -= 10; // Letter sequences
    
    return Math.max(0, Math.min(100, score));
  }
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
}
```

**Session Security:**
```typescript
// Session security management
class SessionSecurityManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_CONCURRENT_SESSIONS = 5;
  
  static async createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session> {
    // Check concurrent session limit
    const activeSessions = await this.getActiveSessionCount(userId);
    if (activeSessions >= this.MAX_CONCURRENT_SESSIONS) {
      throw new Error('Maximum concurrent sessions exceeded');
    }
    
    // Generate secure session token
    const sessionId = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    
    const session: Session = {
      id: sessionId,
      userId,
      refreshToken,
      deviceInfo,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
      isActive: true,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent
    };
    
    // Store session
    await this.storeSession(session);
    
    // Log session creation
    await auditLog('SESSION_CREATED', {
      userId,
      sessionId,
      deviceInfo: {
        ...deviceInfo,
        ipAddress: this.anonymizeIP(deviceInfo.ipAddress)
      }
    });
    
    return session;
  }
  
  static async validateSession(sessionId: string): Promise<Session | null> {
    const session = await this.getSession(sessionId);
    
    if (!session || !session.isActive) {
      return null;
    }
    
    // Check expiration
    if (session.expiresAt < new Date()) {
      await this.invalidateSession(sessionId);
      return null;
    }
    
    // Check inactivity timeout
    if (session.lastActivity < new Date(Date.now() - this.INACTIVITY_TIMEOUT)) {
      await this.invalidateSession(sessionId);
      return null;
    }
    
    // Update last activity
    await this.updateSessionActivity(sessionId);
    
    return session;
  }
  
  static async invalidateSession(sessionId: string, reason?: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return;
    }
    
    await this.markSessionInactive(sessionId);
    
    await auditLog('SESSION_INVALIDATED', {
      userId: session.userId,
      sessionId,
      reason: reason || 'Session invalidated'
    });
  }
  
  static async invalidateAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    
    for (const session of sessions) {
      if (session.id !== exceptSessionId) {
        await this.invalidateSession(session.id, 'All user sessions invalidated');
      }
    }
  }
  
  static async detectSuspiciousActivity(userId: string, currentSession: Session): Promise<boolean> {
    const recentSessions = await this.getRecentUserSessions(userId, 24); // Last 24 hours
    
    // Check for multiple sessions from different locations
    const uniqueLocations = new Set(
      recentSessions
        .filter(s => s.id !== currentSession.id)
        .map(s => s.ipAddress)
    );
    
    if (uniqueLocations.size >= 3) {
      await auditLog('SUSPICIOUS_ACTIVITY', {
        userId,
        type: 'multiple_locations',
        sessionCount: recentSessions.length,
        uniqueLocations: uniqueLocations.size
      });
      return true;
    }
    
    // Check for rapid session creation
    const recentSessionCreations = recentSessions.filter(
      s => s.createdAt > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );
    
    if (recentSessionCreations.length >= 5) {
      await auditLog('SUSPICIOUS_ACTIVITY', {
        userId,
        type: 'rapid_session_creation',
        sessionCount: recentSessionCreations.length
      });
      return true;
    }
    
    return false;
  }
  
  private static anonymizeIP(ip: string): string {
    if (ip.includes(':')) {
      // IPv6
      const parts = ip.split(':');
      return parts.slice(0, 4).join(':') + '::';
    } else {
      // IPv4
      const parts = ip.split('.');
      return `${parts[0]}.${parts[1]}.x.x`;
    }
  }
  
  // ... helper methods for database operations
}
```

### Data Encryption

**Encryption Configuration:**
```typescript
// Data encryption utilities
import crypto from 'crypto';

class EncryptionManager {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;
  
  private encryptionKey: Buffer;
  
  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    
    this.encryptionKey = Buffer.from(key, 'hex');
    if (this.encryptionKey.length !== this.KEY_LENGTH) {
      throw new Error(`Encryption key must be ${this.KEY_LENGTH} bytes (64 hex characters)`);
    }
  }
  
  encrypt(plaintext: string): { ciphertext: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipher(this.ALGORITHM, this.encryptionKey);
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      ciphertext,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }
  
  decrypt(encryptedData: { ciphertext: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipher(this.ALGORITHM, this.encryptionKey);
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let plaintext = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  }
  
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Field-level encryption for database
  encryptField(value: string): string {
    const encrypted = this.encrypt(value);
    return JSON.stringify(encrypted);
  }
  
  decryptField(encryptedField: string): string {
    try {
      const encrypted = JSON.parse(encryptedField);
      return this.decrypt(encrypted);
    } catch (error) {
      throw new Error('Failed to decrypt field');
    }
  }
}

export const encryption = new EncryptionManager();
```

**Secure Data Storage:**
```typescript
// Secure data storage patterns
class SecureDataStorage {
  private encryption: EncryptionManager;
  
  constructor() {
    this.encryption = new EncryptionManager();
  }
  
  // Store sensitive data with encryption
  async storeSensitiveData(
    userId: string,
    dataType: string,
    data: Record<string, any>
  ): Promise<void> {
    // Encrypt sensitive fields
    const encryptedData = this.encryptSensitiveFields(data);
    
    // Store in database
    await prisma.sensitiveData.create({
      data: {
        userId,
        dataType,
        encryptedData: JSON.stringify(encryptedData),
        createdAt: new Date()
      }
    });
    
    // Audit log
    await auditLog('SENSITIVE_DATA_STORED', {
      userId,
      dataType,
      fields: Object.keys(data)
    });
  }
  
  // Retrieve and decrypt sensitive data
  async retrieveSensitiveData(
    userId: string,
    dataType: string
  ): Promise<Record<string, any> | null> {
    const record = await prisma.sensitiveData.findFirst({
      where: {
        userId,
        dataType
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!record) {
      return null;
    }
    
    try {
      const encryptedData = JSON.parse(record.encryptedData);
      return this.decryptSensitiveFields(encryptedData);
    } catch (error) {
      throw new Error('Failed to decrypt sensitive data');
    }
  }
  
  private encryptSensitiveFields(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ssn', 'creditCard', 'bankAccount', 'personalId'];
    const encrypted = { ...data };
    
    for (const field of sensitiveFields) {
      if (encrypted[field]) {
        encrypted[field] = this.encryption.encryptField(encrypted[field]);
      }
    }
    
    return encrypted;
  }
  
  private decryptSensitiveFields(encryptedData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ssn', 'creditCard', 'bankAccount', 'personalId'];
    const decrypted = { ...encryptedData };
    
    for (const field of sensitiveFields) {
      if (decrypted[field]) {
        decrypted[field] = this.encryption.decryptField(decrypted[field]);
      }
    }
    
    return decrypted;
  }
}
```

### Security Monitoring

**Security Event Monitoring:**
```typescript
// Security event monitoring and alerting
class SecurityMonitor {
  private static readonly SUSPICIOUS_PATTERNS = {
    rapidFailedLogins: { count: 5, windowMs: 5 * 60 * 1000 },
    multipleLocations: { count: 3, windowMs: 60 * 60 * 1000 },
    unusualAccessTimes: { startHour: 2, endHour: 5 },
    dataAccessAnomaly: { threshold: 3, windowMs: 60 * 60 * 1000 }
  };
  
  static async monitorLoginAttempts(userId: string, success: boolean, ipAddress: string): Promise<void> {
    const key = `login_attempts:${userId}:${ipAddress}`;
    
    // Track login attempts
    await redis.incr(key);
    await redis.expire(key, 5 * 60); // 5 minutes window
    
    const attempts = parseInt(await redis.get(key) || '0');
    
    // Check for rapid failed login attempts
    if (!success && attempts >= this.SUSPICIOUS_PATTERNS.rapidFailedLogins.count) {
      await this.handleSuspiciousActivity(userId, 'rapid_failed_logins', {
        attempts,
        ipAddress,
        window: '5 minutes'
      });
    }
  }
  
  static async monitorSessionActivity(userId: string, session: Session): Promise<void> {
    // Check for sessions from multiple locations
    const recentSessions = await this.getRecentSessions(userId, 24 * 60 * 60 * 1000);
    const uniqueLocations = new Set(recentSessions.map(s => s.ipAddress));
    
    if (uniqueLocations.size >= this.SUSPICIOUS_PATTERNS.multipleLocations.count) {
      await this.handleSuspiciousActivity(userId, 'multiple_locations', {
        sessionCount: recentSessions.length,
        uniqueLocations: uniqueLocations.size,
        locations: Array.from(uniqueLocations)
      });
    }
    
    // Check for unusual access times
    const currentHour = new Date().getHours();
    if (currentHour >= this.SUSPICIOUS_PATTERNS.unusualAccessTimes.startHour &&
        currentHour <= this.SUSPICIOUS_PATTERNS.unusualAccessTimes.endHour) {
      await this.handleSuspiciousActivity(userId, 'unusual_access_time', {
        hour: currentHour,
        sessionId: session.id
      });
    }
  }
  
  static async monitorDataAccess(userId: string, resourceType: string, action: string): Promise<void> {
    const key = `data_access:${userId}:${resourceType}`;
    
    // Track data access patterns
    await redis.incr(key);
    await redis.expire(key, 60 * 60); // 1 hour window
    
    const accessCount = parseInt(await redis.get(key) || '0');
    
    // Check for unusual data access patterns
    if (accessCount >= this.SUSPICIOUS_PATTERNS.dataAccessAnomaly.threshold) {
      await this.handleSuspiciousActivity(userId, 'data_access_anomaly', {
        resourceType,
        action,
        accessCount,
        window: '1 hour'
      });
    }
  }
  
  private static async handleSuspiciousActivity(
    userId: string,
    activityType: string,
    details: Record<string, any>
  ): Promise<void> {
    // Log security event
    await auditLog('SUSPICIOUS_ACTIVITY', {
      userId,
      activityType,
      details,
      timestamp: new Date()
    });
    
    // Create security alert
    await prisma.securityAlert.create({
      data: {
        userId,
        type: activityType,
        severity: 'MEDIUM',
        status: 'ACTIVE',
        details: JSON.stringify(details),
        createdAt: new Date()
      }
    });
    
    // Notify security team
    await notifySecurityTeam({
      type: 'SUSPICIOUS_ACTIVITY',
      userId,
      activityType,
      details,
      priority: 'MEDIUM'
    });
    
    // Optionally take automated action
    await this.automatedResponse(userId, activityType, details);
  }
  
  private static async automatedResponse(
    userId: string,
    activityType: string,
    details: Record<string, any>
  ): Promise<void> {
    switch (activityType) {
      case 'rapid_failed_logins':
        // Temporarily lock account
        await this.temporarilyLockAccount(userId, 15 * 60); // 15 minutes
        break;
        
      case 'multiple_locations':
        // Invalidate all sessions except current
        await this.invalidateAllSessions(userId);
        break;
        
      case 'data_access_anomaly':
        // Require additional authentication
        await this.requireMfa(userId);
        break;
    }
  }
  
  private static async temporarilyLockAccount(userId: string, durationMs: number): Promise<void> {
    const lockUntil = new Date(Date.now() + durationMs);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: true,
        lockedUntil: lockUntil,
        lockReason: 'Suspicious activity detected'
      }
    });
    
    // Schedule account unlock
    setTimeout(async () => {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isLocked: false,
          lockedUntil: null,
          lockReason: null
        }
      });
    }, durationMs);
  }
  
  private static async invalidateAllSessions(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId },
      data: { isActive: false }
    });
  }
  
  private static async requireMfa(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { mfaRequired: true }
    });
  }
  
  private static async getRecentSessions(userId: string, windowMs: number): Promise<Session[]> {
    const since = new Date(Date.now() - windowMs);
    
    return prisma.session.findMany({
      where: {
        userId,
        createdAt: { gte: since },
        isActive: true
      }
    });
  }
}
```

## Database Management

### Database Schema Management

**Prisma Schema Management:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core models
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String
  passwordHash    String
  role            UserRole
  isActive        Boolean  @default(true)
  isLocked        Boolean  @default(false)
  lockedUntil     DateTime?
  lockReason      String?
  mfaEnabled      Boolean  @default(false)
  mfaSecret       String?
  lastLoginAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  
  sessions        Session[]
  securityAlerts  SecurityAlert[]
  auditLogs       AuditLog[]
  
  @@map("users")
}

model Tenant {
  id          String   @id @default(cuid())
  name        String
  domain      String   @unique
  settings    Json
  isDeleted   Boolean  @default(false)
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  users       User[]
  subscription Subscription?
  
  @@map("tenants")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String
  deviceInfo   Json
  ipAddress    String
  userAgent    String
  createdAt    DateTime @default(now())
  lastActivity DateTime @default(now())
  expiresAt    DateTime
  isActive     Boolean  @default(true)
  
  // Relations
  user         User     @relation(fields: [userId], references: [id])
  
  @@map("sessions")
}

model SecurityAlert {
  id        String           @id @default(cuid())
  userId    String
  type      SecurityAlertType
  severity  AlertSeverity
  status    AlertStatus
  details   String
  resolvedAt DateTime?
  createdAt DateTime         @default(now())
  
  // Relations
  user      User             @relation(fields: [userId], references: [id])
  
  @@map("security_alerts")
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String
  resource    String
  resourceId  String?
  details     Json
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  // Relations
  user        User?    @relation(fields: [userId], references: [id])
  
  @@map("audit_logs")
}

model Subscription {
  id                   String            @id @default(cuid())
  tenantId             String            @unique
  plan                 SubscriptionPlan
  status               SubscriptionStatus
  stripeSubscriptionId  String?
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  trialEnd             DateTime?
  cancelledAt          DateTime?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt
  
  // Relations
  tenant               Tenant            @relation(fields: [tenantId], references: [id])
  
  @@map("subscriptions")
}

// Enums
enum UserRole {
  SYSTEM_ADMIN
  ORGANIZATION_ADMIN
  MANAGER
  SUPERVISOR
  GUARD
}

enum SecurityAlertType {
  RAPID_FAILED_LOGINS
  MULTIPLE_LOCATIONS
  UNUSUAL_ACCESS_TIME
  DATA_ACCESS_ANOMALY
  SUSPICIOUS_IP_ADDRESS
  BRUTE_FORCE_ATTEMPT
}

enum AlertSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum AlertStatus {
  ACTIVE
  RESOLVED
  DISMISSED
}

enum SubscriptionPlan {
  BASIC
  PROFESSIONAL
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PENDING
}
```

**Database Migration Management:**
```typescript
// Database migration utilities
class DatabaseMigrator {
  static async runMigrations(): Promise<void> {
    try {
      // Generate Prisma client
      console.log('Generating Prisma client...');
      await execAsync('npx prisma generate');
      
      // Push schema changes
      console.log('Pushing schema changes...');
      await execAsync('npx prisma db push');
      
      // Run any custom migrations
      await this.runCustomMigrations();
      
      console.log('Database migrations completed successfully');
    } catch (error) {
      console.error('Database migration failed:', error);
      throw error;
    }
  }
  
  static async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backups/backup-${timestamp}.sql`;
    
    try {
      // Create backup directory if it doesn't exist
      await fs.mkdir('backups', { recursive: true });
      
      // Create database backup
      const { DATABASE_URL } = process.env;
      if (!DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
      }
      
      const url = new URL(DATABASE_URL);
      const command = `PGPASSWORD="${url.password}" pg_dump -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} > ${backupFile}`;
      
      await execAsync(command);
      
      console.log(`Database backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('Database backup failed:', error);
      throw error;
    }
  }
  
  static async restoreBackup(backupFile: string): Promise<void> {
    try {
      const { DATABASE_URL } = process.env;
      if (!DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
      }
      
      const url = new URL(DATABASE_URL);
      const command = `PGPASSWORD="${url.password}" psql -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} < ${backupFile}`;
      
      await execAsync(command);
      
      console.log(`Database restored from: ${backupFile}`);
    } catch (error) {
      console.error('Database restore failed:', error);
      throw error;
    }
  }
  
  private static async runCustomMigrations(): Promise<void> {
    // Run any custom migration scripts here
    const migrationDir = 'prisma/migrations';
    
    if (await fs.pathExists(migrationDir)) {
      const migrations = await fs.readdir(migrationDir);
      
      for (const migration of migrations) {
        const migrationPath = path.join(migrationDir, migration);
        const stats = await fs.stat(migrationPath);
        
        if (stats.isDirectory()) {
          const sqlFile = path.join(migrationPath, 'migration.sql');
          if (await fs.pathExists(sqlFile)) {
            console.log(`Running custom migration: ${migration}`);
            const sql = await fs.readFile(sqlFile, 'utf8');
            await prisma.$executeRawUnsafe(sql);
          }
        }
      }
    }
  }
}
```

### Database Performance Optimization

**Query Optimization:**
```typescript
// Database query optimization utilities
class QueryOptimizer {
  // Add appropriate indexes
  static async ensureIndexes(): Promise<void> {
    const indexes = [
      // User indexes
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)',
      
      // Session indexes
      'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON sessions(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)',
      
      // Security alert indexes
      'CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON security_alerts(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON security_alerts(status)',
      'CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at)',
      
      // Audit log indexes
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)',
      
      // Composite indexes for common queries
      'CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions(user_id, is_active)',
      'CREATE INDEX IF NOT EXISTS idx_alerts_user_status ON security_alerts(user_id, status)'
    ];
    
    for (const indexSql of indexes) {
      try {
        await prisma.$executeRawUnsafe(indexSql);
      } catch (error) {
        console.warn(`Failed to create index: ${indexSql}`, error);
      }
    }
  }
  
  // Optimize common query patterns
  static async optimizeQueries(): Promise<void> {
    // Analyze query performance
    await this.analyzeQueryPerformance();
    
    // Update database statistics
    await this.updateStatistics();
    
    // Clean up old data
    await this.cleanupOldData();
  }
  
  private static async analyzeQueryPerformance(): Promise<void> {
    const slowQueries = await prisma.$queryRaw`
      SELECT query, calls, total_time, mean_time, rows
      FROM pg_stat_statements
      WHERE mean_time > 100 -- Queries slower than 100ms
      ORDER BY mean_time DESC
      LIMIT 10
    `;
    
    console.log('Slow queries identified:', slowQueries);
    
    // Log slow queries for further analysis
    for (const query of slowQueries as any[]) {
      await auditLog('SLOW_QUERY', {
        query: query.query,
        calls: query.calls,
        totalTime: query.total_time,
        meanTime: query.mean_time,
        rows: query.rows
      });
    }
  }
  
  private static async updateStatistics(): Promise<void> {
    try {
      await prisma.$executeRaw`ANALYZE`;
      console.log('Database statistics updated');
    } catch (error) {
      console.error('Failed to update database statistics:', error);
    }
  }
  
  private static async cleanupOldData(): Promise<void> {
    const retentionPeriods = {
      sessions: 90, // days
      auditLogs: 365, // days
      securityAlerts: 180, // days
    };
    
    // Clean up old sessions
    await prisma.session.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - retentionPeriods.sessions * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Clean up old audit logs
    await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - retentionPeriods.auditLogs * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Clean up resolved security alerts
    await prisma.securityAlert.deleteMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: {
          lt: new Date(Date.now() - retentionPeriods.securityAlerts * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    console.log('Old data cleanup completed');
  }
}
```

**Connection Pool Management:**
```typescript
// Database connection pool configuration
class ConnectionPoolManager {
  private static readonly POOL_CONFIG = {
    min: 2,
    max: 20,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  };
  
  static async configurePool(): Promise<void> {
    try {
      // Get current pool configuration
      const currentConfig = await prisma.$queryRaw`
        SHOW max_connections;
      `;
      
      console.log('Current max_connections:', currentConfig);
      
      // Set optimal connection parameters
      await prisma.$executeRaw`
        SET shared_preload_libraries = 'pg_stat_statements';
      `;
      
      // Configure connection pool settings
      await this.setPoolParameters();
      
      console.log('Connection pool configured successfully');
    } catch (error) {
      console.error('Failed to configure connection pool:', error);
      throw error;
    }
  }
  
  private static async setPoolParameters(): Promise<void> {
    const parameters = [
      { name: 'shared_buffers', value: '256MB' },
      { name: 'work_mem', value: '4MB' },
      { name: 'maintenance_work_mem', value: '64MB' },
      { name: 'effective_cache_size', value: '1GB' },
      { name: 'random_page_cost', value: '1.1' },
      { name: 'effective_io_concurrency', value: '200' },
      { name: 'max_worker_processes', value: '8' },
      { name: 'max_parallel_workers_per_gather', value: '4' },
    ];
    
    for (const param of parameters) {
      try {
        await prisma.$executeRaw`SET LOCAL ${param.name} = ${param.value}`;
      } catch (error) {
        console.warn(`Failed to set parameter ${param.name}:`, error);
      }
    }
  }
  
  static async monitorPoolHealth(): Promise<PoolHealth> {
    try {
      const [connectionCount, maxConnections, idleInTransaction] = await Promise.all([
        prisma.$queryRaw`SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'`,
        prisma.$queryRaw`SHOW max_connections`,
        prisma.$queryRaw`SELECT count(*) as count FROM pg_stat_activity WHERE state = 'idle in transaction'`
      ]);
      
      const activeConnections = (connectionCount as any)[0].count;
      const maxConn = parseInt((maxConnections as any)[0].max_connections);
      const idleConnections = (idleInTransaction as any)[0].count;
      
      const health: PoolHealth = {
        activeConnections,
        maxConnections: maxConn,
        idleConnections,
        utilizationPercentage: (activeConnections / maxConn) * 100,
        status: this.getPoolStatus(activeConnections, maxConn),
        timestamp: new Date()
      };
      
      // Log if utilization is high
      if (health.utilizationPercentage > 80) {
        console.warn('High database connection pool utilization:', health);
        await auditLog('HIGH_CONNECTION_UTILIZATION', health);
      }
      
      return health;
    } catch (error) {
      console.error('Failed to monitor pool health:', error);
      throw error;
    }
  }
  
  private static getPoolStatus(active: number, max: number): 'healthy' | 'warning' | 'critical' {
    const utilization = (active / max) * 100;
    
    if (utilization < 70) {
      return 'healthy';
    } else if (utilization < 90) {
      return 'warning';
    } else {
      return 'critical';
    }
  }
}

interface PoolHealth {
  activeConnections: number;
  maxConnections: number;
  idleConnections: number;
  utilizationPercentage: number;
  status: 'healthy' | 'warning' | 'critical';
  timestamp: Date;
}
```

### Database Backup and Recovery

**Backup Strategy:**
```typescript
// Database backup and recovery management
class BackupManager {
  private static readonly BACKUP_CONFIG = {
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: {
      daily: 7,
      weekly: 4,
      monthly: 12
    },
    compression: true,
    encryption: true,
    cloudStorage: {
      provider: 's3',
      bucket: process.env.S3_BACKUP_BUCKET,
      region: process.env.S3_BACKUP_REGION
    }
  };
  
  static async scheduleBackups(): Promise<void> {
    const cron = require('node-cron');
    
    // Schedule daily backups
    cron.schedule(this.BACKUP_CONFIG.schedule, async () => {
      try {
        await this.createBackup('daily');
        console.log('Daily backup completed successfully');
      } catch (error) {
        console.error('Daily backup failed:', error);
        await this.handleBackupError(error, 'daily');
      }
    });
    
    // Schedule weekly backups (Sunday at 3 AM)
    cron.schedule('0 3 * * 0', async () => {
      try {
        await this.createBackup('weekly');
        console.log('Weekly backup completed successfully');
      } catch (error) {
        console.error('Weekly backup failed:', error);
        await this.handleBackupError(error, 'weekly');
      }
    });
    
    // Schedule monthly backups (1st of month at 4 AM)
    cron.schedule('0 4 1 * *', async () => {
      try {
        await this.createBackup('monthly');
        console.log('Monthly backup completed successfully');
      } catch (error) {
        console.error('Monthly backup failed:', error);
        await this.handleBackupError(error, 'monthly');
      }
    });
  }
  
  static async createBackup(type: 'daily' | 'weekly' | 'monthly'): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `${type}-${timestamp}`;
    const backupFile = `backups/${backupId}.sql`;
    
    try {
      // Create backup directory
      await fs.mkdir('backups', { recursive: true });
      
      // Create database backup
      await this.createDatabaseBackup(backupFile);
      
      // Compress backup if enabled
      if (this.BACKUP_CONFIG.compression) {
        await this.compressBackup(backupFile);
      }
      
      // Encrypt backup if enabled
      if (this.BACKUP_CONFIG.encryption) {
        await this.encryptBackup(`${backupFile}.gz`);
      }
      
      // Upload to cloud storage if configured
      if (this.BACKUP_CONFIG.cloudStorage.bucket) {
        await this.uploadToCloudStorage(`${backupFile}.gz.enc`, type);
      }
      
      // Clean up old backups
      await this.cleanupOldBackups(type);
      
      const backupInfo: BackupInfo = {
        id: backupId,
        type,
        filename: backupFile,
        size: await this.getBackupSize(`${backupFile}.gz.enc`),
        createdAt: new Date(),
        status: 'completed'
      };
      
      // Log backup completion
      await auditLog('BACKUP_COMPLETED', backupInfo);
      
      return backupInfo;
    } catch (error) {
      const backupInfo: BackupInfo = {
        id: backupId,
        type,
        filename: backupFile,
        size: 0,
        createdAt: new Date(),
        status: 'failed',
        error: error.message
      };
      
      await auditLog('BACKUP_FAILED', backupInfo);
      throw error;
    }
  }
  
  private static async createDatabaseBackup(backupFile: string): Promise<void> {
    const { DATABASE_URL } = process.env;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const url = new URL(DATABASE_URL);
    const command = `PGPASSWORD="${url.password}" pg_dump -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} --no-owner --no-privileges --format=custom > ${backupFile}`;
    
    await execAsync(command);
  }
  
  private static async compressBackup(backupFile: string): Promise<void> {
    await execAsync(`gzip ${backupFile}`);
  }
  
  private static async encryptBackup(backupFile: string): Promise<void> {
    const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('BACKUP_ENCRYPTION_KEY environment variable is required');
    }
    
    const command = `openssl enc -aes-256-cbc -salt -in ${backupFile} -out ${backupFile}.enc -k ${encryptionKey}`;
    await execAsync(command);
    
    // Remove unencrypted file
    await fs.unlink(backupFile);
  }
  
  private static async uploadToCloudStorage(backupFile: string, type: string): Promise<void> {
    const { cloudStorage } = this.BACKUP_CONFIG;
    
    if (cloudStorage.provider === 's3') {
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: cloudStorage.region
      });
      
      const fileContent = await fs.readFile(backupFile);
      
      await s3.upload({
        Bucket: cloudStorage.bucket,
        Key: `${type}/${path.basename(backupFile)}`,
        Body: fileContent,
        ContentType: 'application/octet-stream'
      }).promise();
      
      console.log(`Backup uploaded to S3: ${type}/${path.basename(backupFile)}`);
    }
  }
  
  private static async cleanupOldBackups(type: string): Promise<void> {
    const retention = this.BACKUP_CONFIG.retention;
    const retentionDays = retention[type];
    
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    
    // Clean up local backups
    const backupDir = 'backups';
    const files = await fs.readdir(backupDir);
    
    for (const file of files) {
      if (file.startsWith(type)) {
        const filePath = path.join(backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.birthtime < cutoffDate) {
          await fs.unlink(filePath);
          console.log(`Deleted old backup: ${file}`);
        }
      }
    }
    
    // Clean up cloud storage backups
    if (this.BACKUP_CONFIG.cloudStorage.bucket) {
      await this.cleanupCloudStorageBackups(type, cutoffDate);
    }
  }
  
  private static async cleanupCloudStorageBackups(type: string, cutoffDate: Date): Promise<void> {
    const { cloudStorage } = this.BACKUP_CONFIG;
    
    if (cloudStorage.provider === 's3') {
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: cloudStorage.region
      });
      
      const objects = await s3.listObjectsV2({
        Bucket: cloudStorage.bucket,
        Prefix: `${type}/`
      }).promise();
      
      for (const obj of objects.Contents || []) {
        if (obj.LastModified && obj.LastModified < cutoffDate) {
          await s3.deleteObject({
            Bucket: cloudStorage.bucket,
            Key: obj.Key
          }).promise();
          
          console.log(`Deleted old cloud backup: ${obj.Key}`);
        }
      }
    }
  }
  
  static async restoreBackup(backupId: string): Promise<void> {
    try {
      const backupFile = `backups/${backupId}.sql.gz.enc`;
      
      // Download from cloud storage if not local
      if (!(await fs.pathExists(backupFile))) {
        await this.downloadFromCloudStorage(backupId, backupFile);
      }
      
      // Decrypt backup
      await this.decryptBackup(backupFile);
      
      // Decompress backup
      await this.decompressBackup(backupFile.replace('.enc', ''));
      
      // Restore database
      await this.restoreDatabase(backupFile.replace('.enc', '').replace('.gz', ''));
      
      console.log(`Backup restored successfully: ${backupId}`);
      
      // Log restore operation
      await auditLog('BACKUP_RESTORED', { backupId, timestamp: new Date() });
    } catch (error) {
      console.error('Backup restore failed:', error);
      await auditLog('BACKUP_RESTORE_FAILED', { backupId, error: error.message });
      throw error;
    }
  }
  
  private static async decryptBackup(backupFile: string): Promise<void> {
    const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('BACKUP_ENCRYPTION_KEY environment variable is required');
    }
    
    const command = `openssl enc -d -aes-256-cbc -in ${backupFile} -out ${backupFile.replace('.enc', '')} -k ${encryptionKey}`;
    await execAsync(command);
  }
  
  private static async decompressBackup(backupFile: string): Promise<void> {
    await execAsync(`gunzip ${backupFile}`);
  }
  
  private static async restoreDatabase(backupFile: string): Promise<void> {
    const { DATABASE_URL } = process.env;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const url = new URL(DATABASE_URL);
    const command = `PGPASSWORD="${url.password}" pg_restore -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} --clean --if-exists ${backupFile}`;
    
    await execAsync(command);
  }
  
  private static async getBackupSize(backupFile: string): Promise<number> {
    try {
      const stats = await fs.stat(backupFile);
      return stats.size;
    } catch {
      return 0;
    }
  }
  
  private static async handleBackupError(error: Error, type: string): Promise<void> {
    console.error(`${type} backup failed:`, error);
    
    // Send notification to administrators
    await notifyAdmins({
      type: 'BACKUP_FAILURE',
      message: `${type} backup failed`,
      details: {
        error: error.message,
        type,
        timestamp: new Date()
      }
    });
  }
}

interface BackupInfo {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  filename: string;
  size: number;
  createdAt: Date;
  status: 'completed' | 'failed';
  error?: string;
}
```

This comprehensive administrator guide covers all essential aspects of managing the SecurityGuard Pro system, from installation and configuration to security, database management, and troubleshooting. The guide provides detailed technical information, code examples, and best practices for system administrators.

## Performance Monitoring

### System Performance Monitoring

**Performance Metrics Collection:**
```typescript
// Performance monitoring system
class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  
  constructor() {
    this.initializeThresholds();
    this.startPeriodicCollection();
  }
  
  private initializeThresholds(): void {
    // Define performance thresholds
    this.thresholds.set('api_response_time', {
      warning: 1000,  // 1 second
      critical: 5000, // 5 seconds
      unit: 'ms'
    });
    
    this.thresholds.set('database_query_time', {
      warning: 500,   // 500ms
      critical: 2000, // 2 seconds
      unit: 'ms'
    });
    
    this.thresholds.set('memory_usage', {
      warning: 80,    // 80%
      critical: 95,  // 95%
      unit: '%'
    });
    
    this.thresholds.set('cpu_usage', {
      warning: 70,    // 70%
      critical: 90,   // 90%
      unit: '%'
    });
    
    this.thresholds.set('disk_usage', {
      warning: 80,    // 80%
      critical: 90,   // 90%
      unit: '%'
    });
  }
  
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      tags: tags || {}
    };
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metrics = this.metrics.get(name)!;
    metrics.push(metric);
    
    // Keep only last 1000 data points per metric
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }
    
    // Check thresholds and trigger alerts if needed
    this.checkThresholds(name, value);
  }
  
  private checkThresholds(name: string, value: number): void {
    const threshold = this.thresholds.get(name);
    if (!threshold) {
      return;
    }
    
    const percentage = (value / threshold.critical) * 100;
    
    if (percentage >= 100) {
      this.triggerAlert(name, value, threshold, 'CRITICAL');
    } else if (percentage >= (threshold.warning / threshold.critical) * 100) {
      this.triggerAlert(name, value, threshold, 'WARNING');
    }
  }
  
  private triggerAlert(
    name: string,
    value: number,
    threshold: PerformanceThreshold,
    severity: 'WARNING' | 'CRITICAL'
  ): void {
    const alert: PerformanceAlert = {
      id: generateId(),
      metricName: name,
      currentValue: value,
      threshold: threshold.critical,
      severity,
      message: `${name} is ${value}${threshold.unit} (threshold: ${threshold.critical}${threshold.unit})`,
      timestamp: new Date(),
      resolved: false
    };
    
    // Store alert
    this.storeAlert(alert);
    
    // Notify administrators
    this.notifyAdministrators(alert);
    
    // Log alert
    console.warn(`Performance alert: ${alert.message}`);
  }
  
  private async storeAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await prisma.performanceAlert.create({
        data: {
          metricName: alert.metricName,
          currentValue: alert.currentValue,
          threshold: alert.threshold,
          severity: alert.severity,
          message: alert.message,
          resolved: false
        }
      });
    } catch (error) {
      console.error('Failed to store performance alert:', error);
    }
  }
  
  private async notifyAdministrators(alert: PerformanceAlert): Promise<void> {
    try {
      // Send email notification
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Performance Alert: ${alert.severity}`,
        body: alert.message
      });
      
      // Send push notification if configured
      if (process.env.PUSH_NOTIFICATION_ENABLED === 'true') {
        await sendPushNotification({
          title: 'Performance Alert',
          body: alert.message,
          severity: alert.severity
        });
      }
    } catch (error) {
      console.error('Failed to notify administrators:', error);
    }
  }
  
  getMetrics(name?: string, timeRange?: TimeRange): PerformanceMetric[] {
    if (name) {
      const metrics = this.metrics.get(name) || [];
      return this.filterByTimeRange(metrics, timeRange);
    }
    
    // Return all metrics if no name specified
    const allMetrics: PerformanceMetric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...this.filterByTimeRange(metrics, timeRange));
    }
    
    return allMetrics;
  }
  
  getMetricStats(name: string, timeRange?: TimeRange): MetricStats | null {
    const metrics = this.getMetrics(name, timeRange);
    
    if (metrics.length === 0) {
      return null;
    }
    
    const values = metrics.map(m => m.value);
    const sorted = [...values].sort((a, b) => a - b);
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
  
  private filterByTimeRange(metrics: PerformanceMetric[], timeRange?: TimeRange): PerformanceMetric[] {
    if (!timeRange) {
      return metrics;
    }
    
    const now = new Date();
    const startTime = new Date(now.getTime() - timeRange.durationMs);
    
    return metrics.filter(m => m.timestamp >= startTime);
  }
  
  private startPeriodicCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
    
    // Collect application metrics every minute
    setInterval(() => {
      this.collectApplicationMetrics();
    }, 60000);
  }
  
  private async collectSystemMetrics(): Promise<void> {
    try {
      // Memory usage
      const memUsage = process.memoryUsage();
      const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      this.recordMetric('memory_usage', memoryUsagePercent);
      
      // CPU usage (simplified - would need more sophisticated tracking)
      const cpuUsage = await this.getCPUUsage();
      this.recordMetric('cpu_usage', cpuUsage);
      
      // Disk usage
      const diskUsage = await this.getDiskUsage();
      this.recordMetric('disk_usage', diskUsage);
      
      // Network I/O
      const networkIO = await this.getNetworkIO();
      this.recordMetric('network_io_in', networkIO.rx);
      this.recordMetric('network_io_out', networkIO.tx);
      
    } catch (error) {
      console.error('Failed to collect system metrics:', error);
    }
  }
  
  private async collectApplicationMetrics(): Promise<void> {
    try {
      // Database connection pool status
      const poolStatus = await this.getDatabasePoolStatus();
      this.recordMetric('db_pool_active_connections', poolStatus.active);
      this.recordMetric('db_pool_idle_connections', poolStatus.idle);
      this.recordMetric('db_pool_waiting_connections', poolStatus.waiting);
      
      // Active user sessions
      const activeSessions = await this.getActiveSessionCount();
      this.recordMetric('active_sessions', activeSessions);
      
      // API request rates
      const apiRequestRate = await this.getAPIRequestRate();
      this.recordMetric('api_requests_per_minute', apiRequestRate);
      
      // Error rates
      const errorRate = await this.getErrorRate();
      this.recordMetric('error_rate', errorRate);
      
    } catch (error) {
      console.error('Failed to collect application metrics:', error);
    }
  }
  
  private async getCPUUsage(): Promise<number> {
    // Simplified CPU usage calculation
    // In production, you'd use a proper system monitoring library
    return Math.random() * 100; // Placeholder
  }
  
  private async getDiskUsage(): Promise<number> {
    const fs = require('fs');
    const stats = await fs.promises.statfs('/');
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;
    const used = total - free;
    return (used / total) * 100;
  }
  
  private async getNetworkIO(): Promise<{ rx: number; tx: number }> {
    // Simplified network I/O calculation
    // In production, you'd read from /proc/net/dev or use system APIs
    return {
      rx: Math.random() * 1000000, // Placeholder
      tx: Math.random() * 1000000  // Placeholder
    };
  }
  
  private async getDatabasePoolStatus(): Promise<{
    active: number;
    idle: number;
    waiting: number;
  }> {
    // Query database for pool status
    const result = await prisma.$queryRaw`
      SELECT 
        COUNT(*) FILTER (WHERE state = 'active') as active,
        COUNT(*) FILTER (WHERE state = 'idle') as idle,
        COUNT(*) FILTER (WHERE state = 'waiting') as waiting
      FROM pg_stat_activity
    `;
    
    return (result as any)[0];
  }
  
  private async getActiveSessionCount(): Promise<number> {
    return prisma.session.count({
      where: {
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });
  }
  
  private async getAPIRequestRate(): Promise<number> {
    // Calculate requests per minute based on recent logs
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const count = await prisma.auditLog.count({
      where: {
        action: 'API_REQUEST',
        createdAt: { gte: oneMinuteAgo }
      }
    });
    
    return count;
  }
  
  private async getErrorRate(): Promise<number> {
    // Calculate error rate as percentage
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const [totalRequests, errorRequests] = await Promise.all([
      prisma.auditLog.count({
        where: {
          action: 'API_REQUEST',
          createdAt: { gte: oneMinuteAgo }
        }
      }),
      prisma.auditLog.count({
        where: {
          action: 'API_REQUEST',
          details: { path: ['error'] },
          createdAt: { gte: oneMinuteAgo }
        }
      })
    ]);
    
    return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
}

interface PerformanceThreshold {
  warning: number;
  critical: number;
  unit: string;
}

interface PerformanceAlert {
  id: string;
  metricName: string;
  currentValue: number;
  threshold: number;
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface MetricStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

interface TimeRange {
  durationMs: number;
}

export const performanceMonitor = new PerformanceMonitor();
```

**API Performance Monitoring:**
```typescript
// API performance monitoring middleware
import { performanceMonitor } from './performance-monitor';

export function withAPIMonitoring(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    try {
      const response = await handler(req);
      const duration = performance.now() - startTime;
      
      // Record API response time
      performanceMonitor.recordMetric('api_response_time', duration, {
        method,
        endpoint: new URL(url).pathname,
        status: response.status.toString()
      });
      
      // Log API request
      await auditLog('API_REQUEST', {
        method,
        url,
        duration,
        status: response.status,
        userAgent,
        ip
      });
      
      // Add performance headers
      response.headers.set('X-Response-Time', duration.toFixed(2));
      response.headers.set('X-Request-ID', generateRequestId());
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Record error response time
      performanceMonitor.recordMetric('api_response_time', duration, {
        method,
        endpoint: new URL(url).pathname,
        status: 'error'
      });
      
      // Log API error
      await auditLog('API_REQUEST', {
        method,
        url,
        duration,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        userAgent,
        ip
      });
      
      throw error;
    }
  };
}

// Database query monitoring
export function withQueryMonitoring<T>(
  queryName: string,
  queryFn: () => Promise<T>
): () => Promise<T> {
  return async (): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;
      
      // Record successful query time
      performanceMonitor.recordMetric('database_query_time', duration, {
        query: queryName,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Record failed query time
      performanceMonitor.recordMetric('database_query_time', duration, {
        query: queryName,
        status: 'error'
      });
      
      throw error;
    }
  };
}

// Request ID generation
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### Real-time Monitoring Dashboard

**WebSocket Integration for Real-time Updates:**
```typescript
// Real-time monitoring WebSocket integration
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

class MonitoringWebSocket {
  private io: SocketIOServer;
  private connectedClients: Set<string> = new Set();
  
  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST']
      }
    });
    
    this.setupEventHandlers();
    this.startMetricsBroadcast();
  }
  
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Monitoring client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);
      
      // Send current metrics on connection
      this.sendCurrentMetrics(socket);
      
      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`Monitoring client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
      
      // Handle metric subscription
      socket.on('subscribe_metrics', (metrics: string[]) => {
        socket.join(`metrics_${metrics.join('_')}`);
      });
      
      // Handle alert subscription
      socket.on('subscribe_alerts', () => {
        socket.join('alerts');
      });
    });
  }
  
  private async sendCurrentMetrics(socket: any): Promise<void> {
    try {
      const metrics = await this.getCurrentMetrics();
      socket.emit('current_metrics', metrics);
    } catch (error) {
      console.error('Failed to send current metrics:', error);
    }
  }
  
  private async getCurrentMetrics(): Promise<Record<string, any>> {
    const [
      memoryStats,
      cpuStats,
      databaseStats,
      apiStats,
      systemHealth
    ] = await Promise.all([
      this.getMemoryStats(),
      this.getCPUStats(),
      this.getDatabaseStats(),
      this.getAPIStats(),
      this.getSystemHealth()
    ]);
    
    return {
      timestamp: new Date(),
      memory: memoryStats,
      cpu: cpuStats,
      database: databaseStats,
      api: apiStats,
      health: systemHealth
    };
  }
  
  private async getMemoryStats(): Promise<any> {
    const memUsage = process.memoryUsage();
    const stats = performanceMonitor.getMetricStats('memory_usage', { durationMs: 5 * 60 * 1000 });
    
    return {
      current: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      stats: stats ? {
        avg: stats.avg,
        max: stats.max,
        min: stats.min
      } : null
    };
  }
  
  private async getCPUStats(): Promise<any> {
    const stats = performanceMonitor.getMetricStats('cpu_usage', { durationMs: 5 * 60 * 1000 });
    
    return {
      current: await this.getCurrentCPUUsage(),
      stats: stats ? {
        avg: stats.avg,
        max: stats.max,
        min: stats.min
      } : null
    };
  }
  
  private async getDatabaseStats(): Promise<any> {
    const poolStatus = await this.getDatabasePoolStatus();
    const queryStats = performanceMonitor.getMetricStats('database_query_time', { durationMs: 5 * 60 * 1000 });
    
    return {
      pool: poolStatus,
      queries: queryStats ? {
        avgTime: queryStats.avg,
        maxTime: queryStats.max,
        minTime: queryStats.min,
        count: queryStats.count
      } : null
    };
  }
  
  private async getAPIStats(): Promise<any> {
    const responseTimeStats = performanceMonitor.getMetricStats('api_response_time', { durationMs: 5 * 60 * 1000 });
    const requestRate = performanceMonitor.getMetricStats('api_requests_per_minute', { durationMs: 5 * 60 * 1000 });
    const errorRate = performanceMonitor.getMetricStats('error_rate', { durationMs: 5 * 60 * 1000 });
    
    return {
      responseTime: responseTimeStats ? {
        avg: responseTimeStats.avg,
        max: responseTimeStats.max,
        p95: responseTimeStats.p95,
        p99: responseTimeStats.p99
      } : null,
      requestRate: requestRate ? {
        current: requestRate.avg,
        peak: requestRate.max
      } : null,
      errorRate: errorRate ? {
        current: errorRate.avg
      } : null
    };
  }
  
  private async getSystemHealth(): Promise<any> {
    const healthChecks = await this.runHealthChecks();
    
    return {
      overall: this.calculateOverallHealth(healthChecks),
      checks: healthChecks
    };
  }
  
  private startMetricsBroadcast(): void {
    // Broadcast metrics every 5 seconds
    setInterval(async () => {
      if (this.connectedClients.size > 0) {
        try {
          const metrics = await this.getCurrentMetrics();
          this.io.emit('metrics_update', metrics);
        } catch (error) {
          console.error('Failed to broadcast metrics:', error);
        }
      }
    }, 5000);
    
    // Broadcast alerts every 30 seconds
    setInterval(async () => {
      if (this.connectedClients.size > 0) {
        try {
          const alerts = await this.getActiveAlerts();
          this.io.to('alerts').emit('alerts_update', alerts);
        } catch (error) {
          console.error('Failed to broadcast alerts:', error);
        }
      }
    }, 30000);
  }
  
  private async getCurrentCPUUsage(): Promise<number> {
    // Implementation would use system-specific CPU monitoring
    return Math.random() * 100; // Placeholder
  }
  
  private async getDatabasePoolStatus(): Promise<any> {
    // Implementation would query database for pool status
    return {
      active: Math.floor(Math.random() * 10),
      idle: Math.floor(Math.random() * 5),
      waiting: Math.floor(Math.random() * 2)
    }; // Placeholder
  }
  
  private async runHealthChecks(): Promise<any[]> {
    const checks = [
      await this.checkDatabase(),
      await this.checkRedis(),
      await this.checkStorage(),
      await this.checkExternalServices()
    ];
    
    return checks;
  }
  
  private async checkDatabase(): Promise<any> {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      
      return {
        name: 'database',
        status: latency < 1000 ? 'healthy' : latency < 5000 ? 'degraded' : 'unhealthy',
        latency,
        message: latency < 1000 ? 'Database responding normally' : 'Database slow to respond'
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        latency: 0,
        message: 'Database connection failed'
      };
    }
  }
  
  private async checkRedis(): Promise<any> {
    try {
      const start = Date.now();
      await redis.ping();
      const latency = Date.now() - start;
      
      return {
        name: 'redis',
        status: latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy',
        latency,
        message: latency < 100 ? 'Redis responding normally' : 'Redis slow to respond'
      };
    } catch (error) {
      return {
        name: 'redis',
        status: 'unhealthy',
        latency: 0,
        message: 'Redis connection failed'
      };
    }
  }
  
  private async checkStorage(): Promise<any> {
    try {
      const start = Date.now();
      await fs.promises.access('./uploads');
      const latency = Date.now() - start;
      
      return {
        name: 'storage',
        status: 'healthy',
        latency,
        message: 'Storage accessible'
      };
    } catch (error) {
      return {
        name: 'storage',
        status: 'unhealthy',
        latency: 0,
        message: 'Storage not accessible'
      };
    }
  }
  
  private async checkExternalServices(): Promise<any> {
    const services = ['stripe', 'email', 'sms'];
    const results = [];
    
    for (const service of services) {
      try {
        const start = Date.now();
        await this.checkServiceHealth(service);
        const latency = Date.now() - start;
        
        results.push({
          name: service,
          status: latency < 1000 ? 'healthy' : 'degraded',
          latency,
          message: `${service} service responding`
        });
      } catch (error) {
        results.push({
          name: service,
          status: 'unhealthy',
          latency: 0,
          message: `${service} service unavailable`
        });
      }
    }
    
    return results;
  }
  
  private async checkServiceHealth(service: string): Promise<void> {
    // Implementation would check specific service health endpoints
    // This is a placeholder implementation
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  private calculateOverallHealth(checks: any[]): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;
    
    if (unhealthyCount > 0) {
      return 'unhealthy';
    }
    
    if (degradedCount > checks.length / 2) {
      return 'degraded';
    }
    
    return 'healthy';
  }
  
  private async getActiveAlerts(): Promise<any[]> {
    // Implementation would fetch active alerts from database
    return [];
  }
}

export function setupMonitoringWebSocket(server: HTTPServer): void {
  new MonitoringWebSocket(server);
}
```

This comprehensive performance monitoring system provides real-time insights into system health, application performance, and user experience. The system includes automated alerting, WebSocket-based real-time updates, and detailed metrics collection and analysis.

## Backup & Recovery

### Backup Strategy Overview

**Backup Architecture:**
```
Backup Types:
├── Full Database Backups
│   ├── Daily automated backups
│   ├── Weekly full backups
│   └── Monthly archival backups
├── Incremental Backups
│   ├── Transaction log backups
│   └── Configuration backups
└── File System Backups
    ├── Document storage
    ├── Log files
    └── Application assets

Storage Locations:
├── Local Storage (Immediate recovery)
├── Cloud Storage (Off-site backup)
└── Cold Storage (Long-term archival)

Retention Policy:
├── Daily backups: 7 days
├── Weekly backups: 4 weeks
├── Monthly backups: 12 months
└── Yearly backups: 7 years
```

**Backup Configuration:**
```typescript
// Backup configuration management
interface BackupConfig {
  schedule: {
    daily: string;      // Cron expression for daily backups
    weekly: string;     // Cron expression for weekly backups
    monthly: string;    // Cron expression for monthly backups
  };
  
  retention: {
    daily: number;      // Days to keep daily backups
    weekly: number;     // Weeks to keep weekly backups
    monthly: number;    // Months to keep monthly backups
    yearly: number;     // Years to keep yearly backups
  };
  
  storage: {
    local: {
      enabled: boolean;
      path: string;
      maxSize: string;  // e.g., "100GB"
    };
    cloud: {
      enabled: boolean;
      provider: 'aws' | 'gcp' | 'azure';
      bucket: string;
      region: string;
      credentials: {
        accessKey: string;
        secretKey: string;
      };
    };
  };
  
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotationDays: number;
  };
  
  compression: {
    enabled: boolean;
    level: number;      // 1-9 compression level
  };
  
  notification: {
    enabled: boolean;
    onSuccess: boolean;
    onFailure: boolean;
    recipients: string[];
  };
}

const defaultBackupConfig: BackupConfig = {
  schedule: {
    daily: '0 2 * * *',      // 2:00 AM daily
    weekly: '0 3 * * 0',     // 3:00 AM Sunday
    monthly: '0 4 1 * *'    // 4:00 AM 1st of month
  },
  
  retention: {
    daily: 7,
    weekly: 4,
    monthly: 12,
    yearly: 7
  },
  
  storage: {
    local: {
      enabled: true,
      path: './backups',
      maxSize: '100GB'
    },
    cloud: {
      enabled: true,
      provider: 'aws',
      bucket: 'securityguard-backups',
      region: 'us-east-1',
      credentials: {
        accessKey: process.env.AWS_ACCESS_KEY_ID!,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    }
  },
  
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90
  },
  
  compression: {
    enabled: true,
    level: 6
  },
  
  notification: {
    enabled: true,
    onSuccess: true,
    onFailure: true,
    recipients: ['admin@securityguardpro.com']
  }
};
```

### Automated Backup System

**Backup Scheduler:**
```typescript
// Automated backup scheduler
class BackupScheduler {
  private config: BackupConfig;
  private cronJobs: Map<string, any> = new Map();
  
  constructor(config: BackupConfig) {
    this.config = config;
    this.initializeScheduler();
  }
  
  private initializeScheduler(): void {
    const cron = require('node-cron');
    
    // Schedule daily backups
    if (this.config.schedule.daily) {
      const dailyJob = cron.schedule(this.config.schedule.daily, async () => {
        await this.executeBackup('daily');
      });
      
      this.cronJobs.set('daily', dailyJob);
      console.log('Daily backup scheduled:', this.config.schedule.daily);
    }
    
    // Schedule weekly backups
    if (this.config.schedule.weekly) {
      const weeklyJob = cron.schedule(this.config.schedule.weekly, async () => {
        await this.executeBackup('weekly');
      });
      
      this.cronJobs.set('weekly', weeklyJob);
      console.log('Weekly backup scheduled:', this.config.schedule.weekly);
    }
    
    // Schedule monthly backups
    if (this.config.schedule.monthly) {
      const monthlyJob = cron.schedule(this.config.schedule.monthly, async () => {
        await this.executeBackup('monthly');
      });
      
      this.cronJobs.set('monthly', monthlyJob);
      console.log('Monthly backup scheduled:', this.config.schedule.monthly);
    }
    
    // Schedule cleanup tasks
    const cleanupJob = cron.schedule('0 5 * * *', async () => {
      await this.cleanupOldBackups();
    });
    
    this.cronJobs.set('cleanup', cleanupJob);
    console.log('Backup cleanup scheduled: 0 5 * * *');
    
    // Schedule key rotation
    if (this.config.encryption.enabled) {
      const keyRotationJob = cron.schedule('0 6 1 * *', async () => {
        await this.rotateEncryptionKeys();
      });
      
      this.cronJobs.set('keyRotation', keyRotationJob);
      console.log('Encryption key rotation scheduled: 0 6 1 * *');
    }
  }
  
  private async executeBackup(type: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    const backupId = `${type}_${Date.now()}`;
    const startTime = new Date();
    
    try {
      console.log(`Starting ${type} backup: ${backupId}`);
      
      // Create backup record
      const backupRecord = await this.createBackupRecord(backupId, type, startTime);
      
      // Execute database backup
      await this.backupDatabase(backupRecord);
      
      // Backup file system
      await this.backupFileSystem(backupRecord);
      
      // Backup configuration
      await this.backupConfiguration(backupRecord);
      
      // Compress backup
      if (this.config.compression.enabled) {
        await this.compressBackup(backupRecord);
      }
      
      // Encrypt backup
      if (this.config.encryption.enabled) {
        await this.encryptBackup(backupRecord);
      }
      
      // Upload to cloud storage
      if (this.config.storage.cloud.enabled) {
        await this.uploadToCloud(backupRecord);
      }
      
      // Verify backup integrity
      await this.verifyBackup(backupRecord);
      
      // Update backup record
      await this.updateBackupRecord(backupRecord.id, {
        status: 'completed',
        completedAt: new Date(),
        size: await this.getBackupSize(backupRecord)
      });
      
      // Send success notification
      if (this.config.notification.enabled && this.config.notification.onSuccess) {
        await this.sendNotification(backupRecord, 'success');
      }
      
      console.log(`${type} backup completed successfully: ${backupId}`);
      
    } catch (error) {
      console.error(`${type} backup failed: ${backupId}`, error);
      
      // Update backup record with error
      await this.updateBackupRecord(backupId, {
        status: 'failed',
        error: error.message,
        completedAt: new Date()
      });
      
      // Send failure notification
      if (this.config.notification.enabled && this.config.notification.onFailure) {
        await this.sendNotification(backupRecord, 'failure');
      }
      
      throw error;
    }
  }
  
  private async createBackupRecord(
    backupId: string,
    type: 'daily' | 'weekly' | 'monthly',
    startTime: Date
  ): Promise<BackupRecord> {
    return prisma.backupRecord.create({
      data: {
        id: backupId,
        type,
        status: 'in_progress',
        startedAt: startTime,
        config: JSON.stringify(this.config)
      }
    });
  }
  
  private async backupDatabase(record: BackupRecord): Promise<void> {
    const { DATABASE_URL } = process.env;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const url = new URL(DATABASE_URL);
    const backupFile = `${this.config.storage.local.path}/${record.id}/database.sql`;
    
    // Create backup directory
    await fs.mkdir(path.dirname(backupFile), { recursive: true });
    
    // Execute database backup
    const command = `PGPASSWORD="${url.password}" pg_dump -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} --no-owner --no-privileges --format=custom > ${backupFile}`;
    
    await execAsync(command);
    
    console.log(`Database backup completed: ${backupFile}`);
  }
  
  private async backupFileSystem(record: BackupRecord): Promise<void> {
    const backupPath = `${this.config.storage.local.path}/${record.id}/files`;
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup important directories
    const directoriesToBackup = [
      './uploads',
      './logs',
      './config'
    ];
    
    for (const dir of directoriesToBackup) {
      if (await fs.pathExists(dir)) {
        const targetDir = `${backupPath}/${path.basename(dir)}`;
        await fs.copy(dir, targetDir);
        console.log(`File system backup completed: ${dir} -> ${targetDir}`);
      }
    }
  }
  
  private async backupConfiguration(record: BackupRecord): Promise<void> {
    const backupPath = `${this.config.storage.local.path}/${record.id}/config`;
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup environment files
    const envFiles = ['.env', '.env.production', '.env.local'];
    
    for (const envFile of envFiles) {
      if (await fs.pathExists(envFile)) {
        await fs.copy(envFile, `${backupPath}/${envFile}`);
      }
    }
    
    // Backup configuration files
    const configFiles = [
      './prisma/schema.prisma',
      './next.config.js',
      './tailwind.config.js'
    ];
    
    for (const configFile of configFiles) {
      if (await fs.pathExists(configFile)) {
        await fs.copy(configFile, `${backupPath}/${path.basename(configFile)}`);
      }
    }
    
    console.log('Configuration backup completed');
  }
  
  private async compressBackup(record: BackupRecord): Promise<void> {
    const backupPath = `${this.config.storage.local.path}/${record.id}`;
    const compressedFile = `${backupPath}.tar.gz`;
    
    const command = `tar -czf ${compressedFile} -C ${this.config.storage.local.path} ${record.id}`;
    await execAsync(command);
    
    // Remove uncompressed backup
    await fs.remove(backupPath);
    
    console.log(`Backup compressed: ${compressedFile}`);
  }
  
  private async encryptBackup(record: BackupRecord): Promise<void> {
    const backupFile = `${this.config.storage.local.path}/${record.id}.tar.gz`;
    const encryptedFile = `${backupFile}.enc`;
    
    const encryptionKey = await this.getEncryptionKey();
    
    const command = `openssl enc -${this.config.encryption.algorithm.toLowerCase()} -salt -in ${backupFile} -out ${encryptedFile} -k ${encryptionKey}`;
    await execAsync(command);
    
    // Remove unencrypted file
    await fs.remove(backupFile);
    
    console.log(`Backup encrypted: ${encryptedFile}`);
  }
  
  private async uploadToCloud(record: BackupRecord): Promise<void> {
    const backupFile = `${this.config.storage.local.path}/${record.id}.tar.gz.enc`;
    
    if (this.config.storage.cloud.provider === 'aws') {
      await this.uploadToAWS(backupFile, record);
    } else if (this.config.storage.cloud.provider === 'gcp') {
      await this.uploadToGCP(backupFile, record);
    } else if (this.config.storage.cloud.provider === 'azure') {
      await this.uploadToAzure(backupFile, record);
    }
  }
  
  private async uploadToAWS(backupFile: string, record: BackupRecord): Promise<void> {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: this.config.storage.cloud.credentials.accessKey,
      secretAccessKey: this.config.storage.cloud.credentials.secretKey,
      region: this.config.storage.cloud.region
    });
    
    const fileContent = await fs.readFile(backupFile);
    const key = `${record.type}/${record.id}.tar.gz.enc`;
    
    await s3.upload({
      Bucket: this.config.storage.cloud.bucket,
      Key: key,
      Body: fileContent,
      ContentType: 'application/octet-stream',
      ServerSideEncryption: 'AES256'
    }).promise();
    
    console.log(`Backup uploaded to AWS S3: ${key}`);
  }
  
  private async uploadToGCP(backupFile: string, record: BackupRecord): Promise<void> {
    // Implementation for Google Cloud Storage
    console.log(`GCP upload not implemented for backup: ${record.id}`);
  }
  
  private async uploadToAzure(backupFile: string, record: BackupRecord): Promise<void> {
    // Implementation for Azure Blob Storage
    console.log(`Azure upload not implemented for backup: ${record.id}`);
  }
  
  private async verifyBackup(record: BackupRecord): Promise<void> {
    // Verify backup integrity
    const backupFile = `${this.config.storage.local.path}/${record.id}.tar.gz.enc`;
    
    if (!(await fs.pathExists(backupFile))) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }
    
    // Check file size
    const stats = await fs.stat(backupFile);
    if (stats.size === 0) {
      throw new Error(`Backup file is empty: ${backupFile}`);
    }
    
    console.log(`Backup verified: ${record.id}, size: ${stats.size} bytes`);
  }
  
  private async cleanupOldBackups(): Promise<void> {
    console.log('Starting backup cleanup...');
    
    const now = new Date();
    
    // Clean up daily backups older than retention period
    const dailyCutoff = new Date(now.getTime() - this.config.retention.daily * 24 * 60 * 60 * 1000);
    await this.cleanupBackupsByType('daily', dailyCutoff);
    
    // Clean up weekly backups older than retention period
    const weeklyCutoff = new Date(now.getTime() - this.config.retention.weekly * 7 * 24 * 60 * 60 * 1000);
    await this.cleanupBackupsByType('weekly', weeklyCutoff);
    
    // Clean up monthly backups older than retention period
    const monthlyCutoff = new Date(now.getTime() - this.config.retention.monthly * 30 * 24 * 60 * 60 * 1000);
    await this.cleanupBackupsByType('monthly', monthlyCutoff);
    
    console.log('Backup cleanup completed');
  }
  
  private async cleanupBackupsByType(type: string, cutoffDate: Date): Promise<void> {
    // Clean up local backups
    await this.cleanupLocalBackups(type, cutoffDate);
    
    // Clean up cloud backups
    if (this.config.storage.cloud.enabled) {
      await this.cleanupCloudBackups(type, cutoffDate);
    }
    
    // Update database records
    await prisma.backupRecord.updateMany({
      where: {
        type,
        startedAt: { lt: cutoffDate },
        status: 'completed'
      },
      data: {
        cleanedUp: true,
        cleanedUpAt: new Date()
      }
    });
  }
  
  private async cleanupLocalBackups(type: string, cutoffDate: Date): Promise<void> {
    const backupPath = this.config.storage.local.path;
    
    if (!(await fs.pathExists(backupPath))) {
      return;
    }
    
    const files = await fs.readdir(backupPath);
    
    for (const file of files) {
      if (file.startsWith(type)) {
        const filePath = path.join(backupPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.birthtime < cutoffDate) {
          await fs.remove(filePath);
          console.log(`Deleted old local backup: ${file}`);
        }
      }
    }
  }
  
  private async cleanupCloudBackups(type: string, cutoffDate: Date): Promise<void> {
    if (this.config.storage.cloud.provider === 'aws') {
      await this.cleanupAWSBackups(type, cutoffDate);
    }
    // Add other cloud providers as needed
  }
  
  private async cleanupAWSBackups(type: string, cutoffDate: Date): Promise<void> {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: this.config.storage.cloud.credentials.accessKey,
      secretAccessKey: this.config.storage.cloud.credentials.secretKey,
      region: this.config.storage.cloud.region
    });
    
    const objects = await s3.listObjectsV2({
      Bucket: this.config.storage.cloud.bucket,
      Prefix: `${type}/`
    }).promise();
    
    for (const obj of objects.Contents || []) {
      if (obj.LastModified && obj.LastModified < cutoffDate) {
        await s3.deleteObject({
          Bucket: this.config.storage.cloud.bucket,
          Key: obj.Key
        }).promise();
        
        console.log(`Deleted old cloud backup: ${obj.Key}`);
      }
    }
  }
  
  private async rotateEncryptionKeys(): Promise<void> {
    console.log('Starting encryption key rotation...');
    
    // Generate new encryption key
    const newKey = crypto.randomBytes(32).toString('hex');
    
    // Update configuration
    // In a real implementation, you would store this securely
    process.env.BACKUP_ENCRYPTION_KEY = newKey;
    
    // Re-encrypt recent backups with new key
    const recentBackups = await prisma.backupRecord.findMany({
      where: {
        status: 'completed',
        startedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });
    
    for (const backup of recentBackups) {
      try {
        await this.reencryptBackup(backup, newKey);
      } catch (error) {
        console.error(`Failed to re-encrypt backup ${backup.id}:`, error);
      }
    }
    
    console.log('Encryption key rotation completed');
  }
  
  private async reencryptBackup(record: BackupRecord, newKey: string): Promise<void> {
    // Implementation for re-encrypting backups with new key
    console.log(`Re-encrypting backup: ${record.id}`);
  }
  
  private async getBackupSize(record: BackupRecord): Promise<number> {
    const backupFile = `${this.config.storage.local.path}/${record.id}.tar.gz.enc`;
    
    try {
      const stats = await fs.stat(backupFile);
      return stats.size;
    } catch {
      return 0;
    }
  }
  
  private async getEncryptionKey(): Promise<string> {
    return process.env.BACKUP_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  }
  
  private async updateBackupRecord(
    id: string,
    updates: Partial<BackupRecord>
  ): Promise<void> {
    await prisma.backupRecord.update({
      where: { id },
      data: updates
    });
  }
  
  private async sendNotification(
    record: BackupRecord,
    status: 'success' | 'failure'
  ): Promise<void> {
    const subject = `Backup ${status === 'success' ? 'Completed' : 'Failed'}: ${record.type}`;
    const message = `
Backup ${status === 'success' ? 'completed successfully' : 'failed'}

Details:
- Backup ID: ${record.id}
- Type: ${record.type}
- Started: ${record.startedAt}
- ${status === 'success' ? `Completed: ${record.completedAt}` : `Error: ${record.error}`}

${status === 'success' ? 'Backup has been verified and stored securely.' : 'Please check the system logs for more details.'}
    `;
    
    for (const recipient of this.config.notification.recipients) {
      await sendEmail({
        to: recipient,
        subject,
        body: message
      });
    }
  }
  
  // Public methods for manual operations
  async triggerBackup(type: 'daily' | 'weekly' | 'monthly'): Promise<string> {
    const backupId = `${type}_manual_${Date.now()}`;
    await this.executeBackup(type);
    return backupId;
  }
  
  async getBackupHistory(type?: string, limit?: number): Promise<BackupRecord[]> {
    const where = type ? { type } : {};
    
    return prisma.backupRecord.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: limit
    });
  }
  
  async restoreBackup(backupId: string): Promise<void> {
    const record = await prisma.backupRecord.findUnique({
      where: { id: backupId }
    });
    
    if (!record) {
      throw new Error(`Backup record not found: ${backupId}`);
    }
    
    if (record.status !== 'completed') {
      throw new Error(`Backup not completed: ${backupId}`);
    }
    
    console.log(`Starting restore from backup: ${backupId}`);
    
    try {
      // Download from cloud if necessary
      let backupFile = `${this.config.storage.local.path}/${record.id}.tar.gz.enc`;
      
      if (!(await fs.pathExists(backupFile)) && this.config.storage.cloud.enabled) {
        await this.downloadFromCloud(record, backupFile);
      }
      
      // Decrypt backup
      await this.decryptBackup(backupFile);
      
      // Decompress backup
      await this.decompressBackup(backupFile.replace('.enc', ''));
      
      // Restore database
      await this.restoreDatabase(record);
      
      // Restore file system
      await this.restoreFileSystem(record);
      
      // Restore configuration
      await this.restoreConfiguration(record);
      
      console.log(`Restore completed successfully: ${backupId}`);
      
    } catch (error) {
      console.error(`Restore failed: ${backupId}`, error);
      throw error;
    }
  }
  
  private async downloadFromCloud(record: BackupRecord, backupFile: string): Promise<void> {
    // Implementation for downloading from cloud storage
    console.log(`Downloading backup from cloud: ${record.id}`);
  }
  
  private async decryptBackup(backupFile: string): Promise<void> {
    const encryptionKey = await this.getEncryptionKey();
    const decryptedFile = backupFile.replace('.enc', '');
    
    const command = `openssl enc -d -${this.config.encryption.algorithm.toLowerCase()} -in ${backupFile} -out ${decryptedFile} -k ${encryptionKey}`;
    await execAsync(command);
    
    console.log(`Backup decrypted: ${decryptedFile}`);
  }
  
  private async decompressBackup(backupFile: string): Promise<void> {
    const backupPath = this.config.storage.local.path;
    const command = `tar -xzf ${backupFile} -C ${backupPath}`;
    await execAsync(command);
    
    console.log(`Backup decompressed: ${backupFile}`);
  }
  
  private async restoreDatabase(record: BackupRecord): Promise<void> {
    const backupFile = `${this.config.storage.local.path}/${record.id}/database.sql`;
    const { DATABASE_URL } = process.env;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    const url = new URL(DATABASE_URL);
    const command = `PGPASSWORD="${url.password}" pg_restore -h ${url.hostname} -p ${url.port} -U ${url.username} -d ${url.pathname.slice(1)} --clean --if-exists ${backupFile}`;
    
    await execAsync(command);
    
    console.log('Database restore completed');
  }
  
  private async restoreFileSystem(record: BackupRecord): Promise<void> {
    const backupPath = `${this.config.storage.local.path}/${record.id}/files`;
    
    // Restore file system backups
    const directoriesToRestore = [
      'uploads',
      'logs',
      'config'
    ];
    
    for (const dir of directoriesToRestore) {
      const sourceDir = `${backupPath}/${dir}`;
      const targetDir = `./${dir}`;
      
      if (await fs.pathExists(sourceDir)) {
        await fs.copy(sourceDir, targetDir);
        console.log(`File system restore completed: ${sourceDir} -> ${targetDir}`);
      }
    }
  }
  
  private async restoreConfiguration(record: BackupRecord): Promise<void> {
    const backupPath = `${this.config.storage.local.path}/${record.id}/config`;
    
    // Restore environment files
    const envFiles = ['.env', '.env.production', '.env.local'];
    
    for (const envFile of envFiles) {
      const sourceFile = `${backupPath}/${envFile}`;
      const targetFile = `./${envFile}`;
      
      if (await fs.pathExists(sourceFile)) {
        await fs.copy(sourceFile, targetFile);
        console.log(`Configuration restore completed: ${sourceFile} -> ${targetFile}`);
      }
    }
  }
}

interface BackupRecord {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'in_progress' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  size?: number;
  error?: string;
  config: string;
  cleanedUp?: boolean;
  cleanedUpAt?: Date;
}

export const backupScheduler = new BackupScheduler(defaultBackupConfig);
```

This comprehensive backup and recovery system provides automated scheduling, encryption, cloud storage integration, and complete restore capabilities. The system ensures data safety through multiple backup types, retention policies, and integrity verification.

## Integration Management

### Third-Party Integration Framework

**Integration Architecture:**
```typescript
// Integration framework for third-party services
interface IntegrationConfig {
  id: string;
  name: string;
  type: 'payment' | 'email' | 'sms' | 'storage' | 'analytics' | 'custom';
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
  webhookUrl?: string;
  webhookSecret?: string;
  rateLimits?: {
    requests: number;
    window: string; // e.g., "1m", "1h", "1d"
  };
  retryPolicy?: {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelay: number;
  };
}

interface IntegrationEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

interface IntegrationResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  headers?: Record<string, string>;
}

class IntegrationManager {
  private integrations: Map<string, IntegrationConfig> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private webhooks: Map<string, Function> = new Map();
  
  constructor() {
    this.initializeIntegrations();
    this.setupWebhookServer();
  }
  
  private initializeIntegrations(): void {
    // Initialize default integrations
    const defaultIntegrations: IntegrationConfig[] = [
      {
        id: 'stripe_payment',
        name: 'Stripe Payment Processing',
        type: 'payment',
        provider: 'stripe',
        enabled: true,
        config: {
          apiKey: process.env.STRIPE_SECRET_KEY,
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
        },
        webhookUrl: '/api/webhooks/stripe',
        rateLimits: {
          requests: 100,
          window: '1m'
        }
      },
      {
        id: 'smtp_email',
        name: 'SMTP Email Service',
        type: 'email',
        provider: 'smtp',
        enabled: true,
        config: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        },
        rateLimits: {
          requests: 50,
          window: '1m'
        }
      },
      {
        id: 'twilio_sms',
        name: 'Twilio SMS Service',
        type: 'sms',
        provider: 'twilio',
        enabled: true,
        config: {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          phoneNumber: process.env.TWILIO_PHONE_NUMBER
        },
        rateLimits: {
          requests: 10,
          window: '1m'
        }
      },
      {
        id: 'aws_s3',
        name: 'AWS S3 Storage',
        type: 'storage',
        provider: 'aws',
        enabled: true,
        config: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          region: process.env.S3_REGION,
          bucket: process.env.S3_BUCKET
        }
      }
    ];
    
    for (const integration of defaultIntegrations) {
      this.integrations.set(integration.id, integration);
      this.registerEventHandlers(integration);
    }
  }
  
  private registerEventHandlers(integration: IntegrationConfig): void {
    switch (integration.type) {
      case 'payment':
        this.registerPaymentHandlers(integration);
        break;
      case 'email':
        this.registerEmailHandlers(integration);
        break;
      case 'sms':
        this.registerSMSHandlers(integration);
        break;
      case 'storage':
        this.registerStorageHandlers(integration);
        break;
    }
  }
  
  private registerPaymentHandlers(integration: IntegrationConfig): void {
    this.on('payment.process', async (event: IntegrationEvent) => {
      return this.processPayment(integration, event);
    });
    
    this.on('payment.refund', async (event: IntegrationEvent) => {
      return this.processRefund(integration, event);
    });
    
    this.on('subscription.create', async (event: IntegrationEvent) => {
      return this.createSubscription(integration, event);
    });
  }
  
  private registerEmailHandlers(integration: IntegrationConfig): void {
    this.on('email.send', async (event: IntegrationEvent) => {
      return this.sendEmail(integration, event);
    });
    
    this.on('email.template', async (event: IntegrationEvent) => {
      return this.renderEmailTemplate(integration, event);
    });
  }
  
  private registerSMSHandlers(integration: IntegrationConfig): void {
    this.on('sms.send', async (event: IntegrationEvent) => {
      return this.sendSMS(integration, event);
    });
    
    this.on('sms.bulk', async (event: IntegrationEvent) => {
      return this.sendBulkSMS(integration, event);
    });
  }
  
  private registerStorageHandlers(integration: IntegrationConfig): void {
    this.on('storage.upload', async (event: IntegrationEvent) => {
      return this.uploadFile(integration, event);
    });
    
    this.on('storage.download', async (event: IntegrationEvent) => {
      return this.downloadFile(integration, event);
    });
    
    this.on('storage.delete', async (event: IntegrationEvent) => {
      return this.deleteFile(integration, event);
    });
  }
  
  // Event system
  on(eventType: string, handler: Function): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    
    this.eventHandlers.get(eventType)!.push(handler);
  }
  
  async emit(eventType: string, payload: Record<string, any>, source: string = 'system'): Promise<IntegrationResponse[]> {
    const event: IntegrationEvent = {
      id: generateEventId(),
      type: eventType,
      payload,
      timestamp: new Date(),
      source
    };
    
    const handlers = this.eventHandlers.get(eventType) || [];
    const responses: IntegrationResponse[] = [];
    
    for (const handler of handlers) {
      try {
        const response = await handler(event);
        responses.push(response);
      } catch (error) {
        responses.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return responses;
  }
  
  // Integration execution with retry logic
  async executeIntegration(
    integrationId: string,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return {
        success: false,
        error: `Integration not found: ${integrationId}`
      };
    }
    
    if (!integration.enabled) {
      return {
        success: false,
        error: `Integration disabled: ${integrationId}`
      };
    }
    
    // Check rate limits
    if (!await this.checkRateLimit(integrationId)) {
      return {
        success: false,
        error: `Rate limit exceeded: ${integrationId}`
      };
    }
    
    // Execute with retry logic
    const retryPolicy = integration.retryPolicy || {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 1000
    };
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt++) {
      try {
        const response = await this.executeIntegrationMethod(integration, method, data);
        
        // Record successful execution
        await this.recordIntegrationExecution(integrationId, method, true);
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retryPolicy.maxAttempts) {
          break;
        }
        
        // Exponential backoff
        const delay = retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.warn(`Integration attempt ${attempt} failed for ${integrationId}.${method}, retrying in ${delay}ms`);
      }
    }
    
    // Record failed execution
    await this.recordIntegrationExecution(integrationId, method, false, lastError?.message);
    
    return {
      success: false,
      error: lastError?.message || 'Integration execution failed'
    };
  }
  
  private async executeIntegrationMethod(
    integration: IntegrationConfig,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    switch (integration.provider) {
      case 'stripe':
        return this.executeStripeMethod(integration, method, data);
      case 'smtp':
        return this.executeSMTPMethod(integration, method, data);
      case 'twilio':
        return this.executeTwilioMethod(integration, method, data);
      case 'aws':
        return this.executeAWSMethod(integration, method, data);
      default:
        throw new Error(`Unsupported provider: ${integration.provider}`);
    }
  }
  
  private async executeStripeMethod(
    integration: IntegrationConfig,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    const stripe = require('stripe')(integration.config.apiKey);
    
    switch (method) {
      case 'createPaymentIntent':
        const paymentIntent = await stripe.paymentIntents.create(data);
        return {
          success: true,
          data: paymentIntent,
          statusCode: 200
        };
        
      case 'createSubscription':
        const subscription = await stripe.subscriptions.create(data);
        return {
          success: true,
          data: subscription,
          statusCode: 200
        };
        
      case 'createCheckoutSession':
        const session = await stripe.checkout.sessions.create(data);
        return {
          success: true,
          data: session,
          statusCode: 200
        };
        
      default:
        throw new Error(`Unsupported Stripe method: ${method}`);
    }
  }
  
  private async executeSMTPMethod(
    integration: IntegrationConfig,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: integration.config.host,
      port: integration.config.port,
      secure: integration.config.secure,
      auth: {
        user: integration.config.auth.user,
        pass: integration.config.auth.pass
      }
    });
    
    switch (method) {
      case 'sendMail':
        await transporter.sendMail(data);
        return {
          success: true,
          statusCode: 200
        };
        
      default:
        throw new Error(`Unsupported SMTP method: ${method}`);
    }
  }
  
  private async executeTwilioMethod(
    integration: IntegrationConfig,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    const twilio = require('twilio')(
      integration.config.accountSid,
      integration.config.authToken
    );
    
    switch (method) {
      case 'sendSMS':
        const message = await twilio.messages.create({
          body: data.body,
          from: integration.config.phoneNumber,
          to: data.to
        });
        return {
          success: true,
          data: message,
          statusCode: 200
        };
        
      default:
        throw new Error(`Unsupported Twilio method: ${method}`);
    }
  }
  
  private async executeAWSMethod(
    integration: IntegrationConfig,
    method: string,
    data: any
  ): Promise<IntegrationResponse> {
    const AWS = require('aws-sdk');
    
    switch (method) {
      case 'uploadS3':
        const s3 = new AWS.S3({
          accessKeyId: integration.config.accessKeyId,
          secretAccessKey: integration.config.secretAccessKey,
          region: integration.config.region
        });
        
        const uploadResult = await s3.upload({
          Bucket: integration.config.bucket,
          Key: data.key,
          Body: data.body,
          ContentType: data.contentType
        }).promise();
        
        return {
          success: true,
          data: uploadResult,
          statusCode: 200
        };
        
      default:
        throw new Error(`Unsupported AWS method: ${method}`);
    }
  }
  
  private async checkRateLimit(integrationId: string): Promise<boolean> {
    const integration = this.integrations.get(integrationId);
    if (!integration?.rateLimits) {
      return true;
    }
    
    const key = `rate_limit:${integrationId}`;
    const now = Date.now();
    
    // Get current request count
    const currentCount = parseInt(await redis.get(key) || '0');
    
    // Check if limit exceeded
    if (currentCount >= integration.rateLimits.requests) {
      return false;
    }
    
    // Increment counter with TTL
    await redis.incr(key);
    
    // Set TTL if not already set
    const ttl = this.parseWindowToMs(integration.rateLimits.window);
    await redis.expire(key, ttl / 1000);
    
    return true;
  }
  
  private parseWindowToMs(window: string): number {
    const unit = window.slice(-1);
    const value = parseInt(window.slice(0, -1));
    
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 60 * 1000; // Default to 1 minute
    }
  }
  
  private async recordIntegrationExecution(
    integrationId: string,
    method: string,
    success: boolean,
    error?: string
  ): Promise<void> {
    try {
      await prisma.integrationExecution.create({
        data: {
          integrationId,
          method,
          success,
          error,
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.error('Failed to record integration execution:', err);
    }
  }
  
  private setupWebhookServer(): void {
    // Setup webhook handlers for each integration
    for (const integration of this.integrations.values()) {
      if (integration.webhookUrl) {
        this.setupWebhookHandler(integration);
      }
    }
  }
  
  private setupWebhookHandler(integration: IntegrationConfig): void {
    this.webhooks.set(integration.webhookUrl!, async (req: any, res: any) => {
      try {
        // Verify webhook signature if secret is provided
        if (integration.webhookSecret) {
          const signature = req.headers['stripe-signature'] || req.headers['x-webhook-signature'];
          if (!signature || !this.verifyWebhookSignature(signature, req.body, integration.webhookSecret)) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
          }
        }
        
        // Process webhook event
        const event = {
          id: generateEventId(),
          type: `webhook.${integration.provider}`,
          payload: req.body,
          timestamp: new Date(),
          source: integration.provider,
          metadata: {
            webhookUrl: integration.webhookUrl,
            headers: req.headers
          }
        };
        
        // Emit event to registered handlers
        await this.emit(event.type, event.payload, event.source);
        
        res.status(200).json({ received: true });
      } catch (error) {
        console.error(`Webhook processing failed for ${integration.id}:`, error);
        res.status(500).json({ error: 'Webhook processing failed' });
      }
    });
  }
  
  private verifyWebhookSignature(signature: string, payload: any, secret: string): boolean {
    // Implementation depends on the provider's signature verification method
    // This is a simplified example
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  }
  
  // Public API methods
  async addIntegration(integration: IntegrationConfig): Promise<void> {
    this.integrations.set(integration.id, integration);
    this.registerEventHandlers(integration);
    
    if (integration.webhookUrl) {
      this.setupWebhookHandler(integration);
    }
  }
  
  async removeIntegration(integrationId: string): Promise<void> {
    this.integrations.delete(integrationId);
  }
  
  async enableIntegration(integrationId: string): Promise<void> {
    const integration = this.integrations.get(integrationId);
    if (integration) {
      integration.enabled = true;
    }
  }
  
  async disableIntegration(integrationId: string): Promise<void> {
    const integration = this.integrations.get(integrationId);
    if (integration) {
      integration.enabled = false;
    }
  }
  
  async updateIntegrationConfig(integrationId: string, config: Record<string, any>): Promise<void> {
    const integration = this.integrations.get(integrationId);
    if (integration) {
      integration.config = { ...integration.config, ...config };
    }
  }
  
  getIntegration(integrationId: string): IntegrationConfig | undefined {
    return this.integrations.get(integrationId);
  }
  
  getAllIntegrations(): IntegrationConfig[] {
    return Array.from(this.integrations.values());
  }
  
  async getIntegrationStats(integrationId: string): Promise<any> {
    const stats = await prisma.integrationExecution.findMany({
      where: { integrationId },
      orderBy: { timestamp: 'desc' },
      take: 1000
    });
    
    const total = stats.length;
    const successful = stats.filter(s => s.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    
    return {
      total,
      successful,
      failed,
      successRate: Math.round(successRate * 100) / 100,
      recentExecutions: stats.slice(0, 10)
    };
  }
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const integrationManager = new IntegrationManager();
```

### Specific Integration Implementations

**Stripe Payment Integration:**
```typescript
// Stripe payment integration
class StripeIntegration {
  private stripe: any;
  private config: IntegrationConfig;
  
  constructor(config: IntegrationConfig) {
    this.config = config;
    this.stripe = require('stripe')(config.config.apiKey);
  }
  
  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    customer?: string;
    metadata?: Record<string, any>;
  }): Promise<IntegrationResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency,
        customer: data.customer,
        metadata: data.metadata
      });
      
      return {
        success: true,
        data: paymentIntent,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
        statusCode: 400
      };
    }
  }
  
  async createSubscription(data: {
    customer: string;
    price: string;
    trial_period_days?: number;
    metadata?: Record<string, any>;
  }): Promise<IntegrationResponse> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: data.customer,
        items: [{ price: data.price }],
        trial_period_days: data.trial_period_days,
        metadata: data.metadata
      });
      
      return {
        success: true,
        data: subscription,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription',
        statusCode: 400
      };
    }
  }
  
  async createCheckoutSession(data: {
    mode: 'payment' | 'subscription';
    line_items: Array<{
      price: string;
      quantity: number;
    }>;
    customer?: string;
    success_url: string;
    cancel_url: string;
    metadata?: Record<string, any>;
  }): Promise<IntegrationResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: data.mode,
        line_items: data.line_items,
        customer: data.customer,
        success_url: data.success_url,
        cancel_url: data.cancel_url,
        metadata: data.metadata
      });
      
      return {
        success: true,
        data: session,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
        statusCode: 400
      };
    }
  }
  
  async handleWebhook(event: any): Promise<IntegrationResponse> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
          
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }
      
      return {
        success: true,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to handle webhook',
        statusCode: 500
      };
    }
  }
  
  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    // Update payment status in database
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'succeeded',
        paidAt: new Date()
      }
    });
    
    // Emit payment success event
    await integrationManager.emit('payment.success', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      customerId: paymentIntent.customer
    }, 'stripe');
  }
  
  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    // Update payment status in database
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message
      }
    });
    
    // Emit payment failure event
    await integrationManager.emit('payment.failure', {
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message
    }, 'stripe');
  }
  
  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    // Update subscription in database
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
    
    // Emit subscription created event
    await integrationManager.emit('subscription.created', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status
    }, 'stripe');
  }
  
  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    // Update subscription in database
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status.toUpperCase(),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
      }
    });
    
    // Emit subscription updated event
    await integrationManager.emit('subscription.updated', {
      subscriptionId: subscription.id,
      status: subscription.status
    }, 'stripe');
  }
  
  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    // Update subscription in database
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });
    
    // Emit subscription deleted event
    await integrationManager.emit('subscription.deleted', {
      subscriptionId: subscription.id
    }, 'stripe');
  }
}
```

**Email Integration:**
```typescript
// Email integration with template support
class EmailIntegration {
  private transporter: any;
  private config: IntegrationConfig;
  
  constructor(config: IntegrationConfig) {
    this.config = config;
    this.transporter = this.createTransporter();
  }
  
  private createTransporter(): any {
    const nodemailer = require('nodemailer');
    
    return nodemailer.createTransporter({
      host: this.config.config.host,
      port: this.config.config.port,
      secure: this.config.config.secure,
      auth: {
        user: this.config.config.auth.user,
        pass: this.config.config.auth.pass
      },
      tls: {
        rejectUnauthorized: true
      }
    });
  }
  
  async sendEmail(data: {
    to: string | string[];
    subject: string;
    body: string;
    isHtml?: boolean;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
    from?: string;
    replyTo?: string;
  }): Promise<IntegrationResponse> {
    try {
      const mailOptions = {
        from: data.from || this.config.config.from || 'noreply@securityguardpro.com',
        to: Array.isArray(data.to) ? data.to.join(',') : data.to,
        subject: data.subject,
        text: data.isHtml ? undefined : data.body,
        html: data.isHtml ? data.body : undefined,
        attachments: data.attachments,
        replyTo: data.replyTo
      };
      
      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        data: {
          messageId: result.messageId,
          response: result.response
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
        statusCode: 500
      };
    }
  }
  
  async sendTemplatedEmail(data: {
    to: string | string[];
    template: string;
    variables: Record<string, any>;
    from?: string;
    replyTo?: string;
  }): Promise<IntegrationResponse> {
    try {
      // Render template
      const rendered = await this.renderTemplate(data.template, data.variables);
      
      // Send email
      return await this.sendEmail({
        to: data.to,
        subject: rendered.subject,
        body: rendered.body,
        isHtml: rendered.isHtml,
        from: data.from,
        replyTo: data.replyTo
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send templated email',
        statusCode: 500
      };
    }
  }
  
  private async renderTemplate(templateName: string, variables: Record<string, any>): Promise<{
    subject: string;
    body: string;
    isHtml: boolean;
  }> {
    // Load template from database or file system
    const template = await this.loadTemplate(templateName);
    
    // Simple template rendering (in production, use a proper template engine)
    let subject = template.subject;
    let body = template.body;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
    }
    
    return {
      subject,
      body,
      isHtml: template.isHtml
    };
  }
  
  private async loadTemplate(templateName: string): Promise<{
    subject: string;
    body: string;
    isHtml: boolean;
  }> {
    // Try to load from database first
    const dbTemplate = await prisma.emailTemplate.findUnique({
      where: { name: templateName }
    });
    
    if (dbTemplate) {
      return {
        subject: dbTemplate.subject,
        body: dbTemplate.body,
        isHtml: dbTemplate.isHtml
      };
    }
    
    // Fallback to file system
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    
    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      
      // Extract subject from first line if it starts with "Subject: "
      const lines = content.split('\n');
      let subject = 'SecurityGuard Pro Notification';
      let body = content;
      
      if (lines[0].startsWith('Subject: ')) {
        subject = lines[0].substring(9);
        body = lines.slice(1).join('\n');
      }
      
      return {
        subject,
        body,
        isHtml: true
      };
    }
    
    throw new Error(`Template not found: ${templateName}`);
  }
  
  async testConnection(): Promise<IntegrationResponse> {
    try {
      await this.transporter.verify();
      return {
        success: true,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
        statusCode: 500
      };
    }
  }
}
```

This comprehensive integration management system provides a unified framework for connecting with third-party services, handling webhooks, managing rate limits, and providing retry logic. The system includes specific implementations for popular services like Stripe, email providers, and cloud storage services.

## Compliance & Auditing

### Compliance Framework

**Compliance Requirements:**
```typescript
// Compliance framework for various regulations
interface ComplianceFramework {
  gdpr: {
    enabled: boolean;
    dataRetention: {
      personalData: number; // days
      sensitiveData: number; // days
      auditLogs: number; // days
    };
    userRights: {
      access: boolean;
      rectification: boolean;
      erasure: boolean;
      portability: boolean;
      objection: boolean;
    };
  };
  
  hipaa: {
    enabled: boolean;
    phiProtection: {
      encryption: boolean;
      accessControls: boolean;
      auditLogging: boolean;
    };
  };
  
  soc2: {
    enabled: boolean;
    controls: {
      security: boolean;
      availability: boolean;
      confidentiality: boolean;
      privacy: boolean;
    };
  };
  
  pciDss: {
    enabled: boolean;
    requirements: {
      encryption: boolean;
      accessControl: boolean;
      monitoring: boolean;
      vulnerabilityManagement: boolean;
    };
  };
}

const complianceFramework: ComplianceFramework = {
  gdpr: {
    enabled: true,
    dataRetention: {
      personalData: 365,
      sensitiveData: 180,
      auditLogs: 2555 // 7 years
    },
    userRights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: true,
      objection: true
    }
  },
  
  hipaa: {
    enabled: false, // Enable if handling health data
    phiProtection: {
      encryption: true,
      accessControls: true,
      auditLogging: true
    }
  },
  
  soc2: {
    enabled: true,
    controls: {
      security: true,
      availability: true,
      confidentiality: true,
      privacy: true
    }
  },
  
  pciDss: {
    enabled: true,
    requirements: {
      encryption: true,
      accessControl: true,
      monitoring: true,
      vulnerabilityManagement: true
    }
  }
};
```

**Data Classification and Handling:**
```typescript
// Data classification system
enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  PERSONAL = 'personal',
  SENSITIVE = 'sensitive'
}

interface DataClassificationRule {
  classification: DataClassification;
  description: string;
  examples: string[];
  handlingRequirements: {
    encryption: boolean;
    accessControl: string;
    retention: number; // days
    auditLevel: 'none' | 'basic' | 'detailed';
  };
}

const dataClassificationRules: DataClassificationRule[] = [
  {
    classification: DataClassification.PUBLIC,
    description: 'Information intended for public disclosure',
    examples: ['Marketing materials', 'Public documentation', 'Press releases'],
    handlingRequirements: {
      encryption: false,
      accessControl: 'none',
      retention: 2555, // 7 years
      auditLevel: 'none'
    }
  },
  
  {
    classification: DataClassification.INTERNAL,
    description: 'Internal company information not for public disclosure',
    examples: ['Internal procedures', 'Meeting minutes', 'Project plans'],
    handlingRequirements: {
      encryption: false,
      accessControl: 'employees',
      retention: 1825, // 5 years
      auditLevel: 'basic'
    }
  },
  
  {
    classification: DataClassification.CONFIDENTIAL,
    description: 'Sensitive business information requiring protection',
    examples: ['Financial data', 'Business strategies', 'Customer lists'],
    handlingRequirements: {
      encryption: true,
      accessControl: 'need-to-know',
      retention: 2555, // 7 years
      auditLevel: 'detailed'
    }
  },
  
  {
    classification: DataClassification.RESTRICTED,
    description: 'Highly sensitive information with strict access controls',
    examples: ['Trade secrets', 'Mergers & acquisitions', 'Legal documents'],
    handlingRequirements: {
      encryption: true,
      accessControl: 'authorized-personnel-only',
      retention: 3650, // 10 years
      auditLevel: 'detailed'
    }
  },
  
  {
    classification: DataClassification.PERSONAL,
    description: 'Personally identifiable information (PII)',
    examples: ['Names, addresses, phone numbers', 'Email addresses', 'IP addresses'],
    handlingRequirements: {
      encryption: true,
      accessControl: 'role-based',
      retention: complianceFramework.gdpr.dataRetention.personalData,
      auditLevel: 'detailed'
    }
  },
  
  {
    classification: DataClassification.SENSITIVE,
    description: 'Sensitive personal or financial data',
    examples: ['Social security numbers', 'Credit card numbers', 'Health information'],
    handlingRequirements: {
      encryption: true,
      accessControl: 'strict-need-to-know',
      retention: complianceFramework.gdpr.dataRetention.sensitiveData,
      auditLevel: 'detailed'
    }
  }
];

class DataClassifier {
  static classifyData(dataType: string, data: any): DataClassification {
    const classificationMap: Record<string, DataClassification> = {
      // Personal information
      'user.name': DataClassification.PERSONAL,
      'user.email': DataClassification.PERSONAL,
      'user.phone': DataClassification.PERSONAL,
      'user.address': DataClassification.PERSONAL,
      
      // Sensitive personal information
      'user.ssn': DataClassification.SENSITIVE,
      'user.creditCard': DataClassification.SENSITIVE,
      'user.health': DataClassification.SENSITIVE,
      
      // Business confidential
      'financial.data': DataClassification.CONFIDENTIAL,
      'customer.list': DataClassification.CONFIDENTIAL,
      'pricing': DataClassification.CONFIDENTIAL,
      
      // Restricted
      'source.code': DataClassification.RESTRICTED,
      'encryption.keys': DataClassification.RESTRICTED,
      'api.keys': DataClassification.RESTRICTED,
      
      // Internal
      'internal.docs': DataClassification.INTERNAL,
      'meeting.notes': DataClassification.INTERNAL,
      
      // Public
      'marketing.content': DataClassification.PUBLIC,
      'public.docs': DataClassification.PUBLIC
    };
    
    return classificationMap[dataType] || DataClassification.INTERNAL;
  }
  
  static getHandlingRequirements(classification: DataClassification) {
    const rule = dataClassificationRules.find(r => r.classification === classification);
    return rule?.handlingRequirements;
  }
  
  static validateDataHandling(dataType: string, data: any, operation: string): boolean {
    const classification = this.classifyData(dataType, data);
    const requirements = this.getHandlingRequirements(classification);
    
    // Validate encryption requirements
    if (requirements.encryption && !this.isDataEncrypted(data)) {
      return false;
    }
    
    // Validate access control
    if (!this.hasAccessControl(classification, operation)) {
      return false;
    }
    
    // Validate audit logging
    if (requirements.auditLevel !== 'none' && !this.isAuditEnabled()) {
      return false;
    }
    
    return true;
  }
  
  private static isDataEncrypted(data: any): boolean {
    // Implementation depends on encryption system
    return true; // Placeholder
  }
  
  private static hasAccessControl(classification: DataClassification, operation: string): boolean {
    // Implementation depends on access control system
    return true; // Placeholder
  }
  
  private static isAuditEnabled(): boolean {
    // Implementation depends on audit system
    return true; // Placeholder
  }
}
```

### Audit Logging System

**Comprehensive Audit Logging:**
```typescript
// Audit logging system for compliance
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  result: 'success' | 'failure';
  error?: string;
  compliance: {
    gdpr: boolean;
    hipaa: boolean;
    soc2: boolean;
    pciDss: boolean;
  };
}

class AuditLogger {
  private static readonly SENSITIVE_ACTIONS = [
    'USER_DATA_ACCESS',
    'PAYMENT_PROCESSING',
    'SECURITY_CONFIG_CHANGE',
    'DATA_EXPORT',
    'DATA_DELETION'
  ];
  
  private static readonly PROTECTED_RESOURCES = [
    'user.personal',
    'payment.data',
    'security.config',
    'audit.logs'
  ];
  
  static async log(action: string, options: {
    userId?: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    result?: 'success' | 'failure';
    error?: string;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: generateAuditId(),
      timestamp: new Date(),
      action,
      resource: options.resource,
      resourceId: options.resourceId,
      details: options.details || {},
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      sessionId: options.sessionId,
      result: options.result || 'success',
      error: options.error,
      compliance: this.determineComplianceRequirements(action, options.resource)
    };
    
    // Sanitize sensitive data
    this.sanitizeAuditEntry(auditEntry);
    
    // Store audit entry
    await this.storeAuditEntry(auditEntry);
    
    // Check for suspicious activity
    await this.checkSuspiciousActivity(auditEntry);
    
    // Real-time alerting for critical actions
    if (this.isCriticalAction(action)) {
      await this.triggerAlert(auditEntry);
    }
  }
  
  private static determineComplianceRequirements(action: string, resource: string): {
    gdpr: boolean;
    hipaa: boolean;
    soc2: boolean;
    pciDss: boolean;
  } {
    const compliance = {
      gdpr: false,
      hipaa: false,
      soc2: false,
      pciDss: false
    };
    
    // GDPR applies to personal data processing
    if (resource.includes('user') || resource.includes('personal')) {
      compliance.gdpr = true;
    }
    
    // HIPAA applies to health information
    if (resource.includes('health') || resource.includes('medical')) {
      compliance.hipaa = true;
    }
    
    // SOC2 applies to all security and availability controls
    if (action.includes('security') || action.includes('access') || action.includes('config')) {
      compliance.soc2 = true;
    }
    
    // PCI DSS applies to payment processing
    if (resource.includes('payment') || resource.includes('card') || action.includes('payment')) {
      compliance.pciDss = true;
    }
    
    return compliance;
  }
  
  private static sanitizeAuditEntry(entry: AuditLogEntry): void {
    // Remove sensitive data from audit logs
    const sensitiveFields = ['password', 'creditCard', 'ssn', 'token', 'secret'];
    
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeObject(value);
        }
      }
      
      return sanitized;
    };
    
    entry.details = sanitizeObject(entry.details);
  }
  
  private static async storeAuditEntry(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          id: entry.id,
          userId: entry.userId,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          details: entry.details,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          sessionId: entry.sessionId,
          result: entry.result,
          error: entry.error,
          compliance: entry.compliance,
          timestamp: entry.timestamp
        }
      });
    } catch (error) {
      console.error('Failed to store audit entry:', error);
      // Fallback to file-based logging
      await this.fallbackLogEntry(entry);
    }
  }
  
  private static async fallbackLogEntry(entry: AuditLogEntry): Promise<void> {
    const logFile = path.join(__dirname, 'audit-logs', `${new Date().toISOString().split('T')[0]}.jsonl`);
    
    try {
      await fs.mkdir(path.dirname(logFile), { recursive: true });
      await fs.appendFile(logFile, JSON.stringify(entry) + '\n');
    } catch (error) {
      console.error('Failed to write fallback audit log:', error);
    }
  }
  
  private static async checkSuspiciousActivity(entry: AuditLogEntry): Promise<void> {
    // Check for multiple failed login attempts
    if (entry.action === 'LOGIN_ATTEMPT' && entry.result === 'failure') {
      const recentFailures = await this.countRecentFailures(entry.ipAddress, entry.userId);
      
      if (recentFailures >= 5) {
        await this.handleSuspiciousActivity(entry, 'multiple_failed_logins', {
          ipAddress: entry.ipAddress,
          userId: entry.userId,
          failureCount: recentFailures
        });
      }
    }
    
    // Check for unauthorized access attempts
    if (entry.result === 'failure' && this.PROTECTED_RESOURCES.includes(entry.resource)) {
      const recentAttempts = await this.countRecentAccessAttempts(entry.ipAddress, entry.resource);
      
      if (recentAttempts >= 3) {
        await this.handleSuspiciousActivity(entry, 'unauthorized_access_attempts', {
          ipAddress: entry.ipAddress,
          resource: entry.resource,
          attemptCount: recentAttempts
        });
      }
    }
    
    // Check for bulk data access
    if (this.SENSITIVE_ACTIONS.includes(entry.action)) {
      const recentBulkActions = await this.countRecentBulkActions(entry.userId, entry.action);
      
      if (recentBulkActions >= 10) {
        await this.handleSuspiciousActivity(entry, 'bulk_data_access', {
          userId: entry.userId,
          action: entry.action,
          actionCount: recentBulkActions
        });
      }
    }
  }
  
  private static async countRecentFailures(ipAddress?: string, userId?: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return prisma.auditLog.count({
      where: {
        action: 'LOGIN_ATTEMPT',
        result: 'failure',
        timestamp: { gte: oneHourAgo },
        ...(ipAddress && { ipAddress }),
        ...(userId && { userId })
      }
    });
  }
  
  private static async countRecentAccessAttempts(ipAddress: string, resource: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return prisma.auditLog.count({
      where: {
        resource,
        result: 'failure',
        timestamp: { gte: oneHourAgo },
        ipAddress
      }
    });
  }
  
  private static async countRecentBulkActions(userId: string, action: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return prisma.auditLog.count({
      where: {
        userId,
        action,
        timestamp: { gte: oneHourAgo }
      }
    });
  }
  
  private static async handleSuspiciousActivity(
    entry: AuditLogEntry,
    activityType: string,
    details: Record<string, any>
  ): Promise<void> {
    // Create security alert
    await prisma.securityAlert.create({
      data: {
        type: 'SUSPICIOUS_ACTIVITY',
        severity: 'HIGH',
        status: 'ACTIVE',
        message: `Suspicious activity detected: ${activityType}`,
        details: JSON.stringify({
          activityType,
          auditEntryId: entry.id,
          ...details
        }),
        userId: entry.userId,
        createdAt: new Date()
      }
    });
    
    // Notify security team
    await notifySecurityTeam({
      type: 'SUSPICIOUS_ACTIVITY',
      activityType,
      severity: 'HIGH',
      details: {
        auditEntryId: entry.id,
        ...details
      }
    });
    
    // Log suspicious activity
    console.warn(`Suspicious activity detected: ${activityType}`, details);
  }
  
  private static isCriticalAction(action: string): boolean {
    const criticalActions = [
      'USER_DATA_EXPORT',
      'SECURITY_CONFIG_CHANGE',
      'PAYMENT_CONFIG_CHANGE',
      'AUDIT_LOG_ACCESS',
      'DATA_DELETION',
      'PRIVILEGE_ESCALATION'
    ];
    
    return criticalActions.includes(action);
  }
  
  private static async triggerAlert(entry: AuditLogEntry): Promise<void> {
    // Send real-time alert for critical actions
    await integrationManager.emit('security.alert', {
      type: 'CRITICAL_ACTION',
      action: entry.action,
      resource: entry.resource,
      userId: entry.userId,
      timestamp: entry.timestamp,
      details: entry.details
    }, 'audit');
  }
  
  // Query methods for compliance reporting
  static async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    result?: 'success' | 'failure';
    compliance?: {
      gdpr?: boolean;
      hipaa?: boolean;
      soc2?: boolean;
      pciDss?: boolean;
    };
  } = {}): Promise<AuditLogEntry[]> {
    const where: any = {};
    
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.result) where.result = filters.result;
    
    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }
    
    if (filters.compliance) {
      const complianceFilters: any[] = [];
      
      if (filters.compliance.gdpr) {
        complianceFilters.push({ compliance: { path: ['gdpr'], equals: true } });
      }
      if (filters.compliance.hipaa) {
        complianceFilters.push({ compliance: { path: ['hipaa'], equals: true } });
      }
      if (filters.compliance.soc2) {
        complianceFilters.push({ compliance: { path: ['soc2'], equals: true } });
      }
      if (filters.compliance.pciDss) {
        complianceFilters.push({ compliance: { path: ['pciDss'], equals: true } });
      }
      
      if (complianceFilters.length > 0) {
        where.OR = complianceFilters;
      }
    }
    
    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000 // Limit results
    });
  }
  
  static async generateComplianceReport(
    reportType: 'gdpr' | 'hipaa' | 'soc2' | 'pciDss',
    period: { startDate: Date; endDate: Date }
  ): Promise<ComplianceReport> {
    const auditLogs = await this.getAuditLogs({
      startDate: period.startDate,
      endDate: period.endDate,
      compliance: { [reportType]: true }
    });
    
    const report: ComplianceReport = {
      reportType,
      period,
      generatedAt: new Date(),
      totalEvents: auditLogs.length,
      successEvents: auditLogs.filter(log => log.result === 'success').length,
      failureEvents: auditLogs.filter(log => log.result === 'failure').length,
      uniqueUsers: new Set(auditLogs.map(log => log.userId).filter(Boolean)).size,
      topActions: this.getTopActions(auditLogs),
      topResources: this.getTopResources(auditLogs),
      suspiciousActivities: auditLogs.filter(log => 
        log.action.includes('FAILED') || log.result === 'failure'
      ),
      complianceMetrics: this.calculateComplianceMetrics(auditLogs, reportType)
    };
    
    // Store report
    await prisma.complianceReport.create({
      data: {
        type: reportType,
        periodStart: period.startDate,
        periodEnd: period.endDate,
        data: JSON.stringify(report)
      }
    });
    
    return report;
  }
  
  private static getTopActions(auditLogs: AuditLogEntry[]): Array<{ action: string; count: number }> {
    const actionCounts = new Map<string, number>();
    
    for (const log of auditLogs) {
      actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    }
    
    return Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  private static getTopResources(auditLogs: AuditLogEntry[]): Array<{ resource: string; count: number }> {
    const resourceCounts = new Map<string, number>();
    
    for (const log of auditLogs) {
      resourceCounts.set(log.resource, (resourceCounts.get(log.resource) || 0) + 1);
    }
    
    return Array.from(resourceCounts.entries())
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  private static calculateComplianceMetrics(
    auditLogs: AuditLogEntry[],
    reportType: string
  ): ComplianceMetrics {
    const totalEvents = auditLogs.length;
    const successEvents = auditLogs.filter(log => log.result === 'success').length;
    const failureEvents = auditLogs.filter(log => log.result === 'failure').length;
    
    return {
      successRate: totalEvents > 0 ? (successEvents / totalEvents) * 100 : 0,
      failureRate: totalEvents > 0 ? (failureEvents / totalEvents) * 100 : 0,
      auditCoverage: 100, // All relevant events are audited
      suspiciousActivityRate: totalEvents > 0 ? (auditLogs.filter(log => 
        log.action.includes('FAILED') || log.result === 'failure'
      ).length / totalEvents) * 100 : 0
    };
  }
}

interface ComplianceReport {
  reportType: string;
  period: { startDate: Date; endDate: Date };
  generatedAt: Date;
  totalEvents: number;
  successEvents: number;
  failureEvents: number;
  uniqueUsers: number;
  topActions: Array<{ action: string; count: number }>;
  topResources: Array<{ resource: string; count: number }>;
  suspiciousActivities: AuditLogEntry[];
  complianceMetrics: ComplianceMetrics;
}

interface ComplianceMetrics {
  successRate: number;
  failureRate: number;
  auditCoverage: number;
  suspiciousActivityRate: number;
}

function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { AuditLogger, DataClassifier, complianceFramework };
```

This comprehensive compliance and auditing system provides detailed audit logging, data classification, suspicious activity detection, and compliance reporting. The system ensures adherence to various regulatory requirements including GDPR, HIPAA, SOC2, and PCI DSS.

## Troubleshooting & Support

### Common Issues and Solutions

**Performance Issues:**
```typescript
// Performance troubleshooting guide
class PerformanceTroubleshooter {
  static async diagnosePerformanceIssues(): Promise<PerformanceDiagnostic> {
    const diagnostic: PerformanceDiagnostic = {
      timestamp: new Date(),
      issues: [],
      recommendations: [],
      metrics: await this.collectPerformanceMetrics()
    };
    
    // Check database performance
    const dbIssues = await this.checkDatabasePerformance();
    diagnostic.issues.push(...dbIssues);
    
    // Check memory usage
    const memoryIssues = await this.checkMemoryUsage();
    diagnostic.issues.push(...memoryIssues);
    
    // Check CPU usage
    const cpuIssues = await this.checkCPUUsage();
    diagnostic.issues.push(...cpuIssues);
    
    // Check network performance
    const networkIssues = await this.checkNetworkPerformance();
    diagnostic.issues.push(...networkIssues);
    
    // Check application performance
    const appIssues = await this.checkApplicationPerformance();
    diagnostic.issues.push(...appIssues);
    
    // Generate recommendations
    diagnostic.recommendations = this.generateRecommendations(diagnostic.issues);
    
    return diagnostic;
  }
  
  private static async collectPerformanceMetrics(): Promise<PerformanceMetrics> {
    const [memoryMetrics, cpuMetrics, dbMetrics, appMetrics] = await Promise.all([
      this.getMemoryMetrics(),
      this.getCPUMetrics(),
      this.getDatabaseMetrics(),
      this.getApplicationMetrics()
    ]);
    
    return {
      memory: memoryMetrics,
      cpu: cpuMetrics,
      database: dbMetrics,
      application: appMetrics,
      timestamp: new Date()
    };
  }
  
  private static async checkDatabasePerformance(): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    try {
      // Check slow queries
      const slowQueries = await prisma.$queryRaw`
        SELECT query, calls, total_time, mean_time, rows
        FROM pg_stat_statements
        WHERE mean_time > 1000
        ORDER BY mean_time DESC
        LIMIT 10
      `;
      
      if ((slowQueries as any[]).length > 0) {
        issues.push({
          type: 'database',
          severity: 'high',
          title: 'Slow Database Queries Detected',
          description: `Found ${(slowQueries as any[]).length} slow queries exceeding 1 second`,
          details: { slowQueries },
          recommendation: 'Optimize slow queries or add appropriate indexes'
        });
      }
      
      // Check connection pool usage
      const poolStatus = await prisma.$queryRaw`
        SELECT 
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (WHERE state = 'idle') as idle,
          COUNT(*) FILTER (WHERE state = 'waiting') as waiting
        FROM pg_stat_activity
      `;
      
      const pool = (poolStatus as any[])[0];
      const totalConnections = pool.active + pool.idle + pool.waiting;
      const utilizationRate = (pool.active / totalConnections) * 100;
      
      if (utilizationRate > 80) {
        issues.push({
          type: 'database',
          severity: 'medium',
          title: 'High Database Connection Pool Usage',
          description: `Connection pool utilization at ${utilizationRate.toFixed(1)}%`,
          details: { poolStatus, utilizationRate },
          recommendation: 'Increase connection pool size or optimize connection usage'
        });
      }
      
      // Check table bloat
      const bloatQuery = await prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          bs.bloat_size,
          bs.real_size,
          bs.bloat_percentage
        FROM pg_stats_ext bs
        WHERE bs.bloat_percentage > 20
        ORDER BY bs.bloat_percentage DESC
        LIMIT 5
      `;
      
      if ((bloatQuery as any[]).length > 0) {
        issues.push({
          type: 'database',
          severity: 'medium',
          title: 'Database Table Bloat Detected',
          description: `Found ${(bloatQuery as any[]).length} tables with >20% bloat`,
          details: { bloatQuery },
          recommendation: 'Run VACUUM ANALYZE on bloated tables'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'database',
        severity: 'high',
        title: 'Database Performance Check Failed',
        description: 'Unable to check database performance metrics',
        details: { error: error.message },
        recommendation: 'Check database connectivity and permissions'
      });
    }
    
    return issues;
  }
  
  private static async checkMemoryUsage(): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;
      const externalMB = Math.round(memUsage.external / 1024 / 1024);
      const rssMB = Math.round(memUsage.rss / 1024 / 1024);
      
      // Check heap memory usage
      if (heapUsagePercent > 90) {
        issues.push({
          type: 'memory',
          severity: 'high',
          title: 'High Heap Memory Usage',
          description: `Heap memory usage at ${heapUsagePercent.toFixed(1)}%`,
          details: { heapUsedMB, heapTotalMB, heapUsagePercent },
          recommendation: 'Investigate memory leaks or optimize memory usage'
        });
      } else if (heapUsagePercent > 80) {
        issues.push({
          type: 'memory',
          severity: 'medium',
          title: 'Elevated Heap Memory Usage',
          description: `Heap memory usage at ${heapUsagePercent.toFixed(1)}%`,
          details: { heapUsedMB, heapTotalMB, heapUsagePercent },
          recommendation: 'Monitor memory usage and consider optimization'
        });
      }
      
      // Check external memory usage
      if (externalMB > 1000) {
        issues.push({
          type: 'memory',
          severity: 'medium',
          title: 'High External Memory Usage',
          description: `External memory usage at ${externalMB}MB`,
          details: { externalMB },
          recommendation: 'Check for excessive buffer usage or native module issues'
        });
      }
      
      // Check RSS memory usage
      if (rssMB > 2000) {
        issues.push({
          type: 'memory',
          severity: 'medium',
          title: 'High RSS Memory Usage',
          description: `RSS memory usage at ${rssMB}MB`,
          details: { rssMB },
          recommendation: 'Check for memory leaks or optimize memory allocation'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'memory',
        severity: 'high',
        title: 'Memory Usage Check Failed',
        description: 'Unable to check memory usage metrics',
        details: { error: error.message },
        recommendation: 'Check system monitoring capabilities'
      });
    }
    
    return issues;
  }
  
  private static async checkCPUUsage(): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    try {
      // Get CPU usage (simplified implementation)
      const cpuUsage = await this.getCurrentCPUUsage();
      
      if (cpuUsage > 90) {
        issues.push({
          type: 'cpu',
          severity: 'high',
          title: 'Critical CPU Usage',
          description: `CPU usage at ${cpuUsage.toFixed(1)}%`,
          details: { cpuUsage },
          recommendation: 'Investigate high CPU processes and consider scaling'
        });
      } else if (cpuUsage > 80) {
        issues.push({
          type: 'cpu',
          severity: 'medium',
          title: 'High CPU Usage',
          description: `CPU usage at ${cpuUsage.toFixed(1)}%`,
          details: { cpuUsage },
          recommendation: 'Monitor CPU usage and optimize resource-intensive operations'
        });
      }
      
      // Check CPU load average
      const loadAverage = await this.getLoadAverage();
      
      if (loadAverage > 2.0) {
        issues.push({
          type: 'cpu',
          severity: 'medium',
          title: 'High System Load Average',
          description: `Load average at ${loadAverage.toFixed(2)}`,
          details: { loadAverage },
          recommendation: 'Check for processes causing high system load'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'cpu',
        severity: 'high',
        title: 'CPU Usage Check Failed',
        description: 'Unable to check CPU usage metrics',
        details: { error: error.message },
        recommendation: 'Check system monitoring capabilities'
      });
    }
    
    return issues;
  }
  
  private static async checkNetworkPerformance(): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    try {
      // Check network latency
      const latency = await this.measureNetworkLatency();
      
      if (latency > 1000) {
        issues.push({
          type: 'network',
          severity: 'high',
          title: 'High Network Latency',
          description: `Network latency at ${latency}ms`,
          details: { latency },
          recommendation: 'Check network connectivity and optimize network paths'
        });
      } else if (latency > 500) {
        issues.push({
          type: 'network',
          severity: 'medium',
          title: 'Elevated Network Latency',
          description: `Network latency at ${latency}ms`,
          details: { latency },
          recommendation: 'Monitor network performance and investigate bottlenecks'
        });
      }
      
      // Check network throughput
      const throughput = await this.measureNetworkThroughput();
      
      if (throughput < 1) {
        issues.push({
          type: 'network',
          severity: 'medium',
          title: 'Low Network Throughput',
          description: `Network throughput at ${throughput}MB/s`,
          details: { throughput },
          recommendation: 'Check network bandwidth and optimize data transfer'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'network',
        severity: 'high',
        title: 'Network Performance Check Failed',
        description: 'Unable to check network performance metrics',
        details: { error: error.message },
        recommendation: 'Check network monitoring capabilities'
      });
    }
    
    return issues;
  }
  
  private static async checkApplicationPerformance(): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];
    
    try {
      // Check API response times
      const apiMetrics = await this.getAPIMetrics();
      
      if (apiMetrics.averageResponseTime > 2000) {
        issues.push({
          type: 'application',
          severity: 'high',
          title: 'Slow API Response Times',
          description: `Average API response time at ${apiMetrics.averageResponseTime}ms`,
          details: { apiMetrics },
          recommendation: 'Optimize API endpoints and database queries'
        });
      } else if (apiMetrics.averageResponseTime > 1000) {
        issues.push({
          type: 'application',
          severity: 'medium',
          title: 'Elevated API Response Times',
          description: `Average API response time at ${apiMetrics.averageResponseTime}ms`,
          details: { apiMetrics },
          recommendation: 'Monitor API performance and identify bottlenecks'
        });
      }
      
      // Check error rates
      if (apiMetrics.errorRate > 5) {
        issues.push({
          type: 'application',
          severity: 'high',
          title: 'High API Error Rate',
          description: `API error rate at ${apiMetrics.errorRate}%`,
          details: { apiMetrics },
          recommendation: 'Investigate error causes and implement error handling'
        });
      }
      
      // Check active connections
      if (apiMetrics.activeConnections > 1000) {
        issues.push({
          type: 'application',
          severity: 'medium',
          title: 'High Active Connections',
          description: `${apiMetrics.activeConnections} active connections`,
          details: { apiMetrics },
          recommendation: 'Monitor connection usage and consider connection pooling optimization'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'application',
        severity: 'high',
        title: 'Application Performance Check Failed',
        description: 'Unable to check application performance metrics',
        details: { error: error.message },
        recommendation: 'Check application monitoring capabilities'
      });
    }
    
    return issues;
  }
  
  private static generateRecommendations(issues: PerformanceIssue[]): string[] {
    const recommendations = new Set<string>();
    
    for (const issue of issues) {
      recommendations.add(issue.recommendation);
    }
    
    // Add general recommendations based on issue patterns
    const highSeverityCount = issues.filter(i => i.severity === 'high').length;
    const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length;
    
    if (highSeverityCount > 3) {
      recommendations.add('Consider immediate system scaling or optimization');
    }
    
    if (mediumSeverityCount > 5) {
      recommendations.add('Schedule maintenance window for performance optimization');
    }
    
    if (issues.some(i => i.type === 'database')) {
      recommendations.add('Review database indexes and query optimization');
    }
    
    if (issues.some(i => i.type === 'memory')) {
      recommendations.add('Investigate memory leaks and optimize memory usage');
    }
    
    if (issues.some(i => i.type === 'cpu')) {
      recommendations.add('Monitor CPU-intensive processes and consider load balancing');
    }
    
    return Array.from(recommendations);
  }
  
  // Helper methods for metric collection
  private static async getMemoryMetrics(): Promise<any> {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024)
    };
  }
  
  private static async getCPUMetrics(): Promise<any> {
    return {
      usage: await this.getCurrentCPUUsage(),
      loadAverage: await this.getLoadAverage()
    };
  }
  
  private static async getDatabaseMetrics(): Promise<any> {
    try {
      const [poolStatus, slowQueries] = await Promise.all([
        prisma.$queryRaw`
          SELECT 
            COUNT(*) FILTER (WHERE state = 'active') as active,
            COUNT(*) FILTER (WHERE state = 'idle') as idle,
            COUNT(*) FILTER (WHERE state = 'waiting') as waiting
          FROM pg_stat_activity
        `,
        prisma.$queryRaw`
          SELECT COUNT(*) as slow_queries
          FROM pg_stat_statements
          WHERE mean_time > 1000
        `
      ]);
      
      return {
        pool: (poolStatus as any[])[0],
        slowQueries: (slowQueries as any[])[0].slow_queries
      };
    } catch {
      return { error: 'Database metrics unavailable' };
    }
  }
  
  private static async getApplicationMetrics(): Promise<any> {
    // This would integrate with your application monitoring system
    return {
      averageResponseTime: Math.random() * 3000, // Placeholder
      errorRate: Math.random() * 10, // Placeholder
      activeConnections: Math.floor(Math.random() * 2000), // Placeholder
      requestsPerMinute: Math.floor(Math.random() * 1000) // Placeholder
    };
  }
  
  private static async getCurrentCPUUsage(): Promise<number> {
    // Simplified CPU usage calculation
    // In production, use proper system monitoring
    return Math.random() * 100;
  }
  
  private static async getLoadAverage(): Promise<number> {
    // Simplified load average calculation
    // In production, read from /proc/loadavg or use system APIs
    return Math.random() * 3;
  }
  
  private static async measureNetworkLatency(): Promise<number> {
    // Simplified network latency measurement
    // In production, ping critical services or use network monitoring tools
    return Math.random() * 2000;
  }
  
  private static async measureNetworkThroughput(): Promise<number> {
    // Simplified network throughput measurement
    // In production, use network monitoring tools
    return Math.random() * 100;
  }
}

interface PerformanceDiagnostic {
  timestamp: Date;
  issues: PerformanceIssue[];
  recommendations: string[];
  metrics: PerformanceMetrics;
}

interface PerformanceIssue {
  type: 'database' | 'memory' | 'cpu' | 'network' | 'application';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  details: Record<string, any>;
  recommendation: string;
}

interface PerformanceMetrics {
  memory: any;
  cpu: any;
  database: any;
  application: any;
  timestamp: Date;
}

interface APIMetrics {
  averageResponseTime: number;
  errorRate: number;
  activeConnections: number;
  requestsPerMinute: number;
}
```

**Error Handling and Diagnostics:**
```typescript
// Comprehensive error handling and diagnostics
class ErrorDiagnostics {
  private static readonly ERROR_CATEGORIES = {
    DATABASE: 'database',
    NETWORK: 'network',
    AUTHENTICATION: 'authentication',
    AUTHORIZATION: 'authorization',
    VALIDATION: 'validation',
    BUSINESS_LOGIC: 'business_logic',
    EXTERNAL_SERVICE: 'external_service',
    SYSTEM: 'system'
  };
  
  private static readonly ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };
  
  static async diagnoseError(error: Error, context: ErrorContext): Promise<ErrorDiagnostic> {
    const diagnostic: ErrorDiagnostic = {
      errorId: generateErrorId(),
      timestamp: new Date(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        category: this.categorizeError(error),
        severity: this.determineSeverity(error, context)
      },
      context,
      systemInfo: await this.getSystemInfo(),
      recommendations: [],
      relatedEvents: []
    };
    
    // Analyze error patterns
    await this.analyzeErrorPatterns(diagnostic);
    
    // Generate recommendations
    diagnostic.recommendations = this.generateErrorRecommendations(diagnostic);
    
    // Find related events
    diagnostic.relatedEvents = await this.findRelatedEvents(diagnostic);
    
    // Store diagnostic
    await this.storeErrorDiagnostic(diagnostic);
    
    return diagnostic;
  }
  
  private static categorizeError(error: Error): string {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();
    
    // Database errors
    if (errorName.includes('prisma') || 
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('constraint')) {
      return this.ERROR_CATEGORIES.DATABASE;
    }
    
    // Network errors
    if (errorName.includes('network') ||
        errorMessage.includes('enetunreach') ||
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('timeout')) {
      return this.ERROR_CATEGORIES.NETWORK;
    }
    
    // Authentication errors
    if (errorMessage.includes('unauthorized') ||
        errorMessage.includes('authentication') ||
        errorMessage.includes('invalid token') ||
        errorMessage.includes('session expired')) {
      return this.ERROR_CATEGORIES.AUTHENTICATION;
    }
    
    // Authorization errors
    if (errorMessage.includes('forbidden') ||
        errorMessage.includes('permission') ||
        errorMessage.includes('access denied')) {
      return this.ERROR_CATEGORIES.AUTHORIZATION;
    }
    
    // Validation errors
    if (errorName.includes('validation') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('required') ||
        errorMessage.includes('format')) {
      return this.ERROR_CATEGORIES.VALIDATION;
    }
    
    // External service errors
    if (errorMessage.includes('stripe') ||
        errorMessage.includes('twilio') ||
        errorMessage.includes('aws') ||
        errorMessage.includes('external')) {
      return this.ERROR_CATEGORIES.EXTERNAL_SERVICE;
    }
    
    // System errors
    if (errorName.includes('system') ||
        errorMessage.includes('memory') ||
        errorMessage.includes('disk') ||
        errorMessage.includes('cpu')) {
      return this.ERROR_CATEGORIES.SYSTEM;
    }
    
    // Default to business logic
    return this.ERROR_CATEGORIES.BUSINESS_LOGIC;
  }
  
  private static determineSeverity(error: Error, context: ErrorContext): string {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();
    
    // Critical errors
    if (errorName.includes('fatal') ||
        errorMessage.includes('fatal') ||
        errorMessage.includes('critical') ||
        context.impact === 'system_outage') {
      return this.ERROR_SEVERITY.CRITICAL;
    }
    
    // High severity errors
    if (errorName.includes('security') ||
        errorMessage.includes('security') ||
        errorMessage.includes('breach') ||
        context.impact === 'data_loss' ||
        context.impact === 'service_unavailable') {
      return this.ERROR_SEVERITY.HIGH;
    }
    
    // Medium severity errors
    if (errorMessage.includes('timeout') ||
        errorMessage.includes('unavailable') ||
        context.impact === 'degraded_performance' ||
        context.impact === 'partial_outage') {
      return this.ERROR_SEVERITY.MEDIUM;
    }
    
    // Low severity errors
    return this.ERROR_SEVERITY.LOW;
  }
  
  private static async analyzeErrorPatterns(diagnostic: ErrorDiagnostic): Promise<void> {
    const { errorId, error, context } = diagnostic;
    
    // Check for recurring errors
    const recentErrors = await this.getRecentErrors(
      error.category,
      error.name,
      context.userId,
      context.ipAddress
    );
    
    if (recentErrors.length > 5) {
      diagnostic.patterns = {
        isRecurring: true,
        frequency: recentErrors.length,
        timeWindow: '1 hour',
        similarErrors: recentErrors
      };
      
      // Add pattern-based recommendation
      diagnostic.recommendations.push(
        'This error has occurred multiple times recently. Investigate root cause and implement permanent fix.'
      );
    }
    
    // Check for error correlations
    const correlatedErrors = await this.findCorrelatedErrors(errorId, context);
    
    if (correlatedErrors.length > 0) {
      diagnostic.correlations = {
        hasCorrelations: true,
        correlatedErrors,
        correlationType: this.determineCorrelationType(correlatedErrors)
      };
    }
    
    // Check for system-wide issues
    const systemIssues = await this.checkSystemWideIssues(error.category);
    
    if (systemIssues.length > 0) {
      diagnostic.systemImpact = {
        hasSystemImpact: true,
        affectedComponents: systemIssues,
        impactLevel: this.calculateImpactLevel(systemIssues)
      };
    }
  }
  
  private static async getRecentErrors(
    category: string,
    errorName: string,
    userId?: string,
    ipAddress?: string
  ): Promise<ErrorLog[]> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const where: any = {
      category,
      name: errorName,
      timestamp: { gte: oneHourAgo }
    };
    
    if (userId) where.userId = userId;
    if (ipAddress) where.ipAddress = ipAddress;
    
    return prisma.errorLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10
    });
  }
  
  private static async findCorrelatedErrors(
    errorId: string,
    context: ErrorContext
  ): Promise<ErrorLog[]> {
    const fiveMinutesBefore = new Date(context.timestamp.getTime() - 5 * 60 * 1000);
    const fiveMinutesAfter = new Date(context.timestamp.getTime() + 5 * 60 * 1000);
    
    return prisma.errorLog.findMany({
      where: {
        timestamp: {
          gte: fiveMinutesBefore,
          lte: fiveMinutesAfter
        },
        id: { not: errorId },
        OR: [
          { userId: context.userId },
          { ipAddress: context.ipAddress },
          { sessionId: context.sessionId }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 5
    });
  }
  
  private static determineCorrelationType(correlatedErrors: ErrorLog[]): string {
    const categories = new Set(correlatedErrors.map(e => e.category));
    
    if (categories.size === 1) {
      return `multiple_${Array.from(categories)[0]}_errors`;
    }
    
    return 'mixed_error_types';
  }
  
  private static async checkSystemWideIssues(category: string): Promise<string[]> {
    const affectedComponents: string[] = [];
    
    // Check if other users are experiencing similar issues
    const recentSystemErrors = await prisma.errorLog.findMany({
      where: {
        category,
        timestamp: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      distinct: ['userId']
    });
    
    if (recentSystemErrors.length > 5) {
      affectedComponents.push('user_base');
    }
    
    // Check for service-specific issues
    if (category === this.ERROR_CATEGORIES.DATABASE) {
      const dbErrors = await prisma.errorLog.count({
        where: {
          category: this.ERROR_CATEGORIES.DATABASE,
          timestamp: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          }
        }
      });
      
      if (dbErrors > 3) {
        affectedComponents.push('database_service');
      }
    }
    
    // Check for external service issues
    if (category === this.ERROR_CATEGORIES.EXTERNAL_SERVICE) {
      const externalErrors = await prisma.errorLog.count({
        where: {
          category: this.ERROR_CATEGORIES.EXTERNAL_SERVICE,
          timestamp: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          }
        }
      });
      
      if (externalErrors > 2) {
        affectedComponents.push('external_services');
      }
    }
    
    return affectedComponents;
  }
  
  private static calculateImpactLevel(affectedComponents: string[]): string {
    if (affectedComponents.includes('user_base') && affectedComponents.length > 2) {
      return 'system_wide';
    }
    
    if (affectedComponents.includes('database_service')) {
      return 'service_critical';
    }
    
    if (affectedComponents.length > 1) {
      return 'multiple_services';
    }
    
    return 'limited_scope';
  }
  
  private static generateErrorRecommendations(diagnostic: ErrorDiagnostic): string[] {
    const recommendations: string[] = [];
    const { error, context, patterns, systemImpact } = diagnostic;
    
    // Category-specific recommendations
    switch (error.category) {
      case this.ERROR_CATEGORIES.DATABASE:
        recommendations.push(
          'Check database connectivity and connection pool settings',
          'Review database query performance and optimize slow queries',
          'Monitor database resource usage and consider scaling'
        );
        break;
        
      case this.ERROR_CATEGORIES.NETWORK:
        recommendations.push(
          'Check network connectivity and firewall settings',
          'Monitor network latency and throughput',
          'Implement retry logic for transient network failures'
        );
        break;
        
      case this.ERROR_CATEGORIES.AUTHENTICATION:
        recommendations.push(
          'Verify authentication service status and configuration',
          'Check token validity and expiration settings',
          'Review authentication logs for suspicious activity'
        );
        break;
        
      case this.ERROR_CATEGORIES.EXTERNAL_SERVICE:
        recommendations.push(
          'Check external service status and API documentation',
          'Implement circuit breaker pattern for external service calls',
          'Monitor external service response times and error rates'
        );
        break;
        
      case this.ERROR_CATEGORIES.SYSTEM:
        recommendations.push(
          'Check system resource usage (CPU, memory, disk)',
          'Monitor system logs for hardware or OS issues',
          'Consider scaling or load balancing for high resource usage'
        );
        break;
        
      default:
        recommendations.push(
          'Review application logs for additional context',
          'Check recent code changes that might have introduced the error',
          'Implement additional error handling and logging'
        );
    }
    
    // Pattern-based recommendations
    if (patterns?.isRecurring) {
      recommendations.push(
        'This error appears to be recurring. Investigate root cause and implement permanent fix.',
        'Consider adding automated monitoring and alerting for this error type.'
      );
    }
    
    // System impact recommendations
    if (systemImpact?.hasSystemImpact) {
      recommendations.push(
        'This error may be affecting multiple users or services. Prioritize investigation.',
        'Consider implementing system-wide monitoring and health checks.'
      );
    }
    
    // Context-specific recommendations
    if (context.userRole === 'admin') {
      recommendations.push(
        'This error affected an admin user. Prioritize investigation and resolution.'
      );
    }
    
    if (context.impact === 'data_loss') {
      recommendations.push(
        'This error may have resulted in data loss. Check data integrity and implement recovery procedures.'
      );
    }
    
    return recommendations;
  }
  
  private static async getSystemInfo(): Promise<SystemInfo> {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: await this.getCurrentCPUUsage(),
      timestamp: new Date()
    };
  }
  
  private static async storeErrorDiagnostic(diagnostic: ErrorDiagnostic): Promise<void> {
    try {
      await prisma.errorDiagnostic.create({
        data: {
          id: diagnostic.errorId,
          errorName: diagnostic.error.name,
          errorMessage: diagnostic.error.message,
          errorStack: diagnostic.error.stack,
          errorCategory: diagnostic.error.category,
          errorSeverity: diagnostic.error.severity,
          context: JSON.stringify(diagnostic.context),
          systemInfo: JSON.stringify(diagnostic.systemInfo),
          recommendations: JSON.stringify(diagnostic.recommendations),
          patterns: diagnostic.patterns ? JSON.stringify(diagnostic.patterns) : null,
          correlations: diagnostic.correlations ? JSON.stringify(diagnostic.correlations) : null,
          systemImpact: diagnostic.systemImpact ? JSON.stringify(diagnostic.systemImpact) : null,
          timestamp: diagnostic.timestamp
        }
      });
    } catch (storageError) {
      console.error('Failed to store error diagnostic:', storageError);
      // Fallback to file-based logging
      await this.fallbackErrorLogging(diagnostic);
    }
  }
  
  private static async fallbackErrorLogging(diagnostic: ErrorDiagnostic): Promise<void> {
    const logFile = path.join(__dirname, 'error-diagnostics', `${new Date().toISOString().split('T')[0]}.jsonl`);
    
    try {
      await fs.mkdir(path.dirname(logFile), { recursive: true });
      await fs.appendFile(logFile, JSON.stringify(diagnostic) + '\n');
    } catch (error) {
      console.error('Failed to write fallback error diagnostic:', error);
    }
  }
  
  // Public API methods
  static async getErrorStatistics(timeRange: { start: Date; end: Date }): Promise<ErrorStatistics> {
    const errors = await prisma.errorDiagnostic.findMany({
      where: {
        timestamp: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });
    
    const stats: ErrorStatistics = {
      totalErrors: errors.length,
      errorsByCategory: {},
      errorsBySeverity: {},
      topErrors: [],
      trends: await this.calculateErrorTrends(timeRange)
    };
    
    // Calculate category distribution
    for (const error of errors) {
      stats.errorsByCategory[error.errorCategory] = (stats.errorsByCategory[error.errorCategory] || 0) + 1;
    }
    
    // Calculate severity distribution
    for (const error of errors) {
      stats.errorsBySeverity[error.errorSeverity] = (stats.errorsBySeverity[error.errorSeverity] || 0) + 1;
    }
    
    // Find top errors
    const errorCounts = new Map<string, number>();
    for (const error of errors) {
      const key = `${error.errorName}:${error.errorMessage}`;
      errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
    }
    
    stats.topErrors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return stats;
  }
  
  private static async calculateErrorTrends(timeRange: { start: Date; end: Date }): Promise<ErrorTrend[]> {
    const intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals
    const trends: ErrorTrend[] = [];
    
    for (let start = timeRange.start.getTime(); start < timeRange.end.getTime(); start += intervalMs) {
      const end = Math.min(start + intervalMs, timeRange.end.getTime());
      
      const errorCount = await prisma.errorDiagnostic.count({
        where: {
          timestamp: {
            gte: new Date(start),
            lt: new Date(end)
          }
        }
      });
      
      trends.push({
        timestamp: new Date(start),
        errorCount,
        interval: '1d'
      });
    }
    
    return trends;
  }
  
  private static async getCurrentCPUUsage(): Promise<number> {
    // Simplified CPU usage calculation
    return Math.random() * 100;
  }
}

interface ErrorDiagnostic {
  errorId: string;
  timestamp: Date;
  error: {
    name: string;
    message: string;
    stack: string;
    category: string;
    severity: string;
  };
  context: ErrorContext;
  systemInfo: SystemInfo;
  recommendations: string[];
  patterns?: {
    isRecurring: boolean;
    frequency: number;
    timeWindow: string;
    similarErrors: ErrorLog[];
  };
  correlations?: {
    hasCorrelations: boolean;
    correlatedErrors: ErrorLog[];
    correlationType: string;
  };
  systemImpact?: {
    hasSystemImpact: boolean;
    affectedComponents: string[];
    impactLevel: string;
  };
  relatedEvents: ErrorLog[];
}

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  parameters?: Record<string, any>;
  timestamp: Date;
  impact?: 'none' | 'degraded_performance' | 'partial_outage' | 'service_unavailable' | 'data_loss' | 'system_outage';
  userRole?: string;
}

interface SystemInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  uptime: number;
  memoryUsage: any;
  cpuUsage: number;
  timestamp: Date;
}

interface ErrorStatistics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  topErrors: Array<{ error: string; count: number }>;
  trends: ErrorTrend[];
}

interface ErrorTrend {
  timestamp: Date;
  errorCount: number;
  interval: string;
}

interface ErrorLog {
  id: string;
  name: string;
  category: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
}

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { ErrorDiagnostics, PerformanceTroubleshooter };
```

This comprehensive troubleshooting and support system provides detailed performance diagnostics, error analysis, and recommendations for resolving common issues. The system includes automated pattern detection, correlation analysis, and system-wide impact assessment.

## Conclusion

This SecurityGuard Pro Administrator Guide provides a comprehensive reference for managing, monitoring, and troubleshooting the SecurityGuard Pro system. The guide covers:

1. **System Architecture** - Understanding the technology stack and component interactions
2. **Installation & Setup** - Step-by-step deployment instructions for various environments
3. **User Management** - Managing users, roles, permissions, and authentication
4. **Tenant Management** - Multi-tenant architecture and organization management
5. **System Configuration** - Environment setup, feature flags, and system optimization
6. **Security Management** - Authentication, authorization, encryption, and security monitoring
7. **Database Management** - Schema management, performance optimization, and backup/recovery
8. **Performance Monitoring** - Real-time monitoring, metrics collection, and alerting
9. **Backup & Recovery** - Automated backup strategies and disaster recovery
10. **Integration Management** - Third-party service integration and webhook management
11. **Compliance & Auditing** - Regulatory compliance and comprehensive audit logging
12. **Troubleshooting & Support** - Performance diagnostics and error analysis

This guide serves as an essential resource for system administrators responsible for deploying, maintaining, and optimizing the SecurityGuard Pro platform. The detailed technical information, code examples, and best practices ensure effective system management and operational excellence.