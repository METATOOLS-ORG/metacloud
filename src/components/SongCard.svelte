<script lang="ts">
	import api from "$lib/api";
	import { getAvatarAssetUrl, getCoverAssetUrl } from "$lib/assets";
	import { globalAudioState } from "$lib/state/audioState.svelte";
	import CommentIcon from "./icons/CommentIcon.svelte";
	import HeartIcon from "./icons/HeartIcon.svelte";
	import PlayIcon from "./icons/PlayIcon.svelte";
	import RepostIcon from "./icons/RepostIcon.svelte";
	import SketchIcon from "./icons/SketchIcon.svelte";
	import VerifiedIcon from "./icons/VerifiedIcon.svelte";
	import WipIcon from "./icons/WIPIcon.svelte";
	import MiniGlobalPlayer from "./MiniGlobalPlayer.svelte";
	import WavesurferPlayer from "./WavesurferPlayer.svelte";
    let playing = $state(false);
    const { song, user } = $props();

    let liked = $state(false);
    let likedOriginally = $state(false);
    if (user) {
        liked = user.likes.includes(song.id);
        likedOriginally = user.likes.includes(song.id);
    }
    let fakeLikeOffset = $state(0);

    function likeButton(e: MouseEvent) {
        // Immediately like client side to avoid api latency being visible
        if (!user) {
            location.href = "/login"
            return;
        }

        // @todo: this code could probably be better
        if (liked) {
            api.delete("song/like", {"songId": song.id});
            liked = false;
            fakeLikeOffset = likedOriginally ? -1 : 0;
        } else {
            api.put("song/like", {"songId": song.id});
            liked = true;
            fakeLikeOffset = likedOriginally ? 0 : 1;
        }
    }
</script>

<article class="songcard">
    <img class="songcard-cover" src={getCoverAssetUrl(song.coverAssetId)} alt="song cover art" width="118px" height="118px"/>
    <div class="songcard-split">
        <div class="songcard-top">
            <div class="songcard-head">
                <div class="songcard-author">
                    <a class="songcard-author-link" href="/@{song.author.username}">
                        <img src={getAvatarAssetUrl(song.author.avatarAssetId)} height="20px" alt="author avatar"/>
                        <span>{song.author.displayName}</span>
                    </a>
                    <!-- @todo: user database verified field -->
                    <a class="songcard-author-checkmark" href="#test">
                        <VerifiedIcon/>
                    </a>
                </div>
                <span class="songcard-time">3 hours ago</span>
            </div>
            <div class="songcard-title">
                <div class="songcard-title-left">
                    <h1>{song.title}</h1>
                    {#if song.tagWip}
                        <span class="songcard-title-tag wip">
                            wip
                            <!-- <WipIcon/> -->
                        </span>
                    {/if}
                </div>
                <div class="songcard-title-right">
                    {#if song.tagFeedback}
                        <span class="songcard-title-tag feedback">
                            <!-- feedback -->
                            <CommentIcon/>
                        </span>
                    {/if}
                    <span class="songcard-title-tag sketch">
                        <SketchIcon/>
                    </span>
                </div>
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
                    <RepostIcon/>
                    <span>12</span>
                </button>

            </div>
        <div class="songcard-bottom-right">
                <!-- <div class="songcard-like-count">
                    <span aria-label="Like count">3</span>
                    <HeartIcon/>
                </div> -->
                <div class="songcard-play-count">
                    <PlayIcon/>
                    32
                </div>
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
        padding: 16px;
        display: flex;
        gap: 17px;
        background: var(--primary-background);
    }
    .songcard-split {
        display: flex;
        flex-direction: column;
        gap: 9px;
        flex: 1;
    }
    /* .songcard-cover {
        outline: 1px solid #ffffff2e;
        outline-offset: -1px;
    } */
    .songcard-top {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .songcard-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .songcard-time {
        color: var(--text-color-info);
         margin-bottom: 1px;
    }
    .songcard-author {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .songcard-author-checkmark {
        /* visual offset */
        display: flex;
        padding-top: 2px;
    }
    .songcard-title {
        display: flex;
        gap: 6px;
        align-items: center;
        min-height: 23px;
        justify-content: space-between;
    }
    .songcard-title-left, .songcard-title-right {
        display: flex;
        gap: 6px;
        align-items: center;
        min-height: 20px;
    }
    .songcard-title-tag {
        padding: 4px 5px;
        /* @todo: css variable? will be weird on light themes */
        background: var(--accent-tinted-tag);
        color: var(--accent-color);
        font-weight: 500;
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
        padding: 5px 8px;
        min-width: 43px;
        border: none;
    }
    .songcard-bottom-right {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .songcard-genre-tag {
        padding: 6px 8px;
        color: var(--text-color-info);
        /* @todo: css variable? will be weird on light themes */
        background: rgba(255, 255, 255, 0.08);

    }

    /* @todo: move to global and make a nolink class? */
    a {
        display: contents;
        color: var(--text-color);
    }

    .songcard-play-count {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text-color-info);
    }

    :global(.songcard-play-count > .flat-icon) {
        margin-top: 1px;
        color: var(--text-color-info);
        opacity: 0.6;
    }



</style>
