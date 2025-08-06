const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const customers = [
  {
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "nguyenvanan@email.com",
    province: "79",
    provinceName: "TP. Hồ Chí Minh",
    ward: "7609",
    wardName: "Phường 1",
    source: "WEBSITE",
    status: "NEW",
    processingStatus: "PENDING",
    notes: "Khách hàng quan tâm đến gói onsen"
  },
  {
    name: "Trần Thị Bình",
    phone: "0912345678",
    email: "tranthibinh@email.com",
    province: "01",
    provinceName: "Hà Nội",
    ward: "0001",
    wardName: "Phường Phúc Xá",
    source: "BOOKING",
    status: "CONTACTED",
    processingStatus: "IN_PROGRESS",
    notes: "Đã gọi điện tư vấn, khách quan tâm đến phòng cao cấp",
    lastContactDate: new Date(),
    nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    name: "Lê Văn Cường",
    phone: "0923456789",
    email: "levancuong@email.com",
    province: "92",
    provinceName: "Cần Thơ",
    ward: "9201",
    wardName: "Phường An Bình",
    source: "ADMIN",
    status: "CONVERTED",
    processingStatus: "RESOLVED",
    notes: "Đã đặt phòng thành công, khách rất hài lòng"
  },
  {
    name: "Phạm Thị Dung",
    phone: "0934567890",
    email: "phamthidung@email.com",
    province: "48",
    provinceName: "Đà Nẵng",
    ward: "4801",
    wardName: "Phường An Hải Bắc",
    source: "WEBSITE",
    status: "LOST",
    processingStatus: "CLOSED",
    notes: "Khách không quan tâm sau khi tư vấn"
  },
  {
    name: "Hoàng Văn Em",
    phone: "0945678901",
    email: "hoangvanem@email.com",
    province: "95",
    provinceName: "Bạc Liêu",
    ward: "9501",
    wardName: "Phường 1",
    source: "BOOKING",
    status: "CONTACTED",
    processingStatus: "FOLLOW_UP",
    notes: "Cần follow-up về gói trải nghiệm đặc biệt",
    lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  }
];

async function seedCustomers() {
  try {
    console.log('🌱 Seeding customers...');

    // Clear existing customers
    await prisma.customer.deleteMany();
    console.log('✅ Cleared existing customers');

    // Create new customers
    for (const customer of customers) {
      await prisma.customer.create({
        data: customer
      });
      console.log(`✅ Created customer: ${customer.name}`);
    }

    console.log('🎉 Customers seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCustomers(); 