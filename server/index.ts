import { apiRouter } from "@/server/routes/api/api";
import { renderStaticAssets } from "@/server/routes/renderStaticAssets";
import express from "express";
import "module-alias/register";

const PORT = 3000;

const initServer = async () => {
    const server = express();

    server.use("/api", apiRouter);

    renderStaticAssets(server);

    server.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
};

initServer();
