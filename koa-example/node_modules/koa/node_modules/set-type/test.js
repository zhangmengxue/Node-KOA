
var assert = require('assert')

var set = require('./')

it('html', function () {
  assert.equal(set('html'), 'text/html; charset=utf-8')
})

it('text/html; charset=ascii', function () {
  assert.equal(set('text/html; charset=ascii'), 'text/html; charset=ascii')
})

it('json', function () {
  assert.equal(set('json'), 'application/json')
})

it('application/json', function () {
  assert.equal(set('application/json'), 'application/json')
})
