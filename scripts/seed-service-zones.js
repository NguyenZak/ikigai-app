const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const serviceZones = [
  {
    zoneId: "onsen",
    name: "Khu onsen ngoài trời",
    title: "Khu Onsen Ngoài Trời",
    description: "Trải nghiệm tắm khoáng nóng ngoài trời chuẩn Nhật Bản, thư giãn giữa thiên nhiên, giúp phục hồi năng lượng và cân bằng cơ thể.",
    images: [
      "/banner/ONSEN 10_4.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/CONG CHINH 2_3.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Nước khoáng nóng tự nhiên",
      "Không gian ngoài trời xanh mát",
      "Bồn tắm khoáng, phòng xông hơi",
      "Dịch vụ spa thư giãn"
    ],
    order: 1,
    active: true
  },
  {
    zoneId: "lobby-library",
    name: "Sảnh lễ tân & Thư viện",
    title: "Sảnh Lễ Tân & Thư Viện",
    description: "Không gian đón tiếp sang trọng, kết hợp thư viện yên tĩnh với hàng ngàn đầu sách, lý tưởng cho việc đọc sách, làm việc và thư giãn.",
    images: [
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG CHINH 2_3.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Sảnh lễ tân sang trọng",
      "Thư viện với hơn 10,000 đầu sách",
      "Không gian làm việc chung",
      "Cà phê và trà miễn phí"
    ],
    order: 2,
    active: true
  },
  {
    zoneId: "restaurant",
    name: "Khu vực nhà hàng",
    title: "Khu Vực Nhà Hàng",
    description: "Nhà hàng phục vụ ẩm thực đa dạng, không gian ấm cúng, thực đơn phong phú từ món Việt đến món Âu, nguyên liệu tươi ngon mỗi ngày.",
    images: [
      "/banner/CONG CHINH 2_3.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG PHU 4_4.png"
    ],
    features: [
      "Ẩm thực Việt & Quốc tế",
      "Không gian riêng tư & chung",
      "Nguyên liệu hữu cơ, tươi mới",
      "Phục vụ chuyên nghiệp"
    ],
    order: 3,
    active: true
  },
  {
    zoneId: "wellness",
    name: "Khu vực chăm sóc sức khoẻ & vật lý trị liệu",
    title: "Chăm Sóc Sức Khoẻ & Vật Lý Trị Liệu",
    description: "Dịch vụ chăm sóc sức khoẻ toàn diện: massage, vật lý trị liệu, yoga, thiền, giúp phục hồi thể chất và tinh thần.",
    images: [
      "/banner/CONG PHU 4_4.png",
      "/banner/THU VIEN 8_4.png",
      "/banner/ONSEN 10_4.png",
      "/banner/CONG CHINH 2_3.png"
    ],
    features: [
      "Massage trị liệu chuyên sâu",
      "Phòng tập yoga & thiền",
      "Chuyên gia vật lý trị liệu",
      "Không gian yên tĩnh, riêng tư"
    ],
    order: 4,
    active: true
  }
];

async function seedServiceZones() {
  try {
    console.log('🌱 Seeding service zones...');

    // Clear existing service zones
    await prisma.serviceZone.deleteMany();

    // Create service zones
    for (const zone of serviceZones) {
      await prisma.serviceZone.create({
        data: {
          zoneId: zone.zoneId,
          name: zone.name,
          title: zone.title,
          description: zone.description,
          images: JSON.stringify(zone.images),
          features: JSON.stringify(zone.features),
          order: zone.order,
          active: zone.active
        }
      });
      console.log(`✅ Created service zone: ${zone.name}`);
    }

    console.log('🎉 Service zones seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding service zones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServiceZones(); 