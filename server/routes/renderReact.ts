import fs from "node:fs/promises";
import path from "node:path";
import { Request, Response } from "express";
import {
    StaticHandlerContext,
    createStaticHandler,
    createStaticRouter,
} from "react-router-dom/server";
import { createFetchRequest } from "../httpToFetchRequest";
import { routes } from "../../client/routes";
import { ViteDevServer } from "vite";

const routeHandler = createStaticHandler(routes);

export const renderFrontEnd =
    (viteServer: ViteDevServer) => async (req: Request, res: Response) => {
        const fetchRequest = createFetchRequest(req);
        const context = (await routeHandler.query(
            fetchRequest
        )) as StaticHandlerContext;
        const router = createStaticRouter(routeHandler.dataRoutes, context);

        try {
            const htmlTemplate = await fs.readFile(
                path.join(__dirname, "..", "entry", "index.html")
            );

            const template = await viteServer.transformIndexHtml(
                req.url,
                htmlTemplate.toString()
            );
            const { render } = await viteServer.ssrLoadModule(
                path.join(__dirname, "..", "entry", "server.tsx")
            );
            const rendered = await render({ router, context });

            const finalHtml = template
                .replace(`<!--app-head-->`, rendered.head ?? "")
                .replace(`<!--app-html-->`, rendered.html ?? "");

            res.send(finalHtml);
            0;
        } catch (e) {
            viteServer.ssrFixStacktrace(e as Error);
            console.log(e);
            res.end();
        }
    };
