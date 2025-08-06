import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { sendEmail, generateContactFormEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Generate email content
    const emailContent = generateContactFormEmail(validatedData);

    // Send email to admin
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@ikigaivilla.com',
      ...emailContent
    });

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 