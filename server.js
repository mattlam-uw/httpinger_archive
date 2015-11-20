var http = require('http');

// Constant representing ping frequency in seconds
const PING_FREQ = 10;

// Define object to contain URLs we want to ping
var urls = [ 
    { name: 'Research home page', host: 'www.washington.edu', path: '/research/' },
    { name: 'Limited Submissions page', host: 'www.washington.edu', path: '/research/funding/limited-submissions/' },
    { name: 'Funding Opportunities page', host: 'www.washington.edu', path: '/research/funding/opportunities/' },
    { name: 'Stats and Rankings page', host: 'www.washington.edu', path: '/research/spotlight/ranking/' }
];

// Function to run through and ping all defined urls
function pingUrls(arrUrls) {
    // Output the time for this batch of ping requests
    var currentTime = getTime();
    console.log(currentTime);
    for (var i = 0; i < arrUrls.length; i++) {
        // generate options
        var options = generateOptions(arrUrls[i].host, arrUrls[i].path);
        // generate callback
        var fullUrl = arrUrls[i].host + arrUrls[i].path;
        var callback = generateCallback(arrUrls[i].name, fullUrl)
        // ping the url
        var req = http.request(options, callback);
        req.end();
    }
}
   
// Generates options to be used for http.request
function generateOptions(host, path) {
    return {
        host: host,
        path: path
    };
}

// Generates a callback to be used for http.request
function generateCallback(urlName, fullUrl) {
    return function(res) {
        // Log the response header info
        console.log('Page Name:', urlName);
        console.log('URL:', fullUrl);
	// console.log('HTTP headers:', res.headers);
        console.log('HTTP status code:', res.statusCode);
        console.log('HTTP status message:', res.statusMessage);
        // Indicate end of log
        res.on('end', function() {
            console.log('*** fertig! ***');
        });
        console.log('----------------');
    }
}

// Gets current time and returns as a string
function getTime() {
    var currentDate = new Date();
    var dateTime = currentDate.getDate() + "/"
                 + currentDate.getHours() + ":"
                 + currentDate.getMinutes() + ":"
                 + currentDate.getSeconds();
    return dateTime;
}

function ping() {
    pingUrls(urls);
}

// Go ahead and ping away . . .
var pingInterval = setInterval(ping, (PING_FREQ * 1000));
