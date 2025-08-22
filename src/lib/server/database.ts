import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// Macros for very common database queries
export async function getUserByTag(tag: string) {
	return await prisma.user.findUnique({ where: { username: tag } });
}
export async function getUserById(id: string) {
	return await prisma.user.findUnique({ where: { id: id } });
}
