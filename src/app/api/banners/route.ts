import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        active: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Transform the data to match the frontend interface
    const transformedBanners = banners.map(banner => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      overlay: banner.overlay || 'from-black/50 to-transparent',
      statistics: banner.statistics ? JSON.parse(banner.statistics) : [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' }
      ],
      order: banner.order,
      active: banner.active
    }));

    return NextResponse.json(transformedBanners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 