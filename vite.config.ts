import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(
        `\x1b[36m%s\x1b[0m`,
        `🌱 ${env.VITE_APP_ENV} - Environment Loaded`
    );

    return {
        plugins: [react()],
        build: {
            sourcemap: false, // Source Map 비활성화
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@/app': path.resolve(__dirname, './src/app'),
                '@/pages': path.resolve(__dirname, './src/pages'),
                '@/widgets': path.resolve(__dirname, './src/widgets'),
                '@/features': path.resolve(__dirname, './src/features'),
                '@/entities': path.resolve(__dirname, './src/entities'),
                '@/shared': path.resolve(__dirname, './src/shared'),
            },
        },
    };
});
