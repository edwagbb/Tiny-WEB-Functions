var fs = require('fs');
const cloud = require('@sys/cloud');

exports.default = async function (ctx) {
	try{
		var funcName = ctx.request.path.match(/^(\/[^\/\\]*?)(\/|$|\?)/)[1];
		if(funcName === "/") funcName = "/index";
		return await require('@'+funcName).default(ctx)
	}catch(e){
		//return e.message
		if(ctx.request.url.indexOf("/favicon.ico") === 0) return ""
		ctx.response.header("content-type",'image/jpeg')
		if(!cloud.shared.has('404_jpg')){
			cloud.shared.set('404_jpg',(await cloud.fetch("https://im.gurl.eu.org/file/99631c17549f3c02b9dc2.jpg",{ responseType: 'arraybuffer' })).data)
		}
		return cloud.shared.get('404_jpg')
	}
}