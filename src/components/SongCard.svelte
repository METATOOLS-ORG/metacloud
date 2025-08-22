<script lang="ts">
	import { getAvatarAssetUrl, getCoverAssetUrl } from "$lib/assets";
	import { globalAudioState } from "$lib/state/audioState.svelte";
	import HeartIcon from "./icons/HeartIcon.svelte";
	import PlayIcon from "./icons/PlayIcon.svelte";
	import MiniGlobalPlayer from "./MiniGlobalPlayer.svelte";
    let playing = $state(false);
    const { song, user } = $props();
</script>

<article class="songcard">
    <img class="songcard-cover" src={getCoverAssetUrl(song.coverAssetId)} alt="song cover art" width="118px" height="118px"/>
    <div class="songcard-split">
        <div class="songcard-top">
            <div class="songcard-head">
                <div class="songcard-author">
                    <img src={getAvatarAssetUrl(song.author.avatarAssetId)} height="18px" alt="author avatar"/>
                    <span>{song.author.displayName}</span>
                </div>
                <span class="songcard-time">3 hours ago</span>
            </div>
            <div class="songcard-title">
                <h1>{song.title}</h1>
                <span class="songcard-title-tag">
                    wip
                </span>
            </div>
        </div>
        <div class="songcard-player">
            <MiniGlobalPlayer {song} {user}/>
        </div>
        <div class="songcard-bottom">
            <div class="songcard-bottom-left">
                <button class="songcard-action">
                    <HeartIcon/>
                    <span>32</span>
                </button>
                <button class="songcard-action">
                    <PlayIcon/>
                    <span>12</span>
                </button>
            </div>
        <div class="songcard-bottom-right">
                <!-- <div class="songcard-like-count">
                    <span aria-label="Like count">3</span>
                    <HeartIcon/>
                </div> -->
                <span class="songcard-genre-tag">
                    #{song.genre}
                </span>
            </div>
        </div>
    </div>
</article>

<style>
    h1 {
        margin-bottom: 0;
    }
    .songcard {
        /* border-bottom: var(--border); */
        padding: 17px;
        display: flex;
        gap: 17px;
        background: var(--primary-background);
    }
    .songcard-split {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
    }
    /* .songcard-cover {
        outline: 1px solid #ffffff2e;
        outline-offset: -1px;
    } */
    .songcard-top {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .songcard-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .songcard-time {
        color: var(--text-color-info);
    }
    .songcard-author {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .songcard-title {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    .songcard-title-tag {
        padding: 4px 6px;
        /* @todo: css variable? will be weird on light themes */
        background: rgba(255, 255, 255, 0.08);
    }
    .songcard-player {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .songcard-player audio {
        width: 100%;
    }
    .songcard-player-comment {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px;
    }
    .songcard-bottom {
        display: flex;
        justify-content: space-between;
    }
    .songcard-bottom-left {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .songcard-action {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
        padding: 4px 7px;
    }
    .songcard-bottom-right {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .songcard-like-count {
        display: flex;
        align-items: center;
        gap: 7px;
    }
    .songcard-player-comment input {
        flex: 1;
    }
    .songcard-genre-tag {
        padding: 6px 8px;
        color: var(--text-color-info);
        /* @todo: css variable? will be weird on light themes */
        background: rgba(255, 255, 255, 0.08);
    }
</style>
