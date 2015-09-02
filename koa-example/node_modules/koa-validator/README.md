## koa-validator
[![Build Status](https://travis-ci.org/Treri/koa-validator.svg?branch=master)](https://travis-ci.org/Treri/koa-validator)
[![NPM version](https://badge.fury.io/js/koa-validator.svg)](http://badge.fury.io/js/koa-validator)
[![Dependency Status](https://david-dm.org/Treri/koa-validator.svg)](https://david-dm.org/Treri/koa-validator)

[![NPM](https://nodei.co/npm/koa-validator.png?downloads=true&stars=true)](https://www.npmjs.org/package/koa-validator)

a koa port of express-validator

### Install

```shell
npm install koa-validator
```

### Usage

```js
var koa = require('koa')
    , validator = require('koa-validator')
    , bodyParser = require('koa-bodyparser')
    , app = koa()
    ;

app
    .use(bodyParser())
    .use(validator({
        onValidationError: function(errMsg){
            console.log('Validation error:', errMsg);
        }
    }))
    .use(functon *(next){
        this.checkParams('testparam', 'Invalid number').isInt();
        yield next;
    })
    .listen(3000)
    ;
```

### Options
- onValidationError - `function(errMsg)`, default to null. The `errMsg` is the errMsg you defined when you check one variable

    You can define the function like this

        function(errMsg){
            throw new Error('Validation error: ' + errMsg);
        }

- validationErrorFormatter - `function(paramName, errMsg, value)`, the default function is below

        function(paramName, errMsg, value){
            return {
                param: paramName
                , msg: errMsg
                , value: value
            };
        }

### Note
If you will use `checkBody` or `assertBody` or `sanitizeBody`, you should use one bodyparse middleware before validator.

### Test

    npm test

### API
- checkParams
- checkQuery
- checkBody
- checkHeader
- sanitizeParams
- sanitizeQuery
- sanitizeBody
- assertParams => checkParams
- assertQuery => checkQuery
- assertBody => checkBody
- assertHeader => checkHeader
- haveValidationError, return `true` if have any validationError
- validationErrors, if have any validationError, return an array of error object you returned in `validationErrorFormatter`

### Check
You can use all check methods in [`validator.js checks`](https://github.com/chriso/validator.js#validators).

In addition, you can use below methods extended to validator.js.

- `notEmpty`
- `empty`
- `eq`, use `==`
- `eqeq`, use `===`
- `neq`, use `!=`
- `neqeq`, use `!==`
- `gt`
- `lt`
- `ge`
- `le`
- `notContains`
- `isTime`
- `len`, an alias to validator.js' `isLength`
- `in`, an alias to validator.js' `isIn`
- `byteLength`, a function support set charset.
- `isUrl`, an alias to validator.js' `isURL`
- `isIp`, an alias to validator.js' `isIP`
- `isLowerCase`, an alias to validator.js' `isLowercase`
- `isUpperCase`, an alias to validator.js' `isUppercase`

### Sanitize
You can use all sanitize methods in [`validator.js`](https://github.com/chriso/validator.js#sanitizers).

In addition, you can use below methods extended to validator.js.

- `default`, set default value
- `toLowerCase`
- `toUpperCase`
- `encodeURI`
- `encodeURIComponent`
- `decodeURI`
- `decodeURIComponent`
- `replace`
- `toLow`, an alias to `toLowerCase`
- `toUp`, an alias to `toUpperCase`

### Extend
If you want to extend validator.js, you can use `extendCheck` and `extendSanitize` like below examples.

When you extend validator.js, your check function name best match `is*`, and your sanitize function name best match `to*`.
This is not force, but recommended.
If you extend one function that validator.js have already had, the function will be ignored, and an error will be thrown.

```js
var koa = require('koa')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')
    ;

validator.extendCheck('isFinite', function(str){
    return isFinite(str);
});
validator.extendCheck({
    isFinite: function(str){
        return isFinite(str);
    }
    , isFinite2: function(str){
        return isFinite(str);
    }
});

validator.extendSanitize('toZero', function(str){
    return 0;
});
validator.extendSanitize({
    toOne: function(str){
        return 1;
    }
    , toTwo: function(str){
        return 2;
    }
});

koa()
.use(bodyParser())
.use(validator())
.use(function *(next){
    this.checkParams('test', 'Invalid test value').isFinite();
    yield next;
})
.listen(3000)
;
```

### Thanks
Thanks to [`koa-validate`](https://github.com/RocksonZeta/koa-validate), some extended methods and test suites are based on koa-validate.

### LICENSE
MIT
