# Error Utils

A utility library for creating and managing custom error-utils with additional context and codes.

## Table of Contents

- [Installation](#installation)
- [Usage and Examples](#usage-and-examples)
  - [Creating a Custom Error](#creating-a-custom-error)
  - [Accessing Error Properties](#accessing-error-properties)
  - [Using `ErrorContext`](#using-errorcontext)

## Installation

To install this package, run:

```sh
npm install @netizen-experience/error-utils
```

## Usage and Examples

### Creating a Custom Error

You can create a custom error by extending the `BaseError` class:

```typescript
import { BaseError, ErrorContext } from "@netizen-experience/error-utils";

class CustomError extends BaseError {
  constructor(
    message: string,
    options?: { prefix?: string; code?: string | number; context?: ErrorContext; cause?: Error },
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

### Using `ErrorContext`

The `ErrorContext` type defines the structure that is convertible to JSON format that can be passed to the error. This allows you to add additional information to the error, making it easier to debug and handle.

```typescript
import { ErrorContext } from "@netizen-experience/error-utils";

// Adding user information to the error context
const userContext: ErrorContext = {
  userId: 42,
  userName: "john_doe",
  userRole: "admin",
};
```
