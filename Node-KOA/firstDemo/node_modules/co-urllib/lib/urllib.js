/**!
 * co-urllib - lib/urllib.js
 *
 * MIT Licensed
 *
 * Authors:
 *   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.cnpmjs.org)
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('co-urllib');
var thunkify = require('thunkify');
var http = require('http');
var https = require('https');
var urlutil = require('url');
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var readall = require('co-readall');
var assertTimeout = require('co-assert-timeout');
var ua = require('default-user-agent');
var gunzip = thunkify(zlib.gunzip);

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));

var REQUEST_ID = 0;

function createRequest(httplib) {
  return function (options, args) {
    var reqId = ++REQUEST_ID;
    return function (done) {
      var called = false;
      function _done(err, result) {
        if (called) {
          return;
        }
        called = true;
        done(err, result);
      }

      var req = httplib.request(options, function (res) {
        _done(null, {req: req, res: res});
      });

      req.requestId = reqId;

      req.on('error', function onerror(err) {
        if (err.name === 'Error') {
          err.name = 'RequestError';
        }
        debug('Request#%d %s `req error` event emit, %s: %s', reqId, options.path, err.name, err.message);
        _done(err);
      });

      if (args.stream) {
        args.stream.pipe(req);
      } else {
        req.end(args.body);
      }
    };
  };
}

var httpRequest = createRequest(http);
var httpsRequest = createRequest(https);

var USER_AGENT = exports.USER_AGENT = ua('node-co-urllib', pkg.version);

// change Agent.maxSockets to 1000
exports.agent = new http.Agent();
exports.agent.maxSockets = 1000;

exports.httpsAgent = new https.Agent();
exports.httpsAgent.maxSockets = 1000;

/**
 * The default request timeout(in milliseconds) 5000ms.
 * @type {Number}
 * @const
 */
exports.TIMEOUT = 5000;

/**
 * Handle all http request, both http and https support well.
 *
 * @example
 *
 * // GET http://httptest.cnodejs.net
 * var result = yield *urllib.request('http://httptest.cnodejs.net/test/get');
 * // POST http://httptest.cnodejs.net
 * var args = { type: 'post', data: { foo: 'bar' } };
 * var result = yield *urllib.request('http://httptest.cnodejs.net/test/post', args);
 *
 * @param {String|Object} url
 * @param {Object} [args], optional
 *   - {Object} [data]: request data, will auto be query stringify.
 *   - {String|Buffer} [content]: optional, if set content, `data` will ignore.
 *   - {ReadStream} [stream]: read stream to sent.
 *   - {WriteStream} [writeStream]: writable stream to save response data.
 *       If you use this, callback's data should be null.
 *       We will just `pipe(ws, {end: true})`.
 *   - {String} [method]: optional, could be GET | POST | DELETE | PUT, default is GET
 *   - {String} [dataType]: optional, `text` or `json`, default is buffer
 *   - {Object} [headers]: optional, request headers
 *   - {Number} [timeout]: request timeout(in milliseconds), default is `exports.TIMEOUT`
 *   - {Agent} [agent]: optional, http agent. Set `false` if you does not use agent.
 *   - {Agent} [httpsAgent]: optional, https agent. Set `false` if you does not use agent.
 *   - {String} [auth]: Basic authentication i.e. 'user:password' to compute an Authorization header.
 *   - {String|Buffer|Array} [ca]: An array of strings or Buffers of trusted certificates.
 *       If this is omitted several well known "root" CAs will be used, like VeriSign.
 *       These are used to authorize connections.
 *       Notes: This is necessary only if the server uses the self-signed certificate
 *   - {Boolean} [rejectUnauthorized]: If true, the server certificate is verified against the list of supplied CAs.
 *       An 'error' event is emitted if verification fails. Default: true.
 *   - {String|Buffer} [pfx]: A string or Buffer containing the private key,
 *       certificate and CA certs of the server in PFX or PKCS12 format.
 *   - {String|Buffer} [key]: A string or Buffer containing the private key of the client in PEM format.
 *       Notes: This is necessary only if using the client certificate authentication
 *   - {String|Buffer} [cert]: A string or Buffer containing the certificate key of the client in PEM format.
 *       Notes: This is necessary only if using the client certificate authentication
 *   - {String} [passphrase]: A string of passphrase for the private key or pfx.
 *   - {Boolean} [followRedirect]: Follow HTTP 3xx responses as redirects. defaults to false.
 *   - {Number} [maxRedirects]: The maximum number of redirects to follow, defaults to 10.
 *   - {Function(options)} [beforeRequest]: Before request hook, you can change every thing here.
 *   - {Boolean} [gzip]: Accept gzip response content and auto decode it, default is `false`.
 * @return {Object} result, contains `data` and `res`
 *   - {Buffer|Object} data
 *   - {Response} res
 * @api public
 */
function *request(url, args) {
  args = args || {};

  args.timeout = args.timeout || exports.TIMEOUT;
  args.maxRedirects = args.maxRedirects || 10;
  var parsedUrl = typeof url === 'string' ? urlutil.parse(url) : url;

  var method = (args.type || args.method || parsedUrl.method || 'GET').toUpperCase();
  var port = parsedUrl.port || 80;
  var _request = httpRequest;
  var agent = args.agent || exports.agent;

  if (parsedUrl.protocol === 'https:') {
    _request = httpsRequest;
    agent = args.httpsAgent || exports.httpsAgent;
    if (args.httpsAgent === false) {
      agent = false;
    }
    if (!parsedUrl.port) {
      port = 443;
    }
  }

  if (args.agent === false) {
    agent = false;
  }

  var options = {
    host: parsedUrl.hostname || parsedUrl.host || 'localhost',
    path: parsedUrl.path || '/',
    method: method,
    port: port,
    agent: agent,
    headers: args.headers || {}
  };

  var sslNames = ['ca', 'pfx', 'key', 'cert', 'passphrase'];
  for (var i = 0; i < sslNames.length; i++) {
    var name = sslNames[i];
    if (args[name]) {
      options[name] = args[name];
    }
  }

  if (args.rejectUnauthorized !== undefined) {
    options.rejectUnauthorized = args.rejectUnauthorized;
  }

  var auth = args.auth || parsedUrl.auth;
  if (auth) {
    options.auth = auth;
  }

  var body = args.content || args.data;
  var isReadAction = method === 'GET' || method === 'HEAD';
  if (!args.content) {
    if (body && !(typeof body === 'string' || Buffer.isBuffer(body))) {
      if (isReadAction) {
        // read: GET, HEAD, use query string
        body = qs.stringify(body);
      } else {
        // auto add application/x-www-form-urlencoded when using urlencode form request
        if (!options.headers['Content-Type'] && !options.headers['content-type']) {
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        var contentType = options.headers['Content-Type'] || options.headers['content-type'];
        if (contentType === 'application/json') {
          body = JSON.stringify(body);
        } else {
          // 'application/x-www-form-urlencoded'
          body = qs.stringify(body);
        }
      }
    }
  }

  // if it's a GET or HEAD request, data should be sent as query string
  if (isReadAction && body) {
    options.path += (parsedUrl.query ? '&' : '?') + body;
    body = null;
  }

  if (body) {
    var length = body.length;
    if (!Buffer.isBuffer(body)) {
      length = Buffer.byteLength(body);
    }
    options.headers['Content-Length'] = length;
  }

  args.dataType = args.dataType || args.datatype;

  if (args.dataType === 'json') {
    options.headers.Accept = 'application/json';
  }

  if (typeof args.beforeRequest === 'function') {
    // you can use this hook to change every thing.
    args.beforeRequest(options);
  }

  // set user-agent
  if (!options.headers['User-Agent'] && !options.headers['user-agent']) {
    options.headers['User-Agent'] = USER_AGENT;
  }

  var enableGzip = args.gzip === true;
  if (enableGzip) {
    var acceptEncoding = options.headers['Accept-Encoding'] || options.headers['accept-encoding'];
    if (acceptEncoding) {
      enableGzip = false; // user want to handle response content decode themself
    } else {
      options.headers['Accept-Encoding'] = 'gzip';
    }
  }

  debug('%s %s, headers: %j', method, url, options.headers);

  var r;
  try {
    r = yield assertTimeout(_request(options, {body: body, stream: args.stream}), args.timeout);
  } catch (err) {
    err.status = err.status || -1;
    if (err.status === 408) {
      err.name = 'ConnectionTimeoutError';
    }
    err.message += ' (' + method + ' ' + url + ')';
    err.headers = {};
    throw err;
  }

  var req = r.req;
  var res = r.res;

  var reqId = req.requestId;

  debug('Request#%d %s `req response` event emit: status %d, headers: %j',
    reqId, options.path, res.statusCode, res.headers);

  if ((res.statusCode === 302 || res.statusCode === 301) && args.followRedirect) {  // handle redirect
    args._followRedirectCount = (args._followRedirectCount || 0) + 1;
    var err = null;
    if (!res.headers.location) {
      err = new Error('Got statusCode ' + res.statusCode + ' but cannot resolve next location from headers');
      err.name = 'FollowRedirectError';
    } else if (args._followRedirectCount > args.maxRedirects) {
      err = new Error('Exceeded ' + args.maxRedirects + ' maxRedirects. Probably stuck in a redirect loop ' + url);
      err.name = 'MaxRedirectError';
    }

    if (err) {
      err.message += ' (' + method + ' ' + url + ')';
      err.status = res.statusCode;
      err.headers = res.headers;
      throw err;
    }

    var _url = urlutil.resolve(url, res.headers.location);
    debug('Request#%d %s: `redirected` from %s to %s', reqId, options.path, url, _url);
    return yield *request(_url, args);
  }

  res.on('aborted', function () {
    debug('response was aborted');
  });

  req.on('close', function () {
    debug('Request#%d %s: `req close` event emit', reqId, options.path);
  });

  var data;
  try {
    data = yield assertTimeout(readall(res, args.writeStream), args.timeout);
  } catch (err) {
    err.requestId = reqId;
    err.status = err.status || res.statusCode;
    if (err.status === 408) {
      req.abort(); // try to abort response handle
      err.message += ' (' + method + ' ' + url + ')';
      err.name = 'ResponseTimeoutError';
    }
    err.headers = res.headers;
    throw err;
  }

  var size = data && data.length || 0;

  debug('Request#%d %s %s %s got %d bytes body',
    reqId, method, url, res.statusCode, size);

  var encoding = res.headers['content-encoding'];

  if (size > 0) {
    if (enableGzip) {
      if (encoding && encoding.toLowerCase() === 'gzip') {
        var gzipLength = data.length;
        data = yield gunzip(data);
        encoding = null;
        debug('gunzip %d bytes body to %d bytes', gzipLength, data.length);
      }
    }

    // if response body not decode, dont touch it
    if (!encoding && args.dataType) {
      if (args.dataType === 'json') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          err.message += ' (' + method + ' ' + url + ')';
          err.name = 'JSONResponseFormatError';
          err.status = res.statusCode;
          err.headers = res.headers;
          err.data = data;
          throw err;
        }
      } else if (args.dataType === 'text') {
        data = data.toString();
      }
    }
  }

  return {
    data: data,
    status: res.statusCode,
    headers: res.headers
  };
}

exports.request = request;
