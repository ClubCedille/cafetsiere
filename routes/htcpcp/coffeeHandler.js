var path = require('path');
var command = require('child_process');
var config = require('../../config.js');
var Memcached = require('memcached');

var memcached = new Memcached(config.memcached.server, config.memcached.options);

exports.brew = function(req, res) {
	var coffee = req.param('coffee');
	memcached.get('coffee', function(err, currentlyBrewing){
		if(err) {
			res.send(500, {error:500, message: 'An unexpected error has occured: ' + err});
		} else if(currentlyBrewing) {
			console.log(currentlyBrewing, config.memcached.server);
			res.send(409, {error: 409, message: 'There is already some coffee brewing', info: currentlyBrewing});
		} else if(!coffee) {
			res.send(500, {error: 500, message: 'no'});
		} else {
			command.exec('py ' + path.join(__dirname, 'python/brew.py ' + JSON.stringify(coffee).replace(/"/g, '\\"')), function(error, value){
				value = value.replace(/[\r\n\\]/g, '');
				if(value == 'Error') {
					res.send(500, {error: 500, message: 'An unexpected error occured before brewing'});
				} else if(value == '418') {
					res.send(418, {error: 418, message: "I'm a teapot"})
				} else {
					memcached.set('coffee', coffee, config.coffee.brewTime);
					res.send(202, {success: value});
				}
			});
		}
	});
}

exports.get = function(req, res) {
	memcached.get('coffee', function(err, currentlyBrewing){
		if(err) {
			res.send(500, {error:500, message: 'An unexpected error has occured: ' + err});
		} else if(currentlyBrewing){
			res.send(200, currentlyBrewing);
		} else {
			res.send(404, {error: 404, message: 'No coffee is brewing at the moment'});
		}
	});
}