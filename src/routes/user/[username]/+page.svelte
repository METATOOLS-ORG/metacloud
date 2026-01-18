<script>
	import Meta from '$components/Meta.svelte';
	import { page } from '$app/state';
	import PageHead from '$components/PageHead.svelte';
	import HeartIcon from '$components/icons/HeartIcon.svelte';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import { getAvatarAssetUrl } from '$lib/assets';
	import SearchIcon from '$components/icons/SearchIcon.svelte';
	import SongCard from '$components/SongCard.svelte';
	import VerifiedIcon from '$components/icons/VerifiedIcon.svelte';
	import SidebarFooter from '$components/SidebarFooter.svelte';
    import DiskIcon from '$components/icons/DiskIcon.svelte';
    import SketchIcon from '$components/icons/SketchIcon.svelte';
    const { data } = $props();
	const username = page.params.username;
    let isOwnProfile = $derived(page.params.username == data.user?.username);

    // @todo: placeholder: using latest song instead of actual pinned song from db
    let pinnedSong = data.profile.songs[0];
    let releases = data.profile.songs.filter(song => {
        return song.release && song.id !== pinnedSong.id;
    })
    let sketches = data.profile.songs.filter(song => {
        return song.sketch && song.id !== pinnedSong.id;
    })
</script>

<Meta title="{username} (@{username})" />
<div class="page-split">
    <div class="content">
        <PageHead icon={HeartIcon} text="@{username}'s profile"/>
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
                            <button><AddIcon/>Follow</button>
                        </div>
                    </div>
                    <div class="profile-name-split">
                        <h1 class="profile-name">{data.profile.displayName}</h1>
                        <VerifiedIcon/>
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
            <SongCard song={pinnedSong} user={data.user}/>
            <PageHead icon={DiskIcon} text="Releases"/>
            {#if releases.length !== 0}
                {#each releases as song}
                    <SongCard {song} user={data.user}/>
                {/each}
            {/if}
            {#if sketches.length !== 0}
                <PageHead icon={SketchIcon} text="Sketches"/>
                {#each sketches as song}
                    <SongCard {song} user={data.user}/>
                {/each}
            {/if}
        </section>
    </div>
    <aside class="sidebar">
        <PageHead sidebar>
            {#if isOwnProfile }
                <a class="noblue" href="/logout" data-sveltekit-preload-data="off">Log out</a>
                <!-- @todo: component this icon link button -->
                <!--<a class="button" href="/logout">
                    <HeartIcon/>
                    <span>Logout</span>
                </a>
                <a class="button" href="/edit-profile">
                    <AddIcon/>
                    <span>Edit Profile</span>
                </a> -->
            {/if}
        </PageHead>
        <SidebarFooter/>
    </aside>
</div>

<style>
    .profile-main {
        display: flex;
        flex-direction: column;
        position: relative;
        background-image: url("/assets/testbanner.png");
        background-size: cover;
    }
    .profile-main :global(.flat-icon) {
        color: #F4F4F4;
    }
    .profile-name-split {
        display: flex;
        gap: 6px;
        align-items: center;
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
        background: #67496ebd;
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        gap: 11px;
        padding: 18px;
        padding-bottom: 20px;
    }
    .profile-avatar {
        position: absolute;
        top: -16px;
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
