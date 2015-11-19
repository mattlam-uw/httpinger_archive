var http = require('http');

http.get({
    host: 'www.washington.edu',
    path: '/research/'
}, function(res) {
    console.log('HTTP headers:', res.headers);
    console.log('HTTP status code:', res.statusCode);
    console.log('HTTP status message:', res.statusMessage);
    var body = '';
    res.on('data', function(data) {
        body += data;
    });
    res.on('end', function() {
        console.log('*** fertig! ***');
    });
});
