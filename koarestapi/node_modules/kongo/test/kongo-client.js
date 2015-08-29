/* jshint esnext: true */

var expect = require('expect.js'),
    co = require('co'),
    Kongo = require('..');

describe('Kongo Client', function() {
  describe('connect', function() {
    it('yields a kongo database', function(done) {
      co(function *() {
        var db = yield Kongo.Client.connect('mongodb://localhost:27017/kongo');
        expect(db).to.be.a(Kongo.Database);
      })(done);
    });
  });
});
