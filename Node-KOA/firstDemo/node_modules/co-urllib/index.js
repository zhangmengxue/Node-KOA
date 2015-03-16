
module.exports = require('generator-supported')
  ? require('./lib/urllib')
  : require('./build/urllib');
