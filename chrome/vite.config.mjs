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
                { src: 'manifest.json', dest: '.' }
            ]
        })
    ]
});
