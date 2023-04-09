import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'KMB_IT',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@planes': path.resolve(__dirname, './src/planes'),
      '@': path.resolve(__dirname, './src'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
