
"use strict";

// Export local ESLint rules directly so `eslint-plugin-local-rules`
// can load them correctly. The plugin expects an object whose keys
// are rule names and values are rule definitions.
module.exports = {
  'no-aschild-on-a': require('./no-aschild-on-a'),
};
