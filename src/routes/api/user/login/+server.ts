import { z } from 'zod';
import type { RequestHandler } from './$types';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { validate, AlphanumericDotsOnly } from '$lib/server/validation';
import { AssetType, AssetPurpose, PrismaClient } from '@prisma/client';
import { getUserByTag, prisma } from '$lib/server/database';
import { checkAuth, generateToken } from '$lib/server/auth';

/** Log in to a user account */
export const POST: RequestHandler = async (req) => {
    if (process.env.ALLOW_LOGIN != "1") {
        error(404, { message: "Logging in is currently disabled", code: "LOGIN_DISABLED"});
    }

    const data = await validate(req, {
        username: z.string().trim().max(24)
            .regex(AlphanumericDotsOnly, 'Must only contain letters, numbers and dots'),
        password: z.string()
    });

    const user = await getUserByTag(data.username);

    if (!user) {
        error(404, { message: 'Username does not exist', code: 'USERNAME_NOT_FOUND' });
    }

    if (user.passwordHash != data.password) {
        error(401, { message: 'Incorrect password', code: 'WRONG_PASSWORD' });
    }

    let token = generateToken(user.id);
    // @todo: security?
    req.cookies.set('token', token, { path: '/', httpOnly: false, secure: false, sameSite: "lax" });
    return json({ id: user.id, token: token });
};
