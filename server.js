// Node.js Module Dependencies
var http = require('http'); // Used to make HTTP requests
var fs = require('fs');     // Used for reading and writing to local system files

// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;                  // Request round frequency in seconds
const LOG_FILE_PATH = './logs/';   // Path to log files
const LOG_FILE_NAME = 'logfile.txt';  // File name for log file

// Define set of urls to ping as an array of objects. This will later be put in
// a separate file
var urls = [
    { name: 'Research home page', host: 'www.washington.edu', path: '/research/' },
    { name: 'Limited Submissions page', host: 'www.washington.edu', path: '/research/funding/limiterd-submissions/' },
    { name: 'Funding Opportunities page', host: 'www.washington.edu', path: '/research/funding/opportunities/' },
    { name: 'Stats and Rankings page', host: 'www.washington.edu', path: '/research/spotlight/ranking/' }
];

// Function to run through and ping all defined urls
function pingUrls() {
    // Notify via STDOUT that a ping round is being executed and time of ping round
    var currentTime = getTime();
    console.log(currentTime + ' - request round executed.');

    // Iterate through the array of objects containing the URLs to ping and
    // send a request for each URL
    for (var i = 0; i < urls.length; i++) {
        // Generate request options
        var options = generateOptions(urls[i].host, urls[i].path, 'HEAD');
        // Generate request callback
        var fullUrl = urls[i].host + urls[i].path;
        var callback = generateCallback(urls[i].name, fullUrl)
        // Send the request
        var req = http.request(options, callback);
        req.end();
    }
}

// Function to generate options to be used for http.request
function generateOptions(host, path, method) {
    return {
        method: method,
        host: host,
        path: path
    };
}

// Function to generate a callback to be used for http.request
function generateCallback(urlName, fullUrl) {
    return function(res) {
        // Output the response body (web page code)
        var pageData = '';
        var logOutput = '';
        res.on('data', function(data) {
            // In case of status code 200, do nothing. Because of the way
            // streaming works in node.js, you must listen for and consume
            // that response data in order for the response 'end' event to
            // be fired. See http://stackoverflow.com/questions/23817180/

            // When status code is not 200, then capture the response payload
            if (res.statusCode !== 200) {
                pageData += data;
            }
            if (pageData) {
                var logFilePath = LOG_FILE_PATH + LOG_FILE_NAME;
                fs.appendFile(logFilePath, pageData, function(err) {
                    if (err) return console.log(err);
                })
            }
            pageData = '';
        });
        // Indicate end of log
        res.on('end', function() {
            var currentTime = getTime();

            logOutput += currentTime + '\n';
            // Log the response header info
            logOutput += 'Page Name: ' + urlName + '\n';
            logOutput += 'URL: ' + fullUrl + '\n';
            // logOutput += 'HTTP headers: ' + res.headers + '\n';
            logOutput += 'HTTP status code: ' + res.statusCode + '\n';
            if (pageData) logOutput += pageData.toString() + '\n';
            logOutput += '================================\n';

            // Write output to a file
            var logFilePath = LOG_FILE_PATH + LOG_FILE_NAME;
            fs.appendFile(logFilePath, logOutput, function(err) {
                if (err) return console.log(err);
            });
        });
    };
}

// Function to return the current date and time as a string
function getTime() {
    var currentDate = new Date();
    var dateTime = (currentDate.getMonth() + 1) + "/"
        + currentDate.getDate() + " - "
        + currentDate.getHours() + ":"
        + currentDate.getMinutes() + ":"
        + currentDate.getSeconds();
    return dateTime;
}

// Send a batch of requests every [PING_FREQ] seconds
var pingInterval = setInterval(pingUrls, (PING_FREQ * 1000));
