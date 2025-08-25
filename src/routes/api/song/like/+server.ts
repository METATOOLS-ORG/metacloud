import { getAuthedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "$lib/server/validation";
import { z } from "zod";
import { prisma } from "$lib/server/database";
import type { SongMiniDTO } from "$lib/dto";

// @todo: move to another file?
function noContent() {
    return new Response(undefined, { status: 204 })
}

export const PUT: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);

    const data = await validate(req, {
        songId: z.string()
    });

    const song = await prisma.song.findUnique({
        where: {
            id: data.songId
        }
    });

    if (!song) error(404, {"message": "Song does not exist", code: "SONG_NOT_FOUND"});

    const songLike = await prisma.songLike.findFirst({
        where: {
            postId: data.songId,
            userId: user.id
        }
    });

    if (songLike) return noContent();

    await prisma.songLike.create({
        data: {
            postId: data.songId,
            userId: user.id
        }
    })

    return noContent();
}

export const DELETE: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);

    const data = await validate(req, {
        songId: z.string()
    });

    const songLike = await prisma.songLike.findFirst({
        where: {
            postId: data.songId,
            userId: data.userId
        }
    });

    if (!songLike) return noContent();

    await prisma.songLike.delete({
        where: {
            id: songLike.id
        }
    })

    return noContent();
}
