import { getAuthedUser } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "$lib/server/validation";
import { z } from "zod";
import { prisma } from "$lib/server/database";
import { SongDTO_Includes, type SongDTO, CreateSongDTO } from "$lib/dto";

export const POST: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);

    // @todo: add these length and style limits to the upload page
    const data = await validate(req, {
        coverAssetId: z.string().nullish(),
        audioAssetId: z.string(),
        title: z.string().trim().max(48),
        desc: z.string().trim().max(4000),
        genre: z.string().trim().max(24),
        // @todo: validate "kebab case"
        url: z.string().trim().max(48),
        tagWip: z.boolean(),
        tagFeedback: z.boolean(),
		sketch: z.boolean(),
		release: z.boolean(),
		pin: z.boolean(),
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
            tagWip: data.tagWip,
            tagFeedback: data.tagFeedback,
			sketch: data.sketch,
			release: data.release,
			pinned: data.pin
        }
    });

    return json({"id": song.id, "url": `/@${user.username}/${song.url}`});
}

export const GET: RequestHandler = async (req) => {
    const songs = await prisma.song.findMany({
        orderBy: { id: "desc" },
        include: SongDTO_Includes
    });
    return json(songs.map((song) => CreateSongDTO(song)));
}
