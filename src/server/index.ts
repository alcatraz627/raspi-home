import { apiRouter } from "@/server/routes/api/api.ts";
import { renderStaticAssets } from "@/server/routes/renderStaticAssets.ts";
import express from "express";
import cors from "cors";
import ViteExpress from "vite-express";
// import "module-alias/register";

const PORT = 3000;
const HOST = "localhost";

const initServer = async () => {
    const app = express();
    app.use("*", cors());

    renderStaticAssets(app);

    app.use("/api", apiRouter);

    // TODO: Server flag
    const server = app.listen(PORT, () => {
        console.log(`Server is listening on http://${HOST}:${PORT}`);
    });

    ViteExpress.config({ viteConfigFile: "vite.config.ts" });

    ViteExpress.bind(app, server);
};

initServer();
