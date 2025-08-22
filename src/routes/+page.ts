import type { SongMiniDTO } from '$lib/dto';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`/api/song`);
    const songs: SongMiniDTO[] = await res.json();

    return { songs: songs };
};
