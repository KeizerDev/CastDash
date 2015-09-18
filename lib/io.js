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

    socket.on('playSong', function(songID, artist, track) {
        data.songID = songID;
        data.artist = artist;
        data.track = track;
        track = new Audio(songURL);

        io.emit('newSong', songURL, artist, track);
    });

    socket.on('disconnect', function() {
        data.clientsConnected--;
        io.emit('clientsConnected', data.clientsConnected);
    });
};

module.exports = io;