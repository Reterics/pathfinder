import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, relative } from 'node:path'

import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.firefox.config';
import { defineViteConfig as define } from './define.config'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({
            manifest,
            browser: 'firefox',
        }),

        // rewrite assets to use relative path
        {
            name: 'assets-rewrite',
            enforce: 'post',
            apply: 'build',
            transformIndexHtml(html, { path }) {
                return html.replace(
                    /"\/assets\//g,
                    `"${relative(dirname(path), '/assets')}/`
                )
            },
        },
    ],
    build: {
        emptyOutDir: true,
        outDir: 'firefox'
    },
    assetsInclude: ['src/assets/*/**'],
    define
})
