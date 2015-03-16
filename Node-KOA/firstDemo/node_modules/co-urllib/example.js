/**!
 * co-urllib - example.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');
var urllib = require('./');

co(function *() {
  var result = yield urllib.request('http://baidu.com');
  var data = result.data; // response data
  var headers = result.headers; // response headers
  console.log(result.status, headers);
})();
