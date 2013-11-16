
/*
 * HTCPCP Interpreter
 */

 exports.pingBack = function(req, res){
 	var pb = {};
 	for(key in req){
 		if(typeof req[key] == 'string'){
 			pb[key] = req[key];
 		}
 	}
 	res.send(pb);
 }