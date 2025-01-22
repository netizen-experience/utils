export type ErrorContext =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly ErrorContext[]
  | { readonly [key: string]: ErrorContext }
  | { toJSON(): ErrorContext };

export class BaseError extends Error {
  public readonly context?: ErrorContext;
  public readonly code?: string | number;
  public readonly prefix?: string | undefined;

  constructor(
    message: string,
    options: { prefix?: string; code?: string | number; context?: ErrorContext; cause?: Error } = {},
  ) {
    const { code, context, prefix } = options;
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.prefix = prefix;
  }

  public codedError() {
    if (this.code === undefined) return this.message;
    return `${this.prefix}${this.prefix ?? " "}${this.code}`;
  }
}
