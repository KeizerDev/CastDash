'use strict';

var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//classes
var ioHandler = require('./lib/io');
var application = require('./lib/application');

//player data
var data = {
  isPlaying : false,
  volume: 100,
  songURL: '',
  clientsConnected: 0
};

// listens for io connection and creates a new ioHandler instance.
io.on('connection', function(socket) {
  //calls io handler where all the packet listeners are defined
  new ioHandler(io, socket, data);
});

// calls the application class where the app is being set up.
new application(app, express);

//listen on port 3000
server.listen(3000);