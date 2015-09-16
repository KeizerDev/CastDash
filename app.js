var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//routes
var routes = require('./routes/index');
var pleer = require('./routes/pleer');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var scanner = require('chromecast-scanner');
var chromeplayer = require('chromecast-player');

var media = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/ED_1280.mp4';

var player = chromeplayer(chromeCasts);
var currentPlay;


player.launch(media, function(err, p) {
  p.once('playing', function() {
    console.log('playback has started.');
  });
  currentPlay = p;
});


var isPlaying = false;
var volume = 100;
var chromeCasts = [];

io.on('connection', function(socket) {

  io.emit('playState', isPlaying);
  io.emit('volumeState', volume);

  socket.on('searchChromecast', function(data) {
    scanner(function(err, service) {
        if(err){
          console.log(err);
        }else {
          console.log(service);
          chromeCasts = service;
        }
    });

    io.emit('chromecasts', service);
  });

  socket.on('setPlayState', function(data) {
      isPlaying = data;

      if(isPlaying == false) {
        currentPlay.play();
      }else {
        currentPlay.pause();
      }

      io.emit('playState', isPlaying);
  });

  socket.on('setVolume', function(value) {
      volume = value;
      currentPlay.setVolume(2);
      io.emit('volumeState', volume);
  });

});



scanner(function(err, service) {
  if(err){
    console.log(err);
  }else {
    console.log(service);
    chromeCasts = service;
  }
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/pleer/', pleer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//listen on port 3000
server.listen(3000);