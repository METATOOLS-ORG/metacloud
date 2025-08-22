import { z } from 'zod';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { parse } from 'path';

// Common regexes for zod
export const AlphanumericDotsOnly = new RegExp(/^[a-zA-Z0-9.]+$/i);

/** A helper for Zod input validation for SvelteKit APIs */
export async function validate(req: RequestEvent, schema: z.ZodRawShape) {
	// Make sure the given input is in valid json
	let inputJson;
	try {
		inputJson = await req.request.json();
	} catch {
		error(415, { message: 'Invalid JSON given', code: 'INVALID_JSON' });
	}

	let parseResult = z.object(schema).safeParse(inputJson);
	if (!parseResult.success) {
		error(422, {
			message: 'Validation error',
			code: 'VALIDATION_ERROR',
			validationErrors: parseResult.error.flatten()
		});
	}
	return parseResult.data;
}
