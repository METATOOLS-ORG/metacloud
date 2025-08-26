<script lang="ts">
	import { PUBLIC_WEBSITE_NAME } from "$env/static/public";
    let { title } = $props();
</script>

<svelte:head>
    <title>{title} - {PUBLIC_WEBSITE_NAME}</title>
</svelte:head>
