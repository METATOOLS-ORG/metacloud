<script lang="ts">
    import WaveSurfer from 'wavesurfer.js'
    import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

    import { browser, building, dev, version } from '$app/environment';
	import { globalAudioState } from '$lib/state/audioState.svelte';
	import PlayIcon from './icons/PlayIcon.svelte';
	import { getAssetUrl } from '$lib/assets';
	import { onMount } from 'svelte';
	import { formatSongTime } from '$lib/time';
	import PauseIcon from './icons/PauseIcon.svelte';

    const { song, user } = $props();

    let isPlaying = $derived(globalAudioState.playingSong && globalAudioState?.song?.id == song.id);
    let isPaused = $derived(globalAudioState.paused);

    let wavesurfer: WaveSurfer | null = null;
    let tempPauseForSeek = false;

    // @todo: svelte ids are not unique? something like that - could that cause problems?
    const uid = $props.id();

    function playThisSong() {
        globalAudioState.playSong(song);
    }
    onMount(() => {
        if (!browser) return;

        // Parse waveform JSON
        let waveformData = JSON.parse(song.waveformJSON).data;

        wavesurfer = WaveSurfer.create({
            container: '.wavesurfer-' + uid,
            waveColor: '#76777d',
            progressColor: '#df8fbd',
            barAlign: "bottom",
            dragToSeek: true,
            barWidth: 1,
            height: 36,
            normalize: true,
            // url: getAssetUrl(song.audioAssetId),
            peaks: waveformData,
            duration: song.duration,
            plugins: [
                Hover.create({
                  lineColor: '#ffffff',
                  lineWidth: 2,
                  labelBackground: '#000000',
                  labelColor: '#df8fbd',
                  labelSize: '11px',
                  labelPreferLeft: false,
                }),
            ],
        })

        // Register events
        wavesurfer.on("dragstart", (_) => {
            globalAudioState.seeking = true;
            globalAudioState.audio?.pause();
            globalAudioState.paused = true;
        });

        wavesurfer.on("dragend", (_) => {
            globalAudioState.seeking = false;
            globalAudioState.audio?.play();
            globalAudioState.paused = false;
        });

        wavesurfer.on('interaction', (currentTime) => {
            if (!isPlaying) {
                playThisSong();
                return
            }
            if (globalAudioState.audio) {
                globalAudioState.audio.currentTime = currentTime;
                globalAudioState.currentTime = currentTime;
            }
        });
    });



    $effect(() => {
        if (!wavesurfer) return;
        if (!isPlaying) {
            wavesurfer?.setTime(0);
            return;
        };
        wavesurfer.setTime(globalAudioState.currentTime);
    })

    function playButton() {
        !isPlaying ? globalAudioState.playSong(song) : globalAudioState.togglePlayback();
    }
</script>

<div class="player" >
    <div class="wavesurfer wavesurfer-{uid}" style="min-height: 36px" role="button" tabindex="0">
        <div class="player-time">{isPlaying ? formatSongTime(globalAudioState.currentTime) : "0:00"}</div>
        <div class="player-duration">{formatSongTime(song.duration)}</div>

    </div>
    <div class="player-bottom">
            <button class="player-play" onclick={playButton} class:accent={isPlaying && !isPaused}>
                {#if !isPlaying || isPaused}
                    <PlayIcon/>
                {:else}
                    <PauseIcon/>
                {/if}
            </button>
        <input
            type="text"
            placeholder="Leave a comment at {isPlaying ? formatSongTime(globalAudioState.currentTime) : "0:00"}"
            class="player-comment-input"
        />
        <button class="player-comment-submit">Post</button>
    </div>
</div>

<style>
    .player {
        display: flex;
        flex-direction: column;

    }
    .wavesurfer {
        flex: 1;
        flex-shrink: 0;
        position: relative;
    }
    .player-time, .player-duration {
        position: absolute;
        background: #1c1d25;
        font-size: 10px;
        padding: 3px;
        z-index: 4;
        pointer-events: none;
        user-select: none;
        top: 20px;
    }
    .player-time {
        left: 0px;
    }
    .player-duration {
        right: 0px;
    }
    .player-bottom {
        display: flex;
    }
    .player-play {
        padding: 7px;
        border: none;
    }
    .player-comment-input {
        flex: 1;
        border: none;
    }
    .player-comment-submit {
        border: none;
    }
</style>

