<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import ErrorMessage from '$components/ErrorMessage.svelte';
    import FancyBanner from '$components/FancyBanner.svelte';
    import AddIcon from '$components/icons/AddIcon.svelte';
    import Meta from '$components/Meta.svelte';
    import PageHead from '$components/PageHead.svelte';
    import TextField from '$components/TextField.svelte';
    import { api_POST } from '$lib/api';
    import { getFormData } from '$lib/forms';

    let error = $state('');

    function onSubmit(e: SubmitEvent) {
        const formData = getFormData(e);
        api_POST('user', {
            email: formData.get('email'),
            displayName: formData.get('displayName'),
            username: formData.get('username'),
            password: formData.get('password'),
            inviteCode: formData.get('inviteCode')
        })
        .then((resp) => {
            location.href = '/@' + resp.username;
        })
        .catch((err) => {
            error = err.message;
        });
    }
</script>

<Meta title="sign up" />
<PageHead icon={AddIcon} text="Create an account"/>
<ErrorMessage {error} />
<section class="page-content">
    <form onsubmit={onSubmit}>
        <TextField
            name="email"
            label="Email"
            desc="This will be used for logging in and in case you forget your password."
        />
        <TextField
            name="displayName"
            label="Display name"
            desc="This will show up as your name in most places."
        />
        <TextField
            name="username"
            label="@ Username"
            desc="This will be used in links to your profile and songs and has to be unique."
        />
        <TextField
            name="password"
            label="Password"
            type="password"
            desc="Min. 6 characters and uppercase letters."
        />
        <TextField
            name="inviteCode"
            label="Invite code"
            desc="If you don't have an invite code, ask an existing user for one."
        />
        <a href="/login">I already have an account</a>
        <input type="submit" value="Sign up" />
    </form>
</section>
