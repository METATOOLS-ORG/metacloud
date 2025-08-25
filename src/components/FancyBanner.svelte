<script lang="ts">
    const { icon, children, ariaLabel = "Banner" } = $props();
</script>

<section class="banner" aria-label={ariaLabel}>
    <!-- @todo: icons no longer work like this -->
    <img
        class="icon-lg"
        src="/assets/icons/x32/{icon}"
        aria-hidden="true"
        alt=""
    />
    <div class="banner-text">
        {@render children()}
    </div>
</section>

<style>
    .banner {
        display: flex;
        padding: 18px;
        gap: 18px;
        background: var(--banner-background);
        border-bottom: var(--border);
    }
    .banner-text {
        display: flex;
        flex-direction: column;
    }
    .banner-text :global(p:last-child) {
        margin-bottom: 0;
    }
</style>
