import { escapeHtml } from "./deps.ts";

export type AttributeValue = string | number | boolean | null | undefined;

export class TemplateAttribute {
  key: string;
  value: AttributeValue;

  constructor(key: string, value: AttributeValue) {
    this.key = key;
    this.value = value;
  }

  get isBoolean() {
    return this.value === true || this.value === false;
  }

  toString() {
    if (this.isBoolean) {
      return this.value ? this.key : "";
    }

    return this.value !== undefined && this.value !== null
      ? `${this.key}="${escapeHtml(this.value as string)}" `
      : "";
  }
}
