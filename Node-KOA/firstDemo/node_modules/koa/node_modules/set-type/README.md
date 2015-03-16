
DEPRECATED - Please use [mime-types](https://github.com/expressjs/mime-types) instead.

# Set Type

Return a well-formatted content type header given an extension.

```js
var set = require('set-type')

app.use(function (req, res) {
  res.setHeader('Content-Type', set('html'))
  // => text/html; charset=utf-8
})
```
