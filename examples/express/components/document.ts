import { html, HTMLTemplate } from "../../../main.ts";

export const document = (content: HTMLTemplate) =>
  html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Express Example</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
      <style>
        main {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
      </style>
      <script src="/assets/js/fallback-content.js" type="module" async></script>
  </head>
  <body>
    <main class="container">
      ${content}
    </main>
  </body>
  </html>
`;
