/// <reference types='vitest' />
import { PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

function postBuild() {
  return {
    name: 'postbuild-commands',
    closeBundle: async () => {
      if (process.env.OPEN_BROWSER === 'true') {
        await exec('nx open_in_browser tagger-e2e');
      }
    },
  };
}

function manifestJSON(): PluginOption {
  let isWatching = false;
  return {
    name: 'manifest-json',
    buildStart() {
      if (!isWatching) {
        const absPackagePath = path.resolve('public', 'manifest.json');
        const realPackagePath = fs.realpathSync(absPackagePath);
        this.addWatchFile(realPackagePath);
        isWatching = true;
      }
    },
  };
}

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/tagger',
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths(), postBuild(), manifestJSON()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    sourcemap: 'inline',
    outDir: '../../dist/browser-extensions/tagger',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        format: 'iife',
      },
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/tagger',
      provider: 'v8',
    },
  },
});
