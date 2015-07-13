/**
 * Logout module.
 * 
 * Sends logout request

 * @param {express} app
 */
module.exports = function(app) {

    app.get('/logout', function(req, resp) {
        req.session.destroy();
		resp.send(JSON.stringify({status: 'ok'}));
    });
};