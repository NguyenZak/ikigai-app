import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { z } from 'zod';


const newsUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  featuredImage: z.string().optional(),
  publishedAt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional()
});

// GET - Get news by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Looking for news with slug:', slug);
    
    const news = await prisma.news.findFirst({
      where: { slug }
    });

    console.log('Found news:', news ? 'Yes' : 'No');

    if (!news) {
      // Check if there are any news in the database
      const allNews = await prisma.news.findMany({
        select: { slug: true, title: true }
      });
      console.log('Available news slugs:', allNews.map(n => n.slug));
      
      return NextResponse.json({ 
        error: 'News not found',
        requestedSlug: slug,
        availableSlugs: allNews.map(n => n.slug)
      }, { status: 404 });
    }

    return NextResponse.json({ news });

  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = newsUpdateSchema.parse(body);

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.publishedAt) {
      updateData.publishedAt = new Date(validatedData.publishedAt);
    }

    const news = await prisma.news.updateMany({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({ news });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if news exists
    const news = await prisma.news.findFirst({
      where: { slug }
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // Delete the news
    await prisma.news.deleteMany({
      where: { slug }
    });

    return NextResponse.json({ 
      message: 'News deleted successfully',
      deletedNews: news.title
    });

  } catch (error: unknown) {
    console.error('Delete news error:', error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'News not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
} 