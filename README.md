# Staggard

A minimal, yet streamable, tagged base HTML template language for deno.

## API

- `html` - tagged template literal function to declare simple minimal components
- `renderToString` - renders given html template components to a string. The
  complete template will be resolved before
- `renderToStream` - writes the template parts to the stream, once ready. Waits
  for async content, which results in iterative "write when ready" rendering.

## Usage

To have a better understanding of how things work, please give a look to the
examples. But the code below shows the basic usage:

```
import { html, HTMLTemplateGenerator, renderToStream } from "https://deno.land/x/staggard/main.ts";

const viewComponent = (content: HTMLTemplateGenerator) =>
  html`<p>${"hello"}</p> <p>${asyncFunc("world!")}</p>`;

await renderToStream(
  Deno.stdout,
  viewComponent,
);
```

The above results in proper stream rendering to the clients, allowing the
browser client to show content, that is available already, and waiting for
content, not yet available.

This allows some fancy stuff like aborting such calls, when they take too long,
and replace them by client side islands, that translude that content at client
time. (See the express example for more details about that.)

## Tasks

Tasks can be invoked with `deno task [TASKNAME]`:

- `deps:load` - loads dependencies to deno cache if deps.ts has beed updated
  remotely
- `deps:update` - writes updated dependencies to deps.ts
- `run` - kicks off the service
- `run:debug` - starts the service in debug mode
- `run:example:synch` - runs a synchronous rendering example
- `run:example:stream` - runs a stream rendering example
- `run:example:express` - starts an express app at localhost:3001, showing an
  example integration with fallback handling.

## Settings

The project settings are set via environment variables. Please give a look to
the `.env.example` file to see, which environment variables will be evaluated.
To enable settings for your app, provide them in the run environment or create a
`.env` file, likewise to the example file.

## Testing

:)

```
deno test
```
