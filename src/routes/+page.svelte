<script lang="ts">
    import FancyBanner from "$components/FancyBanner.svelte";
	import DiskIcon from "$components/icons/DiskIcon.svelte";
	import HeartIcon from "$components/icons/HeartIcon.svelte";
	import RepostIcon from "$components/icons/RepostIcon.svelte";
	import SearchIcon from "$components/icons/SearchIcon.svelte";
	import PageHead from "$components/PageHead.svelte";
	import QuickUploadCard from "$components/QuickUploadCard.svelte";
	import QuickUploadCardv2 from "$components/QuickUploadCardv2.svelte";
	import SidebarFooter from "$components/SidebarFooter.svelte";
	import SidebarSong from "$components/SidebarSong.svelte";
    import SongCard from "$components/SongCard.svelte";
	import { PUBLIC_WEBSITE_NAME } from "$env/static/public";
	import { getAssetUrl, getCoverAssetUrl } from "$lib/assets";

    const { data } = $props();
</script>
<svelte:head>
    <!-- manually set the title so that it's not "name - name" -->
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
        {#if data.user}
            <QuickUploadCardv2 user={data?.user}/>
        {/if}
        <section class="songs">
            {#each data.songs as song}
                <SongCard {song} user={data.user}/>
            {/each}
        </section>
    </section>
    <aside class="sidebar">
        <PageHead sidebar text="My songs" icon={DiskIcon}/>
        <div class="sidebar-content">
            {#if data.user}
                <section class="sidebar-songs">
                    {#each data.user.songs as song}
                        <SidebarSong {song}/>
                    {/each}
                </section>
            {/if}
            <SidebarFooter/>
        </div>
    </aside>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .songs {
        overflow-y: auto;
        scrollbar-width: thin;
        /* border-top: var(--border); */
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 64px;
    }

    .sidebar-songs {
        display: flex;
        flex-direction: column;
    }

    :global(.sidebar-songs .flat-icon) {
        color: var(--text-color-info);
        opacity: 0.6; /* @todo: temp? opacity bad? */
        margin-top: 2px;
    }
</style>
