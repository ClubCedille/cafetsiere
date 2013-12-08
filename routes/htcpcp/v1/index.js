
/*
 * HTCPCP Interpreter
 */

 var method = function(){return arguments[0]};

exports.setup = function(app, methodFaker, uriRoot){
	method = methodFaker.detect;
	app.all(uriRoot + '/:method', methodHandler);
}

function methodHandler(req){
	switch(method(req)){
		case 'BREW':
		case 'POST':
			brew.apply(this, arguments);
			break;
		case 'GET':
			get.apply(this, arguments);
			break;
		case 'PROPFIND':
			propfind.apply(this, arguments);
			break;
		case 'WHEN':
			when.apply(this, arguments);
			break;
		default:
			notImplemented.apply(this, arguments);
	}
}

function brew(req, res){
	res.send({result: 'Brew'});
}
function get(req, res){
	res.send({result: 'Get'});
}
function propfind(req, res){
	res.send({result: 'Propfind'});
}
function when(req, res){
	res.send({result: 'When'});
}

function notImplemented(req, res){
	res.send(405, {error: 405, message: 'This method is not implemented'});
}