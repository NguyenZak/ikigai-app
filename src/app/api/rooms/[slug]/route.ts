import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

// GET - Get room by ID for public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const room = await prisma.room.findUnique({
      where: { 
        slug,
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
        features: true,
        images: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Parse JSON fields with robust error handling
    const parseJsonField = (field: string | null) => {
      if (!field) return [];
      
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('JSON parse error for field:', field, error);
        // Fallback to comma-separated string
        return field.split(',').map(item => item.trim()).filter(item => item !== '');
      }
    };

    const roomWithParsedData = {
      ...room,
      features: parseJsonField(room.features),
      images: parseJsonField(room.images)
    };

    return NextResponse.json({ room: roomWithParsedData });

  } catch (error) {
    console.error('Get room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 