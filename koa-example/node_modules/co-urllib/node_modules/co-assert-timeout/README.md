# Co Assert Timeout [![Build Status](https://travis-ci.org/cojs/assert-timeout.png)](https://travis-ci.org/cojs/assert-timeout)

Assert that a thunk or generator takes less than a certain amount of time.
Note that it does not stop the thunk or generator from finish executing.

## Examples

### Koa

To set the timeout of all the downstream middleware, you can do the following:

```js
app.use(function* (next) {
  yield assertTimeout(next, '5 seconds')
})
```

However, you generally don't want to do this.
You only want to set a timeout when the client takes too long to do something,
not you.
Specifically, you should set a timeout only on the client sending a request:

```js
app.use(function* (next) {
  var buffer = yield assertTimeout(this.request.buffer(), '5 seconds')
})
```

If you want to customize or handle the error yourself:

```js
app.use(function* (next) {
  try {
    var buffer = yield assertTimeout(this.request.buffer(), '5 seconds')
  } catch (err) {
    if (err.status === 408) {
      // assertTimeout's errors will have err.status = 408
      // let's make a new error with a custom message
      err = new Error('you took too long to upload')
      err.status = 408
    }

    // rethrow the error
    throw err
  }

  yield next
})
```

## API

### assertTimeout(fn, timeout, [done])

- `fn` - a thunk, generator, or generator function
- `timeout` - timeout in milliseconds integer or a string
- `done` - optional callback called only when `fn` finishes executing after the timeout error is thrown

## License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.