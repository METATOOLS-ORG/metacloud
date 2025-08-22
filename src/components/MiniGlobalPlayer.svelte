<script lang="ts">
    import { getAssetUrl, getAvatarAssetUrl } from '$lib/assets';
    import { globalAudioState } from '$lib/state/audioState.svelte';
	import { formatSongTime } from '$lib/time';
    import HeartIcon from './icons/HeartIcon.svelte';
    import PauseIcon from './icons/PauseIcon.svelte';
    import PlayIcon from './icons/PlayIcon.svelte';

    const { song, user } = $props();
    let isPlaying = $derived(globalAudioState.playingSong && globalAudioState?.song?.id == song.id);

    function sliderChanged(e: InputEvent) {
        let sliderElem = e.currentTarget as HTMLInputElement;
        if (!sliderElem) return;
        let newTime = parseFloat(sliderElem.value);
        if (!globalAudioState.audio) return;
        globalAudioState.audio.currentTime = newTime;
        globalAudioState.currentTime = newTime;
        // @todo: no seeking support yet
    }
    function sliderMouseDown(e: Event) {
        globalAudioState.seeking = true;
    }
    function sliderMouseUp(e: Event) {
        globalAudioState.seeking = false;
    }
</script>


<section class="miniplayer">
        <div class="miniplayer-player">
            {#if isPlaying}
                <!-- Actual mini player that controls the global audio state -->
                <div class="miniplayer-controls">
                    <button onclick={globalAudioState.togglePlayback}>
                        {#if globalAudioState.paused }
                            <PlayIcon/>
                        {:else}
                            <PauseIcon/>
                        {/if}
                    </button>
                </div>
                <span class="miniplayer-time"
                    >{formatSongTime(globalAudioState.currentTime)} / {formatSongTime(globalAudioState.duration)}
                </span>
                <input
                    type="range"
                    class="miniplayer-slider"
                    min="0"
                    max={globalAudioState.duration}
                    value={globalAudioState.currentTime}
                    step="0.25"
                    onchange={sliderChanged}
                    onmousedown={sliderMouseDown}
                    onmouseup={sliderMouseUp}
                />
            {:else}
                <!-- Nonfunctional mini player that only shows the song metadata -->
                <div class="miniplayer-controls">
                    <button onclick={ () => { globalAudioState.playSong(song) } }>
                        <PlayIcon/>
                    </button>
                </div>

                <!-- @TODO: store song duration in database using asset relation -->
                <span class="miniplayer-time position">
                    0:00 / 0:00
                </span>
                <input
                    type="range"
                    class="miniplayer-slider"
                    min="0"
                    max="10"
                    value="0"
                    step="0.25"
                />
            {/if}
        </div>
        {#if isPlaying}
            <div class="miniplayer-comment">
                <!--<img src="/assets/testavatar.png" alt="song comment avatar" width="20px"/>
                <span class="info">User</span>
                <span>WOW THIS IS AN AWESOME SONG!!!!! YAY!!!</span>-->
                <img src="{getAvatarAssetUrl(user.avatarAssetId)}" alt="song comment avatar" width="22px"/>
                <input class="miniplayer-comment-input" type="text" placeholder="Leave a comment at 00:28" />
                <button>Post</button>
            </div>
        {/if}

</section>




<style>
    .miniplayer {
        display: flex;
        flex-direction: column;
        background: var(--primary-background);
    }
    .miniplayer-player {
        display: flex;
        align-items: center;
        gap: 7px;
         /* @todo: css variable (light themes)? */
        background: rgba(255, 255, 255, 0.05);
    }
    .miniplayer-comment-input {
        flex: 1;
    }
    .miniplayer-comment {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        /* border-top: var(--border); */
        background: rgba(0, 0, 0, 0.15); /* @todo: css variable */
    }
    .miniplayer-controls {
        display: flex;
        justify-content: center;
    }
    .miniplayer-slider {
        flex: 1;
        height: 6px;
        margin-right: 8px;
    }
    .miniplayer-controls button {
        padding: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
