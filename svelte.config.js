import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        alias: {
            "$components": "./src/components",
            "root": "/"
        },
        files: {
            "hooks": {
                server: "src/hooks/server",
                client: "src/hooks/client",
                universal: "src/hooks/universal"
            }
        }
    }
};

export default config;
