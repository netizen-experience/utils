import { createLogger, transports } from "winston";
import TransportStream from "winston-transport";

/**
 * Represents the structured log entry object.
 */
interface LogEntry {
  /**
   * The message to log.
   */
  message: string;
  /**
   * Session identifier.
   */
  session: string;
  /**
   * The origin of where the log is captured, specified as a tuple [libraryName, functionName].
   * @example ["user", "userLookupFromIdentity"]
   */
  origin: [string, string];
}

interface Log {
  /**
   * The default log function for general messages.
   *
   * @param {LogEntry} entry - The structured log entry with message details.
   */
  (entry: LogEntry): void;

  /**
   * Logs uncaught exceptions that break the application.
   * Intended for use only with exceptions that cannot be handled.
   *
   * @param {Ex} ex - The exception to log. Does not require the location or session in the message as exception
   * carries their own stack traces, which automatically provide the location of the error.
   */
  error: <Ex extends Error>(ex: Ex) => void;

  /**
   * Reserved for CLI tools to log warnings. Unlikely to be used in web applications.
   *
   * @param {LogEntry} entry - The structured log entry with the warning message.
   */
  warn: (entry: LogEntry) => void;

  /**
   * Logs information that provides context in the server terminal.
   * Suitable for logging events or states you need to be aware of.
   *
   * @param {LogEntry} entry - The structured log entry with the informational message.
   */
  info: (entry: LogEntry) => void;

  /**
   * Use this to log HTTP-related information. Currently not advised to use.
   *
   * @param {LogEntry} entry - The structured log entry with message details.
   */
  http: (entry: LogEntry) => void;

  /**
   * Extended verbose logging. Currently not advised to use.
   *
   * @param {LogEntry} entry - The structured log entry with message details.
   */
  verbose: (entry: LogEntry) => void;

  /**
   * Used for debugging purposes to log detailed information.
   * Should capture input and output states if applicable, format with `Input: <input_state>, Output: <output_state>`.
   * These logs are not executed in a production environment.
   *
   * @param {LogEntry} entry - The structured log entry with the debugging message.
   */
  debug: (entry: LogEntry) => void;

  /**
   * Use for very fine-grained, detailed logs. Currently not advised to use.
   *
   * @param {LogEntry} entry - The structured log entry with message details.
   */
  silly: (entry: LogEntry) => void;
}

/**
 * Initializes and returns a logger instance that formats log entries and provides logging methods for different log levels.
 * @param {TransportStream | TransportStream[]} [customTransports] - Optional custom transport or array of transports to be used by the logger.
 * @returns {Log} A logging function that can be called directly or used as an object for various log levels.
 *
 * @example
 * // Initialize the logger with default console transport
 * const defaultLog = initLogger();
 *
 * // Initialize the logger with custom transports
 * const customLog = initLogger([new transports.Console(), new transports.File({ filename: 'combined.log' })]);
 *
 * // Default info log
 * defaultLog({ message: "info", session: "abcdef123456", origin: ["user", "getProfile"] });
 *
 * // Log at specific levels
 * defaultLog.error(new Error("Error message"));
 * defaultLog.debug({ message: "debug", session: "abcdef123456", origin: ["user", "userLookupFromIdentity"] });
 */
export function initLogger(customTransports?: TransportStream | TransportStream[]): Log {
  const LOGGER_LEVEL = process.env["LOGGER_LEVEL"] ?? "info";
  const logger = createLogger({
    level: LOGGER_LEVEL,
    transports: customTransports ?? new transports.Console(),
  });

  function formatLog({ message, origin, session }: LogEntry): string {
    return `[${session}] [${origin[0]}:${origin[1]}] ${message}`;
  }

  const logMethods = {
    error: <Ex extends Error>(ex: Ex) => {
      logger.error(ex);
    },
    warn: (entry: LogEntry) => {
      logger.warn(formatLog(entry));
    },
    info: (entry: LogEntry) => {
      logger.info(formatLog(entry));
    },
    http: (entry: LogEntry) => {
      logger.http(formatLog(entry));
    },
    verbose: (entry: LogEntry) => {
      logger.verbose(formatLog(entry));
    },
    debug: (entry: LogEntry) => {
      logger.debug(formatLog(entry));
    },
    silly: (entry: LogEntry) => {
      logger.silly(formatLog(entry));
    },
  };

  return new Proxy<Log>(
    Object.assign(() => {}, logMethods), // eslint-disable-line @typescript-eslint/no-empty-function
    {
      apply: (target, _, argArray) => {
        if (argArray.length === 1) {
          target.info(argArray[0]);
        } else {
          throw new Error("Invalid number of arguments");
        }
      },
      get: (target, prop: keyof typeof logMethods) => {
        if (prop in target) {
          return target[prop];
        }
        return undefined;
      },
    },
  );
}
