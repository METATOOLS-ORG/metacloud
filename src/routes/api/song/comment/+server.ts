import { getAuthedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "$lib/server/validation";
import { z } from "zod";
import { prisma } from "$lib/server/database";
import type { SongDTO } from "$lib/dto";

// @todo: move to another file?
function noContent() {
    return new Response(undefined, { status: 204 })
}

export const PUT: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);

    /* @todo: validate songtime in bounds of song */
    const data = await validate(req, {
        songId: z.string(),
        songTime: z.number(),
        content: z.string().min(1).max(256)
    });

    const song = await prisma.song.findUnique({
        where: {
            id: data.songId,
        }
    });

    if (!song) error(404, {"message": "Song does not exist", code: "SONG_NOT_FOUND"});

    const comment = await prisma.songComment.create({
        data: {
            userId: user.id,
            songId: data.songId,
            songTime: data.songTime,
            content: data.content
        }
    })

    return json({"commentId": comment.id});
}

/* @todo: get api for getting specific comments and delete api for deleting them */
