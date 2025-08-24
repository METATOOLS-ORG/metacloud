import { getAssetUrl } from "$lib/assets";
import type { SongMiniDTO, UserSelfDTO } from "$lib/dto";
import { browser } from '$app/environment';

interface GlobalAudioState {
    playingSong: boolean,
    song?: SongMiniDTO,
    audio?: HTMLAudioElement,
    duration: number,
    currentTime: number,
    paused: boolean,
    seeking: boolean,
    playSong: (song: SongMiniDTO) => void,
    togglePlayback: () => void
}

export const globalAudioUpdate = () => {
    // don't update while seeking because it would mess up the users input
    if (globalAudioState.seeking) return;
    globalAudioState.duration = globalAudioState.audio?.duration || 0;
    globalAudioState.currentTime = globalAudioState.audio?.currentTime || 0;
    globalAudioState.paused = globalAudioState.audio?.paused || false;
    console.log(globalAudioState.currentTime);
};

let audioUpdateIntervalSet = false;

const playSong = (song: SongMiniDTO) => {
    if (!browser) return;
    if (!globalAudioState.audio) {
        globalAudioState.audio = new Audio();
    }
    globalAudioState.playingSong = true;
    globalAudioState.song = song;
    globalAudioState.audio.src = getAssetUrl(song.audioAssetId);
    globalAudioState.currentTime = 0;
    globalAudioState.audio.play();
    if (!audioUpdateIntervalSet) {
        setInterval(globalAudioUpdate, 25);
        audioUpdateIntervalSet = true;
    }
}

const playUnpublishedAudioAsset = (audioAssetId: string, user: UserSelfDTO) => {
    // @todo: turn SongMiniDTO into something like SongMetadata which the the dto contains
    let songMetadata: SongMiniDTO = {
        id: "",
        date: new Date(),
        title: "Song preview",
        url: "",
        genre: "",
        audioAssetId: audioAssetId,
        author: {
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            avatarAssetId: user.avatarAssetId
        }
    }
    globalAudioState.playSong(songMetadata);
}

const togglePlayback = () => {
    if (!globalAudioState.audio) return;
    if (globalAudioState.audio.paused) {
        globalAudioState.audio.play();
        globalAudioState.paused = false;
    } else {
        globalAudioState.audio.pause();
        globalAudioState.paused = true;
    }
}

export const globalAudioState: GlobalAudioState = $state({
    playingSong: false,
    song: undefined,
    audio: undefined,
    duration: 0,
    currentTime: 0,
    paused: true,
    seeking: false,
    playSong: playSong,
    togglePlayback: togglePlayback,
    playUnpublishedAudioAsset: playUnpublishedAudioAsset
});
