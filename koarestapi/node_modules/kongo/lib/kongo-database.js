var KongoCollection = require ('./kongo-collection.js');

var KongoDatabase = module.exports = function(db) {
  this._db = db;
};

KongoDatabase.prototype.collection = function(name) {
  return new KongoCollection(this._db.collection(name));
};
