import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth, getAuthedUser } from '$lib/server/auth';
import { getUserById, prisma } from '$lib/server/database';
import { CreateUserSelfDTO, type UserSelfDTO, UserSelfDTO_Includes, type UserSelfDTO_Payload } from '$lib/dto';

export const GET: RequestHandler = async (req) => {
    let uid = checkAuth(req);

    let user = await prisma.user.findUnique({
        where: { id: uid },
        include: UserSelfDTO_Includes
    }) as UserSelfDTO_Payload;

    // const user: any = await getAuthedUser(req);
    return json(CreateUserSelfDTO(user));
};
