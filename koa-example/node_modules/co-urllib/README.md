co-urllib
=========

[![Build Status](https://travis-ci.org/cojs/urllib.svg)](https://travis-ci.org/cojs/urllib)

co version of [urllib](https://github.com/fengmk2/urllib).

Not just thunkify, `co-urllib.request` is a [Generator](http://wiki.ecmascript.org/doku.php?id=harmony:generators).

[![NPM](https://nodei.co/npm/co-urllib.png?downloads=true)](https://nodei.co/npm/co-urllib/)

Code coverage: [100%](http://qtestbucket.qiniudn.com/cov/html/co-urllib/0.0.1/index.html)

## Usage

```
var urllib = require('co-urllib');
var co = require('co');

co(function *() {
  var result = yield urllib.request('http://baidu.com');
  var data = result.data; // response data
  var status = result.status; // response status code
  var headers = result.headers; // response headers
  console.log(status);
})();
```

More documents, please @see [API of urllib](https://github.com/fengmk2/urllib#api-doc)

## Licences

(The MIT License)

Copyright (c) 2013 - 2014 dead-horse and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
