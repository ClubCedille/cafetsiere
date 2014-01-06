var path = require('path');
var command = require('child_process');
var config = require('../../config.js');
var _ = require('lodash');
var arduino = require('duino');

/************
*** Setup ***
*************/
var board;
var coffeeSwitch;
var boardIsSetup = false;
var boardIsReady = false;
var currentlyBrewing;

try{
	setupCoffeePort();
} catch(err) {
	console.error('Port not found');
}

function setupCoffeePort(){
	board = new arduino.Board();
	coffeeSwitch = new arduino.Led({
		board: board,
		pin: config.arduino.pin
	});
	board.on('ready', function(){
		boardIsReady = true;
	});
	boardIsSetup = true;
}

function physicalBrew(coffee){
	if(!boardIsSetup) {
		throw {
			name: "SerialPortMissing",
			message: "Could not locate Coffee Pot"
		};
	}

	if(currentlyBrewing){
		throw {
			name: "MultiBrewError",
			message: "Coffee Pot already brewing"
		};
	}

	if(!boardIsReady) {
		_.delay(physicalBrew, 500, coffee);
	} else {
		currentlyBrewing = coffee;
		coffeeSwitch.on();
		_.delay(function(){
			coffeeSwitch.off();
			currentlyBrewing = null;
		}, config.coffee.brewTime);
	}
}

exports.brew = function(req, res) {
	var coffee = req.param('coffee');
	if(currentlyBrewing) {
		res.send(409, {error: 409, message: 'There is already some coffee brewing', info: currentlyBrewing});
	} else if(!coffee) {
		res.send(400, {error: 400, message: "Don't you want coffee?"});
	} else {
		try{
			var expires = config.coffee.brewTime * 1000 + new Date().getTime();
			_.extend(coffee, {expires: expires });
			physicalBrew(coffee);
			res.send(202, {success: "Now brewing " + coffee.cups + " cups of delicious"});
		} catch (e) {
			if(e.name == "MultiBrewError") {
				res.send(418, {error: 418, message: "I'm a teapot", info: 'Server/Coffee connection is acting outside of parameters'});
			} else if (e.name == "SerialPortMissing") {
				res.send(418, {error: 418, message: "I'm a teapot", info: 'Server/Coffee connection not established'});
			} else {
				res.send(500, {error: 500, message: 'An unexpected error occured before brewing'});
			}
		}
	}
};

exports.get = function(req, res) {
	if(currentlyBrewing){
		var timeTillBrew = currentlyBrewing.expires - new Date().getTime();
		res.send(200, _.extend(currentlyBrewing, {readyIn: timeTillBrew}));
	} else {
		res.send(404, {error: 404, message: 'No coffee is brewing at the moment'});
	}
};