import type { SongDTO } from '$lib/dto';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`/api/song`);
    const songs: SongDTO[] = await res.json();

    return { songs: songs };
};
