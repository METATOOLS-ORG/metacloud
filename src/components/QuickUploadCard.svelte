<script lang="ts">
	import AddIcon from "./icons/AddIcon.svelte";
	import DiskIcon from "./icons/DiskIcon.svelte";
	import SketchIcon from "./icons/SketchIcon.svelte";
	import TextIcon from "./icons/TextIcon.svelte";
	import SketchGuideVector from "./SketchGuideVector.svelte";
    import AssetUploader from './AssetUploader.svelte';
    import CheckboxField from './CheckboxField.svelte';
	import TextField from "./TextField.svelte";
	import ToggleField from "./ToggleField.svelte";
	import DiceIcon from "./icons/DiceIcon.svelte";
	import ErrorMessage from "./ErrorMessage.svelte";
	import WarningIcon from "./icons/WarningIcon.svelte";
	import { invalidate } from "$app/navigation";
	import api from "$lib/api";
	import { getFormData } from "$lib/forms";

    const { user } = $props();

    let newSong = $state(false);
    let error = $state("");
    let songAsset: string | null = $state(null);

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
        api.post('song', {
            coverAssetId: formData.get('coverAssetId'),
            audioAssetId: songAsset,
            title: formData.get('title'),
            desc: formData.get('desc'),
            genre: formData.get('tags'),
            url: formData.get('link'),
            tagPin: formData.get('pin') === 'on',
            tagWip: formData.get('wip') === 'on',
            tagFeedback: formData.get('feedback') === 'on'
        })
        .then((resp) => {
            invalidate('/api/song');
            // @todo: this is supposed to refresh the song sidebar but it doesn't
            // probably because that pulls from pagedata user instead, no idea how to fix that
            // invalidate('/api/user/self');
            resetComponent();
            // resetUpload();
            // location.href = "/@" + resp.username;
        })
        .catch((err) => {
            error = err.message;
        });
    }

    let songTitle = $state("");
    async function randomizerTitle() {
        try {
            let resp = await api.get("randomizer/title")
            songTitle = resp.title;
        } catch (err) {
            console.error("Failed to fetch randomizer title:", err);
        }
    }

    // Changing unique resets the component
    let unique = $state({});
    let resetComponent = () => {
        newSong = false;
        songAsset = null;
        songTitle = "";
        unique = {};
    };
</script>

{#key unique}
<section class="upload">
    <!-- Post type selector (pre-click) -->
    {#if !newSong}
        <div class="upload-intro">
            <div class="upload-intro-buttons">
                <button onclick={()=>{newSong = true}}><SketchIcon/>New sketch</button>
                <button onclick={()=>{newSong = true}}><DiskIcon/>New release</button>
                <button><TextIcon/>New post</button>
            </div>
            <!-- <SketchGuideVector/> -->
       </div>

   {/if}

   <!-- New song file upload -->
   {#if newSong && !songAsset}
        <ErrorMessage {error} />
        <div class="upload-songfile">
            <div class="upload-songfile-head">
                <div class="upload-songfile-head-text">
                    <DiskIcon/>
                    <h1>Upload an audio file <a class="noblue" href="#a" onclick={()=>{songAsset = "1"}}>or debug skip</a></h1>
                </div>
                <!-- <button onclick={newSong = false}>Back</button> -->
            </div>
            <span class="info">Max 30 MB - Supported: mp3, wav, flac, ogg</span>
            <AssetUploader
                height="64px"
                icon="speaker"
                caption="Click or drag audio to upload"
                onFileDragged={(file: File) => {
                    console.log("on file dragged", file.name);
                    // Prefill song title and remove file extension using regex
                    songTitle = file?.name.replace(/\.[^/.]+$/, "");
                }}
                onAssetUploaded={(id: string) => {
                    songAsset = id;
                }}
                name="audioAssetId"
                onError={(err: string) => {
                    error = err;
                    // songTitle = "";
                }}
            />
            <div class="upload-songfile-warning">
                <WarningIcon/>
                <span class="info">Metacloud is for posting your own music, not for reuploads. Do not upload other people's copyrighted music, or your account will be banned. Remixes and flips are generally fine.</span>
            </div>
        </div>
   {/if}

   <!-- New song metadata -->
   {#if newSong && songAsset}
        <form class="upload-metadata upload-split" onsubmit={onSubmit}>
            <div class="upload-left">
                <AssetUploader
                    width="122px"
                    height="122px"
                    imageMode
                    center
                    caption="Drag cover"
                    name="coverAssetId"
                />
                <div class="upload-field">
                    <span class="title">Type</span>
                    <div class="upload-field-toggle-group">
                        <ToggleField name="sketch" icon={SketchIcon} label="Sketch" checked/>
                        <ToggleField name="release" icon={DiskIcon} label="Release"/>
                    </div>
                </div>
            </div>
            <div class="upload-middle">
                <div class="upload-field">
                    <span class="title">Song title</span>
                    <input type="text" name="title" autocomplete="one-time-code" bind:value={songTitle} placeholder="My new song" />
                </div>
                <div class="upload-field">
                    <span class="title">Description</span>
                    <textarea name="desc" autocomplete="one-time-code" placeholder="Any links or details (optional)" rows=2></textarea>
                </div>
                <div class="upload-field">
                    <div class="upload-field-title">
                        <span class="title">Tags</span>
                        <CheckboxField name="test" label="first tag is genre" checked/>
                    </div>
                    <input type="text" name="tags" autocomplete="one-time-code" placeholder="electronic, comma, seperated" />
                </div>
                <div class="upload-field">
                    <span class="title">Link</span>
                    <div class="upload-field-input-group">
                        <span class="upload-field-input-prefix">/@litevex/</span>
                        <input type="text" name="link" autocomplete="one-time-code" placeholder="songname" style:flex={1}/>
                    </div>
                </div>
            </div>
            <div class="upload-right">
                <div class="upload-right-top">
                    <div class="upload-right-toggles">
                        <CheckboxField name="pin" label="Pin as latest release" checked/>
                        <CheckboxField name="wip" label="Work in progress" checked/>
                        <CheckboxField name="feedback" label="Feedback wanted" checked/>
                        <CheckboxField name="downloads" label="Allow downloads" checked/>
                    </div>
                    <div class="upload-field">
                        <span class="title">Randomizer</span>
                        <div class="upload-field-toggle-group">
                            <button type="button" onclick={randomizerTitle}><DiceIcon/><span>Random title</span></button>
                            <button type="button"><DiceIcon/><span>Random cover</span></button>
                        </div>
                    </div>
                </div>
                <div class="upload-right-bottom">
                    <button type="button" onclick={resetComponent}>Cancel</button>
                    <input type="submit" class="accent" value="Publish"/>
                </div>
            </div>
        </form>
   {/if}
</section>
{/key}

<style>
    .upload {
        display: flex;
        flex-direction: column;
        /* @todo: css variable */
        background: rgba(0, 0, 0, 0.15);
    }
    .upload-songfile, .upload-metadata {
        padding: 16px;
    }
    .upload-intro {
        display: flex;
        flex-direction: column;
        padding: 14px;
    }
    .upload-intro-buttons {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .upload-split {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: 16px;
        justify-content: space-between;
    }
    .upload-left {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .upload-middle {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
    }
    .upload-right {
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: space-between;
    }
    .upload-right-top {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .upload-right-toggles {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .upload-right-bottom {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }
    .upload-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .upload-field-title {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .upload-field .title {
        display: flex;
        align-items: center;
        /* This creates consistency with the tags title which is
           taller than the others due to having a checkbox inside */
        min-height: 19px;
    }
    :global(.upload-field-title .form-field) {
        color: var(--text-color-info);
    }
    .upload-field-input-group {
        display: flex;
        align-items: center;
    }
    .upload-field-input-group input {
        min-width: 0;
        /* border-left: none; */
    }
    .upload-field-input-prefix {
        /*background: rgba(255, 255, 255, 0.08); */ /* @todo: css variable */
        background: var(--input-background);
        color: var(--text-color-info);
        padding: 7px 8px;
        /* border: 1px solid var(--input-border-color); */

    }
    .upload-field-toggle-group {
        display: flex;
        flex-direction: column;
    }

    /*:global(.upload-field-toggle-group button) {
        border: var(--border);
    }
    :global(.upload-field-toggle-group button:first-of-type) {
        border-bottom: none;
    }*/
    .upload-songfile {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .upload-songfile-warning {
        display: flex;
        gap: 8px;
    }
    :global(.upload-songfile-warning .flat-icon) {
        margin-top: 3px;
    }
    .upload-songfile-warning span{
        /* @todo: set this on all spans but without breaking stuff */
        line-height: 16px;
    }
    .upload-songfile-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .upload-songfile-head-text {
        display: flex;
        align-items: center;
        gap: 8px;
    }
</style>
