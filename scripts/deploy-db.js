#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting database deployment...');

try {
  // Check if DATABASE_URL is set
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🔄 Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log('✅ Database deployment completed successfully!');
  
  // Optional: Check if we should seed the database
  if (process.argv.includes('--seed')) {
    console.log('🌱 Seeding database...');
    execSync('npm run seed', { stdio: 'inherit' });
    console.log('✅ Database seeding completed!');
  }

} catch (error) {
  console.error('❌ Database deployment failed:', error.message);
  process.exit(1);
} 