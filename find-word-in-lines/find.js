var fs = require('fs');
var readline = require('readline');
var path = require('path');

var ROOT = process.argv[2];
//var ROOT = './';
console.log(ROOT);

// var rd = readline.createInterface({
//   input:fs.createReadStream('./words.txt'),
//   output: process.stdout,
//   terminal: false
// });


// var i=0;
// rd.on('line',function(line){
//     i++
//     if(line.indexOf('https') !== -1){
//       console.log(i+':'+line);
//     }
// });

walkfile(ROOT);

function walkfile(dir){
  fs.readdir(dir,function(err,files){
    files.forEach(function(filename){
      var filepath =  path.join(dir,filename);
      if(fs.statSync(filepath).isDirectory()){
        walkfile(filepath);
      }else{
        findline(filepath);
      }
    });

  });
}

function findline(file){

  //console.log(file);
  var rd = readline.createInterface({
    input:fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  });


  var i=0;
  rd.on('line',function(line){
      i++;
      if(line.indexOf('https') !== -1){
        console.log('\033[36m' +process.cwd()+'\033[39m : line '+i+', col: '+
          line.indexOf('https')+'\n '+line +'\n'+
          Array(line.indexOf('https') + 2).join(' ')+'T');
        //console.log(line.indexOf('https'));
      }
      var strline = line.toString().replace(/https/g,'http');
      if(file.indexOf('new')!==-1){
        fs.appendFileSync(file,strline+'\n');
      }else{
        fs.appendFileSync(file + '-new',strline+'\n');
      }
      //fs.appendFileSync(file + '-new',strline+'\n');

      //console.log(line);
  });
}
