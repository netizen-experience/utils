import { BaseError, ErrorContext } from "@netizen-experience/error-utils";

export enum DynamoErrorCode {
  GENERIC_ERROR,
  UNKNOWN,
}

export class DynamoError extends BaseError {
  constructor(message: string, options: { code?: DynamoErrorCode; context?: ErrorContext; cause?: Error } = {}) {
    super(`[Dynamo] ${message}`, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
