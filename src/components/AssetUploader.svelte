<script lang="ts">
    import prettyBytes from 'pretty-bytes';
    import type { AssetUploadRespDTO } from '$lib/dto';
	import HeartIcon from './icons/HeartIcon.svelte';
	import AddIcon from './icons/AddIcon.svelte';
	import DiskIcon from './icons/DiskIcon.svelte';
    let {
        width = null,
        height = null,
        imageMode = false,
    miniMode = true,
        verticalPrompt = imageMode,
        icon = null,
        caption = null,
        name = null,
        stretch = false,
        hidden = false,
        center = imageMode,
        presetFile = null,
        presetAssetId = null,
        // @todo: give these types
        onFileDragged = null,
        onAssetUploaded = null,
        onError = null
    } = $props();

    if (!caption) caption = imageMode ? 'Drag to upload image' : 'Drag to upload file';
    if (!icon) icon = imageMode ? 'paint' : 'drag';

    let files = $state<FileList | File[] | null>(presetFile ? [presetFile] : null);
    let inputRef: HTMLInputElement;

    let file = $derived(files?.[0]);
    let fileObjectURL = $derived.by(() => {
        if (file) return URL.createObjectURL(file);
        return null;
    });

    let isDragging = $state(false);
    let isUploading = $state(false);
    let uploadProgress = $state(0);
    let assetId = $state<string | null>(presetAssetId);

    export function click() {
        inputRef?.click();
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            click();
        }
    }

    $effect(() => {
        if (file) {
            // @todo: do checks here to see if the file is eligible to be uploaded

            const xhr = new XMLHttpRequest();

            const formData = new FormData();
            formData.append('asset', file);

            xhr.open('POST', `/api/asset`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    uploadProgress = event.loaded / event.total;
                }
            };

            xhr.upload.onerror = () => {
                console.log('Upload error');
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status === 200) {
                        let resp = JSON.parse(xhr.responseText) as AssetUploadRespDTO;
                        console.log('Upload successful:', resp);
                        assetId = resp.id;

                        // Reset error message
                        if(onError) onError("");

                        if (onAssetUploaded) onAssetUploaded(resp.id);
                    } else {
                        console.log('Upload failed:', xhr.responseText);
                        if (onError) onError(JSON.parse(xhr.responseText).message);
                    }
                    isUploading = false;
                }
            };

            isUploading = true;
            xhr.send(formData);
        }
    });

    const dragenter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
    };

    const dragover = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const dragleave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = false;
    };

    const drop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = false;

        // Set the file we dropped in
        if (e?.dataTransfer?.files[0]) {
            file = e.dataTransfer.files[0];
            if (onFileDragged) onFileDragged(file);
            e.dataTransfer.clearData();
        }
    };

    const onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target?.files?.[0]) {
            file = target.files[0];
            if (onFileDragged) onFileDragged(file);
        }
    }
</script>

<div
    class="file-uploader"
    tabindex="0"
    onclick={click}
    onkeydown={keydown}
    ondragenter={dragenter}
    ondragover={dragover}
    ondragleave={dragleave}
    ondrop={drop}
    role="button"
    aria-label="File uploader"
    style:width
    style:height
    style:flex={stretch ? 1 : undefined}
    class:dragging={isDragging}
    class:hidden={hidden}
>
    <input
        type="file"
        class="file-uploader-input"
        onchange={onchange}
        bind:this={inputRef}
        hidden
    />
    {#if !file}
        <div
            class="file-uploader-prompt"
            class:vertical={verticalPrompt}
            class:center={center}
            role="presentation"
        >
            <!-- <IconSmall {icon} /> -->
            <AddIcon/>
            <span>{caption}</span>
        </div>
    {/if}

    {#if file}
        {#if !imageMode}
            <div class="file-uploader-preview">
                <!-- @todo: get correct icon from file metatype -->
                <!-- <IconSmall icon="speaker" /> -->
                <DiskIcon/>
                <div class="file-uploader-preview-text">
                    <span class="bold">{file?.name}</span>
                    <span class="info">{prettyBytes(file?.size)}</span>
                </div>
            </div>
        {:else}
            <div class="file-uploader-img-preview">
                <img class="file-uploader-img" src={fileObjectURL} alt="uploaded file" />
            </div>
        {/if}
        {#if isUploading}
            <div class="file-uploader-progress">
                <div
                    class="file-uploader-progress-bar"
                    style:width={`${uploadProgress * 100}%`}
                ></div>
            </div>
        {/if}
    {/if}

    {#if name && assetId}
        <input type="hidden" {name} value={assetId}/>
    {/if}
</div>

<style>
    .file-uploader {
        display: flex;
        flex-direction: column;
        background: var(--file-background);
        border: 1px solid var(--input-border-color);
        border-style: dashed;
        user-select: none;
        cursor: pointer;
    }
    .file-uploader.hidden {
        display: none;
    }
    .file-uploader:hover, .file-uploader.dragging {
        background: var(--file-hover-background);
    }

    .file-uploader-prompt.center {
        justify-content: center;
    }
    .file-uploader-prompt {
        display: flex;
        align-items: center;
        pointer-events: none;
        flex: 1;
        padding: 16px;
        gap: 14px;
    }

    .file-uploader-prompt.vertical {
        flex-direction: column;
    }

    .file-uploader-preview {
        display: flex;
        flex: 1;
        padding-left: 12px;
        align-items: center;
        gap: 10px;
        pointer-events: none;
    }

    .file-uploader-preview-text {
        display: flex;
        flex-direction: row;
        gap: 4px;
    }

    .file-uploader-img-preview {
        display: flex;
        flex: 1;
        justify-content: center;
        pointer-events: none;
    }

    .file-uploader-progress {
        background: var(--progress-bar-background);
    }

    .file-uploader-progress-bar {
        background: var(--accent-color);
        height: 10px;
    }

    .file-uploader-img {
        width: 100%;
        height: auto;
    }
</style>
