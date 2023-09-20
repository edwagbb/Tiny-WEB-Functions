var fs = require('fs');

exports.default = async function (ctx) {
	try{
		var funcName = ctx.request.path.match(/^(\/[^\/\\]*?)(\/|$|\?)/)[1];
		//if(funcName === "/") funcName = "/index";
		return await require('@'+funcName).default(ctx)
	}catch(e){
		//return e.message
		var staticPath = "./static"
		var file = ctx.request.path.match(/^(\/[^?]*?)(\?|$)/)[1];
		if(file.indexOf("..")!== -1){
			return "";
		}
		if(file[file.length-1] === "/") file += 'index.html';
		if(/\.js$/i.test(file)){
			ctx.response.setHeader('content-type','text/javascript')
		}
		return fs.createReadStream(staticPath+file)
	}
}