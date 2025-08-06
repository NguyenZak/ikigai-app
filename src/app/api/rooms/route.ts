import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Get all active rooms for public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const rooms = await prisma.room.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        title: true,
        description: true,
        beds: true,
        area: true,
        price: true,
        floor: true,
        rooms: true,
        view: true,
        slug: true,
        features: true,
        images: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Parse JSON fields
    const roomsWithParsedData = rooms.map(room => ({
      ...room,
      features: room.features ? JSON.parse(room.features) : [],
      images: room.images ? JSON.parse(room.images) : []
    }));

    // Get total count for pagination
    const total = await prisma.room.count({
      where: { status: 'ACTIVE' }
    });

    return NextResponse.json({
      rooms: roomsWithParsedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 