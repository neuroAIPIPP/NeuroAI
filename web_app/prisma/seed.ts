import prisma from '../src/lib/prisma';

async function main() {
  console.log('Seeding started...');

  const adminEmail = 'admin@neuroai.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Super Admin',
        email: adminEmail,
        emailVerified: true,
        role: 'admin',
      },
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
    console.log(
      `⚠️ Note: Karena menggunakan better-auth, untuk login menggunakan kredensial/password, kamu mungkin perlu mendaftar secara manual melalui UI dengan email ini lalu menjalankan seed ini lagi untuk menaikkan rolenya menjadi admin.`,
    );
  } else {
    if (existingAdmin.role !== 'admin') {
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: 'admin',
          emailVerified: true,
        },
      });
      console.log(`✅ Elevated existing user to admin: ${updatedUser.email}`);
    } else if (existingAdmin.emailVerified == false) {
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          emailVerified: true,
        },
      });
      console.log(`✅ Verified existing user: ${updatedUser.email}`);
    } else {
      console.log(
        `ℹ️ Admin user (${adminEmail}) already exists and has admin role.`,
      );
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
