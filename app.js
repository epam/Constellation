(function() {
  var app, express, path;

  express = require("express");


  path = require("path");

  app = express();
  
  var cookieParser = require('cookie-parser');
  app.use(cookieParser());
  
  var session = require('express-session');
  app.use(session({
      secret: 'change me to a secret',
      proxy: true
  }));
  
  // var bodyParser = require('body-parser');
  // app.use(bodyParser());


  app.launchConfig = require('./config/config.js');

  app.set("port", app.launchConfig.getLocalPort()); //9090
  app.set("view engine", "html");

  app.use(express["static"](path.join(__dirname, ".tmp")));
  app.use(express["static"](path.join(__dirname, "dist")));
  app.use(express["static"](path.join(__dirname, "app")));
  
  require('./server/index.js')(app);
  require('./server/login.js')(app);
  require('./server/logout.js')(app);
  
  app.listen(app.launchConfig.getLocalPort());

  console.log('Application started on http://localhost:' + app.launchConfig.getLocalPort());

}).call(this);