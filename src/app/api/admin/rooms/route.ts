import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { z } from 'zod';
import { generateVietnameseSlug } from '@/lib/vietnamese-utils';

const roomSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  beds: z.string().min(1),
  area: z.string().min(1),
  price: z.string().min(1),
  floor: z.string().min(1),
  rooms: z.string().min(1),
  view: z.string().min(1),
  features: z.array(z.string()),
  images: z.array(z.string()),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});



// GET - Get all rooms
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ rooms });

  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new room
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

    const body = await request.json();
    const validatedData = roomSchema.parse(body);

    const room = await prisma.room.create({
      data: {
        ...validatedData,
        slug: generateVietnameseSlug(validatedData.name),
        features: JSON.stringify(validatedData.features),
        images: JSON.stringify(validatedData.images)
      }
    });

    return NextResponse.json({ room }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 