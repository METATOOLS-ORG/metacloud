<script lang="ts">
    import FancyBanner from "$components/FancyBanner.svelte";
	import SearchIcon from "$components/icons/SearchIcon.svelte";
	import PageHead from "$components/PageHead.svelte";
	import QuickUploadCard from "$components/QuickUploadCard.svelte";
    import SongCard from "$components/SongCard.svelte";
    import SongPostCard from "$components/SongPostCard.svelte";
	import { PUBLIC_WEBSITE_NAME } from "$env/static/public";

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
        <PageHead text="My songs" icon={SearchIcon}/>
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
</style>
