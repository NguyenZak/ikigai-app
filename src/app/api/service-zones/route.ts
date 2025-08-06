import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    console.log('API: Fetching service zones...');
    
    const serviceZones = await prisma.serviceZone.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    console.log('API: Found service zones:', serviceZones.length);

    // Parse JSON strings back to arrays
    const parsedServiceZones = serviceZones.map(zone => {
      try {
        return {
          ...zone,
          images: JSON.parse(zone.images || '[]'),
          features: JSON.parse(zone.features || '[]')
        };
      } catch (parseError) {
        console.error('Error parsing zone data:', parseError);
        return {
          ...zone,
          images: [],
          features: []
        };
      }
    });

    console.log('API: Returning parsed service zones');
    return NextResponse.json({ serviceZones: parsedServiceZones });
  } catch (error) {
    console.error('API Error fetching service zones:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 