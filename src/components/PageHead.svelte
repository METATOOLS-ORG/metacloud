<script lang="ts">
	import type { Component } from 'svelte';
	import HeartIcon from './icons/HeartIcon.svelte';

	const { text = null, icon = null, children = null, height = "30px" } = $props();
    let IconComponent = icon as Component;
</script>

<h1 class="head" style:height={height}>
    <div class="head-left">
    {#if icon}
    		<!-- <IconSmall {icon} /> -->
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
        height: 34px;
        flex-shrink: 0;
    }
    .head-left {
        padding: 0px 14px;
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
