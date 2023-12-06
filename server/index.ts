import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
    createStaticHandler,
    createStaticRouter,
    StaticHandlerContext,
} from "react-router-dom/server";
import { routes } from "../client/routes";
import { createFetchRequest } from "./httpToFetchRequest";
import {
    createDir,
    getFile,
    createFile,
    fileUploadScreen,
    listDirContents,
} from "./routes/api/directory";
import { apiRouter } from "./routes/api/api";
import { renderFrontEnd } from "./routes/renderReact";

const PORT = 3000;

const initServer = async () => {
    const server = express();

    const viteServer = await createViteServer({
        server: {
            middlewareMode: true,
        },
        appType: "custom",
    });

    server.use(viteServer.middlewares);

    server.use(express.static("static"));
    server.use(express.static("dist"));
    server.use(express.static("data"));
    server.use("/favicon.ico", express.static("favicon.png"));

    server.use("/api", apiRouter);

    server.get("*", renderFrontEnd(viteServer));

    server.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
};

initServer();
