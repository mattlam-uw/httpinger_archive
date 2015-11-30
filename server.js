// Node.js Module Dependencies
var fs = require('fs');     // Used for reading and writing to local system files

// Require local modules
// Module containing all functions used for creating http requests
var httping = require('./modules/httping.js');
var urlsIO = require('./modules/urlsIO.js');


// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;  // Request round frequency in seconds


// Retrieve all URL data needed for making requests
var urls;
urlsIO.getUrls(function(urlData) {
    urls = urlData;

    // Send a round of requests every [PING_FREQ] seconds
    var pingInterval = setInterval(pingUrlHelper, (PING_FREQ * 1000));
});

// Because setInterval accepts only a reference to function, not function call
// itself, a helper function is needed to wrap the actual function call
function pingUrlHelper() {
    httping.pingUrls(urls);
}
