/* jshint esnext: true */

var expect = require('expect.js'),
    co = require('co'),
    mongo = require('mongodb'),
    Kongo = require('..');

describe('Kongo Database', function() {
  var database;

  before(function(done) {
    mongo.MongoClient.connect('mongodb://localhost:27017/kongo', function(err, db) {
      if(err) throw(err);
      database = new Kongo.Database(db);
      done();
    });
  });

  describe('collection', function() {
    it('returns a Kongo Collection', function() {
      expect(database.collection('People')).to.be.a(Kongo.Collection);
    });
  });
});
