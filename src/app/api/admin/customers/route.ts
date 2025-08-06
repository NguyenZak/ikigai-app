import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const processingStatus = searchParams.get('processingStatus');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log('API Request params:', { search, status, processingStatus, assignedTo, page, limit });

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (processingStatus) where.processingStatus = processingStatus;
    if (assignedTo) where.assignedTo = parseInt(assignedTo);
    
    // Add search functionality
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { email: { contains: search.trim() } },
        { phone: { contains: search.trim() } },
        { provinceName: { contains: search.trim() } },
        { wardName: { contains: search.trim() } }
      ];
    }

    console.log('Prisma where clause:', JSON.stringify(where, null, 2));

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({ where })
    ]);

    console.log('Query results:', { 
      customersCount: customers.length, 
      total, 
      page, 
      limit 
    });

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received customer data:', body);
    
    const {
      name,
      phone,
      email,
      province,
      provinceName,
      ward,
      wardName,
      source,
      status,
      processingStatus,
      notes,
      assignedTo,
      lastContactDate,
      nextFollowUpDate
    } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Prepare data with proper defaults
    const customerData = {
      name,
      phone,
      email: email || null,
      province: province || null,
      provinceName: provinceName || null,
      ward: ward || null,
      wardName: wardName || null,
      source: source || 'WEBSITE',
      status: status || 'NEW',
      processingStatus: processingStatus || 'PENDING',
      notes: notes || null,
      assignedTo: assignedTo && assignedTo !== '' ? parseInt(assignedTo) : null,
      lastContactDate: lastContactDate ? new Date(lastContactDate) : null,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null
    };

    console.log('Creating customer with data:', customerData);

    const customer = await prisma.customer.create({
      data: customerData,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Customer created successfully:', customer.id);
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 