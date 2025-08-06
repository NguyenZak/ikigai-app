#!/bin/bash

# Deploy script for cPanel
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Create deployment package
echo "📋 Creating deployment package..."
rm -rf deploy-package
mkdir deploy-package

# Copy necessary files
cp -r .next deploy-package/
cp -r public deploy-package/
cp -r prisma deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/
cp next.config.ts deploy-package/
cp .env.local deploy-package/.env 2>/dev/null || echo "No .env.local found"

# Create start script
cat > deploy-package/start.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
npm install --production
npx prisma generate
npx prisma migrate deploy
npm start
EOF

chmod +x deploy-package/start.sh

# Create .htaccess for cPanel
cat > deploy-package/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
EOF

echo "✅ Deployment package created successfully!"
echo "📁 Package location: ./deploy-package/"
echo ""
echo "📋 Next steps:"
echo "1. Upload deploy-package/ to your cPanel public_html directory"
echo "2. SSH into your server and run: cd public_html && chmod +x start.sh && ./start.sh"
echo "3. Set up your domain to point to the application" 