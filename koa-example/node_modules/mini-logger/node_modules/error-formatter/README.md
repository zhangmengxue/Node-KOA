error-formatter
---------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/error-formatter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/error-formatter
[travis-image]: https://img.shields.io/travis/node-modules/error-formatter.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/error-formatter
[coveralls-image]: https://img.shields.io/coveralls/node-modules/error-formatter.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/error-formatter?branch=master
[david-image]: https://img.shields.io/david/node-modules/error-formatter.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/error-formatter
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

Formate error to string or json, for log use.

## Install

```bash
npm install error-formatter
```

## Usage

```js
var formater = require('error-formatter');

var err = new Error('test error');
err.host = '127.0.0.1';
err.code = 'DUPLICATE';
err.url = '/error';
err.data = {foo: 'bar'};

var msg = formater(err);
var json = formater.json(err);
var both = formater.bot(err);   // yield {text: text, json: json}
```

yield

```
2014-07-07 15:11:26.421 nodejs.ErrorException: DUPLICATEError: test error (127.0.0.1)
    at Object.<anonymous> (/Users/deadhorse/git/error-formatter/test/index.test.js:15:11)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:349:32)
    at Function.Module._load (module.js:305:12)
    at Module.require (module.js:357:17)
    at require (module.js:373:17)
    at /Users/deadhorse/git/error-formatter/node_modules/mocha/lib/mocha.js:172:27
    at Array.forEach (native)
    at Mocha.loadFiles (/Users/deadhorse/git/error-formatter/node_modules/mocha/lib/mocha.js:169:14)
    at Mocha.run (/Users/deadhorse/git/error-formatter/node_modules/mocha/lib/mocha.js:356:31)
    at Object.<anonymous> (/Users/deadhorse/git/error-formatter/node_modules/mocha/bin/_mocha:366:16)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:349:32)
    at Function.Module._load (module.js:305:12)
    at Function.Module.runMain (module.js:490:10)
    at startup (node.js:124:16)
    at node.js:803:3
pid: 91000
domainThrown: false
Host: dead-horsedeMacBook-Pro.local
URL: /error
Data: {"foo":"bar"}
2014-07-07 15:11:26.421
```

## License

MIT
