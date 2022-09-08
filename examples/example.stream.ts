import { html, HTMLTemplateGenerator, renderToStream } from "../main.ts";

const htmlDocument = (content: HTMLTemplateGenerator) =>
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

const message = "Welcome!";
const delayedContent = (text: string): Promise<string> =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(text), 2000);
  });

await renderToStream(
  Deno.stdout,
  htmlDocument(html`
  <h1>${message}</h1>
  <p>${delayedContent("Hello World!")}</p>
`),
);
