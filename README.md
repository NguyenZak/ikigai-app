# Ikigaivilla - Luxury Villa Management System

A modern, full-stack web application for managing luxury villa bookings, built with Next.js, Prisma, and PostgreSQL.

## 🚀 Quick Deployment

**Deploy in under 10 minutes:**

Note
```bash
# 1. Set up environment
cp env.production.example .env.production
# Edit .env.production with your values

# 2. Deploy to Vercel
npm run deploy -- --prod

# 3. Set up database
npx prisma migrate deploy
npm run setup-db
```

📖 **[Quick Start Guide](QUICK_START.md)** | 📚 **[Full Deployment Guide](DEPLOYMENT_GUIDE.md)**

## 🏗️ Architecture

- **Frontend + API**: Next.js 14 with App Router
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + NextAuth
- **File Upload**: Cloudinary
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## ✨ Features

### Public Features
- 🏠 **Room Showcase**: Beautiful room galleries with detailed information
- 📰 **News/Blog**: Content management for updates and announcements
- 👥 **Team Section**: Staff profiles and information
- 🏞️ **Service Zones**: Different areas and amenities
- 📞 **Contact Forms**: Customer inquiry management
- 📱 **Responsive Design**: Mobile-first approach

### Admin Features
- 🔐 **Secure Admin Panel**: Role-based access control
- 📊 **Analytics Dashboard**: Booking and customer insights
- 🏠 **Room Management**: CRUD operations for rooms
- 📰 **Content Management**: News, banners, team members
- 📅 **Booking Management**: Customer booking system
- 👥 **Customer Management**: Lead tracking and follow-up
- 🖼️ **Media Management**: Image upload and organization

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Swiper**: Touch slider for galleries
- **Chart.js**: Analytics and reporting

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Reliable database
- **JWT**: Stateless authentication
- **bcryptjs**: Password hashing

### External Services
- **Cloudinary**: Image upload and optimization
- **Nodemailer**: Email functionality
- **Vercel**: Hosting and deployment
- **PostgreSQL**: Database

## 📁 Project Structure

```
ikigaivilla-user/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   └── ...                # Public pages
│   ├── components/            # Reusable components
│   └── lib/                   # Utilities and configurations
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
├── scripts/                   # Database setup and seeding
└── deploy-vercel.sh          # Deployment automation
```

## 🚀 Deployment

### Prerequisites
- [Vercel Account](https://vercel.com)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary Account](https://cloudinary.com)

### Quick Deploy
1. **Set up database**: Install PostgreSQL locally or use cloud service
2. **Configure environment**: Copy and edit `.env.production`
3. **Deploy**: Run `npm run deploy -- --prod`
4. **Set up data**: Run `npm run setup-db`

### Manual Deploy
```bash
# Install dependencies
npm install

# Set up environment
cp env.production.example .env.production
# Edit .env.production

# Deploy to Vercel
vercel --prod

# Run database migrations
npx prisma migrate deploy

# Set up initial data
npm run setup-db
```

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone <repository-url>
cd ikigaivilla-user

# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run setup-db     # Set up database with initial data
npm run deploy       # Deploy to Vercel
```

## 🔐 Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 📊 Database Schema

### Core Models
- **Users**: Admin and staff accounts
- **Rooms**: Villa accommodations
- **Bookings**: Customer reservations
- **Customers**: Lead management
- **News**: Content management
- **Team Members**: Staff profiles
- **Service Zones**: Amenity areas
- **Banners**: Homepage sliders

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive tablet layouts
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Optimized for touch interactions

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional aesthetic
- **Smooth Animations**: CSS transitions and animations
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages
- **Accessibility**: WCAG compliance considerations

## 📈 Performance

- **Next.js Optimization**: Built-in performance features
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Caching**: Strategic caching implementation
- **Database Indexing**: Optimized database queries

## 🛡️ Monitoring

- **Health Checks**: `/api/health` endpoint
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: Vercel analytics
- **Database Monitoring**: PostgreSQL logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📚 [Deployment Guide](DEPLOYMENT_GUIDE.md)
- 🚀 [Quick Start](QUICK_START.md)
- 🐛 [Troubleshooting](DEPLOYMENT_GUIDE.md#troubleshooting)

## 🔄 Updates

### Recent Updates
- ✅ Vercel deployment automation
- ✅ PostgreSQL database integration
- ✅ Comprehensive documentation
- ✅ Security improvements
- ✅ Performance optimizations

### Roadmap
- 🔄 Multi-language support
- 🔄 Advanced analytics
- 🔄 Mobile app
- 🔄 Payment integration
- 🔄 Advanced booking system

---

**Built with ❤️ for luxury villa management**
