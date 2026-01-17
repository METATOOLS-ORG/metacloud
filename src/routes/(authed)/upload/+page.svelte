<script lang="ts">
    import ErrorMessage from '$components/ErrorMessage.svelte';
    import AddIcon from '$components/icons/AddIcon.svelte';
    import Meta from '$components/Meta.svelte';
    import PageHead from '$components/PageHead.svelte';
	import QuickUploadCard from '$components/QuickUploadCard.svelte';
    import TextField from '$components/TextField.svelte';
	import api from '$lib/api';

    import { getFormData } from '$lib/forms';

    const { data } = $props();
    let error = $state('');

    function onSubmit(e: SubmitEvent) {
        const formData = getFormData(e);
        api.post('user/login', {
            username: formData.get('username'),
            password: formData.get('password')
        }).then(() => {
            location.href = '/';
        }).catch((err) => {
            error = err.message;
        });
    }
</script>

<Meta title="upload" />
<div class="page-split">
    <section class="content">
        <PageHead text="New post" icon={AddIcon}/>
        <QuickUploadCard user={data?.user}/>
    </section>
    <aside class="sidebar">
        <PageHead sidebar text="Rules" icon={AddIcon}/>
        <div class="sidebar-content">
            <span>wip</span>
        </div>
    </aside>
</div>

<style>

</style>
