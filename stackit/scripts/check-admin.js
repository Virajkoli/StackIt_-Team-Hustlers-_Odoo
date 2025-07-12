const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@stackit.com' }
    });
    
    console.log('Admin user details:');
    console.log(JSON.stringify(adminUser, null, 2));
    
    if (adminUser) {
      console.log('\n✅ Admin user exists');
      console.log(`Role: ${adminUser.role}`);
      console.log(`Is Admin: ${adminUser.role === 'ADMIN'}`);
    } else {
      console.log('\n❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
