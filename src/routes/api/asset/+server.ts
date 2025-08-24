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
import { exec } from "child_process";
import { promisify } from "util";
import { getAudioDurationInSeconds } from "get-audio-duration";

const execAsync = promisify(exec);

function mapMimeTypeToFormat(mimeType: string) {
  switch (mimeType) {
    case "audio/wav":
    case "audio/x-wav":
      return "wav";

    case "audio/mpeg":
      return "mp3";

    case "audio/flac":
      return "flac";

    case "audio/ogg":
      return "ogg";

    case "audio/opus":
      return "opus";

    default:
      //throw new Error(`Unsupported MIME type: ${mimeType}`);
        return "wav";
  }
}

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

    if (!file) error(422, {message: "No asset file given", code: "NO_ASSET_FIELD_IN_FORMDATA"});
    if (file.size > MbToBytes(30)) error(413, {message: "File is too big, max 30 MB", code: "FILE_ABOVE_SIZE_LIMIT"})

    const fileData = new Uint8Array(await file.arrayBuffer());

    const assetId = ulid();
    const audioExt = mapMimeTypeToFormat(file.type);
    const tempPath = `./ugc_temp/${assetId}.${audioExt}`;
    try {
        await writeFile(tempPath, fileData);
    } catch (err) {
        error(500, {
            message: "Failed to temporarily write file to server (server is out of disk space?)",
            code: "TEMP_FILE_WRITE_FAILED"
        });
    }

    let waveformJSON = null;
    let duration = null;
    if (file.type.startsWith("audio/")) {
        // Precalculate audio duration using ffprobe
        // @todo: custom ffprobe path in config and docs
        duration = await getAudioDurationInSeconds(tempPath);

        // Pregenerate audio waveform using audiowaveform
        // @todo: is using process.cwd() going to cause problems?
        // @todo: add documentation about setting up audiowaveform in path or a config to point to it
        // @todo: better error handling (stderr?)
        // @todo: dynamic pixels per second depending on length
        // @todo: automatically delete file from ugc_temp after the waveform is generated
        // @todo: prenormalize waveform data for performance https://wavesurfer.xyz/faq/
        try {
            const { stdout } = await execAsync(
                `audiowaveform -i ${tempPath} --output-format json --pixels-per-second 10 --bits 8 -q`,
                { cwd: process.cwd() }
            );
            waveformJSON = stdout;
        } catch (err) {
            console.trace(err);
            error(500, {
                message: "Failed to generate audio waveform for file (unsupported audio file type?)",
                code: "WAVEFORM_GENERATION_FAILED"
            });
        }
    }


    // Upload the file to S3
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
            temp: true,
            waveformJSON: waveformJSON,
            duration: duration
        }
    });
    return json({id: assetId, url: uploadResult.url} satisfies AssetUploadRespDTO);
}
