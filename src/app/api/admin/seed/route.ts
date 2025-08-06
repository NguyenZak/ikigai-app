import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Clear existing data
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.news.deleteMany();
    await prisma.service.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.siteSetting.deleteMany();

    // Create rooms
    const room1 = await prisma.room.upsert({
      where: { slug: 'ikigai-hoa-hong' },
      create: {
        name: 'IKIGAI HOA HỒNG',
        title: 'Phòng Hoa Hồng',
        description: 'Phòng sang trọng với view tuyệt đẹp, trang thiết bị hiện đại',
        beds: '1 giường đôi',
        area: '35m²',
        price: '1200000',
        floor: 'Tầng 2',
        rooms: '1 phòng ngủ, 1 phòng tắm',
        view: 'View núi',
        features: JSON.stringify(['WiFi', 'TV', 'Điều hòa', 'Mini bar', 'Bồn tắm']),
        images: JSON.stringify(['/uploads/rooms/room1-1.jpg', '/uploads/rooms/room1-2.jpg']),
        status: 'ACTIVE',
        slug: 'ikigai-hoa-hong'
      },
      update: {}
    });

    const room2 = await prisma.room.upsert({
      where: { slug: 'ikigai-hoa-dao' },
      create: {
        name: 'IKIGAI HOA ĐÀO (PHÒNG C)',
        title: 'Phòng Hoa Đào',
        description: 'Phòng cao cấp với không gian rộng rãi, tiện nghi đầy đủ',
        beds: '2 giường đơn',
        area: '40m²',
        price: '1500000',
        floor: 'Tầng 3',
        rooms: '1 phòng ngủ, 1 phòng tắm',
        view: 'View biển',
        features: JSON.stringify(['WiFi', 'TV', 'Điều hòa', 'Mini bar', 'Bồn tắm', 'Ban công']),
        images: JSON.stringify(['/uploads/rooms/room2-1.jpg', '/uploads/rooms/room2-2.jpg']),
        status: 'ACTIVE',
        slug: 'ikigai-hoa-dao'
      },
      update: {}
    });

    // Create services
    const service1 = await prisma.service.create({
      data: {
        name: 'Dịch vụ Spa',
        description: 'Dịch vụ spa cao cấp với các liệu trình thư giãn',
        price: '500000',
        category: 'WELLNESS',
        images: JSON.stringify(['/uploads/services/spa1.jpg', '/uploads/services/spa2.jpg']),
        status: 'ACTIVE'
      }
    });

    const service2 = await prisma.service.create({
      data: {
        name: 'Dịch vụ Ăn uống',
        description: 'Dịch vụ ăn uống với menu đa dạng, chất lượng cao',
        price: '300000',
        category: 'DINING',
        images: JSON.stringify(['/uploads/services/dining1.jpg', '/uploads/services/dining2.jpg']),
        status: 'ACTIVE'
      }
    });

    // Create team members
    const member1 = await prisma.teamMember.create({
      data: {
        name: 'Nguyễn Văn A',
        title: 'Quản lý',
        img: '/uploads/team/member1.jpg'
      }
    });

    const member2 = await prisma.teamMember.create({
      data: {
        name: 'Trần Thị B',
        title: 'Nhân viên lễ tân',
        img: '/uploads/team/member2.jpg'
      }
    });

    // Create news
    const news1 = await prisma.news.create({
      data: {
        title: 'Chào mừng đến với Ikigai Villa',
        content: 'Ikigai Villa chào đón quý khách với những trải nghiệm tuyệt vời...',
        excerpt: 'Khám phá Ikigai Villa - nơi nghỉ dưỡng lý tưởng',
        slug: 'chao-mung-den-voi-ikigai-villa',
        metaTitle: 'Chào mừng đến với Ikigai Villa',
        metaDescription: 'Khám phá Ikigai Villa - nơi nghỉ dưỡng lý tưởng',
        keywords: 'ikigai, villa, nghỉ dưỡng',
        featuredImage: '/uploads/news/news1.jpg',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: user.id
      }
    });

    // Create site settings
    await prisma.siteSetting.create({
      data: {
        key: 'site_name',
        value: 'Ikigai Villa'
      }
    });

    await prisma.siteSetting.create({
      data: {
        key: 'site_description',
        value: 'Nơi nghỉ dưỡng lý tưởng cho mọi người'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        rooms: [room1, room2],
        services: [service1, service2],
        teamMembers: [member1, member2],
        news: [news1]
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 