// Node.js Module Dependencies
var http = require('http'); // Used to make HTTP requests
var fs = require('fs');     // Used for reading and writing to local system files

// Define constants. These may later be placed in a config file.
const PING_FREQ = 5;                 // Request round frequency in seconds
const LOG_FILE_PATH = './logs/';     // Path to log files
const LOG_FILE_NAME = 'logfile.txt'; // File name for standard log file

// Define set of urls to ping as an array of objects. This will later be put in
// a separate file
var urls;
fs.readFile('./data/urls.json', 'utf8', function(err, data) {
    if (err) throw err;
    urls = JSON.parse(data);
});

// Function to run through and ping all defined urls
function pingUrls() {
    // Don't do anything if urls have not yet been loaded from JSON file
    if (!urls) {
        return;
    }

    // Notify via STDOUT that a ping round is being executed and time of ping round
    var currentTimeReadable = getTime(true);
    var currentTimeCompact = getTime(false);

    console.log(currentTimeReadable + ' - request round executed.');

    // Iterate through the array of objects containing the URLs to ping and
    // send a request for each URL
    for (var i = 0; i < urls.length; i++) {
        var reqMethod = 'HEAD'; // Method of http request to be sent
        // Generate request options
        var options = generateOptions(urls[i].host, urls[i].path, reqMethod);
        // Generate request callback
        var callback = generateCallback(urls[i].name, urls[i].host,
            urls[i].path, reqMethod, currentTimeReadable, currentTimeCompact);
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
function generateCallback(urlName, urlHost, urlPath, method,
                          readableTime, compactTime) {

    return function(res) {
        // Output the response body (web page code)
        var pageData = '';
        var logOutput = '';
        var logFilePath = '';
        var noSpaceName = removeNonAlpha(urlName);

        // The way streaming works in node.js, you must listen for and consume 
        // the response data in order for the response 'end' event to be fired. 
        res.on('data', function(data) {    
            pageData += data;
        });

        // Upon response completion, kick off a follow-up request if needed and
        // log the response info
        res.on('end', function() {
            // If the request method is HEAD, then do a follow-up GET request
            // if the status code was >= 400. In all cases, log the output from
            // the response.
            if (method == 'HEAD') {
                
                // Follow-up request in event of status code >= 400
                if (res.statusCode >= 400) {
                    console.log('Error on HEAD request');
                    // In cases where it is a HEAD request, send to follow-up
                    // full request to get the full page
                    var fullReqOptions = generateOptions(urlHost, urlPath, 'GET');
                    var fullReqCallback = generateCallback(urlName, urlHost,
                            urlPath, 'GET', readableTime, compactTime);
                    var fullReq = http.request(fullReqOptions, fullReqCallback);
                    fullReq.end();
                    console.log('Follow-up request sent');
                }

                // Log request results
                logOutput += readableTime + '\n';
                // Log the response header info
                logOutput += 'Page Name: ' + urlName + '\n';
                logOutput += 'URL: ' + urlHost + urlPath + '\n';
                // logOutput += 'HTTP headers: ' + res.headers + '\n';
                logOutput += 'HTTP status code: ' + res.statusCode + '\n';
                if (pageData) logOutput += pageData.toString() + '\n';
                logOutput += '================================\n';

                // Write request results to a file
                logFilePath = LOG_FILE_PATH + LOG_FILE_NAME;
                fs.appendFile(logFilePath, logOutput, function(err) {
                    if (err) return console.log(err);
                    return null;
                });
            
            // If the request method is GET, this was a follow-up request for 
            // a pull page. Log this in a separate file.
            } else if (method == 'GET') {
                logFilePath = LOG_FILE_PATH + 'err-' + compactTime + '-'
                    + noSpaceName + '.html';
                fs.appendFile(logFilePath, pageData, function(err) {
                    if (err) return console.log(err);
                    return null;
                });
            }
        });
    };
}

// Function to return the current date and time as a string. Passing true for
// the includeSpaces parameter provides a more readable version suitable for
// readable output. Passing false provides a version more suitable for file names.
function getTime(includeSpaces) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    if (includeSpaces) {
        return '' + currentDate.getFullYear()
            + currentMonth
            + currentDate.getDate() + " - "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();
    } else {
        return '' + currentDate.getFullYear()
            + currentMonth
            + currentDate.getDate() + '-'
            + currentDate.getHours()
            + currentDate.getMinutes()
            + currentDate.getSeconds();
    }
}

// Function for replacing non-alphanumeric characters, including any white
// space characters with underscores. This makes the returned string
// suitable for file names.
function removeNonAlpha(text) {
    return text.replace(/\W+/g, "_");
}

// Send a round of requests every [PING_FREQ] seconds
var pingInterval = setInterval(pingUrls, (PING_FREQ * 1000));
