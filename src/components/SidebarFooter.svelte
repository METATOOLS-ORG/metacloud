<div class="sidebar-footer">
    <a class="github-link" href="https://github.com/METATOOLS-ORG/metacloud">contribute on github</a>
    <div class="sidebar-footer-links">
        <a href="/tos">terms of services</a>
        <a href="/contact">report dmca</a>
        <a href="/contact">contact</a>
        <a href="/privacy">privacy policy</a>
    </div>
</div>

<style>
    .sidebar-footer {
        display: flex;
        flex-direction: column;
        padding: 14px;
        flex-wrap: wrap;
        gap: 10px;
        color: var(--text-color-info);
    }

    .sidebar-footer a {
        color: var(--text-color-info);
    }

    .sidebar-footer-links {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
    }

    .sidebar-footer-links a {
        display: block;
        height: 14px;
    }
    .sidebar-footer-links a:not(:last-child)::after {
        content: " /";
        opacity: 0.5;
    }
</style>
