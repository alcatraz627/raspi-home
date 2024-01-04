import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": __dirname,
        },
    },
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.json" })],
    build: {
        lib: {
            entry: path.resolve(__dirname, "client/index.tsx"),
            name: "react-vite-ssr",
            fileName: () => `index.js`,
        },
    },
});
