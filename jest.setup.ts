import '@testing-library/jest-dom';

// Polyfill for fetch in Node.js environment for Firebase rules testing
// 'cross-fetch/polyfill' should ideally do this, but to be more explicit:
if (typeof global.fetch === 'undefined') {
  const fetchModule = require('cross-fetch');
  global.fetch = fetchModule.default || fetchModule; // Handles different export styles
  global.Headers = fetchModule.Headers;
  global.Request = fetchModule.Request;
  global.Response = fetchModule.Response;
}

// Polyfill setImmediate for environments where it's not available
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => {
    return setTimeout(fn, 0, ...args);
  };
}
