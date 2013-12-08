
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile('/index.html');
};
