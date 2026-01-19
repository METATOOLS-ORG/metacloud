import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

// Create default fields in database
async function main() {
    if (!process.env.ADMIN_PASSWORD)
        throw new Error("Environment variable ADMIN_PASSWORD not found, make sure to set up .env");

    if (process.env.ADMIN_PASSWORD == "CHANGE_ME")
        throw new Error("ADMIN_PASSWORD in .env is still set to the default value CHANGE_ME, please change it");

    await prisma.user.create({
        data: {
            username: "admin",
            email: "none", // @todo?
            passwordHash: process.env.ADMIN_PASSWORD!,
            displayName: "Admin",
            bio: "Website administrator",
    }});
}

main();
