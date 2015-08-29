var Client = require('mongodb').MongoClient,
    KongoDatabase = require('./kongo-database');

var KongoClient = module.exports = {};

KongoClient.connect = function(connectString, options) {
  return function(done) {
    options = options || {};
    Client.connect(connectString, options, function(err, db) {
      if(err) return done(err);
      done(null, new KongoDatabase(db));
    });
  };
};
