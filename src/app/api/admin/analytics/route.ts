export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (authResult.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Lấy tổng số phòng
    const totalRooms = await prisma.room.count({
      where: {
        status: 'ACTIVE'
      }
    });

    // Lấy số đặt phòng hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Lấy số đặt phòng đang chờ xử lý
    const pendingBookings = await prisma.booking.count({
      where: {
        status: 'PENDING'
      }
    });

    // Lấy tổng số khách hàng
    const totalCustomers = await prisma.customer.count();

    // Lấy thống kê theo tháng (6 tháng gần nhất)
    const monthlyStats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
        }
      },
      _count: {
        id: true
      }
    });

    // Lấy top 5 phòng được đặt nhiều nhất
    const topRooms = await prisma.booking.groupBy({
      by: ['roomId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    // Lấy thông tin chi tiết của top rooms
    const topRoomsWithDetails = await Promise.all(
      topRooms.map(async (room) => {
        const roomDetails = await prisma.room.findUnique({
          where: { id: room.roomId },
          select: { name: true, title: true }
        });
        return {
          ...room,
          roomName: roomDetails?.name || 'Unknown',
          roomTitle: roomDetails?.title || 'Unknown'
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalRooms,
        todayBookings,
        pendingBookings,
        totalCustomers,
        monthlyStats,
        topRooms: topRoomsWithDetails
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 