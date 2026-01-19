import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { getAuthedUser } from "$lib/server/auth";
import fs, { writeFile } from 'fs/promises';
import { ulid } from "ulid";
import path from "path";
import { prisma } from "$lib/server/database";
import { AssetPurpose, AssetType } from '../../../../prisma/generated/prisma/client';
import * as s3 from "$lib/server/s3";
import type { AssetUploadRespDTO } from "$lib/dto";
import { exec } from "child_process";
import { promisify } from "util";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { PUBLIC_STORAGE_MODE } from '$env/static/public';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
      throw new Error(`Unsupported MIME type: ${mimeType}`);
  }
}

export const GET: RequestHandler = async ({ request, cookies, locals }) => {
	return json("pong");
}

function MbToBytes(mb: number) {
    return Math.round(mb * 1024 * 1024);
}

// @todo: is this ok?
const UPLOAD_DIR = path.join(process.cwd(), 'static', 'ugc_uploads');

interface FileUploadResponse {
	url: string;
	key: string;
}

async function uploadFileLocally(
	data: Uint8Array | Buffer,
	key: string,
	mimetype: string
): Promise<FileUploadResponse> {
	const filePath = path.join(UPLOAD_DIR, key);
	const fileDir = path.dirname(filePath);

	await fs.writeFile(filePath, data);

	return {
		url: `/static/ugc_uploads/${key}`,
		key: key
	}
}


export const POST: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);
    const data = await req.request.formData();
    const file = data.get("asset") as File;

    if (!file) error(422, {message: "No asset file given", code: "NO_ASSET_FIELD_IN_FORMDATA"});
    if (file.size > MbToBytes(60)) error(413, {message: "File is too big, max 60 MB", code: "FILE_ABOVE_SIZE_LIMIT"})

    const fileData = new Uint8Array(await file.arrayBuffer());

    const assetId = ulid();

    let waveformJSON = null;
    let duration = null;

    if (file.type.startsWith("audio/")) {
        // Calculate audio duration and waveform
        let audioExt;
        try {
            audioExt = mapMimeTypeToFormat(file.type);
        } catch (err) {
            error(500, {
                message: "Unsupported audio format (allowed: wav, mp3, flac, ogg, opus)",
                code: "UNSUPPORTED_AUDIO_MIMETYPE"
            })
        }

        const tempPath = `./ugc_temp/${assetId}.${audioExt}`;
        try {
            await writeFile(tempPath, fileData);
        } catch (err) {
            error(500, {
                message: "Failed to temporarily write file to server (server is out of disk space?)",
                code: "TEMP_FILE_WRITE_FAILED"
            });
        }

        // Precalculate audio duration using ffprobe
        // @todo: custom ffprobe path in config and docs
        try {
            duration = await getAudioDurationInSeconds(tempPath);
        } catch (err) {
            console.trace(err);
            error(500, {
                message: "Failed to calculate audio duration for file (unsupported or corrupted audio file?)",
                code: "FFPROBE_FAILED"
            });
        }
        // Pregenerate audio waveform using audiowaveform
        // @todo: is using process.cwd() going to cause problems?
        // @todo: add documentation about setting up audiowaveform in path or a config to point to it
        // @todo: better error handling (stderr?)
        // @todo: dynamic pixels per second depending on length
        // @todo: automatically delete file from ugc_temp after the waveform is generated
        // @todo: prenormalize waveform data for performance https://wavesurfer.xyz/faq/
        try {
            const { stdout } = await execAsync(
                `audiowaveform -i ${tempPath} --output-format json --pixels-per-second 30 --bits 8 -q`,
                { cwd: process.cwd() }
            );
            waveformJSON = stdout;
        } catch (err) {
            console.trace(err);
            error(500, {
                message: "Failed to generate audio waveform for file (unsupported or corrupted audio file?)",
                code: "WAVEFORM_GENERATION_FAILED"
            });
        }
    }



    // Upload the file either locally or thru S3
    let uploadResult: FileUploadResponse;
    try {
		if (PUBLIC_STORAGE_MODE === "S3") {
			uploadResult = await s3.uploadFile(fileData, assetId, file.type);
		} else if (PUBLIC_STORAGE_MODE === "LOCAL") {
			uploadResult = await uploadFileLocally(fileData, assetId, file.type);
		}
	} catch (err) {
        console.trace(err);
        error(500, {message: "Failed to write file to server", code: "FILE_WRITE_FAILED"});
    }
	console.log("!!!! UPLOAD RESULT !!!!", uploadResult!);

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
    // todo: get rid of url because it is always undefined
    return json({id: assetId, url: uploadResult!.url} satisfies AssetUploadRespDTO);
}
