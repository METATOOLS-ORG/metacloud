<script lang="ts">
    import './reset.css';
    import './global.css';
    import Navbar from '$components/Navbar.svelte';
	import type { LayoutProps } from './$types';
	import { globalAudioState } from '$lib/state/audioState.svelte';
	import GlobalPlayer from '$components/GlobalPlayer.svelte';
    let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
    <title>metacloud</title>
</svelte:head>

<div class="background">
    <main class="main">
        <Navbar user={data.user} authLoaded={data.authLoaded} />
        <section class="page" class:page-player-margin={globalAudioState.playingSong}>
            {@render children()}
        </section>
        <GlobalPlayer/>
    </main>
</div>
