import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { html, renderToString } from "./main.ts";

const sayHelloSync = (text: string): string => text;
const sayHelloAsync = (text: string): Promise<string> =>
  new Promise((resolve, _reject) => setTimeout(() => resolve(text), 100));

Deno.test("simple tag rendering", async () => {
  const template = html`<div></div>`;
  const result = await renderToString(template);
  assertEquals(result, "<div></div>");
});

Deno.test("render simple doc with doctype", async () => {
  const templateLiteral = `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Document</title></head>
    <body></body>
    </html>
  `;
  const template = html`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Document</title></head>
    <body></body>
    </html>
  `;
  const result = await renderToString(template);

  assertEquals(result, templateLiteral);
});

Deno.test("render snippet with simple key property", async () => {
  const template = html`<div>${"hello, world!"}</div>`;
  const result = await renderToString(template);
  assertEquals(result, "<div>hello, world!</div>");
});

Deno.test("render snippet with html tag collection key property", async () => {
  const subTemplates = [
    html`<p>hello,</p>`,
    html`<p>world!</p>`,
  ] as Array<AsyncGenerator>;
  const template = html`<div>${subTemplates}</div>`;
  const result = await renderToString(template);

  assertEquals(result, "<div><p>hello,</p><p>world!</p></div>");
});

Deno.test("render snippet with async key property", async () => {
  const template = html`<div>${sayHelloAsync("wait for it! Hello,")} ${
    sayHelloSync("you sync world!")
  }</div>`;
  const result = await renderToString(template);

  assertEquals(result, "<div>wait for it! Hello, you sync world!</div>");
});

Deno.test("render snippet with async sub template", async () => {
  const subTemplates = [
    html`<p>${sayHelloAsync("wait for it! Hello,")}</p>`,
    html`<p>${sayHelloSync("you sync world!")}</p>`,
  ];

  const template = html`<div>${subTemplates}</div>`;
  const result = await renderToString(template);

  assertEquals(
    result,
    "<div><p>wait for it! Hello,</p><p>you sync world!</p></div>",
  );
});

Deno.test("render snippet with async sub-sub templates", async () => {
  const subTemplates = [
    html`<p>${sayHelloAsync("wait for it! Hello,")}</p>`,
    html`<p>${html`<em>${
      sayHelloAsync("you async emphasized world!")
    }</em>`}</p>`,
  ];

  const template = html`<div>${subTemplates}</div>`;
  const result = await renderToString(template);

  assertEquals(
    result,
    "<div><p>wait for it! Hello,</p><p><em>you async emphasized world!</em></p></div>",
  );
});

Deno.test("escape input keys that are not `html` tagged templates itself by default", async () => {
  const message = "<script>console.log()</script>";
  const template = html`<div>${message}</div>`;
  const result = await renderToString(template);
  assertEquals(result, "<div>&lt;script&gt;console.log()&lt;/script&gt;</div>");
});
