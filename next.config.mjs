/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname, join } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    // distDir: '.next-fixed', // removed to use default .next directory
    webpack: (config) => {
        // Fix for the "[webpack.cache.PackFileCacheStrategy] Serializing big strings" warning
        config.infrastructureLogging = {
            level: 'error', // Hide warnings in the webpack serialization
        };

        // Only override cache options necessary to fix the warning
        if (config.cache) {
            config.cache.maxMemoryGenerations = 1;
        }

        return config;
    },
    turbopack: {
        rules: {
            '*.js': ['swc'],
            '*.ts': ['swc'],
            '*.tsx': ['swc']
        }
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        appDir: true,
    },
};

export default nextConfig;