const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // Check if admin user already exists
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@ikigaivilla.com' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@ikigaivilla.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created:', adminUser.email);
  } else {
    console.log('✅ Admin user already exists:', adminUser.email);
  }

  // Create sample rooms - check if they exist first
  const roomSlugs = ['ikigai-hoa-hong', 'ikigai-hoa-dao-phong-c', 'ikigai-hoa-mai-phong-a'];
  const existingRooms = await prisma.room.findMany({
    where: { slug: { in: roomSlugs } }
  });

  if (existingRooms.length === 0) {
    const rooms = await Promise.all([
      prisma.room.create({
        data: {
          name: 'IKIGAI HOA HỒNG',
          title: 'IKIGAI HOA HỒNG',
          description: '1 giường (Double twin) 1 phòng duy nhất (phòng ngủ, wc, bàn trà, sofa tiếp khách....)',
          beds: '1 giường (Double twin)',
          area: '50m²',
          price: 'Liên hệ',
          floor: '4',
          rooms: '1',
          view: 'Vườn Nhật',
          slug: 'ikigai-hoa-hong',
          features: JSON.stringify([
            'Phòng ngủ riêng biệt',
            'WC riêng',
            'Bàn trà',
            'Sofa tiếp khách',
            'View vườn Nhật tuyệt đẹp'
          ]),
          images: JSON.stringify([
            '/banner/THU VIEN 8_4.png',
            '/banner/ONSEN 10_4.png',
            '/banner/CONG CHINH 2_3.png',
            '/banner/CONG PHU 4_4.png'
          ]),
          status: 'ACTIVE'
        }
      }),
      prisma.room.create({
        data: {
          name: 'IKIGAI HOA ĐÀO (PHÒNG C)',
          title: 'IKIGAI HOA ĐÀO (PHÒNG C)',
          description: 'Phòng nghỉ ấm cúng với WC chung, phù hợp cho du khách muốn trải nghiệm không gian cộng đồng.',
          beds: '1 giường (Double twin)',
          area: '13m²/phòng',
          price: 'Liên hệ',
          floor: '2-3',
          rooms: '2',
          view: 'Vườn Nhật',
          slug: 'ikigai-hoa-dao-phong-c',
          features: JSON.stringify([
            'WC chung',
            'Bàn trà',
            'Không gian ấm cúng',
            'View vườn Nhật'
          ]),
          images: JSON.stringify([
            '/banner/ONSEN 10_4.png',
            '/banner/THU VIEN 8_4.png',
            '/banner/CONG PHU 4_4.png',
            '/banner/PCTT 2_2.png'
          ]),
          status: 'ACTIVE'
        }
      }),
      prisma.room.create({
        data: {
          name: 'IKIGAI HOA MAI (PHÒNG A,B)',
          title: 'IKIGAI HOA MAI (PHÒNG A,B)',
          description: 'Phòng rộng rãi với 2 giường, thiết kế hiện đại, view hướng núi tuyệt đẹp.',
          beds: '2 giường (Double twin)',
          area: '13m² - 17m²',
          price: 'Liên hệ',
          floor: '2-3',
          rooms: '6',
          view: 'Núi',
          slug: 'ikigai-hoa-mai-phong-a',
          features: JSON.stringify([
            'WC chung',
            'Không gian rộng rãi',
            'View núi tuyệt đẹp',
            'Thiết kế hiện đại'
          ]),
          images: JSON.stringify([
            '/banner/CONG CHINH 2_3.png',
            '/banner/ONSEN 10_4.png',
            '/banner/THU VIEN 8_4.png',
            '/banner/CONG PHU 4_4.png'
          ]),
          status: 'ACTIVE'
        }
      })
    ]);

    console.log('✅ Sample rooms created:', rooms.length);
  } else {
    console.log('✅ Sample rooms already exist:', existingRooms.length);
  }

  // Create sample services - check if they exist first
  const existingServices = await prisma.service.findMany({
    where: { name: { in: ['Spa & Massage', 'Restaurant'] } }
  });

  if (existingServices.length === 0) {
    const services = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Spa & Massage',
          description: 'Dịch vụ spa và massage thư giãn',
          price: '500,000 VNĐ',
          category: 'Wellness',
          images: JSON.stringify(['/banner/ONSEN 10_4.png']),
          status: 'ACTIVE'
        }
      }),
      prisma.service.create({
        data: {
          name: 'Restaurant',
          description: 'Nhà hàng phục vụ ẩm thực Nhật Bản',
          price: '200,000 VNĐ',
          category: 'Dining',
          images: JSON.stringify(['/banner/THU VIEN 8_4.png']),
          status: 'ACTIVE'
        }
      })
    ]);

    console.log('✅ Sample services created:', services.length);
  } else {
    console.log('✅ Sample services already exist:', existingServices.length);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('Email: admin@ikigaivilla.com');
  console.log('Password: admin123');
  console.log('\n🌐 Access admin panel at: http://localhost:3000/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 