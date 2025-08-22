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
    // @todo: probably can just get rid of all of this now since default assets no longer exist
    // Create default database fields
    /* await prisma.asset.upsert({
        where: {
            id: "defaultAvatar"
        },
        update: {},
        create: {
            id: "defaultAvatar",
            filename: "defaultAvatar",
            url: "/assets/default/avatar.png",
            type: AssetType.IMAGE,
            purpose: AssetPurpose.PROFILE_PICTURE,
            size: 0,
            metatype: "image/png",
            system: true,
            temp: false
        }
    })
    await prisma.asset.upsert({
        where: {
            id: "defaultCover"
        },
        update: {},
        create: {
            id: "defaultCover",
            filename: "defaultCover",
            url: "/assets/default/cover.png",
            type: AssetType.IMAGE,
            purpose: AssetPurpose.COVER_ART,
            size: 0,
            metatype: "image/png",
            system: true,
            temp: false,

        }
    }) */
}


main();
