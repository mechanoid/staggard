import { html } from "../../../main.ts";

export const paragraph = (text: string | Promise<string>) =>
  html`
    <p class="info">${text}</p>
`;
