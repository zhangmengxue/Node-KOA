'use strict';

/**
 * Parser for `route` and `task` strings.
 *
 * @api public
 */

module.exports = {

  /*
   * Parses the `method` from a `route string` (e.g. `get /users/:id`). Note
   * that multiple methods are allowed.
   *
   * @param {string} route
   * @return {Array}
   */

  methods: function(route) {
    let parts = route.split(' ');
    return parts[1] ? parts[0].toLowerCase().split('|') : ['get'];
  },

  /*
   * Parses the `path` from a `route string` (e.g. `get /users/:id`).
   *
   * @param {string} route
   * @return {string}
   */

  path: function(route) {
    let parts = route.split(' ');
    return parts[1] || parts[0] || '/';
  },

  /*
   * Returns the type of task's `to:` string (e.g. `controller#action`).
   *
   * @param {mixed} to
   * @return {string}
   */

  taskType: function(to) {
    switch(typeof to) {
      case 'string':
        if (to.split('#').length==2) {
          return 'controller';
        }
        else if (['http:', 'https:', 'ftp:'].indexOf(to.split('/')[0]) != -1 || to[0] == '/') {
          return 'redirect';
        }
      case 'function':
        return 'generator';
    }
    return 'unknown';
  },

  /*
   * Parses the `controller` and `action` name from task's `to: string`
   * (e.g. `controller#action`).
   *
   * @param {string} to
   * @return {object}
   */

  controller: function (to) {
    let parts = to.split(/#/);
    return { controller: parts[0], action: parts[1] };
  }

};
