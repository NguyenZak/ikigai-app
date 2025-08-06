import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: 'contact_'
        }
      }
    });

    // Convert array to object for easier access
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ settings: settingsObject });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 