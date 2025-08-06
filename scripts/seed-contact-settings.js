const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedContactSettings() {
  try {
    console.log('🌱 Seeding contact settings...');

    const contactSettings = [
      {
        key: 'contact_phone',
        value: '0123456789',
        type: 'string'
      },
      {
        key: 'contact_phone_display',
        value: '0123 456 789',
        type: 'string'
      },
      {
        key: 'contact_whatsapp',
        value: 'https://wa.me/84123456789',
        type: 'string'
      },
      {
        key: 'contact_facebook',
        value: 'https://facebook.com/ikigaivilla',
        type: 'string'
      },
      {
        key: 'contact_zalo',
        value: 'https://zalo.me/0123456789',
        type: 'string'
      },
      {
        key: 'contact_email',
        value: 'info@ikigaivilla.com',
        type: 'string'
      },
      {
        key: 'contact_address',
        value: 'Đường ABC, Quận XYZ, TP.HCM',
        type: 'string'
      },
      {
        key: 'contact_map_url',
        value: 'https://maps.google.com/?q=ikigaivilla',
        type: 'string'
      }
    ];

    for (const setting of contactSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, type: setting.type },
        create: setting
      });
      console.log(`✅ Added/Updated setting: ${setting.key}`);
    }

    console.log('🎉 Contact settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding contact settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContactSettings(); 