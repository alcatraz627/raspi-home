import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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

    plugins: [react(), splitVendorChunkPlugin()],

    build: {
        rollupOptions: {
            output: {
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
});
