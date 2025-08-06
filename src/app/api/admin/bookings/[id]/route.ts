import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { z } from 'zod';

const bookingUpdateSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1).optional(),
  roomId: z.string().optional(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  numberOfGuests: z.number().min(1).optional(),
  roomPrice: z.number().min(0).optional(),
  totalAmount: z.number().min(0).optional(),
  specialRequests: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional()
});

// GET - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true
          }
        },
        bookingServices: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = bookingUpdateSchema.parse(body);

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.checkInDate) {
      updateData.checkInDate = new Date(validatedData.checkInDate);
    }
    if (validatedData.checkOutDate) {
      updateData.checkOutDate = new Date(validatedData.checkOutDate);
    }
    if (validatedData.roomId) {
      updateData.roomId = parseInt(validatedData.roomId);
    }
    updateData.updatedBy = user.id;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true
          }
        },
        bookingServices: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ booking });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        room: {
          select: {
            name: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Delete the booking (this will cascade delete bookingServices)
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: 'Booking deleted successfully',
      deletedBooking: booking.customerName
    });

      } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete booking error:', errorMessage);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 