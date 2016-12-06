const fs    = require('fs'),
      has   = require('has'),
      path  = require('path'),
      merge = require('deep-extend');


/**
 * Configuration store.
 *
 * Contains all configuration read. It's keys are the filenames without
 * ".js" so if you have for example a file named `database.js` then its
 * key will be `database` and its value the exported things.
 *
 * @type {object}
 */
const STORE = {};


/**
 * Config helper.
 *
 * Changes its behavior based on number of parameters passed:
 * - When 0: returns a copy of config store.
 * - When 1: returns the value of `get`.
 * - When 2+: returns the value of `set`.
 *
 * @param {...*} args Any arguments.
 * @returns {*} The copied store or the get/set value.
 */
function config(...args) {
  switch (args.length) {
  case 0:
    return merge({}, STORE);
  case 1:
    return configGet(args[0]);
  default:
    return configSet(...args);
  }
}

/**
 * Get value from config store.
 *
 * @param {string} key The key (dotted or not) to get.
 * @param {*} [def=null] The default value if not found.
 * @returns {*} The value or the default.
 */
function configGet(key, def = null) {
  return dotted(STORE, key) || def;
}

/**
 * Set value to config store.
 *
 * @param {string} key The key (dotted or not) to set.
 * @param {T} value The value to set in store.
 * @returns {T} The value which was set.
 * @template {T}
 */
function configSet(key, value) {
  return dotted(STORE, key, value);
}

/**
 * Load configuration from directory.
 *
 * Exported as `load`, expects directory where your config files are.
 * Begins loading all general settings from config directory then finds
 * your environment reading `NODE_ENV` (fallback: 'development') and if
 * that directory exists it merges the configuration into main store.
 *
 * @param {string} dir The directory to read from.
 */
function configLoad(dir) {
  // Load general settings
  listDir(dir, (key, file) => {
    STORE[key] = require(file);
  });

  // Load env-specific settings
  const envDir = path.join(dir, process.env.NODE_ENV || 'development');
  if (!fs.existsSync(envDir)) return;
  listDir(envDir, (key, file) => {
    if (!has(STORE, key)) STORE[key] = {};

    // If single value, set directly
    const obj = require(file);
    if (merge(STORE[key], obj) === false) STORE[key] = obj;
  });
}


module.exports = exports = config;
exports.get = configGet;
exports.set = configSet;
exports.load = configLoad;


/**
 * Get or set dotted properties.
 *
 * @param {object} obj Object with data.
 * @param {...*} args A key and optionally a value.
 * @returns {*} Get: value or null; set: value passed.
 */
function dotted(obj, ...args) {
  // Args is [key, value] so if no value
  // was provided then its length it's 1
  const isGet = args.length === 1;

  // Split do.tt.ed keys
  const parts = args[0].split('.');

  // Begin traversing object until it
  // leaves only a key user for checking
  let key;
  while (parts.length > 1) {
    key = parts.shift();

    if (!has(obj, key)) {
      // Key not found
      if (isGet) return null;

      // Make nesting
      obj[key] = {};
    }

    // Advance in tree
    obj = obj[key];
  }

  key = parts[0];

  // Check for own key, null if not
  if (isGet) return has(obj, key) ? obj[key] : null;
  return (obj[key] = args[1]);
}

/**
 * List ".js" files in a directory.
 *
 * @param {string} dir Directory to list files from.
 * @param {function(string, string)} callback Called with (key, path).
 */
function listDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    // Directories not end with ".js"
    // Avoid endsWith for compatibility
    if (file.indexOf('.js') !== file.length - 3) return;

    // Call with file key and path
    callback(file.slice(0, -3), path.join(dir, file));
  });
}
