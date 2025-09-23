<script lang="ts">
	import AddIcon from "./icons/AddIcon.svelte";
	import DiskIcon from "./icons/DiskIcon.svelte";
	import SketchIcon from "./icons/SketchIcon.svelte";
	import TextIcon from "./icons/TextIcon.svelte";
	import SketchGuideVector from "./SketchGuideVector.svelte";

    const { user } = $props();
</script>

<section class="upload">

   <section class="upload-intro">
    <button><SketchIcon/>New sketch</button>
    <button><DiskIcon/>New release</button>
    <button><TextIcon/>New post</button>
   </section>
   <SketchGuideVector/>
</section>

<style>
    .upload {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background: rgba(0, 0, 0, 0.15);
    }
    .upload-intro {
        display: flex;
        gap: 8px;
        align-items: center;
    }

</style>
