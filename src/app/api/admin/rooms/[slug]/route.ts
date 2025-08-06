import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { z } from 'zod';

const roomUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  beds: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  floor: z.string().min(1).optional(),
  rooms: z.string().min(1).optional(),
  view: z.string().min(1).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

// GET - Get room by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prisma.room.findUnique({
      where: { slug }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ room });

  } catch (error) {
    console.error('Get room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = roomUpdateSchema.parse(body);

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.features) {
      updateData.features = JSON.stringify(validatedData.features);
    }
    if (validatedData.images) {
      updateData.images = JSON.stringify(validatedData.images);
    }

    const room = await prisma.room.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({ room });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // First, check if room exists
    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        bookings: true
      }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Check if room has bookings
    if (room.bookings.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete room with existing bookings',
        bookingsCount: room.bookings.length
      }, { status: 400 });
    }

    // Delete the room
    await prisma.room.delete({
      where: { slug }
    });

    return NextResponse.json({ 
      message: 'Room deleted successfully',
      deletedRoom: room.name
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete room error:', errorMessage);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Cannot delete room with related data. Please remove all bookings first.' },
          { status: 400 }
        );
      }
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
} 