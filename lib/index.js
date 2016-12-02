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
  let envDir = path.join(dir, process.env.NODE_ENV || 'development');
  if (!fs.existsSync(envDir)) return;
  listDir(envDir, (key, file) => {
    if (!has(STORE, key)) STORE[key] = {};

    // If single value, set directly
    let obj = require(file);
    if (merge(STORE[key], obj) === false) STORE[key] = obj;
  });
}


exports.load = configLoad;
exports.store = STORE;


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
