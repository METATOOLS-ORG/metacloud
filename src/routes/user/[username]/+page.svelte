<script>
	import Meta from '$components/Meta.svelte';
	import { page } from '$app/state';
	import PageHead from '$components/PageHead.svelte';
	import HeartIcon from '$components/icons/HeartIcon.svelte';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import { getAvatarAssetUrl } from '$lib/assets';
	import SearchIcon from '$components/icons/SearchIcon.svelte';
	import SongCard from '$components/SongCard.svelte';
    const { data } = $props();
	const username = page.params.username;
    let isOwnProfile = $derived(page.params.username == data.user?.username);
</script>

<Meta title="{username} (@{username})" />
<div class="page-split">
    <div class="content">
        <PageHead icon={HeartIcon} text="@{username}'s profile" height="36px"/>
        <section class="profile-main">
                <div class="profile-banner"></div>
                <div class="profile-content">
                    <div class="profile-top">
                        <img
                            class="profile-avatar"
                            src={getAvatarAssetUrl(data?.profile?.avatarAssetId)}
                            width="55px"
                            height="55px"
                            alt="avatar"
                        />
                        <div class="profile-top-right">
                            <button>Follow</button>
                        </div>
                    </div>
                    <div class="profile-name-split">
                        <h1 class="profile-name">{data.profile.displayName}</h1>
                        <span class="profile-tag info">@{data.profile.username}</span>
                    </div>
                    <span class="profile-bio info">I'm new to metacloud!</span>
                    <div class="profile-follow-data">
                        <div class="profile-follower-count">
                            <span>15</span>
                            <span class="info">followers</span>
                        </div>
                        <div class="profile-following-count">
                            <span>30</span>
                            <span class="info">following</span>
                        </div>
                    </div>
                </div>
        </section>

        <section class="songs">
            {#each data.profile.songs as song}
                <SongCard {song} user={data.user}/>
            {/each}
        </section>
    </div>
    <aside class="sidebar">
        <PageHead height="36px">
            {#if isOwnProfile }
                <!-- @todo: component this icon link button -->
                <a class="button" href="/logout">
                    <HeartIcon/>
                    <span>Logout</span>
                </a>
                <a class="button" href="/edit-profile">
                    <AddIcon/>
                    <span>Edit Profile</span>
                </a>
            {/if}
        </PageHead>
    </aside>
</div>

<style>
    .profile-main {
        display: flex;
        flex-direction: column;
        background: #67496E;
        position: relative;
    }
    .profile-main :global(.flat-icon) {
        color: #F4F4F4;
    }
    .profile-name-split {
        display: flex;
        gap: 6px;
    }
    .profile-banner {
        background-image: url("/assets/testbanner.png");
        background-size: cover;
        height: 100px;
    }
    .profile-top {
        display: flex;
        gap: 8px;
    }
    .profile-top-right {
        position: relative;
        display: flex;
        flex: 1;
        justify-content: flex-end;
    }
    .profile-content {
        display: flex;
        flex-direction: column;
        gap: 11px;
        padding: 18px;
        padding-bottom: 20px;
    }
    .profile-avatar {
        position: absolute;
        top: 86px;
    }
    .profile-follow-data {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .profile-follower-count, .profile-following-count {
        display: flex;
        align-items: center;
        gap: 3px;
    }
</style>
