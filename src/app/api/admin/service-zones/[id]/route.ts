import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '../../../../../lib/db';
import { verifyAuth } from '../../../../../lib/auth';

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

    const zoneId = parseInt(id);
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const serviceZone = await prisma.serviceZone.findUnique({
      where: { id: zoneId }
    });

    if (!serviceZone) {
      return NextResponse.json({ error: 'Service zone not found' }, { status: 404 });
    }

    return NextResponse.json({ serviceZone });
  } catch (error) {
    console.error('Error fetching service zone:', error);
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

    const zoneId = parseInt(id);
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { zoneId: newZoneId, name, title, description, images, features, order, active } = body;

    // Validate required fields
    if (!newZoneId || !name || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if zoneId already exists for other zones
    const existingZone = await prisma.serviceZone.findFirst({
      where: {
        zoneId: newZoneId,
        id: { not: zoneId }
      }
    });

    if (existingZone) {
      return NextResponse.json(
        { error: 'Service zone with this ID already exists' },
        { status: 400 }
      );
    }

    const serviceZone = await prisma.serviceZone.update({
      where: { id: zoneId },
      data: {
        zoneId: newZoneId,
        name,
        title,
        description,
        images: JSON.stringify(images || []),
        features: JSON.stringify(features || []),
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json({ serviceZone });
  } catch (error) {
    console.error('Error updating service zone:', error);
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

    const zoneId = parseInt(id);
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.serviceZone.delete({
      where: { id: zoneId }
    });

    return NextResponse.json({ message: 'Service zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting service zone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 