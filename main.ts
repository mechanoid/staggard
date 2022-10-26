type TemplateStringKeyList = unknown[];

import { escapeHtml } from "./deps.ts";
import { TemplateString } from "./template_string.ts";

export type HTMLTemplateGenerator = AsyncGenerator;
export type HTMLTemplate =
  | HTMLTemplateGenerator
  | Promise<HTMLTemplateGenerator>;

export interface ResponseStream {
  write(chunk: Uint8Array): unknown;
  close?(): void;
}

const isAsyncIterator = (thing: unknown) =>
  typeof (thing as AsyncGenerator<unknown>)[Symbol.asyncIterator] ===
    "function";

async function* resolver(
  parts: unknown[] = [],
): HTMLTemplateGenerator {
  for (const part of parts) {
    if ((part as TemplateString).isTemplateString) { // just return the static string parts of template literals
      yield part;
    } else if (Array.isArray(part)) { // key is a list of more sub templates, that have to be rendered sequentially
      yield* resolver(part);
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
        yield escapeHtml(resolved as string);
      }
    }
  }
}

// tagged template literals come with an array for the static strings,
// and a second property with dynamic keys. Because we want to run over
// the given parts sequentially we mix them alternatingly to a single array.
const mixUp = (a1: TemplateStringsArray, a2: TemplateStringKeyList = []) => {
  return a1.map((el, i) => [new TemplateString(el), a2[i]]).reduce(
    (res, curr) => {
      return res.concat(curr);
    },
    [],
  ).filter((x) => !!x);
};

// Tagged template literal function
// Usage: html`<some-snippet /><other-snippet />`
export const html = (
  strings: TemplateStringsArray,
  ...keys: TemplateStringKeyList
): HTMLTemplateGenerator => resolver(mixUp(strings, keys));

// renderer to a fixed output string, resolving all async values provided to the template keys
export const renderToString = async (
  template: HTMLTemplate,
): Promise<string> => {
  const result = [];

  while (true) {
    const part = await (await template).next();
    result.push(part.value);
    // console.log(part.value);

    if (part.done) {
      break;
    }
  }

  return result.join("");
};

export const renderToStream = async (
  stream: ResponseStream,
  template: HTMLTemplate,
) => {
  const encoder = new TextEncoder();
  while (true) {
    try {
      const part = await (await template).next();
      stream.write(encoder.encode(part.value));

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
