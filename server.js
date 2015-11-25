// Node.js Module Dependencies
var http = require('http'); // Used to make HTTP requests
var fs = require('fs');     // Used for reading and writing to local system files

// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;                 // Request round frequency in seconds
const LOG_FILE_PATH = './logs/';     // Path to log files
const LOG_FILE_NAME = 'logfile.txt'; // File name for standard log file
// File name for log of page text resulting in error
const LOG_ERR_PAGE_FILE_NAME = 'log_err_page_file.txt';

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
        var reqMethod = 'HEAD'; // Method of http request to be sent
        // Generate request options
        var options = generateOptions(urls[i].host, urls[i].path, reqMethod);
        // Generate request callback
        var callback = generateCallback(urls[i].name, urls[i].host,
            urls[i].path, reqMethod);
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
function generateCallback(urlName, urlHost, urlPath, method) {
    return function(res) {
        // Output the response body (web page code)
        var pageData = '';
        var logOutput = '';
        res.on('data', function(data) {
            // The way streaming works in node.js, you must listen for and
            // consume the response data in order for the response 'end' event to
            // be fired. See http://stackoverflow.com/questions/23817180/
            // So it's necessary to listen for the 'data' event even in cases
            // where we will not be doing anything with the data

            // When status code is greater than or equal to 400, then execute
            // a follow-up full request to capture the page text, which may
            // contain useful error code text. The response for the follow-up
            // request will be logged in a separate file.
            if (res.statusCode >= 400) {
                console.log('Found an error');
                // Check for type of request (HEAD only or full GET)
                if (method == 'HEAD') {
                    console.log('Error on HEAD request');
                    // In cases where it is a HEAD request, send to follow-up
                    // full request to get the full page
                    var fullReqOptions = generateOptions(urlHost, urlPath, 'GET');
                    var fullReqCallback = generateCallback(urlName, urlHost,
                            urlPath, 'GET');
                    var fullReq = http.request(fullReqOptions, fullReqCallback);
                    fullReq.end();
                    console.log('Follow-up request sent');
                } else if (method == 'GET') {
                    console.log('Getting data back from the GET request');
                    // IN case where the method is full GET then we want to
                    // capture the page data so it can be logged
                    pageData += data;
                }
            }
            // lf we have page data, then log it
            if (pageData) {
                var logFilePath = LOG_FILE_PATH + LOG_ERR_PAGE_FILE_NAME;
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
            logOutput += 'URL: ' + urlHost + urlPath + '\n';
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
