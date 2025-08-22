import { AssetType, AssetPurpose, PrismaClient } from "@prisma/client";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const prisma = new PrismaClient()

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_UPLOAD_PATH = join(__dirname, "..", "uploads_default");
const UPLOAD_PATH = join(__dirname, "..", "uploads");

// Create default fields in database
async function main() {
    // @todo: create default admin account 
}


main();
