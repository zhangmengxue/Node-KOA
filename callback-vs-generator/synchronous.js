var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

run(function* (){
  try{
    var file = yield readFile('./fibonacci.js');
    console.log(file.toString());
  }catch (er){
    console.error(er);
  }
});

function run(genFn){
  var gen = genFn();
  next();
  function next(er,value){
    if(er) return gen.throw(er);
    var continuable = gen.next(value);

    if(continuable.done) return;
    var cbFn = continuable.value;
    cbFn(next);
  }
}
