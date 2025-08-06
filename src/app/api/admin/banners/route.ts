export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // For development, allow access without auth
    if (process.env.NODE_ENV === 'development') {
      // Continue with the request
      //Log console.log('Development mode: Skipping authentication check');
      console.log('Development mode: Skipping authentication check');
    } else {
      //Log
      console.log('Production mode: Validating session');
      const token = request.cookies.get('auth-token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const user = await validateSession(token);
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const banners = await prisma.banner.findMany({
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

export async function POST(request: NextRequest) {
  try {
    // For development, allow access without auth
    if (process.env.NODE_ENV === 'development') {
      // Continue with the request
    } else {
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const user = await validateSession(token);
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { title, subtitle, image, overlay, statistics, order, active } = body;

    // Validate required fields
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    // Create new banner
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        overlay,
        statistics: statistics ? JSON.stringify(statistics) : null,
        order: order || 1,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 