var kongo = require('../'),
    expect = require('expect.js'),
    mongo = require('mongodb');

describe('Kongo', function() {
  it('exports mongo.ObjectId', function() {
    expect(kongo.Id).to.be(mongo.ObjectID);
  });
});
