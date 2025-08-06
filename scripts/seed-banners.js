const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBanners() {
  try {
    console.log('🌱 Seeding banners...');

    // Clear existing banners
    await prisma.banner.deleteMany();

    // Create initial banners
    const banners = [
      {
        title: "Chào mừng đến với Ikigaivilla",
        subtitle: "Trải nghiệm nghỉ dưỡng sang trọng với dịch vụ đẳng cấp 5 sao",
        image: "/banner/ONSEN 10_4.png",
        overlay: "from-black/30 to-black/30",
        statistics: JSON.stringify([
          { value: "50+", label: "Phòng Nghỉ" },
          { value: "1000+", label: "Khách Hài Lòng" },
          { value: "5★", label: "Đánh Giá Trung Bình" }
        ]),
        order: 1,
        active: true
      },
      {
        title: "Không gian thư viện yên tĩnh",
        subtitle: "Nơi lý tưởng để thư giãn và làm việc",
        image: "/banner/THU VIEN 8_4.png",
        overlay: "from-black/30 to-black/30",
        statistics: JSON.stringify([
          { value: "24/7", label: "Hỗ Trợ Khách Hàng" },
          { value: "100%", label: "An Toàn Tuyệt Đối" },
          { value: "4.9★", label: "Đánh Giá Dịch Vụ" }
        ]),
        order: 2,
        active: true
      },
      {
        title: "Cổng chính Ikigaivilla",
        subtitle: "Kiến trúc độc đáo, ấn tượng ngay từ cái nhìn đầu tiên",
        image: "/banner/CONG CHINH 2_3.png",
        overlay: "from-black/30 to-black/30",
        statistics: JSON.stringify([
          { value: "2020", label: "Năm Thành Lập" },
          { value: "100+", label: "Nhân Viên Chuyên Nghiệp" },
          { value: "99%", label: "Khách Hàng Quay Lại" }
        ]),
        order: 3,
        active: true
      },
      {
        title: "Cổng phụ tiện lợi",
        subtitle: "Thuận tiện di chuyển, an toàn tuyệt đối",
        image: "/banner/CONG PHU 4_4.png",
        overlay: "from-black/30 to-black/30",
        statistics: JSON.stringify([
          { value: "3", label: "Cổng Ra Vào" },
          { value: "24h", label: "Bảo Vệ" },
          { value: "100%", label: "An Toàn" }
        ]),
        order: 4,
        active: true
      },
      {
        title: "Phòng chức năng đa dạng",
        subtitle: "Đáp ứng mọi nhu cầu của khách hàng",
        image: "/banner/PCTT 2_2.png",
        overlay: "from-black/30 to-black/30",
        statistics: JSON.stringify([
          { value: "10+", label: "Loại Phòng Chức Năng" },
          { value: "200+", label: "Tiện Ích Đặc Biệt" },
          { value: "4.8★", label: "Đánh Giá Tiện Ích" }
        ]),
        order: 5,
        active: true
      }
    ];

    for (const banner of banners) {
      await prisma.banner.create({
        data: banner
      });
    }

    console.log('✅ Banners seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanners(); 