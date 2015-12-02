// Node.js Module Dependencies
var express = require('express');
var router = express.Router();

// Model Dependency
var Errors = require('../models/Errors.js');

// Define constants. These may later be placed in a config file.
const LOG_FILE_DIR = './logs/';     // Path to log files

/* GET (retrieve all error data -- provided in one object) */
// NOTE: Keeping it simple for now. I may decide in the future to provide
//       separate GET requests for status codes, associated counts, and
//       associated file names. But for now, just returning the whole object
router.get('/', function(req, res, next) {
    Errors.getReqErrStats(LOG_FILE_DIR, function(errors) {
        res.json(errors);
    });
});

module.exports = router;