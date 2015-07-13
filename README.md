# Constellation
OpenDaylight UI

Environment setup (required steps):

 	- install nodejs (http://nodejs.org/)
	- install grunt globally: 
    	  npm install grunt-cli -g
	- install bower globally:
    	  npm install bower -g

Launch application:

	- run either install.sh or install.bat

Server Debugging:

	- install node-inspector:
    	  npm install -g node-inspector
	- start debugger:
    	  node-debug -p=9999 app.js

UI debugging:

	- execute(to setup ports and opendaylight host name):
          grunt config-app 
	- execute:
          grunt start
	- use another terminal and execute:
          node app
	

Product owners:

	Dmitry Orekhov <Dmitry_Orekhov@epam.com>;
	Dmitry Ogievich <Dmitry_Ogievich@epam.com>

Development team:

	Dzianis Chychmarou <Dzianis_Chychmarou@epam.com>;
	Valentin Fedoruk <Valentin_Fedoruk@epam.com>;
	Mikhail Bartashevich <Mikhail_Bartashevich@epam.com>;
	Varlam Ahekian <Varlam_Ahekian@epam.com>;
	Yauheni Datsenka <Yauheni_Datsenka@epam.com>