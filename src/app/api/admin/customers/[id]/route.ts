import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
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

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
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

    console.log('Updating customer with data:', customerData);

    const customer = await prisma.customer.update({
      where: { id: customerId },
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

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id: customerId }
    });

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 