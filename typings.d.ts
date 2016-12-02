declare module 'uncfg' {

  /**
   * Get copy of the store.
   *
   * @returns {object} The copy.
   */
  function config(): Object;

  /**
   * Get value from config store.
   *
   * @param {string} key The key (dotted or not) to get.
   * @returns {*} The value or null.
   */
  function config(key: string): any;

  /**
   * Set value to config store.
   *
   * @param {string} key The key (dotted or not) to set.
   * @param {T} value The value to set in store.
   * @returns {T} The value which was set.
   * @template {T}
   */
  function config<T>(key: string, value: T): T;


  namespace config {

    /**
     * Get value from config store.
     *
     * @param {string} key The key (dotted or not) to get.
     * @param {*} [defaultVal=null] The default value if not found.
     * @returns {*} The value or the default.
     */
    export function get(key: string, defaultVal?: any): any;

    /**
     * Set value to config store.
     *
     * @param {string} key The key (dotted or not) to set.
     * @param {T} value The value to set in store.
     * @returns {T} The value which was set.
     * @template {T}
     */
    export function set<T>(key: string, value: T): T;

    /**
     * Load configuration from directory.
     *
     * @param {string} dir The directory to read from.
     */
    export function load(dir: string): void;

  }

  /**
   * Say goodbye!
   */
  export = config;

}
