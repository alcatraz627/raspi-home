import { apiRouter } from "@/server/routes/api/api.ts";
import { renderStaticAssets } from "@/server/routes/renderStaticAssets.ts";
import express from "express";
import cors from "cors";
import ViteExpress from "vite-express";
// import "module-alias/register";

const PORT = 3000;
const IP = "0.0.0.0";

const initServer = async () => {
    const server = express();
    server.use(cors());

    renderStaticAssets(server);

    server.use("/api", apiRouter);

    // TODO: Server flag
    ViteExpress.listen(server, PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
};

initServer();
