import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth, getAuthedUser } from '$lib/server/auth';
import { getUserById } from '$lib/server/database';
import { CreateUserSelfDTO, type UserSelfDTO } from '$lib/dto';

export const GET: RequestHandler = async (req) => {
    // @todo: get rid of the any
    const user: any = await getAuthedUser(req);
    return json(CreateUserSelfDTO(user));
};
