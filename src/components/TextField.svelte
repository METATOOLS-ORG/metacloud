<script lang="ts">
	import { online } from "svelte/reactivity/window";

    const {
        name,
        label,
        type = 'text',
        prefix = null,
        desc = null,
        placeholder = null,
        oneline = false,
        required = true,
        showRequired = true,
        stretch = false,
        minLabelWidth = null,
        datalistId = ""
    } = $props();
</script>

<!-- @todo: oneline is kind of a mess - honestly just should rewrite or split up this component-->
<div class="form-field" class:oneline={oneline}>
    <label for="label-id-{name}">
        <p class="form-field-label-split">
            <span class="form-field-label" style:min-width={minLabelWidth}>
                {label}{#if oneline}:{/if}
            </span>
            {#if required && showRequired}
                <span class="label-required-star">*</span>
            {/if}
        </p>
    </label>
    {#if desc}
        <p class="form-field-desc" id="desc-id-{name}">
            {desc}
        </p>
    {/if}
    <div class="form-field-input-group" class:stretch={stretch}>
        {#if prefix}
            <span class="form-field-prefix">{prefix}</span>
        {/if}
        <input {type} {required} class:stretch={stretch} id="label-id-{name}" {name} {placeholder} list={datalistId}/>
    </div>
</div>

<style>
    .form-field {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    label {
        display: inline-block;
    }
    .form-field-label {
        display: block;
    }
    .form-field-desc {
        color: var(--text-color-info);
    }
    .form-field-input-group {
        display: flex;
        align-items: center;
    }

    .form-field.oneline {
        flex-direction: row;
        align-items: center;
        gap: 6px;
    }
    .form-field.oneline p {
        display: contents;
        margin: 0;
        padding: 0;
    }
    .form-field-input-group.stretch, input.stretch {
        flex: 1;
    }
    .form-field-prefix {
        /* border: 1px solid var(--border-color); */
        background: rgba(255, 255, 255, 0.08); /* @todo: css variable */
        border-right: none;
        color: var(--text-color-info);
        padding: 6px 8px;
    }
    .form-field-label-split {
        display: flex;
        gap: 5px;
    }
</style>
