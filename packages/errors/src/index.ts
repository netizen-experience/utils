type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

export class BaseError extends Error {
  public readonly context?: Jsonable;
  public readonly code?: string | number;
  public readonly prefix?: string | undefined;

  constructor(
    message: string,
    options: { prefix?: string; code?: string | number; context?: Jsonable; cause?: Error } = {},
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
