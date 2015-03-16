'use strict';

/*
 * Model dependencies
 */

var _ = require('lodash');
var parse = require('co-body');

/*
 * Tools middleware.
 */

module.exports = function() {
  return function *(next) {

    /*
     * Returns form data.
     */

    this.form = function *() {
      var data;
      data = yield parse.form(this);
      data = _.any(arguments) ? _.pick(data, arguments) : data;
      return data;
    }

    yield next;
  }
}
