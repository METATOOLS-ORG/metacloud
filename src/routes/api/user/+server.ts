import { z } from 'zod';
import type { RequestHandler } from './$types';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { validate, AlphanumericDotsOnly } from '$lib/server/validation';
import { getUserByTag, prisma } from '$lib/server/database';
import { checkAuth, generateToken } from '$lib/server/auth';
import type { UserProfileDTO } from '$lib/dto';
import 'dotenv/config'
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';

/** Create a new user (sign up) */
export const POST: RequestHandler = async (req) => {
    if (process.env.ALLOW_CREATING_ACCOUNTS != "1") {
        error(404, { message: "Signing up is currently disabled", code: "SIGN_UP_DISABLED"});
    }

    const data = await validate(req, {
        username: z
            .string()
            .trim()
            .max(24)
            .regex(AlphanumericDotsOnly, 'Must only contain letters, numbers and dots'),
        displayName: z.string().max(24),
        email: z.string().trim().email(),
        password: z.string(),
        inviteCode: z.string()
    });

    /* @todo: .env this */
    if (data.inviteCode != 'somecode') {
        error(401, { message: 'Invalid invite code', code: 'INVALID_INVITE_CODE' });
    }

    if (await getUserByTag(data.username)) {
        error(409, { message: 'Username already taken', code: 'USERNAME_TAKEN' });
    }

    const user = await prisma.user.create({
        data: {
            username: data.username,
            displayName: data.displayName,
            email: data.email,
            passwordHash: data.password,
			bio: `I'm new to ${PUBLIC_WEBSITE_NAME}!`
        }
    });
    let token = generateToken(user.id);
    req.cookies.set("token", token, {path: "/"});
    return json({ id: user.id, username: user.username, token: token });
};
