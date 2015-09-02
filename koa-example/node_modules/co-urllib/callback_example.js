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

var request = co(urllib.request);
request('http://baidu.com', function (err, result) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(result.status, result.headers);
});
