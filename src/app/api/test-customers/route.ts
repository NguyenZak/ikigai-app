import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing customers API...');
    
    const customers = await prisma.customer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    console.log('Found customers:', customers.length);
    
    return NextResponse.json({ 
      customers,
      message: 'Test successful',
      count: customers.length
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 