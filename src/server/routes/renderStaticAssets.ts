import express, { Express } from "express";

// const routeHandler = createStaticHandler(routes);

export const renderStaticAssets = async (server: Express) => {
    // const viteServer = await createViteServer({
    //     server: {
    //         middlewareMode: true,
    //     },
    //     appType: "custom",
    // });

    // server.use(viteServer.middlewares);

    // server.use("favicon.ico", express.static("static/favicon.png"));
    // server.use("favicon.png", express.static("static/favicon.png"));

    server.use(express.static("static"));
    server.use(express.static("dist"));
    server.use(express.static("data"));

    // server.get("*", renderFrontEnd(viteServer));
};

// export const renderFrontEnd =
//     (viteServer: ViteDevServer) => async (req: Request, res: Response) => {
//         const fetchRequest = createFetchRequest(req);
//         const context = (await routeHandler.query(
//             fetchRequest
//         )) as StaticHandlerContext;
//         const router = createStaticRouter(routeHandler.dataRoutes, context);

//         try {
//             const htmlTemplate = await fs.readFile(
//                 path.join(__dirname, "..", "entry", "index.html")
//             );

//             const template = await viteServer.transformIndexHtml(
//                 req.url,
//                 htmlTemplate.toString()
//             );
//             const { render } = await viteServer.ssrLoadModule(
//                 path.join(__dirname, "..", "entry", "server.tsx")
//             );
//             const rendered = await render({ router, context });

//             const finalHtml = template
//                 .replace(`<!--app-head-->`, rendered.head ?? "")
//                 .replace(`<!--app-html-->`, rendered.html ?? "");

//             res.send(finalHtml);
//             0;
//         } catch (e) {
//             viteServer.ssrFixStacktrace(e as Error);
//             console.log(e);
//             res.end();
//         }
//     };
