import { BaseError, Jsonable } from "@netizen-experience/types";

export enum DynamoErrorCode {
  GENERIC_ERROR,
  UNKNOWN,
}

export class DynamoError extends BaseError {
  constructor(message: string, options: { code?: DynamoErrorCode; context?: Jsonable; cause?: Error } = {}) {
    super(`[Dynamo] ${message}`, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
