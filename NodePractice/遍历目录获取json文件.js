var fs = require('fs');

var dirs = fs.readdirSync("../../../work");
//console.log(dirs);
dirs.forEach(function(ele){
	if(ele.indexOf('.')==-1){
		var files = fs.readdirSync('../../../work/'+ele+'');
		//console.log(files);
		var jsonFiles = '';
		files.forEach(function(filele){
			var fileStr = filele.toString();
			if(/\.json/g.test(fileStr)){
				var jsonfile = fs.readFileSync('../../../work/'+ele+'/'+filele);
				jsonFiles += jsonfile;
			}
		});
		console.log(jsonFiles);
		writeFile(jsonFiles);
	}
});

function writeFile(jsonFiles){
	fs.writeFile('workJsonContent.txt',jsonFiles,function(err){
		if (err) throw err;
	    console.log('数据已保存～');
	});
}
