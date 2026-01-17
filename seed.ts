import { AssetType, AssetPurpose, PrismaClient } from "@prisma/client";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import 'dotenv/config'
const prisma = new PrismaClient()

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_UPLOAD_PATH = join(__dirname, "..", "uploads_default");
const UPLOAD_PATH = join(__dirname, "..", "uploads");

// Create default fields in database
async function main() {
    if (!process.env.ADMIN_PASSWORD)
        throw new Error("Environment variable ADMIN_PASSWORD not found, make sure to set up .env");

    if (process.env.ADMIN_PASSWORD == "CHANGE_ME")
        throw new Error("ADMIN_PASSWORD in .env is still set to the default value CHANGE_ME, please change it");

    prisma.user.create({
        data: {
            username: "admin",
            email: "none", // @todo?
            passwordHash: process.env.ADMIN_PASSWORD!,
            displayName: "Admin",
            bio: "Website administrator",
    }});
}


main();
