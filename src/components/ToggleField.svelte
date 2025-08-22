<script lang="ts">
	import type { Component } from "svelte";

    let { name = null, label, checked = false, icon = null, onchange = null } = $props();
    let IconComponent = icon as Component;
    let active = $state(false);
    let onclick = (e: Event) => {
        active = !active;
    }
</script>

<button type="button" class="toggle-button" class:checked={active} {onclick}>
    {#if icon}
        <IconComponent/>
    {/if}
    <span>{label}</span>
</button>
{#if name}
    <input class="toggle-button-checkbox" type="checkbox" bind:checked={active} {name}/>
{/if}

<style>
    .toggle-button-checkbox {
        display: none;
    }
</style>
