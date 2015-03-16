var parser = require('../lib/parser');

describe('parser', function() {

  describe('methods', function() {

    it('should parse `methods` from a `task string`', function() {
      expect(parser.methods('POST /users')).toEqual(['post']);
      expect(parser.methods('get|put /users')).toEqual(['get', 'put']);
    });

    it('should return `[get]` if a `task string` contains no method', function() {
      expect(parser.methods('/users')).toEqual(['get']);
    });

  });

  describe('path', function() {

    it('should parse a `path` from a `task string`', function() {
      expect(parser.path('POST /users')).toBe('/users');
    });

  });

  describe('taskType', function() {

    it('should guess the `generator` task from a `target string`', function() {
      expect(parser.taskType(function*(){})).toBe('generator');
    });

    it('should guess the `controller` task from a `target string`', function() {
      expect(parser.taskType('users#index')).toBe('controller');
    });

    it('should guess the `redirect` task from a `target string`', function() {
      expect(parser.taskType('/go/home')).toBe('redirect');
      expect(parser.taskType('http://google.com')).toBe('redirect');
      expect(parser.taskType('https://google.com')).toBe('redirect');
      expect(parser.taskType('ftp://google.com')).toBe('redirect');
    });

  });

  describe('controller', function() {

    it('should parse a `controller` and an `action` name from a `task string`', function() {
      expect(parser.controller('users#create')).toEqual({ controller: 'users', action: 'create' });
    });

  });

});
