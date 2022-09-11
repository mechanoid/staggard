import { resolve } from "https://deno.land/std@0.154.0/path/mod.ts";

import {} from "https://deno.land/std@0.154.0/node/http.ts";

import express from "npm:express";

import { html, renderToStream } from "../../main.ts";
import { document, header, paragraph } from "./components/index.ts";

import { delayedContent } from "./delayed_content.ts";

import data from "./data.json" assert { type: "json" };

const __dirname = new URL(".", import.meta.url).pathname;

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

// we pass a delay function to simulate long running promises to the view layer
// that evaluated while the first lines are send to the client already.
// The processes are cancelled when take to long, so we pass in some fallback content,
// in the form of `<my-fallback-component src="/:content-id"></my-fallback-component>.`
//
// The `<my-fallback-component />` is evaluated at client-side, to refetch the content from
// the server in an asynchronous manner.
app.get("/", async (_: express.ClientRequest, res: express.ServerResponse) => {
  const withIncreasingDelay = delayedContent({ timeout: 600 });
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
  await renderToStream(
    res,
    document(html`
      ${header("Express Example")}
      ${paragraph("Some static text, that is rendered without lookup!")}
      ${
      data.map((d, i) =>
        paragraph(withIncreasingDelay(d, i) as Promise<string>)
      )
    }
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
