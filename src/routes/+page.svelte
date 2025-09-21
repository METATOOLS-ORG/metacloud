<script lang="ts">
    import FancyBanner from "$components/FancyBanner.svelte";
	import HeartIcon from "$components/icons/HeartIcon.svelte";
	import RepostIcon from "$components/icons/RepostIcon.svelte";
	import SearchIcon from "$components/icons/SearchIcon.svelte";
	import PageHead from "$components/PageHead.svelte";
	import QuickUploadCard from "$components/QuickUploadCard.svelte";
	import SidebarFooter from "$components/SidebarFooter.svelte";
    import SongCard from "$components/SongCard.svelte";
    import SongPostCard from "$components/SongPostCard.svelte";
	import { PUBLIC_WEBSITE_NAME } from "$env/static/public";
	import { getAssetUrl, getCoverAssetUrl } from "$lib/assets";

    const { data } = $props();
</script>
<svelte:head>
    <!-- manually set the title so that it's not "metacloud - metacloud" -->
	<title>{PUBLIC_WEBSITE_NAME}</title>
</svelte:head>

{#if !data.user}
    <!-- @todo: bring this banner back but better!! -->
    <!-- @todo: create some form of "dismissable banner" component that only shows one at a time and can be dimsissed
         which is then saved in localStorage to not show it again -->
    <!-- <FancyBanner icon="logo.png" ariaLabel="Welcome Banner">
        <h2>welcome to the metacloud</h2>
        <p>the metacloud is a new place to share your wips, demos and songs</p>
        <p>if you have an invite code, sign up now</p>
    </FancyBanner> -->
    <!-- @todo: "login to upload tracks" thing -->
{/if}


<div class="page-split">
    <section class="content">
        <PageHead text="Recent songs" icon={SearchIcon}/>
        <section class="songs">
            {#if data.user}
                <QuickUploadCard user={data?.user}/>
            {/if}
            {#each data.songs as song}
                <SongCard {song} user={data.user}/>
            {/each}
        </section>
    </section>
    <aside class="sidebar">
        <PageHead text="My releases" icon={HeartIcon}/>
        {#if data.user}
            <section class="sidebar-songs">
                {#each data.user.songs as song}
                    <section class="sidebar-song">
                        <img width="36px" height="36px" alt="song cover" src={getCoverAssetUrl(song.coverAssetId)}/>
                        <div class="sidebar-song-split">
                            <span>{song.title}</span>
                            <div class="sidebar-song-stats">
                                <div class="sidebar-song-stat">
                                    <span>12</span>
                                    <HeartIcon/>
                                </div>
                                <div class="sidebar-song-stat">
                                    <span>12</span>
                                    <RepostIcon/>
                                </div>
                            </div>
                        </div>
                    </section>
                {/each}
            </section>
        {/if}
        <SidebarFooter/>
    </aside>
</div>

<style>

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }

    .songs {
        overflow-y: auto;
        scrollbar-width: thin;
    }

    .sidebar-songs {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 10px;
        gap: 14px;
    }

    .sidebar-song {
        display: flex;
        gap: 10px;
    }

    :global(.sidebar-songs .flat-icon) {
        color: var(--text-color-info);
        opacity: 0.6; /* @todo: temp? opacity bad? */
        margin-top: 2px;
    }

    .sidebar-song-split {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .sidebar-song-stats {
        display: flex;
        gap: 8px;
    }
    .sidebar-song-stat {
        display: flex;
        align-items: center;
        gap: 6px;
    }
</style>
