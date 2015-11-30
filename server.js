/**
 * Main application file
 *
 * Node.js Module Dependencies
 *  + fs
 *
 * Internal Module Dependencies
 *  + ./modules/httping.js
 *  + ./modules/urlsIO.js
 *
 */

// Node.js Module Dependencies
var fs = require('fs');     // Used for reading and writing to local system files

// Require local modules
var httping = require('./modules/httping.js');
var urlsIO = require('./modules/urlsIO.js');

// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;  // Request round frequency in seconds

// Define the urls variable outside of getUrls function so that it can be referenced
// by pingUrlHelper()
var urls;

// Callback function to be passed with call to getUrls(). This function will
// assign the url data retrieved by getUrls() to the urls variable and then
// begin sending time-interval-spaced requests to the urls. We need to kick off
// the requests from within the callback in order to ensure that the url data
// has all been retrieved via asynchronous calls to retrieve the data.
var callback = function(urlData) {
    // Assign the retrived url data to the urls variable
    urls = urlData;

    // Kick off time-interval-spaced requests every [PING_FREQ] seconds
    var pingInterval = setInterval(pingUrlHelper, (PING_FREQ * 1000));
}

// Call getUrls() with the above callback in order to get the URLs and kick
// off the requests
urlsIO.getUrls(callback);

// Because setInterval accepts only a reference to function, not function call
// itself, a helper function is needed to wrap the actual function call
function pingUrlHelper() {
    httping.pingUrls(urls);
}
