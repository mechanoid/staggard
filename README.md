## Tasks

- `deps:load` - loads dependencies to deno cache if deps.ts has beed updated remotely
- `deps:update` - writes updated dependencies to deps.ts
- `run` - kicks off the service
- `run:debug` - starts the service in debug mode

## Settings

The project settings are set via environment variables. Please give a look to the `.env.example`
file to see, which environment variables will be evaluated. To enable settings for your app,
provide them in the run environment or create a `.env` file, likewise to the example file.

## Testing

:)

```
deno test
```
