var suite = new (require('benchmark')).Suite;

function fib(n){
  var current = 0,next = 1,swap;
  for(var i=0;i<n;i++){
    swap = current,current = next;
    next = swap + next;
  }
  return current;
}

function* fibGen(n){
  var current = 0,next = 1,swap;
  for(var i=0;i<n;i++){
    swap = current,current = next;
    next = swap + next;
    yield current;
  }
}

suite
  .add('regular',function(){
    fib(20);
  })
  .add('generator',function(){
    for(var n of fibGen(20));
  })
  .on('complete',function(){
    console.log('results:');
    this.forEach(function(result){
      console.log(result.name,result.count);
    })
  })
  .run()
