type TemplateStringKeyList = Array<unknown>;

export type HTMLTemplateGenerator = AsyncGenerator;

interface ResponseStream {
  write(chunk: Uint8Array): unknown;
  close?(): void;
}

async function* resolver(parts: TemplateStringKeyList = []): AsyncGenerator {
  for (const part of parts) {
    if (Array.isArray(part)) { // key is a list of more sub templates, that have to be rendered sequentially
      yield* await resolver(part);
    } else if ((part as HTMLTemplateGenerator)?.next) { // key is itself an iterator
      yield* (part as HTMLTemplateGenerator);
    } else {
      yield await part;
    }
  }
}

// tagged template literals come with an array for the static strings,
// and a second property with dynamic keys. Because we want to run over
// the given parts sequentially we mix them alternatingly to a single array.
const mixUp = (a1: TemplateStringsArray, a2: TemplateStringKeyList = []) => {
  return a1.map((el, i) => [el, a2[i]]).reduce((res, curr) => {
    return res.concat(curr);
  }, []).filter((x) => !!x);
};

// Tagged template literal function
// Usage: html`<some-snippet /><other-snippet />`
export const html = (
  strings: TemplateStringsArray,
  ...keys: TemplateStringKeyList
) => resolver(mixUp(strings, keys));

// renderer to a fixed output string, resolving all async values provided to the template keys
export const renderToString = async (
  template: HTMLTemplateGenerator,
): Promise<string> => {
  const result = [];

  while (true) {
    const part = await template.next();
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
  template: HTMLTemplateGenerator,
) => {
  const encoder = new TextEncoder();
  while (true) {
    try {
      const part = await template.next();
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
