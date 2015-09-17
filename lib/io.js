var io = function(io, socket, data) {

    io.emit('playState', data.isPlaying);
    io.emit('volumeState', data.volume);

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

};

module.exports = io;