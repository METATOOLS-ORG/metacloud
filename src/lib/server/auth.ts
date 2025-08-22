import type { User } from "@prisma/client";
import type { GetPayloadResult } from "@prisma/client/runtime/library";
import { error, type Cookies, type RequestEvent } from "@sveltejs/kit";
import { createHmac } from "node:crypto";
import { getUserById } from "./database";

/** Generate a signed user login token using HMAC */
export function generateToken(userId: string): string {
    // @todo: generate the secret key in RAM in prod
    const hmac = createHmac("sha256", "DEV_TEMPHMAC_KEY");
    hmac.update(userId);
    return userId + "$$" + hmac.digest("hex");
}

/** Check the given token or bearer auth on any SvelteKit API request */
export function checkAuth(req: RequestEvent): string {
    let givenToken = req.cookies.get("token");

    // Try to get the auth token from the header if not in cookies
    if (!givenToken) {
        const authHeader = req.request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            givenToken = authHeader.slice(7); // Remove bearer prefix
        }
    }

    if (!givenToken) error(401, { message: "Authentication required", code: "NO_TOKEN" });

    let givenUID = givenToken.split("$$")[0];
    if (generateToken(givenUID) == givenToken) {
        return givenUID;
    }

    error(401, { message: "Invalid auth token", code: "INVALID_TOKEN" });
}

export async function getAuthedUser(req: RequestEvent): Promise<GetPayloadResult<User, {}>> {
    let uid = checkAuth(req);
    let user = await getUserById(uid);
    if (!user) error(401, {
        message: "Given token is valid but the user associated with the token was not found",
        code: "INVALID_TOKEN_NO_USER"
    });
    return user;
}
