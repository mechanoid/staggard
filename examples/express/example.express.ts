import { resolve } from "https://deno.land/std@0.154.0/path/mod.ts";

import {} from "https://deno.land/std@0.154.0/node/http.ts";

import express from "npm:express";

import { html, HTMLTemplateGenerator, renderToStream } from "../../main.ts";

import { delayedContent } from "./delayed_content.ts";

import data from "./data.json" assert { type: "json" };

const __dirname = new URL(".", import.meta.url).pathname;

const htmlDocument = (content: HTMLTemplateGenerator) =>
  html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="/assets/js/fallback-content.js" type="module" async></script>
  </head>
  <body>
    ${content}
  </body>
  </html>
`;

const app = express();

const assetPath = resolve(__dirname, "./assets");

// NOTE! express.static does not work properly, because sendFile seams broken, therefore singlefile sending
app.get(
  "/assets/js/fallback-content.js",
  async (_req: express.ClientRequest, res: express.ServerResponse) => {
    const fileContent = await Deno.readTextFile(
      resolve(assetPath, "js/fallback-content.js"),
    );

    res.setHeader("Content-Type", "text/javascript;charset=UTF-8");
    res.send(fileContent);
  },
);

app.get("/", async (_: express.ClientRequest, res: express.ServerResponse) => {
  await renderToStream(
    res,
    htmlDocument(html`
    <h1>Headline!</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet repellendus magnam vitae, voluptatibus totam officiis illo molestiae recusandae ea porro eum harum, doloribus neque accusamus iusto tenetur nulla adipisci? Quisquam.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet repellendus magnam vitae, voluptatibus totam officiis illo molestiae recusandae ea porro eum harum, doloribus neque accusamus iusto tenetur nulla adipisci? Quisquam.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet repellendus magnam vitae, voluptatibus totam officiis illo molestiae recusandae ea porro eum harum, doloribus neque accusamus iusto tenetur nulla adipisci? Quisquam.</p>
    ${data.map((d, i) => html`<p>${delayedContent(d, i)}</p>`)}
  `),
  );
});

app.get("/:id", (req: express.ClientRequest, res: express.ServerResponse) => {
  const { id } = req.params;
  const dataPoint = data[parseInt(id)];
  res.send(dataPoint);
});

const server = app.listen(3001, () => {
  console.log("server started at", `http://localhost:${server.address().port}`);
});
