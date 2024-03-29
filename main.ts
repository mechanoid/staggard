type TemplateStringKeyList = unknown[];

import { escapeHtml } from "./deps.ts";
import { TemplateString } from "./template_string.ts";
import {
  type AttributeValue,
  TemplateAttribute,
} from "./template_attribute.ts";

export type HTMLTemplateGenerator = AsyncGenerator;
export type HTMLTemplate =
  | HTMLTemplateGenerator
  | Promise<HTMLTemplateGenerator>;

export interface ResponseStream {
  write(chunk: Uint8Array | string): unknown;
  close?(): void;
}

const isAsyncIterator = (thing: unknown) =>
  typeof (thing as AsyncGenerator<unknown>)[Symbol.asyncIterator] ===
    "function";

async function* resolver(
  parts: unknown[] = [],
): HTMLTemplateGenerator {
  let i = 0;
  for (const part of parts) {
    if ((part as TemplateString).isTemplateString) { // just return the static string parts of template literals
      yield part;
    } else if (Array.isArray(part)) { // key is a list of more sub templates, that have to be rendered sequentially
      yield* resolver(part);
    } else if (part instanceof TemplateAttribute) { // key is a list of more sub templates, that have to be rendered sequentially
      const nextPart = parts[i + 1];

      yield (nextPart instanceof TemplateAttribute)
        ? part.toString()
        : part.toString().trimEnd();
    } else if (
      typeof (part as AsyncGenerator<unknown>)[Symbol.asyncIterator] ===
        "function"
    ) { // key is itself an iterator
      yield* (part as HTMLTemplateGenerator);
    } else {
      // part is now a key provided to a template, that should be something like a string
      // Itself might be a new `html` generator, so that we pass yield then to it.
      const resolved = await part;

      // sometimes an asynchronous call results also in an `html` tagged template.
      // Such should not be escaped but handed to yield. (E.g. when a canceled promise results in alternative html`...` content.)
      if (isAsyncIterator(resolved)) {
        yield* (resolved as HTMLTemplateGenerator);
      } else {
        // anything else should be treated as a string and therefore be escaped for control signs
        // yield escapeHtml(resolved as string);
        yield escapeHtml((resolved?.toString()) || "" as string);
      }
    }
    i++;
  }
}

// tagged template literals come with an array for the static strings,
// and a second property with dynamic keys. Because we want to run over
// the given parts sequentially we mix them alternatingly to a single array.
export const mixUp = (
  a1: TemplateStringsArray,
  a2: TemplateStringKeyList = [],
) => {
  return a1.map((el, i) => [new TemplateString(el), a2[i]]).reduce(
    (res, curr) => {
      return res.concat(curr);
    },
    [],
  ).filter((x) => x !== null && x !== undefined);
};

// Tagged template literal function
//
// Usage: html`<some-snippet /><other-snippet />`
export const html = (
  strings: TemplateStringsArray,
  ...keys: TemplateStringKeyList
): HTMLTemplateGenerator => resolver(mixUp(strings, keys));

// Attribute function for dynamically added attributes,
// that can be rendered conditionally, depending on the attribute value.
//
// Usage: html`<some-snippet ${attr("foo", "bar")} />`
export const attr = (key: string, value: AttributeValue): TemplateAttribute =>
  new TemplateAttribute(key, value);

// renderer to a fixed output string, resolving all async values provided to the template keys
export const renderToString = async (
  template: HTMLTemplate,
  options: { minify?: boolean } = {},
): Promise<string> => {
  const result = [];

  while (true) {
    const part = await (await template).next();

    result.push(part.value);

    if (part.done) {
      break;
    }
  }

  return options.minify ? minify(result.join("")) : result.join("");
};

export const renderToStream = async (
  stream: ResponseStream,
  template: HTMLTemplate,
  options: { minify?: boolean } = {},
) => {
  const encoder = new TextEncoder();
  while (true) {
    try {
      const part = await (await template).next();
      const value = options.minify ? minify(part.value) : part.value;

      stream.write(encoder.encode(value));

      if (part.done) {
        stream.close ? stream.close() : null;
        break;
      }
    } catch (e) {
      console.log("could not finish stream", e.message);
      break;
    }
  }
};

function minify(text: string) {
  return text?.toString().replace(/\s+/g, " ").replace(/\s>/, ">");
}

export {
  type AttributeValue,
  TemplateAttribute,
} from "./template_attribute.ts";

export { TemplateString } from "./template_string.ts";
