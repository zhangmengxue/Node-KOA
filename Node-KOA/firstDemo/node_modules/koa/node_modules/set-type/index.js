
var mime = require('mime')

module.exports = function (type) {
  if (!~type.indexOf('/')) type = mime.lookup(type)
  if (!~type.indexOf('charset')) {
    var charset = mime.charsets.lookup(type)
    if (charset) type += '; charset=' + charset.toLowerCase()
  }
  return type
}
