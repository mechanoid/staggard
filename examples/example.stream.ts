import { html, HTMLTemplate, renderToStream } from "../main.ts";

const htmlDocument = (content: HTMLTemplate) =>
  html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
    ${content}
  </body>
  </html>
`;

const delayedContent = (text: string, delay = 2000): Promise<string> =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(text), delay);
  });

const contentToBeResolvedBeforeRendering = await delayedContent(
  "Welcome!",
  100,
);

await renderToStream(
  Deno.stdout,
  htmlDocument(html`
  <h1>${contentToBeResolvedBeforeRendering}</h1>
  <p>${delayedContent("Hello World!")}</p>
`),
);
