<script lang="ts">
	import type { Component } from 'svelte';
	import HeartIcon from './icons/HeartIcon.svelte';

	const { text = null, icon = null, children = null, width = null, stretch = false, sidebar = false, height = "30px" } = $props();
    let IconComponent = icon as Component;
</script>

<h1 class="head" style:height={height} style:width={width} class:sidebar-head={sidebar}>
    <div class="head-left">
        {#if icon}
            <IconComponent/>
        {/if}
        {#if text}
    	   <span>{text}</span>
        {/if}
    </div>
    {#if children}
        <div class="head-right">
            {@render children?.()}
        </div>
    {/if}
</h1>

<style>
    h1.head {
        margin-bottom: 0;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-weight: normal;
        background: var(--page-head-background);
        backdrop-filter: blur(8px);
        height: 34px;
        flex-shrink: 0;
        position: sticky;
        top: 32px;
        z-index: 8;
        /* border-top: var(--border);
        border-bottom: var(--border); */
    }

    .head.sidebar-head {
        background: var(--sidebar-head-background);
    }

    .head-left {
        padding: 0px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .head-right {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
    }
</style>
