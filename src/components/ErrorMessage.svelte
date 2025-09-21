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
        padding: 8px 12px;
        gap: 8px;
        align-items: center;
        background: var(--error-background);
        color: var(--accent-text-color);
    }
    :global(.error .flat-icon) {
        color: var(--accent-text-color);
    }
</style>
