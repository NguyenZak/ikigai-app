#!/bin/bash

# Deploy script for Ikigaivilla
# Usage: ./scripts/deploy.sh [platform]

set -e

PLATFORM=${1:-"local"}

echo "🚀 Deploying to $PLATFORM..."

case $PLATFORM in
  "local")
    echo "📦 Building for local deployment..."
    npm run build
    echo "✅ Build completed!"
    echo "🌐 Starting server..."
    npm start
    ;;
    
  "docker")
    echo "🐳 Building Docker image..."
    docker build -t ikigaivilla .
    echo "✅ Docker image built!"
    echo "🚀 Starting with Docker Compose..."
    docker-compose up -d
    ;;
    
  "vercel")
    echo "📦 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
      exit 1
    fi
    vercel --prod
    ;;
    
  "railway")
    echo "🚂 Deploying to Railway..."
    if ! command -v railway &> /dev/null; then
      echo "❌ Railway CLI not found. Install with: npm i -g @railway/cli"
      exit 1
    fi
    railway up
    ;;
    
  "render")
    echo "🎨 Deploying to Render..."
    echo "Please deploy manually through Render dashboard"
    echo "1. Connect your GitHub repository"
    echo "2. Set build command: npm run build"
    echo "3. Set start command: npm start"
    echo "4. Add environment variables from env.example"
    ;;
    
  "heroku")
    echo "🦸 Deploying to Heroku..."
    if ! command -v heroku &> /dev/null; then
      echo "❌ Heroku CLI not found. Install from: https://devcenter.heroku.com/articles/heroku-cli"
      exit 1
    fi
    heroku create ikigaivilla-app
    heroku config:set NODE_ENV=production
    git push heroku main
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: local, docker, vercel, railway, render, heroku"
    exit 1
    ;;
esac

echo "✅ Deployment completed!" 