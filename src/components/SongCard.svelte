<script lang="ts">
	import { post } from "$lib/api";
	import { getAvatarAssetUrl, getCoverAssetUrl } from "$lib/assets";
	import { globalAudioState } from "$lib/state/audioState.svelte";
	import HeartIcon from "./icons/HeartIcon.svelte";
	import PlayIcon from "./icons/PlayIcon.svelte";
	import VerifiedIcon from "./icons/VerifiedIcon.svelte";
	import MiniGlobalPlayer from "./MiniGlobalPlayer.svelte";
	import WavesurferPlayer from "./WavesurferPlayer.svelte";
    let playing = $state(false);
    const { song, user } = $props();

    let liked = $state(user.likes.includes(song.id));
    let likedOriginally = $state(user.likes.includes(song.id));

    let fakeLikeOffset = $state(0);

    function likeButton(e: MouseEvent) {
        // Immediately like client side to avoid api latency being visible
        // @todo: this code could probably be better
        let apiRoute = liked ? "song/unlike" : "song/like";
        if (liked) {
            liked = false;
            fakeLikeOffset = likedOriginally ? -1 : 0;
        } else {
            liked = true;
            fakeLikeOffset = likedOriginally ? 0 : 1;
        }
        post(apiRoute, {
            "songId": song.id
        })
    }
</script>

<article class="songcard">
    <img class="songcard-cover" src={getCoverAssetUrl(song.coverAssetId)} alt="song cover art" width="118px" height="118px"/>
    <div class="songcard-split">
        <div class="songcard-top">
            <div class="songcard-head">
                <div class="songcard-author">
                    <img src={getAvatarAssetUrl(song.author.avatarAssetId)} height="20px" alt="author avatar"/>
                    <span>{song.author.displayName}</span>
                    <!-- @todo: user database verified field -->
                    <a class="songcard-author-checkmark" href="#test">
                        <VerifiedIcon/>
                    </a>
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
            <!-- <MiniGlobalPlayer {song} {user}/> -->
            <WavesurferPlayer {song} {user}/>
        </div>
        <div class="songcard-bottom">
            <div class="songcard-bottom-left">
                <button class="songcard-action songcard-like-btn" class:accent={liked} onclick={likeButton}>
                    <HeartIcon/>
                    <span>{song.likes.length + fakeLikeOffset}</span>
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
        gap: 5px;
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
    .songcard-author-checkmark {
        /* visual offset */
        padding-top: 3px;
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
