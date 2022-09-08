const timeout = 300;
export const delayedContent = (text: string, id: number): Promise<string> => {
  const controller = new AbortController();

  return Promise.race([
    // This is just a timeout based example, which usually would be a
    // call to something external we need to resolve.
    new Promise((resolve, _reject) => { // deliver content with increasing
      const timer = Math.max(100, Math.ceil(Math.random() * 600));
      console.log(`content "${id}" will be delayed by: ${timer}`);

      setTimeout(() => {
        controller.abort();
        return resolve(text);
      }, timer);
    }) as Promise<string>,

    // we want a timeout, after we ditch the delayed lookup and render a fallback.
    // As we handle the timeout ourself in userland we can also control very
    // detailed what can be rendered as fallback
    new Promise((resolve, reject) => {
      if (controller.signal.aborted) {
        return reject("timout aborted!");
      }
      let abortHandler: () => void = () => {};

      const to = setTimeout(() => {
        console.log(`content "${id}" canceled, due to timeout`);
        controller.signal.removeEventListener("abort", abortHandler);
        return resolve(
          `<my-fallback-component src="/${id}"></my-fallback-component>`,
        );
      }, timeout);

      abortHandler = () => {
        clearTimeout(to);
      };
      controller.signal.addEventListener("abort", abortHandler);
    }) as Promise<string>,
  ]);
};
