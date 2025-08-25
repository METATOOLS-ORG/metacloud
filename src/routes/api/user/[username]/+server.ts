import { page } from "$app/state";
import type { SongMiniDTO, UserProfileDTO } from "$lib/dto";
import { prisma } from "$lib/server/database";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.params.username
        },
        include: {
            songs: {
                orderBy: {
                    id: "desc"
                },
                include: {
                    author: true,
                    audioAsset: {
                        select: {
                            waveformJSON: true,
                            duration: true
                        }
                    },
                    likes: {
                        select: {
                            userId: true
                        }
                    }
                }
            }
        }
    })

    if (!user) error(404, {message: "User not found", code: "USER_NOT_FOUND"});

    const dtoSongs = user.songs.map((song) => {
        return {
            id: song.id,
            date: song.date,
            title: song.title,
            url: song.url,
            genre: song.genre,
            audioAssetId: song.audioAssetId,
            coverAssetId: song.coverAssetId,
            waveformJSON: song.audioAsset.waveformJSON,
            duration: song.audioAsset.duration,
            tagWip: song.tagWip,
            tagFeedback: song.tagFeedback,
            author: {
                id: song.author.id,
                displayName: song.author.displayName,
                username: song.author.username,
                avatarAssetId: song.author.avatarAssetId,
            },
            likes: song.likes.map((like: {userId: string}) => like.userId)
        } satisfies SongMiniDTO;
    });

    return json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarAssetId: user?.avatarAssetId,
        date: user.date,
        bio: user.bio,
        songs: dtoSongs
    } satisfies UserProfileDTO);
};
