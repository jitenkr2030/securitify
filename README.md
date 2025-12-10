# Securitify

A comprehensive security guard management system built with modern web technologies, featuring real-time location tracking, attendance management, geofencing, alert systems, and multi-tenant support.

## 🚀 Features

### Core Features
- **Real-time Location Tracking**: GPS-based monitoring of security guards with live map visualization
- **Geofencing**: Create and manage virtual boundaries with automated breach alerts
- **Attendance Management**: Automated check-in/checkout with facial recognition and GPS verification
- **Alert System**: Real-time notifications for security events, emergencies, and system alerts
- **Multi-tenant Architecture**: Support for multiple organizations with complete data isolation
- **Mobile App Support**: Native mobile applications with offline data synchronization

### Advanced Features
- **Document Management**: Centralized storage for licenses, certificates, and compliance documents
- **Billing & Subscriptions**: Stripe-powered subscription management with multiple pricing tiers
- **Guard Scheduling**: Advanced scheduling system with shift management and coverage monitoring
- **Reporting & Analytics**: Comprehensive reports and dashboards for operations insights
- **PSARA Compliance**: Built-in compliance with Private Security Agencies Regulation Act (India)
- **Health & Safety Monitoring**: Wellness checks and health record management

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand, TanStack Query
- **Real-time**: Socket.io Client
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Caching**: Memory cache (development), Redis (production)

### Infrastructure
- **Deployment**: Vercel (recommended), Docker containers
- **Database**: SQLite (development), PostgreSQL (production)
- **Storage**: Local (development), AWS S3 (production)
- **Payment Processing**: Stripe
- **Email Service**: SMTP/Third-party integration
- **SMS Service**: Twilio integration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Database (SQLite for development, PostgreSQL for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/securitify.git
   cd securitify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
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
   NEXTAUTH_SECRET=your-secret-key-here
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
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed database with initial data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to view the application.

### Production Setup

See the [Administrator Guide](docs/deployment/README.md) for detailed production deployment instructions including:
- Server preparation
- Database configuration
- Docker deployment
- SSL certificate setup
- Nginx configuration

## 📱 Usage

### For Users
Refer to the [User Guide](docs/guides/README.md) for comprehensive documentation on:
- Getting started with the platform
- Dashboard navigation
- Guard management
- Location tracking
- Attendance management
- Alert handling
- Mobile app usage

### For Administrators
Refer to the [Administrator Guide](docs/deployment/README.md) for:
- System installation and setup
- User and tenant management
- System configuration
- Security management
- Performance monitoring
- Backup and recovery procedures

### For Developers
Refer to the [API Documentation](docs/api/README.md) for:
- Complete API reference
- Authentication details
- Endpoint documentation
- Webhook information
- SDK usage examples
- Best practices

## 📁 Project Organization

The project follows a well-organized structure for maintainability and scalability:

- **`/src/`** - Source code with feature-based organization
- **`/docs/`** - Comprehensive documentation (API, deployment, guides)
- **`/scripts/`** - Utility scripts and server configurations
- **`/tests/`** - Test files and configuration
- **`/assets/`** - Static assets (images, icons)
- **`/database/`** - Database files and migrations

For detailed project structure information, see [Project Structure Documentation](docs/development/PROJECT_STRUCTURE.md).

## 🔧 Configuration

### Environment Variables
The application uses several environment variables for configuration. Refer to `.env.example` for a complete list of required and optional variables.

### Database Configuration
The application supports both SQLite (for development) and PostgreSQL (for production). Database configuration is handled through the `DATABASE_URL` environment variable.

### Multi-tenant Setup
The system supports multi-tenant architecture with data isolation at the database level. Tenants can be managed through the admin interface or API.

## 📊 Features Overview

### Guard Management
- Complete guard profiles with photos and contact information
- License and certification tracking with expiry alerts
- Attendance monitoring with multiple verification methods
- Performance evaluation and reporting
- Equipment management and assignment

### Location & Geofencing
- Real-time GPS tracking with configurable update intervals
- Circular and polygonal geofence creation
- Automated breach alerts with escalation rules
- Location history and trail visualization
- Battery level monitoring

### Alert System
- Multiple alert types (geofence, emergency, system, schedule)
- Configurable severity levels and notification channels
- Alert acknowledgment and resolution workflows
- Escalation rules and automated procedures
- Alert analytics and reporting

### Billing & Subscriptions
- Three-tier subscription model (Basic, Professional, Enterprise)
- Stripe integration for secure payment processing
- Usage monitoring and overage handling
- Automated invoicing and receipt generation
- Subscription management and upgrades/downgrades

### Mobile Application
- Native iOS and Android applications
- Offline data synchronization
- Push notifications for alerts
- GPS-based check-in/checkout
- Photo capture for verification
- Emergency panic button

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Use TypeScript for all new code
- Write comprehensive tests for new features
- Update documentation as needed
- Ensure all existing tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: See the docs/ directory for comprehensive guides
- **Issues**: Report bugs and request features on GitHub Issues
- **Community**: Join our community discussions
- **Email**: Contact the development team for enterprise support

## 🗺 Roadmap

### Upcoming Features
- [ ] Advanced AI-powered incident prediction
- [ ] Integration with biometric devices
- [ ] Enhanced mobile offline capabilities
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations (HR systems, access control)
- [ ] Multi-language support
- [ ] Advanced reporting and export features

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Mobile app enhancements and offline sync
- **v1.2.0**: PSARA compliance features
- **v1.3.0**: Advanced reporting and analytics
- **v2.0.0**: Enterprise features and scalability improvements

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Prisma team for the modern ORM
- Stripe for payment processing integration
- All contributors and community members
- Security agencies that provided valuable feedback and requirements

---

**SecurityGuard Pro** - Modern security management for the digital age.
