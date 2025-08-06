#!/usr/bin/env node

/**
 * Database Setup Script for Ikigaivilla
 * This script helps set up the database with initial data
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database setup...');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Create admin user if it doesn't exist
    console.log('👤 Setting up admin user...');
    const adminEmail = 'admin@ikigaivilla.vn';
    const adminPassword = 'admin123'; // Change this in production!
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin user created');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample rooms
    console.log('🏠 Creating sample rooms...');
    const sampleRooms = [
      {
        name: 'Deluxe Room',
        title: 'Deluxe Room with Mountain View',
        description: 'Spacious room with stunning mountain views and modern amenities.',
        beds: '1 King Bed',
        area: '45m²',
        price: '2,500,000 VND',
        floor: '2nd Floor',
        rooms: '1 Bedroom',
        view: 'Mountain View',
        slug: 'deluxe-room',
        features: JSON.stringify(['Free WiFi', 'Mountain View', 'Balcony', 'Air Conditioning']),
        images: JSON.stringify(['/images/rooms/deluxe-1.jpg', '/images/rooms/deluxe-2.jpg']),
        status: 'ACTIVE'
      },
      {
        name: 'Suite Room',
        title: 'Luxury Suite with Private Balcony',
        description: 'Premium suite featuring a private balcony and panoramic views.',
        beds: '1 King Bed + 1 Sofa Bed',
        area: '65m²',
        price: '3,500,000 VND',
        floor: '3rd Floor',
        rooms: '1 Bedroom + Living Room',
        view: 'Panoramic View',
        slug: 'suite-room',
        features: JSON.stringify(['Free WiFi', 'Private Balcony', 'Living Room', 'Mountain View']),
        images: JSON.stringify(['/images/rooms/suite-1.jpg', '/images/rooms/suite-2.jpg']),
        status: 'ACTIVE'
      }
    ];

    for (const room of sampleRooms) {
      const existingRoom = await prisma.room.findUnique({
        where: { slug: room.slug }
      });

      if (!existingRoom) {
        await prisma.room.create({ data: room });
        console.log(`✅ Created room: ${room.name}`);
      } else {
        console.log(`ℹ️  Room already exists: ${room.name}`);
      }
    }

    // Create sample service zones
    console.log('🏞️ Creating sample service zones...');
    const sampleZones = [
      {
        zoneId: 'onsen',
        name: 'Onsen Area',
        title: 'Traditional Japanese Onsen',
        description: 'Experience authentic Japanese hot springs with natural mineral water.',
        images: JSON.stringify(['/images/zones/onsen-1.jpg', '/images/zones/onsen-2.jpg']),
        features: JSON.stringify(['Natural Hot Springs', 'Private Baths', 'Relaxation Area']),
        order: 1,
        active: true
      },
      {
        zoneId: 'lobby-library',
        name: 'Lobby & Library',
        title: 'Cozy Lobby with Library',
        description: 'Comfortable lobby area with a curated collection of books.',
        images: JSON.stringify(['/images/zones/lobby-1.jpg', '/images/zones/library-1.jpg']),
        features: JSON.stringify(['Reading Area', 'Comfortable Seating', 'Book Collection']),
        order: 2,
        active: true
      }
    ];

    for (const zone of sampleZones) {
      const existingZone = await prisma.serviceZone.findUnique({
        where: { zoneId: zone.zoneId }
      });

      if (!existingZone) {
        await prisma.serviceZone.create({ data: zone });
        console.log(`✅ Created service zone: ${zone.name}`);
      } else {
        console.log(`ℹ️  Service zone already exists: ${zone.name}`);
      }
    }

    // Create sample team members
    console.log('👥 Creating sample team members...');
    const sampleTeam = [
      {
        name: 'Nguyen Van A',
        title: 'General Manager',
        img: '/images/team/member-1.jpg'
      },
      {
        name: 'Tran Thi B',
        title: 'Guest Relations Manager',
        img: '/images/team/member-2.jpg'
      }
    ];

    for (const member of sampleTeam) {
      const existingMember = await prisma.teamMember.findFirst({
        where: { name: member.name }
      });

      if (!existingMember) {
        await prisma.teamMember.create({ data: member });
        console.log(`✅ Created team member: ${member.name}`);
      } else {
        console.log(`ℹ️  Team member already exists: ${member.name}`);
      }
    }

    // Create sample banners
    console.log('🖼️ Creating sample banners...');
    const sampleBanners = [
      {
        title: 'Welcome to Ikigaivilla',
        subtitle: 'Experience luxury in the heart of nature',
        image: '/images/banners/banner-1.jpg',
        overlay: 'bg-black bg-opacity-40',
        order: 1,
        active: true
      },
      {
        title: 'Mountain Retreat',
        subtitle: 'Escape to tranquility',
        image: '/images/banners/banner-2.jpg',
        overlay: 'bg-black bg-opacity-30',
        order: 2,
        active: true
      }
    ];

    for (const banner of sampleBanners) {
      const existingBanner = await prisma.banner.findFirst({
        where: { title: banner.title }
      });

      if (!existingBanner) {
        await prisma.banner.create({ data: banner });
        console.log(`✅ Created banner: ${banner.title}`);
      } else {
        console.log(`ℹ️  Banner already exists: ${banner.title}`);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Access your admin panel at /admin');
    console.log('2. Login with the admin credentials provided above');
    console.log('3. Update the admin password');
    console.log('4. Add your actual content (rooms, services, etc.)');
    console.log('5. Configure your domain and settings');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 