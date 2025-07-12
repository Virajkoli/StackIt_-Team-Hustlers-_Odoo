const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteToAdmin(emailOrUsername) {
  try {
    console.log(`🔍 Looking for user: ${emailOrUsername}`);
    
    // Check if input is email or username
    const isEmail = emailOrUsername.includes('@');
    
    const user = await prisma.user.findFirst({
      where: isEmail 
        ? { email: emailOrUsername }
        : { username: emailOrUsername }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    if (user.role === 'ADMIN') {
      console.log('ℹ️  User is already an admin');
      return;
    }

    // Update user role to ADMIN
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });

    console.log(`✅ Successfully promoted ${user.name || user.username} to admin`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Username: ${user.username}`);

  } catch (error) {
    console.error('❌ Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email/username from command line arguments
const userIdentifier = process.argv[2];

if (!userIdentifier) {
  console.log('Usage: node scripts/promote-admin.js <email-or-username>');
  console.log('Example: node scripts/promote-admin.js admin@stackit.com');
  console.log('Example: node scripts/promote-admin.js johndoe');
  process.exit(1);
}

promoteToAdmin(userIdentifier);
