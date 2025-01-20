# Logger

This library provides a structured logging utility using [Winston](https://github.com/winstonjs/winston).

## Table of Contents

- [Installation](#installation)
- [Usage and Examples](#usage-and-examples)
- [Configuration](#configuration)

## Installation

To install the package, run:

```sh
npm install @netizen-experience/logger
```

## Usage and Examples

First, initialize the logger:

```typescript
import { initLogger } from "logger";

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
