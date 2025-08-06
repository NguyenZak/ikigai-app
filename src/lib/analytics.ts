import { prisma } from './db';

export interface AnalyticsData {
  totalRooms: number;
  activeRooms: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthlyBookings: Array<{ month: string; count: number }>;
  popularRooms: Array<{ roomName: string; bookings: number }>;
  recentActivity: Array<{ type: string; description: string; date: string }>;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Get room statistics
    const totalRooms = await prisma.room.count();
    const activeRooms = await prisma.room.count({
      where: { status: 'ACTIVE' }
    });

    // Get booking statistics
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    });

    // Calculate total revenue from actual bookings
    const bookings = await prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      select: { totalAmount: true }
    });
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    // Get monthly bookings (last 6 months)
    const monthlyBookings = await getMonthlyBookings();

    // Get popular rooms
    const popularRooms = await getPopularRooms();

    // Get recent activity
    const recentActivity = await getRecentActivity();

    return {
      totalRooms,
      activeRooms,
      totalBookings,
      pendingBookings,
      totalRevenue,
      monthlyBookings,
      popularRooms,
      recentActivity
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw new Error('Failed to fetch analytics data');
  }
}

async function getMonthlyBookings() {
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('vi-VN', { month: 'long' });
    
    // Get actual booking count for this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const count = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });
    
    months.push({
      month: monthName,
      count
    });
  }
  
  return months;
}

async function getPopularRooms() {
  const popularRooms = await prisma.booking.groupBy({
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

  const roomDetails = await Promise.all(
    popularRooms.map(async (room) => {
      const roomInfo = await prisma.room.findUnique({
        where: { id: room.roomId },
        select: { name: true }
      });
      return {
        roomName: roomInfo?.name || 'Unknown Room',
        bookings: room._count.id
      };
    })
  );

  return roomDetails;
}

async function getRecentActivity() {
  const activities = [];
  const now = new Date();
  
  // Mock recent activities
  activities.push({
    type: 'booking',
    description: 'Đặt phòng mới - IKIGAI HOA HỒNG',
    date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
  });
  
  activities.push({
    type: 'room',
    description: 'Cập nhật thông tin phòng - IKIGAI HOA ĐÀO',
    date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
  });
  
  activities.push({
    type: 'news',
    description: 'Đăng tin tức mới - Khuyến mãi mùa hè',
    date: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
  });
  
  return activities;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 