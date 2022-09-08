export class TemplateString {
  readonly isTemplateString;
  readonly content: string;

  constructor(content: string) {
    this.content = content;
    this.isTemplateString = true;
  }

  toString() {
    return this.content;
  }
}
