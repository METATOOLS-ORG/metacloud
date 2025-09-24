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

    const { user } = $props();

    let newSong = $state(false);
    let error = $state("");
    let songAsset: string | null = $state(null);
</script>

<section class="upload">
    <!-- Post type selector (pre-click) -->
    {#if !newSong}
        <div class="upload-intro">
            <div class="upload-intro-buttons">
                <button onclick={()=>{newSong = true}}><SketchIcon/>New sketch</button>
                <button onclick={()=>{newSong = true}}><DiskIcon/>New release</button>
                <button><TextIcon/>New post</button>
            </div>
            <SketchGuideVector/>
       </div>

   {/if}

   <!-- New song file upload -->
   {#if newSong && !songAsset}
        <ErrorMessage {error} />
        <div class="upload-songfile">
            <h1>Upload an audio file</h1>
            <span class="info">Max 30 MB - Supported: mp3, wav, flac, ogg</span>
            <AssetUploader
                height="64px"
                icon="speaker"
                caption="Click or drag audio to upload"
                onAssetUploaded={(id: string) => {
                    songAsset = id;
                }}
                name="audioAssetId"
                onError={(err: string) => {
                    error = err;
                }}
            />
            <span class="upload-songfile-warning info">WARNING: Metacloud is for posting your own music, not for reuploads. Do not upload other people's copyrighted music, or your account will be banned. Remixes and flips are generally fine.</span>
        </div>
   {/if}

   <!-- New song metadata -->
   {#if newSong && songAsset}
        <div class="upload-metadata upload-split">
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
                    <input type="text" name="title" placeholder="My new song" />
                </div>
                <div class="upload-field">
                    <span class="title">Description</span>
                    <textarea name="desc" placeholder="Any links or details (optional)" rows=2></textarea>
                </div>
                <div class="upload-field">
                    <div class="upload-field-title">
                        <span class="title">Tags</span>
                        <CheckboxField name="test" label="first tag is genre" checked/>
                    </div>
                    <input type="text" name="tags" placeholder="electronic, comma, seperated" />
                </div>
                <div class="upload-field">
                    <span class="title">Link</span>
                    <div class="upload-field-input-group">
                        <span class="upload-field-input-prefix">/@litevex/</span>
                        <input type="text" name="link" placeholder="songname" style:flex={1}/>
                    </div>
                </div>
            </div>
            <div class="upload-right">
                <div class="upload-right-top">
                    <div class="upload-right-toggles">
                        <CheckboxField name="test" label="Pin as latest release" checked/>
                        <CheckboxField name="test" label="Work in progress" checked/>
                        <CheckboxField name="test" label="Feedback wanted" checked/>
                        <CheckboxField name="test" label="Allow downloads" checked/>
                    </div>
                    <div class="upload-field">
                        <span class="title">Randomizer</span>
                        <div class="upload-field-toggle-group">
                            <button><DiceIcon/><span>Random cover</span></button>
                            <button><DiceIcon/><span>Random title</span></button>
                        </div>
                    </div>
                </div>
                <div class="upload-right-bottom">
                    <button>Cancel</button>
                    <button class="accent">Publish</button>
                </div>
            </div>
        </div>
   {/if}
</section>

<style>
    .upload {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.15);
    }
    .upload-songfile, .upload-metadata {
        padding: 16px;
    }
    .upload-intro {
        display: flex;
        flex-direction: column;
        padding: 10px;
    }
    .upload-intro-buttons {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .upload-split {
        display: flex;
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
    }
    .upload-field-input-prefix {
        background: rgba(255, 255, 255, 0.08); /* @todo: css variable */
        color: var(--text-color-info);
        padding: 6px 8px;
    }
    .upload-field-toggle-group {
        display: flex;
        flex-direction: column;
    }
    .upload-songfile {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .upload-songfile-warning {
        /* @todo: set this on all spans but without breaking stuff */
        line-height: 16px;
    }
</style>
