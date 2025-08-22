<script lang="ts">
	import IconSmall from "./IconSmall.svelte";

    const { error } = $props();
</script>

{#if error}
    <section class="error">
        <IconSmall icon="error"/>
        <span>{error}</span>
    </section>
{/if}

<style>
    .error {
        display: flex;
        padding: 6px 10px;
        gap: 5px;
        align-items: center;
        background: var(--error-background);
        border-bottom: 1px solid var(--accent-border-color);
        color: var(--accent-text-color);
    }
</style>
