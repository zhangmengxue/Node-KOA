'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let fs = require('fs');
let parser = require('./parser');
let compose = require('koa-compose');
let route = require('koa-route');

/**
 * Koa middleware for handling routes.
 *
 * @param {object} options
 * @return {generator}
 * @api public
 */

module.exports = function(opts) {

  /*
   * Configuration options.
   */

  let options = _.merge({
    routesPath: process.cwd()+'/config/routes.js',
    controllerPath: process.cwd()+'/app/controllers/{controller}.js',
    constraintPath: process.cwd()+'/app/constraints/{constraint}.js',
    logger: false
  }, opts);

  /*
   * Routes config.
   */

  let routes = require(options.routesPath);

  /*
   * Returns a task generator.
   *
   * @param {mixed} to
   * @return {generator}
   */

  function routeTask(to) {
    switch(parser.taskType(to)) {
      case 'generator':
        return to;
      case 'controller':
        var data = parser.controller(to);
        return require(options.controllerPath.replace('{controller}', data.controller))[data.action];
      case 'redirect':
        return function *() {
          this.redirect(to); this.status = 302; };
    }
    throw new Error('invalid route task');
  }

  /*
   * Returns a constraint generator.
   *
   * @param {mixed} to
   * @return {generator}
   */

  function routeConstraint(to) {
    if (!to) return null;
    var data = parser.controller(to);

    var cpath = options.constraintPath.replace('{constraint}', data.controller);
    if (!fs.existsSync(cpath)) return null;

    return require(cpath)[data.action];
  }

  /*
   * Returns an array of `koa-route` objects.
   *
   * @return {array}
   */

  function buildRoutes() {
    let middlewares = [];
    // looping through routes definitions
    Object.keys(routes).forEach(function(key) {
      let methods = parser.methods(key);
      let path = parser.path(key);
      let task = routeTask(routes[key].to);
      let constraint = routeConstraint(routes[key].constraint);
      // looping through route's methods
      methods.forEach(function(method) {
        // creating middleware
        middlewares.push(route[method](path, function *(){
          var fn = task.apply(this, arguments);
          if (constraint) {
            yield constraint.apply(this, [fn]);
          } else {
            yield fn;
          }
        }));
      });
    });
    return middlewares;
  }

  /*
   * Returns koa middleware generator.
   *
   * @return {generator}
   */

  function buildLogger() {
    var logger = options.logger;
    return function*(next) {
      if (!logger) return yield next;
      logger('<=', this.method+' '+this.path+', params: '+JSON.stringify(_.merge({}, this.request.body, this.query)));
      yield next;
      logger('=>', 'status: '+this.status);
    };
  }

  /*
   * Route middleware.
   */

  return compose([buildLogger()].concat(buildRoutes()));
};
