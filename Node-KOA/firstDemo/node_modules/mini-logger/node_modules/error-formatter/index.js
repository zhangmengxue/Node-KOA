/*!
 * project - module
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var os = require('os');
var util = require('util');
var utility = require('utility');

/**
 * Expose `formater`
 */

module.exports = text;
text.json = json;
text.both = both;


function text(err) {
  var infos = json(err);
  return format(infos);
}

function both(err) {
  var infos = json(err);
  var text = format(infos);

  return {
    text: text,
    json: infos
  }
}

function json(err) {
  if (!(err instanceof Error)) throw new TypeError('input non-error object: ' + err);

  var infos = {
    name: err.name,
    message: err.message,
    url: err.url || '',
    data: err.data || '',
    pid: process.pid,
    code: err.code
  };

  if (err.name === 'Error' && typeof err.code === 'string') {
    infos.name = err.code + err.name;
  }

  if (err.host) {
    infos.host = err.host;
    infos.message += ' (' + infos.host + ')';
  }
  infos.domainThrown = !!(err.domain_thrown || err.domainThrown);
  infos.name = infos.name + 'Exception';
  infos.time = utility.logDate();
  infos.hostname = os.hostname();
  // name and stack could not be change on node 0.11+
  var errName = err.name;

  var errStack = err.stack || 'no_stack';
  infos.stack = errName + ': ' + infos.message + '\n' + errStack.substring(errStack.indexOf('\n') + 1);
  return infos;
}

var formatTpl = '%s nodejs.%s: %s' + os.EOL +
  'pid: %s' + os.EOL +
  'domainThrown: %s' + os.EOL +
  'Host: %s' + os.EOL +
  'URL: %s' + os.EOL +
  'Data: %j' + os.EOL +
  '%s';

function format(infos) {
  return util.format(formatTpl,
    infos.time,
    infos.name,
    infos.stack,
    infos.pid,
    infos.domainThrown,
    infos.hostname,
    infos.url,
    infos.data,
    infos.time
  );
}
