import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth, getAuthedUser } from '$lib/server/auth';
import { getUserById } from '$lib/server/database';
import type { UserSelfDTO } from '$lib/dto';

export const GET: RequestHandler = async (req) => {
    const user = await getAuthedUser(req);
    return json({
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        avatarAssetId: user.avatarAssetId
    } satisfies UserSelfDTO);
};
