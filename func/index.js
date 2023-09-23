const cloud = require('@sys/cloud');

exports.default = async function (ctx) {
	ws=1
	ctx.response.write('Hello world! Start up ')
	var seconds = (new Date().getTime() - cloud.shared.get("START_UP_TIME"))/1000;
	if(seconds > 60){
		var minutes = seconds / 60;
		if(minutes > 60){
			var hours = minutes / 60;
			if(hours>24){
				var days = hours / 24;
				return days.toFixed(2) + " days ago."
			}else return hours.toFixed(2) + " hours ago."
		}else return minutes.toFixed(2) + " minutes ago."
	}else return seconds.toFixed(2) + " seconds ago."
}