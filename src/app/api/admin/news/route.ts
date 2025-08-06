import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { generateVietnameseSlug } from '@/lib/vietnamese-utils';

// const newsSchema = z.object({
//   title: z.string().min(1, 'Tiêu đề là bắt buộc'),
//   content: z.string().min(1, 'Nội dung là bắt buộc'),
//   excerpt: z.string().optional(),
//   slug: z.string().optional(),
//   metaTitle: z.string().optional(),
//   metaDescription: z.string().optional(),
//   keywords: z.string().optional(),
//   featuredImage: z.string().optional(),
//   publishedAt: z.string().optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT')
// });

// GET - Get all news
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get news with author info
    const news = await prisma.news.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count
    const total = await prisma.news.count({ where });

    // Get all slugs for reference
    const allSlugs = await prisma.news.findMany({
      select: { slug: true, title: true }
    });

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      availableSlugs: allSlugs
    });

  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateVietnameseSlug(body.title);
    }

    // Check if slug already exists
    const existingNews = await prisma.news.findFirst({
      where: { slug: body.slug }
    });

    if (existingNews) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Set publishedAt if status is PUBLISHED
    if (body.status === 'PUBLISHED' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const news = await prisma.news.create({
      data: {
        ...body,
        authorId: user.id
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

    return NextResponse.json({ news });

  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 