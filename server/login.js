/**
 * Login module.
 * 
 * Uses multiple http requests to get JSESSIONID and JSESSIONIDSSO cookies
 * 
 * @param {express} app
 */
module.exports = function(app) {    

    var util = require('util'),
    request = require('request'), cookieParser = require('cookie');
    
    var domain   = app.launchConfig.getHost(); //"evbyminsd4d80.minsk.epam.com";
    var port     = app.launchConfig.getPort(); //"8080";
    var protocol = app.launchConfig.getProtocol(); // "http";
    
    var tryUrl   = "controller/nb/v2/connectionmanager/nodes";
	
	var writeApiCredentials = function(req, userName, password) {
		var session = req.session;
		session.api = {};
		session.api.credentials = {};
		session.api.credentials.user = req.body.username;
		session.api.credentials.password = req.body.password;
	};
	var bodyParser = (require('body-parser'))();

	app.post('/login', bodyParser, function(req, resp) {
        var loginRequest = {
            url      : protocol+'://'+domain+':'+port+'/'+tryUrl,
			auth     : {
				user   : req.body.username,
				pass   : req.body.password
			},
            callback : function(err, httpResponse, body) {
				var statusCode = httpResponse ? httpResponse.statusCode : 500;
				var responseJson = {};
				if(statusCode === 401) {
					resp.statusCode = 500;
					responseJson.status = 'Invalid Controller IP Address passed.';
					responseJson.status = 'fail'; //TODO: fix client
				} else if(statusCode === 406) {
					resp.statusCode = 500;
					responseJson.status = 'Invalid Controller IP Address passed.';
					responseJson.status = 'fail'; //TODO: fix client
				} else if(statusCode === 503) {
					resp.statusCode = 500;
					responseJson.status = 'Connection Manager Service not available.';
					responseJson.status = 'fail'; //TODO: fix client
				} else {
					resp.statusCode = 200;
					responseJson.status = 'ok';
					writeApiCredentials(req, req.body.username, req.body.password);
				}
				resp.send(JSON.stringify(responseJson));
            }
        };
        request.get(loginRequest);
    });
};