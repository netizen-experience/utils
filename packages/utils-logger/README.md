# utils-logger

This library provides a structured logging utility using [Winston](https://github.com/winstonjs/winston).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Configuration](#configuration)

## Installation

To install the package, run:

```sh
npm install @netizen/utils-logger
```

## Usage

### Initialize

`initLogger(): Log` - Initializes and returns a logger instance.

### Log Entry

`LogEntry` - Log entry object to be passed into log methods (excluding `log.error`) as a parameter.

The `LogEntry` object has the following attributes:

| Attributes |       Types        | Required | Description                                                                              |
| :--------: | :----------------: | :------: | ---------------------------------------------------------------------------------------- |
| `message`  |      `string`      |   Yes    | Message to log.                                                                          |
| `session`  |      `string`      |   Yes    | Session identifier.                                                                      |
|  `origin`  | `[string, string]` |   Yes    | Origin of where the log is captured, specified as a tuple `[libraryName, functionName]`. |

### Log Methods

- `log(entry: LogEntry): void` - Logs a general message.
- `log.error(ex: Error): void` - Logs an error.
- `log.warn(entry: LogEntry): void` - Logs a warning.
- `log.info(entry: LogEntry): void` - Logs an informational message.
- `log.http(entry: LogEntry): void` - Logs HTTP-related information.
- `log.verbose(entry: LogEntry): void` - Logs verbose information.
- `log.debug(entry: LogEntry): void` - Logs debugging information.
- `log.silly(entry: LogEntry): void` - Logs very fine-grained, detailed information.

## Example

First, initialize the logger:

```typescript
import { initLogger } from "utils-logger";

const log = initLogger();
```

Then, use the logger to log messages at the default info log level.

```typescript
log({ message: "info", session: "abcdef123456", origin: ["user", "getProfile"] });
```

You can also use the logger to log messages at different logger levels:

```typescript
log.error(new Error("Error message"));
log.debug({ message: "debug", session: "abcdef123456", origin: ["user", "userLookupFromIdentity"] });
```

## Configuration

You can configure the logger using environment variables:

- `LOGGER_LEVEL`: Sets the logging level (e.g., `info`, `debug`, `error`). Default is `info`.
