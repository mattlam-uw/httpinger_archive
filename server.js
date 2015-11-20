// Node.js Module Dependencies
var http = require('http');

// Constant representing ping frequency in seconds. This may later be put in a
// config file.
const PING_FREQ = 10;

// Define set of urls to ping as an array of objects. This will later be put in
// a separate file
var urls = [
    { name: 'Research home page', host: 'www.washington.edu', path: '/research/' },
    { name: 'Limited Submissions page', host: 'www.washington.edu', path: '/research/funding/limiterd-submissions/' },
    { name: 'Funding Opportunities page', host: 'www.washington.edu', path: '/research/funding/opportunities/' },
    { name: 'Stats and Rankings page', host: 'www.washington.edu', path: '/research/spotlight/ranking/' }
];

// Function to run through and ping all defined urls
function pingUrls(arrUrls) {
    // Output the time for this batch of ping requests and a divider line to
    // separate the batches
    var currentTime = getTime();
    console.log('================');
    console.log(currentTime);

    // Iterate through the array of objects containing the URLs to ping and
    // send a request for each URL
    for (var i = 0; i < arrUrls.length; i++) {
        // Generate request options
        var options = generateOptions(arrUrls[i].host, arrUrls[i].path);
        // Generate request callback
        var fullUrl = arrUrls[i].host + arrUrls[i].path;
        var callback = generateCallback(arrUrls[i].name, fullUrl)
        // Send the request
        var req = http.request(options, callback);
        req.end();
    }
}

// Function to generate options to be used for http.request
function generateOptions(host, path) {
    return {
        host: host,
        path: path
    };
}

// Function to generate a callback to be used for http.request
function generateCallback(urlName, fullUrl) {
    return function(res) {
        // Output the response body (web page code)
        var pageData = '';
        res.on('data', function(data) {
            // In case of status code 200, do nothing. Because of the way
            // streaming works in node.js, you must listen for and consume
            // that response data in order for the response 'end' event to
            // be fired. See http://stackoverflow.com/questions/23817180/

            // When status code is not 200, then capture the response payload
            if (res.statusCode !== 200) {
                pageData += data;
            }
        });
        // Indicate end of log
        res.on('end', function() {
            // Log the response header info
            console.log('----------------');
            console.log('Page Name:', urlName);
            console.log('URL:', fullUrl);
            // console.log('HTTP headers:', res.headers);
            console.log('HTTP status code:', res.statusCode);
            if (pageData) console.log(pageData.toString());
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

// Wrapper function around the call to send requests for the URLs. This is
// needed for use with setInterval as that method only allows a reference
// to a function rather than a call to the function itself.
function ping() {
    pingUrls(urls);
}

// Send a batch of requests every [PING_FREQ] seconds
var pingInterval = setInterval(ping, (PING_FREQ * 1000));
