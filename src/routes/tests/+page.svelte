<script lang="ts">
    import PageHead from "$components/PageHead.svelte";
	import ToggleField from "$components/ToggleField.svelte";
    import AddIcon from "$components/icons/AddIcon.svelte";
</script>
<PageHead text="Component test"/>
<section class="page-content">
    <ToggleField icon={AddIcon} name="my-form-field" label="Enable Toggle Button"/>
</section>
