import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                content: 'src/content/content.js',
                background: 'src/background/background.js'
            },
            output: {
                entryFileNames: '[name].js',
                format: 'es'
            }
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'src/manifest.json', dest: '.' },
                { src: 'LICENSE', dest: '.' },
                { src: 'README.md', dest: '.', required: false }
            ]
        })
    ]
});