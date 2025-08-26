<script lang="ts">
    import { getAssetUrl, getAvatarAssetUrl } from '$lib/assets';
    import MiniAssetGlobalPlayer from './MiniAssetGlobalPlayer.svelte';
    import AssetUploader from './AssetUploader.svelte';
    import CheckboxField from './CheckboxField.svelte';
    import TextField from './TextField.svelte';
    import { getFormData } from '$lib/forms';
    import { api_POST } from '$lib/api';
    import ErrorMessage from './ErrorMessage.svelte';
	import DiceIcon from './icons/DiceIcon.svelte';
	import ExportIcon from './icons/ExportIcon.svelte';
	import HeartIcon from './icons/HeartIcon.svelte';
	import { invalidate } from '$app/navigation';
	import AddIcon from './icons/AddIcon.svelte';
	import ToggleField from './ToggleField.svelte';

    let fileUploaded = $state(false);
    let file = $state<File | null>(null);
    let songAssetId = $state<string | null>(null);
    let songTitle = $state('');
    let assetUploader: AssetUploader | null = $state() as AssetUploader | null;
    let forceShowUploader = $state(false);
    const { user } = $props();

    // changing unique resets the component
    let unique = $state({});
    let resetUpload = () => {
        fileUploaded = false;
        file = null;
        songAssetId = null;
        unique = {};
    };

    let suggestedGenres = [
        'electronic',
        'edm',
        'rave',
        'trap',
        'complextro',
        'experimental',
        'ambient'
    ];

    let error = $state('');

    function onSubmit(e: SubmitEvent) {
        const formData = getFormData(e);
        /*
        const data = await validate(req, {
            coverAssetId: z.string(),
            audioAssetId: z.string(),
            title: z.string().trim().max(24),
            desc: z.string().trim().max(4000),
            genre: z.string().trim().max(24),
            // @todo: validate "kebab case"
            url: z.string().trim().max(24),
            tagWip: z.boolean(),
            tagFeedback: z.boolean(),
            tagClip: z.boolean()
        });
        */
        api_POST('song', {
            coverAssetId: formData.get('coverAssetId'),
            audioAssetId: formData.get('audioAssetId'),
            title: formData.get('title'),
            desc: formData.get('desc'),
            genre: formData.get('genre'),
            url: formData.get('url'),
            tagPin: formData.get('tag-pin') === 'on',
            tagWip: formData.get('tag-wip') === 'on',
            tagFeedback: formData.get('tag-feedback') === 'on'
        })
        .then((resp) => {
            invalidate('/api/song');
            resetUpload();
            // location.href = "/@" + resp.username;
        })
        .catch((err) => {
            error = err.message;
        });
    }

    let replaceAudio = () => {
        assetUploader?.click();
    };
</script>

{#key unique}
    <form onsubmit={onSubmit} class="quickupload-card">
        <ErrorMessage {error} />
        <AssetUploader
            height="48px"
            icon="speaker"
            caption="Click or drag audio to upload"
            onFileDragged={(newFile: File) => {
                file = newFile;
                forceShowUploader = true;
            }}
            onAssetUploaded={(id: string) => {
                songAssetId = id;
                fileUploaded = true;
                forceShowUploader = false;
            }}
            hidden={fileUploaded && !forceShowUploader}
            bind:this={assetUploader}
            name="audioAssetId"
            onError={(err: string) => {
                error = err;
            }}
        />
        {#if fileUploaded}
            <section class="quickupload-split">
                <AssetUploader
                    width="121px"
                    height="121px"
                    imageMode
                    center
                    caption="Drag cover"
                    name="coverAssetId"
                />
                <div class="quickupload-right">
                    <div class="quickupload-author">
                        {#if user}
                            <img
                                src={getAvatarAssetUrl(user.avatarAssetId)}
                                height="18px"
                                alt="author avatar"
                            />
                            <span>{user.displayName}</span>
                        {/if}
                    </div>
                    <div class="quickupload-top">
                        <input
                            type="text"
                            class="quickupload-title"
                            name="title"
                            placeholder="Song title"
                            bind:value={songTitle}
                        />
                        <button type="button"><DiceIcon/>Title</button>
                        <button type="button"><DiceIcon/>Cover</button>
                    </div>
                    <div class="quickupload-middle">
                        <!-- @todo: rename songassetid to audioassetid -->
                        <MiniAssetGlobalPlayer {songAssetId} {user} />
                        <button type="button" class="replace-audio" onclick={replaceAudio}><ExportIcon/></button>
                    </div>
                    <div class="quickupload-bottom">
                        <div class="quickupload-tags">
                            <ToggleField name="tag-pin" icon={AddIcon} label="Pin" />
                            <ToggleField name="tag-wip" icon={AddIcon} label="WIP" />
                            <ToggleField name="tag-feedback" icon={AddIcon} label="Feedback" />
                        </div>
                        <div class="quickupload-actions">
                            <button type="button" onclick={resetUpload}>Cancel</button>
                            <input class="accent" type="submit" value="Publish"/>
                        </div>
                    </div>
                </div>
            </section>
            <section class="quickupload-extra">
                <div class="quickupload-extra-left">
                    <datalist id="genre-list">
                        {#each suggestedGenres as genre}
                            <option value={genre}></option>
                        {/each}
                    </datalist>
                    <TextField
                        name="genre"
                        label="Genre"
                        placeholder="electronic (optional)"
                        oneline
                        required={false}
                        datalistId="genre-list"
                        stretch={true}
                        minLabelWidth="40px"
                    />
                    <TextField
                        name="url"
                        label="Link"
                        oneline
                        showRequired={false}
                        prefix="/@{user?.username}/"
                        placeholder="my-song"
                        minLabelWidth="40px"
                    />
                </div>
                <div class="quickupload-extra-right">
                    <label class="quickupload-desc">
                        <!-- <span>Description:</span> -->
                        <textarea
                            name="desc"
                            aria-label="Song description"
                            placeholder="Write a description here! (optional)"
                            rows="5"
                        ></textarea>
                    </label>
                </div>
            </section>
        {/if}
    </form>
{/key}

<style>
    .quickupload-card {
        display: flex;
        flex-direction: column;
        /* border-bottom: var(--border); */
        /* @todo: kinda dumb that i had to override this, maybe remove
                  default form styling in global.css instead */
        align-items: stretch;
        gap: 0;
    }
    .quickupload-card > :global(.file-uploader) {
        border: none;
    }
    .quickupload-split {
        padding: 16px;
        display: flex;
        flex-direction: row;
        flex: 1;
        gap: 16px;
        /* border-bottom: var(--border); */
    }
    .quickupload-right {
        display: flex;
        gap: 9px;
        flex: 1;
        flex-direction: column;
    }
    .quickupload-top {
        display: flex;
        gap: 6px;
    }
    .quickupload-bottom {
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: space-between;
    }
    .quickupload-middle {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    .quickupload-tags,
    .quickupload-actions {
        display: flex;
        gap: 6px;
    }
    .quickupload-title {
        flex: 1;
    }
    .quickupload-author {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .quickupload-extra {
        background: hsl(235, 12%, 21%); /* @todo: css variable */
        display: flex;
        flex-direction: row;
        padding: 16px;
        gap: 10px;
    }
    .quickupload-extra-left {
        display: flex;
        flex-direction: column;
        gap: 9px;
    }
    .quickupload-extra-right {
        flex: 1;
    }
    .quickupload-desc {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
    }
    button.replace-audio {
        padding: 6px;
    }
</style>
