import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const hash = Math.floor(Math.random() * 90000) + 10000;

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.join(__dirname, "src"),
        },
    },
    server: {
        port: 3000,
        // hmr: true,
        // watch: {
        //     usePolling: true,
        //     interval: 100,
        // },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `[name].${hash}.js`,
                chunkFileNames: `[name].${hash}.js`,
                assetFileNames: `[name].${hash}.[ext]`,
                manualChunks: {
                    react: ["react", "react-dom"],
                    material: [
                        "@mui/material",
                        "@mui/icons-material",
                        "@emotion/react",
                        "@emotion/styled",
                    ],
                    md: ["@uiw/react-markdown-editor"],
                },
            },
        },
    },
    plugins: [react(), splitVendorChunkPlugin()],
});
