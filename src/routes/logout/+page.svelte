<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';

	if (browser) {
		invalidateAll();
		window.location.href = '/';
	}
</script>

<section class="page-content">Logging you out...</section>
