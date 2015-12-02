/**
 * Errors model
 *
 * This model provides data around requests that have generated an error. This
 * data is stored in a JavaScript object that is built by scanning and
 * parsing the error log files in the /logs directory. This is a read-only
 * model as the writing is accomplished by adding or removing log files.
 *
 * In the future, this may be replaced with a database-based model.
 */

// Node.js Module Dependencies
var fs = require('fs'); // Used for reading and writing to local system files

// Path for log files
var logFilePath = './logs/';

// Object to store request error stats
var errors = {};

// Callback for retrieving request error stats. This provides the following
// stats on http requests that resulted in a status code >= 400: (1) count
// of requests with this code, and (2) filename for full page response for
// each request
var cbGetReqErrStats = function(data) {

    // Iterate over the files returned from fs.readdir looking for files that
    // begin with 'err', then parse the status code out of the file name and
    // add the file to the stats
    for (var i = 0; i < data.length; i++) {
        if (data[i].substr(0, 3) == 'err') {
            // Parse the status code
            var statusCode = data[i].substr(4, 3);
            // If a subobject for the status code exists, then add stats to it
            if (errors[statusCode]) {
                errors[statusCode].count++;
                errors[statusCode].files.push(data[i]);
                // Otherwise, create a subobject for the status code and add stats
            } else {
                errors[statusCode] = {};
                errors[statusCode].count = 1;
                errors[statusCode].files = [data[i]];
            }
        }
    }

    // console.log(errors);
    // Now that the data has been all read, make it available
    modExport();
    module.exports = errors;
}

// Function reads the logs directory, feeding the filenames retrieved to the
// callback defined above.
function getReqErrStats(dirPath, callback) {
    fs.readdir(dirPath, function(err, data) {
        if (err) return console.log(err);
        callback(data);
    })
}

// Retrieve the request error stats, passing the file path and callback. The
// results will be stored in an object that will be made available via
// module.exports
getReqErrStats(logFilePath, cbGetReqErrStats);

function modExport(){
    module.exports = { 'blah': 'blee' };
};
