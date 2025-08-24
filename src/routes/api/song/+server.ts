import { getAuthedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "$lib/server/validation";
import { z } from "zod";
import { prisma } from "$lib/server/database";
import type { SongMiniDTO } from "$lib/dto";

export const POST: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);

    // @todo: add these length and style limits to the upload page
    const data = await validate(req, {
        coverAssetId: z.string().nullish(),
        audioAssetId: z.string(),
        title: z.string().trim().max(24),
        desc: z.string().trim().max(4000),
        genre: z.string().trim().max(24),
        // @todo: validate "kebab case"
        url: z.string().trim().max(24), 
        tagPin: z.boolean(),
        tagWip: z.boolean(),
        tagFeedback: z.boolean()
    });

    // @todo: implement asset validation (and add a purpose field too)
    // make sure to unmark the assets as temp too
    // await validateAsset(data.coverAssetId)
    // await validateAsset(data.audioAssetId)

    const song = await prisma.song.create({
        data: {
            authorId: user.id,
            coverAssetId: data.coverAssetId,
            audioAssetId: data.audioAssetId,
            title: data.title,
            desc: data.desc,
            genre: data.genre,
            url: data.url,
            tagPin: data.tagPin,
            tagWip: data.tagWip,
            tagFeedback: data.tagFeedback,
        }
    });

    return json({"id": song.id, "url": `/@${user.username}/${song.url}`});
}

export const GET: RequestHandler = async (req) => {
    const songs = await prisma.song.findMany({
        orderBy: {
            id: "desc"
        },
        include: {
            author: true
        }
    })
    const dtoSongs = songs.map((song) => {
        return {
            id: song.id,
            date: song.date,
            title: song.title,
            url: song.url,
            genre: song.genre,
            audioAssetId: song.audioAssetId,
            coverAssetId: song.coverAssetId,
            author: {
                id: song.author.id,
                displayName: song.author.displayName,
                username: song.author.username,
                avatarAssetId: song.author.avatarAssetId,
            }
        } satisfies SongMiniDTO;
    })
    return json(dtoSongs);
}
