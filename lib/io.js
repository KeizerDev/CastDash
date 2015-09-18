var io = function(io, socket, data) {

    //increase the amount of clients connected
    data.clientsConnected++;

    io.emit('playState', data.isPlaying);
    io.emit('volumeState', data.volume);
    io.emit('clientsConnected', data.clientsConnected);

    socket.on('setPlayState', function(socketData) {
        data.isPlaying = socketData;
        io.emit('playState', data.isPlaying);
    });

    socket.on('setVolume', function(value) {
        data.volume = value;
        io.emit('volumeState', data.volume);
    });

    socket.on('playSong', function(songURL) {
        data.songURL = songURL;
        io.emit('newSong', songURL);
    });

    socket.on('disconnect', function() {
        data.clientsConnected--;
        io.emit('clientsConnected', data.clientsConnected);
    });
};

module.exports = io;