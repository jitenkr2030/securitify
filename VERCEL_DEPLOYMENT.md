# Vercel Deployment Guide

## 🚀 Deploying Securitify to Vercel

### Required Environment Variables

You MUST set these environment variables in your Vercel project settings:

#### 1. Database Configuration
```
DATABASE_URL=file:./data/dev.db
```

#### 2. NextAuth Configuration
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-at-least-32-characters-long
```

#### 3. Application Configuration
```
NODE_ENV=production
APP_NAME=Securitify
APP_URL=https://your-domain.vercel.app
```

### 🔧 Setup Steps

#### 1. Vercel Project Configuration
1. Connect your GitHub repository to Vercel
2. Go to Project Settings → Environment Variables
3. Add all the required environment variables listed above
4. Set the Build Command to: `npm run vercel-build`
5. Set the Output Directory to: `.next`

#### 2. Database Setup
The application uses SQLite with file-based storage. The database file will be automatically created at:
```
/data/dev.db
```

#### 3. Build Process
The build process includes:
- Database directory creation
- Prisma client generation
- Next.js build

### 📝 Important Notes

#### Database Persistence
- Vercel's file system is ephemeral, meaning the database file may be reset between deployments
- For production use, consider using a persistent database solution like:
  - PlanetScale (MySQL)
  - Supabase (PostgreSQL)
  - Vercel Postgres

#### Security
- Always use a strong, randomly generated `NEXTAUTH_SECRET`
- Never commit secrets to version control
- Use Vercel's environment variable encryption

#### Demo Users
The system includes demo users for testing:
- **Admin**: `admin@security.com` / `password123`
- **Guard**: `guard@security.com` / `password123`
- **Officer**: `officer@security.com` / `password123`

### 🔍 Troubleshooting

#### Common Issues

1. **"Failed to create tenant" Error**
   - Check that `DATABASE_URL` is set correctly in Vercel environment variables
   - Ensure the build process completed successfully
   - Check Vercel function logs for detailed error messages

2. **NextAuth "NO_SECRET" Error**
   - Verify `NEXTAUTH_SECRET` is set and is at least 32 characters long
   - Check that `NEXTAUTH_URL` matches your deployed URL exactly

3. **Database Connection Errors**
   - Ensure the `/data` directory exists and is writable
   - Check that the SQLite file has proper permissions
   - Verify the `DATABASE_URL` format is correct

#### Debug Steps
1. Check Vercel function logs in the dashboard
2. Verify all environment variables are set correctly
3. Test the build process locally with `npm run vercel-build`
4. Check that the database file is accessible

### 🔄 Production Considerations

For a production deployment, consider:

1. **Database Migration**: Use a proper database service instead of SQLite
2. **File Storage**: Use cloud storage for uploaded files
3. **Email Service**: Configure a proper email service (SendGrid, AWS SES, etc.)
4. **Monitoring**: Set up error tracking and monitoring
5. **Backup**: Implement regular database backups

### 📞 Support

If you encounter issues during deployment:
1. Check the Vercel deployment logs
2. Review the function logs for detailed error messages
3. Ensure all environment variables are correctly set
4. Verify the build process completed successfully