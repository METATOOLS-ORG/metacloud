import type { UserSelfDTO } from "$lib/dto";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
    if (!cookies.get("token")) return { authLoaded: true, user: null };

    const userReq = await fetch('/api/user/self');
    if (!userReq.ok) return { authLoaded: true, user: null };

    const user: UserSelfDTO = await userReq.json();
    console.log('loaded user');

    return { authLoaded: true, user: user };
};
