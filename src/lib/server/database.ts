import { DATABASE_URL } from '$env/static/private';
import { PrismaClient } from '../../../prisma/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
export const prisma = new PrismaClient({adapter});

// Macros for very common database queries
export async function getUserByTag(tag: string) {
    return await prisma.user.findUnique({ where: { username: tag } });
}
export async function getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id: id } });
}
