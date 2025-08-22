<script lang="ts">
	const {
		name,
		label,
		desc = null,
		required = false,
        checked = false
	} = $props();
</script>

<div class="form-field">
    <label>
            <input type="checkbox" {required} {name} {checked}/>
            <span>{label}</span>
            {#if required}
                <span class="label-required-star"> *</span>
            {/if}
    </label>
    {#if desc}
        <p class="form-field-desc" id="desc-id-{name}">
            {desc}
        </p>
    {/if}
</div>

<style>
	.form-field {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
        gap: 5px;
	}
	label {
        display: flex;
        align-items: center;
        gap: 6px;
    }
	.form-field-desc {
		color: var(--text-color-info);
	}
</style>
