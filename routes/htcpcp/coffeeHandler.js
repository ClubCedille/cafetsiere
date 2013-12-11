var path = require('path');
var command = require('child_process');

exports.brew = function(req, res) {
	var coffee = req.param('coffee');
	if(!coffee) {
		res.send(500, {error: 500, message: 'no'});
	} else {
		command.exec('py ' + path.join(__dirname, 'python/brew.py ' + JSON.stringify(coffee).replace(/"/g, '\\"')), function(error, value){
			value = value.replace(/[\r\n\\]/g, '');
			if(value == 'Error') {
				res.send(500, {error: 500, message: 'An unexpected error occured before brewing'});
			} else {
				res.send(200, {success: value});
			}
		});
	}
}