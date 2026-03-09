import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//   resolve: {
//     alias: {
//       'styled-components':
//         'styled-components/dist/styled-components.browser.esm.js',
//     },
//   },
//   define: {
//     global: 'globalThis',
//     'process.env': {},
//   },
//   optimizeDeps: {
//     exclude: ['js-big-decimal'],
//   },
//   build: { chunkSizeWarningLimit: 1600 },
// });

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    define: {
      'process.env': env,
      global: 'globalThis', // Mueve esta línea para que esté dentro del bloque define
    },
    resolve: {
      alias: {
        'styled-components':
          'styled-components/dist/styled-components.browser.esm.js',
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
    build: { chunkSizeWarningLimit: 1600 },
  };
});
