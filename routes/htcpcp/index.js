var uriRoot = '/htcpcp';
var method = require('./methodFaker').methodFaker();

exports.error = exports.version = function(req,res) {
	res.send(505, {error: 505, message: 'Please specify an api version'})
}

exports.setRoutes = function(app){
	require('./v1').setup(app, method, uriRoot + '/v1');

	app.all(uriRoot + '/:method', exports.error);
}