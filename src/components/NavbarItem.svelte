<script lang="ts">
    import { page } from '$app/state';
    import SearchIcon from './icons/SearchIcon.svelte';
    let { title, path, IconComponent = null, avatarPath = null, iconIsAvatar = false, leftBorder = false } = $props();
</script>

<li
    class="navbar-item"
    class:active={page.url.pathname === path}
    class:left-border={leftBorder}
>
    <a href={path} class="noblue">
        {#if iconIsAvatar}
            <img
                class="navbar-item-icon"
                class:icon-sm={!iconIsAvatar}
                class:navbar-avatar={iconIsAvatar}
                src={avatarPath}
                alt=""
            />
        {:else}
            <!-- @todo -->
            {#if IconComponent}
            <IconComponent/>
            {/if}
        {/if}
        <span>{title}</span>
    </a>
</li>

<style>
    .navbar-item {
        display: flex;
        align-items: center;
    }

    /*.navbar-item:not(.left-border) {
        border-right: var(--border);
    }

    .navbar-item.left-border {
        border-left: var(--border);
    }*/

    a {
        display: flex;
        align-items: center;
        gap: 7px;
        cursor: default;
        padding: 0px 12px;
    }

    .navbar-item.active {
        background: rgba(0, 0, 0, 0.2);
        box-shadow: inset 0px -2px 0px var(--accent-color);
    }

    .navbar-avatar {
        width: 20px;
        height: 20px;
    }
</style>
