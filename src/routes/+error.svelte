<script lang="ts">
    import { page } from '$app/state';
	import HeartIcon from '$components/icons/HeartIcon.svelte';
	import PageHead from '$components/PageHead.svelte';
</script>

<PageHead icon={HeartIcon} text="Error"/>
<section class="page-content">
    <h1><p>{page.status}</p></h1>
    <p>{page.error?.message}</p>
    {#if page.status != 404}
        <p class="info">If this error doesn't go away, please let us know about it.</p>
    {/if}
    <button onclick={() => history.back()}>Go back</button>
</section>
