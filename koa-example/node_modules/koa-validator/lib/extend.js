var validator = require('validator')

  , check = {}
  , sanitize = {}
  ;

check.notEmpty = function(str){
  return validator.isLength(str, 1);
};
check.empty = function(str){
  return str == undefined || str === '';
};
check.eq = function(str, value){
  return str == value;
};
check.eqeq = function(str, value){
  return str === value;
};
check.neq = function(str, value){
  return str != value;
};
check.neqeq = function(str, value){
  return str !== value;
};
check.gt = function(str, num){
  return str > num;
};
check.lt = function(str, num){
  return str < num;
};
check.ge = function(str, num){
  return str >= num;
};
check.le = function(str, num){
  return str <= num;
};
check.notContains = function(str, s){
  return !validator.contains(str, s);
};
check.isTime = function(str){
  return str.match(/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/);
};
check.byteLength = function(str, min, max,charset) {
  min = min || 0;
  max = max || Number.MAX_VALUE;
  charset = charset || 'utf8';

  var bl = Buffer.byteLength(str , charset);
  if(bl >= min && bl <= max){
    return true;
  }else{
    return false;
  }
};
check.len = validator.isLength;
check.in = validator.isIn;
check.isUrl = validator.isURL;
check.isIp = validator.isIP;
check.isLowerCase = validator.isLowercase;
check.isUpperCase = validator.isUppercase;


sanitize.default = function(d, value){
  // validator.js will convert the first param to string
  if(d === '' && value !== undefined){
    return value;
  }else{
    return d;
  }
};
sanitize.toLowerCase = function(str){
  if(str){
    return str.toLowerCase();
  }
};
sanitize.toUpperCase = function(str){
  if(str){
    return str.toUpperCase();
  }
};
sanitize.encodeURI = function(str){
  if(str){
    return encodeURI(str);
  }
};
sanitize.encodeURIComponent = function(str){
  if(str){
    return encodeURIComponent(str);
  }
};
sanitize.decodeURI = function(str){
  if(str){
    return decodeURI(str);
  }
};
sanitize.decodeURIComponent = function(str){
  if(str){
    return decodeURIComponent(str);
  }
};
sanitize.replace = function(str, from, to){
  if(str){
    return str.replace(from, to);
  }
};
sanitize.toLow = sanitize.toLowerCase;
sanitize.toUp = sanitize.toUpperCase;

exports.check = check;
exports.sanitize = sanitize;
