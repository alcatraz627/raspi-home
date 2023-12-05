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

const PORT = 3000;

const initServer = async () => {
    const server = express();
    const routeHandler = createStaticHandler(routes);

    const vite = await createViteServer({
        server: {
            middlewareMode: true,
        },
        appType: "custom",
    });

    server.use(vite.middlewares);

    server.use(express.static("static"));
    server.use(express.static("dist"));

    server.get("*", (req, res) => {
        (async () => {
            const fetchRequest = createFetchRequest(req);
            const context = (await routeHandler.query(
                fetchRequest
            )) as StaticHandlerContext;
            const router = createStaticRouter(routeHandler.dataRoutes, context);

            try {
                const htmlTemplate = await fs.promises.readFile(
                    __dirname + "/entry/index.html"
                );

                const template = await vite.transformIndexHtml(
                    req.url,
                    htmlTemplate.toString()
                );
                const { render } = await vite.ssrLoadModule(
                    __dirname + "/entry/server.tsx"
                );
                const rendered = await render({ router, context });

                const finalHtml = template
                    .replace(`<!--app-head-->`, rendered.head ?? "")
                    .replace(`<!--app-html-->`, rendered.html ?? "");

                res.send(finalHtml);
                0;
            } catch (e) {
                vite.ssrFixStacktrace(e as Error);
                console.log(e);
                res.end();
            }
        })();
    });

    server.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
};

initServer();
