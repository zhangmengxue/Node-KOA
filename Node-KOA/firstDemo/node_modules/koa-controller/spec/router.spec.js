var kc = require('..');
var koa = require('koa');
var request = require('request');

describe('router', function() {

  beforeEach(function() {
    this.port = 3001;
    this.url = 'http://localhost:'+this.port;
    this.app = koa();
    this.app.use(kc.router({
      routesPath: __dirname+'/../example/routes.js',
      controllerPath: __dirname+'/../example/{controller}.js',
      constraintPath: __dirname+'/../example/{constraint}.js'
    }));
    this.server = this.app.listen(this.port);
  });

  afterEach(function() {
    if (this.server) this.server.close();
  });

  it('should handle `controller` task', function(done) {
    request.post(this.url+'/users', function(err, res, body) {
      expect(body).toEqual("create");
      request.put(this.url+'/users/1', function(err, res, body) {
        expect(body).toEqual("update:1");
        done();
      }.bind(this));
    }.bind(this));
  });

  it('should handle `redirect` task', function() {
    request.get(this.url, function(err, res, body) {
      expect(body).toEqual("index");
    });
  });

  it('should handle `function` task', function() {
    request.del(this.url+'/delete', function(err, res, body) {
      expect(body).toEqual("delete");
    });
  });

  it('should allow authenticated client', function(done) {
    request.get(this.url+'/secure', {
      headers: { 'Authorization': 'Basic base64' }
    }, function(err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body).toEqual("secret");
      done();
    }.bind(this));
  });

  it('should restrict unauthenticated client', function(done) {
    request.get(this.url+'/secure', function(err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    }.bind(this));
  });

});
