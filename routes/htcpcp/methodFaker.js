function MethodFaker() {
	this.detect = function(req) {
		if(req.params.method) {
			return req.params.method.toUpperCase();
		}
		console.log(req.params);
		if(req.method == 'POST') {
			switch(req.body._method) {
				case 'WHEN':
				case 'when':
					return 'WHEN';
				default:
					return 'POST';
			}
		}
		return req.method;
	};
}

exports.methodFaker = function() {
	return new MethodFaker();
};