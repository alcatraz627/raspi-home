import express from "express";
import { apiRouter } from "./routes/api/api";
import { renderStaticAssets } from "./routes/renderStaticAssets";

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
