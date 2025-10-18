<script lang="ts">
    import { page } from '$app/state';
	import { getAvatarAssetUrl } from '$lib/assets';
	import type { Component } from 'svelte';
	import LogoIcon from './icons/LogoIcon.svelte';
	import SearchIcon from './icons/SearchIcon.svelte';
    import NavbarItem from './NavbarItem.svelte';
	import AddIcon from './icons/AddIcon.svelte';
	import HeartIcon from './icons/HeartIcon.svelte';
    let { user, authLoaded } = $props();

    interface NavbarPage {
        title: string, url: string, icon: Component
    }
    const navbarPages: NavbarPage[] = [
        { title: "Explore", url: "/", icon: SearchIcon },
        { title: "Tests", url: "/tests", icon: HeartIcon }
    ];

</script>

<header class="navbar">
    <a class="navbar-logo noblue" href="/">
        <img
            class="navbar-logo-icon icon-sm"
            src="/favicon.png"
            alt="Logo icon"
            width="16px"
            aria-hidden="true"
        />
        <img src="/assets/testlogo.png" class="navbar-logo-text" alt="metacloud"/>
    </a>
    <nav class="navbar-left" aria-label="Main navigation">
        <ul>
            {#each navbarPages as item}
                <NavbarItem title={item.title} path={item.url} IconComponent={item.icon} />
            {/each}
        </ul>
    </nav>
    <nav class="navbar-right" aria-label="Main navigation">
        <ul>
            {#if user}
                <!-- <NavbarItem
                    title="Messages"
                    path="/logout"
                    IconComponent={HeartIcon}
                    leftBorder={true}
                /> -->
                <NavbarItem
                    title={user.displayName}
                    path="/@{user.username}"
                    iconIsAvatar={true}
                    avatarPath={getAvatarAssetUrl(user.avatarAssetId)}
                    leftBorder={true}
                />
            {:else if authLoaded}
                <NavbarItem
                    title="Sign up"
                    path="/signup"
                    IconComponent={AddIcon}
                    leftBorder={true}
                />
                <NavbarItem
                    title="Login"
                    path="/login"
                    IconComponent={AddIcon}
                    leftBorder={true}
                />
            {/if}
        </ul>
    </nav>
</header>

<style>
    .navbar {
        display: flex;
        flex-shrink: 0;
        height: var(--navbar-height);
        background: var(--navbar-background);
        /* pwa */
        -webkit-app-region: drag;
        position: sticky;
        top: 0;
        z-index: 10;
        position: fixed;
        width: var(--page-width);
    }

    .navbar-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0px 16px 0px 18px;
        /* border-right: var(--border); */
    }

    .navbar-left,
    .navbar-right {
        display: flex;
    }

    .navbar-left {
        flex: 1;
    }

    .navbar-left ul,
    .navbar-right ul {
        display: flex;
    }

    .navbar-right ul :global(.navbar-item:last-child) {
        border-right: none;
    }

    .navbar-logo-text {
        image-rendering: pixelated;
        height: 17px;
    }
</style>
