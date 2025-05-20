import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }
  
  // Find or create the user in our database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  
  return user;
}

export async function createUserIfNotExists(clerkId: string, email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });
  
  if (existingUser) {
    return existingUser;
  }
  
  // Create a new user
  return prisma.user.create({
    data: {
      clerkId,
      email,
    },
  });
} 