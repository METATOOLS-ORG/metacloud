<script lang="ts">
	import { getCoverAssetUrl } from "$lib/assets";
	import HeartIcon from "./icons/HeartIcon.svelte";
	import RepostIcon from "./icons/RepostIcon.svelte";
    const { song } = $props();

</script>
<section class="sidebar-song">
    <img width="36px" height="36px" alt="song cover" src={getCoverAssetUrl(song.coverAssetId)}/>
    <div class="sidebar-song-split">
        <a class="noblue" href="#todo">
            <span>{song.title}</span>
            <div class="sidebar-song-stats">
                <div class="sidebar-song-stat">
                    <HeartIcon/>
                    <span>{song.likes.length}</span>
                </div>
                <div class="sidebar-song-stat">
                    <RepostIcon/>
                    <span>12</span>
                </div>
            </div>
        </a>
    </div>
</section>


<style>
    .sidebar-song {
        display: flex;
        gap: 12px;
        padding: 9px 14px;
    }

    .sidebar-song a {
        display: contents;
    }
    .sidebar-song-split {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .sidebar-song-stats {
        display: flex;
        gap: 10px;
    }

    .sidebar-song-stat {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--text-color-info);
    }

    .sidebar-song a {
        display: contents;
    }

    .sidebar-song-stats {
        display: flex;
        gap: 10px;
    }

    .sidebar-song-stat {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--text-color-info);
    }
</style>
