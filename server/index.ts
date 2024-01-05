import { apiRouter } from "@/server/routes/api/api";
import { renderStaticAssets } from "@/server/routes/renderStaticAssets";
import express from "express";
import "module-alias/register";

const PORT = 3001;
const IP = "0.0.0.0";

const initServer = async () => {
    const server = express();

    renderStaticAssets(server);

    server.use("/api", apiRouter);

    // TODO: Server flag
    server.listen(PORT, IP, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
};

initServer();
