var express = require('express');
var router = express.Router();
var http = require('http');

/* GET users listing. */
router.get('/:search', function(req, res) {
  var param = req.params.search;
   var options = {
    host : 'pleer.com',
    path : '/browser-extension/search?q=' + param,
    port : 80,
    method : 'GET'
  };

  var request = http.request(options, function(response){
    var body = "";
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      res.send(JSON.parse(body));
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
  request.end();
});

module.exports = router;
