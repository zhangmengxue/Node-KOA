# [koa](http://koajs.com/)-controller

![Build Status](https://travis-ci.org/xpepermint/koa-controller.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/koa-controller.svg)](http://badge.fury.io/js/koa-controller)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/koa-controller.svg)](https://gemnasium.com/xpepermint/koa-controller)

`Koa-controller` in a middleware for `Koa` which handles the routing of your application where related functionalities are splitted into `routes`, `controllers` and `constraints`. The module is built on top of [koa-route](https://github.com/koajs/route) middleware. It optimizes your code and brings the following features into your project:
- Flexible `routes` handler with a single point of router configuration.
- Application `controllers` for handling application responses.
- Access control middleware with `constraints` for limiting requests to application controllers, handling user authentication and security.
- Context tools for easy dynamic data manipulation.

## Installation

Install the [npm](https://www.npmjs.org/package/koa-controller) package.

```
npm install koa-controller --save
```

Attach the middleware.

```js
var koa = require('koa');
var app = koa();
var kc = require('koa-controller');
app.use(kc.tools()); // optional
app.use(kc.router());
app.listen(3000);
```

By default the middleware expects that controllers exist at `app/controllers/{controller}.js`, constraints at `app/constraints/{constraint}.js` and the router configuration file at `config/routes.js`. We can easily change the default behavior as shown bellow.

```js
app.use(controller({
  routesPath: 'my/path/routes.js',
  controllerPath: 'my/controllers/{controller}.js', // note that {controller} is a variable
  constraintPath: 'my/constraints/{constraint}.js', // note that {constraint} is a variable
  logger: console.log // custom logger function
}));
```

Note that `routesPath` and `controllerPath` must exist where `constraintPath` is not required.

## Routes

Routes file is a simple key-value object where the `key` represents a `route` and the `value` represents a `task`. Create a new file and define your project's routes based on the example bellow.

```js
// config/routes.js
module.exports = {

  // controller#action
  '/users/:id?': { to: 'users#find' },
  'post /users': { to: 'users#create' },
  'put|post /users/:id': { to: 'users#update' },
  'get /users/:id/words/:slug*': { to: 'events#words' },
  'get /event/:slug+': { to: 'events#index', constraint: 'api#ip' },

  // redirections
  'get /to/google': { to: 'http://www.google.com' },
  'get /to/home': { to: '/' },

  // using a function
  'get /events/:id': { to: function *(id) { this.body = ... } },

  ...
};
```

You check [koa-route](https://github.com/koajs/route) and [path-to-regexp](https://github.com/component/path-to-regexp) for more information.

## Controller

Controller is a simple key-value object where the `key` represents the name of an `action` and the `value` represents a generator function that processes the request. Create a new file for your first controller and define actions based on the example bellow. Don't forget to connect the new controller with a route inside `routes.js` file.

```js
// app/controllers/users.js
module.exports = {

  find: function*() {
    this.body = ...;
  },

  update: function*(id) {
  },

  words: function*(id, slug) {
  },

  ...
};
```

Notice the `this.body` call? Every `action` inside a controller has access to [Koa context](http://koajs.com/#context). Check [koa-route](https://github.com/koajs/route) for details.

## Constraint

Constraint is a simple key-value object where the `key` represents the name of a constraint and the `value` represents a generator function that processes the request. Create a new file for your first constraint and define constraints based on the example bellow. Don't forget to connect the new constraint with a route inside `routes.js` file.

```js
// app/constraints/api.js
module.exports = {

  ip: function*(next) {
    if (this.request.ip == '192.168.1.100') { // allow access only from this IP address
      yield next;
    } else {
      this.body = 'Unauthorized IP address';
      this.status = 401;
    }
  },

  ...
};
```

Note that constraints are very much like controllers thus every constraint action has access to [Koa context](http://koajs.com/#context). Check [koa-route](https://github.com/koajs/route) for details.

## Tools

By attaching `kc.tools()` middleware the context features are extended.

### ctx.form([names])

Type: `Function`
Returns: `Object`

Parsed request body data. You can retrive only selected attributes by specifying a list of `names`.

```js
console.log( _.form() );
// -> { 'name': 'John', 'email': 'john@gmail.com', 'age': 33 }
console.log( _.form('name', 'age') );
// -> { 'name': 'John', 'age': 33 }
```
