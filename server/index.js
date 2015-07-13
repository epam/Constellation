module.exports = function(app) {

    var httpProxy = require('http-proxy');

    var apiProxy = httpProxy.createProxyServer({
		target : {
			host : app.launchConfig.getHost(), //'evbyminsd4d80.minsk.epam.com',
			port : app.launchConfig.getPort() // 8080
		}
	});
	
	apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
		if(req.session !== undefined && req.session.api !== undefined) {
			proxyReq.setHeader('Authorization', 'Basic ' + new Buffer(req.session.api.credentials.user + ':' + req.session.api.credentials.password).toString('base64'));
		}
	});

    app.get("/controller/*", function(req, res) { 
		if(req.session !== undefined && req.session.api !== undefined) {
			apiProxy.web(req, res);
		} else {
			res.statusCode = 401;
			res.send({status: 'fail'});
		}
    });

    app.post("/controller/*", function(req, res) {
    	if(req.session !== undefined && req.session.api !== undefined) {
			apiProxy.web(req, res);
		} else {
			res.statusCode = 401;
			res.send({status: 'fail'});
		}
    });

    app.put("/controller/*", function(req, res) {
    	if(req.session !== undefined && req.session.api !== undefined) {
			apiProxy.web(req, res);
		} else {
			res.statusCode = 401;
			res.send({status: 'fail'});
		}
    });

    app.del("/controller/*", function(req, res) {
    	if(req.session !== undefined && req.session.api !== undefined) {
			apiProxy.web(req, res);
		} else {
			res.statusCode = 401;
			res.send({status: 'fail'});
		}
    });
    
};