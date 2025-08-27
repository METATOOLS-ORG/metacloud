import { page } from "$app/state";
import { UserProfileIncludes, type SongMiniDTO, type UserProfileDTO, CreateSongMiniDTO, CreateUserProfileDTO } from "$lib/dto";
import { prisma } from "$lib/server/database";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.params.username
        },
        include: UserProfileIncludes
    });

    if (!user) error(404, {message: "User not found", code: "USER_NOT_FOUND"});

    return json(CreateUserProfileDTO(user));
};
