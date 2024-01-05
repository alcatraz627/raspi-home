import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": __dirname,
        },
    },
    server: {
        port: 3000,
        hmr: true,
        watch: {
            usePolling: true,
            interval: 100,
        },
    },
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.json" })],
});
