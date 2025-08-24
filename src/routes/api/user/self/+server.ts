import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth, getAuthedUser } from '$lib/server/auth';
import { getUserById } from '$lib/server/database';
import type { UserSelfDTO } from '$lib/dto';

export const GET: RequestHandler = async (req) => {
    // @todo: type this better (so that likes is included and i dont need to use "any")
    // see: https://github.com/prisma/prisma/discussions/10928
    const user: any = await getAuthedUser(req);
    return json({
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        avatarAssetId: user.avatarAssetId,
        likes: user.likes.map((like: {postId: string}) => like.postId)
    } satisfies UserSelfDTO);
};
