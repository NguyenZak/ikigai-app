#!/bin/bash

# Heroku Deployment Script for Ikigai App
echo "🚀 Starting Heroku deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Please login to Heroku first:"
    echo "   heroku login"
    exit 1
fi

# Get app name from user
read -p "Enter your Heroku app name: " APP_NAME

# Create app if it doesn't exist
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "📦 Creating new Heroku app: $APP_NAME"
    heroku create $APP_NAME
else
    echo "✅ App $APP_NAME already exists"
fi

# Add PostgreSQL addon
echo "🗄️ Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini --app $APP_NAME

# Set buildpacks
echo "🔧 Setting up buildpacks..."
heroku buildpacks:set heroku/nodejs --app $APP_NAME

# Set environment variables
echo "🔐 Setting up environment variables..."
echo "Please set the following environment variables in Heroku:"
echo "1. DATABASE_URL (will be set automatically by PostgreSQL addon)"
echo "2. NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "3. NEXTAUTH_URL (https://$APP_NAME.herokuapp.com)"
echo "4. Other variables from your .env file"

# Deploy to Heroku
echo "📤 Deploying to Heroku..."
git push heroku main

# Run database migrations
echo "🗃️ Running database migrations..."
heroku run npm run db:migrate --app $APP_NAME

# Open the app
echo "🌐 Opening your app..."
heroku open --app $APP_NAME

echo "✅ Deployment completed!"
echo "🔗 Your app is available at: https://$APP_NAME.herokuapp.com"
echo "📊 View logs with: heroku logs --tail --app $APP_NAME" 