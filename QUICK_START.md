# Quick Start: Deploy Ikigaivilla

## 🚀 Fast Deployment Guide

This guide will get your Ikigaivilla application deployed in under 10 minutes.

## Prerequisites
- [Vercel Account](https://vercel.com) (free)
- [PostgreSQL](https://www.postgresql.org/) (local or cloud)
- [GitHub Account](https://github.com)

## Step 1: Set Up Database (2 minutes)

### 1.1 Setup PostgreSQL Database
1. Install PostgreSQL locally or use a cloud service
2. Create a new database named `ikigaivilla`
3. Note the connection details for Step 2

### 1.2 Get Connection String
1. Use your PostgreSQL connection string
2. Format: `postgresql://username:password@localhost:5432/ikigaivilla`
3. Save it for Step 2

## Step 2: Prepare Environment (2 minutes)

### 2.1 Create Environment File
```bash
cp env.production.example .env.production
```

### 2.2 Fill in Environment Variables
Edit `.env.production` with your values:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/ikigaivilla"

# Generate secure secrets (run these commands)
JWT_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Your Vercel domain (update after deployment)
NEXTAUTH_URL="https://your-app.vercel.app"

# Cloudinary (sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail recommended)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Step 3: Deploy to Vercel (3 minutes)

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy
```bash
# Deploy to production
npm run deploy -- --prod

# Or use the script directly
./deploy-vercel.sh --prod
```

## Step 4: Set Up Database (2 minutes)

### 4.1 Run Migrations
```bash
npx prisma migrate deploy
```

### 4.2 Set Up Initial Data
```bash
npm run setup-db
```

## Step 5: Verify Deployment (1 minute)

### 5.1 Test Your Application
- Visit your Vercel URL
- Test admin panel: `/admin`
- Login with: `admin@ikigaivilla.vn` / `admin123`

### 5.2 Update Admin Password
1. Go to `/admin`
2. Login with default credentials
3. Change the admin password immediately

## 🎉 You're Done!

Your Ikigaivilla application is now live with:
- ✅ Frontend + API on Vercel
- ✅ PostgreSQL database
- ✅ Admin panel ready
- ✅ Sample data loaded

## Next Steps

1. **Customize Content**: Add your rooms, services, and team members
2. **Configure Domain**: Set up your custom domain in Vercel
3. **Add Analytics**: Set up Google Analytics
4. **Security**: Update all default passwords
5. **Backup**: Neon provides automatic backups

## Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if DATABASE_URL is correct
echo $DATABASE_URL
```

**Build Fails**
```bash
# Check environment variables
npm run build
```

**Admin Login Issues**
```bash
# Reset admin password
npm run setup-db
```

## Support

- 📚 [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- 🐛 [Troubleshooting](DEPLOYMENT_GUIDE.md#troubleshooting)
- 📧 Contact: Your support email

---

**Need help?** Check the full [Deployment Guide](DEPLOYMENT_GUIDE.md) for detailed instructions. 