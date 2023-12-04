import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

const initServer = async () => {
  const server = express();

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
        const rendered = await render(req.url);

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
