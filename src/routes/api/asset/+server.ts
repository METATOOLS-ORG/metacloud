import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { getAuthedUser } from "$lib/server/auth";
import { writeFile } from 'fs/promises';
import { ulid } from "ulid";
import path from "path";
import { prisma } from "$lib/server/database";
import { AssetPurpose, AssetType } from "@prisma/client";
import * as s3 from "$lib/server/s3";
import type { AssetUploadRespDTO } from "$lib/dto";
export const GET: RequestHandler = async ({ request, cookies, locals }) => {
	return json("pong");
}

function MbToBytes(mb: number) {
    return Math.round(mb * 1024 * 1024);
}

export const POST: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);
    const data = await req.request.formData();
    const file = data.get("asset") as File;
    console.log(file);

    if (!file) error(422, {message: "No asset file given", code: "NO_ASSET_FIELD_IN_FORMDATA"});
    if (file.size > MbToBytes(30)) error(413, {message: "File is too big, max 30 MB", code: "FILE_ABOVE_SIZE_LIMIT"})

    const fileData = new Uint8Array(await file.arrayBuffer());

    const assetId = ulid();
    let uploadResult;
    try {
        uploadResult = await s3.uploadFile(fileData, assetId, file.type);
    } catch (err) {
        console.trace(err);
        error(500, {message: "Failed to write file to server", code: "FILE_WRITE_FAILED"});
    }

    
    await prisma.asset.create({
        data: {
            id: assetId,
            // @todo: use mimetypes
            type: AssetType.OTHER,
            // @todo: should be specified by AssetUploaders
            purpose: AssetPurpose.OTHER,
            filename: file.name,
            size: file.size,
            metatype: file.type,
            // @todo: unmark assets as temp after upload
            temp: true
        }
    });
    return json({id: assetId, url: uploadResult.url} satisfies AssetUploadRespDTO);
}
