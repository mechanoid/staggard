# Staggard

A minimal, yet streamable, tagged base HTML template language for deno.

## API

- `html` - tagged template literal function to declare simple minimal components
- `attr` - function to declare dynamic html attributes with escaped values
- `renderToString` - renders given html template components to a string. The
  complete template will be resolved before
- `renderToStream` - writes the template parts to the stream, once ready. Waits
  for async content, which results in iterative "write when ready" rendering.

## Usage

To have a better understanding of how things work, please give a look to the
examples. But the code below shows the basic usage:

```
import { html, HTMLTemplate, renderToStream } from "https://deno.land/x/staggard/main.ts";

const viewComponent = (content: HTMLTemplate) =>
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

## Content Escaping

All keys passed to the `html` tagged template function are escaped when they are
not itself generators. If you pass a generator function itself it has to escape
content, when before passing it to yield.

It can be considered as safe to pass `html` generators as keys.

```
renderToStream(html`<div>${"<script>console.log("hello, world!")</script>"}</div>`) # => "<div>&lt;script&gt;console.log(&quot;hello, world!&quot;)&lt;/script&gt;</div>"

renderToStream(html`<div>${html`<script>console.log("hello, world!")</script>`}</div>`) # => "<div><script>console.log("hello, world!")</script></div>"
```

### Attributes and Escaping

If you want to render attributes in a conditional or dynamic manner, you cannot
rely on plain template literals as they would be escaped. So the following
example will not work properly.

```
const range = (min) => html`<input type="range" ${min !== undefined ? `min="${min}"` : ''}` ⚡️
```

If you want to use render properties as a template literal value you need to use
the `attr` function.

```
const range = (min) => html`<input type="range" ${min !== undefined ? attr('min', min) : ''}` ✅
```

## Tasks

Tasks can be invoked with `deno task [TASKNAME]`:

- `deps:load` - loads dependencies to deno cache if dependencies have been
  updated remotely
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
