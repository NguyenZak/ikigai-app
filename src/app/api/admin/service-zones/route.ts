import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceZones = await prisma.serviceZone.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ serviceZones });
  } catch (error) {
    console.error('Error fetching service zones:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const { zoneId, name, title, description, images, features, order, active } = body;

    // Validate required fields
    if (!zoneId || !name || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if zoneId already exists
    const existingZone = await prisma.serviceZone.findUnique({
      where: { zoneId }
    });

    if (existingZone) {
      return NextResponse.json(
        { error: 'Service zone with this ID already exists' },
        { status: 400 }
      );
    }

    const serviceZone = await prisma.serviceZone.create({
      data: {
        zoneId,
        name,
        title,
        description,
        images: JSON.stringify(images || []),
        features: JSON.stringify(features || []),
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json({ serviceZone }, { status: 201 });
  } catch (error) {
    console.error('Error creating service zone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 