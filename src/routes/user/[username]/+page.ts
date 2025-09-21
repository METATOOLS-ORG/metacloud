import type { SongDTO, UserProfileDTO } from '$lib/dto';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(`/api/user/${params.username}`);
    const user: UserProfileDTO = await res.json();

    return { profile: user };
};
