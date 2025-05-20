import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a sample user
    const user = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        clerkId: 'demo_clerk_id',
      },
    });

    console.log('Created user:', user);

    // Create a sample webinar
    const webinar = await prisma.webinar.create({
      data: {
        title: 'Introduction to AI Webinars',
        description: 'Learn how to create effective AI-powered webinars with our platform.',
        status: 'scheduled',
        hostId: user.id,
      },
    });

    console.log('Created webinar:', webinar);

    // Create a sample attendee
    const attendee = await prisma.attendee.create({
      data: {
        userId: user.id,
        webinarId: webinar.id,
        status: 'pending',
      },
    });

    console.log('Created attendee:', attendee);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 