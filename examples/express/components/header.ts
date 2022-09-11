import { html } from "../../../main.ts";

const subHeading = (text: string) => html`<p class="sub-heading">${text}</p>`;

export const header = (headline: string, subHeadline?: string) =>
  html`
    <header>
      <h1>${headline}</h1>
      ${subHeadline ? subHeading : ""}
    </header>
`;
