import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

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
