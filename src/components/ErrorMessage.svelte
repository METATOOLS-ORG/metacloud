<script lang="ts">
	import ErrorIcon from "./icons/ErrorIcon.svelte";

    const { error } = $props();
</script>

{#if error}
    <section class="error">
        <ErrorIcon/>
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
    :global(.error .flat-icon) {
        color: var(--accent-text-color);
    }
</style>
