import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies, locals }) => {
	return json("pong");
}