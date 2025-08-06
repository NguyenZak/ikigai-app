#!/bin/bash

# Ikigaivilla Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Ikigaivilla deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "You are not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production file not found. Please create it from env.production.example"
    echo "cp env.production.example .env.production"
    echo "Then edit .env.production with your actual values"
    exit 1
fi

# Check if all required environment variables are set
print_status "Checking environment variables..."

required_vars=(
    "DATABASE_URL"
    "JWT_SECRET"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "CLOUDINARY_CLOUD_NAME"
    "CLOUDINARY_API_KEY"
    "CLOUDINARY_API_SECRET"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USER"
    "SMTP_PASS"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.production; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables in .env.production:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_status "All required environment variables are set"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Build the application
print_status "Building the application..."
npm run build

# Deploy to Vercel
print_status "Deploying to Vercel..."

# Check if this is a production deployment
if [ "$1" = "--prod" ]; then
    print_status "Deploying to production..."
    vercel --prod
else
    print_status "Deploying to preview..."
    vercel
fi

print_status "Deployment completed successfully! 🎉"

# Post-deployment instructions
echo ""
echo "📋 Post-deployment checklist:"
echo "1. Test your application at the provided URL"
echo "2. Verify database connection"
echo "3. Test admin panel functionality"
echo "4. Check all API endpoints"
echo "5. Test image uploads"
echo "6. Verify email functionality"
echo ""
echo "🔧 If you need to run database migrations:"
echo "npx prisma migrate deploy"
echo ""
echo "🌱 If you need to seed the database:"
echo "npm run seed" 