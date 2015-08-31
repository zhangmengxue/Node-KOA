//var findLargest = require('./readmaxnested');
//var findLargest = require('./readmaxmodular.js');
//var findLargest = require('./readmaxsync.js');
//var findLargest = require('./readmaxpromises.js');
var findLargest = require('./readmaxgenerator.js');

//获取当前根目录下的最大的文件名称
// findLargest('./',function(err,filename){
//   if(err) return console.log(err);
//   console.log('largest file was:', filename);
// });

//promises 版本
// findLargest('./')
//   .then(function(filename){
//     console.log('largest file was:',filename);
//   })
//   .catch(console.error)

//generator版本
findLargest('./')
  .then(function(filename){
    console.log('largest file is:',filename);
  });
