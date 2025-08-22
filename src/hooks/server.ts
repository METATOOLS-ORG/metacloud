import { generateToken } from '$lib/server/auth';
import { error, type Handle } from '@sveltejs/kit';

/** This runs on every server api and page request */
export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    return response;
};
