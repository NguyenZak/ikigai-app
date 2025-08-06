# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] Setup PostgreSQL database
- [ ] Copied `env.production.example` to `.env.production`
- [ ] Filled in all required environment variables
- [ ] Generated secure JWT and NextAuth secrets
- [ ] Set up Cloudinary account and credentials
- [ ] Configured email settings (SMTP)

### Code Preparation
- [ ] All environment variables are set
- [ ] Database schema is up to date
- [ ] No sensitive data in code
- [ ] All dependencies are installed
- [ ] Build passes locally (`npm run build`)

### Vercel Setup
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged in to Vercel (`vercel login`)
- [ ] Project ready for deployment

## 🚀 Deployment Steps

### Step 1: Database Setup
- [ ] Setup PostgreSQL database
- [ ] Copy connection string
- [ ] Update `DATABASE_URL` in `.env.production`

### Step 2: Environment Configuration
- [ ] Generate secure secrets:
  ```bash
  JWT_SECRET="$(openssl rand -base64 32)"
  NEXTAUTH_SECRET="$(openssl rand -base64 32)"
  ```
- [ ] Set `NEXTAUTH_URL` to your Vercel domain
- [ ] Configure Cloudinary credentials
- [ ] Set up email configuration

### Step 3: Deploy to Vercel
- [ ] Run deployment script: `npm run deploy -- --prod`
- [ ] Verify deployment success
- [ ] Copy Vercel URL

### Step 4: Database Migration
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify database connection
- [ ] Set up initial data: `npm run setup-db`

## ✅ Post-Deployment Verification

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] Images and assets load
- [ ] Responsive design works
- [ ] No console errors

### API Endpoints
- [ ] Health check: `/api/health`
- [ ] Rooms API: `/api/rooms`
- [ ] News API: `/api/news`
- [ ] Contact form: `/api/contact`
- [ ] Admin APIs work

### Admin Panel
- [ ] Admin login works: `/admin`
- [ ] Dashboard loads
- [ ] Can create/edit rooms
- [ ] Can manage content
- [ ] Image upload works
- [ ] User management works

### Database
- [ ] Database connection successful
- [ ] Tables created correctly
- [ ] Sample data loaded
- [ ] Admin user created
- [ ] Can perform CRUD operations

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] Admin password changed
- [ ] No sensitive data exposed
- [ ] CORS configured properly

## 🔧 Configuration

### Environment Variables Checklist
- [ ] `DATABASE_URL` (PostgreSQL)
- [ ] `JWT_SECRET` (32+ characters)
- [ ] `NEXTAUTH_SECRET` (32+ characters)
- [ ] `NEXTAUTH_URL` (Vercel domain)
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `GOOGLE_ANALYTICS_ID` (optional)

### Vercel Configuration
- [ ] Environment variables set in Vercel dashboard
- [ ] Build command: `prisma generate && prisma migrate deploy && next build`
- [ ] Install command: `npm install`
- [ ] Output directory: `.next`
- [ ] Node.js version: 18+

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- [ ] Check `DATABASE_URL` format
- [ ] Verify PostgreSQL database is active
- [ ] Ensure SSL mode is `require`
- [ ] Test connection locally

**Build Failures**
- [ ] Check all environment variables
- [ ] Verify Prisma schema
- [ ] Check for TypeScript errors
- [ ] Review build logs

**Admin Login Issues**
- [ ] Verify admin user exists
- [ ] Check JWT configuration
- [ ] Test with default credentials
- [ ] Reset admin password if needed

**Image Upload Issues**
- [ ] Verify Cloudinary credentials
- [ ] Check file size limits
- [ ] Ensure proper CORS settings
- [ ] Test upload functionality

## 📊 Performance Monitoring

### Vercel Analytics
- [ ] Enable Vercel Analytics
- [ ] Monitor page views
- [ ] Track performance metrics
- [ ] Set up alerts

### Database Monitoring
- [ ] Monitor PostgreSQL logs
- [ ] Check connection usage
- [ ] Review query performance
- [ ] Set up alerts

### Error Tracking
- [ ] Monitor Vercel function logs
- [ ] Check for 500 errors
- [ ] Review client-side errors
- [ ] Set up error notifications

## 🔒 Security Checklist

### Environment Security
- [ ] No secrets in code
- [ ] Environment variables encrypted
- [ ] Secrets rotated regularly
- [ ] Access logs monitored

### Application Security
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Input validation active
- [ ] Rate limiting enabled
- [ ] SQL injection protected

### Database Security
- [ ] SSL connections required
- [ ] Connection pooling enabled
- [ ] Regular backups active
- [ ] Access logs monitored

## 📈 Optimization

### Performance
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Caching configured
- [ ] Database indexed
- [ ] CDN enabled

### SEO
- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt set
- [ ] Open Graph tags
- [ ] Schema markup

## 🎯 Final Steps

### Documentation
- [ ] Update README with live URL
- [ ] Document deployment process
- [ ] Create maintenance guide
- [ ] Set up monitoring alerts

### Training
- [ ] Admin user trained
- [ ] Content management explained
- [ ] Backup procedures documented
- [ ] Emergency contacts listed

### Launch
- [ ] Test all features
- [ ] Verify mobile experience
- [ ] Check loading speeds
- [ ] Confirm email functionality
- [ ] Validate contact forms

## 🆘 Emergency Procedures

### Rollback Plan
- [ ] Previous deployment available
- [ ] Database backup ready
- [ ] Environment variables backed up
- [ ] Contact information available

### Support Contacts
- [ ] Vercel support
- [ ] PostgreSQL support
- [ ] Cloudinary support
- [ ] Development team

---

**✅ Deployment Complete!**

Your Ikigaivilla application is now live and ready for users. 