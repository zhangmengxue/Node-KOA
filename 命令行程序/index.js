var fs = require('fs');
var stdout = process.stdout;
var stdin = process.stdin;

fs.readdir(process.cwd(),function(err,files){
  //用于输出一个空行
  console.log('');

  if(!files.length){
    return console.log(' \033[31m No files to show ! \033[39m\n');
  }

  console.log('Select a file or directory you want to see! \n');

  var stats = [];

  function file(i){
    var filename = files[i];
    fs.stat(process.cwd()+'/'+filename,function(err,stat){
      stats[i] = stat;
      if(stat.isDirectory()){
          console.log(''+i+ '\033[36m '+ filename +' \033[39m\n' );
      }else{
          console.log(''+i+ '\033[90m '+ filename +' \033[39m\n' );
      }

      i++;
      if(i == files.length){
        read();
        // console.log('');
        // process.stdout.write('\033[33m Enter your choice: \033[39m');
        // process.stdin.resume();
      }else{
        file(i);
      }
    });
  }

  function read(){
    console.log('');
    stdout.write('\033[33m Enter your choice: \033[39m');
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data',option);
  }

  function option(data){
    var filename = files[Number(data)];
    if(!files[Number(data)]){
      stdout.write('\033[33m Enter your choice: \033[39m');
    }else{
      stdin.pause();

      if(stats[Number(data)].isDirectory()){
        fs.readdir(process.cwd()+'/'+filename,function(err,files){
          console.log('');
          console.log('(' + files.length + 'files)');
          files.forEach(function(file){
            console.log( ' - ' + file);
            console.log('');
            fs.readFile(process.cwd()+'/'+filename +'/'+file,'utf8',function(err,data){
              console.log('');
              console.log('\033[90m '+ data.replace(/(.*)/g,'  $1') +' \033[39m\n');
            });
          });
          console.log('');
        });
      }else{
        fs.readFile(process.cwd()+'/'+filename,'utf8',function(err,data){
          console.log('');
          console.log('\033[90m '+ data.replace(/(.*)/g,'  $1') +' \033[39m\n');
        });
      }

    }
  }

  file(0);

});
