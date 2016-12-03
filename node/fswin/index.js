
(function () {
	'use strict';

	var fswin; 


	if (process.platform === 'win32') {
		var v = process.version.match(/(\d+\.)(\d+)\./);

		if (v[1] === '0.') {
			v[2] = parseInt(v[2]);
			if (v[2] % 2) {
				v[2]++;
			}
		} else {
			v[2] = 'x';
		}

		fswin = require('./' + v[1] + v[2] + '.x' + '/' + process.arch + '/fswin.node');
		module.exports = fswin;
	} 

	exports.init = init;
	console.log(t);

	function getAttributes(path){
		return fwsin.getAttributesSync(path);
	}

	function init(domainManager) {
    	if (!domainManager.hasDomain("fswin")) {
       		domainManager.registerDomain("fswin", {major: 0, minor: 1});
    	}
    	domainManager.registerCommand(
        	"fswin",       // domain name
        	"getAttributes",    // command name
        	getAttributes,   // command handler function
        	false,          // this command is synchronous in Node
    	);
    	
	}


}());

