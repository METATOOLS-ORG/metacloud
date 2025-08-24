<!-- @todo: make a generic post component instead (and don't use any of this fucked up code i morphed out of songcard) -->

<script lang="ts">
	import { getAvatarAssetUrl, getCoverAssetUrl } from "$lib/assets";
	import { globalAudioState } from "$lib/state/audioState.svelte";
	import HeartIcon from "./icons/HeartIcon.svelte";
	import PlayIcon from "./icons/PlayIcon.svelte";
	import MiniGlobalPlayer from "./MiniGlobalPlayer.svelte";
	import WavesurferPlayer from "./WavesurferPlayer.svelte";
    let playing = $state(false);
    const { song, user } = $props();
</script>

<article class="songpostcard">
    <img src={getAvatarAssetUrl(song.author.avatarAssetId)} height="34px" alt="author avatar"/>
    <div class="songpostcard-split">

        <div class="songpostcard-top">
            <div class="songpostcard-head">
                <div class="songpostcard-author">

                    <span>{song.author.displayName}</span>
                    <span class="info">@{song.author.username}</span>

                </div>
                <span class="info">3h</span>
            </div>
        </div>
        <div class="songpostcard-content">
            <span class="songpostcard-text">here is my exciting new song</span>
        </div>
        <div class="songpostcard-song">
            <img class="songpostcard-cover" src={getCoverAssetUrl(song.coverAssetId)} alt="song cover art" width="105px" height="105px"/>
            <!-- <MiniGlobalPlayer {song} {user}/> -->
            <div class="songpostcard-song-split">
                <div class="songpostcard-title-split">
                    <div class="songpostcard-title">
                        <h1>{song.title}</h1>
                        <span class="songpostcard-title-tag">
                            wip
                        </span>
                    </div>
                    <span class="songpostcard-genre-tag">
                        #{song.genre}
                    </span>
                </div>
                <WavesurferPlayer {song} {user}/>
            </div>
        </div>
        <div class="songpostcard-bottom">
            <div class="songpostcard-bottom-left">
                <button class="songpostcard-action">
                    <HeartIcon/>
                    <span>32</span>
                </button>
                <button class="songpostcard-action">
                    <PlayIcon/>
                    <span>12</span>
                </button>
            </div>
        <div class="songpostcard-bottom-right">
                <!-- <div class="songpostcard-like-count">
                    <span aria-label="Like count">3</span>
                    <HeartIcon/>
                </div> -->
                <button>Share</button>
            </div>
        </div>
    </div>
</article>

<style>
    h1 {
        margin-bottom: 0;
    }
    .songpostcard {
        /* border-bottom: var(--border); */
        padding: 17px;
        display: flex;
        gap: 15px;
        background: var(--primary-background);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .songpostcard-split {
        display: flex;
        flex-direction: column;
        gap: 11px;
        flex: 1;
    }
    /* .songpostcard-cover {
        outline: 1px solid #ffffff2e;
        outline-offset: -1px;
    } */
    .songpostcard-top {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .songpostcard-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .songpostcard-time {
        color: var(--text-color-info);
    }
    .songpostcard-author {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .songpostcard-title {
        display: flex;
        gap: 6px;
        align-items: center;
        padding: 8px 12px;
    }
    .songpostcard-title-tag {
        padding: 4px 6px;
        /* @todo: css variable? will be weird on light themes */
        background: rgba(255, 255, 255, 0.08);
    }
    .songpostcard-song {
        display: flex;
        flex-direction: row;
        flex: 1;
        background: #33343d;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .songpostcard-song-split {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
    }
    .songpostcard-bottom {
        display: flex;
        justify-content: space-between;
    }
    .songpostcard-bottom-left {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .songpostcard-action {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
        padding: 4px 7px;
    }
    .songpostcard-bottom-right {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .songpostcard-like-count {
        display: flex;
        align-items: center;
        gap: 7px;
    }
    .songpostcard-player-comment input {
        flex: 1;
    }
    .songpostcard-genre-tag {
        padding: 5px 7px;
        color: var(--text-color-info);
        /* @todo: css variable? will be weird on light themes */
        background: rgba(255, 255, 255, 0.08);
    }

    .songpostcard-content {
        margin-bottom: 4px;
    }
    .songpostcard-title-split {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 8px;
    }
</style>
