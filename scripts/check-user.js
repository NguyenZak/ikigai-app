const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('🔍 Checking admin user...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@ikigaivilla.com' }
    });

    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - Name:', user.name);
    console.log('  - Role:', user.role);
    console.log('  - Password hash:', user.password.substring(0, 20) + '...');

    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔐 Password test:');
    console.log('  - Test password:', testPassword);
    console.log('  - Is valid:', isValid);

    if (isValid) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser(); 