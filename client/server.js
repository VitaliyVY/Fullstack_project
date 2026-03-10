/* eslint-env node */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.argv.includes("--prod");
const port = Number(process.env.PORT) || 4173;

const resolve = (target) => path.resolve(__dirname, target);
const app = express();

let vite;

if (!isProd) {
  vite = await createViteServer({
    root: __dirname,
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
} else {
  app.use(
    "/assets",
    express.static(resolve("dist/client/assets"), {
      immutable: true,
      maxAge: "1y",
      index: false,
    }),
  );

  app.use(
    express.static(resolve("dist/client"), {
      index: false,
    }),
  );
}

app.use("*", async (req, res) => {
  const url = req.originalUrl;

  try {
    let template;
    let render;

    if (!isProd) {
      template = await fs.readFile(resolve("index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = await fs.readFile(resolve("dist/client/index.html"), "utf-8");
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const { appHtml, queryState } = await render(url);

    const html = template
      .replace("<!--ssr-outlet-->", appHtml)
      .replace("<!--ssr-state-->", queryState);

    res.status(200).setHeader("Content-Type", "text/html").end(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).end("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`SSR server running on http://localhost:${port}`);
});
