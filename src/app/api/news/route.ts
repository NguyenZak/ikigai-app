import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Get all published news for public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        slug: true,
        featuredImage: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.news.count({
      where: { status: 'PUBLISHED' }
    });

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 