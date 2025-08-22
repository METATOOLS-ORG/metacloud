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
        <div class="main-top" role="presentation">
            <Navbar user={data.user} authLoaded={data.authLoaded} />
            <section class="page">
                {@render children()}
            </section>
        </div>
        <div class="main-bottom" role="presentation">
            <footer class="footer">
                <!-- @todo: placeholder -->
                <span>&copy; metacloud 2025 - terms of service - impressum - contact - report dmca</span>
            </footer>
            <GlobalPlayer/>
        </div>
    </main>
</div>
