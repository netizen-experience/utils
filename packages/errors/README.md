# Errors

A utility library for creating and managing custom errors with additional context and codes.

## Installation

To install this package, run:

```sh
npm install @netizen-experience/errors
```

## Usage and Examples

### Creating a Custom Error

You can create a custom error by extending the `BaseError` class:

```typescript
import { BaseError } from "@netizen-experience/errors";

class CustomError extends BaseError {
  constructor(
    message: string,
    options?: { prefix?: string; code?: string | number; context?: Jsonable; cause?: Error },
  ) {
    super(message, options);
  }
}

const error = new CustomError("Something went wrong", { code: 123, context: { userId: 1 } });
console.error(error);
```

### Accessing Error Properties

The `BaseError` class provides additional properties like `code`, `context`, and `prefix`:

```typescript
const error = new CustomError("Something went wrong", { code: 123, context: { userId: 1 }, prefix: "ERR" });
console.log(error.code); // 123
console.log(error.context); // { userId: 1 }
console.log(error.prefix); // 'ERR'
console.log(error.codedError()); // 'ERR 123'
```
