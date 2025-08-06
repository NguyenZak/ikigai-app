import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

// GET - Get news by slug for public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const news = await prisma.news.findFirst({
      where: { 
        slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!news) {
      return NextResponse.json({ 
        error: 'News not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ news });

  } catch (error) {
    console.error('Get news by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 