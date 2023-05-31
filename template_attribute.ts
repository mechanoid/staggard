import { escapeHtml } from "./deps.ts";

export type AttributeValue = string | number | boolean | null | undefined;

export class TemplateAttribute {
  key: string;
  value: AttributeValue;

  constructor(key: string, value: AttributeValue) {
    this.key = kebabize(key);
    this.value = value;
  }

  get isBoolean() {
    return typeof this.value === "boolean";
  }

  toString() {
    if (this.isBoolean) {
      return this.value ? `${this.key} ` : "";
    }

    return this.value !== undefined && this.value !== null
      ? `${this.key}="${escapeHtml(this.value as string)}" `
      : "";
  }
}

const kebabize = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};
