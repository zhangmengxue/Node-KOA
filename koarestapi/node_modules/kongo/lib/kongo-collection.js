var simpleCallbacks = [
  'drop',
  'remove',
  'rename',
  'distinct',
  'count',
  'createIndex',
  'ensureIndex',
  'dropIndex',
  'dropIndexes',
  'indexInformation'
];

var stripExtras = [
  'update'
];

var convertSingularArrays = [
  'insert'
];

var cursorMethods = [
  'find',
  'findAndRemove'
];

var KongoCollection = module.exports = function(collection) {
  var self = this;
  this._collection = collection;
};

simpleCallbacks.forEach(function(method) {
  KongoCollection.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments),
        collection = this._collection;

    return function(done) {
      args.push(done);
      collection[method].apply(collection, args);
    };
  };
});

stripExtras.forEach(function(method) {
  KongoCollection.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments),
        collection = this._collection;

    return function(done) {
      args.push(function(err, first) {
        if(err) return done(err);
        return done(null, first);
      });
      collection[method].apply(collection, args);
    };
  };
});

convertSingularArrays.forEach(function(method) {
  KongoCollection.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments),
        collection = this._collection;

    return function(done) {
      args.push(function(err, res) {
        if(err) return done(err);
        if(res.length == 1) return done(null, res[0]);
        return done(null, res);
      });
      collection[method].apply(collection, args);
    };
  };
});

cursorMethods.forEach(function(method) {
  KongoCollection.prototype[method] = function(query, options) {
    var collection = this._collection;
    options = options || {};
    return function(done) {
      collection[method].call(collection, query)
        .limit(options.limit)
        .batchSize(options.batchSize)
        .skip(options.skip)
        .sort(options.sort)
        .toArray(done);
    };
  };
});

KongoCollection.prototype.findOne = function(query, options) {
  var self = this;

  return function(done) {
    options = options || {};
    options.limit = -1;
    options.batchSize = 1;
    self.find(query, options)(function(err, res) {
      if(err) done(err);
      else done(null, res[0]);
    });
  };
};

KongoCollection.prototype.findAndModify = function(query, sort, update, options) {
  var collection = this._collection;
  options = options || {};
  return function(done) {
    if(options.new !== false) options.new = true;
    collection.findAndModify.call(collection, query, sort, update, options, function(err, res) {
      if(err) return done(err);
      return done(null, res);
    });
  };
};

KongoCollection.prototype.save = function(doc, options) {
  var self = this;
  return function(done) {
    options = options || {};

    if(doc._id) {
      options.upsert = true;
      self.update({_id: doc._id}, doc, options)(done);
    } else {
      self.insert(doc, options)(done);
    }
  };
};
