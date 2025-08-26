<script lang="ts">
    import ErrorMessage from '$components/ErrorMessage.svelte';
    import AddIcon from '$components/icons/AddIcon.svelte';
    import Meta from '$components/Meta.svelte';
    import PageHead from '$components/PageHead.svelte';
    import TextField from '$components/TextField.svelte';

    import { api_POST } from '$lib/api';
    import { getFormData } from '$lib/forms';

    let error = $state('');

    function onSubmit(e: SubmitEvent) {
        const formData = getFormData(e);
        api_POST('user/login', {
            username: formData.get('username'),
            password: formData.get('password')
        }).then(() => {
            location.href = '/';
        }).catch((err) => {
            error = err.message;
        });
    }
</script>

<Meta title="login" />
<PageHead text="Log in to metacloud" icon={AddIcon} />
<ErrorMessage {error} />
<section class="page-content">
    <form onsubmit={onSubmit}>
        <TextField name="username" label="Username" />
        <TextField name="password" label="Password" type="password" />
        <a href="/signup">I don't have an account yet</a>
        <input type="submit" value="Login" />
    </form>
</section>
