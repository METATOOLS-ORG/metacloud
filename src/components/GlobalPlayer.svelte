<script lang="ts">
    import { getAssetUrl, getAvatarAssetUrl, getCoverAssetUrl } from '$lib/assets';
    import { globalAudioState } from '$lib/state/audioState.svelte';
	import { formatSongTime } from '$lib/time';
	import { onMount } from 'svelte';
    import HeartIcon from './icons/HeartIcon.svelte';
    import PauseIcon from './icons/PauseIcon.svelte';
    import PlayIcon from './icons/PlayIcon.svelte';

    function sliderChanged(e: Event) {
        let sliderElem = e.currentTarget as HTMLInputElement;
        if (!sliderElem) return;
        let newTime = parseFloat(sliderElem.value);
        if (!globalAudioState.audio) return;
        globalAudioState.audio.currentTime = newTime;
    }
    onMount(() => {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            // @todo: is using document.activeElement for this in svelte a hack?
            if (
                e.code == "Space"
                && globalAudioState.playingSong
                && globalAudioState.song
                && document.activeElement?.nodeName != "INPUT"
                && document.activeElement?.nodeName != "TEXTAREA"
            ) {
                e.preventDefault();
                globalAudioState.togglePlayback();
            }
        })
    });
</script>

{#if globalAudioState.playingSong && globalAudioState.song}
    <section class="globalplayer">
        <div class="globalplayer-left">
            <img
                class="globalplayer-cover"
                src={getCoverAssetUrl(globalAudioState.song.coverAssetId)}
                width="68px"
                height="68px"
                alt="song cover art"
            />
            <div class="globalplayer-songinfo">
                <h1 class="globalplayer-songname">
                    {globalAudioState.song.title}
                </h1>
                <div class="globalplayer-songauthor">
                    <img
                        src={getAvatarAssetUrl(globalAudioState.song.author.avatarAssetId)}
                        width="16px"
                        height="16px"
                        alt="author avatar"
                    />
                    <span>{globalAudioState.song.author.displayName}</span>
                </div>
            </div>
        </div>
        <div class="globalplayer-middle">
            <div class="globalplayer-controls">
                <button onclick={globalAudioState.togglePlayback}>
                    {#if globalAudioState.paused }
                        <PlayIcon/>
                    {:else}
                        <PauseIcon/>
                    {/if}
                </button>
            </div>
            <div class="globalplayer-timeline">
                <span class="globalplayer-time position">
                    {formatSongTime(globalAudioState.currentTime)}
                </span>
                <input
                    type="range"
                    class="globalplayer-slider"
                    min="0"
                    max={globalAudioState.duration}
                    value={globalAudioState.currentTime}
                    step="0.25"
                    onchange={sliderChanged}
                />
                <span class="globalplayer-time total">
                    {formatSongTime(globalAudioState.duration)}
                </span>
            </div>
        </div>
        <div class="globalplayer-right">
                <button class="globalplayer-action">
                    <PlayIcon/>
                    <span>3</span>
                </button>
                <button class="globalplayer-action">
                    <HeartIcon/>
                    <span>32</span>
                </button>
        </div>
    </section>
{/if}

<style>
    .globalplayer {
        display: flex;
        justify-content: space-between;
        border-top: var(--border);
        background: var(--globalplayer-background);
        position: fixed;
        bottom: 0;
        width: var(--page-width);
        z-index: 7;
    }
    .globalplayer-left {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .globalplayer-left,
    .globalplayer-right {
        flex: 1;
    }
    .globalplayer-middle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 9px;
        text-align: center;
    }
    .globalplayer-songinfo {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .globalplayer-songname {
        margin-bottom: 0;
        font-weight: normal;
    }
    .globalplayer-songauthor {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-color-info);
    }
    .globalplayer-controls {
        display: flex;
        justify-content: center;
    }
    .globalplayer-timeline {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 350px;
        color: var(--text-color-info);
    }
    .globalplayer-slider {
        flex: 1;
        height: 6px;
    }
    .globalplayer-controls button {
        padding: 5px 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .globalplayer-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
    }
    .globalplayer-right {
        margin-right: 12px;
    }
    .globalplayer-action {
        gap: 6px;
    }
</style>
