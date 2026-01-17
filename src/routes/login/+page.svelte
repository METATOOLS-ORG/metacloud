<script lang="ts">
    import ErrorMessage from '$components/ErrorMessage.svelte';
    import AddIcon from '$components/icons/AddIcon.svelte';
    import Meta from '$components/Meta.svelte';
    import PageHead from '$components/PageHead.svelte';
    import TextField from '$components/TextField.svelte';
	import api from '$lib/api';

    import { getFormData } from '$lib/forms';

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

<Meta title="login" />
<PageHead text="Log in to metacloud" icon={AddIcon} />
<ErrorMessage {error} />
<section class="page-content">
    <form onsubmit={onSubmit}>
        <TextField name="username" label="Username" />
        <TextField name="password" label="Password" type="password" />
        <a href="/signup">I don't have an account yet</a>
        <div class="signup-actions">
            <input type="submit" value="Login" />
        </div>
    </form>
</section>

<style>
    .page-content {
        display: flex;
        flex: 1;
        justify-content: center;
        padding-top: 48px;
    }
    .signup-actions {
        align-self: stretch;
        display: flex;
    }
    .signup-actions input[type="submit"] {
        flex: 1;
    }
</style>
