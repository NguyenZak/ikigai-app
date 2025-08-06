# Deployment Guide: Ikigaivilla

## Overview
This guide will help you deploy your Ikigaivilla Next.js application with:
- **Frontend + API routes**: Deployed on Vercel
- **Database (PostgreSQL)**: Local or cloud deployment
- **Prisma ORM**: For database management

## Prerequisites
- [Vercel Account](https://vercel.com)
- [PostgreSQL](https://www.postgresql.org/)
- [GitHub Account](https://github.com)
- Node.js 18+ installed locally

## Step 1: Database Setup (PostgreSQL)

### 1.1 Setup PostgreSQL Database
1. Install PostgreSQL locally or use a cloud service
2. Create a new database named `ikigaivilla`
3. Note the connection details for configuration

### 1.2 Get Database Connection String
1. Use your PostgreSQL connection string
2. Format: `postgresql://username:password@localhost:5432/ikigaivilla`
3. Save this for later use

### 1.3 Set Up Database Schema
1. Connect to your PostgreSQL database
2. Create the database if it doesn't exist:

```sql
-- Create database if not exists
CREATE DATABASE ikigaivilla;
```

## Step 2: Environment Variables Setup

### 2.1 Create Production Environment File
Create a `.env.production` file in your project root:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/ikigaivilla"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Next.js
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"

# Optional: Analytics
GOOGLE_ANALYTICS_ID="your-ga-id"
```

## Step 3: Vercel Deployment

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### 3.4 Configure Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add all the environment variables from your `.env.production` file

### 3.5 Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your DNS settings as instructed

## Step 4: Database Migration

### 4.1 Run Prisma Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Push schema (if needed)
npx prisma db push
```

### 4.2 Seed Database (Optional)
```bash
# Run seed script
npm run seed
```

## Step 5: Post-Deployment Verification

### 5.1 Test API Endpoints
Test your API routes:
- `https://your-domain.vercel.app/api/health`
- `https://your-domain.vercel.app/api/rooms`
- `https://your-domain.vercel.app/api/news`

### 5.2 Test Admin Panel
- Visit `https://your-domain.vercel.app/admin`
- Test login functionality
- Verify all admin features work

### 5.3 Test Frontend
- Test all pages load correctly
- Verify images and assets load
- Test contact forms
- Test booking functionality

## Step 6: Monitoring and Maintenance

### 6.1 Set Up Monitoring
1. **Vercel Analytics**: Enable in Vercel dashboard
2. **Error Tracking**: Consider adding Sentry
3. **Database Monitoring**: Use Neon's built-in monitoring

### 6.2 Regular Maintenance
1. **Database Backups**: Neon provides automatic backups
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor Vercel analytics

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if Neon database is active
- Ensure SSL mode is set to `require`

#### 2. Build Failures
- Check if all environment variables are set in Vercel
- Verify Prisma client is generated
- Check for TypeScript errors

#### 3. API Route Issues
- Verify API routes are in `src/app/api/` directory
- Check function timeout settings in `vercel.json`
- Ensure proper error handling

#### 4. Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper CORS settings

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to Git
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### 2. Database Security
- Use connection pooling
- Enable SSL for database connections
- Regular security updates

### 3. API Security
- Implement rate limiting
- Use proper authentication
- Validate all inputs

## Performance Optimization

### 1. Vercel Optimizations
- Enable Edge Functions where appropriate
- Use Image Optimization
- Implement proper caching strategies

### 2. Database Optimizations
- Use database indexes
- Implement connection pooling
- Monitor query performance

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Emergency Procedures

### Database Recovery
1. Use Neon's point-in-time recovery
2. Restore from automated backups
3. Contact Neon support if needed

### Application Rollback
1. Use Vercel's deployment history
2. Rollback to previous deployment
3. Check deployment logs for issues 