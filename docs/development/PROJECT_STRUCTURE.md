# Project Structure

This document provides an overview of the organized file structure for the Securitify project.

## Directory Structure

```
securitify/
├── 📁 assets/                    # Static assets
│   ├── 📁 images/               # Images and logos
│   └── 📁 icons/                # App icons and favicons
├── 📁 database/                 # Database files
├── 📁 docs/                     # Documentation
│   ├── 📁 api/                  # API documentation
│   ├── 📁 deployment/           # Deployment guides
│   ├── 📁 development/          # Development documentation
│   └── 📁 guides/               # User guides and feature summaries
├── 📁 logs/                     # Application logs
├── 📁 prisma/                   # Prisma schema and configuration
├── 📁 public/                   # Public static files
├── 📁 scripts/                  # Utility scripts and server files
│   ├── 📁 websocket/            # WebSocket examples
│   └── *.ts                    # Database and utility scripts
├── 📁 src/                      # Source code
│   ├── 📁 app/                  # Next.js app directory
│   │   ├── 📁 api/              # API routes
│   │   ├── 📁 auth/             # Authentication pages
│   │   ├── 📁 company/          # Company pages
│   │   ├── 📁 guards/           # Guard management
│   │   ├── 📁 support/          # Support pages
│   │   └── *.tsx               # Root pages
│   ├── 📁 components/           # React components
│   │   ├── 📁 ui/               # UI components (shadcn/ui)
│   │   └── *.tsx               # Custom components
│   ├── 📁 contexts/             # React contexts
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utility libraries
│   │   ├── 📁 auth/             # Authentication utilities
│   │   ├── 📁 email/            # Email service
│   │   └── 📁 payment/          # Payment utilities
│   ├── 📁 middleware/           # Next.js middleware
│   ├── 📁 styles/               # CSS styles
│   ├── 📁 types/                # TypeScript type definitions
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── 📁 tests/                    # Test files
│   ├── 📁 __mocks__/            # Jest mocks
│   ├── 📁 __tests__/            # Test files
│   ├── jest.config.js           # Jest configuration
│   └── jest.setup.js            # Jest setup
├── 📁 temp/                     # Temporary files (gitignored)
├── .env                         # Environment variables
├── .env.local                   # Local environment variables
├── .gitignore                   # Git ignore rules
├── components.json             # shadcn/ui configuration
├── jest.config.js               # Jest configuration
├── middleware.ts                # Root middleware
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── README.md                    # Project README
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── vercel.json                  # Vercel deployment configuration
```

## Key Directories

### `/src/app/`
- **Next.js App Router structure**
- Contains all pages and API routes
- Organized by feature (auth, company, guards, etc.)

### `/src/components/`
- **Reusable React components**
- `ui/` folder contains shadcn/ui components
- Custom components for specific features

### `/src/lib/`
- **Utility libraries and services**
- Authentication, email, payment services
- Database utilities and helpers

### `/scripts/`
- **Utility scripts and server files**
- Database seeding and test scripts
- WebSocket examples and server configuration

### `/docs/`
- **Comprehensive documentation**
- API documentation, deployment guides
- User guides and feature summaries

### `/tests/`
- **Test files and configuration**
- Unit, integration, and e2e tests
- Jest configuration and mocks

## File Organization Principles

1. **Feature-based organization**: Related files are grouped together
2. **Separation of concerns**: UI, logic, and data are separated
3. **Consistent naming**: Files use kebab-case for folders and PascalCase for components
4. **Clear hierarchy**: Important files are at the root, supporting files in subdirectories
5. **Documentation**: Each major section has appropriate documentation

## Environment-specific Files

- **Development**: `.env.local` for local development
- **Production**: Environment variables set through hosting platform
- **Testing**: Test-specific configuration in test files

## Build and Deployment

- **Development**: `npm run dev` starts development server
- **Production**: `npm run build` creates optimized build
- **Deployment**: Vercel configuration in `vercel.json`

## Database

- **Schema**: `prisma/schema.prisma` defines database structure
- **Migrations**: Managed through Prisma
- **Seeding**: `scripts/seed.ts` for initial data
- **Files**: Database files stored in `database/` directory

## Assets

- **Images**: Stored in `assets/images/`
- **Icons**: App icons in `assets/icons/`
- **Public files**: Static assets in `public/` directory

This organization ensures maintainability, scalability, and ease of navigation for developers working on the project.