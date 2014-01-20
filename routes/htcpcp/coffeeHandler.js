var path = require('path');
var command = require('child_process');
var config = require('../../config.js');
var _ = require('lodash');
var Serialport = require('serialport');

/************
*** Setup ***
*************/
var board;
var coffeeSwitch = new CoffeeSwitch();
var boardIsSetup = false;
var boardIsReady = false;
var currentlyBrewing;

function CoffeeSwitch(serial){
	var serialport = serial;
	var serialSet = function(){
		if(!serialport) {
			console.error('No serial port set to coffee switch');
			return false;
		} else {
			return true;
		}
	};

	this.on = function(){
		if(serialSet()) {
			serialport.write("1");
		}
	};

	this.off = function(){
		if(serialSet()) {
			serialport.write("0");
		}
	};

	this.set = function(newSerial){
		serialport = newSerial;
	};
}

(function setupCoffeePort(){
	board = new Serialport.SerialPort("/dev/ttyUSB0", {baudrate: 57600}, false);

	board.on('error', function(err){
		console.log(err);
	});

	openCoffeePort();
})();

function openCoffeePort(){
	board.open(function(err){
		if (err) {
			console.log(err);
			return;
		}
		console.log('Coffee a-go-go, baby');
		coffeeSwitch.set(board);
		boardIsReady = true;
		boardIsSetup = true;
	});
}

function physicalBrew(coffee){
	if(!boardIsSetup) {
		openCoffeePort();
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
				console.error('HTCPCP server not connected');
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