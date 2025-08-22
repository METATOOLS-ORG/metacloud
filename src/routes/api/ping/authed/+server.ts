import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { checkAuth } from "$lib/server/auth";

export const GET: RequestHandler = async (req) => {
	const uid = checkAuth(req);
	return json({ "ping": "pong", "uid": uid });
}