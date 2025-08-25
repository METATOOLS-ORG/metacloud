import { getAuthedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "$lib/server/validation";
import { z } from "zod";
import { prisma } from "$lib/server/database";
import type { SongMiniDTO } from "$lib/dto";

export const POST: RequestHandler = async (req) => {
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

    if (!songLike) return json({});

    await prisma.songLike.delete({
        where: {
            id: songLike.id
        }
    })

    return json({"success": true});
}
