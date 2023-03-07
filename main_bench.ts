import { attr, html } from "./main.ts";

Deno.bench("render attr snippet", () => {
  attr("placeholder", "fubar");
});

Deno.bench("render html snippet", () => {
  html`
  <div>Hello, World!</div>
 `;
});

Deno.bench("render html snippet with variable", () => {
  const message = "World";
  html`
  <div>Hello, ${message}</div>
 `;
});

Deno.bench("render html snippet with variable multiple times", () => {
  const template = (message: string) =>
    html`
    <div>Hello, ${message}</div>
 `;

  template("world!");
  template("world!");
  template("world!");
  template("world!");
  template("world!");
  template("world!");
  template("world!");
  template("world!");
  template("world!");
});

Deno.bench("render nested html snippet", () => {
  html`
  <div>hello, ${html`<p>world!</p>`}</div>
 `;
});

Deno.bench("render deeply nested html snippet", () => {
  html`
  <div>hello, ${html`<p>world! ${html`<p>world! ${html`<p>world!${html`<p>world!${html`<p>world!</p>`}</p>`}</p>`}</p>`}</p>`}</div>
 `;
});
