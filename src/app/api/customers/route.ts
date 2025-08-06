import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  province: z.string().optional(),
  provinceName: z.string().optional(),
  ward: z.string().optional(),
  wardName: z.string().optional(),
  source: z.string().default('WEBSITE'),
  notes: z.string().optional(),
});

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = customerSchema.parse(body);

    // Check if customer already exists with same phone
    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: validatedData.phone }
    });

    if (existingCustomer) {
      return NextResponse.json({
        success: true,
        message: 'Khách hàng đã tồn tại',
        customer: existingCustomer
      });
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        province: validatedData.province || null,
        provinceName: validatedData.provinceName || null,
        ward: validatedData.ward || null,
        wardName: validatedData.wardName || null,
        source: validatedData.source,
        notes: validatedData.notes || null,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thông tin khách hàng đã được lưu thành công',
      customer
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get all customers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (source) {
      where.source = source;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 