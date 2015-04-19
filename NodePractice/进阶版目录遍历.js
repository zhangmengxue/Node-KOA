var fs = require('fs');
var Path = require('path');

var ROOT = "../../../work";
var ret = [];
var output = "./output.json";

function walk(path){
	var files = fs.readdirSync(path);
	files.forEach(function(file){
		var filePath = Path.join(path, file);

		if(/node_module/.test(filePath)) return;

		if(fs.statSync(filePath).isDirectory()){
			walk(filePath);
		} else {
			if(/\.json$/.test(file)){
				console.log('> DEBUG: ' + filePath);
				ret.push({
					name: file,
					path: filePath/*,
					file: fs.readFileSync(filePath)*/
				});
			}
		}
	});
}

walk(ROOT);
fs.writeFileSync(output, JSON.stringify(ret, null, 2));
