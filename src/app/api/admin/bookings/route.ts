import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Tên khách hàng là bắt buộc'),
  customerEmail: z.string().email('Email không hợp lệ'),
  customerPhone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  roomId: z.string().min(1, 'Phòng là bắt buộc'),
  checkInDate: z.string().min(1, 'Ngày check-in là bắt buộc'),
  checkOutDate: z.string().min(1, 'Ngày check-out là bắt buộc'),
  numberOfGuests: z.number().min(1, 'Số khách phải lớn hơn 0'),
  roomPrice: z.number().min(0, 'Giá phòng không được âm'),
  totalAmount: z.number().min(0, 'Tổng tiền không được âm'),
  specialRequests: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING')
});

// POST - Create new booking
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
    const validatedData = bookingSchema.parse(body);

    // Check if room exists and is active
    const room = await prisma.room.findUnique({
      where: { id: parseInt(validatedData.roomId), status: 'ACTIVE' }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Phòng không tồn tại hoặc không khả dụng' },
        { status: 404 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId: parseInt(validatedData.roomId),
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { checkInDate: { lte: new Date(validatedData.checkInDate) } },
              { checkOutDate: { gt: new Date(validatedData.checkInDate) } }
            ]
          },
          {
            AND: [
              { checkInDate: { lt: new Date(validatedData.checkOutDate) } },
              { checkOutDate: { gte: new Date(validatedData.checkOutDate) } }
            ]
          },
          {
            AND: [
              { checkInDate: { gte: new Date(validatedData.checkInDate) } },
              { checkOutDate: { lte: new Date(validatedData.checkOutDate) } }
            ]
          }
        ]
      }
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: 'Phòng đã được đặt trong khoảng thời gian này' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        roomId: parseInt(validatedData.roomId),
        checkInDate: new Date(validatedData.checkInDate),
        checkOutDate: new Date(validatedData.checkOutDate),
        numberOfGuests: validatedData.numberOfGuests,
        roomPrice: validatedData.roomPrice,
        totalAmount: validatedData.totalAmount,
        specialRequests: validatedData.specialRequests,
        status: validatedData.status,
        createdBy: user.id,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đặt phòng thành công',
      booking
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get all bookings (admin only)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          room: {
            select: {
              id: true,
              name: true,
              title: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where })
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 