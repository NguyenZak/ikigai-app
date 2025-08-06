const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedNews() {
  try {
    console.log('🌱 Seeding news data...');

    // Check if there are any users (authors)
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      return;
    }

    const authorId = users[0].id; // Use the first user as author

    // Sample news data
    const newsData = [
      {
        title: 'Ikigaivilla - Nơi nghỉ dưỡng lý tưởng tại Đà Nẵng',
        content: `
          <h2>Chào mừng đến với Ikigaivilla</h2>
          <p>Ikigaivilla là một khu nghỉ dưỡng cao cấp tọa lạc tại thành phố Đà Nẵng xinh đẹp. 
          Với vị trí đắc địa, view biển tuyệt đẹp và dịch vụ chất lượng, chúng tôi cam kết mang đến 
          những trải nghiệm nghỉ dưỡng tuyệt vời nhất cho quý khách.</p>
          
          <h3>Đặc điểm nổi bật:</h3>
          <ul>
            <li>Vị trí thuận tiện, gần trung tâm thành phố</li>
            <li>View biển Đà Nẵng tuyệt đẹp</li>
            <li>Phòng nghỉ hiện đại, tiện nghi</li>
            <li>Dịch vụ spa và massage chuyên nghiệp</li>
            <li>Nhà hàng phục vụ ẩm thực đa dạng</li>
          </ul>
          
          <p>Hãy đến và trải nghiệm sự thoải mái, sang trọng tại Ikigaivilla!</p>
        `,
        excerpt: 'Khám phá khu nghỉ dưỡng cao cấp Ikigaivilla tại Đà Nẵng với view biển tuyệt đẹp và dịch vụ chất lượng.',
        slug: 'ikigaivilla-noi-nghi-duong-ly-tuong-tai-da-nang',
        metaTitle: 'Ikigaivilla - Nơi nghỉ dưỡng lý tưởng tại Đà Nẵng',
        metaDescription: 'Khám phá khu nghỉ dưỡng cao cấp Ikigaivilla tại Đà Nẵng với view biển tuyệt đẹp và dịch vụ chất lượng.',
        keywords: 'ikigaivilla, đà nẵng, nghỉ dưỡng, khách sạn, resort, biển',
        featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        status: 'PUBLISHED',
        authorId: authorId,
        publishedAt: new Date()
      },
      {
        title: 'Dịch vụ Onsen - Trải nghiệm thư giãn độc đáo',
        content: `
          <h2>Dịch vụ Onsen tại Ikigaivilla</h2>
          <p>Trải nghiệm dịch vụ Onsen truyền thống Nhật Bản ngay tại Ikigaivilla. 
          Với hệ thống bồn tắm nước nóng tự nhiên, chúng tôi mang đến cho quý khách 
          những giây phút thư giãn tuyệt vời.</p>
          
          <h3>Lợi ích của Onsen:</h3>
          <ul>
            <li>Thư giãn cơ bắp, giảm stress</li>
            <li>Cải thiện tuần hoàn máu</li>
            <li>Làm đẹp da tự nhiên</li>
            <li>Tăng cường sức khỏe</li>
          </ul>
          
          <p>Hãy đặt lịch ngay hôm nay để trải nghiệm dịch vụ Onsen độc đáo!</p>
        `,
        excerpt: 'Trải nghiệm dịch vụ Onsen truyền thống Nhật Bản với nhiều lợi ích cho sức khỏe và sắc đẹp.',
        slug: 'dich-vu-onsen-trai-nghiem-thu-gian-doc-dao',
        metaTitle: 'Dịch vụ Onsen - Trải nghiệm thư giãn độc đáo tại Ikigaivilla',
        metaDescription: 'Trải nghiệm dịch vụ Onsen truyền thống Nhật Bản với nhiều lợi ích cho sức khỏe và sắc đẹp.',
        keywords: 'onsen, tắm nước nóng, thư giãn, spa, ikigaivilla',
        featuredImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        status: 'PUBLISHED',
        authorId: authorId,
        publishedAt: new Date()
      },
      {
        title: 'Khám phá các loại phòng tại Ikigaivilla',
        content: `
          <h2>Các loại phòng tại Ikigaivilla</h2>
          <p>Ikigaivilla cung cấp đa dạng các loại phòng nghỉ để đáp ứng mọi nhu cầu của quý khách:</p>
          
          <h3>1. Phòng Deluxe</h3>
          <p>Phòng Deluxe với diện tích 35m², view biển tuyệt đẹp, trang thiết bị hiện đại 
          và dịch vụ phòng 24/7.</p>
          
          <h3>2. Phòng Suite</h3>
          <p>Phòng Suite cao cấp với diện tích 50m², phòng khách riêng biệt, 
          bồn tắm sang trọng và view toàn cảnh biển.</p>
          
          <h3>3. Villa Riêng</h3>
          <p>Villa riêng biệt với không gian rộng rãi, hồ bơi riêng và dịch vụ butler 24/7.</p>
          
          <p>Mỗi loại phòng đều được thiết kế tối ưu để mang đến trải nghiệm nghỉ dưỡng tốt nhất.</p>
        `,
        excerpt: 'Khám phá đa dạng các loại phòng nghỉ tại Ikigaivilla từ phòng Deluxe đến Villa riêng biệt.',
        slug: 'kham-pha-cac-loai-phong-tai-ikigaivilla',
        metaTitle: 'Khám phá các loại phòng tại Ikigaivilla - Đà Nẵng',
        metaDescription: 'Khám phá đa dạng các loại phòng nghỉ tại Ikigaivilla từ phòng Deluxe đến Villa riêng biệt.',
        keywords: 'phòng nghỉ, deluxe, suite, villa, ikigaivilla, đà nẵng',
        featuredImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        status: 'PUBLISHED',
        authorId: authorId,
        publishedAt: new Date()
      }
    ];

    // Clear existing news
    await prisma.news.deleteMany({});

    // Create news
    for (const news of newsData) {
      const createdNews = await prisma.news.create({
        data: news
      });
      console.log(`✅ Created news: ${createdNews.title} (slug: ${createdNews.slug})`);
    }

    console.log('🎉 News seeding completed!');
    
    // List all available slugs
    const allNews = await prisma.news.findMany({
      select: { slug: true, title: true }
    });
    
    console.log('\n📋 Available news slugs:');
    allNews.forEach(news => {
      console.log(`  - ${news.slug} (${news.title})`);
    });

  } catch (error) {
    console.error('❌ Error seeding news:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNews(); 