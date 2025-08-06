#!/bin/bash

# Deploy script for ikigaivilla.vn custom domain
# This script handles deployment to Vercel with custom domain configuration

echo "🚀 Starting deployment for ikigaivilla.vn..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Add custom domain
echo "🌐 Adding custom domain ikigaivilla.vn..."
vercel domains add ikigaivilla.vn

# Add www subdomain
echo "🌐 Adding www subdomain..."
vercel domains add www.ikigaivilla.vn

# Update environment variables
echo "⚙️ Updating environment variables..."
vercel env add NEXTAUTH_URL production
echo "https://ikigaivilla.vn" | vercel env add NEXTAUTH_URL production

# Deploy again to ensure all changes are applied
echo "🔄 Redeploying with updated configuration..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your site should be available at:"
echo "   - https://ikigaivilla.vn"
echo "   - https://www.ikigaivilla.vn"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS records as per DNS_SETUP.md"
echo "2. Update all environment variables in Vercel dashboard"
echo "3. Test the site functionality"
echo "4. Set up monitoring and analytics" 