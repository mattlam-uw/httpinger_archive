/**
 * Main application file
 *
 * Node.js Module Dependencies
 *  + fs
 *
 * Internal Module Dependencies
 *  + ./modules/httping.js
 *  + ./modules/urlsIO.js
 *  + ./modules/logIO.js
 *
 */

// Node.js Module Dependencies
var fs = require('fs');     // Used for reading and writing to local system files

// Require local modules
var httping = require('./modules/httping.js');
var urlsIO = require('./modules/urlsIO.js');
var logIO = require('./modules/logIO.js');

// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;  // Request round frequency in seconds

// Define the urls variables outside of the functions that use the variable so
// we can ensure it is asynchronously assigned data before we attempt to use
// the data
var urls;

/**
 * Callback function to be passed with call to getUrls(). This function will
 * assign the url data retrieved by getUrls() to the urls variable and then
 * begin sending time-interval-spaced requests to the urls. We need to kick
 * off the requests from within the callback in order to ensure that the url
 * data has all been retrieved via asynchronous calls to retrieve the data.
 **/
var cbGetUrlData = function(urlData) {
    // Assign the retrieved url data to the urls variable
    urls = urlData;

    // Kick off time-interval-spaced requests every [PING_FREQ] seconds
    var pingInterval = setInterval(pingUrlHelper, (PING_FREQ * 1000));
};

// Call getUrls() with the above callback in order to get the URLs and kick
// off the requests
urlsIO.getUrls(cbGetUrlData);

// Because setInterval accepts only a reference to function, not function call
// itself, a helper function is needed to wrap the actual function call
function pingUrlHelper() {
    httping.pingUrls(urls);
}

// Test out retrieval of request error stats

// Path for log files
var logFilePath = './logs/';

// Callback for retrieving request error stats
var cbGetReqErrStats = function(data) {
    // Object for recording the error stats
    var reqStats = {};

    // Iterate over the files returned from fs.readdir looking for files that
    // begin with 'err', then parse the status code out of the file name and
    // add the file to the stats
    for (var i = 0; i < data.length; i++) {
        if (data[i].substr(0, 3) == 'err') {
            // Parse the status code
            var statusCode = data[i].substr(4, 3);
            // If a subobject for the status code exists, then add stats to it
            if (reqStats[statusCode]) {
                reqStats[statusCode].count++;
                reqStats[statusCode].files.push(data[i]);
            // Otherwise, create a subobject for the status code and add stats
            } else {
                reqStats[statusCode] = {};
                reqStats[statusCode].count = 1;
                reqStats[statusCode].files = [data[i]];
            }
        }
    }

    // Iterate over the error stats object and output the counts for each code
    for (var statusCode in reqStats) {
        console.log('Status Code ' + statusCode + ': ' + reqStats[statusCode].count);
    }
}

// Retrieve the request error stats, passing the file path and callback
logIO.getReqErrStats(logFilePath, cbGetReqErrStats);
