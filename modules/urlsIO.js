// Node.js Module Dependencies
var fs = require('fs');     // Used for reading and writing to local system files

exports.getUrls = function(callback) {
	 fs.readFile('./data/urls.json', 'utf8', function(err, data) {
	    if (err) throw err;
	    callback(JSON.parse(data));
	});
}
	
