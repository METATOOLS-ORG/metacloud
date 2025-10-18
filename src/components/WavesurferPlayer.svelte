<script lang="ts">
    import WaveSurfer from 'wavesurfer.js'
    import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

    import { browser, building, dev, version } from '$app/environment';
	import { globalAudioState } from '$lib/state/audioState.svelte';
	import PlayIcon from './icons/PlayIcon.svelte';
	import { getAssetUrl, getAvatarAssetUrl } from '$lib/assets';
	import { onMount } from 'svelte';
	import { formatSongTime } from '$lib/time';
	import PauseIcon from './icons/PauseIcon.svelte';
	import api from '$lib/api';
	import ErrorMessage from './ErrorMessage.svelte';
	import { invalidate } from '$app/navigation';
	import type { SongCommentDTO } from '$lib/dto';

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
            progressColor: '#db76b0',
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
                  labelColor: '#db76b0',
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
            if (closestCommentChecker) clearInterval(closestCommentChecker);
            return;
        };
        wavesurfer.setTime(globalAudioState.currentTime);
    })

    function playButton() {
        !isPlaying ? globalAudioState.playSong(song) : globalAudioState.togglePlayback();
    }

    let commentContent = $state("");
    let commentError = $state("");

    // Changing this reloads the components rendered comments
    let commentKey = $state({});

    async function submitComment() {
        try {
            let songTime = globalAudioState.currentTime;
            let resp = await api.put("song/comment", {
                songId: song.id,
                songTime: songTime,
                content: commentContent
            });

            // Add the comment locally as well
            song.comments.push({
                id: resp.commentId,
                date: new Date(),
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    username: user.username,
                    avatarAssetId: user.avatarAssetId
                },
                songTime: globalAudioState.currentTime,
                content: commentContent
            } as SongCommentDTO)

            commentContent = "";
            commentKey = {};
        } catch (err: any) {
            commentError = err.message;
        }
    }

    let closestCommentChecker: ReturnType<typeof setInterval>;

    $effect(() => {
        if (isPlaying) {
            console.log("is playing now")
            closestCommentChecker = setInterval(closestCommentLoop, 200);
        }
    })

    function getClosestCommentId() {
      if (!song.comments || song.comments.length === 0) return null;

      let closestId = null;
      song.comments.forEach((comment: SongCommentDTO) => {
        let distance = comment.songTime - globalAudioState.currentTime;
        if (distance < 0.5 && distance > -2) closestId = comment.id;
      });
      return closestId
    };

    let closestCommentId: number | null = $state(null);
    function closestCommentLoop() {
        if (isPaused) return;
        console.log(getClosestCommentId());
        closestCommentId = getClosestCommentId();
    }
</script>

<div class="player" >
    <div class="wavesurfer wavesurfer-{uid}" style="min-height: 36px" role="button" tabindex="0">
        <div class="player-time">{isPlaying ? formatSongTime(globalAudioState.currentTime) : "0:00"}</div>
        <div class="player-duration">{formatSongTime(song.duration)}</div>

        <!-- Song comments -->
        {#key commentKey}
        {#each song.comments as comment}
            <div
                class="player-comment"
                aria-label="song comment"
                style:left={(Math.round((comment.songTime / song.duration) * 100)) + "%"}
                class:closest={comment.id == closestCommentId && isPlaying}
            >
                <img class="player-comment-avatar" alt="avatar" width="16px" src={getAvatarAssetUrl(comment.user.avatarAssetId)}/>
                <div class="player-comment-inner">
                    <span class="player-comment-username">{comment.user.displayName}</span>
                    <span class="player-comment-content">{comment.content}</span>
                </div>
            </div>
        {/each}
        {/key}
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
            bind:value={commentContent}
        />
        <button class="player-comment-submit" onclick={submitComment}>Post</button>

    </div>
    <ErrorMessage error={commentError}/>
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

    .player-comment {
        position: absolute;
        bottom: 0px;
        margin-left: -8px;
        z-index: 5;
        pointer-events: none;
        display: flex;
        z-index: 7;
    }

    .player-comment .player-comment-inner {
        display: flex;
        gap: 6px;
        align-items: center;
        /* visibility: hidden; */
        opacity: 0;
        background: transparent;
        transition: opacity 0.5s, background 0.5s;
        padding: 0px 6px 0px 5px;
        text-overflow: clip;
        text-wrap: nowrap;
    }

    .player-comment.closest {
        z-index: 8;
    }

    .player-comment.closest .player-comment-inner {
        visibility: visible;
        opacity: 1;
        background: #1c1d25;
    }

    .player-comment-username {
        color: var(--accent-color);
    }
</style>

