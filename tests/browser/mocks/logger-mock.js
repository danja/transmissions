// Mock implementation of the logger module
const logger = {
  log: (...args) => console.log(...args),
  debug: (...args) => console.debug(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  trace: (...args) => console.trace(...args),
  reveal: (obj) => console.dir(obj),
  setLogLevel: () => {},
  getLevel: () => 'debug',
  silent: false
};

export default logger;
