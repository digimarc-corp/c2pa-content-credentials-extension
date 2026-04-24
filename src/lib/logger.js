// logger.js - Shared logging utility for Chrome Extensions

const Logger = (() => {
  const LOG_LEVELS = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
  };

  // Set the initial log level based on the environment variable (default to DEBUG if not set)
  let currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'DEBUG'];

  const getCallerFunctionName = () => {
    const error = new Error();
    const stack = error.stack || '';
    const stackLines = stack.split('\n');

    if (stackLines.length >= 3) {
      const callerLine = stackLines[4]; // Adjust index for browser-specific formatting
      const match = callerLine.match(/at (\S+)/);
      return match ? callerLine.trim() : 'anonymous';
    }
    return 'anonymous';
  };

  const log = (level, message, ...optionalParams) => {
    if (LOG_LEVELS[level] >= currentLogLevel) {
      const timestamp = new Date().toISOString();
      const callerFunctionName = getCallerFunctionName();
      // eslint-disable-next-line no-console
      console[level.toLowerCase()](
        `[${timestamp}] [${level}] [${callerFunctionName}] ${message}`,
        ...optionalParams,
      );
    }
  };

  return {
    setLevel: (level) => {
      if (Object.values(LOG_LEVELS).includes(level)) {
        currentLogLevel = level;
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[Logger] Invalid log level: ${level}`);
      }
    },
    trace: (message, ...optionalParams) => log('TRACE', message, ...optionalParams),
    debug: (message, ...optionalParams) => log('DEBUG', message, ...optionalParams),
    info: (message, ...optionalParams) => log('INFO', message, ...optionalParams),
    warn: (message, ...optionalParams) => log('WARN', message, ...optionalParams),
    error: (message, ...optionalParams) => log('ERROR', message, ...optionalParams),
    LOG_LEVELS,
  };
})();

export default Logger;
